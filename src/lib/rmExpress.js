import { client } from './sanity.js';

const ENV_BASE_URL = process.env.RM_EXPRESS_API_URL || 'https://rmexpress.ecotrack.dz/api/v1';
const ENV_API_TOKEN = process.env.RM_EXPRESS_API_TOKEN;

function normalizeBaseUrl(url) {
    const raw = String(url || '').trim();
    if (!raw) return '';
    return raw.endsWith('/') ? raw.slice(0, -1) : raw;
}

async function getSchemaRmExpressConfig() {
    try {
        const settings = await client
            .withConfig({ useCdn: false })
            .fetch(`*[_type == "rmExpressSettings"][0]{apiUrl, apiToken}`);

        return {
            baseUrl: normalizeBaseUrl(settings?.apiUrl),
            apiToken: settings?.apiToken || '',
        };
    } catch (error) {
        console.error('Failed to read rmExpressSettings from Sanity:', error);
        return { baseUrl: '', apiToken: '' };
    }
}

function buildConfigCandidates(schemaConfig) {
    const envConfig = {
        source: 'env',
        baseUrl: normalizeBaseUrl(ENV_BASE_URL),
        apiToken: ENV_API_TOKEN || '',
    };
    const schemaCfg = {
        source: 'schema',
        baseUrl: normalizeBaseUrl(schemaConfig?.baseUrl),
        apiToken: schemaConfig?.apiToken || '',
    };

    const withCredentials = [envConfig, schemaCfg].filter((cfg) => cfg.baseUrl && cfg.apiToken);
    const unique = [];
    const seen = new Set();

    for (const cfg of withCredentials) {
        const key = `${cfg.baseUrl}::${cfg.apiToken}`;
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(cfg);
        }
    }

    return unique;
}

async function sendShipmentWithConfig(orderData, config) {
    const cleanBaseUrl = normalizeBaseUrl(config.baseUrl);
    const apiToken = config.apiToken;

    const productLabel = orderData.productName
        || orderData.items
            ?.map((item) => item.productName || item.name)
            .filter(Boolean)
            .join(', ')
        || orderData.description
        || '';
    const itemsDetailedRemark = (orderData.items || [])
        .map((item, index) => {
            const name = item.productName || item.name || 'N/A';
            const price = item.price ?? 0;
            const quantity = item.quantity ?? 1;
            const color = item.color || 'N/A';
            const size = item.size || 'N/A';
            return `${index + 1}) ${name} | Price:${price} | Qty:${quantity} | Color:${color} | Size:${size}`;
        })
        .join(' || ');
    const fallbackRemark = [
        `ShippingType:${orderData.shippingType || 'N/A'}`,
        `Wilaya:${orderData.wilayaName || orderData.wilaya || 'N/A'}`,
        `Commune:${orderData.commune || 'N/A'}`,
        `ShippingCost:${orderData.shippingCost ?? 'N/A'}`,
        `Items:${itemsDetailedRemark || 'N/A'}`,
    ].join(' | ');
    const orderRemark = orderData.remark || fallbackRemark;

    const wilayaRaw = String(orderData.wilaya || '');
    const wilayaCodeFromInput = String(orderData.wilayaCode || '').trim();
    const wilayaCodeMatch = wilayaRaw.match(/\d+/);
    const wilayaCode = wilayaCodeFromInput || (wilayaCodeMatch ? wilayaCodeMatch[0].padStart(2, '0') : '');
    const normalizedAddress = orderData.address
        || [orderData.commune, orderData.wilayaName || orderData.wilaya].filter(Boolean).join(', ');

    const params = new URLSearchParams({
        reference: orderData.orderId || orderData.reference || '',
        nom_client: orderData.customerName || orderData.name || '',
        telephone: orderData.phone || '',
        telephone_2: orderData.phone2 || '',
        adresse: normalizedAddress,
        commune: orderData.commune || '',
        code_wilaya: wilayaCode,
        montant: orderData.totalPrice || orderData.cod_amount || 0,
        remarque: orderRemark,
        produit: productLabel,
        type: orderData.type || '1',
        stop_desk: orderData.stop_desk || '0',
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const url = `${cleanBaseUrl}/create/order`;

    console.log(`Sending RM Express request to: ${url} (source: ${config.source})`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiToken}`,
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
            signal: controller.signal,
        });

        const rawResponse = await response.text();
        let data;
        try {
            data = rawResponse ? JSON.parse(rawResponse) : {};
        } catch {
            data = { message: rawResponse || 'Unexpected non-JSON response from RM Express' };
        }

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create shipment');
        }

        return {
            success: true,
            trackingNumber: data.tracking_number || data.reference || data.id,
            data,
            source: config.source,
        };
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function createShipment(orderData) {
    try {
        const schemaConfig = await getSchemaRmExpressConfig();
        const configs = buildConfigCandidates(schemaConfig);
        const attemptedSources = configs.map((cfg) => cfg.source);

        if (configs.length === 0) {
            console.warn('No RM Express configuration found - order will be saved without shipment creation');
            return {
                success: false,
                error: 'No RM Express configuration found in env or Sanity settings',
                source: null,
            };
        }

        let lastError = null;
        let lastSource = null;

        for (const config of configs) {
            try {
                return await sendShipmentWithConfig(orderData, config);
            } catch (error) {
                lastError = error;
                lastSource = config.source;
                console.error(`RM Express shipment failed with ${config.source} config:`, error);
                // Continue to next config instead of failing immediately
            }
        }

        // If all configs failed, return failure but don't crash
        return {
            success: false,
            error: lastError?.name === 'AbortError'
                ? 'RM Express API connection timed out'
                : (lastError?.message || 'Failed to create shipment'),
            source: lastSource,
            attemptedSources,
        };
    } catch (error) {
        console.error('RM Express shipment creation error:', error);
        return {
            success: false,
            error: error.name === 'AbortError' ? 'RM Express API connection timed out' : error.message,
            source: null,
        };
    }
}

/**
 * Track a shipment by tracking number
 * @param {string} trackingNumber
 * @returns {Promise<Object>} Tracking status
 */
export async function trackShipment(trackingNumber) {
    try {
        const schemaConfig = await getSchemaRmExpressConfig();
        const configs = buildConfigCandidates(schemaConfig);

        if (configs.length === 0) {
            return {
                success: false,
                error: 'No RM Express configuration found in env or Sanity settings',
            };
        }

        let lastError = null;

        for (const config of configs) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            const url = `${normalizeBaseUrl(config.baseUrl)}/tracking/${trackingNumber}`;

            try {
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${config.apiToken}`,
                    },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error('Tracking information not found');
                }

                const data = await response.json();
                clearTimeout(timeoutId);

                return {
                    success: true,
                    status: data.status,
                    history: data.history,
                };
            } catch (error) {
                clearTimeout(timeoutId);
                lastError = error;
                console.error(`RM Express tracking failed with ${config.source} config:`, error);
            }
        }

        return {
            success: false,
            error: lastError?.name === 'AbortError'
                ? 'RM Express API connection timed out'
                : (lastError?.message || 'Tracking information not found'),
        };
    } catch (error) {
        console.error('RM Express tracking error:', error);
        return {
            success: false,
            error: error.name === 'AbortError' ? 'RM Express API connection timed out' : error.message,
        };
    }
}


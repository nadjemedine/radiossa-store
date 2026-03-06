'use server';

import { client } from '@/lib/sanity';

/**
 * Update product inventory after an order is placed
 * @param {string} productId - Product ID in Sanity
 * @param {Array} items - Array of items with size, color, and quantity
 */
export async function updateProductInventory(productId, items) {
    try {
        // Fetch current product data
        const product = await client.getDocument(productId);

        if (!product) {
            return {
                success: false,
                error: 'Product not found',
            };
        }

        let hasChanges = false;
        const patches = {};

        // Handle variant inventory (Primary model)
        if (product.inventory && Array.isArray(product.inventory)) {
            let updatedInventory = [...product.inventory];
            let inventoryChanged = false;

            for (const item of items) {
                const { selectedSize, selectedColor, quantity } = item;

                // Find matching inventory variant
                const variantIndex = updatedInventory.findIndex(v =>
                    (v.size === selectedSize || (!v.size && selectedSize === "Standard")) &&
                    (!selectedColor || v.color === selectedColor)
                );

                if (variantIndex !== -1) {
                    const variant = updatedInventory[variantIndex];
                    const newStock = Math.max(0, (variant.stock || 0) - (quantity || 1));

                    if (newStock !== variant.stock) {
                        updatedInventory[variantIndex] = {
                            ...variant,
                            stock: newStock,
                        };
                        inventoryChanged = true;
                    }
                }
            }

            if (inventoryChanged) {
                patches.inventory = updatedInventory;
                hasChanges = true;
            }
        }
        // Fallback for simple stock if no inventory array exists (backward compatibility)
        else if (typeof product.stock === 'number') {
            const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const newStock = Math.max(0, product.stock - totalQuantity);

            if (newStock !== product.stock) {
                patches.stock = newStock;
                hasChanges = true;
            }
        }

        // Update Sanity if there were changes
        if (hasChanges) {
            await client.patch(productId)
                .set(patches)
                .commit();

            // Auto-hide logic
            if (product.autoHideOutOfStock) {
                let shouldHide = false;

                if (patches.inventory) {
                    shouldHide = patches.inventory.every(v => (v.stock || 0) <= 0);
                } else if (typeof patches.stock === 'number') {
                    shouldHide = patches.stock <= 0;
                }

                if (shouldHide) {
                    await client.patch(productId).set({ isHidden: true }).commit();
                }
            }

            return {
                success: true,
                hasChanges: true,
            };
        }

        return {
            success: true,
            noChanges: true,
        };
    } catch (error) {
        console.error('Error updating inventory:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}

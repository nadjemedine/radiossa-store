import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
    projectId: 'm3rey5o2',
    dataset: 'production',
    apiVersion: '2026-02-24',
    useCdn: false,
    token: 'skWC2e77rYOlXYrbAMaAIS9dMjfmF1rsjWnamMXTQSLgC0WXRtBwecQzkIADOF0ukFeOC3IZvcvwhkjoTV3spNrthrDHVMaKI1rVbNAsJhbL8XmTeQjn40Ikg8MCdNQfrqwZevyJGVdVJBFXjQtddwWW1gtSpSS70GvgKRgkAveiLRBwsfpy',
});

async function uploadLogo() {
    try {
        const logoPath = path.resolve('public/logo.png');
        if (!fs.existsSync(logoPath)) {
            console.error('Logo file not found at public/logo.png');
            return;
        }

        console.log('Reading logo file...');
        const logoBuffer = fs.readFileSync(logoPath);

        console.log('Uploading image to Sanity...');
        const asset = await client.assets.upload('image', logoBuffer, {
            filename: 'logo.png'
        });

        console.log('Updating settings document...');

        // Find existing settings or create new
        const settings = await client.fetch('*[_type == "settings"][0]');

        if (settings) {
            await client.patch(settings._id)
                .set({
                    logo: {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _id: asset._id
                        }
                    }
                })
                .commit();
            console.log('Settings updated successfully!');
        } else {
            await client.create({
                _type: 'settings',
                siteName: 'Radiossa Shop',
                logo: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _id: asset._id
                    }
                }
            });
            console.log('Settings created successfully!');
        }
    } catch (error) {
        console.error('Error uploading logo:', error);
    }
}

uploadLogo();

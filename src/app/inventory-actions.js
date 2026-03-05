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
        
        if (!product || !product.inventory) {
            return {
                success: false,
                error: 'Product not found or no inventory tracking',
            };
        }

        // Create a mutable copy of the inventory
        let updatedInventory = [...product.inventory];
        let hasChanges = false;

        // Process each item in the order
        for (const item of items) {
            const { selectedSize, selectedColor, quantity } = item;
            
            // Find matching inventory variant
            const variantIndex = updatedInventory.findIndex(v => 
                v.size === selectedSize && 
                (!selectedColor || v.color === selectedColor)
            );

            if (variantIndex !== -1) {
                const variant = updatedInventory[variantIndex];
                
                // Only update if inventory tracking is enabled
                if (variant.trackInventory && !variant.allowBackorder) {
                    const newStock = Math.max(0, variant.stock - quantity);
                    
                    if (newStock !== variant.stock) {
                        updatedInventory[variantIndex] = {
                            ...variant,
                            stock: newStock,
                        };
                        hasChanges = true;
                    }
                }
            }
        }

        // Update Sanity if there were changes
        if (hasChanges) {
            await client.patch(productId)
                .set({ inventory: updatedInventory })
                .commit();

            // Check if all variants are out of stock
            const allOutOfStock = updatedInventory.every(
                v => !v.trackInventory || v.stock <= 0
            );

            if (allOutOfStock && product.autoHideOutOfStock) {
                // Optionally hide the product
                await client.patch(productId)
                    .set({ isHidden: true })
                    .commit();
            }

            return {
                success: true,
                updatedInventory,
                allOutOfStock,
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

const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'm3rey5o2',
    dataset: 'production',
    apiVersion: '2026-02-24',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

async function findAndDelete() {
    try {
        const categories = await client.fetch(`*[_type == "category"]`);
        console.log('Current categories:', categories.map(c => ({ id: c._id, name: c.name })));

        const target = categories.find(c =>
            c.name.toLowerCase() === 'qobes' ||
            c.name.toLowerCase() === 'robes'
        );

        if (target) {
            console.log(`Deleting category: ${target.name} (${target._id})`);
            await client.delete(target._id);
            console.log('Deleted successfully.');
        } else {
            console.log('Category not found.');
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

findAndDelete();

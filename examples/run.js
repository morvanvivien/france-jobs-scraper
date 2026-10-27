// Minimal example: run the france-jobs-scraper Actor and print the results.
// Usage: APIFY_TOKEN=... node run.js   (Node 18 or later, npm install apify-client)
import { ApifyClient } from 'apify-client';

const token = process.env.APIFY_TOKEN;
if (!token) {
    console.error('Set the APIFY_TOKEN environment variable first.');
    process.exit(1);
}

const client = new ApifyClient({ token });

const input = {
    "keywords": "développeur",
    "location": "",
    "sources": [
        "free-work",
        "welcometothejungle",
        "hellowork",
        "meteojob",
        "francetravail",
        "emploi-territorial",
        "choisirleservicepublic",
        "qapa"
    ],
    "publishedWithinDays": 7,
    "remote": "any",
    "maxItems": 100,
    "includeDescriptions": false
};

const run = await client.actor('bibian/france-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();

console.log(`${items.length} results`);
for (const item of items) {
    console.log(`${item.title} | ${item.companyName ?? '-'} | ${item.city ?? item.locationLabel ?? '-'} | ${item.source}`);
}

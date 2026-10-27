"""Minimal example: run the france-jobs-scraper Actor and print the results.

Usage: APIFY_TOKEN=... python run.py   (pip install apify-client)
"""
import os
import sys

from apify_client import ApifyClient

token = os.environ.get("APIFY_TOKEN")
if not token:
    sys.exit("Set the APIFY_TOKEN environment variable first.")

client = ApifyClient(token)

run_input = {
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
        "qapa",
    ],
    "publishedWithinDays": 7,
    "remote": "any",
    "maxItems": 100,
    "includeDescriptions": False,
}

run = client.actor("bibian/france-jobs-scraper").call(run_input=run_input)

count = 0
for item in client.dataset(run.default_dataset_id).iterate_items():
    count += 1
    print(f"{item['title']} | {item.get('companyName')} | {item.get('city') or item.get('locationLabel')} | {item.get('source')}")
print(f"{count} results")

# France Jobs Scraper: 8 French Job Boards in One Schema

> **Run it now, no code: [france-jobs-scraper on the Apify Store](https://apify.com/bibian/france-jobs-scraper)** &nbsp;|&nbsp; $5.00 per 1,000 job postings &nbsp;|&nbsp; no browser, no proxy

France has no single public job API: each board — tech freelance, generalist, public sector — runs its own site with its own format. This guide shows how to get French job postings as clean structured data with a single Apify Actor that scrapes 8 major French job boards in one run and maps every record to one unified schema, from the console or from code.

Searches this page answers: france jobs scraper, french job postings scraper, free-work scraper, welcome to the jungle scraper, france travail scraper, french public sector jobs data.

## What you get

- Job postings from 8 major French boards in one run: [Free-Work](https://www.free-work.com), [Welcome to the Jungle](https://www.welcometothejungle.com), [HelloWork](https://www.hellowork.com), [Meteojob](https://www.meteojob.com), [France Travail](https://candidat.francetravail.fr), [Emploi Territorial](https://www.emploi-territorial.fr), [Choisir le Service Public](https://choisirleservicepublic.gouv.fr) and [Qapa](https://jobs.qapa.fr).
- Every posting mapped to the same fields — `title`, `companyName`, `city`, `region`, `employmentType`, `remote`, `salaryMin`/`salaryMax` — whichever board it came from, so you can compare or merge them without per-site logic.
- Deduplication across all 8 sources, by URL and by (title, company, city).
- Optional full description as plain text.

Export the dataset as JSON, CSV or Excel, or read it through the Apify API. A real sample (five results, no personal data, long text truncated) is in [`sample-output.json`](sample-output.json).

## Output fields

| Field | What it is |
|---|---|
| `id`, `url` | Stable identifier (`<source>:<native id>`) and public link of the posting |
| `title` | Job title as published |
| `companyName`, `companyUrl` | Employer name and page, when shown; `companyName` is `null` with `confidentialCompany: true` when hidden |
| `locationLabel`, `city`, `region`, `postalCode`, `country` | Where the job is based |
| `remote` | `remote`, `hybrid`, `onsite` or `unknown` |
| `employmentType` | `full_time`, `part_time`, `contract`, `freelance`, `internship`, `apprenticeship`, `temporary` or `unknown` |
| `salaryMin`, `salaryMax`, `salaryCurrency`, `salaryPeriod` | Salary range, as numbers, when disclosed |
| `datePosted`, `validThrough` | ISO 8601 publication and expiry dates |
| `description` | Plain text, only when `includeDescriptions` is on; no personal data |
| `experienceLevel`, `industry`, `skills` | As named by the source site |
| `source`, `sourceId` | Host name of the source site and its native id |
| `scrapedAt` | Extraction timestamp, ISO 8601 |

Site-specific fields are kept in addition to these, for example Qapa's `trade` or Choisir le Service Public's `employmentTypeLabel`.

## Use cases

- **Search across the private sector, tech, retail, temp staffing and the public sector in one run**, instead of buying and maintaining 8 separate scrapers.
- **Compare pay and location across boards**: every record shares the same salary, city and employment-type fields, whatever site it came from.
- **Monitor new postings daily**: schedule it with `onlyNew` on and `publishedWithinDays: 1` to get, and pay for, only what is new since the last run.
- **Feed a job alert, a newsletter or a niche board** for a region, trade or sector.

## Input

| Field | What it does |
|---|---|
| `keywords` | Job title, skill or trade, for example `développeur` or `infirmier`. Empty means every posting. |
| `location` | City, department or region, for example `Lyon` or `Bretagne`. Empty means all of France. |
| `sources` | Which of the 8 job boards to query in this run. Defaults to all 8. |
| `publishedWithinDays` | Keep only postings published in the last N days. Use `1` for a daily monitoring run. |
| `remote` | Keep only postings with this remote policy: `any`, `remote`, `hybrid` or `onsite`. |
| `maxItems` | The run stops once this many postings are saved, across all sources combined (default 200). |
| `includeDescriptions` | Add the job description as plain text. |
| `onlyNew` | For scheduled runs: skip postings an earlier run of this same search already delivered. |

Example input:

```json
{
  "keywords": "développeur",
  "sources": ["free-work", "welcometothejungle", "hellowork", "meteojob", "francetravail", "emploi-territorial", "choisirleservicepublic", "qapa"],
  "publishedWithinDays": 7,
  "remote": "any",
  "maxItems": 100,
  "includeDescriptions": false
}
```

## Three ways to use it

### 1. Apify console, no code

1. Open [the Actor page](https://apify.com/bibian/france-jobs-scraper) and click **Try for free** (a free Apify account is enough).
2. Fill in the input form (keywords, sources, filters and the maximum number of results) and click **Start**.
3. When the run finishes, open the **Output** tab, check the table, then **Export** as CSV, Excel or JSON.
4. For a daily alert, open **Schedules**, create a daily schedule for the Actor and, optionally, add an integration that sends new results to Slack, e-mail or Google Sheets.

### 2. Apify API with JavaScript

```bash
npm install apify-client
export APIFY_TOKEN="your token from Apify console, Settings, Integrations"
node examples/run.js
```

```js
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const run = await client.actor('bibian/france-jobs-scraper').call({
    "keywords": "développeur",
    "publishedWithinDays": 7,
    "remote": "any",
    "maxItems": 100,
    "includeDescriptions": false
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();
for (const item of items) {
    console.log(`${item.title} | ${item.companyName} | ${item.city ?? item.locationLabel} | ${item.source}`);
}
```

The complete file is [`examples/run.js`](examples/run.js) (ES module, Node 18 or later).

### 3. Apify API with Python

```bash
pip install apify-client
export APIFY_TOKEN="your token from Apify console, Settings, Integrations"
python examples/run.py
```

```python
import os
from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run = client.actor("bibian/france-jobs-scraper").call(run_input={
    "keywords": "développeur",
    "publishedWithinDays": 7,
    "remote": "any",
    "maxItems": 100,
    "includeDescriptions": False,
})

for item in client.dataset(run.default_dataset_id).iterate_items():
    print(f"{item['title']} | {item.get('companyName')} | {item.get('city') or item.get('locationLabel')} | {item.get('source')}")
```

The complete file is [`examples/run.py`](examples/run.py). Never put your token in the code: read it from the `APIFY_TOKEN` environment variable as above.

## Pricing

Pay per result: **$5.00 per 1,000 job postings**, plus a tiny start fee. You pay only for the results saved to the dataset, deduplicated across all 8 sources. Apify's free plan includes monthly credits, enough to try it on a few hundred results. Prices are those shown on the [Store page](https://apify.com/bibian/france-jobs-scraper) when this guide was written; the Store page is the reference.

## Limits and honest notes

- `employmentType` and `remote` are read from each site's own fields when it has one; when a source carries no such field (most public-sector and staffing boards), they are inferred from the title and description, and left `unknown` rather than guessed when nothing matches.
- Postings are the public ones: anything behind a login is out of scope.
- No personal data: contact details of individuals are stripped from descriptions; only companies and public employers are named.
- This is an unofficial tool, not affiliated with Free-Work, Welcome to the Jungle, HelloWork, Meteojob, France Travail, Emploi Territorial, Choisir le Service Public or Qapa. Check each site's terms and the data protection rules that apply to your use.

## FAQ

**Does it need a browser or a proxy?**  
No. The Actor reads the data directly, so runs are fast and cheap.

**How do I only get new postings every day?**  
Set `publishedWithinDays` to `1` and schedule the Actor once a day. Use `onlyNew` so only postings you have not seen yet are returned, and charged.

**Can I limit the run to one or two boards?**  
Yes, set `sources` to just the ones you want, for example `["francetravail"]` for public-sector-adjacent postings only.

**Can I get the data in Excel or Google Sheets?**  
Yes. Export the dataset as CSV, Excel or JSON from the Apify console, or connect the Apify Google Sheets integration.

## Try it

**[Open france-jobs-scraper on the Apify Store](https://apify.com/bibian/france-jobs-scraper)**

The code in `examples/` is released under the MIT license (see [LICENSE](LICENSE)). The data belongs to its original publishers.

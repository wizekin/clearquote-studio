# Wizekin portfolio

Three new browser tools live under `/craftcost/`, `/stocksimple/`, and `/lessonsheet/`. The existing ClearQuote product is preserved. Source and static assets use the existing shared `public/` directory and Firebase workflow; no new service or billing plan is required by the code.

## Free vs offline editions

The free apps calculate or generate a single result. Separate offline editions add saved work and reusable exports. Paid packages and their source stay outside this public repository. Never commit those packages or store secrets here.

`public/studio-assets/store-config.js` holds the public Gumroad listing URLs. CraftCost, StockSimple and LessonSheet were confirmed published with delivery files on 24 October 2026 and their links activated. New product links are activated after their actual listings and uploaded files are verified. A published listing and owner download check do not establish a real paid sale or successful payout.

## Formulas and examples

CraftCost: batch = materials × (1 + allowance/100) + hours × rate + batch overhead + packaging × sellable units. Price = (batch / units + fixed fee) / (1 − margin/100 − percentage fee/100). All money inputs use one currency. Example: 73 batch cost, 10 items, 30% margin, 5% fee and 0.30 fixed fee → 11.69230769 per item.

StockSimple: position = on hand + on order − allocated. Reorder point = daily demand × lead days + safety stock. Target = daily demand × (lead + extra coverage days) + safety stock. At/below reorder point, suggested order = max(0, ceil(target − position)); otherwise zero. Example: demand 4, lead 7, safety 10, on hand 25, incoming 10, allocated 5, extra days 7 → position 30, point 38, target 66, order 36.

LessonSheet: seeded deterministic arithmetic. Subtraction is nonnegative. Division is exact; divisor and quotient follow the chosen range, while dividend can be larger. Zero divisors are excluded. Public tool 1–48 problems; offline edition up to six variants. Repeats can occur. No curriculum or assessment certification.

## Operations

Run `node --test tests/models.test.cjs` and `python3 scripts/check_portfolio.py` before deployment. The daily health workflow checks public availability and shared calculations; GitHub may suspend schedules on inactive public repositories. It does not fix bugs, guarantee traffic, read Firebase quotas, handle customers, or create sales. No paid runner, build artifact storage, external AI API, ad network or database is added.

## 24 October additions

FrameMint (`/framemint/`), StudyMap (`/studymap/`) and LabelLeaf (`/labelleaf/`) each add a working free tool, distinct light design, practical guide and separate offline download. The homepage now links seven products. New calculations and exports use `collection-models.js`; run `node --test tests/collection.test.cjs` as well. Both existing GitHub workflows include these tests, and daily availability checks include all three URLs.

The new paid workspace and batch code, standalone HTML applications, and ZIP packages are held outside this public repository. The public site includes only the free-tool runtime. Store checkout and digital delivery use Gumroad; no payment secrets or purchaser records are stored in Firebase.

The business design excludes interest calculations, gambling, prohibited product examples, fabricated testimonials and uncontrolled advertisements. This is a conservative design boundary, not scholarly certification of every commercial arrangement.

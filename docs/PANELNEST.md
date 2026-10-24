# PanelNest 1.0

Public URL: https://wizekin.web.app/panelnest/

Audience: small woodworking workshops and makers planning rectangular sheet cuts. This is a local geometric planner, not CAM software or an optimum solver.

## Public edition

- Up to 200 pieces and 100 part rows, one material/thickness and unlimited identical sheets.
- Twelve deterministic guillotine packing candidates, explicit kerf, four-sided trim and opt-in 90° rotation.
- Sheet diagrams, piece inspection, usable offcut rectangles and complete area accounting.
- Input CSV, job JSON backup/restore, placed/unplaced part CSV, SVG and all-sheet printing.
- mm/decimal inches with input conversion; one unit per job. Optional sheet-only cost estimate.
- No API, database, account, SDK or recurring software subscription.

Offline Workshop is a separate downloadable commercial package: 600 pieces, 50 saved jobs, JSON library backup/merge restore, stock-size comparisons, printable part labels and per-sheet DXF outlines. Its implementation and delivery ZIP must remain outside `public/` and the public repository. The public tool never needs a purchase.

## Objective and limits

Select fewer sheets, then the largest remaining free rectangle, then shorter internal cut references. Six part sort orders times two placement strategies. No guarantee of optimality. Grain follows stock width; locked parts preserve orientation. Kerf gaps are reserved in both axes. Residual slivers narrower than the blade are consumed as blade loss.

Every placed part belongs to a distinct guillotine leaf. Cuts are enumerated in parent-before-child order, after perimeter trim. Coordinates use original sheet top-left; blade loss extends right/down. A safe machine-specific cutting sequence, clamp clearance and stock defects still need review.

Stock width/height: 0.01–100000 mm or 0.01–4000 in. Quantities are positive integers. Kerf and trim cannot exceed half the short stock side; trim must leave a positive rectangle. All numbers must be finite. Costs are optional, nonnegative, at most 10000000 in one user-selected currency. Fraction input syntax is unsupported. No irregular shapes, edge banding, defect maps, CNC instructions or existing-offcut inventory.

## Privacy and truthful selling

Calculations run locally. Public app does not autosave inputs. JSON backups are user-initiated downloads. Hosting still has ordinary access logs. No ad network, tracking SDK, fake testimonials, interest, gambling or income promises. Conservative lawful-use license for the downloadable software; no scholarly certification claimed.

## Validation

`node --test tests/models.test.cjs tests/collection.test.cjs tests/panelnest.test.cjs`

`python3 scripts/check_portfolio.py`

Known answers: four 50×50 pieces exactly fit 100×100 stock at zero kerf; at 3 kerf they require four sheets. Four 48×48 pieces at 4 kerf fit one 100×100 sheet, leaving 784 square units of blade loss. Randomized tests check bounds, pairwise blade spacing, grain, count conservation and area conservation. Browser/export and offline package validation are documented in the owner release report.

## Maintenance

The existing GitHub Firebase deployment and daily availability workflow cover this product. Scheduled checks detect problems but do not repair them. GitHub may suspend inactive public-repository schedules. No paid monitoring service or billing upgrade has been added. Checkout and file delivery use the existing merchant account and require an accepted sale; payouts depend on its eligibility checks.

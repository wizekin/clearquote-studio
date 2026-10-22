# Three small browser tools, three different correctness problems

A calculator can look polished and still be wrong. An inventory estimate can use the right formula against the wrong stock figure. A worksheet can print a neat answer key that belongs to a different set of questions.

Wizekin's three new browser tools made these differences concrete. Here are the implementation decisions behind a handmade pricing calculator, an inventory reorder calculator, and an arithmetic worksheet generator.

## 1. State what a percentage is a percentage of

For handmade pricing, “add 30% profit” is ambiguous. A markup is measured against cost. A margin is measured against selling price.

For a unit cost of 7.30:

```js
const markupPrice = 7.30 * 1.30;       // 9.49
const marginPrice = 7.30 / (1 - 0.30); // about 10.43
```

Selling fees introduce another dependency on the final price. If the channel takes 5% of the selling price plus 0.30 per item, and the target margin is 30%, solve for price:

```js
function sellingPrice(unitCost, fixedFee, margin, feeRate) {
  const denominator = 1 - margin - feeRate;
  if (denominator <= 0) {
    throw new Error('Margin plus percentage fee must be below 100%.');
  }
  return (unitCost + fixedFee) / denominator;
}

sellingPrice(7.30, 0.30, 0.30, 0.05); // 11.692307...
```

The function takes fractions, not whole percentage numbers. The UI accepts 30 and 5, then converts them. That boundary needs to be explicit.

The fixed-fee assumption matters too: one item per transaction. A multi-item order needs its order-level fee allocated across the items. Shipping, tax, failed output, and material allowance also need named assumptions rather than hidden defaults.

The free [CraftCost Studio](https://wizekin.web.app/craftcost/) includes a complete batch example and separates labor cost from the profit remaining after the entered costs.

## 2. Use the right stock figure

A simple reorder point is average daily demand multiplied by supplier lead time, plus safety stock. But comparing it only with stock on the shelf can ignore an incoming shipment or reserved units.

```js
const reorderPoint = dailyDemand * leadDays + safetyStock;
const inventoryPosition = onHand + onOrder - allocated;
const shouldReorder = inventoryPosition <= reorderPoint;
```

With demand of four units per day, seven lead days, and ten safety units, the reorder point is 38. If there are 25 units on hand, ten incoming, and five allocated, position is 30.

An order quantity needs another decision: the target coverage. Seven extra days gives a target of `4 * (7 + 7) + 10`, or 66. This model suggests 36 units when the reorder condition is met.

The useful tests include equality at the reorder threshold, zero demand, and allocations exceeding on-hand stock. Zero demand should produce an explicit “undefined” stock-cover result, not an infinite-looking number that reads like a recommendation.

[StockSimple Studio](https://wizekin.web.app/stocksimple/) exposes each assumption. It is a planning calculator, not a demand forecast or an accounting valuation service.

## 3. Generate the question and answer together

For exact-division practice, rejection-sampling random dividends until they happen to divide evenly is unnecessary. Choose a nonzero divisor and a quotient, then construct the dividend:

```js
const divisor = 8;
const quotient = 10;
const dividend = divisor * quotient; // 80
const question = { dividend, divisor, answer: quotient };
```

The range now describes divisor and quotient. The dividend can be larger, which the UI needs to explain.

Each question object contains its answer. Both the worksheet and the answer page render from the same objects. A seeded random generator makes a sheet reproducible from its settings, while changing the seed produces another sequence. Repeated questions can still occur; deterministic does not mean unique.

[LessonSheet Studio](https://wizekin.web.app/lessonsheet/) uses this approach for printable arithmetic practice and separate answer pages. It does not collect student records or claim curriculum certification.

## Keep the calculations independent of the page

All three tools put calculation functions in a shared module that Node can test without loading a browser. Useful assertions check identities: the calculated craft profit has the intended margin; inventory position reconciles; every exact-division question satisfies `dividend === divisor * answer`.

Browser testing then covers the things those assertions cannot: reset controls, labels, saved-state behavior, and narrow-screen layouts. In this release, browser testing caught a reset control shadowing `form.reset`, and a note field that was accidentally required. Passing arithmetic tests did not catch either issue.

Maker disclosure: these are Wizekin tools, developed with AI assistance. The public tools are free. Separate offline workspace editions have been prepared, but their paid listings are not live at publication time. There are no traffic, income, or maintenance guarantees.

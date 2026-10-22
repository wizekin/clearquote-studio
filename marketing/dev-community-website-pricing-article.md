# How I Break Down a Freelance Website Quote Before Naming a Price

It's surprisingly easy to quote a freelance website by looking at its page count and multiplying by a number you found online. The problem: two five-page websites can represent very different amounts of work.

A brochure site with client-provided copy isn't the same project as a site with custom forms, integrations, content migration and an uncertain approval process.

A better starting point is to **estimate the work you actually intend to deliver** and put the assumptions in writing.

## 1. Turn the vague request into a scope

Before naming a price, write down what "a website" actually means.

For a small brochure website, that might include:

- Five responsive pages with agreed layouts.
- The client supplies final copy and images.
- One contact form with basic validation.
- Testing in a small, documented set of target browsers.
- Two rounds of revisions on the approved design.
- Launch to an agreed hosting environment.

Then write down what's **not** included: logo design, copywriting, monthly maintenance, paid plugins and new pages after scope approval.

This is not needless paperwork. It is how you distinguish an estimate for specific work from a promise to do anything a client later imagines.

## 2. Estimate hours, not just pages

Here's an illustrative task estimate:

| Work | Hours |
| --- | ---: |
| Five pages, 3 hours per page | 15 |
| Discovery and project setup | 4 |
| Testing and launch | 3 |
| Expected revision work | 3 |
| **Estimated total** | **25** |

The 25 hours are an example, not a standard workload. A developer using reusable components may take less time. A custom design with complex interactions may take much longer.

Choose an internal hourly planning rate that covers your earning goals and real business costs. For this example only, use **$45/hour**.

Labor estimate: **25 × $45 = $1,125**.

## 3. Separate direct costs from the price of your time

Suppose this project also needs $75 in project-specific expenses.

Now the base estimate is:

- Labor: $1,125
- Direct expenses: $75
- **Base: $1,200**

If you add a 10% contingency to address foreseeable estimation uncertainty, that's another $120, bringing the illustrative total to **$1,320 before any applicable taxes**.

A contingency isn't guaranteed profit, and it shouldn't silently substitute for a clear scope. Your agreement should explain what you're actually charging and delivering.

## 4. Make the payment terms concrete

An estimated project price isn't yet a usable quote.

Say you agree on a **30% upfront deposit**:

- Total project price: $1,320
- Deposit on acceptance: $396
- Remaining balance: $924

The deposit is **part of the $1,320 total**. It isn't a surcharge. Also spell out when the balance becomes due and what happens if the project is delayed or canceled.

A one-line quote such as "website — $1,320" leaves too many questions unanswered.

## 5. Write a change-request rule before you need one

Imagine the project is approved and the client asks for two additional pages.

Instead of treating the new pages as automatically included, use a simple process:

1. Describe the requested change.
2. Estimate the additional time, cost and schedule impact.
3. Ask for agreement on the change.
4. Begin the extra work after approval.

This is easier for both parties when the original scope specified five pages and a finite number of revision rounds.

## 6. A tiny calculator in JavaScript

The arithmetic can be expressed as a pure function:

```js
function estimateWebsite({
  pages, hoursPerPage, setupHours, testingHours,
  revisionHours, hourlyRate, expenses,
  contingencyPct, depositPct
}) {
  const hours =
    pages * hoursPerPage + setupHours + testingHours + revisionHours;
  const labor = hours * hourlyRate;
  const base = labor + expenses;
  const total = base * (1 + contingencyPct / 100);
  const deposit = total * depositPct / 100;

  return { hours, labor, total, deposit, balance: total - deposit };
}

// Illustrative result:
// 25 hours, $1,125 labor, $1,320 total,
// $396 deposit, $924 remaining.
```

In a real application, also validate every input, handle currency formatting and distinguish fixed fees from percentages. Taxes, if applicable, need to be treated according to the actual agreement and local requirements.

## 7. Before you send the quote

I would check these questions:

- Can the client verify what's included and excluded?
- Are the assumptions about content, access and approvals clear?
- Have you included testing, meetings and revision time?
- Is the change-request process explicit?
- Does the payment schedule describe the full agreed price?
- Have you considered whether an hourly agreement with a budget cap would suit uncertain work better?

If you want to experiment with your own assumptions, I built a **[free website project pricing calculator](https://wizekin.web.app/clearquote/guides/website-project-pricing-calculator.html)**. It estimates hours, labor, expenses, contingency, taxes if applicable and deposits in the browser without signup.

**Disclosure:** I'm the maker of ClearQuote Studio, which hosts the free calculator and an optional paid quote/invoice toolkit. This post is educational, and the rates are illustrative—not a claim about typical web-development prices.

**Question for other freelancers:** Which part of scoping a website most often causes you to underestimate the work?

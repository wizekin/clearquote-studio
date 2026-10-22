# ClearQuote Studio — public marketing website

Source for the free freelance pricing calculator, educational guides, and the one-time downloadable ClearQuote Studio toolkit.

- **Source branch:** `clearquote-studio-site` in https://github.com/wizekin/wizekin
- **Live Gumroad listing:** https://wizekin.gumroad.com/l/wnmrl
- **Verified Gumroad price on 2026-10-21:** $3 introductory one-time purchase
- **Hosting:** GitHub contains the source code; the public marketing website is not deployed until a commercial-compatible hosting provider is configured.
- **Hosting recommendation:** Cloudflare Pages free plan, or a paid Vercel plan (Vercel Hobby is noncommercial; GitHub Pages is not suitable for an e-commerce storefront).
- **Build system:** none; static `index.html`, `assets/store-config.js` and `guides/` pages.
- **Sales attribution:** purchase links include `utm_source=clearquote_site&utm_medium=website&utm_campaign=launch`; this is not an automatic website visitor counter.
- **Measurement:** use real host analytics for visits and Gumroad's transaction dashboard/API for purchases. Do not compute conversion rates until traffic and sales are both available.

## Product integrity / privacy

The marketing site does not contain the paid ClearQuote Studio ZIP. Checkout is handled by Gumroad. No card details, customer lists, cookies, analytics vendor IDs, account credentials or access tokens should be committed to this repository.

## Launch checklist

1. Confirm seller identity, payout method and support contact in Gumroad Settings.
2. Replace the seller-facing upload ZIP name with `ClearQuote_Studio_v1.1.zip` on Gumroad if not already replaced; leave the paid files private.
3. Deploy the public website on an authorized commercial-compatible host.
4. Visit the published site, run the free calculator, open all guide links and test that Buy goes to the correct $3 Gumroad checkout.
5. Publish educational posts only in communities that allow relevant product links; track visits and sales weekly.

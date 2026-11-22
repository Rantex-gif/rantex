# RANTEX Monetization Setup (V1)

The site is a static HTML project hosted on Cloudflare Pages from GitHub. The monetization UI is present, but payment, affiliate and ad services remain inactive until you add your own approved account details.

## 1. Deploy the latest version

Cloudflare Pages is connected to GitHub. A commit to the production branch `main` triggers a new deployment. In Cloudflare, open Workers & Pages > rantex > Deployments and wait for the newest deployment to show Success.

## 2. Edit the configuration

Open `public/index.html` in GitHub and find:

```js
const RANTEX_CONFIG = {
  premiumCheckoutUrl: "",
  membershipCheckoutUrl: "",
  affiliateLinks: {
    phoneAccessories: "",
    gamingAccessories: "",
    monitors: ""
  },
  adsense: {
    approved: false,
    publisherId: "",
    adSlotId: ""
  },
  googleAnalyticsId: ""
};
```

Only enter public URLs and IDs here. Never put passwords, secret API keys, private tokens, or payment-provider secret keys in a public HTML file.

## 3. Affiliate links

1. Apply to Amazon Associates India or another legitimate affiliate programme.
2. Wait for approval and read its current terms.
3. Create relevant product links for products you have genuinely selected.
4. Paste the full affiliate URLs into the matching fields: `phoneAccessories`, `gamingAccessories`, or `monitors`.
5. Keep the affiliate disclosure visible and close to the recommendations.
6. The affiliate recommendation button opens the first configured HTTPS affiliate URL.

Do not click your own affiliate links or ask people to make artificial purchases.

## 4. AdSense

1. Apply at https://www.google.com/adsense/start/ using the site you control.
2. Publish original, useful content and complete the site's privacy/contact information.
3. Wait for Google's review and approval.
4. In AdSense, create a display ad unit and copy the publisher ID (format `ca-pub-...`) and ad slot ID.
5. Set `approved: true`, then paste the publisher ID and numeric ad slot ID into the configuration.
6. Commit the change and verify the new deployment.

The ad slot stays a placeholder until approval and valid IDs are entered. Never click your own ads or encourage invalid clicks. AdSense eligibility requires the publisher to be at least 18; if under 18, a parent/guardian must own and manage the AdSense account in accordance with Google's rules.

## 5. Premium wallpaper pack and membership

1. Prepare an original/licensed pack and a clear description of file formats, resolution and delivery.
2. Create a secure payment link with a payment provider available to you (for example, a verified Razorpay account, subject to its onboarding/eligibility rules).
3. Set a clear price, what the buyer receives, delivery timeline, support contact, cancellation/refund terms and applicable tax information.
4. Paste the payment link into `premiumCheckoutUrl` or `membershipCheckoutUrl`.
5. Test the complete customer journey before announcing sales.

Important: A static payment link alone does not automatically deliver a downloadable file or manage recurring subscriptions. For membership, confirm that the payment provider's link actually supports recurring payments; otherwise use a proper subscription checkout. Do not accept money until fulfilment and refund/support processes are ready.

## 6. Analytics

Create a Google Analytics 4 web data stream, copy the Measurement ID (format `G-...`) and paste it into `googleAnalyticsId`. Publish, then verify events in Analytics Realtime. Respect applicable privacy and consent requirements.

## 7. Site pages

The following starter pages are included:
- `/privacy.html`
- `/terms.html`
- `/contact.html`
- `/disclosure.html`

The contact page deliberately tells the owner to add a real monitored support email. Update these policy pages to reflect your actual data practices, contact details, products, delivery and refund rules before launch. These starter texts are not legal advice.

## 8. Cloudflare Pages settings

This repository serves the site from the `public` folder. Keep the Cloudflare Pages output directory set to `public`, with no build command for this plain HTML project. The root directory should remain the repository root.

## Useful official resources

- Cloudflare Pages Git integration: https://developers.cloudflare.com/pages/configuration/git-integration/
- Google AdSense eligibility: https://support.google.com/adsense/answer/9724
- Amazon India Associates: https://affiliate-program.amazon.in/
- Razorpay Payment Links: https://razorpay.com/docs/payments/payment-links/
- Google Analytics: https://analytics.google.com/

## Current status

- Monetization sections and placeholder ad area: added.
- Affiliate link configuration: added; inactive until URLs are entered.
- AdSense loader: conditional; inactive until approved and IDs are entered.
- Premium/membership checkout buttons: ready for payment URLs, but no checkout is configured.
- AI image generation: not connected by this monetization update.

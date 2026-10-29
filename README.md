# onebigHUB — Prototype

**Live:** https://onebighub.vercel.app · **All pages:** https://onebighub.vercel.app/pages

onebigHUB is a Bay Area events, discounts, connections, employment and notifications platform —
an innovative, results-based marketing and revenue-sharing system (*Discover • Connect • Earn*).
This repository is the working prototype used to review page designs and flows before
the production build.

*Renamed Oct 26, 2026 from calendarGold (calendargold.vercel.app, which redirects here) to onebigHUB, matching Cesar's onebigHUB.com domain.*

## What's built

| Section | Pages |
|---|---|
| **One Big Calendar** | Home (`/`): Bay Area county map, 4-step filters (Event Types, Dates incl. custom range, Costs, Regions, Categories), Filter Sets, Premier / Regular listings, selection + Next Step |
| **Event Details** | `/event/[id]`: date formats A–D, Public/Private, Google map, QR code, tickets → cart |
| **Create Event** | `/submit`: Regular or Premier listing with advertising budget |
| **My Calendar Digest** | `/my-calendar`: selected events, attendance status, Google Calendar |
| **Discount / Gift Certificates** | `/discounts`, `/discounts/[id]`, `/discounts/submit` |
| **Connections** (was Organizations) | `/connections` (digest: # Members, Annual Dues, My Membership Status filters), `/connections/[id]`, `/connections/[id]/members`, `/connections/submit` |
| **Employment Listings** | `/employment`, `/employment/submit` |
| **Notifications** | `/notifications` (Browse, My Notifications, Create Business Notification) |
| **Earn with Advertising** | `/advertising` hub, `/advertising/calculate` (views vs. clicks side by side, D = A × B × C), rate pages `/advertising/listings`, `/expos`, `/dinners`, `/workshops`. All rates live in `app/lib/adRates.js` |
| **Earn / Invite & Refer** | `/refer`: referral QR code + link, 5% / 3% / 2% revenue share |
| **Shopping Cart** | `/cart`: tickets, certificates and listings in one cart |
| **Account** | `/login` (sign up / log in), `/dashboards`, `/profile` |
| **Info** | `/info`: About, Contact, Legend Icons, color code, site index |

**Oct 28 update** (Figma Rev 261028 + Oct 27 meeting): colored hub logo and Tarek's colorized icons (`public/icons/`), 8 hub tiles in a 4 × 2 grid (selected tile = gold with bold burgundy text), Memberships off the main hub, State pull-down (California default), one referral category at a time, rates $0.20/click and $0.75/ticket, bright yellow *Connect with me !* button in every page footer, © 2027.

**Design conventions** (from the Figma reviews): page template with the 4-section icon row;
color code — yellow = under construction, gray = edit / input, white = output;
one shared icon set with hover tooltips (`app/components/Icons.js`).

## Prototype limits (next phase)

- **No shared database yet.** Listings posted from a browser stay in that browser; the
  "Send my … to Masoud" buttons export them so they can be added for everyone.
- **Payments / checkout on hold** — cart, tickets, Premier budgets and referral payouts
  are shown but not charged.
- **Not yet built:** email/SMS notification delivery, image uploads, location detection,
  real accounts.

## Run locally

```
npm install
npm run dev
```

Then open http://localhost:3000.

**Stack:** Next.js 14 (App Router), React 18, plain CSS (`app/globals.css`).
Sample data: `data/events.json`, `app/lib/jobs.js`, `app/lib/discounts.js`, `app/lib/organizations.js`.

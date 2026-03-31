# Confirm Booking Form

## Overview
Standalone booking confirmation form that replaces the WordPress form at `guidedcargo.com/confirm/`. When a customer confirms their booking, it triggers an N8N workflow that moves the RFQ item to the Master Shipments board in Monday.com.

**Repo:** https://github.com/bysamb/booking-confirm-form
**Live:** https://booking-confirm-form.vercel.app
**N8N Workflow:** "Shipping RFQ Accepted"

## What's Built

### Confirm Form (Vercel)
- URL: `/confirm/?email=...&quote=INQ-XXXXX-XXXX`
- Shows inquiry number, pre-filled email(s) with support for multiple addresses, passive confirmation text
- On submit → POST `{emails, quote}` to N8N webhook via `/api/confirm-booking`
- Success screen: "Booking Confirmed — check your email for next steps"
- Styled to match the main booking-confirmation-app

### Tracking Maintenance Page (Vercel)
- **Repo:** https://github.com/bysamb/guided-tracking
- Shows maintenance message with contact email
- Temporary until tracking portal is rebuilt

### Domain Routing (Cloudflare Worker)
- **Project:** `/Users/sam/Projects/guidedcargo-router`
- Worker routes `guidedcargo.com/*` traffic by path:
  - `/confirm/*` → `booking-confirm-form.vercel.app`
  - `/booking/*` → `go-confirmation.vercel.app`
  - `/tracking/*` → `guided-tracking.vercel.app`
  - `/` (default) → `guided-tracking.vercel.app`
- Uses cookie-based routing for asset requests

### N8N Workflow ("Shipping RFQ Accepted")

**Happy path (valid quote):**
1. **Webhook** receives `{emails, quote}`
2. **Lookup RFQ** finds item by quote number (column `link`) on RFQ board `1219132606` (Always Output Data enabled)
3. **Check Quote Status** — determines: `valid`, `expired`, or `not_found`
4. **Route by Status** (Switch node) — branches to appropriate path

**Valid quote path:**
5. **Change status** sets RFQ status to "Accepted"
6. **Build Contact Lookup** → **Fetch Contact IDs** — fetches linked contact IDs from Contacts column (`board_relation_mm1st4qz`)
7. **Build Query** → **Move to Master Shipments** — moves item to board `18397923991`, group "Pending"
8. **Build Update Query** → **Update Mapped Fields** — writes mapped columns using labels (not IDs) for dropdowns:
   - Quote Number, Quoted Price, Shipping Method, Incoterm, Transit Time, Duty Terms, Quote Validity
   - Customer/Contacts (board relation), Deal/Lead link
   - Sales Rep → Sales Owner
   - Assigns Shipment Managers: user IDs `100359742` and `17551977`
   - Sets Service Package, Delivery Handling, PL Obtained From, CI Obtained From to "PENDING"
9. **Build Email Lookup** → **Fetch Contact Emails** — fetches emails from contact items
10. **Build Recipient List** — deduplicates form emails + contact emails
11. **Build Email** → **Send Email via Missive** — sends booking confirmation email with shipment details and booking link (`guidedcargo.com/booking/{itemId}`), assigned to team, from `track-trace@guidedimports.com`

**Expired quote path:**
5. **Build Expired Alert** → **Send Expired Alert** — creates Missive post (`POST /v1/posts`) in sales team inbox (`8bc6e0fc-d6a3-4e7e-a1d6-745ceb333837`) with quote details, customer emails, and sales rep info

**Quote not found path:**
5. **Build Not Found Alert** → **Send Not Found Alert** — creates Missive post in sales team inbox with quote number and customer emails

## Completed

- [x] Confirm form: multiple emails
- [x] Domain setup: `guidedcargo.com` routing via Cloudflare Worker
- [x] Tracking maintenance page
- [x] N8N: Expired quote logic
- [x] N8N: Quote not found logic

## Backlog

- [ ] Monday.com: Merge duplicate Transit Time columns — `Transit Time` (`text_mm1mcq52`) and `Quoted Transit Time` (`text_mm0hznww`) — likely keep Quoted Transit Time, needs confirmation

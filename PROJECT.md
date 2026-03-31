# Confirm Booking Form

## Overview
Standalone booking confirmation form that replaces the WordPress form at `guidedcargo.com/confirm/`. When a customer confirms their booking, it triggers an N8N workflow that moves the RFQ item to the Master Shipments board in Monday.com.

**Repo:** https://github.com/bysamb/booking-confirm-form
**Live:** https://booking-confirm-form.vercel.app
**N8N Workflow:** "Shipping RFQ Accepted"

## What's Built

### Confirm Form (Vercel)
- URL: `/confirm/?email=...&quote=INQ-XXXXX-XXXX`
- Shows inquiry number, pre-filled email, 3 consent checkboxes (T&Cs, extra charges, payment terms)
- On submit → POST `{email, quote}` to N8N webhook via `/api/confirm-booking`
- Success screen: "Booking Confirmed — check your email for next steps"
- Styled to match the main booking-confirmation-app

### N8N Workflow ("Shipping RFQ Accepted")
1. **Webhook** receives `{email, quote}`
2. **Lookup RFQ** finds item by quote number (column `link`) on RFQ board `1219132606`
3. **Change status** sets RFQ status to "Accepted"
4. **Build Contact Lookup** → **Fetch Contact IDs** — fetches linked contact item IDs from Contacts column (`board_relation_mm1st4qz`) via Monday API
5. **Build Query** (Code node) constructs move mutation
6. **Move to Master Shipments** moves item to board `18397923991`, group "Pending" (`group_title`)
7. **Build Update Query** (Code node) constructs field mapping mutation using labels (not IDs) for dropdowns
8. **Update Mapped Fields** writes mapped columns:
   - Quote Number, Quoted Price, Shipping Method, Incoterm, Transit Time, Duty Terms, Quote Validity
   - Customer/Contacts (board relation)
   - Sales Rep → Sales Owner
   - Assigns Shipment Managers: user IDs `100359742` and `17551977`
   - Sets Service Package, Delivery Handling, PL Obtained From, CI Obtained From to "PENDING"
9. **Build Email Lookup** → **Fetch Contact Emails** — fetches email addresses from contact items (`email_mkzsfm4h`)
10. **Build Recipient List** — deduplicates form email + contact emails into a single recipient list
11. **Build Email** — constructs Missive draft with booking details (inquiry, mode, price, transit, duty terms, validity date) and booking link (`guidedcargo.com/booking/{itemId}`)
12. **Send Email via Missive** — POST to `/v1/drafts` with `send: true`, assigned to team `31227c4a-a94e-468d-ae19-37a058cf3102`, from `track-trace@guidedimports.com`

## Step A — Finalize (In Progress)

- [ ] **Confirm form: multiple emails** — allow customer to input multiple email addresses in the form
- [ ] **Domain setup: guidedcargo.com/confirm/** — configure Vercel custom domain for the confirm form
- [ ] **Domain setup: guidedcargo.com tracking** — set up a Vercel maintenance page for tracking portal ("Tracking portal is undergoing maintenance, please check back by end of week")
- [ ] N8N: Add logic for expired quotes (check Quote Validity date before processing)
- [ ] N8N: Add logic for when the quote number can't be found on the Monday board

## Backlog

- [ ] Monday.com: Merge duplicate Transit Time columns — `Transit Time` (`text_mm1mcq52`) and `Quoted Transit Time` (`text_mm0hznww`) — likely keep Quoted Transit Time, needs confirmation

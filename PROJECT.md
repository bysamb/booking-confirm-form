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

### N8N Workflow
1. **Webhook** receives `{email, quote}`
2. **Lookup RFQ** finds item by quote number (column `link`) on RFQ board `1219132606`
3. **Change status** sets RFQ status to "Accepted"
4. **Build Query** (Code node) constructs move mutation
5. **Move to Master Shipments** moves item to board `18397923991`, group "Pending" (`group_title`)
6. **Build Update Query** (Code node) constructs field mapping mutation
7. **Update Mapped Fields** writes mapped columns:
   - Quote Number, Quoted Price, Shipping Method, Incoterm, Transit Time, Duty Terms, Quote Validity
   - Customer (board relation)
   - Sales Rep → Sales Owner
   - Assigns Shipment Managers: user IDs `100359742` and `17551977`
   - Sets Service Package, Delivery Handling, PL Obtained From, CI Obtained From to "PENDING"

## Still Needed

- [ ] Configure custom domain to serve at `guidedcargo.com/confirm/`
- [ ] N8N: Send the booking form link to the customer via Missive after confirmation
- [ ] N8N: Add logic for expired quotes (check Quote Validity date before processing)
- [ ] N8N: Add logic for when the quote number can't be found on the Monday board
- [ ] Monday.com: Merge duplicate Transit Time columns — `Transit Time` (`text_mm1mcq52`) and `Quoted Transit Time` (`text_mm0hznww`) — likely keep Quoted Transit Time, needs confirmation

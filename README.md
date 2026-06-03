# LindaStay

LindaStay is a mobile-first SaaS application for vacation rental management. It targets vacation home owners, villa owners, Airbnb hosts, holiday rental owners and small property managers in Tunisia, France, Germany and international markets.

The app is built as a Framework7 + Supabase PWA that can be deployed to GitHub Pages and wrapped with Capacitor for iOS/Android.

## Product scope

### Authentication and roles

- Supabase email/password login
- Owner registration with a 14-day trial profile
- Forgot password flow
- Profile page with language preference
- Roles:
  - `super_admin`
  - `property_owner`
  - `staff` (schema-ready for future use)

### Languages

LindaStay includes a full client-side i18n architecture with dictionaries for:

- French
- English
- German
- Arabic with RTL document direction

The selected language is stored in `localStorage` and in `profiles.preferred_language`.

### Super Admin panel

The admin panel includes:

- Total users
- Active subscriptions
- Expired subscriptions
- Total properties
- Monthly recurring revenue
- New customers
- User management actions: activate, suspend and delete profile records
- Support ticket list
- Global settings placeholders for pricing, WhatsApp templates, email templates and languages

To create the first super admin, register a user and update that profile in Supabase:

```sql
update profiles
set role = 'super_admin', subscription_status = 'active', subscription_plan = 'premium', subscription_end = null
where email = 'your-email@example.com';
```

### Owner dashboard

The owner dashboard shows:

- Revenue this month
- Expense forecast / expenses this month
- Net profit
- Occupancy rate
- Reservations count
- Arrivals today
- Departures today
- Upcoming arrivals
- Chart-style financial bars

### Property management

Properties support:

- Property name
- Description
- Address
- Google Maps link
- GPS coordinates
- Photos as URL array
- Capacity
- Bedrooms
- Bathrooms
- Amenities
- WiFi information
- Check-in instructions
- House rules
- Gallery cards

### Calendar

The calendar page includes an Airbnb-style monthly grid with statuses:

- Available
- Reserved
- Arrival
- Departure
- Blocked / cancelled

### Reservations

The reservation wizard captures:

- Guest name, phone and email
- Check-in and check-out
- Number of guests
- Total price
- Deposit paid / advance
- Remaining balance / reste
- Nights calculation
- Status tracking: pending, confirmed, checked-in, checked-out and cancelled

### Smart expense management

Owners can create custom expense templates:

- Fixed per reservation
- Per night
- Per guest
- Manual

Examples included in the schema comments:

- Cleaning
- Electricity
- Water
- Pool
- Garden
- Welcome products
- Repairs

When a reservation is created, LindaStay automatically generates expense forecasts from active templates and calculates profitability:

```text
Profit = Revenue - Expenses
```

### Traveler guide

The guide builder supports:

- GPS location
- WiFi
- House rules
- Restaurants
- Supermarkets
- Pharmacies
- Beaches
- Emergency contacts
- Taxi services
- One-click sharing using the Web Share API when available

### WhatsApp automation

The app includes predefined WhatsApp message templates:

- Booking confirmation
- Arrival reminder
- Payment reminder
- Check-out message
- Thank you message

Reservation rows generate one-click WhatsApp links with dynamic reservation data.

### Subscriptions

Plans:

- Free: 1 property and 10 reservations/month target limits
- Starter: 9€/month
- Pro: 19€/month
- Premium: 39€/month

Profiles include:

- `subscription_status`
- `subscription_plan`
- `subscription_start`
- `subscription_end`

Expired or blocked owners are treated as read-only in the UI and by Supabase RLS write policies.

## Tech stack

- Framework7 from CDN
- Supabase Auth + Postgres + RLS
- PWA manifest + service worker
- GitHub Pages compatible static deployment
- Capacitor config for native mobile wrappers

## Project structure

```text
index.html                 App shell and CDN assets
css/app.css                Premium responsive Airbnb-inspired UI
js/config.js               Supabase URL and anon key
js/app.js                  Framework7 routes, components, i18n and Supabase services
supabase/schema.sql        Complete database schema, indexes, triggers, RLS and seed helpers
manifest.webmanifest       PWA manifest
sw.js                      Offline-first service worker
icons/                     PWA icons
capacitor.config.json      Capacitor app config
package.json               Local scripts and Capacitor dependencies
```

## Supabase installation

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Copy and run `supabase/schema.sql`.
4. Open **Project Settings > API**.
5. Copy your project URL and anon public key.
6. Paste them into `js/config.js`:

```js
window.LINDASTAY_SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
window.LINDASTAY_SUPABASE_ANON_KEY = "YOUR_ANON_KEY";
```

## Local development

No build step is required for the web app.

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

Run the JavaScript syntax check:

```bash
node --check js/app.js
```

## GitHub Pages deployment

1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Choose **Deploy from a branch**.
4. Select the current production branch and `/root`.
5. Save and wait for the published URL.
6. In Supabase Auth settings, add the GitHub Pages URL to the allowed redirect URLs.

## Capacitor mobile build

Install dependencies:

```bash
npm install
```

Add native platforms:

```bash
npx cap add ios
npx cap add android
```

Sync the static app:

```bash
npx cap sync
```

Open native projects:

```bash
npx cap open ios
npx cap open android
```

## Production checklist

Before commercial launch, configure:

- A custom domain and HTTPS
- Supabase email templates and SMTP
- Payment provider integration such as Stripe, PayPal, Konnect or bank transfer workflow
- Server-side subscription webhooks
- Legal pages: terms, privacy, refund policy
- Backup and monitoring strategy
- Staff permissions once staff accounts are enabled
- Hard usage limits for Free plan quotas

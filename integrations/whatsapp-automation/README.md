# LindaStay WhatsApp Automation Integration

This folder keeps the WhatsApp automation module isolated from the main app files to avoid merge conflicts.

## Files

- `lindastay-whatsapp-automation.js` — client helpers, templates, preview UI enhancer and Supabase helper functions.
- `lindastay-whatsapp-automation.css` — WhatsApp automation styles.

## Activation after merge

1. Run the unified SQL schema in Supabase SQL Editor:

   ```sql
   -- copy/paste supabase/schema.sql
   ```

2. Add the CSS and JS to `index.html` in a small follow-up PR:

   ```html
   <link rel="stylesheet" href="integrations/whatsapp-automation/lindastay-whatsapp-automation.css" />
   <script src="integrations/whatsapp-automation/lindastay-whatsapp-automation.js"></script>
   ```

Keeping activation as a follow-up avoids conflicts with existing changes to `index.html`, `js/app.js`, `css/app.css`, `sw.js`, or `supabase/schema.sql`.

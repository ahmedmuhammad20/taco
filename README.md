# Taco and Grill Website

Static multi-page restaurant website (serverless) ready for cPanel hosting.

## Pages

- `index.html` (Home)
- `menu.html` (Menu)
- `about.html` (About)
- `contact.html` (Contact)
- `deals.html` (Deals)
- `blogs.html` (Blogs)

## Edit Content Without Touching HTML

- Site settings (phone, address, Clover URL, hours): `assets/data/site.json`
- Menu items and prices: `assets/data/menu.json`
- Deals cards: `assets/data/deals.json`
- Blog cards: `assets/data/blogs.json`

## Important Notes

- Menu page is view-only (no ordering form on website).
- `Order Now` button links to Clover URL from `assets/data/site.json`.
- If you have an official logo image, place it in `assets/images/` and update header markup if needed.

## Deploy to cPanel

1. Zip the full project folder.
2. Upload and extract into your domain `public_html` folder.
3. Ensure `index.html` is in `public_html` root.
4. Open your domain and verify links/pages.

No backend required.
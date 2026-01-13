# Enrate.ie website (Bootstrap, self-hosted)

This repository contains a static, deployment-ready website for **Enrate** (residential BER services in Ireland), built with **Bootstrap 5** (self-hosted assets).

## Structure

- HTML pages are in the repository root (for GitHub Pages simplicity).
- Assets are under `assets/`:
  - `assets/vendor/bootstrap/` – self-hosted Bootstrap CSS/JS
  - `assets/css/site.css` – small site-specific additions
  - `assets/js/site.js` – tooltips/popovers + mailto form + back-to-top
  - `assets/js/pricing.js` – pricing calculator logic
  - `assets/js/pricing-data.json` – pricing matrix (also embedded into `pricing.js` for offline/local viewing)
  - `assets/img/enrate_logo.png` – logo

## Quick publish with GitHub Pages

1. Go to **Repository → Settings → Pages**
2. Under **Build and deployment**:
   - **Source**: *Deploy from a branch*
   - **Branch**: `main`
   - **Folder**: `/ (root)`
3. Click **Save**
4. GitHub will provide the live URL under **Pages**.

## Custom domain (optional)

1. Buy/confirm `enrate.ie` with your registrar.
2. In **Settings → Pages**, set **Custom domain** to `enrate.ie`.
3. Add the required DNS records at your registrar (GitHub will show the exact records).
4. Commit a `CNAME` file in the repo root containing `enrate.ie` (GitHub can also create this automatically when you set the custom domain).

## Prevent search indexing (optional)

Static sites can request *no indexing* using either or both:

- `robots.txt`: change to:

  ```
  User-agent: *
  Disallow: /
  ```

- Add a meta robots tag to each page `<head>`:

  ```
  <meta name="robots" content="noindex, nofollow">
  ```

If you do not control HTTP headers (common on static hosting), these are the usual options.

## Notes

- `sitemap.xml` uses `https://example.com/` as a placeholder. Update it once you know your final domain.
- The contact form is **mailto-based** (no server). If you want a server-backed form, integrate a provider (or add a backend) and update `contact.html`.


## Troubleshooting

### Dropdowns / tooltips / popovers not working
These components require the self-hosted Bootstrap JS bundle to be deployed and reachable at:

- `assets/vendor/bootstrap/js/bootstrap.bundle.min.js`

If you do not see dropdowns opening on mobile or tooltips on hover, confirm the `assets/` directory is present in your published site.

### Pricing calculator not updating
The calculator is powered by `assets/js/pricing.js`. If it is not updating, check that:

- `assets/js/pricing.js` exists and is accessible
- Your browser console has no blocked-script errors

The calculator is designed to work even when opening pages locally (file://).

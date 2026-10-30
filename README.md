# JaB Arcade Website

Static site for [jabarcade.com](https://jabarcade.com), hosted on GitHub Pages.

No build step: edit `index.html` / `styles.css` and push to `main`.

## One-time setup

### 1. Enable GitHub Pages
Repo → **Settings → Pages**:
- **Source:** Deploy from a branch
- **Branch:** `main`, folder `/ (root)`
- **Custom domain:** `jabarcade.com` (the `CNAME` file in this repo sets this too)

### 2. DNS records (at your domain registrar)

| Type  | Name / Host | Value                    |
|-------|-------------|--------------------------|
| A     | `@`         | `185.199.108.153`        |
| A     | `@`         | `185.199.109.153`        |
| A     | `@`         | `185.199.110.153`        |
| A     | `@`         | `185.199.111.153`        |
| AAAA  | `@`         | `2606:50c0:8000::153`    |
| AAAA  | `@`         | `2606:50c0:8001::153`    |
| AAAA  | `@`         | `2606:50c0:8002::153`    |
| AAAA  | `@`         | `2606:50c0:8003::153`    |
| CNAME | `www`       | `jab-arcade.github.io`   |

Remove any other existing `A`/`AAAA` records on `@` and any old `www` record first.
DNS can take up to 24 hours to propagate.

### 3. Turn on HTTPS
Once GitHub shows the DNS check as passing, tick **Enforce HTTPS** on the Pages settings page
(the certificate can take a few minutes to an hour to issue).

### 4. (Recommended) Verify the domain
GitHub → **Organization settings → Pages → Add a domain** and add the TXT record it gives you.
This stops anyone else from claiming `jabarcade.com` on GitHub Pages.

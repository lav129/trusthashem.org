# TrustHashem.org — infrastructure notes

Recorded 2026-09-03 from live DNS and the Network Solutions account (Websites & Hosting).

## Live website

- Public site: https://trusthashem.org/
- Platform: WordPress (OceanWP + Elementor + WooCommerce)
- PHP: 7.4.33
- Theme/plugins observed: OceanWP, Elementor, WooCommerce, Woo Donations, AudioIgniter, Contact Form 7, Complianz, UserWay
- `/wp-admin/` is not publicly reachable (returns the site 404 page)

## Domain / DNS (public lookup)

- A / www: 66.96.162.144 (Network Solutions / domain.com hosting range)
- Nameservers: ns1.domain.com, ns2.domain.com
- MX: mx.trusthashem.org
- SPF: `v=spf1 ip4:66.96.128.0/18 include:websitewelcome.com ?all`
- Not currently a Cloudflare zone (other Web Dream sites are on Cloudflare; this domain is not)

Do not change MX / SPF / DKIM when deploying the new site.

## Network Solutions domain details (trusthashem.org)

- Status: Active, domain locked
- Connected services: Hosting (WordPress Starter)
- Expires: 10/31/2026
- Auto-renew: off
- Privacy: on
- Nameservers (default): NS1.DOMAIN.COM, NS2.DOMAIN.COM
- Advanced DNS present: A(11), CNAME(3), MX(1), TXT(1)
- DNSSEC: disabled
- Last updated in account UI: 2026-03-04

Do not Unassign hosting. Do not change nameservers or MX until a backup exists and the new site is ready.

## Network Solutions account (verified)

- Product: **WordPress Starter — Active**
- Sites on this same plan:
  - trusthashem.org
  - yonah.io
  - shemayisraelprayer.org
- Account home lists trusthashem.org with SSL lock shown as active
- WordPress menu item under Hosting shows “No WordPress packages” — the real product lives under **Websites & Hosting**, not the Hosting/WordPress package list
- “Edit website” SSO opens `secure.networksolutions.com` (legacy login) in a new tab; session does not always carry over
- “Manage” on the plan menu did not navigate in this session

## Donations (do not break)

- PayPal hosted button ID: `BN88DN38MLPAA`
- Form posts to `https://www.paypal.com/donate`
- WooCommerce products:
  - `/product/create-endless-blessings/` (Donations category, $1 / 1 shekel starting amount)
  - `/product/donation/` (second simple donation product)
- Nav “Donate now” currently points at a PayPal donate token URL

## Contact / community (from public site)

- Email for WhatsApp groups: bitachon@trusthashem.org
- Homepage WhatsApp group: https://chat.whatsapp.com/CdZNrs4dbEZJjunjnrmLfW
- 21 unique WhatsApp group links across lesson pages (see `_recovery/catalog.json`)
- Public footer credit: “Built and maintained by wesite 0585678405”

## YouTube / podcasts

- No YouTube links on the live HTML
- No jewishpodcasts.fm links in the recovered HTML
- Series are also published on listen.jewishpodcasts.fm (Rebbetzin Leah Donner / TrustHashem.Org) — keep only if linking out; do not invent a YouTube channel

## Public recovery (2026-09-03)

Recovered without WordPress admin. Audio files were not downloaded; keep using live `/wp-content/uploads/` URLs until cutover.

- Pages: `_recovery/pages/` (home, contact, shop, 20 lesson series, donation product)
- Playlists: 21 AudioIgniter JSON files in `_recovery/playlists/`
- Audio: 1,424 unique `.ogg` URLs in `_recovery/extracted.json`
- WP REST: 28 pages, 0 posts, 1,631 media items, 2 products
- Images: brand + lesson art in `public/images/` and `_recovery/assets/`
- Build catalog: `_recovery/catalog.json`

Still needed from Network Solutions: WordPress file + database backup before replacing the live site.

## Backup rule

Keep the current WordPress site live until the new site is tested. Do not delete WordPress Starter files until a full file/database backup exists.

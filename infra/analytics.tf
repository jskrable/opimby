# Cloudflare injects the beacon at the edge and it reports to our own /cdn-cgi/rum.
# The CSP allows it in astro.config.mjs.
resource "cloudflare_web_analytics_site" "opimby" {
  account_id   = local.account_id
  zone_tag     = local.zone_id
  auto_install = true
}

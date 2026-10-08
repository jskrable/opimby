# Email Routing and the Worker's custom domains own the other records; they're read-only here.
resource "cloudflare_dns_record" "spf" {
  zone_id = local.zone_id
  name    = "opimby.org"
  type    = "TXT"
  content = "\"v=spf1 include:_spf.mx.cloudflare.net ~all\""
  ttl     = 1
  proxied = false
}

resource "cloudflare_dns_record" "google_site_verification" {
  zone_id = local.zone_id
  name    = "opimby.org"
  type    = "TXT"
  content = "\"google-site-verification=gbiEJqW68y2NRnvu49EpU0zqIZ4Z5U0IttGxX0oB1Ug\""
  ttl     = 3600
  proxied = false
}

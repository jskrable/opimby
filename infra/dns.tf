# Mail is Google Workspace. The Worker's custom domains and Email Routing's leftover DKIM record
# (cf2024-1._domainkey) are managed outside Terraform.
locals {
  google_mx = {
    "aspmx.l.google.com"      = 1
    "alt1.aspmx.l.google.com" = 5
    "alt2.aspmx.l.google.com" = 5
    "alt3.aspmx.l.google.com" = 10
    "alt4.aspmx.l.google.com" = 10
  }
}

resource "cloudflare_dns_record" "mx" {
  for_each = local.google_mx

  zone_id  = local.zone_id
  name     = "opimby.org"
  type     = "MX"
  content  = each.key
  priority = each.value
  ttl      = 3600
  proxied  = false
}

resource "cloudflare_dns_record" "spf" {
  zone_id = local.zone_id
  name    = "opimby.org"
  type    = "TXT"
  content = "\"v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all\""
  ttl     = 3600
  proxied = false
}

resource "cloudflare_dns_record" "google_dkim" {
  zone_id = local.zone_id
  name    = "google._domainkey.opimby.org"
  type    = "TXT"
  content = "\"v=DKIM1;k=rsa;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzcOP+roDwwUuSCpaGvdZvpatXjFzX0A0sJNfMYuBhGs4Q4wRIW7TxIwL05Lcv0JiZBj0b5rnAm9etHBXcbZUl2TzyCG20N5ZlVKF818oi0XYFDtscEbEAZWnAl9yXXmR0+P9zckMqglw0AM62D/HoMryY+jFuqOIcj8VeE0mTUpiKiGO7B4oQdfoJL9XkryrRoS\" \"WnEKz1bk/zoApt2oNE1NAS692oCr+IHSoWkixPP4tby2ggujzeoONBEGe4P/84nCftkK5VNLQCD+nwahXxHpVI29f7qIr+4dUAwhkxoxBl0zW+Wh3Vroqh336s77yXV0gGUouuwr9Bek9uqPxTwIDAQAB\""
  ttl     = 1
  proxied = false
}

# TODO: move to p=quarantine once the reports show Google and the Worker's NOTIFY mail both pass.
resource "cloudflare_dns_record" "dmarc" {
  zone_id = local.zone_id
  name    = "_dmarc.opimby.org"
  type    = "TXT"
  content = "\"v=DMARC1; p=none; rua=mailto:info@opimby.org\""
  ttl     = 3600
  proxied = false
}

resource "cloudflare_dns_record" "google_site_verification" {
  for_each = toset([
    "artG19HRUs16blgiTctSm11RUBDNNhLN-fFhoHzOeIo",
    "gbiEJqW68y2NRnvu49EpU0zqIZ4Z5U0IttGxX0oB1Ug",
  ])

  zone_id = local.zone_id
  name    = "opimby.org"
  type    = "TXT"
  content = "\"google-site-verification=${each.key}\""
  ttl     = 3600
  proxied = false
}

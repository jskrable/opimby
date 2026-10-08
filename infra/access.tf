# One lock on /admin; src/middleware.ts checks the Access JWT as the second.
resource "cloudflare_zero_trust_access_application" "admin" {
  account_id = local.account_id
  name       = "opimby admin"
  type       = "self_hosted"
  domain     = "opimby.org/admin"
  destinations = [
    { type = "public", uri = "opimby.org/admin" },
    { type = "public", uri = "www.opimby.org/admin" },
  ]
  allowed_idps               = ["0f5e639c-db2a-491a-bc62-3b1e0e6feac0"]
  auto_redirect_to_identity  = true
  app_launcher_visible       = false
  session_duration           = "24h"
  http_only_cookie_attribute = true
  enable_binding_cookie      = false
  options_preflight_bypass   = false
  policies = [
    { id = cloudflare_zero_trust_access_policy.admins.id, precedence = 1 },
  ]
}

resource "cloudflare_zero_trust_access_policy" "admins" {
  account_id       = local.account_id
  name             = "opimby admins"
  decision         = "allow"
  session_duration = "24h"
  include          = [for email in var.admin_emails : { email = { email = email } }]
}

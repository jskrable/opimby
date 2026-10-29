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
  allowed_idps               = [cloudflare_zero_trust_access_identity_provider.google.id]
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
  include          = [{ email_domain = { domain = "opimby.org" } }]
}

# The "OPIMBY admin" custom SAML app in the Google Admin console (Apps > Web and mobile apps).
# Google has no API for custom SAML apps, so that side is set up by hand. Its signing certificate
# expires 2031-10-28: download the new one from the app and replace the file.
locals {
  google_saml_idp_id = "C03f0n35a"
}

resource "cloudflare_zero_trust_access_identity_provider" "google" {
  account_id = local.account_id
  name       = "Google Workspace (opimby.org)"
  type       = "saml"
  config = {
    issuer_url           = "https://accounts.google.com/o/saml2?idpid=${local.google_saml_idp_id}"
    sso_target_url       = "https://accounts.google.com/o/saml2/idp?idpid=${local.google_saml_idp_id}"
    idp_public_certs     = [file("${path.module}/google-saml.pem")]
    email_attribute_name = "email"
    attributes           = ["email"]
    sign_request         = false
  }
}

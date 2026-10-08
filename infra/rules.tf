resource "cloudflare_ruleset" "rate_limit" {
  zone_id = local.zone_id
  kind    = "zone"
  name    = "default"
  phase   = "http_ratelimit"
  rules = [
    {
      description = "Form submissions: 5 POSTs per 10s per IP"
      action      = "block"
      enabled     = true
      expression  = "(http.request.method eq \"POST\" and (starts_with(http.request.uri.path, \"/volunteer\") or starts_with(http.request.uri.path, \"/donate/items\") or starts_with(http.request.uri.path, \"/_actions\")))"
      ratelimit = {
        characteristics     = ["cf.colo.id", "ip.src"]
        period              = 10
        requests_per_period = 5
        mitigation_timeout  = 10
        requests_to_origin  = false
      }
    },
  ]
}

resource "cloudflare_ruleset" "redirects" {
  zone_id = local.zone_id
  kind    = "zone"
  name    = "default"
  phase   = "http_request_dynamic_redirect"
  rules = [
    {
      description = "Redirect www to apex"
      action      = "redirect"
      enabled     = true
      expression  = "(http.host eq \"www.opimby.org\")"
      action_parameters = {
        from_value = {
          status_code           = 301
          preserve_query_string = true
          target_url = {
            expression = "concat(\"https://opimby.org\", http.request.uri.path)"
          }
        }
      }
    },
  ]
}

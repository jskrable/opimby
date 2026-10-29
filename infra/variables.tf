variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}

locals {
  account_id = "afd6a9192ea105779f13319ca7733cac"
  zone_id    = "64b8080a8fb8b4d5b70c13405af52ab0"
}

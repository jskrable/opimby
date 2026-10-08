# Bot Fight Mode and JS detections stay off so participants never hit a challenge.
# AI training opt-outs live in public/robots.txt. Cloudflare's own AI training
# blocking (ai_training, is_robots_txt_managed) blocked real Googlebot, so it stays off.
resource "cloudflare_bot_management" "opimby" {
  zone_id                   = local.zone_id
  fight_mode                = false
  enable_js                 = false
  ai_training               = "disabled"
  ai_user                   = "disabled"
  aisearch                  = "disabled"
  ai_bots_protection        = "disabled"
  content_bots_protection   = "disabled"
  crawler_protection        = "disabled"
  is_robots_txt_managed     = false
  ai_bots_migration_opt_out = false
}

# n8n decentralized toolchain

Deployment scaffold for n8n using:

- **Hugging Face Spaces** as the Docker runtime
- **Supabase Postgres** for durable n8n state
- **Cloudflare Worker** as the HTTPS edge proxy and keep-alive trigger
- **Private GitHub** for sanitized configuration and workflow exports

## Required setup

1. Create a Supabase project and copy its Postgres connection parameters.
2. Create a Hugging Face Docker Space and add the variables from `.env.example` as Space secrets.
3. Deploy the Worker in `cloudflare-worker/` and set `ORIGIN_URL` to the Space URL.
4. Point a DNS record such as `n8n.example.com` at the Worker route.
5. Set `N8N_HOST`, `N8N_EDITOR_BASE_URL`, and `WEBHOOK_URL` to that public hostname.

## Secrets policy

Never commit `.env`, database passwords, n8n credentials, or Worker secrets. The repository intentionally contains only placeholders.

## Important limitation

Hugging Face Spaces can sleep and their local filesystem is not durable. Supabase must be reachable and correctly configured before relying on the deployment. The Worker cron trigger reduces idle behavior but cannot guarantee an always-on free-tier runtime.

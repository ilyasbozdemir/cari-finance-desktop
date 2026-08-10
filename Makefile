.PHONY: dev build package docker-up docker-down docker-logs docker-backup pulumi-up

dev:
	pnpm dev:desktop

build:
	pnpm build

package:
	pnpm package

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

docker-backup:
	docker exec cari_finance_backup /app/docker-backup.sh

pulumi-up:
	cd infra && pulumi up

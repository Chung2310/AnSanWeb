# Triển khai AnSanWeb lên VPS

## Kiến trúc

GitHub Actions kiểm tra mã nguồn, build image bằng `Dockerfile`, đẩy image lên GitHub Container Registry (GHCR), rồi kết nối SSH tới VPS để chạy Docker Compose.

| Nhánh | Môi trường | Thư mục VPS | Cổng VPS | Cổng container |
| --- | --- | --- | ---: | ---: |
| `develop` | Staging | `/opt/ansanweb/staging` | `3006` | `3006` |
| `production` | Production | `/opt/ansanweb/production` | `3006` | `3006` |

Nginx của mỗi môi trường trỏ tới `http://127.0.0.1:3006` trên VPS tương ứng. Hai môi trường không thể cùng bind cổng này trên một VPS.

## Chuẩn bị VPS

VPS cần Docker Engine, Docker Compose v2 và một tài khoản SSH có quyền chạy Docker:

```bash
docker --version
docker compose version
docker run --rm hello-world
```

Đảm bảo cổng `3006` chưa bị dịch vụ khác sử dụng trên mỗi VPS. Workflow tự tạo hai thư mục trong `/opt/ansanweb`; tài khoản SSH phải có quyền ghi vào `/opt` hoặc các thư mục phải được tạo và cấp quyền trước.

## GitHub Secrets

Vào repository → **Settings** → **Secrets and variables** → **Actions** và tạo:

| Secret | Môi trường | Nội dung |
| --- | --- | --- |
| `SSH_HOST` | Staging | IP hoặc hostname VPS staging |
| `SSH_USER` | Staging | Tài khoản SSH |
| `SSH_KEY` | Staging | Private key SSH đầy đủ |
| `SSH_PORT` | Staging | Cổng SSH; có thể bỏ trống để dùng `22` |
| `ENV_FILE` | Staging | Toàn bộ nội dung `.env` runtime staging |
| `SSH_HOST_PROD` | Production | IP hoặc hostname VPS production |
| `SSH_USER_PROD` | Production | Tài khoản SSH |
| `SSH_KEY_PROD` | Production | Private key SSH đầy đủ |
| `SSH_PORT_PROD` | Production | Cổng SSH; có thể bỏ trống để dùng `22` |
| `ENV_FILE_PROD` | Production | Toàn bộ nội dung `.env` runtime production |

Nếu Genkit được gọi ở runtime, thêm `GOOGLE_GENAI_API_KEY=...` vào secret env tương ứng. Firebase web config hiện nằm trong source code nên không cần lặp lại trong `.env`.

`GITHUB_TOKEN` được GitHub Actions cấp tự động để push và pull image. Nếu đổi GHCR package sang private và policy tổ chức chặn token mặc định, cấp cho workflow quyền đọc package hoặc chuyển package sang public.

## Quy trình tự động

- Pull request vào `develop` hoặc `production`: cài dependency, test, typecheck và build production.
- Push/merge vào `develop`: build image SHA, đẩy GHCR, deploy staging ở cổng `3006`.
- Push/merge vào `production`: build image SHA, đẩy GHCR, deploy production ở cổng `3006`.
- Deploy chỉ thành công khi container trả về healthy từ `GET /api/health`.

Theo dõi tại tab **Actions** của GitHub. Khi deploy lỗi, workflow in trạng thái Compose và 100 dòng log gần nhất.

## Kiểm tra local

```bash
npm ci
npm test
npm run typecheck
npm run build
docker compose config
docker build -t ansanweb:local .
docker run --rm -p 3006:3006 --name ansanweb-local ansanweb:local
```

Ở terminal khác:

```bash
curl --fail http://127.0.0.1:3006/api/health
curl --fail http://127.0.0.1:3006/
```

## Kiểm tra trên VPS

```bash
cd /opt/ansanweb/production
docker compose ps
curl --fail http://127.0.0.1:3006/api/health
docker compose logs --tail=100
```

Staging dùng thư mục `/opt/ansanweb/staging` và cổng `3006`.

## Rollback thủ công

Mỗi image có tag bất biến dạng `sha-<commit SHA đầy đủ>`. Để rollback, tìm SHA đã chạy ổn trong GHCR hoặc Git history, rồi trên VPS:

```bash
cd /opt/ansanweb/production
export IMAGE_NAME=ghcr.io/<github-owner>/<repository>
export IMAGE_TAG=sha-<commit-sha>
export HOST_PORT=3006
export CONTAINER_NAME=ansanweb-production
docker compose pull
docker compose up -d --remove-orphans
docker compose ps
curl --fail http://127.0.0.1:3006/api/health
```

Không ghi token, private key hoặc nội dung `.env` vào source code, Dockerfile, log CI hay lệnh rollback.

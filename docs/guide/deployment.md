# 进阶部署

本章节补充快速开始之外的部署方式和配置说明。第一次部署建议先按[快速开始](./getting-started.md)完成本地可用环境，再根据本章调整公网访问、可选服务、密钥和开发环境。

## 部署结构

微信机器人由管理后台、机器人客户端、微信协议服务和若干公共服务组成。

- 管理后台前端：`wechat-robot-admin-frontend`，提供浏览器操作界面。

- 管理后台后端：`wechat-robot-admin-backend`，负责登录认证、机器人创建、容器管理、系统配置。

- 机器人客户端：`wechat-robot-client`，每个机器人实例动态创建一个客户端容器，负责消息处理、AI、知识库、MCP、Skills。

- 机器人服务端：`server_xxx`，每个机器人实例动态创建一个协议容器，负责微信登录和协议通信。

- MySQL、Redis、Qdrant：分别保存后台数据、运行状态和向量索引。

::: tip 动态容器
机器人客户端容器和机器人服务端容器不是由 `docker compose` 直接管理，而是由管理后台动态创建。因此升级或重建机器人实例时，需要在机器人详情页操作客户端和服务端容器。
:::

## 本地部署进阶

快速开始使用 `.deploy/local/docker-compose.yml`，适合局域网和个人测试。常用调整如下：

1. 修改弱口令

   `docker-compose.yml` 中默认包含 Redis、MySQL、Qdrant、后台登录密钥等示例密码，正式使用前请修改：
   - `REDIS_PASSWORD`
   - `MYSQL_ROOT_PASSWORD`
   - `MYSQL_PASSWORD`
   - `QDRANT__SERVICE__API_KEY`
   - `LOGIN_TOKEN`
   - `SESSION_SECRET`
   - `WECHAT_SERVER_TOKEN`
   - `SLIDER_TOKEN`
   - `THIRD_PARTY_API_KEY`

2. 生成 HTTPS 证书

   浏览器访问管理后台时使用 HTTPS。证书需要包含你访问后台时使用的 IP，例如局域网 IP。

   ```bash
   # Windows
   powershell -ExecutionPolicy Bypass -File ./gen-self-signed-cert.ps1 -IpAddresses <A_LAN_IP>

   # Linux
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt -subj "/CN=<A_LAN_IP>"
   ```

3. 使用 Docker Secrets

   `.deploy/local/docker-compose2.yml` 提供了 Docker Secrets 示例。看不懂 Secrets 配置时可以先使用普通 `docker-compose.yml`，但公网部署建议把密钥从明文环境变量中迁出。

4. 重置环境

   `.deploy/local/reset.sh` 和 `.deploy/local/reset.bat` 用于暴力重置。该操作会丢失历史数据，并可能导致微信被识别为新设备登录，非必要不要使用。

## 公网部署

公网部署适合把管理后台放到远程服务器，通过域名和 HTTPS 访问。

准备项：

- 一台可以运行 Docker 和 docker compose 的服务器。

- 一个域名，并将域名解析到服务器公网 IP。

- 服务器安装 Nginx，或使用其他反向代理。

- 确认服务器网络可以拉取 Docker 镜像。

部署步骤：

```bash
git clone git@github.com:hp0912/wechat-robot-client.git
docker network create wechat-robot
cd ./wechat-robot-client/.deploy/server
docker compose up -d
```

如果你的环境使用旧版命令，则把 `docker compose` 替换成 `docker-compose`。

`.deploy/server/nginx.conf` 提供了域名转发示例：

- 公众号认证服务域名转发到 `wechat-server`。

- 管理后台域名中 `/api/v1` 开头的请求转发到管理后台后端。

- 管理后台其余请求转发到管理后台前端。

修改域名后，将配置放到服务器 Nginx 站点配置中，然后重启 Nginx：

```bash
sudo service nginx restart
```

建议使用 Let's Encrypt 配置公网 HTTPS：

```bash
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx
sudo service nginx restart
```

::: danger 公网安全
不要把默认弱口令暴露到公网。公网部署前至少修改后台登录密钥、数据库密码、Redis 密码、Qdrant API Key、Session Secret，并限制管理后台访问来源。
:::

## 可选服务说明

快速开始的 compose 文件包含一些非必需服务。是否保留取决于你要使用的功能。

- `wechat-robot-mcp-server`：官方内置 MCP 服务。不部署时，依赖官方内置工具的功能不可用。

- `netease-cloud-music`：网易云点歌服务。不部署时，点歌功能不可用。需要配置 `MUSIC_U`。

- `xiaohongshu-mcp`：小红书 MCP 服务。不部署时，小红书相关 MCP 工具不可用。

- `jimeng-api`：即梦逆向 API。不部署时，依赖即梦的绘图能力不可用。

- `word-cloud-server`：词云服务。不部署时，群聊总结里的词云图片不可用。

- `wechat-uuid` 和 `wechat-slider`：Mac 登录过滑块相关服务。使用 Mac 登录方式时需要关注这两个服务和 `SLIDER_TOKEN`。

- `wechat-server`：公众号扫码登录认证服务。如果只使用登录密钥登录管理后台，可以不重点配置公众号认证；如果要公众号扫码登录，需要配置公众号服务和 `WECHAT_SERVER_TOKEN`。

- `wechat-admin-qdrant`：向量数据库。知识库、长期记忆、图片向量检索依赖它，建议保留。

## 关键环境变量

管理后台后端常用变量：

- `LOGIN_METHOD`：管理后台登录方式，`token` 表示登录密钥，`scan` 表示扫码登录。

- `LOGIN_TOKEN`：登录密钥，默认示例为 `12345678`，正式使用请修改。

- `DOCKER_NETWORK`：动态创建机器人容器时使用的 Docker 网络，默认 `wechat-robot`。

- `HOST_DATA_DIR`：宿主机数据目录，动态机器人数据会写入该目录下。

- `WECHAT_SERVER_ADDRESS` 和 `WECHAT_SERVER_TOKEN`：公众号认证服务配置。

- `SLIDER_SERVER_BASE_URL`、`SLIDER_TOKEN`、`UUID_URL`：安全验证和滑块服务配置。

- `MYSQL_*`、`REDIS_*`、`QDRANT_*`：数据库、缓存和向量数据库配置。

- `THIRD_PARTY_API_KEY`：部分语音合成等第三方能力使用。

机器人客户端常用变量：

- `ROBOT_ID`、`ROBOT_CODE`：管理后台创建机器人后分配。

- `WECHAT_SERVER_HOST`：该机器人对应的微信协议服务地址。

- `MYSQL_DB`：机器人实例数据库，通常和 `ROBOT_CODE` 一致。

- `REDIS_DB`：机器人实例独立 Redis DB，由管理后台分配。

- `QDRANT_HOST`、`QDRANT_PORT`、`QDRANT_API_KEY`：向量数据库连接信息。

- `WORD_CLOUD_URL`：词云服务地址。

- `SKILLS_DIR`：Skills 存放目录，本地开发时常用。

::: tip 配置原则
如果使用管理后台创建机器人，客户端和服务端容器的大部分变量会由后台自动生成。只有本地开发或手动启动客户端时，才需要自己完整填写客户端 `.env`。
:::

## 本地开发部署

开发时可以分别启动管理后台前端、管理后台后端、机器人客户端和协议服务。

### 管理后台前端

```bash
cd wechat-robot-admin-frontend
corepack enable
corepack prepare pnpm@8.15.9 --activate
pnpm install
pnpm build-types
pnpm dev
```

### 管理后台后端

```bash
cd wechat-robot-admin-backend
go mod download
export GO_ENV=dev
cp .env.example .env
go run main.go
```

后端 `.env` 里需要关注：

- `DEV_ROBOT_CLIENT_URL`：本地机器人客户端地址。
- `DOCKER_NETWORK`：Docker 网络。
- `LOGIN_METHOD` 和 `LOGIN_TOKEN`：本地登录方式。
- `MYSQL_*`、`REDIS_*`：本地数据库和缓存。

### 机器人客户端

```bash
cd wechat-robot-client
go mod download
export GO_ENV=dev
cp .env.example .env
go run main.go
```

客户端 `.env` 里需要和管理后台创建的机器人保持一致：

- `ROBOT_ID`
- `ROBOT_CODE`
- `MYSQL_DB`
- `REDIS_DB`
- `WECHAT_SERVER_HOST`

### 机器人协议服务

协议服务源码不公开，可以使用镜像启动。示例：

```yaml
services:
  ipad-test:
	 image: registry.cn-shenzhen.aliyuncs.com/houhou/wechat-ipad:latest
	 container_name: ipad-test
	 restart: always
	 networks:
		- wechat-robot
	 ports:
		- "3010:9000"
	 environment:
		WECHAT_PORT: 9000
		REDIS_HOST: wechat-admin-redis
		REDIS_PORT: 6379
		REDIS_PASSWORD: 123456
		REDIS_DB: 0
		WECHAT_CLIENT_HOST: 127.0.0.1:9001
```

其中 `WECHAT_CLIENT_HOST` 要指向本地机器人客户端，`REDIS_DB` 要和客户端配置保持一致。

## 升级和重建

管理后台前端、管理后台后端以及公共服务由 `docker compose` 管理：

```bash
git pull --rebase
docker compose pull
docker compose up -d
```

机器人客户端和机器人服务端由管理后台动态管理，升级时进入机器人详情页：

1. 点击`更新镜像`。

2. 依次执行`删除客户端容器`、`删除服务端容器`、`创建服务端容器`、`创建客户端容器`。

3. 如果有多个机器人，对每个机器人重复上述操作。

`删除客户端容器`和`删除服务端容器`不会删除机器人数据库，也不会影响登录状态；但删除挂载数据目录、重置数据库或重新创建机器人实例会丢失数据，并可能触发新设备登录风控。

## 运行排查

- 管理后台打不开：检查 `wechat-nginx`、`wechat-robot-admin-frontend`、`wechat-robot-admin-backend` 是否健康，确认 HTTPS 证书和端口映射是否正确。

- 登录管理后台失败：确认 `LOGIN_METHOD`、`LOGIN_TOKEN`，或公众号扫码登录的 `WECHAT_SERVER_ADDRESS`、`WECHAT_SERVER_TOKEN`。

- 创建机器人失败：确认后端容器挂载了 `/var/run/docker.sock`，并且 `DOCKER_NETWORK` 已创建。

- 机器人扫码后卡住：优先按使用指南中的顺序重建服务端和客户端容器，并确认扫码时没有影响微信连接的代理。

- 知识库不可用：检查 `wechat-admin-qdrant`、`QDRANT_*` 配置、客户端容器日志和嵌入模型配置。

- Skills 或 MCP 不生效：安装、更新或修改环境变量后重启客户端，并查看客户端容器日志里的加载错误。

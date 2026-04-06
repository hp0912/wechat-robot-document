# Docker 部署

## 构建并启动

项目根目录已提供 `Dockerfile` 和 `docker-compose.yml`，可以直接执行：

```bash
docker compose up -d --build
```

默认对外暴露端口：`8080`

启动后访问：`http://127.0.0.1:8080`

## 部署流程说明

镜像分为两个阶段：

1. 构建阶段使用 Node 镜像和 `pnpm` 安装依赖，然后执行 `pnpm docs:build`。
2. 运行阶段使用 Nginx 提供静态文件服务，并支持单页应用式回退。

## 常用命令

重新构建并启动：

```bash
docker compose up -d --build
```

停止容器：

```bash
docker compose down
```

查看日志：

```bash
docker compose logs -f
```

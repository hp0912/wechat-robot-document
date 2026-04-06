# 项目说明

## 目录结构

```text
.
├─ docs/
│  ├─ .vitepress/
│  │  └─ config.ts
│  ├─ guide/
│  │  ├─ configuration.md
│  │  ├─ deployment.md
│  │  └─ getting-started.md
│  ├─ public/
│  │  └─ logo.svg
│  └─ index.md
├─ Dockerfile
├─ docker-compose.yml
├─ nginx.conf
├─ package.json
└─ tsconfig.json
```

## 本地开发

安装依赖：

```bash
pnpm install
```

启动开发服务器：

```bash
pnpm docs:dev
```

默认访问地址：`http://127.0.0.1:5173`

## 构建产物

执行以下命令后，VitePress 会输出静态文件：

```bash
pnpm docs:build
```

产物目录为 `docs/.vitepress/dist`，Docker 部署会直接使用该目录内容。

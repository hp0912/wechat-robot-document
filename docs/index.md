---
layout: home

hero:
  name: 微信机器人使用文档
  text: 基于 VitePress 的文档站点
  tagline: 提供部署、配置、维护和扩展微信机器人的统一文档入口
  image:
    src: /logo.svg
    alt: 微信机器人使用文档
  actions:
    - theme: brand
      text: 开始阅读
      link: /guide/getting-started
    - theme: alt
      text: Docker 部署
      link: /guide/deployment

features:
  - title: 结构清晰
    details: 采用 VitePress 组织导航、侧边栏和本地搜索，适合持续维护的内部文档项目。
  - title: 类型严格
    details: 启用 TypeScript 严格模式与 noImplicitAny，避免配置文件出现 any。
  - title: 部署直接
    details: 内置 Dockerfile 与 docker-compose.yml，可直接构建静态站点并交由 Nginx 提供服务。
---

## 适用场景

这套文档结构适合以下需求：

- 记录微信机器人安装、配置与运行流程
- 沉淀常见问题与排查经验
- 向团队成员提供统一的操作说明
- 使用 Docker 快速部署静态文档站点

## 推荐工作流

1. 使用 `pnpm docs:dev` 本地预览文档。
2. 在 `docs/guide` 下持续补充机器人能力说明与运维手册。
3. 提交代码前执行 `pnpm typecheck` 和 `pnpm docs:build`。
4. 使用 `docker compose up -d --build` 部署文档站点。

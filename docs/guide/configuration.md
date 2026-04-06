# 配置约定

## 文档站配置

站点核心配置位于 `docs/.vitepress/config.ts`，当前已经包含：

- 中文站点标题与描述
- 顶部导航与侧边栏
- 本地搜索
- 页脚、上一页和下一页文案
- 目录大纲与更新时间

## TypeScript 约束

项目包含 `tsconfig.json`，主要约束如下：

- 开启 `strict`
- 开启 `noImplicitAny`
- 开启 `noUncheckedIndexedAccess`
- 开启 `exactOptionalPropertyTypes`
- 配置文件不输出构建产物，仅做类型检查

如果后续继续扩展 `docs/.vitepress` 下的自定义主题或插件逻辑，建议保持相同约束，避免引入 `any`。

## 依赖管理

项目使用 `pnpm` 作为包管理工具，依赖固定为创建时查询到的最新版本：

- `vitepress@1.6.4`
- `typescript@6.0.2`
- `@types/node@25.5.2`

后续如需继续升级，直接执行：

```bash
pnpm up --latest
```

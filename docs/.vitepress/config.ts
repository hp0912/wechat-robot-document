import { defineConfig, type DefaultTheme } from "vitepress";

const guideSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: "开始使用",
    items: [
      { text: "项目说明", link: "/guide/getting-started" },
      { text: "配置约定", link: "/guide/configuration" },
      { text: "Docker 部署", link: "/guide/deployment" },
    ],
  },
];

export default defineConfig({
  lang: "zh-CN",
  title: "微信机器人使用文档",
  description: "基于 VitePress 构建的微信机器人使用文档站点",
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "首页", link: "/" },
      { text: "开始使用", link: "/guide/getting-started" },
      { text: "Docker 部署", link: "/guide/deployment" },
    ],
    sidebar: {
      "/guide/": guideSidebar,
    },
    socialLinks: [{ icon: "github", link: "https://github.com/" }],
    search: {
      provider: "local",
    },
    footer: {
      message: "微信机器人使用文档",
      copyright: "Copyright © 2026",
    },
    outline: {
      level: [2, 3],
      label: "本页目录",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
  },
});

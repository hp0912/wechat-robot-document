import { defineConfig, type DefaultTheme } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

const guideSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: "快速开始",
    items: [
      { text: "快速开始", link: "/guide/getting-started" },
      { text: "项目架构", link: "/guide/project-architecture" },
      { text: "使用指南", link: "/guide/configuration" },
      { text: "进阶部署", link: "/guide/deployment" },
    ],
  },
];

export default withMermaid(
  defineConfig({
    lang: "zh-CN",
    title: "微信机器人使用文档",
    description: "基于 VitePress 构建的微信机器人使用文档站点",
    cleanUrls: true,
    mermaid: {},
    lastUpdated: true,
    themeConfig: {
      logo: "/logo.svg",
      nav: [
        { text: "首页", link: "/" },
        { text: "快速开始", link: "/guide/getting-started" },
        { text: "Docker 部署", link: "/guide/deployment" },
      ],
      sidebar: {
        "/guide/": guideSidebar,
      },
      socialLinks: [
        {
          icon: "github",
          link: "https://github.com/hp0912/wechat-robot-client",
        },
      ],
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
  }),
);

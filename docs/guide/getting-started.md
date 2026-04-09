# 快速开始

## 部署前的准备

::: warning 注意
仅支持部署在 Windows 系统和 Linux 系统，本章节不讲解 Mac 部署，Mac 部署请自行研究。
:::

- 系统已经安装 Git，用于克隆项目

- 系统已经安装`Docker Desktop`，即 Docker 和 docker-compose 组件

- 系统已安装`OpenSSL` (Windows 系统可以选择安装`Git`，附带`OpenSSL`)，用于 https 证书签名

- 网络能拉取 Docker 镜像

## 快速部署

```
# 克隆本项目
git clone git@github.com:hp0912/wechat-robot-client.git

# 进入部署目录
cd ./wechat-robot-client/.deploy/local

# 先创建一个docker网络，如果以前没创建过的话
docker network create wechat-robot

# 生成 https 证书，根据系统选择其中一个执行
# windows 系统
# windows 系统，<A_LAN_IP> 替换成局域网 ip
powershell -ExecutionPolicy Bypass -File ./gen-self-signed-cert.ps1 -IpAddresses <A_LAN_IP>
# linux 系统，<A_LAN_IP> 替换成局域网 ip
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt -subj "/CN=<A_LAN_IP>"

# 通过docker-compose启动容器，下面两个命令，哪个能用就用哪个
docker compose up -d
docker-compose up -d
```

::: info 温馨提示
如果拉镜像失败，请确认 docker 是否设置代理，并尝试逐个手动拉取镜像，个别镜像体积较大，批量拉容易失败
:::

## 访问管理后台

浏览器访问`https://127.0.0.1:8443 `，登录密钥`12345678`

## 创建机器人

- 点击右上角`创建机器人`按钮，新建一个机器人实例，创建时间可能会比较长，请耐心等待

- 创建完成后，机器人列表会出现机器人卡片，点击卡片右上角的扫码登录按钮，选择扫码登录方式

- 推荐使用 iPad 登录，登录不上再使用 Mac 登录，不要使用车载微信登录

- 登录成功后，即可点击下面一排按钮中的第一个，进入机器人详情界面，进行自定义配置

## 特别注意

::: danger 弱口令警告
默认配置包含很多弱口令，所以不要放在公网访问
:::

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

Windows 请在 **PowerShell** 中执行，Linux 请在终端中执行。下面的步骤请在同一个终端中依次完成。

### 1. 克隆项目并创建网络

```bash
# 克隆本项目
git clone https://github.com/hp0912/wechat-robot-client.git

# 进入部署目录，后续命令都在此目录下执行
cd ./wechat-robot-client/.deploy/local

# 如果以前没有创建过此 Docker 网络，先创建网络
docker network create wechat-robot
```

### 2. 生成并检查 HTTPS 证书

根据系统选择下面一种方式执行，将示例中的 `192.168.1.10` 替换为部署电脑的局域网 IP。

**Windows（PowerShell）**

```powershell
# 生成证书
powershell -NoProfile -ExecutionPolicy Bypass -File .\gen-self-signed-cert.ps1 -IpAddresses 192.168.1.10

# 检查证书和私钥是否存在，以及文件大小
Get-Item .\secrets\nginx\tls.crt, .\secrets\nginx\tls.key -ErrorAction Stop |
  Select-Object Name, Length
```

**Linux**

```bash
# 生成证书
sh ./gen-self-signed-cert.sh --ip 192.168.1.10

# 检查证书和私钥是否存在，以及文件大小
ls -l ./secrets/nginx/tls.crt ./secrets/nginx/tls.key
```

检查结果必须同时包含 `tls.crt` 和 `tls.key` 两个文件，且文件大小都不为 `0`。

### 3. 启动容器

下面两个命令选择一个执行：

```bash
docker compose up -d

# 如果上面的命令不可用，使用这个命令
docker-compose up -d
```

::: info 温馨提示
如果拉镜像失败，请确认 docker 是否设置代理，并尝试逐个手动拉取镜像，个别镜像体积较大，批量拉容易失败
:::

## 访问管理后台

浏览器访问`https://127.0.0.1:8443`，登录密钥`12345678`

## 创建机器人

- 点击右上角`创建机器人`按钮，新建一个机器人实例，创建时间可能会比较长，请耐心等待

- 创建完成后，机器人列表会出现机器人卡片，点击卡片右上角的扫码登录按钮，选择扫码登录方式

- 推荐使用 iPad 登录，登录不上再使用 Mac 登录，不要使用车载微信登录，拉 docker 镜像、克隆代码的时候如果开了梯子，扫码的时候记得把梯子关了，你会设置腾讯域名白名单，可以开着梯子，否则扫码登录后都不能开梯子。

- 扫码的时候，把同步最近消息取消勾选，因为机器人默认开启 AI 聊天，如果勾选同步历史消息，历史消息会触发 AI 聊天，导致刷屏。

- 登录成功后，即可点击下面一排按钮中的第一个，进入机器人详情界面，进行自定义配置

- 风控建议
  - 注册两年以上的小号，登录后挂机四小时
  - 注册半年以上的小号，挂机三天
  - 刚注册的小号，挂机一个月

## 特别注意

::: danger 登录方式
目前只有`iPad`和`Mac`登录方式是稳定的，其他登录方式要么不可用要么容易封号。`Mac`登录方式如果需要过滑块，进交流群发送`#过滑块密钥`获取最新密钥，解决 401 的问题(密钥过期了)。
:::

::: danger 弱口令警告
默认配置包含很多弱口令，所以不要放在公网访问
:::

## 后端接口文档

https://wechat-sz.houhoukang.com/api/v1/swagger/doc.json

## 扫码后手机上没有登录按钮怎么办？

这是触发了微信的人脸安全认证，这个时候微信管理后台的扫码弹窗会自动跳转到人脸认证界面，有一个人脸认证二维码，下方还有一个 `手机代理设置`。

1. 扫描人脸二维码必须用另外一个手机微信，登录机器人的那个手机微信里面的登录弹窗不能关闭，否则会导致人脸认证启动失败。

2. 用另外一个手机上的已登录微信(登录任意账号即可)，扫描人脸认证二维码，然后会在微信内打开一个网页，必须先按照网页上的 `手机代理设置` 的教程设置好手机代理，然后再点击最下方的 `开始人脸验证` 按钮进入人脸认证流程。
   - `手机代理设置` 下方有一个 `下载代理 CA 证书` 的按钮，点击下载并安装证书，如果安装失败，请点击 `复制证书下载地址` 按钮复制链接到手机浏览器打开，苹果手机请使用 Safari 浏览器打开
   - 安装完证书之后，必须设置信任证书，然后配置代理，下面是苹果手机的安装证书、信任证书、设置代理的详细步骤，安卓手机需要使用 VPN，步骤略。
   - 证书和代理设置好了之后，就可以扫描人脸认证二维码了，按提示操作即可，通过了人脸认证之后会有一个下一步，点击没反应，不管它，切换到登录机器人的那个微信，这个时候登录弹窗应该出现了确认按钮，点击确定，管理后台会自动进行后续步骤，直到登录成功。

安装并信任证书可以提前操作，iPhone 手机使用 Safari 浏览器打开 https://wechat-sz.houhoukang.com/api/v1/robot/login/pad-face-ca 下载证书并安装。

<table>
  <tbody>
    <tr>
      <td>
        <img src="../assets/ipad-face/ca-install.png" alt="CA 证书安装" />
      </td>
      <td>
        <img src="../assets/ipad-face/ca-install-2.png" alt="CA 证书安装" />
      </td>
      <td>
        <img src="../assets/ipad-face/ca-trust.png" alt="CA 证书信任" />
      </td>
      <td>
        <img src="../assets/ipad-face/proxy-entry.png" alt="代理入口" />
      </td>
      <td>
        <img src="../assets/ipad-face/proxy-entry-2.png" alt="代理入口" />
      </td>
      <td>
        <img src="../assets/ipad-face/proxy-setting.png" alt="代理设置" />
      </td>
    </tr>
  </tbody>
</table>

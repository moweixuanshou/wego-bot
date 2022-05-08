#WEGO-BOT

## 概述

wego是一款把个人微信号变成微信机器人的应用，使用一种自由的任务编排体系，可以根据实际需求构建任务流，旨在为微信用户提供全面自由的服务

- 高效的联系人群组管理功能
- 高度定制化的任务流框架
- 各种各样功能丰富的任务卡
- win本地微信便捷登录

## 依赖环境

- windows
- wechat-3.3.0

## 快速开始

```shell
git clone https://github.com/Mr-lay/wego-bot.git

npm install

npm run rebuild  # 为electron编译相关包

npm run dev
```

wego采用electron开发构建，目前还有相当多不完善的地方，但是会慢慢完善，后续也会提供打包好的win安装包，请关注项目，给一个star，不胜感激

## 目录结构

```
├─main
│      bot.ts
│      index.ts
│      Subject.ts
│      Task.ts
│      TaskFlow.ts
├─preload
└─renderer
    │  index.html
    ├─public
    │  └─images
    └─src
        │  App.vue
        │  main.ts
        │  router.ts
        │  store.ts
        ├─assets
        ├─common
        ├─components  
        └─ts
```

## 项目预览

欢迎界面
![img.png](https://gitee.com/git_for_li/image-repo/raw/master/images/img.png)

主界面
![img_1.png](https://gitee.com/git_for_li/image-repo/raw/master/images/img_1.png)

联系人管理
![img_2.png](https://gitee.com/git_for_li/image-repo/raw/master/images/img_2.png)

群组管理
![img_3.png](https://gitee.com/git_for_li/image-repo/raw/master/images/img_3.png)

任务流管理
![img_4.png](https://gitee.com/git_for_li/image-repo/raw/master/images/img_4.png)

任务流编辑
![img_5.png](https://gitee.com/git_for_li/image-repo/raw/master/images/img_5.png)

## 任务流示例

拖拽任务卡到画板上，点击锚点连线

![编排任务流](https://gitee.com/git_for_li/image-repo/raw/master/images/%E7%BC%96%E6%8E%92%E4%BB%BB%E5%8A%A1%E6%B5%81_.gif)

点击节点，设置输入参数

![设置参数](https://gitee.com/git_for_li/image-repo/raw/master/images/%E4%BF%AE%E6%94%B9%E9%85%8D%E7%BD%AE_.gif)

保存后运行，查看结果

![结果](https://gitee.com/git_for_li/image-repo/raw/master/images/6a8e8d952600247abce9a7ef21d2242.png)

美化功能，可以一键自动布局

![美化](https://gitee.com/git_for_li/image-repo/raw/master/images/%E7%BE%8E%E5%8C%96_.gif)

## 其他功能示例

wego依靠其强大的自研任务流构建框架和各种各样功能丰富的任务卡几乎可以实现绝大多数需求，虽然现在任务卡功能仍然不全面，但是随着项目开发，wego会变得越来越强大。如果感兴趣，请点一个star，也可以联系我，加入wego的开发中。

下面是一些任务流构建举例，可以根据实际需求调整。
### 天行API
接入天行API后可以实现百科、翻译、新闻、天气等等功能
![](https://gitee.com/git_for_li/image-repo/raw/master/images/20220508231251.png)
### 定时推送任务
加入定时器后，可以配置定时任务，满足条件后触发，实现定时发送消息功能。
![](https://gitee.com/git_for_li/image-repo/raw/master/images/20220508231309.png)
### 群消息转发
监听一个群的消息，然后发送到另一个群中。
![](https://gitee.com/git_for_li/image-repo/raw/master/images/20220508231314.png)
### 自动发送群邀请
监听加群申请，发送群邀请
![](https://gitee.com/git_for_li/image-repo/raw/master/images/20220508231318.png)
### 自动发送群邀请
监听加群申请，发送群邀请
![](https://gitee.com/git_for_li/image-repo/raw/master/images/20220508231323.png)
### 联系人信息收集
向一个联系人组群发要收集的信息的问题，然后监听消息，把收到的结果汇总到消息汇总节点，可查看导出消息列表。
![](https://gitee.com/git_for_li/image-repo/raw/master/images/20220508231328.png)
### 小助手订阅
小助手订阅功能，定时推送消息的高级版本，向用户发送支持的订阅模块，监听用户的关键字，匹配对应模块，通知用户订阅成功，然后进入定时任务。
![](https://gitee.com/git_for_li/image-repo/raw/master/images/20220508231332.png)
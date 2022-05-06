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
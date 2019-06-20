# vue-elemtny-admin-cognito

> 參考使用PanJiaChen 大大的 vue-element-admin 樣板實作 aws cognito 登入
> 源自（https://github.com/PanJiaChen/vue-admin-template）


## Build Setup

```bash
# clone the project
git clone

# enter the project directory
cd vue-cognito-element-admin

# Set env
VUE_APP_COGNITO_BASE_URL = ''
VUE_APP_COGNITO_USERPOOL_ID = 'ap-southeast-1_XXXXXX'
VUE_APP_COGNITO_IDENTITY_POOL_ID = 'ap-southeast-1:XXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXX'
VUE_APP_COGNITO_CLIENT_ID = '1plmxxxxxxxxxxxxxxx'
VUE_APP_COGNITO_REGION = 'ap-southeast-1'


# install dependency
yarn install

# develop
yarn run dev
```

This will automatically open http://localhost:9527

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

Copyright (c) 2019-present Louis Ko

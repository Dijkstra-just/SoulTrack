<template>
  <div id="position_demo"></div>
</template>

<script setup lang="ts">
const cozeWebSDK = new CozeWebSDK.WebChatClient({
  config: {
    // 智能体 ID
    botId: '7503914042403569664',
  },
  auth: {
    //鉴权方式，默认type 为unauth，表示不鉴权；建议设置为 token，表示通过PAT或OAuth鉴权
    type: 'token',
    //type 为 token 时，需要设置PAT或OAuth访问密钥
    token: 'pat_y5s1ZZdTk6mVJWAaKUyDjionejhJMNYgqCqPBco1ovC35SCYfsct1VR0iEiNX7eU',
    //访问密钥过期时，使用的新密钥，可以按需设置。
    onRefreshToken: () => '',
  },
  userInfo: {
    url: '/user/jhd.jpg',
    nickname: 'Dijkstra',
  },
  ui: {
    base: {
      icon: '/user/logo.png',
      // icon: '/user/jhd.jpg',
    },
    chatBot: {
      title: 'SoulTracker',
      uploadable: true,
    },
    footer: {
      isShow: true,
      expressionText: 'Powered by {{name1}} & {{name2}}',
      linkvars: {
        name1: {
          text: 'Dijkstra',
          link: 'love.dijkstra-jhd.cn',
        },
        name2: {
          text: 'RSB美少女战队',
          link: 'baidu.com',
        },
      },
    },
    header: {
      isShow: true,
      // icon: '/user/logo.png',
    },
  },
})
</script>

<style scoped>
#position_demo {
  position: absolute;
  right: 10px;
  bottom: 20px;
}
</style>

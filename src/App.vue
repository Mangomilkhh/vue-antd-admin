<template>
  <a-config-provider :locale="locale" :get-popup-container="popContainer">
    <router-view/>
  </a-config-provider>
</template>

<script>
import {enquireScreen} from './utils/util'
import {mapState, mapMutations} from 'vuex'
import themeUtil from '@/utils/themeUtil';
import {getI18nKey} from '@/utils/routerUtil'

export default {
  name: 'App',
  data() {
    return {
      locale: {}
    }
  },
  created () {
    this.setHtmlTitle()
    this.setLanguage(this.lang)
    enquireScreen(isMobile => this.setDevice(isMobile))
  },
  mounted() {
   this.setWeekModeTheme(this.weekMode)
   console.tag = function(key,value){ console.log( `%c ${key} %c ${value} `, "color:white;background-color:#5f5f5f;padding: 3px;border-radius: 5px 0px 0px 5px;;font-family: 'pingfang SC','helvetica neue',arial,'hiragino sans gb','microsoft yahei ui','microsoft yahei',simsun,sans-serif;", "color:white;background-color:#1384c4;border-radius: 0px 5px 6px 0px;;font-family: 'pingfang SC','helvetica neue',arial,'hiragino sans gb','microsoft yahei ui','microsoft yahei',simsun,sans-serif;padding: 3px;" ); }
   console.tag("vue","2.6.11")
  },
  watch: {
    weekMode(val) {
      this.setWeekModeTheme(val)
    },
    lang(val) {
      this.setLanguage(val)
      this.setHtmlTitle()
    },
    $route() {
      this.setHtmlTitle()
    },
    'theme.mode': function(val) {
      let closeMessage = this.$message.loading(`您选择了主题模式 ${val}, 正在切换...`)
      themeUtil.changeThemeColor(this.theme.color, val).then(closeMessage)
    },
    'theme.color': function(val) {
      let closeMessage = this.$message.loading(`您选择了主题色 ${val}, 正在切换...`)
      themeUtil.changeThemeColor(val, this.theme.mode).then(closeMessage)
    },
    'layout': function() {
      window.dispatchEvent(new Event('resize'))
    }
  },
  computed: {
    ...mapState('setting', ['layout', 'theme', 'weekMode', 'lang'])
  },
  methods: {
    ...mapMutations('setting', ['setDevice']),
    setWeekModeTheme(weekMode) {
      if (weekMode) {
        document.body.classList.add('week-mode')
      } else {
        document.body.classList.remove('week-mode')
      }
    },
    setLanguage(lang) {
      this.$i18n.locale = lang
      switch (lang) {
        case 'CN':
          this.locale = require('ant-design-vue/es/locale-provider/zh_CN').default
          break
        case 'HK':
          this.locale = require('ant-design-vue/es/locale-provider/zh_TW').default
          break
        case 'US':
        default:
          this.locale = require('ant-design-vue/es/locale-provider/en_US').default
          break
      }
    },
    setHtmlTitle() {
      const route = this.$route
      const key = route.path === '/' ? 'home.name' : getI18nKey(route.matched[route.matched.length - 1].path)
      document.title = process.env.VUE_APP_NAME + ' | ' + this.$t(key)
    },
    popContainer() {
      return document.getElementById("popContainer")
    }
  }
}
</script>

<style lang="less" scoped>
  #id{
  }
</style>

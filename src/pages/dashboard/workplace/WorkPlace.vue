<template>
  <!-- 首页dashboard：工作台 -->
  <page-layout :avatar="currUser.avatar">
    <div slot="headerContent">
      <div class="title">{{ welcome.timeFix[lang] }}，{{ currUser.name }}，{{ welcome.message[lang] }}</div>
      <div>{{ currUser.position[lang] }}</div>
    </div>
    <template slot="extra">
      <head-info class="split-right" :title="$t('project')" content="56" />
      <head-info class="split-right" :title="$t('ranking')" content="8/24" />
      <head-info class="split-right" :title="$t('visit')" content="2,223" />
    </template>
    <template>
      <a-row style="margin: 0 -12px">
        <a-col style="padding: 0 12px" :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="project-list" :loading="loading" style="margin-bottom: 24px;" :bordered="false"
            :title="$t('progress')" :body-style="{ padding: 0 }">
            <a slot="extra">{{ $t('all') }}</a>
            <div>
              <a-card-grid :key="i" v-for="(item, i) in projects">
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta :description="item.desc">
                    <div slot="title" class="card-title">
                      <a-avatar size="small" :src="item.logo" />
                      <span>Alipay</span>
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <a class="group" href="/#/">科学搬砖组</a>
                    <span class="datetime">9小时前</span>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>
          <a-card :loading="loading" :title="$t('dynamic')" :bordered="false">
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in activities">
                <a-list-item-meta>
                  <a-avatar slot="avatar" :src="item.user.avatar" />
                  <div slot="title" v-html="item.template" />
                  <div slot="description">9小时前</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col style="padding: 0 12px" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">

          <a-card title="留言板" size="small" style="margin-bottom: 24px">
            <div class="board">
              <a-divider style="margin: 8px 0;font-size: 14px">5月26日</a-divider>
              <div v-for="(item, index) in boardList" :key="index"
                style="display: flex;align-items: flex-start;margin-bottom: 8px;">
                <div><a-avatar style="color: #ee4d2d; backgroundColor: #fde3cf;margin-right: 10px;">U</a-avatar></div>
                <div>lydia.li
                  <span style="color: #b5b5b5;margin-left: 10px;font-size: 12px;"> 上午8:43 </span>
                  <div class="chatContent">{{ item }}</div>
                </div>
              </div>

              <div style="position: relative;left: 42px;float: left;">
                <div v-for="(item, index) in boardList2" :key="index"
                  style="display: flex;align-items: flex-start;margin-bottom: 8px;">
                  <div><a-avatar style="color: #ee4d2d; backgroundColor: #fde3cf;margin-right: 10px;">U</a-avatar></div>
                  <div>lydia.li
                    <span style="color: #b5b5b5;margin-left: 10px;font-size: 12px;"> 上午8:43 </span>
                    <div class="chatContent">{{ item }}</div>
                  </div>
                </div>
              </div>

              <a-divider style="margin: 8px 0;font-size: 14px">今天</a-divider>
            </div>
            <div class="inputContent">
              <a-textarea :auto-size="{ minRows: 2 }" class="textareaInput"
                placeholder="想反馈意见和吐槽，或是wish list都可以，欢迎留言呀～" />
              <!-- <a-icon type="smile" :style="{ fontSize: '10px', color: '#ee4d2d' }"></a-icon> -->
              <a-button type="primary" size="small">发表</a-button>
            </div>
          </a-card>

          <a-card :title="$t('access')" style="margin-bottom: 24px" :bordered="false" :body-style="{ padding: 0 }">
            <div class="item-group">
              <a>操作一</a>
              <a>操作二</a>
              <a>操作三</a>
              <a>操作四</a>
              <a>操作五</a>
              <a>操作六</a>
              <a-button size="small" type="primary" ghost icon="plus">{{ $t('add') }}</a-button>
            </div>
          </a-card>
          <a-card :loading="loading" :title="`XX ${$t('degree')}`" style="margin-bottom: 24px" :bordered="false"
            :body-style="{ padding: 0 }">
            <div style="min-height: 400px;">
              <radar />
            </div>
          </a-card>
          <a-card :loading="loading" :title="$t('team')" :bordered="false">
            <div class="members">
              <a-row>
                <a-col :span="12" v-for="(item, index) in teams" :key="index">
                  <a>
                    <a-avatar size="small" :src="item.avatar" />
                    <span class="member">{{ item.name }}</span>
                  </a>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </template>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import HeadInfo from '@/components/tool/HeadInfo'
import Radar from '@/components/chart/Radar'
import { mapState } from 'vuex'
import { request, METHOD } from '@/utils/request'

export default {
  name: 'WorkPlace',
  components: { Radar, HeadInfo, PageLayout },
  i18n: require('./i18n'),
  data() {
    return {
      projects: [],
      loading: true,
      activities: [],
      teams: [],
      welcome: {
        timeFix: '',
        message: ''
      },
      boardList: [
        '4324🤯23435435', '哈哈哈哈哈哈哈哈哈🤪',
        '今天是Hison.Liu的生日，祝ta生日快乐～！今天是Hison.Liu的生日。今天是Hison.Liu的生日！'
      ],
      boardList2: [
        '哈哈哈哈哈',
        '我爱工作啊😘'
      ],
    }
  },
  computed: {
    ...mapState('account', { currUser: 'user' }),
    ...mapState('setting', ['lang'])
  },
  created() {
    request('/user/welcome', METHOD.GET).then(res => this.welcome = res.data)
    request('/work/activity', METHOD.GET).then(res => this.activities = res.data)
    request('/work/team', METHOD.GET).then(res => this.teams = res.data)
    request('/project', METHOD.GET).then(res => {
      this.projects = res.data
      this.loading = false
    })

    //vue监听scroll事件 别忘记加true
    window.addEventListener('scroll', this.handleScroll, true);
  },
  methods:{
    // handleScroll($event) {
      // 此处处理滚动事件
      // console.log('页面正在滚动',$event);
      
      // 示例：判断页面是否滚动到底部
      // const isBottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
      // if (isBottom) {
      //   console.log('已滚动到页面底部');
      //   // 这里可以执行到达底部时的操作
      // }
    // },
  }
}
</script>

<style lang="less">
@import "index";

.board {
  padding-right: 13px;
  overflow-x: auto;
  height: 360px;

  .anticon-like {
    margin: 0 4px 0 13px;
  }

  .chatContent {
    background-color: #fff5f0;
    border-radius: 8px;
    color: #222;
    display: block;
    font-size: 13px;
    line-height: 30px;
    padding: 0 12px;
    margin-bottom: 5px;
  }
}

.inputContent {
  margin-top: 10px;
  display: flex;
  align-items: flex-end;
  padding: 8px 8px 8px 12px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #e5e5e5;

  .textareaInput {
    border: none;
    resize: none;
    background: none
  }

  .ant-btn {
    margin-left: 10px;
  }
}

&::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px;
  height: 8px;
}

&::-webkit-scrollbar-thumb {
  /*滚动条里面的滑块*/
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.2);
}

&::-webkit-scrollbar-track {
  /*滚动条里面轨道背景*/
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.1);
}</style>

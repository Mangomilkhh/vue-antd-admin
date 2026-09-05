<template>
  <div>
    <p>query: {{$route.query}}</p>
    <p>params: {{$route.params}}</p>

    <div style="margin-top: 24px;">
      <h3>1. 扩展运算符能够实现浅拷贝</h3>
      <p>说明：用 <code>{ ...obj }</code> 复制对象时，只会复制第一层；如果对象里有嵌套对象，拷贝后的对象和原对象仍然共享同一个内层引用。</p>
      <p>适用场景：复制一个简单对象，快速生成新对象；但不要拿它来做“深拷贝”。</p>
      <p>{{ shallowCopyInfo }}</p>
      <p>原对象里 nested.name 改变后，拷贝对象是否跟着变：{{ shallowCopyResult }}</p>
    </div>

    <div style="margin-top: 24px;">
      <h3>2. 剩余参数 ...args 在函数参数中非常有用，可以替代过时的 arguments</h3>
      <p>说明：<code>...args</code> 会把传入函数的多个参数收集到一个数组中，适合参数不固定时使用。</p>
      <p>适用场景：封装通用函数、求和、日志打印、动态参数处理等。</p>
      <p>{{ restArgsInfo }}</p>
    </div>

    <div style="margin-top: 24px;">
      <h3>3. 解构赋值可以设置默认值，这在处理 API 返回数据时能有效防止“undefined 报错”</h3>
      <p>说明：从对象中取值时，可以直接写成 <code>{ name = '匿名用户', age = 18 }</code> 的形式；如果对象中没有这个字段，就会使用默认值。</p>
      <p>适用场景：接口返回字段可能缺失、配置项未提供时，给出兜底值，避免代码报错或出现 undefined。</p>
      <p>{{ destructuringInfo }}</p>
    </div>

    <div style="margin-top: 28px;">
      <h3>4. flex: grow shrink basis</h3>
      <p>flex: 1 1 200px; 表示 grow = 1, shrink = 1, basis = 200px</p>

      <div class="flex-demo-wrap">
        <div class="flex-item item-a">flex: 1 1 200px</div>
        <div class="flex-item item-b">flex: 2 1 150px</div>
        <div class="flex-item item-c">flex: 1 2 100px</div>
      </div>

      <div class="flex-legend">
        <div><span class="dot blue"></span> grow 更大，空间分配更多</div>
        <div><span class="dot green"></span> shrink 更大，压缩得更厉害</div>
        <div><span class="dot orange"></span> basis 是初始大小</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Demo',
    data () {
      return {
        shallowCopyInfo: '',
        shallowCopyResult: '',
        restArgsInfo: '',
        destructuringInfo: ''
      }
    },
    mounted () {
      this.showShallowCopy()
      this.showRestArgs()
      this.showDestructuringDefault()
    },
    methods: {
      showShallowCopy () {
        const source = {
          id: 1,
          name: 'demo',
          nested: {
            city: 'Beijing'
          }
        }

        const copy = { ...source }
        copy.nested.city = 'Shanghai'

        this.shallowCopyInfo = `source = ${JSON.stringify(source)}; copy = ${JSON.stringify(copy)}`
        this.shallowCopyResult = JSON.stringify({
          sameNestedRef: source.nested === copy.nested,
          sourceCity: source.nested.city,
          copyCity: copy.nested.city
        })
      },
      showRestArgs () {
        const add = (...args) => args.reduce((sum, item) => sum + item, 0)
        const result = add(1, 2, 3, 4, 5)

        this.restArgsInfo = `add(1, 2, 3, 4, 5) = ${result}`
      },
      showDestructuringDefault () {
        const apiData = {
          user: {
            name: 'Alice',
            profile: {
              city: 'Hangzhou'
            }
          }
        }

        const fallbackData = {}
        const {
          user: {
            name = '匿名用户',
            profile: { city = '未知城市' } = {},
            age = 18
          } = {}
        } = apiData

        const {
          user: {
            name: fallbackName = '默认名字',
            age: fallbackAge = 20,
            profile: { city: fallbackCity = '默认城市' } = {}
          } = {}
        } = fallbackData

        this.destructuringInfo = JSON.stringify({
          apiData: { name, city, age },
          fallbackData: { fallbackName, fallbackAge, fallbackCity }
        })
      }
    }
  }
</script>

<style scoped>
  h3 {
    margin-bottom: 8px;
    color: #1890ff;
  }

  p {
    margin: 6px 0;
    line-height: 1.7;
  }

  .flex-demo-wrap {
    display: flex;
    width: 100%;
    max-width: 760px;
    min-height: 120px;
    padding: 12px;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    background: #fafafa;
    box-sizing: border-box;
  }

  .flex-item {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    margin: 0 8px;
    border-radius: 6px;
    color: #fff;
    font-weight: 600;
    text-align: center;
    box-sizing: border-box;
  }

  .item-a {
    flex: 1 1 200px;
    background: linear-gradient(135deg, #40a9ff, #1890ff);
  }

  .item-b {
    flex: 2 1 150px;
    background: linear-gradient(135deg, #52c41a, #389e0d);
  }

  .item-c {
    flex: 1 2 100px;
    background: linear-gradient(135deg, #faad14, #d48806);
  }

  .flex-legend {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px 20px;
    color: #595959;
    font-size: 14px;
  }

  .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
    vertical-align: middle;
  }

  .blue {
    background: #1890ff;
  }

  .green {
    background: #52c41a;
  }

  .orange {
    background: #faad14;
  }
</style>

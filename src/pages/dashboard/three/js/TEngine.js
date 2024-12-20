import { WebGLRenderer, Scene, PerspectiveCamera, Vector3, MOUSE, Raycaster, Vector2 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'


export class ThreeEngine {

  dom = null; // 挂载的 DOM
  scene = null; // 场景

  constructor(dom) {
    // 3.创建渲染器,将渲染器添加到dom
    let renderer = new WebGLRenderer({
      antialias: true,  // 开启抗锯齿
    })
    dom.appendChild(renderer.domElement)  // 将渲染器挂载到dom
    renderer.setSize(dom.offsetWidth, dom.offsetHeight, true)
    
    // 1.实例化场景
    let scene = new Scene()  

    // 2.实例化相机
    let camera = new PerspectiveCamera(45, dom.offsetWidth / dom.offsetHeight, 1, 1000)  // 实例化相机
    camera.position.set(50, 50, 50) // 设置相机位置
    camera.lookAt(new Vector3(0, 0, 0))  // 设置相机看先中心点
    camera.up = new Vector3(0, 1, 0)  // 设置相机角度

    // renderer.setClearColor('rgb(239, 70, 1)')  // 设置渲染器的颜色
    // renderer.clearColor()   // 清空颜色
    renderer.render(scene, camera)  // 渲染器渲染场景和相机

    // 8.轨道控制器
    let orbitControls = new OrbitControls(camera, renderer.domElement)
    // orbitControls.update();
    orbitControls.mouseButtons = {  // 设置鼠标功能键（轨道控制器）
      LEFT: null,  // 左键无功能
      MIDDLE: MOUSE.DOLLY,  // 中键缩放
      RIGHT: MOUSE.ROTATE   // 右键旋转
    }

    // 初始化射线发射器
    let raycaster = new Raycaster()
    // 初始化变换控制器
    let transformControls = new TransformControls(camera, renderer.domElement)
    scene.add(transformControls) // 将变换控制器添加至场景

    let transing = false
    transformControls.addEventListener("mouseDown", () => {
      transing = true
    })

    // 初始化鼠标位置
    let mouse = new Vector2()
    let x = 0; let y = 0; let width = 0; let height = 0

    renderer.domElement.addEventListener("mousemove", event => {
      x = event.offsetX
      y = event.offsetY
      width = renderer.domElement.offsetWidth
      height = renderer.domElement.offsetHeight
      mouse.x = x / width * 2 - 1
      mouse.y = -y * 2 / height + 1

      raycaster.setFromCamera(mouse, camera)  // 配置射线发射器
      scene.remove(transformControls)  // 移除变换控制器
      const intersection = raycaster.intersectObjects(scene.children)
      if (intersection.length) {
        const object = intersection[0].object
        if (object !== this.cacheObject) {  // 如果当前物体不等于缓存的物体
          if (this.cacheObject) { // 如果有缓存物体先执行之前物体的离开事件
            this.cacheObject.dispatchEvent({
              type: 'mouseleave'
            })
          }
          object.dispatchEvent({  // 添加当前物体进入事件
            type: 'mouseenter'
          })
        } else if (object === this.cacheObject) {  // 如果当前物体等于缓存的物体
          object.dispatchEvent({  // 执行移动事件
            type: 'mousemove'
          })
        }
        this.cacheObject = object
      } else {
        if (this.cacheObject) {  // 如果有缓存物体就先执行离开事件
          this.cacheObject.dispatchEvent({
            type: 'mouseleave'
          })
        }
        this.cacheObject = null
      }
    })

    // 点击事件
    renderer.domElement.addEventListener("click", () => {
      if (transing) {
        transing = false
        return
      }
      scene.remove(transformControls) // 移除变换控制器
      transformControls.enabled = false // 停用变换控制器
      raycaster.setFromCamera(mouse, camera)  // 配置射线发射器，传递鼠标和相机对象
      const intersection = raycaster.intersectObjects(scene.children) // 获取射线发射器捕获的模型列表，传进去场景中所以模型，穿透的会返回我们
      if (intersection.length) {
        const object = intersection[0].object  // 获取第一个模型
        scene.add(transformControls) // 添加变换控制器
        transformControls.enabled = true // 启用变换控制器
        transformControls.attach(object)
      }
    })


    // 监听变换控制器模式更改
    document.addEventListener("keyup", event => {
      if (transformControls.enabled) {  // 变换控制器为启用状态执行
        if (event.key === 'e') { // 鼠标按下e键，模式改为缩放
          transformControls.mode = 'scale'
          return false
        }
        if (event.key === 'r') { // 鼠标按下r键，模式改为旋转
          transformControls.mode = 'rotate'
          return false
        }
        if (event.key === 't') { // 鼠标按下t键，模式改为平移
          transformControls.mode = 'translate'
          return false
        }
      }
    })

    // 创建关键帧动画，并渲染生成的场景和摄影机
    let animate = () => {
      renderer.render(scene, camera)  // 渲染器渲染场景和相机
      requestAnimationFrame(animate);
    }
    animate()

    this.dom = dom
    this.scene = scene
    console.log("渲染完成")
  }

  /**
   * 向场景中添加模型
   * @param  {...any} object 模型列表
   */
  addObject(...object) {
    object.forEach(elem => {
      this.scene.add(elem)
    })
  }

}
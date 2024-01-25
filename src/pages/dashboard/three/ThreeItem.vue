<template>
  <div class="three-canvas" ref="threeTarget"></div>
</template>

<script>
import { ThreeEngine } from "./js/TEngine";
import { allBaseObject } from "./js/TBaseObject";
import { allLights } from "./js/TLights";
import { allHelper } from "./js/THelper";

import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

/**
 * 9.添加hdr环境贴图
 */
// new RGBELoader().load("../resources/sky.hdr", function (texture) {
//   this.scene.background = texture;
//   texture.mapping = THREE.EquirectangularReflectionMapping;
//   this.scene.environment = texture;
//   this.renderer.outputEncoding = THREE.sRGBEncoding;
//   this.renderer.render(this.scene, this.camera);
// });

/**
 * 10.添加三维模型
 */
// let donuts;
// let mixer;
// new GLTFLoader().load("../resources/models/donuts.glb", (gltf) => {
//   console.log(gltf);
//   this.scene.add(gltf.this.scene);
//   donuts = gltf.scene;

//   mixer = new THREE.AnimationMixer(gltf.scene);
//   const clips = gltf.animations; // 播放所有动画
//   clips.forEach(function (clip) {
//     const action = mixer.clipAction(clip);
//     action.loop = THREE.LoopOnce;
//     // 停在最后一帧
//     action.clampWhenFinished = true;
//     action.play();
//   });
// });

export default {
  name: "ThreeItem",
  data() {
    return {
      ThreeEngine: null,
      scene: {},
      camera: {},
      renderer: {},
      // donuts,
      // mixer,
    };
  },
  mounted() {
    this.ThreeEngine = new ThreeEngine(this.$refs.threeTarget);
    // 创建几何体
    this.ThreeEngine.addObject(...allBaseObject);
    // 创建环境光
    this.ThreeEngine.addObject(...allLights);
    // 添加辅助
    this.ThreeEngine.addObject(...allHelper);

    // 1.实例化场景
    // this.scene = new THREE.Scene();
    // 2.实例化相机
    // this.setCamera();
    // // 3.创建渲染器,将渲染器添加到dom
    // this.setRenderer();
    // // 4.创建环境光
    // this.setLight();
    // // 5.创建几何体 （用于测试）
    // this.setBox();
    // // 6.创建关键帧动画，并渲染生成的场景和摄影机
    // this.renderCont();
    // // 7.放置相机位置，要不然是在物体里面重叠，一片黑
    // this.camera.position.set(0, 0, 2);
    // this.scene.add(this.camera);

    // const AxesHelper = new THREE.AxesHelper(5);
    // this.scene.add(AxesHelper);

    // // 8.控制器控制相机
    // const controls = new OrbitControls(this.camera, this.renderer.domElement);
    // controls.update();
  },
  methods: {
    setCamera() {
      this.camera = new THREE.PerspectiveCamera(
        75, // 广角
        window.innerWidth / window.innerHeight, // 压缩比
        0.01, // 场景的近距离锥体
        10 // 场景的远距离锥体
      );
    },
    setRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true, // 抗锯齿（开启就会消耗更多得性能）
      });
      // 设置渲染器大小
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      // 将渲染器添加到dom
      document.body.appendChild(this.renderer.domElement);
    },
    setLight() {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
      this.scene.add(ambientLight);
    },
    setBox() {
      const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
      const boxMaterial = new THREE.MeshBasicMaterial({
        color: 0xdedede,
      });
      const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
      this.scene.add(boxMesh);
    },
    renderCont() {
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.renderCont);
    },
  },
};
</script>

<style lang="less">
.three-canvas {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #d6eaff;

  canvas{
    height: 500px !important;
  }
}
</style>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import * as dat from "lil-gui";

// Debug
const gui = new dat.GUI();

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 28, 45);
const fontLoader = new FontLoader();
const material = new THREE.MeshNormalMaterial();
// material.wireframe = true;
// 文本参数配置
const textParameters = {
  text: "HallowLemon 3D Text",
  size: 0.5,
  depth: 0.15,
  curveSegments: 12,
  bevelEnabled: true,
  bevelThickness: 0.001,
  bevelSize: 0.01,
  bevelOffset: 0,
  bevelSegments: 5,
};

// 创建文本几何体的函数
let textMesh = null;
const createText = (font) => {
  // 如果已存在文本网格，则从场景中移除
  if (textMesh !== null) {
    scene.remove(textMesh);
  }

  // 创建新的文本几何体
  const textGeometry = new TextGeometry(textParameters.text, {
    font,
    size: textParameters.size,
    depth: textParameters.depth,
    curveSegments: textParameters.curveSegments,
    bevelEnabled: textParameters.bevelEnabled,
    bevelThickness: textParameters.bevelThickness,
    bevelSize: textParameters.bevelSize,
    bevelSegments: textParameters.bevelSegments,
  });

  textGeometry.center();
  textMesh = new THREE.Mesh(textGeometry, material);
  scene.add(textMesh);
};

// 加载字体并设置GUI控制
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  createText(font);

  // 添加GUI控制
  const textFolder = gui.addFolder("文本设置");
  textFolder.add(textParameters, "text").onChange(() => createText(font));
  textFolder
    .add(textParameters, "depth", 0, 1, 0.01)
    .onChange(() => createText(font));
  textFolder
    .add(textParameters, "size", 0.1, 5)
    .onChange(() => createText(font));
  textFolder
    .add(textParameters, "curveSegments", 1, 20, 1)
    .onChange(() => createText(font));
  textFolder
    .add(textParameters, "bevelEnabled")
    .onChange(() => createText(font));
  textFolder
    .add(textParameters, "bevelThickness", 0.01, 0.5)
    .onChange(() => createText(font));
  textFolder
    .add(textParameters, "bevelSize", 0.01, 0.5)
    .onChange(() => createText(font));
  textFolder
    .add(textParameters, "bevelSegments", 1, 10, 1)
    .onChange(() => createText(font));
  textFolder.open();
});

for (let i = 0; i < 100; i++) {
  const torus = new THREE.Mesh(torusGeometry, material);
  torus.position.x = (Math.random() - 0.5) * 10;
  torus.position.y = (Math.random() - 0.5) * 10;
  torus.position.z = (Math.random() - 0.5) * 10;
  torus.rotation.x = Math.random() * Math.PI;
  torus.rotation.y = Math.random() * Math.PI;
  const scale = Math.random();
  torus.scale.set(scale, scale, scale);
  scene.add(torus);
}
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

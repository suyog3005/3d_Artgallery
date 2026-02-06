import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/Addons.js';
import {Tween, Easing, update as updateTween} from 'tween';



const images = [
  'socrates.jpg',
  'stars.jpg',
  'wave.jpg',
  'spring.jpg',
  'mountain.jpg',
  'sunday.jpg'
];

const titles = [
  'The Death of Socrates',
  'Starry Night',
  'The Great Wave off Kanagawa',
  'Effect of Spring, Giverny',
  'Mount Corcoran',
  'A Sunday on La Grande Jatte'
];

const artists = [
  'Jacques-Louis David',
  'Vincent Van Gogh',
  'Katsushika Hokusai',
  'Claude Monet',
  'Albert Bierstadt',
  'George Seurat'
];

const textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const rootNode = new THREE.Object3D();
scene.add(rootNode);

const leftArrrowTexture = textureLoader.load('left.png');
const rightArrowTexture = textureLoader.load('right.png');

let count  = 6;
for (let i = 0; i < count; i++) {
    const texture = textureLoader.load(images[i]);
    texture.colorSpace = THREE.SRGBColorSpace;

    const baseNode = new THREE.Object3D();
    baseNode.rotation.y = i * (2 * Math.PI / count);
    rootNode.add(baseNode);

    const border  = new THREE.Mesh(
        new THREE.BoxGeometry( 3.2, 2.2, 0.1 ),
        new THREE.MeshStandardMaterial( { color: 0xFFFFFF } )
    )
    border.position.z = -4.01;
    baseNode.add(border);
    border.name = `Border_${i}`;

    const artwork = new THREE.Mesh(
        new THREE.BoxGeometry( 3, 2, 0.1 ),
        new THREE.MeshStandardMaterial( { map: texture} )
        
    )
    artwork.name = `Art_${i}`;
    artwork.position.z = -4;
    baseNode.add(artwork);

    const leftArrow = new THREE.Mesh(
        new THREE.BoxGeometry( 0.3, 0.3, 0.01 ),
        new THREE.MeshStandardMaterial( { map: leftArrrowTexture, transparent: true } )
    )
    leftArrow.position.set(-1.8, 0, -4);
    baseNode.add(leftArrow);
    leftArrow.name = `LeftArrow`;

    const rightArrow = new THREE.Mesh(
        new THREE.BoxGeometry( 0.3, 0.3, 0.01 ),
        new THREE.MeshStandardMaterial( { map: rightArrowTexture, transparent: true } )
    )
    rightArrow.position.set(1.8, 0, -4);
    baseNode.add(rightArrow);
    rightArrow.name = `RightArrow`;

    
    
}

function rotateGallery(direction){
    const deltaY = direction * (2 * Math.PI / count);

    new Tween(rootNode.rotation)
    .to({ y: rootNode.rotation.y + deltaY })
    .easing(Easing.Quadratic.InOut).start();


}



const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );


camera.position.z = 4;

const spotlight = new THREE.SpotLight( 0xffffff, 100, 10, 0.68, 0.6 );
spotlight.position.set( 0, 5, 0 );
spotlight.target.position.set( 0, 1, -5 );
scene.add( spotlight );
scene.add( spotlight.target );



const mirror = new Reflector( 
    new THREE.CircleGeometry( 12 ),
    {
        color: 0x404040,
      textureWidth: window.innerWidth,
      textureHeight: window.innerHeight
   });
mirror.position.y = -1.3;
mirror.rotateX( - Math.PI / 2 );
scene.add( mirror );

function animate() {
    updateTween();
  renderer.render( scene, camera );

}

window.addEventListener('resize', () => {
  
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

});

window.addEventListener('click', (event) => {
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera( mouseNDC, camera );
    const intersections = raycaster.intersectObject(rootNode, true);

    if(intersections.length > 0) {
        console.log(intersections[0].object.name);
        if(intersections[0].object.name === 'LeftArrow'){
           rotateGallery(1);
        }
        if(intersections[0].object.name === 'RightArrow'){
            rotateGallery(-1);
        }
    }

});



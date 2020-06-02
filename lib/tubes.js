//------------------------------------------INISIALISASI-----------------------------------------------
let scene = new THREE.Scene();
let cam = new THREE.PerspectiveCamera(55, window.innerWidth / innerHeight, 45, 30000);
let renderer = new THREE.WebGLRenderer();

let player = { height: 1.8, speed: 10, turnSpeed: Math.PI * 0.02 };

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

cam.position.set(-500, 2500, -1500);
cam.lookAt(new THREE.Vector3(0, player.height, 0));

scene.fog = new THREE.FogExp2(0x10388c, 0.00015);
//------------------------------------------AKHIR DARI INISIALISASI-----------------------------------------------

//------------------------------------------CONTROL-----------------------------------------------
let FPClocc = new THREE.Clock();
let clocc = new THREE.Clock();
let controls = new THREE.FlyControls(cam, renderer.domElement);
let FirstPerson = new THREE.FirstPersonControls(cam, renderer.domElement);

controls.autoForward = false;
controls.movementSpeed = 500;
controls.rollSpeed = 0.1;
FirstPerson.lookSpeed = 0.2;
FirstPerson.mouseDragOn = false;
// FirstPerson.movementSpeed = 500;
// controls.addEventListener('change', renderer);
// controls.minDistance = 500;
// controls.maxDistance = 1500;
//------------------------------------------AKHIR DARI CONTROL-----------------------------------------------

//------------------------------------------PARTIKEL (GELEMBUNG)-----------------------------------------------
var particles = new THREE.Geometry;
for (var p = 0; p < 15000; p++) {
    var particle = new THREE.Vector3(Math.random() * 15000 - 4000, Math.random() * 8000 - 4000, Math.random() * 15000 - 4000);
    particles.vertices.push(particle);
}
var particleTexture = new THREE.TextureLoader().load('particles/air.png');
var particleMaterial = new THREE.ParticleBasicMaterial({ color: 0xeeeeee, map: particleTexture, size: 20, transparent: true, blending: THREE.AdditiveBlending, fog: false });
var particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
scene.add(particleSystem); //ref ywang170 github
//------------------------------------------AKHIR DARI PARTIKEL-----------------------------------------------


//------------------------------------------MATAHARI DAN CAHAYANYA-----------------------------------------------
let directionalLight = new THREE.DirectionalLight(0xffccaa, 3);
directionalLight.position.set(2000, 3500, -2000);
scene.add(directionalLight);

//matahareeeeee
let pGeo = new THREE.Geometry();
let circleGeo = new THREE.SphereGeometry(500, 50, 50);
let circleMat = new THREE.MeshBasicMaterial({ color: 0xffccaa });
let circle = new THREE.Mesh(circleGeo, circleMat);
circle.position.set(2000, 4500, -2000)
circle.scale.setX(1.2);
circle.rotation.y = 0.5;
scene.add(circle);

let areaImage = new Image();
areaImage.src = POSTPROCESSING.SMAAEffect.areaImageDataURL;
let searchImage = new Image();
searchImage.src = POSTPROCESSING.SMAAEffect.searchImageDataURL;
let smaaEffect = new POSTPROCESSING.SMAAEffect(searchImage, areaImage, 1);

let godraysEffect = new POSTPROCESSING.GodRaysEffect(cam, circle, {
    resolutionScale: 1,
    density: 0.8,
    decay: 0.95,
    weight: 0.9,
    samples: 100
});



//------------------------------------------AKHIR DARI MATAHARI DAN CAHAYANYA-----------------------------------------------


var composer;
var effect, effect2, effect3, effect4;

composer = new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene, cam));

effect = new THREE.ShaderPass(THREE.VergilWaterShader);
effect.uniforms['centerX'].value = 0.8;
effect.uniforms['centerY'].value = 0.8;
composer.addPass(effect);
effect2 = new THREE.ShaderPass(THREE.VergilWaterShader);
effect2.uniforms['centerX'].value = 0.2;
effect2.uniforms['centerY'].value = 0.2;
composer.addPass(effect2);
effect3 = new THREE.ShaderPass(THREE.VergilWaterShader);
effect3.uniforms['centerX'].value = 0.2;
effect3.uniforms['centerY'].value = 0.8;
composer.addPass(effect3);
effect4 = new THREE.ShaderPass(THREE.VergilWaterShader);
effect4.uniforms['centerX'].value = 0.8;
effect4.uniforms['centerY'].value = 0.2;
effect4.renderToScreen = true;
composer.addPass(effect4);



let renderPass = new POSTPROCESSING.RenderPass(scene, cam);
let effectPass = new POSTPROCESSING.EffectPass(cam, godraysEffect);
effectPass.renderToScreen = true;

composer = new POSTPROCESSING.EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(effectPass);

//------------------------------------------DUNIA-----------------------------------------------
let materialArray = [];
let texture_ft = new THREE.TextureLoader().load('skybox/uw_ft.jpg');
let texture_bk = new THREE.TextureLoader().load('skybox/uw_bk.jpg');
let texture_up = new THREE.TextureLoader().load('skybox/uw_up.jpg');
let texture_dn = new THREE.TextureLoader().load('skybox/uw_dn.jpg');
let texture_rt = new THREE.TextureLoader().load('skybox/uw_rt.jpg');
let texture_lf = new THREE.TextureLoader().load('skybox/uw_lf.jpg');

materialArray.push(new THREE.MeshBasicMaterial({
    map: texture_ft
}));
materialArray.push(new THREE.MeshBasicMaterial({
    map: texture_bk
}));
materialArray.push(new THREE.MeshBasicMaterial({
    map: texture_up
}));
materialArray.push(new THREE.MeshBasicMaterial({
    map: texture_dn
}));
materialArray.push(new THREE.MeshBasicMaterial({
    map: texture_rt
}));
materialArray.push(new THREE.MeshBasicMaterial({
    map: texture_lf
}));

for (let i = 0; i < 6; i++)
    materialArray[i].side = THREE.BackSide;

let seaGeo = new THREE.BoxGeometry(10000, 10000, 10000);
let seaMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
let seabox = new THREE.Mesh(seaGeo, materialArray);
scene.add(seabox);
//------------------------------------------AKHIR DARI DUNIA-----------------------------------------------



//------------------------------------------MODEL MODEL-----------------------------------------------
let animationClown, mixerClown;
let loaderClown = new THREE.GLTFLoader();
loaderClown.load('model/clown_fish/scene.gltf', function (ikanBadut) {
    animationClown = ikanBadut.animations;
    mixerClown = new THREE.AnimationMixer(ikanBadut.scene);
    let actionClown = mixerClown.clipAction(animationClown[0]);
    actionClown.play();
    let ikan = ikanBadut.scene.children[0];
    ikan.scale.set(20.0, 20.0, 20.0);
    scene.add(ikan);
});

let animationOrca, mixerOrca;
let loaderOrca = new THREE.GLTFLoader();
loaderOrca.load('model/female_orca/scene.gltf', function (pausOrca) {
    animationOrca = pausOrca.animations;
    mixerOrca = new THREE.AnimationMixer(pausOrca.scene);
    let actionOrca = mixerOrca.clipAction(animationOrca[0]);
    actionOrca.play();
    let paus = pausOrca.scene.children[0];
    paus.scale.set(60.0, 60.0, 60.0);
    paus.position.set(1500, 3000, 0);
    scene.add(paus);

    let taimlain2 = gsap.timeline({ repeat: -1, smoothChildTiming: false });
    taimlain2.to(paus.position, { z: 3500, duration: 4 });
    taimlain2.to(paus.rotation, { z: 1.5, duration: 3, delay: -2 });
    taimlain2.to(paus.position, { x: 3500, duration: 4, delay: -3 });
    taimlain2.to(paus.rotation, { z: 3.2, duration: 2, delay: -3 });
    taimlain2.to(paus.position, { z: -3500, duration: 8, delay: -3 });
    taimlain2.to(paus.rotation, { z: 4.8, duration: 2, delay: -3 });
    taimlain2.to(paus.position, { x: 1500, duration: 4, delay: -3 });
    taimlain2.to(paus.rotation, { z: 6.4, duration: 2, delay: -3 });
    taimlain2.to(paus.position, { z: 0, duration: 4, delay: -3 });

});

let animationDolphin, mixerDolphin;

let loaderDolphin = new THREE.GLTFLoader();
loaderDolphin.load('model/dolphin/scene.gltf', function (ikanDolphin) {
    animationDolphin = ikanDolphin.animations;
    mixerDolphin = new THREE.AnimationMixer(ikanDolphin.scene);
    let actionDolphin = mixerDolphin.clipAction(animationDolphin[0]);
    actionDolphin.play();
    let Dolphin = ikanDolphin.scene.children[0];
    Dolphin.scale.set(500.0, 500.0, 500.0);
    // Dolphin.rotation.Y = 180; mau muterin
    Dolphin.position.set(950, 0, 0);
    scene.add(Dolphin);
    let taimlainDolphin = gsap.timeline({repeat:-1, smoothChildTiming: false});
    taimlainDolphin.to(Dolphin.position, { z: 1500, duration: 2});
    taimlainDolphin.to(Dolphin.rotation, { z: -1.6, duration : 3, delay: -1});
    taimlainDolphin.to(Dolphin.position, { x: -1500, duration : 3, delay : -2});
    taimlainDolphin.to(Dolphin.rotation, { z: -3.2, duration : 2, delay: -1});
    taimlainDolphin.to(Dolphin.rotation, { z: -4.0, duration : 2, delay: -1});
    taimlainDolphin.to(Dolphin.position, { z: 0, duration : 5, delay : -2});
    taimlainDolphin.to(Dolphin.position, { x: 950, duration : 5, delay : -5});
    taimlainDolphin.to(Dolphin.rotation, { z: -4.8, duration : 2, delay: -1});
    taimlainDolphin.to(Dolphin.rotation, { z: -6.2, duration : 2, delay: -1});


});

let animationWhiteShark, mixerWhiteShark;

let loaderWhiteShark = new THREE.GLTFLoader();
loaderWhiteShark.load('model/great_white_shark/scene.gltf', function (ikanWhiteShark) {
    animationWhiteShark = ikanWhiteShark.animations;
    mixerWhiteShark = new THREE.AnimationMixer(ikanWhiteShark.scene);
    let actionWhiteShark = mixerWhiteShark.clipAction(animationWhiteShark[0]);
    actionWhiteShark.play();
    let WhiteShark = ikanWhiteShark.scene.children[0];
    WhiteShark.scale.set(150.0, 150.0, 150.0);
    WhiteShark.position.set(-1500, 500, 3500);
    scene.add(WhiteShark);
    let taimlainshark = gsap.timeline({ repeat: -1, smoothChildTiming: false});
    taimlainshark.to(WhiteShark.rotation, { z: 1.6, duration: 3, delay: -2 });
    taimlainshark.to(WhiteShark.position, { x: 3500, duration: 6, delay: -3 });
    taimlainshark.to(WhiteShark.rotation, { z: 3.2, duration: 2, delay: -3 });
    taimlainshark.to(WhiteShark.rotation, { z: 3.6, duration: 2, delay: -3 });
    taimlainshark.to(WhiteShark.position, { z: -3500, duration: 8, delay: -3 });
    taimlainshark.to(WhiteShark.position, { x: -1500, duration: 8, delay: -8 });
    taimlainshark.to(WhiteShark.rotation, { z: 4.5, duration: 2, delay: -3 });
    taimlainshark.to(WhiteShark.rotation, { z: 6.2, duration: 2, delay: -3 });
    taimlainshark.to(WhiteShark.position, { z: 3500, duration: 6, delay: -3 });
});

let animationMantaRay, mixerMantaRay;

let loaderMantaRay = new THREE.GLTFLoader();
loaderMantaRay.load('model/manta ray/scene.gltf', function (ikanMantaRay) {
    animationMantaRay = ikanMantaRay.animations;
    mixerMantaRay = new THREE.AnimationMixer(ikanMantaRay.scene);
    let actionMantaRay = mixerMantaRay.clipAction(animationMantaRay[0]);
    actionMantaRay.play();
    let MantaRay = ikanMantaRay.scene.children[0];
    MantaRay.scale.set(150.0, 150.0, 150.0);
    MantaRay.position.set(2000, -1500, 0);
    scene.add(MantaRay);
});

let animationTurtle, mixerTurtle;

let loaderTurtle = new THREE.GLTFLoader();
loaderTurtle.load('model/model_52_-_kemps_ridley_sea_turtle_no_id/scene.gltf', function (ikanTurtle) {
    animationTurtle = ikanTurtle.animations;
    mixerTurtle = new THREE.AnimationMixer(ikanTurtle.scene);
    let actionTurtle = mixerTurtle.clipAction(animationTurtle[0]);
    actionTurtle.play();
    let Turtle = ikanTurtle.scene.children[0];
    Turtle.scale.set(250.0, 250.0, 250.0);
    Turtle.position.set(2250, 500, 0);
    scene.add(Turtle);
});

let animationOctopus, mixerOctopus;

let loaderOctopus = new THREE.GLTFLoader();
loaderOctopus.load('model/octopus/scene.gltf', function (ikanOctopus) {
    animationOctopus = ikanOctopus.animations;
    mixerOctopus = new THREE.AnimationMixer(ikanOctopus.scene);
    let actionOctopus = mixerOctopus.clipAction(animationOctopus[0]);
    actionOctopus.play();
    let Octopus = ikanOctopus.scene.children[0];
    Octopus.scale.set(500.0, 500.0, 500.0);
    Octopus.position.set(2000, -3500, 0);
    scene.add(Octopus);
    taimlaingurita.to(Octopus.position, { y: -3000, duration: 3 });
    taimlaingurita.to(Octopus.position, { y: -3500, duration: 3 });
});

let loaderShip = new THREE.GLTFLoader();
loaderShip.load('model/sunken_shipwreck/scene.gltf', function (ikanShip) {

    let Ship = ikanShip.scene.children[0];
    Ship.scale.set(10.0, 10.0, 10.0);
    Ship.position.set(1550, -5100, 0);
    scene.add(Ship);
});

let clockClown = new THREE.Clock();
let clockOrca = new THREE.Clock();
let clockDolphin = new THREE.Clock();
let clockWhiteShark = new THREE.Clock();
let clockMantaRay = new THREE.Clock();
let clockTurtle = new THREE.Clock();
let clockOctopus = new THREE.Clock();
//------------------------------------------AKHIR DARI MODEL MODEL-----------------------------------------------


function draw() {

    requestAnimationFrame(draw);
    if (mixerClown) {
        mixerClown.update(clockClown.getDelta());
    }
    if (mixerOrca) {
        mixerOrca.update(clockOrca.getDelta());
    }
    if (mixerDolphin) {
        mixerDolphin.update(clockDolphin.getDelta());
    }
    if (mixerWhiteShark) {
        mixerWhiteShark.update(clockWhiteShark.getDelta());
    }
    if (mixerMantaRay) {
        mixerMantaRay.update(clockMantaRay.getDelta());
    }
    if (mixerTurtle) {
        mixerTurtle.update(clockTurtle.getDelta());
    }
    if (mixerOctopus) {
        mixerOctopus.update(clockOctopus.getDelta());
    }

    //roate particle
    particleSystem.rotation.y += 0.0003;
    var pCount = particles.length;
    while (pCount--) {

        // get the particle
        var particle =
            particles.vertices[pCount];

        // check if we need to reset
        if (particle.position.y < -800) {
            particle.position.y = 800;
            particle.velocity.y = 0;
        }
        // update the velocity with
        // a splat of randomniz
        particle.velocity.y -= Math.random() * 1;
        // and the position
        particle.position.addSelf(
            particle.velocity);
    }
    // flag to the particle system
    // that we've changed its vertices.
    particleSystem.geometry.__dirtyVertices = true;

    effect.uniforms['time'].value += Math.random();
    effect2.uniforms['time'].value += Math.random();
    effect3.uniforms['time'].value += Math.random();
    effect4.uniforms['time'].value += Math.random();

    controls.update(clocc.getDelta());
    FirstPerson.update(FPClocc.getDelta());
    // renderer.render(scene, cam);
    composer.render(0.1);

}
draw();

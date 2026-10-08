// Aisha & Zayn — Little Explorers
// 3D educational starter made for GitHub Pages.
// Three.js is loaded from jsDelivr in index.html.

const state = {
  stars: 0,
  hearts: 3,
  world: "village",
  started: false,
  moving: {},
  storyIndex: 0,
  character: {
    aisha: { skin: 0xf0bd91, hijab: 0x176653, outfit: 0xd9a3ad },
    zayn: { skin: 0xd69a72, hair: 0x4a2d20, outfit: 0x657b9e, cap: 0x176653 }
  }
};

const storyData = {
  day: [
    {icon:"☀️", title:"A New Morning", text:"Aisha and Zayn wake up and begin their day with gratitude. They tidy their room, greet their family kindly, and get ready for school.", lesson:"Little actions can make an ordinary day meaningful."},
    {icon:"🍎", title:"Before Eating", text:"At breakfast, the twins remember the dua before eating and try to use good manners at the table.", lesson:"Remember Allah, be thankful, and avoid wasting food."},
    {icon:"🎒", title:"Helping at Home", text:"Before leaving, Zayn notices that a family member needs help. The twins work together instead of rushing away.", lesson:"Helping family and serving others are beautiful good deeds."},
    {icon:"🌙", title:"Bedtime", text:"After a busy day, Aisha and Zayn prepare for sleep, reflect on the good things they did, and make their bedtime routine peaceful.", lesson:"End the day with gratitude, remembrance, and good intentions."}
  ],
  quran: [
    {icon:"📖", title:"Welcome to the Quran Garden", text:"A peaceful garden opens a learning path. Each flower represents a Quran-learning activity.", lesson:"The Quran is the central source of guidance for Muslims. Learn gradually, understand meaning, and practice good actions."},
    {icon:"🌱", title:"Words of Guidance", text:"The twins match simple Islamic values—patience, honesty, mercy, gratitude—with everyday situations.", lesson:"Learning is most beautiful when knowledge becomes good character."},
    {icon:"✨", title:"Surah Al-Fatiha", text:"The twins review the role of Al-Fatiha in salah and learn about its themes: praising Allah, worshipping Him, and asking for guidance.", lesson:"For exact Quran wording, use a trusted Quran source or teacher rather than relying on game text alone."}
  ],
  prophets: [
    {icon:"🕌", title:"The Story Tent", text:"Aisha and Zayn enter a story tent. A narrator introduces stories of prophets through places, objects, choices, and lessons.", lesson:"The game does not visually depict prophets. Their stories are presented respectfully through narration and symbolic scenes."},
    {icon:"⛵", title:"Prophet Nuh", text:"The twins learn about perseverance and obedience through a narrated story inspired by the account of Prophet Nuh.", lesson:"When teaching a prophetic story, focus on authentic sources and the lesson rather than turning the prophet into a cartoon character."},
    {icon:"🌟", title:"Prophet Ibrahim", text:"The twins learn about faith, trust in Allah, and devotion through a narrated chapter about Prophet Ibrahim.", lesson:"Faith can be strengthened through reflection, patience, and sincere worship."},
    {icon:"🐋", title:"Prophet Yunus", text:"A narrator tells the story of Prophet Yunus and highlights turning back to Allah and remembering Him.", lesson:"The story teaches hope, humility, and sincere supplication."}
  ],
  duas: [
    {icon:"🤲", title:"Dua Corner", text:"The twins visit a quiet courtyard where they practice short, authentic duas with their meanings.", lesson:"For memorization, the game should pair Arabic text and transliteration with a trusted source and teacher review."},
    {icon:"🍽️", title:"Before Eating", text:"The twins learn the short dua commonly taught before eating and why remembering Allah matters.", lesson:"Say the dua with understanding, then eat with gratitude and good manners."},
    {icon:"🚪", title:"Everyday Duas", text:"The twins collect dua cards for everyday moments such as leaving home, entering a place, and going to sleep.", lesson:"Small moments throughout the day can become acts of remembrance."}
  ]
};

let scene, camera, renderer, clock;
let twins = {};
let worldGroup = new THREE.Group();
let animatedObjects = [];
let colliders = [];
let activeQuest = null;

const $ = id => document.getElementById(id);

function addStars(n=1){
  state.stars += n;
  $("stars").textContent = state.stars;
  showMessage(`⭐ You earned ${n} star${n>1?"s":""}!`);
}
function showMessage(text, ms=3000){
  const el = $("message");
  el.textContent = text;
  el.classList.remove("hidden");
  clearTimeout(showMessage.t);
  showMessage.t = setTimeout(()=>el.classList.add("hidden"), ms);
}

function init3D(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfe4e8);
  scene.fog = new THREE.Fog(0xbfe4e8, 25, 90);

  camera = new THREE.PerspectiveCamera(55, innerWidth/innerHeight, .1, 200);
  camera.position.set(0, 7.5, 13);

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  $("game").appendChild(renderer.domElement);

  clock = new THREE.Clock();

  const hemi = new THREE.HemisphereLight(0xfff4dc, 0x4b6d60, 2.3);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0ce, 3);
  sun.position.set(-12, 22, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048,2048);
  scene.add(sun);

  scene.add(worldGroup);
  createWorld();
  createTwins();

  addEventListeners();
  animate();
}

function mat(color){
  return new THREE.MeshStandardMaterial({color, roughness:.85});
}
function box(w,h,d,color){
  const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat(color));
  m.castShadow = m.receiveShadow = true;
  return m;
}
function sphere(r,color){
  const m = new THREE.Mesh(new THREE.SphereGeometry(r,24,18), mat(color));
  m.castShadow = m.receiveShadow = true;
  return m;
}

function createGround(){
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(110,110), mat(0x9bc68e));
  ground.rotation.x = -Math.PI/2;
  ground.receiveShadow = true;
  worldGroup.add(ground);

  // paths
  const pathMat = mat(0xd8bd91);
  for(let i=-3;i<=3;i++){
    const path = new THREE.Mesh(new THREE.BoxGeometry(4.5, .08, 110), pathMat);
    path.position.x = i*13;
    path.position.y = .03;
    worldGroup.add(path);
  }
}

function createTree(x,z,scale=1){
  const g = new THREE.Group();
  const trunk = box(.45,2,.45,0x765033); trunk.position.y=1;
  const crown = sphere(1.7,0x4f9259); crown.position.y=2.8;
  const crown2 = sphere(1.2,0x69a965); crown2.position.set(.8,3,.2);
  g.add(trunk,crown,crown2); g.position.set(x,0,z); g.scale.setScalar(scale);
  worldGroup.add(g);
}

function createHouse(x,z,color,roofColor,label){
  const g = new THREE.Group();
  const body = box(6,4.2,5,color); body.position.y=2.1;
  const roof = new THREE.Mesh(new THREE.ConeGeometry(4.4,2.4,4),mat(roofColor));
  roof.rotation.y=Math.PI/4; roof.position.y=5.4;
  const door = box(1.2,2.1,.15,0x68452e); door.position.set(0,1.05,2.55);
  const win1 = box(1.1,1,.12,0x8bd1d6); win1.position.set(-2,2.3,2.55);
  const win2 = box(1.1,1,.12,0x8bd1d6); win2.position.set(2,2.3,2.55);
  g.add(body,roof,door,win1,win2);
  g.position.set(x,0,z);
  worldGroup.add(g);
  if(label){
    const tag = makeLabel(label);
    tag.position.set(x,5.9,z);
    worldGroup.add(tag);
  }
}

function makeLabel(text){
  const canvas=document.createElement("canvas");
  canvas.width=512; canvas.height=128;
  const ctx=canvas.getContext("2d");
  ctx.fillStyle="rgba(255,250,240,.92)";
  ctx.roundRect(8,18,496,92,24); ctx.fill();
  ctx.fillStyle="#28533f"; ctx.font="bold 34px system-ui"; ctx.textAlign="center";
  ctx.fillText(text,256,75);
  const tex=new THREE.CanvasTexture(canvas);
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(4.8,1.2),new THREE.MeshBasicMaterial({map:tex,transparent:true}));
  mesh.rotation.x=-Math.PI/8;
  return mesh;
}

function createMosque(){
  const g=new THREE.Group();
  const base=box(10,4.5,7,0xe8d9bd); base.position.y=2.25;
  const dome=new THREE.Mesh(new THREE.SphereGeometry(3,32,16,0,Math.PI*2,0,Math.PI/2),mat(0x4c9b89));
  dome.scale.y=1.15; dome.position.y=5.0;
  const minaret=box(1.1,9,1.1,0xd8c4a4); minaret.position.set(6,4.5,1);
  const top=new THREE.Mesh(new THREE.ConeGeometry(.8,1.6,16),mat(0x4c9b89)); top.position.set(6,9.8,1);
  g.add(base,dome,minaret,top); g.position.set(0,0,-27);
  worldGroup.add(g);
  const tag=makeLabel("Mosque Courtyard");
  tag.position.set(0,9,-27); worldGroup.add(tag);
}

function createWorld(){
  worldGroup.clear(); colliders=[]; animatedObjects=[];
  createGround();
  createMosque();
  createHouse(-19,-7,0xf0cfa8,0xc57c62,"Family Home");
  createHouse(19,-7,0xc9d9b7,0x6e9362,"Quran Garden");
  createHouse(-19,18,0xd5c3e7,0x8d6aa6,"Dua Corner");
  createHouse(19,18,0xe4d1b1,0x7e6650,"Story Tent");

  [-36,-27,-17,-7,8,18,29,39].forEach((x,i)=>createTree(x, i%2?13:-18, 1+(i%3)*.12));

  // flowers
  for(let i=0;i<32;i++){
    const f=sphere(.12,[0xffd77a,0xf49bb1,0xc2a8e9][i%3]);
    f.position.set((Math.random()-.5)*75,.12,(Math.random()-.5)*70);
    worldGroup.add(f);
  }

  // floating stars
  for(let i=0;i<12;i++){
    const star=sphere(.18,0xffd75e);
    star.position.set((Math.random()-.5)*60,2+Math.random()*5,(Math.random()-.5)*60);
    star.userData.baseY=star.position.y;
    animatedObjects.push(star);
    worldGroup.add(star);
  }
}

function makeAisha(){
  const g=new THREE.Group();
  const skin=mat(state.character.aisha.skin), hijab=mat(state.character.aisha.hijab), outfit=mat(state.character.aisha.outfit);
  const body=box(1.35,1.8,1.05,state.character.aisha.outfit); body.position.y=1.05;
  const head=sphere(.78,state.character.aisha.skin); head.position.y=2.55;
  // hijab: back hood + front frame
  const hood=sphere(.9,state.character.aisha.hijab); hood.scale.set(1.04,1.1,.78); hood.position.set(0,2.62,-.18);
  const scarf=box(1.55,1.5,.25,state.character.aisha.hijab); scarf.position.set(0,1.95,-.22);
  const eye1=sphere(.09,0x3a2922), eye2=sphere(.09,0x3a2922);
  eye1.position.set(-.25,2.62,.68); eye2.position.set(.25,2.62,.68);
  const nose=sphere(.045,0xd58e75); nose.scale.set(.7,1.1,.7); nose.position.set(0,2.48,.72);
  const smile=new THREE.Mesh(new THREE.TorusGeometry(.16,.035,8,20,Math.PI),mat(0x9e4f50));
  smile.rotation.x=Math.PI; smile.position.set(0,2.32,.69);
  g.add(body,head,hood,scarf,eye1,eye2,nose,smile);
  return g;
}

function makeZayn(){
  const g=new THREE.Group();
  const body=box(1.4,1.9,1.05,state.character.zayn.outfit); body.position.y=1.08;
  const head=sphere(.8,state.character.zayn.skin); head.position.y=2.62;
  const hair=sphere(.82,state.character.zayn.hair); hair.scale.set(1.02,.42,.95); hair.position.set(0,3.15,.02);
  const cap=new THREE.Mesh(new THREE.CylinderGeometry(.62,.68,.32,24),mat(state.character.zayn.cap));
  cap.position.y=3.36;
  const eye1=sphere(.09,0x3a2922), eye2=sphere(.09,0x3a2922);
  eye1.position.set(-.26,2.7,.71); eye2.position.set(.26,2.7,.71);
  const smile=new THREE.Mesh(new THREE.TorusGeometry(.16,.035,8,20,Math.PI),mat(0x9e4f50));
  smile.rotation.x=Math.PI; smile.position.set(0,2.39,.72);
  g.add(body,head,hair,cap,eye1,eye2,smile);
  return g;
}

function createTwins(){
  twins.aisha=makeAisha();
  twins.zayn=makeZayn();
  twins.aisha.position.set(-1.0,0,6);
  twins.zayn.position.set(1.0,0,7);
  twins.aisha.scale.setScalar(1.05);
  twins.zayn.scale.setScalar(1.05);
  scene.add(twins.aisha,twins.zayn);
}

function updateTwinLook(){
  const a=twins.aisha, z=twins.zayn;
  if(!a || !z)return;
  scene.remove(a,z);
  twins.aisha=makeAisha(); twins.zayn=makeZayn();
  twins.aisha.position.set(-1,0,6);
  twins.zayn.position.set(1,0,7);
  scene.add(twins.aisha,twins.zayn);
}

function animate(){
  requestAnimationFrame(animate);
  const dt=Math.min(clock.getDelta(),.05);
  updateMovement(dt);
  animatedObjects.forEach((o,i)=>{o.position.y=o.userData.baseY+Math.sin(performance.now()/700+i)*.18});
  if(twins.aisha) twins.aisha.position.y=Math.sin(performance.now()/450)*.035;
  if(twins.zayn) twins.zayn.position.y=Math.sin(performance.now()/450+1)*.035;
  renderer.render(scene,camera);
}

function updateMovement(dt){
  if(!state.started)return;
  const speed=5.2*dt;
  let dx=0,dz=0;
  if(state.moving.ArrowUp||state.moving.w)dz-=speed;
  if(state.moving.ArrowDown||state.moving.s)dz+=speed;
  if(state.moving.ArrowLeft||state.moving.a)dx-=speed;
  if(state.moving.ArrowRight||state.moving.d)dx+=speed;
  if(dx||dz){
    const len=Math.hypot(dx,dz); dx/=len; dz/=len; dx*=speed; dz*=speed;
    twins.aisha.position.x+=dx; twins.aisha.position.z+=dz;
    twins.zayn.position.x+=dx; twins.zayn.position.z+=dz;
    twins.aisha.rotation.y=Math.atan2(dx,dz);
    twins.zayn.rotation.y=Math.atan2(dx,dz);
    const bob=Math.sin(performance.now()/90)*.06;
    twins.aisha.position.y=bob; twins.zayn.position.y=bob;
    camera.position.x+=(twins.aisha.position.x-camera.position.x+0)/12;
    camera.position.z+=(twins.aisha.position.z+10-camera.position.z)/12;
    camera.lookAt(twins.aisha.position.x,2,twins.aisha.position.z);
    checkWorldTriggers();
  }
}

function checkWorldTriggers(){
  const x=twins.aisha.position.x,z=twins.aisha.position.z;
  if(Math.hypot(x-19,z+7)<6) setQuest("Quran Garden","Enter the garden to begin a Quran learning activity.","quran");
  else if(Math.hypot(x+19,z-18)<6) setQuest("Dua Corner","Practice an everyday dua.","duas");
  else if(Math.hypot(x-19,z-18)<6) setQuest("Story Tent","Listen to a respectful prophet story.","prophets");
  else if(Math.hypot(x+19,z+7)<6) setQuest("Family Home","Start today's day-to-day story.","day");
  else if(Math.hypot(x,z+27)<7) setQuest("Mosque Courtyard","Reflect on prayer, manners, and community.","day");
}

function setQuest(title,text,world){
  if(activeQuest===world)return;
  activeQuest=world;
  $("questTitle").textContent=title;
  $("questText").textContent=text;
  $("questPanel").classList.remove("hidden");
  $("questAction").onclick=()=>openStory(world);
}

function openStory(world){
  state.world=world; state.storyIndex=0;
  renderStory();
  $("storyPanel").classList.remove("hidden");
}
function renderStory(){
  const data=storyData[state.world][state.storyIndex];
  $("storyContent").innerHTML=`<div class="story-card">
    <div class="emoji">${data.icon}</div>
    <h2>${data.title}</h2>
    <p>${data.text}</p>
    <div class="lesson"><b>🌱 Lesson:</b><br>${data.lesson}</div>
  </div>`;
  $("nextStory").textContent=state.storyIndex<storyData[state.world].length-1?"Next →":"Finish ⭐";
}
function nextStory(){
  if(state.storyIndex<storyData[state.world].length-1){
    state.storyIndex++; renderStory();
  }else{
    $("storyPanel").classList.add("hidden");
    addStars(3);
    activeQuest=null;
    $("questPanel").classList.add("hidden");
  }
}

function addEventListeners(){
  $("startBtn").onclick=()=>{
    state.started=true;
    $("startScreen").classList.add("hidden");
    $("hud").classList.remove("hidden");
    $("touchControls").classList.remove("hidden");
    showMessage("Welcome! Explore the village with Aisha and Zayn. 🌿");
  };
  $("menuBtn").onclick=()=>$("menu").classList.remove("hidden");
  $("closeMenu").onclick=()=>$("menu").classList.add("hidden");
  $("closeStory").onclick=()=>$("storyPanel").classList.add("hidden");
  $("nextStory").onclick=nextStory;

  document.querySelectorAll(".world-btn").forEach(btn=>{
    btn.onclick=()=>{
      $("menu").classList.add("hidden");
      openStory(btn.dataset.world);
    };
  });

  addEventListener("keydown",e=>{
    state.moving[e.key]=true;
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))e.preventDefault();
  });
  addEventListener("keyup",e=>state.moving[e.key]=false);

  document.querySelectorAll("#touchControls button").forEach(btn=>{
    const key=btn.dataset.key;
    const down=e=>{e.preventDefault();state.moving[key]=true};
    const up=e=>{e.preventDefault();state.moving[key]=false};
    btn.addEventListener("pointerdown",down);
    btn.addEventListener("pointerup",up);
    btn.addEventListener("pointerleave",up);
    btn.addEventListener("pointercancel",up);
  });

  addEventListener("resize",()=>{
    camera.aspect=innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
  });
}

window.addEventListener("load",()=>{
  init3D();
  setTimeout(()=>$("loading").classList.add("hidden"),700);
});

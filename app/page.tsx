'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, RotateCcw, MoveUpRight, MousePointer2, Sparkles } from 'lucide-react';
const flavors = [{name:'Strawberry',color:'#ed235a',fruit:'🍓',background:'#f6c9d5'}, {name:'Orange',color:'#ff8a12',fruit:'🍊',background:'#ffdeb9'}, {name:'Lime',color:'#90c72f',fruit:'🍋‍🟩',background:'#e0edb9'}, {name:'Blueberry',color:'#5d7bef',fruit:'🫐',background:'#d2dff8'}, {name:'Grape',color:'#ae51cd',fruit:'🍇',background:'#e5cdef'}];
export default function Home(){
 const activeFlavor=useRef(0); const canvas=useRef<HTMLDivElement>(null); const api=useRef<{bounce:()=>void;reset:()=>void;color:(c:string)=>void}|null>(null);
 const [flavor,setFlavor]=useState(0); const [status,setStatus]=useState('Ready to squish'); const [error,setError]=useState(false);
 useEffect(()=>{
 const context=(document as Document & {modelContext?:{registerTool:(tool:unknown,options:{signal:AbortSignal})=>void|Promise<void>}}).modelContext;
 if(!context)return;const lifecycle=new AbortController();
 try {Promise.resolve(context.registerTool({name:'bounce_gummy',description:'Make the gummy bear jump and bounce.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:(input:unknown)=>{if(!input||typeof input!=='object'||Object.keys(input).length)throw new Error('Expected an empty object');if(!api.current)throw new Error('Gummy is still loading');api.current.bounce();return {bouncing:true};}},{signal:lifecycle.signal})).catch(console.error);}catch(e){console.error(e);}
 return()=>lifecycle.abort();
 },[]);
 useEffect(()=>{let dispose=()=>{}; let cancelled=false;
 (async()=>{try{const THREE=await import('three'); const {MarchingCubes}=await import('three/examples/jsm/objects/MarchingCubes.js'); const {smoothGummyGeometry}=await import('../lib/gummy-geometry'); const {RoomEnvironment}=await import('three/examples/jsm/environments/RoomEnvironment.js'); if(cancelled||!canvas.current)return;
 const host=canvas.current, scene=new THREE.Scene(); const camera=new THREE.PerspectiveCamera(33,1,.1,100); camera.position.set(0,1.0,10.8); camera.lookAt(0,0,0);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(host.clientWidth,host.clientHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;host.appendChild(renderer.domElement);
 const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();const env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xffffff,0xe995a8,2)); const light=new THREE.DirectionalLight(0xffeeee,5);light.position.set(-3,6,5);light.castShadow=true;light.shadow.mapSize.set(1024,1024);light.shadow.camera.left=-5;light.shadow.camera.right=5;light.shadow.camera.top=5;light.shadow.camera.bottom=-5;light.shadow.normalBias=.03;scene.add(light);
 const mat=new THREE.MeshPhysicalMaterial({color:flavors[activeFlavor.current].color,metalness:0,roughness:.18,transmission:.28,thickness:1.8,ior:1.46,clearcoat:1,clearcoatRoughness:.12,attenuationColor:new THREE.Color('#ff5473'),attenuationDistance:2});
 const n=68, mc=new MarchingCubes(n,mat,false,false,70000);mc.isolation=0;
 const parts=[[0,-.15,0,.40,.52,.29],[0,.43,0,.40,.34,.29],[-.29,.70,0,.18,.19,.16],[.29,.70,0,.18,.19,.16],[-.40,-.12,.015,.20,.32,.20],[.40,-.12,.015,.20,.32,.20],[-.24,-.62,.08,.23,.25,.26],[.24,-.62,.08,.23,.25,.26],[0,.30,.24,.24,.16,.13]];
 for(let z=0;z<n;z++)for(let y=0;y<n;y++)for(let x=0;x<n;x++){const px=x/n*2-1,py=y/n*2-1,pz=z/n*2-1;let d=10;for(const [cx,cy,cz,rx,ry,rz]of parts){const qx=(px-cx)/rx,qy=(py-cy)/ry,qz=(pz-cz)/rz;const v=(Math.sqrt(qx*qx+qy*qy+qz*qz)-1)*Math.min(rx,ry,rz);const h=Math.max(.075-Math.abs(d-v),0)/.075;d=Math.min(d,v)-h*h*.075*.25;}mc.field[x+y*n+z*n*n]=-d;}
 mc.update();const geo=smoothGummyGeometry(mc.geometry);geo.scale(2.25,2.25,2.25); const bear=new THREE.Group();bear.rotation.y=-.15;scene.add(bear);const body=new THREE.Mesh(geo,mat);body.castShadow=true;body.receiveShadow=true;bear.add(body);
 const deformables:{mesh:InstanceType<typeof THREE.Mesh>;base:Float32Array}[]=[];
 function addMesh(mesh:InstanceType<typeof THREE.Mesh>){deformables.push({mesh,base:new Float32Array(mesh.geometry.attributes.position.array)});}
 addMesh(body);const dark=new THREE.MeshPhysicalMaterial({color:'#7a122e',roughness:.24,clearcoat:1});
 function detail(x:number,y:number,z:number,sx:number,sy:number,sz:number,material=dark){const g=new THREE.SphereGeometry(1,24,16);g.scale(sx,sy,sz);g.translate(x,y,z);const mesh=new THREE.Mesh(g,material);bear.add(mesh);addMesh(mesh);}
 detail(-.30,1.03,.598,.075,.095,.048);detail(.30,1.03,.598,.075,.095,.048);detail(0,.78,.846,.105,.07,.045);
 const smileCurve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(-.13,.64,.80),new THREE.Vector3(0,.53,.83),new THREE.Vector3(.13,.64,.80));const smile=new THREE.Mesh(new THREE.TubeGeometry(smileCurve,20,.018,8,false),dark);bear.add(smile);addMesh(smile);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({color:'#7c2448',opacity:.17}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.98;floor.receiveShadow=true;scene.add(floor);
 // Each fruit is a camera-facing sprite in the same 3D scene as the bear.
 const fruitTextures=new Map<number,InstanceType<typeof THREE.CanvasTexture>>();
 const fruits:{sprite:InstanceType<typeof THREE.Sprite>;velocity:InstanceType<typeof THREE.Vector3>;age:number;spin:number}[]=[];
 const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
 function clearFruits(){for(const fruit of fruits){scene.remove(fruit.sprite);fruit.sprite.material.dispose();}fruits.length=0;}
 function burstFruit(){
  const selected=activeFlavor.current;
  let texture=fruitTextures.get(selected);
  if(!texture){const tile=document.createElement('canvas');tile.width=128;tile.height=128;const ctx=tile.getContext('2d');if(!ctx)return;ctx.font='90px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(flavors[selected].fruit,64,67);texture=new THREE.CanvasTexture(tile);texture.colorSpace=THREE.SRGBColorSpace;fruitTextures.set(selected,texture);}
  const count=reducedMotion.matches?5:16;
  while(fruits.length+count>64){const old=fruits.shift()!;scene.remove(old.sprite);old.sprite.material.dispose();}
  bear.updateWorldMatrix(true,false);
  const origin=bear.localToWorld(new THREE.Vector3(0,-.1,.78));
  for(let i=0;i<count;i++){
   const material=new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false});
   const sprite=new THREE.Sprite(material);sprite.position.copy(origin);sprite.position.x+=(Math.random()-.5)*.25;const size=.24+Math.random()*.18;sprite.scale.setScalar(size);scene.add(sprite);
   fruits.push({sprite,velocity:new THREE.Vector3((Math.random()-.5)*6,3.2+Math.random()*4,.4+Math.random()*1.8),age:0,spin:(Math.random()-.5)*8});
  }
 }
 function updateFruits(dt:number){for(let i=fruits.length-1;i>=0;i--){const f=fruits[i];f.age+=dt;const life=reducedMotion.matches?.65:2.8;
  if(f.age>life){scene.remove(f.sprite);f.sprite.material.dispose();fruits.splice(i,1);continue;}
  f.velocity.y-=12*dt;f.sprite.position.addScaledVector(f.velocity,dt);f.sprite.material.rotation+=f.spin*dt;
  const ground=-1.98+f.sprite.scale.y*.5;
  if(f.sprite.position.y<ground){f.sprite.position.y=ground;f.velocity.y=Math.abs(f.velocity.y)*.48;f.velocity.x*=.72;f.velocity.z*=.72;f.spin*=.7;}
  f.sprite.material.opacity=Math.min(1,(life-f.age)/.55);
 }}
 const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,0,1),0),hit=new THREE.Vector3(),anchor=new THREE.Vector3(),pull=new THREE.Vector3(),target=new THREE.Vector3(),velocity=new THREE.Vector3();let dragging=false,bounce=0,bounceV=0,squash=0,squashV=0,frame=0,last=performance.now();
 const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(host);resize();
 function aim(e:PointerEvent){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);}
 const down=(e:PointerEvent)=>{aim(e);const hits=ray.intersectObject(body);if(!hits.length)return;dragging=true;renderer.domElement.setPointerCapture(e.pointerId);plane.constant=-hits[0].point.z;anchor.copy(bear.worldToLocal(hits[0].point.clone()));target.set(0,0,-.25);squashV=-1.4;setStatus('Go on, give it a stretch');host.style.cursor='grabbing';};
 const move=(e:PointerEvent)=>{aim(e);if(dragging){if(ray.ray.intersectPlane(plane,hit)){bear.worldToLocal(hit);target.copy(hit).sub(anchor);target.clampLength(0,2.4);}}else host.style.cursor=ray.intersectObject(body).length?'grab':'default';};
 const up=()=>{if(!dragging)return;dragging=false;target.set(0,0,0);squashV+=Math.min(pull.length(),1.5)*2;setStatus('Boing. That felt good.');host.style.cursor='grab';};
 renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointercancel',up);renderer.domElement.addEventListener('lostpointercapture',up);
 api.current={bounce:()=>{bounceV=6;squashV=-3;burstFruit();setStatus('A little jump for joy');},reset:()=>{clearFruits();dragging=false;target.set(0,0,0);pull.set(0,0,0);velocity.set(0,0,0);bounce=0;bounceV=0;squash=0;setStatus('Ready to squish');},color:(c)=>{mat.color.set(c);mat.attenuationColor.set(c);}};
 const animate=(now:number)=>{const dt=Math.min((now-last)/1000,.033);last=now;velocity.addScaledVector(target.clone().sub(pull),dt*85);velocity.multiplyScalar(Math.exp(-dt*(dragging?15:5)));pull.addScaledVector(velocity,dt);if(bounce>0||bounceV>0){bounceV-=15*dt;bounce+=bounceV*dt;if(bounce<0){bounce=0;if(Math.abs(bounceV)>1){squashV=-Math.abs(bounceV)*.65;bounceV=-bounceV*.48;}else bounceV=0;}}squashV+=(-squash*105-squashV*6)*dt;squash+=squashV*dt;
 bear.position.y=bounce;bear.scale.set(1-squash*.34,1+squash,1-squash*.34);bear.rotation.z=Math.sin(now*.0018)*.018;
 for(const {mesh,base}of deformables){const attr=mesh.geometry.attributes.position;const count=attr.count;for(let i=0;i<count;i++){const j=i*3,x=base[j],y=base[j+1],z=base[j+2];const dist=(x-anchor.x)**2+(y-anchor.y)**2+(z-anchor.z)**2;const influence=Math.exp(-dist/1.65);attr.setXYZ(i,x+pull.x*influence,y+pull.y*influence,z+pull.z*influence);}attr.needsUpdate=true;mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingSphere();}updateFruits(dt);renderer.render(scene,camera);frame=requestAnimationFrame(animate);};frame=requestAnimationFrame(animate);
 dispose=()=>{cancelAnimationFrame(frame);clearFruits();fruitTextures.forEach(texture=>texture.dispose());ro.disconnect();renderer.dispose();env.dispose();mc.geometry.dispose();deformables.forEach(d=>d.mesh.geometry.dispose());mat.dispose();dark.dispose();floor.geometry.dispose();(floor.material as InstanceType<typeof THREE.Material>).dispose();renderer.domElement.remove();api.current=null;};
 }catch(e){console.error(e);setError(true);}})();return()=>{cancelled=true;dispose();};},[]);
 return <main className="playground" style={{'--flavor-bg':flavors[flavor].background} as React.CSSProperties}><div key={flavor} className="fruit-pattern" aria-hidden="true">{Array.from({length:48},(_,i)=><span key={i} style={{'--fruit-turn':`${(i*37)%60-30}deg`} as React.CSSProperties}>{flavors[flavor].fruit}</span>)}</div><header><a className="wordmark" href="/">yummy gummy<span>®</span></a><span className="header-note">Zero thoughts. Just squish.</span></header><section className="intro"><div className="eyebrow">HERE’S A SWEET TREAT</div><h1>A little squish.<br/>A lot of <i>happy.</i></h1><p>Meet your chewy friend.<br/>Poke, pull, and let it all bounce back.</p><div className="gesture"><MousePointer2 size={17}/><span>Grab anywhere. Let go. Repeat.</span></div></section><div ref={canvas} className="scene" role="img" aria-label="Interactive 3D gummy bear. Drag to stretch or use the bounce button."/>{error&&<div className="error">This gummy needs WebGL to come to life. Try a browser with hardware acceleration enabled.</div>}<div className="bear-note"><span>made for a little<br/>messing around</span><MoveUpRight size={31} strokeWidth={1}/></div><div className="specimen"><span>01 / YOUR LITTLE GUMMY</span><span>{flavors[flavor].name} · Extra squishy</span></div><div className="controls"><div className="flavors"><span className="control-label">PICK A FLAVOR</span><div className="swatches">{flavors.map((f,i)=><button key={f.name} aria-label={f.name} aria-pressed={i===flavor} title={f.name} style={{'--swatch':f.color} as React.CSSProperties} className={i===flavor?'flavor-option selected':'flavor-option'} onClick={()=>{activeFlavor.current=i;setFlavor(i);api.current?.color(f.color);}}><span className="swatch">{i===flavor?'✓':''}</span><span className="flavor-name">{f.name}</span></button>)}</div></div><div className="divider"/><button className="bounce" onClick={()=>api.current?.bounce()}><Sparkles size={19}/> Give it a bounce <ArrowUpRight size={18}/></button><button className="reset" aria-label="Reset gummy bear" title="Reset gummy bear" onClick={()=>api.current?.reset()}><RotateCcw size={20}/></button></div><footer><span><span className="tiny-star">✳</span> SOFT BODY. SOFTER MOOD.</span><span className="status" aria-live="polite">{status}</span><span>NO RULES. NO SCORE. JUST PLAY.</span></footer></main>;
}

(function(){"use strict";var P=`precision mediump float;

attribute vec2 a_pos;
attribute float a_kind;
attribute float a_speed;

uniform float u_time;

varying float v_anim;
varying float v_starKind;
varying float v_speed;

void main() {
    // float y = tan(a_pos.y - u_time * a_speed / 20.0);
    // float x = a_pos.x;
    //
    // if (y > 1.0) {
    //     y = 1.1;
    // }

    gl_PointSize = 50.0;
    gl_Position = vec4(a_pos, 0.0, 1.0);

    v_anim = u_time;
    v_starKind = a_kind;
    v_speed = a_speed;
}
`,I=`precision mediump float;

varying float v_anim;
varying float v_starKind;
varying float v_speed;

uniform struct {
    sampler2D kind_a;
    sampler2D kind_b;
    sampler2D kind_c;
} u_starTexs;

void main() {
    vec2 uv = gl_PointCoord;
    int starKind = int(floor(v_starKind + 0.5));

    vec4 tex = 
        starKind == 0 ? texture2D(u_starTexs.kind_a, uv)
            : starKind == 1 ? texture2D(u_starTexs.kind_b , uv)
            : texture2D(u_starTexs.kind_c, uv);

    vec4 col = vec4(0.0);

    col += tex;

    float stepY = 0.12; // Trail length
    float fade = 0.5;

    // for (int i = 1; i <= 3; i++) {
    //     vec2 tUV = uv;
    //     tUV.y += float(i) * stepY;
    //
    //     vec4 trail_tex = 
    //         starKind == 0 ? texture2D(u_starTexs.kind_a, tUV)
    //             : starKind == 1 ? texture2D(u_starTexs.kind_b , tUV)
    //             : texture2D(u_starTexs.kind_c, tUV);
    //
    //     if (tUV.y <= 1.0) {
    //         col += trail_tex * pow(fade, float(i));
    //     }
    // }

    gl_FragColor = col;
}
`;function R(t,a,e){const r=t.createShader(t.VERTEX_SHADER);t.shaderSource(r,a),t.compileShader(r);const o=t.getShaderInfoLog(r);if(o)throw new Error(o);const n=t.createShader(t.FRAGMENT_SHADER);t.shaderSource(n,e),t.compileShader(n);const i=t.getShaderInfoLog(n);if(i)throw new Error(i);const s=t.createProgram();t.attachShader(s,r),t.attachShader(s,n),t.linkProgram(s);const c=t.getProgramInfoLog(s);if(c)throw new Error(c);return s}function D(t,a){const e=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,e),t.bufferData(t.ARRAY_BUFFER,a,t.STATIC_DRAW)}function Q(t){const a=t.createVertexArray();return t.bindVertexArray(a),a}function v(t,a,e,r,o,n=0,i=0,s=!1){const c=t.getAttribLocation(a,r);t.vertexAttribPointer(c,o,e,s,n,i),t.enableVertexAttribArray(c)}async function U(t,a,e={wrap:"clamp",filter:"nearest"}){const r=t.createTexture();return(async()=>{const i=await(await fetch(a)).blob(),s=await createImageBitmap(i),[c,l]=[s.width,s.height];t.bindTexture(t.TEXTURE_2D,r),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,c,l,0,t.RGBA,t.UNSIGNED_BYTE,s);const h=e&&e.wrap==="repeat"?t.REPEAT:t.CLAMP_TO_EDGE,O=e&&e.filter==="linear"?t.LINEAR:t.NEAREST;t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,O),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,O),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,h),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,h),t.generateMipmap(t.TEXTURE_2D),t.bindTexture(t.TEXTURE_2D,null)})(),r}function d(t,a,e,r,o,n=0){t.bindBuffer(t.ARRAY_BUFFER,a),t.bufferData(t.ARRAY_BUFFER,r,t.DYNAMIC_DRAW),v(t,e,t.FLOAT,o,n)}var L="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAiUlEQVR4Aa1SsQ2AIBBEBtABrJxA4wKMIrG3cwJXsDcupIkT2OgAugAGEsxLDL7ANV/8Xe7ugRALGGuFbU+JB6jN8chiVIJXUsE78afGg1BNm0AJ4VI7ajFMgKoghRLQ3URkHidvajXHMr1JfN7VXPpBzWQ9/Z3Ddna6dpB3hiQtRom+kqD+NhYXJiJd8l+b7dwAAAAASUVORK5CYII=",F="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAe0lEQVR4Ac2SwQmAMAxFY/GsA3hyAsUFOorFuzcn8OwQrtIBnMGLC+gCsRYCRaVYqth3yeEn+UkIQJBw3qFNZz7Nmc1tzZPHU1wSS9GjUyFxFNbTgtTgjvjsRqMWbQNjlYFQUaG1dN60JuUQeTu/u7OZaLo6H+3TJ/mPHQGRNEN0i++qAAAAAElFTkSuQmCC",N="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAYElEQVR4Ae2QMQ3AIBREjwpoNVRCFaClHrp26loPaEEBEtAABiCQMEDCDwls8JY//Ny95IBFBuePo/5bS6hWwiirOXcc2kLKnzWFkyUElXhx3V8sCJQlXWZyqPIOXXtGPBb0JZ3uyHbXAAAAAElFTkSuQmCC",M="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAI0lEQVR4Ae3OAQ0AAAgCMJqa2Bb2kAQEgPEEByrB7L1VuBQCejEDELiWJhIAAAAASUVORK5CYII=",Y="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAI0lEQVR4Ae3OAQ0AAAgCMCIZySwWlwQEgPEEByrB7L1VuBQCs9oCEi8HgbgAAAAASUVORK5CYII=",K="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAIUlEQVR4Ae3OAREAAAwBQF0Xa2FJIADnEzwwDe7JqPA4AlgcAv3YshcGAAAAAElFTkSuQmCC",z="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAI0lEQVR4Ae3OAQ0AAAgCMJqa2Bb2kAQEgPEEByrB7L1VuBQCejEDELiWJhIAAAAASUVORK5CYII=",G="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAHklEQVR4Ae3OAQ0AAAABMP1Lo4AAzBMcuAW0qvAlAiLWA/1dUFL+AAAAAElFTkSuQmCC",k="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAOElEQVR4Ae3PMQ0AMAgEQCTVUaul/uqiPh5GBgIBVm4hDJ/PE42+dS68P7Tfh75pEKVgubm9edgYvqYYfWmXNJYAAAAASUVORK5CYII=",X="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAANklEQVR4Ae3PuxEAQAQEUCVdR6cW/elCH0QyY3xSLxOsnQU4ew9Js7v8oB10n2UWHDevN5+YAfy0E5iuEfACAAAAAElFTkSuQmCC",H="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAKUlEQVR4Ae3NsQ0AAAgCQUZyJGdxcW2tjSEUXEPHAyYgsnrv+YBftmcDdSMKVrfWbZEAAAAASUVORK5CYII=",J="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAI0lEQVR4Ae3OAQ0AAAgCMCIZySwWlwQEgPEEByrB7L1VuBQCs9oCEi8HgbgAAAAASUVORK5CYII=";const T=[[L,F,N,M],[G,z,K,Y],[k,X,H,J]];class A{x;y;constructor(a,e){this.x=a,this.y=e}static initial(a){return new A(a,a)}static empty(){return new A(0,0)}add(a){return typeof a=="number"?this.x+=a:this.x+=a.x,typeof a=="number"?this.y+=a:this.y+=a.y,this}sub(a){return typeof a=="number"?this.x-=a:this.x-=a.x,typeof a=="number"?this.y-=a:this.y-=a.y,this}mul(a){return typeof a=="number"?this.x*=a:this.x*=a.x,typeof a=="number"?this.y*=a:this.y*=a.y,this}div(a){return typeof a=="number"?this.x/=a:this.x/=a.x,typeof a=="number"?this.y/=a:this.y/=a.y,this}map(a){return this.x=a(this.x),this.y=a(this.y),this}toArr(){return[this.x,this.y,0]}}class u extends A{z;constructor(a,e,r){super(a,e),this.z=r}static initial(a){return new u(a,a,a)}static empty(){return new u(0,0,0)}static fromHex(a){return new u(parseInt(a.slice(0,2),16),parseInt(a.slice(2,4),16),parseInt(a.slice(4,6),16))}add(a){return typeof a=="number"?this.x+=a:this.x+=a.x,typeof a=="number"?this.y+=a:this.y+=a.y,typeof a=="number"?this.z+=a:this.z+=a.z,this}sub(a){return typeof a=="number"?this.x-=a:this.x-=a.x,typeof a=="number"?this.y-=a:this.y-=a.y,typeof a=="number"?this.z-=a:this.z-=a.z,this}mul(a){return this.x*=typeof a=="number"?a:a.x,this.y*=typeof a=="number"?a:a.y,this.z*=typeof a=="number"?a:a.z,this}div(a){return typeof a=="number"?this.x/=a:this.x/=a.x,typeof a=="number"?this.y/=a:this.y/=a.y,typeof a=="number"?this.z/=a:this.z/=a.z,this}map(a){return this.x=a(this.x),this.y=a(this.y),this.z=a(this.z),this}toArr(){return[this.x,this.y,this.z]}}const x=t=>t[Math.floor(Math.random()*t.length)],p=(t,a)=>t+Math.random()*a,W=(t,a,e)=>Math.max(Math.min(t,e),a),_=(t,a,e)=>t*(1-e)+a*e,q=(t,a,e)=>t<a?Math.min(t+e,a):Math.max(t-e,a),E=(t,a)=>"z"in t&&"z"in a?new u(t.x*a.x,t.y*t.y,t.z*t.z):new A(t.x*a.x,t.y*t.y),j=25,Z=()=>{const t=[];for(let a=0;a<j;a++)t.push((Math.random()-.5)*2,(Math.random()-.5)*4),t.push(Math.round(Math.random()*2)),t.push(Math.round(p(1,2)));return new Float32Array(t)};var B={textures:[[0,0,0,0],[0,0,0,0],[0,0,0,0]],program:0,count:0,vao:0,async init(t){const a=R(t,P,I);t.useProgram(a);const e=Q(t),r=Z();D(t,r);const o=16;v(t,a,t.FLOAT,"a_pos",2,o,0),v(t,a,t.FLOAT,"a_kind",1,o,8),v(t,a,t.FLOAT,"a_speed",1,o,12),t.bindBuffer(t.ARRAY_BUFFER,null),t.bindVertexArray(null);for(let n=0;n<T.length;n++){const i=T[n];for(let s=0;s<i.length;s++){const c=i[s],l=await U(t,c);this.textures[n][s]=l}}this.program=a,this.vao=e,this.count=r.length/4},draw(t,a){t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.useProgram(this.program),t.bindVertexArray(this.vao);const e=t.getUniformLocation(this.program,"u_time");t.uniform1f(e,a);const r=W(Math.floor(Math.sin(a)*4),0,3);this.textures.forEach((o,n)=>{const i=n==0?"a":n==1?"b":"c",s=o[r];t.activeTexture(t.TEXTURE0+n),t.bindTexture(t.TEXTURE_2D,s);const c=t.getUniformLocation(this.program,`u_starTexs.kind_${i}`);t.uniform1i(c,n)}),t.drawArrays(t.POINTS,0,this.count),t.disable(t.BLEND),t.bindVertexArray(null)}},$=`attribute vec2 a_pos;
attribute vec3 a_color;
attribute vec2 a_uv;
attribute float a_alpha;

uniform vec2 u_resolution;

varying vec2 v_uv;
varying vec3 v_color;
varying float v_strandAlpha;

void main() {
    vec2 clip = (a_pos / u_resolution) * 2.0 - 1.0;
    clip.y *= -1.0;

    gl_PointSize = 4.0;
    gl_Position = vec4(clip, 0.0, 1.0);

    v_uv = a_uv;
    v_color = a_color;
    v_strandAlpha = a_alpha;
}
`,tt=`precision mediump float;

varying vec2 v_uv;
varying vec3 v_color;
varying float v_strandAlpha;

uniform sampler2D u_tex;

uniform bool u_drawParticle;

void main() {
    vec4 tex = texture2D(u_tex, v_uv);
    vec3 col = tex.rgb * v_color;
    float alpha = tex.a * v_strandAlpha;

    col *= 1.4;
    col += col * alpha * 0.5;

    gl_FragColor = u_drawParticle ? vec4(v_color, 1.0) : vec4(col, alpha);
}
`,at="/For-My-Sister/assets/northernlights-BSP9-iBm.png";class y{strands;particles;timer=0;verts=[];northernLightsAlpha=1;offsetY=0;static colors=[u.fromHex("2de079").map(a=>a/255),u.fromHex("62f4f6").map(a=>a/255),u.fromHex("45bc2e").map(a=>a/255),u.fromHex("3856f0").map(a=>a/255)];constructor(){let a=[];for(let r=0;r<3;r++)a.push(new et);let e=[];for(let r=0;r<50;r++){const o={pos:new A(p(0,b),p(0,w)),speed:p(4,14),color:x(y.colors)};e.push(o)}this.strands=a,this.particles=e}update(a){this.timer+=a*.3;for(const e of this.strands){e.percent+=a/e.duration,!e.fadingOut&&e.percent>=1&&(e.fadingOut=!0);const r=e.fadingOut?0:1;e.alpha=q(e.alpha,r,a*.5),e.fadingOut&&e.alpha<.01&&e.reset(0);for(const o of e.nodes)o.sineOffset+=a}for(let e=0;e<this.particles.length;e++)this.particles[e].pos.y>w?(this.particles[e].pos.y=-3,this.particles[e].pos.x=p(0,b)):this.particles[e].pos.y+=this.particles[e].speed*a}beforeRender(){let a=0;for(const e of this.strands){let r=e.nodes[0];for(let o=0;o<e.nodes.length;o++){const n=e.nodes[o],i=Math.min(1,o/4)*this.northernLightsAlpha,s=Math.min(1,(e.nodes.length-1)/4)*this.northernLightsAlpha,c=this.offsetY+Math.sin(r.sineOffset)*3,l=this.offsetY+Math.sin(n.sineOffset)*3;this.verts[a]={pos:new A(r.pos.x,r.pos.y+c),uv:new A(r.texOffset,1),color:E(r.color,u.initial(r.bottomAlpha*e.alpha*i)),alpha:r.bottomAlpha*e.alpha*i},a++,this.verts[a]={pos:new A(r.pos.x,r.pos.y-r.height+c),uv:new A(r.texOffset,.05),color:E(r.color,u.initial(r.topAlpha*e.alpha*i)),alpha:r.topAlpha*e.alpha*i},a++,this.verts[a]={pos:new A(n.pos.x,n.pos.y-n.height+l),uv:new A(n.texOffset,.05),color:E(n.color,u.initial(n.topAlpha*e.alpha*s)),alpha:n.topAlpha*e.alpha*s},a++,this.verts[a]={pos:new A(r.pos.x,r.pos.y+c),uv:new A(r.texOffset,1),color:E(r.color,u.initial(r.bottomAlpha*e.alpha*i)),alpha:r.bottomAlpha*e.alpha*i},a++,this.verts[a]={pos:new A(n.pos.x,n.pos.y-n.height+l),uv:new A(n.texOffset,.05),color:E(n.color,u.initial(n.topAlpha*e.alpha*s)),alpha:n.topAlpha*e.alpha*s},a++,this.verts[a]={pos:new A(n.pos.x,n.pos.y+l),uv:new A(n.texOffset,1),color:E(n.color,u.initial(n.bottomAlpha*e.alpha*s)),alpha:n.topAlpha*e.alpha*s},a++,r=n}}}}class et{percent=0;duration=0;alpha=0;nodes=[];fadingOut=!1;constructor(){this.reset(Math.random())}reset(a){this.percent=a,this.duration=p(12,32),this.alpha=0,this.nodes=[],this.fadingOut=!1;const e=new A(p(-40,60),p(40,90));let r=Math.random();const o=x(y.colors);for(let n=0;n<40;n++){const i=x(y.colors),s={pos:new A(e.x,e.y),texOffset:r,height:p(10,80),topAlpha:p(.3,.8),bottomAlpha:p(.5,1),sineOffset:Math.random()*6.2831855,color:new u(_(o.x,i.x,p(0,.3)),_(o.y,i.y,p(0,.3)),_(o.z,i.z,p(0,.3)))};r+=p(.02,.2),e.add(new A(p(4,10),p(-10,15))),this.nodes.push(s)}}}const rt=[320,180],[b,w]=rt;var S={program:0,count:0,vao:0,northernLightsTex:0,auroa:null,buffers:{particles:{colors:0,pos:0},auroa:{colors:0,pos:0,tex:0,alpha:0}},async init(t){const a=R(t,$,tt);t.useProgram(a),this.buffers={auroa:{colors:t.createBuffer(),pos:t.createBuffer(),tex:t.createBuffer(),alpha:t.createBuffer()},particles:{colors:t.createBuffer(),pos:t.createBuffer()}},this.northernLightsTex=await U(t,at,{wrap:"repeat",filter:"linear"}),this.program=a,this.auroa=new y},draw(t,a,e){if(!this.auroa)throw new Error("NorthernLights arkaplanı henüz hazır değil");t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE),t.useProgram(this.program);const r=t.getUniformLocation(this.program,"u_resolution");t.uniform2f(r,b,w),this.auroa.update(e),this.auroa.beforeRender();const o=[],n=[];for(const h of this.auroa.particles)n.push(h.pos.x,h.pos.y),o.push(h.color.x,h.color.y,h.color.z);t.uniform1i(t.getUniformLocation(this.program,"u_drawParticle"),1),d(t,this.buffers.auroa.colors,this.program,new Float32Array(o),"a_color",3),d(t,this.buffers.auroa.pos,this.program,new Float32Array(n),"a_pos",2),t.drawArrays(t.POINTS,0,this.auroa.particles.length);const i=[],s=[],c=[],l=[];for(const h of this.auroa.verts)i.push(h.color.x,h.color.y,h.color.z),s.push(h.pos.x,h.pos.y),c.push(h.uv.x,h.uv.y),l.push(h.alpha);d(t,this.buffers.auroa.pos,this.program,new Float32Array(s),"a_pos",2),d(t,this.buffers.auroa.colors,this.program,new Float32Array(i),"a_color",3),d(t,this.buffers.auroa.tex,this.program,new Float32Array(c),"a_uv",2),d(t,this.buffers.auroa.alpha,this.program,new Float32Array(l),"a_alpha",1),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.northernLightsTex),t.uniform1i(t.getUniformLocation(this.program,"u_tex"),0),t.uniform1i(t.getUniformLocation(this.program,"u_drawParticle"),0),t.drawArrays(t.TRIANGLES,0,this.auroa.verts.length)}};let f,m;const nt=async()=>{if(m){if(f=m.getContext("webgl2"),!f)throw new Error("webgl2 desteklenmiyor");f.viewport(0,0,m.width,m.height),await B.init(f),await S.init(f),console.log("initilized"),g([B,S])}};let V=0,C=performance.now();const g=t=>{if(!f||!m)return;const a=performance.now()/400;V=(performance.now()-C)/400,C=performance.now(),f.clearColor(0,0,0,0),f.clear(f.COLOR_BUFFER_BIT);for(const e of t)e.draw(f,a,V,m);requestAnimationFrame(()=>g(t))};self.onmessage=async t=>{switch(t.data.type){case 0:m=t.data.offscreen;try{await nt(),self.postMessage({state:"ready"})}catch(a){throw self.postMessage({state:"error"}),console.error(a),a}break;case 1:break;case 2:if(!f)return}}})();

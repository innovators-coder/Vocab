(function(){
var K='eps-vocab-v1',syn=window.speechSynthesis,SR=window.SpeechRecognition||window.webkitSpeechRecognition,UN=0;
function G(i){return document.getElementById(i)}
function uid(){return Date.now().toString(36)+(UN++).toString(36)+Math.random().toString(36).slice(2,5)}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function dk(d){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function today(){return dk(new Date())}
function norm(s){return String(s||'').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'')}
/*VM-START*/
/* Universal answer matcher for Mic mode. It never looks at a fixed word list of vocab: it reads the expected answer
   from the vocab entry and compares it with what was heard, by language rules (en, ko). Add a new language with VM.lang.x={...}.
   Matching order (stops at the first that fits): exact -> number -> homophone -> spacing -> plural -> near (near only asks to repeat). */
var VM=(function(){
var NW=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],TN=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function nw(n){if(n<20)return NW[n];if(n<100)return TN[(n/10)|0]+(n%10?' '+NW[n%10]:'');if(n<1e3)return NW[(n/100)|0]+' hundred'+(n%100?' '+nw(n%100):'');if(n<1e6)return nw((n/1e3)|0)+' thousand'+(n%1e3?' '+nw(n%1e3):'');if(n<1e9)return nw((n/1e6)|0)+' million'+(n%1e6?' '+nw(n%1e6):'');return null}
function ordw(w){var m={one:'first',two:'second',three:'third',five:'fifth',eight:'eighth',nine:'ninth',twelve:'twelfth'};return m[w]||(/y$/.test(w)?w.slice(0,-1)+'ieth':w+'th')}
/* Words that sound the same in English. Language rule table (not vocab). Each row = one sound. Used only when the WHOLE phrase then matches. */
var HC=[['to','too','two'],['for','four','fore'],['one','won'],['eight','ate'],['no','know'],['right','write','rite'],['see','sea'],['sun','son'],['hear','here'],['there','their','theyre'],['week','weak'],['wait','weight'],['meet','meat','mete'],['road','rode'],['flower','flour'],['hour','our'],['new','knew'],['buy','by','bye'],['be','bee'],['would','wood'],['whole','hole'],['peace','piece'],['plain','plane'],['wear','where','ware'],['which','witch'],['sale','sail'],['tail','tale'],['bear','bare'],['dear','deer'],['mail','male'],['pair','pear','pare'],['flew','flu'],['tea','tee'],['eye','i','aye'],['ok','okay'],['allowed','aloud'],['brake','break'],['cell','sell'],['cent','scent','sent'],['die','dye'],['fair','fare'],['great','grate'],['heal','heel'],['hi','high'],['knight','night'],['made','maid'],['pain','pane'],['real','reel'],['sew','so','sow'],['stair','stare'],['threw','through'],['waist','waste'],['way','weigh'],['wine','whine'],['you','ewe','yew']],HOM={};
HC.forEach(function(r){r.forEach(function(w){HOM[w]=r[0]})});
var CT=[[/\bgonna\b/g,'going to'],[/\bwanna\b/g,'want to'],[/\bgotta\b/g,'got to'],[/\balright\b/g,'all right'],[/\bcan't\b/g,'can not'],[/\bcannot\b/g,'can not'],[/\bwon't\b/g,'will not'],[/\bshan't\b/g,'shall not'],[/n't\b/g,' not'],[/'re\b/g,' are'],[/'m\b/g,' am'],[/'ll\b/g,' will'],[/'ve\b/g,' have'],[/\b(it|that|what|he|she|there|here|who|where|how)'s\b/g,'$1 is'],[/'d\b/g,' would'],[/'s\b/g,'']];
function lev(a,b){var m=a.length,n=b.length,d=[],i,j;for(i=0;i<=m;i++){d[i]=[i]}for(j=1;j<=n;j++)d[0][j]=j;for(i=1;i<=m;i++)for(j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]==b[j-1]?0:1));return d[m][n]}
function eq(a,b){return a.length==b.length&&a.every(function(x,i){return x==b[i]})}
var en={
 base:function(t){t=String(t||'').toLowerCase().replace(/[\u2018\u2019\u00b4`]/g,"'").replace(/(\d),(?=\d{3}\b)/g,'$1').replace(/(\d)\.(\d)/g,'$1 point $2').replace(/%/g,' percent ');CT.forEach(function(c){t=t.replace(c[0],c[1])});return t.replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/(\d)(?!(?:st|nd|rd|th)\b)(\p{L})/gu,'$1 $2').replace(/(\p{L})(\d)/gu,'$1 $2').split(/\s+/).filter(Boolean)},
 nums:function(a){var o=[];a.forEach(function(x){var m;if(/^\d+$/.test(x)){var s=nw(+x);if(s&&x.length<10){o.push.apply(o,s.split(' '));return}}else if((m=/^(\d+)(st|nd|rd|th)$/.exec(x))&&nw(+m[1])){var p=nw(+m[1]).split(' ');p[p.length-1]=ordw(p[p.length-1]);o.push.apply(o,p);return}o.push(x)});return o.filter(function(x,i,r){return !(x=='and'&&i>0&&/^(hundred|thousand|million)$/.test(r[i-1])&&i<r.length-1)})},
 canon:function(a){return a.map(function(x){return HOM[x]||x})},
 plural:function(a,b){return a!=b&&(a+'s'==b||b+'s'==a||a+'es'==b||b+'es'==a||(a.slice(-1)=='y'&&a.slice(0,-1)+'ies'==b)||(b.slice(-1)=='y'&&b.slice(0,-1)+'ies'==a))},
 one:function(h,x,top){
  var h1=en.base(h),e1=en.base(x);if(!h1.length||!e1.length)return null;if(eq(h1,e1))return 'exact';
  var h2=en.nums(h1),e2=en.nums(e1);if(eq(h2,e2))return 'number';
  var hc=en.canon(h2),ec=en.canon(e2);
  if(eq(hc,ec)){var d=0;h2.forEach(function(t,i){if(t!=e2[i])d++});if(d<=Math.max(1,Math.floor(h2.length/2)))return 'homophone'}
  if(h2.join('')==e2.join(''))return 'spacing';
  if(top&&hc.length==ec.length){var df=[];hc.forEach(function(t,i){if(t!=ec[i])df.push(i)});
   if(df.length==1){var i=df[0],a=hc[i],b=ec[i];if(i==hc.length-1&&en.plural(a,b))return 'plural';if(a.length>=6&&b.length>=6&&lev(a,b)==1)return 'near'}}
  return null}
};
var ko={
 base:function(t){return String(t||'').normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'')},
 one:function(h,x){var a=ko.base(h),b=ko.base(x);return a&&b&&a.length%b.length==0&&a==new Array(a.length/b.length+1).join(b)?'exact':null}
};
var L={en:en,ko:ko};
/* Said the answer more than once (to go to go to go): every part must match safely, then it counts as one answer. */
en.rep=function(h,x){var p=String(h||'').trim().split(/\s+/);if(p.length<2)return null;for(var k=2;k<=10;k++){if(p.length%k)continue;var z=p.length/k,w=null,ok=true;for(var j=0;j<k&&ok;j++){var q=en.one(p.slice(j*z,(j+1)*z).join(' '),x,false);if(!q||SAFE.indexOf(q)<0)ok=false;else if(!w||RANK.indexOf(q)>RANK.indexOf(w))w=q}if(ok)return w}return null};
/* Expected answer -> accepted variants. Split on / , ; and also try it without (bracket text). */
function variants(s){var o=[];String(s||'').replace(/(\d),(?=\d{3}\b)/g,'$1').split(/[\/,;]/).forEach(function(p){p=p.trim();if(!p)return;o.push(p);var q=p.replace(/\([^)]*\)/g,' ').replace(/\s+/g,' ').trim();if(q&&q!=p)o.push(q)});return o.filter(function(x,i,a){return a.indexOf(x)==i})}
var RANK=['exact','number','homophone','spacing','plural','near'],SAFE=['exact','number','homophone','spacing'];
/* judge(expectedText, [{t:transcript,c:confidence}], 'en'|'ko', {interim:bool}) -> {r:'ok'|'no'|'unsure', how, idx, heard}
   Alternatives after the first one may only match safely. 'near' is never accepted: it returns 'unsure' (ask to repeat). */
function judge(exp,alts,lang,opt){opt=opt||{};var G=L[lang]||en,V=variants(exp),best=null,near=null;
 (alts||[]).forEach(function(a,i){var c=a.c;if(i>0&&c>0&&c<.2)return;V.forEach(function(v){var how=G.one(a.t,v,i==0)||(G.rep?G.rep(a.t,v):null);if(!how)return;
  if(how=='near'){if(!near)near={how:how,idx:i,heard:a.t};return}
  if(i>0&&SAFE.indexOf(how)<0)return;if(opt.interim&&SAFE.indexOf(how)<0)return;
  if(!best||RANK.indexOf(how)<RANK.indexOf(best.how))best={how:how,idx:i,heard:a.t,v:v}})});
 if(best)return {r:'ok',how:best.how,idx:best.idx,heard:best.heard,v:best.v};
 var h0=alts&&alts[0]?alts[0].t:'';if(near&&!opt.interim)return {r:'unsure',how:'near',idx:0,heard:near.heard};
 return {r:'no',how:'',idx:-1,heard:h0}}
return {judge:judge,variants:variants,lang:L,nw:nw}})();
/*VM-END*/
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
var SEED=[['Places',[['사무실','sa-mu-sil','office'],['공장','gong-jang','factory'],['병원','byeong-won','hospital'],['시장','si-jang','market'],['학교','hak-gyo','school'],['식당','sik-dang','restaurant'],['은행','eun-haeng','bank'],['집','jip','house']]],
['Greetings',[['안녕하세요','an-nyeong-ha-se-yo','hello'],['감사합니다','gam-sa-ham-ni-da','thank you'],['죄송합니다','joe-song-ham-ni-da','I am sorry'],['네','ne','yes'],['아니요','a-ni-yo','no'],['잘 부탁합니다','jal bu-tak-ham-ni-da','please take care of me']]],
['Work',[['일','il','work'],['회사','hoe-sa','company'],['월급','wol-geup','salary'],['사장님','sa-jang-nim','boss'],['동료','dong-ryo','coworker'],['휴일','hyu-il','day off']]],
['Food',[['밥','bap','rice / meal'],['물','mul','water'],['김치','gim-chi','kimchi'],['고기','go-gi','meat'],['빵','ppang','bread'],['커피','keo-pi','coffee']]],
['Verbs',[['먹다','meok-da','to eat'],['가다','ga-da','to go'],['오다','o-da','to come'],['하다','ha-da','to do'],['자다','ja-da','to sleep'],['보다','bo-da','to see'],['일하다','il-ha-da','to work'],['마시다','ma-si-da','to drink']]]];
function load(){var o=null;try{o=JSON.parse(localStorage.getItem(K)||'null')}catch(x){}
 if(!o||!Array.isArray(o.w)||!Array.isArray(o.c)){o={w:[],c:[],s:{},g:{},best:{},dl:{d:'',ids:[]}};
  SEED.forEach(function(c){var id=uid();o.c.push({id:id,n:c[0]});c[1].forEach(function(x){o.w.push({id:uid(),k:x[0],r:x[1],e:x[2],c:id,x:'',f:0,ok:0,no:0,st:0,m:0})})})}
 o.s=Object.assign({cat:'all',mode:'choice',dir:'ke',rom:1,play:0,next:0,miss:0,star:0,lim:20},o.s||{});
 o.g=Object.assign({n:0,d:'',st:0,l:''},o.g||{});o.best=o.best||{};o.dl=o.dl||{d:'',ids:[]};return o}
var V=load();function sv(){try{localStorage.setItem(K,JSON.stringify(V))}catch(x){}}
var IC={"flame":["M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"],"star":["M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1z"],"vol":["M11 5L6 9H2v6h4l5 4z","M19 5a10 10 0 0 1 0 14M15.5 8.5a5 5 0 0 1 0 7"],"mic":["M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z","M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"],"clock":["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M12 6v6l4 2"],"check":["M22 11.1V12a10 10 0 1 1-5.9-9.1","M22 4L12 14l-3-3"],"x":["M18 6L6 18M6 6l12 12"],"layers":["M12 2L2 7l10 5 10-5z","M2 17l10 5 10-5M2 12l10 5 10-5"],"kbd":["M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z","M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"],"sliders":["M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"],"plus":["M12 5v14M5 12h14"],"list":["M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"],"reset":["M1 4v6h6","M3.5 15a9 9 0 1 0 2.1-9.4L1 10"],"shuffle":["M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"],"edit":["M12 20h9","M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"],"trash":["M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"],"chev":["M6 9l6 6 6-6"]};
function ic(n,z){return '<svg class=vi viewBox="0 0 24 24" width='+(z||18)+' height='+(z||18)+' fill=none stroke=currentColor stroke-width=1.8 stroke-linecap=round stroke-linejoin=round aria-hidden=true>'+IC[n].map(function(d){return '<path d="'+d+'"/>'}).join('')+'</svg>'}
var S={q:[],i:0,sc:0,ans:0,cor:0,res:null,o:[],open:false,tm:0,nt:0,ls:0,fl:0,wq:'',wc:'all',back:'',dirty:0};
function W(id){return V.w.find(function(x){return x.id==id})}
function lv(w){return w.st>=3?2:(w.ok?1:0)}
function cname(id){var c=V.c.find(function(x){return x.id==id});return c?c.n:'—'}
function cnt(id){return V.w.filter(function(w){return w.c==id}).length}
function cur(){return W(S.q[S.i])}
function daily(){var t=today(),d=V.dl;d.ids=d.ids.filter(function(i){return W(i)});
 if(d.d!=t||!d.ids.length){var a=V.w.map(function(w){return {w:w,s:(w.m?0:lv(w)==0?1:lv(w)==1?2:3)+Math.random()*.9}}).sort(function(x,y){return x.s-y.s});d.d=t;d.ids=a.slice(0,10).map(function(x){return x.w.id});sv()}
 return d.ids.map(W)}
function pool(){var s=V.s,a=V.w;if(s.cat=='day')a=daily();else if(s.cat!='all')a=a.filter(function(w){return w.c==s.cat});
 if(s.miss)a=a.filter(function(w){return w.m});if(s.star)a=a.filter(function(w){return w.f});return a}
function say(t){if(!syn)return;try{syn.cancel();var u=new SpeechSynthesisUtterance(t);u.lang='ko-KR';u.rate=.85;var v=syn.getVoices().filter(function(x){return /^ko/i.test(x.lang)})[0];if(v)u.voice=v;syn.speak(u)}catch(x){}}
function clr(){clearTimeout(AT);clearInterval(S.tm);S.tm=0;clearTimeout(S.nt);S.nt=0;if(S.rec){try{S.rec.abort()}catch(x){}S.rec=0}S.ls=0}
function start(){clr();S.q=shuffle(pool().map(function(w){return w.id}));S.i=0;S.sc=0;S.ans=0;S.cor=0;prep()}
function prep(){clr();S.res=null;S.heard='';S.err='';S.fl=0;S.nm=0;while(S.i<S.q.length&&!cur())S.i++;var w=cur();if(!w)return;var m=V.s.mode;S.o=[];
 if(m=='match'){var ids=S.q.slice(S.i,S.i+5).filter(W);S.mt={ids:ids,ko:shuffle(ids.slice()),en:shuffle(ids.slice()),done:{},miss:{},sel:null,bad:[],lock:0}}
 if(m=='choice'||m=='time'||m=='listen'||m=='spell'){var ke=m=='spell'?false:(m=='listen'||V.s.dir=='ke'),A=ke?w.e:w.k,seen={},d=[];
  shuffle(pool().concat(V.w)).sort(function(x,y){return (y.c==w.c)-(x.c==w.c)}).forEach(function(x){var t=ke?x.e:x.k;if(x.id!=w.id&&t!=A&&!seen[t]){seen[t]=1;d.push(t)}});
  S.o=shuffle([A].concat(d.slice(0,3)))}
 if(m=='time'){S.tl=8;S.t0=Date.now();S.tm=setInterval(tick,100)}
 if(m=='listen'||m=='spell'||(m!='match'&&V.s.play&&V.s.dir=='ke'))say(w.k)}
function tick(){var r=S.tl-(Date.now()-S.t0)/1000,b=G('vtb');if(r<=0){answer(false,-1);return}if(b)b.style.width=(r/S.tl*100)+'%'}
function answer(ok,p){if(S.res)return;var w=cur();if(!w)return;var rem=S.tm?Math.max(0,S.tl-(Date.now()-S.t0)/1000):0;clr();S.res={ok:ok,p:p};
 w.ok+=ok?1:0;w.no+=ok?0:1;w.st=ok?w.st+1:0;w.m=ok?0:1;S.ans++;if(ok){S.cor++;S.sc+=10+Math.round(rem)}
 var g=V.g,t=today();if(g.d!=t){g.d=t;g.n=0}g.n++;if(g.l!=t){g.st=g.l==dk(new Date(Date.now()-864e5))?g.st+1:1;g.l=t}
 V.best[V.s.mode]=Math.max(V.best[V.s.mode]||0,S.sc);S.open=false;sv();
 if(V.s.play&&V.s.dir=='ek')say(w.k);
 rc();if(V.s.next)S.nt=setTimeout(next,ok?1300:2400)}
function next(){clr();S.i++;prep();rc();amic()}
function check(){var i=G('vti');if(!i||S.res)return;if(!i.value.trim()){i.focus();return}var w=cur(),v=norm(i.value),ke=V.s.dir=='ke';
 answer(ke?w.e.split(/[\/,;]/).some(function(p){return norm(p)==v||norm(p.replace(/\(.*\)/,''))==v}):norm(w.k)==v,0)}
var AT=0;
/* Auto mic: in Mic mode the mic starts by itself on every new word (waits for the spoken word to finish first). */
function amic(){clearTimeout(AT);var n=0;(function go(){if(!SR||V.s.mode!='mic'||!on8()||S.open||S.ls||S.res||S.fl||S.nm||S.blk||S.err||!cur()||document.hidden)return;if(syn&&syn.speaking&&n++<30){AT=setTimeout(go,150);return}AT=setTimeout(function(){if(V.s.mode=='mic'&&on8()&&!S.open&&!S.ls&&!S.res&&!S.fl&&!S.nm&&!S.blk&&cur())mic()},300)})()}
document.addEventListener('click',function(){setTimeout(amic,80)});
document.addEventListener('visibilitychange',function(){if(document.hidden){if(S.ls)clr()}else setTimeout(amic,300)});
function mic(){var w=cur();if(!w||S.ls)return;S.blk=0;try{var r=new SR();var ke=V.s.dir=='ke';r.lang=ke?'en-US':'ko-KR';r.maxAlternatives=5;try{if('phrases' in r&&window.SpeechRecognitionPhrase){var ph=(ke?w.e.split(/[\/,;]/).reduce(function(a,p){a.push(p.trim(),p.replace(/\(.*\)/,'').trim());return a},[]):[w.k]).filter(function(x,i,a){return x&&a.indexOf(x)==i});r.phrases=ph.map(function(x){return new SpeechRecognitionPhrase(x,5)})}}catch(x){}S.rec=r;S.ls=1;S.err='';S.rt=0;
 r.interimResults=true;var lang=ke?'en':'ko',exp=ke?w.e:w.k,IT=0,fin=function(g,txt){clearTimeout(IT);S.ls=0;S.heard=(g.r=='ok'&&g.v)?g.v:txt;try{r.stop()}catch(x){}if(g.r=='unsure'){S.err='Almost. Say it again.';rc();return}answer(g.r=='ok',0)};
 r.onresult=function(e){var R=e.results[Math.min(e.resultIndex||0,e.results.length-1)],A=[];for(var i=0;i<R.length;i++)A.push({t:R[i].transcript,c:R[i].confidence});var g=VM.judge(exp,A,lang,{interim:!R.isFinal});if(!R.isFinal){var lv=document.getElementById('vlive');if(lv)lv.textContent=A[0].t;clearTimeout(IT);if(g.r=='ok')IT=setTimeout(function(){if(S.ls&&!S.res)fin(g,g.heard)},450);return}fin(g,A[0].t)};
 r.onerror=function(e){if(e.error=='no-speech'&&S.rt<3)return;if(e.error=='not-allowed'||e.error=='service-not-allowed')S.blk=1;S.ls=0;S.err=(e.error=='not-allowed'||e.error=='service-not-allowed')?'Mic blocked. Allow mic access (needs https or localhost), or use self-check.':e.error=='audio-capture'?'No microphone found, or another app is using it.':e.error=='network'?'No internet. Speech recognition needs a connection.':'Did not hear you. Try again.';if(!S.res)rc()};
 r.onend=function(){if(S.ls&&!S.res){if(S.rt<3&&S.rec===r){S.rt++;try{r.start();return}catch(x){}}S.ls=0;S.err='Did not hear you. Try again.';rc()}};r.start();rc()}catch(x){S.nm=1;S.ls=0;rc()}}
function ansb(w,ke){var rm=w.r;return '<div class=vans>'+(ke?esc(w.e):'<span class=kr>'+esc(w.k)+'</span>'+(rm?' <small>'+esc(w.r)+'</small>':''))+(w.x?'<div class=vex>'+esc(w.x)+'</div>':'')+'</div>'}
function card(){var a=pool(),s=V.s,m=s.mode,h='';
 if(!V.w.length)return '<div class=vem>No words yet. Tap ＋ Add word in Setup.</div>';
 if(!S.q.length){if(!a.length)return '<div class=vem>No words match these filters. Change Category or untick Missed / Starred.</div>';start()}
 if(S.i>=S.q.length)return '<div class=vsum><div class=vbig>'+S.sc+' pts</div><p>'+S.cor+' of '+S.ans+' correct</p><div class=vrow><button class=vbtn data-a=again>Again</button>'+(V.w.some(function(w){return w.m})?'<button class="vbtn alt" data-a=miss>Practice mistakes</button>':'')+'</div></div>';
 if(m=='match')return mcard();
 var w=cur(),ke=m=='spell'?false:(s.dir=='ke'||m=='listen'),r=S.res,self=m=='flash'||(m=='mic'&&(!SR||S.fl||S.nm));
 h+='<div class=vhd><button class="vst'+(w.f?' on':'')+'" data-a=star aria-label="Star word">'+ic('star',22)+'</button><span class=vch style="position:relative">'+esc(cname(w.c))+' '+ic('chev',12)+'<select data-s=cat aria-label="Change category" style="position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font-size:16px">'+catopts(s.cat)+'</select></span><span class=vn>'+(S.i+1)+' / '+S.q.length+'</span><button class=vib data-a=shuf aria-label="Shuffle words">'+ic('shuffle',20)+'</button></div>';
 if(m=='time')h+='<div class=vtm><i id=vtb></i></div>';
 if((m=='listen'||m=='spell')&&!r)h+='<button class=vsp data-a=say style="margin:12px auto 4px">'+ic('vol')+' Tap to hear</button><div class=vhint>'+(m=='spell'?'Listen, then pick the correct Hangul.':'Listen, then pick the meaning.')+'</div>';else h+='<div class="vbg'+(ke?' kr':'')+'">'+esc(ke?w.k:w.e)+'</div>';
 if(ke&&w.r&&(m!='listen'||r))h+='<div class=vro>'+esc(w.r)+'</div>';
 if(m=='mic'&&!r)h+='<div class=vhint>Say it in '+(ke?'English':'Korean')+'</div>';
 if((ke||r)&&!((m=='listen'||m=='spell')&&!r))h+='<button class=vsp data-a=say>'+ic('vol')+' Hear Korean</button>';
 if(m=='choice'||m=='time'||m=='listen'||m=='spell'){var A=ke?w.e:w.k;h+='<div class=vop>'+S.o.map(function(t,i){var c=r?(t==A?' ok':(i==r.p?' bad':'')):'';return '<button class="vo'+c+(ke?'':' kr')+'" data-a=pick data-i='+i+(r?' disabled':'')+'>'+esc(t)+'</button>'}).join('')+'</div>'}
 else if(m=='type'&&!r)h+='<div class=vtp><input id=vti class=vin autocomplete=off autocapitalize=off spellcheck=false enterkeyhint=done placeholder="'+(ke?'English meaning':'Type in Korean (한글)')+'"><button class=vbtn data-a=check>Check</button></div><div class=vhint>Type the answer, then press Enter.</div>';
 else if(self&&!r){if(m=='mic'&&!SR)h+='<div class=vhint>Mic is not supported in this browser. Say it out loud, then self-check.</div>';
  if(!S.fl)h+='<button class="vbtn alt" data-a=flip>Tap to show answer</button>';
  else h+=ansb(w,ke)+'<div class=vrow><button class="vbtn bad" data-a=no>Not yet</button><button class=vbtn data-a=yes>I know</button></div>'}
 else if(m=='mic'&&!r)h+='<button class="vmic'+(S.ls?' on':'')+'" data-a=mic>'+(S.ls?'Listening…':ic('mic',20)+' Tap and speak')+'</button>'+(S.ls?'<div class=vhint id=vlive></div>':'')+(S.err?'<div class=vhint>'+esc(S.err)+'</div>':'')+'<button class=vlink data-a=sc>Self-check instead</button>';
 if(r){h+='<div class="vfb '+(r.ok?'ok':'bad')+'">'+(r.ok?ic('check')+' Correct':(r.p==-1?ic('clock')+' Time is up':ic('x')+' Not quite'))+'</div>'+(S.heard?'<div class=vhint>You said: '+esc(S.heard)+'</div>':'')+ansb(w,ke)+'<button class=vbtn data-a=next>'+(S.i+1>=S.q.length?'Finish':'Next question →')+'</button>'}
 else if(!self&&m!='mic')h+='<button class=vlink data-a=skip>I do not know</button>';
 return h}
function mrec(w,ok){w.ok+=ok?1:0;w.no+=ok?0:1;w.st=ok?w.st+1:0;w.m=ok?0:1;S.ans++;if(ok){S.cor++;S.sc+=10}var g=V.g,t=today();if(g.d!=t){g.d=t;g.n=0}g.n++;if(g.l!=t){g.st=g.l==dk(new Date(Date.now()-864e5))?g.st+1:1;g.l=t}V.best.match=Math.max(V.best.match||0,S.sc);sv()}
function mpick(sd,id){var M=S.mt;if(!M||M.done[id]||M.lock)return;var w=W(id);
 if(!M.sel||M.sel.sd==sd){M.sel={sd:sd,id:id};if(sd=='k'&&w)say(w.k);rc();return}
 var a=M.sel.id;
 if(a==id){M.done[id]=1;M.sel=null;mrec(w,!M.miss[id]);say(w.k);rc();
  if(V.s.next&&Object.keys(M.done).length==M.ids.length)S.nt=setTimeout(function(){if(S.mt===M){S.i+=5;prep();rc()}},1500);return}
 M.miss[a]=1;M.miss[id]=1;M.bad=[M.sel.sd+a,sd+id];M.sel=null;M.lock=1;rc();
 setTimeout(function(){if(S.mt===M){M.bad=[];M.lock=0;rc()}},600)}
function mcard(){var M=S.mt;if(!M)return '';var n=M.ids.length,d=Object.keys(M.done).length,last=S.i+5>=S.q.length;
 function bt(sd,id){var w=W(id),k=sd+id,c=M.done[id]?' ok':(M.bad.indexOf(k)>=0?' bad':(M.sel&&M.sel.sd==sd&&M.sel.id==id?' sel':''));
  return '<button class="vo'+(sd=='k'?' kr':'')+c+'" data-a=mp data-sd='+sd+' data-id='+id+(M.done[id]?' disabled':'')+'>'+esc(sd=='k'?w.k:w.e)+'</button>'}
 return '<div class=vhd><span class=vch>Match pairs</span><span class=vn>'+d+' / '+n+'</span><button class=vib data-a=shuf aria-label="Shuffle words">'+ic('shuffle',20)+'</button></div><div class=vhint>Tap a Korean word, then tap its meaning.</div><div class=vmt><div>'+M.ko.map(function(i){return bt('k',i)}).join('')+'</div><div>'+M.en.map(function(i){return bt('e',i)}).join('')+'</div></div>'+(d==n?'<div class="vfb ok">'+ic('check')+' Round complete</div><button class=vbtn data-a=mnext>'+(last?'Finish':'Next round →')+'</button>':'')}
function catopts(v){return [['all','All ('+V.w.length+')'],['day','Daily Set ('+daily().length+')']].concat(V.c.map(function(c){return [c.id,c.n+' ('+cnt(c.id)+')']})).map(function(x){return '<option value="'+esc(x[0])+'"'+(String(x[0])==String(v)?' selected':'')+'>'+esc(x[1])+'</option>'}).join('')}
function stat(){var g=V.g,t=today(),L=V.s.lim||20,n=g.d==t?g.n:0,st=(g.l==t||g.l==dk(new Date(Date.now()-864e5)))?g.st:0,kn=V.w.filter(function(w){return lv(w)==2}).length,rv=V.w.filter(function(w){return w.m}).length,b=V.best[V.s.mode];
 return '<div class=vtop><span class=vchip>'+ic('flame')+(st?st+'-day streak':'No streak yet')+'</span><span class=vgoal>Today <b>'+n+'</b> / '+L+(n>=L?' ✓':'')+'</span></div><div class=vbar><i style="width:'+Math.min(100,n/L*100)+'%"></i></div><div class=v3>'+[['Score',S.sc],['Known',kn],['Review',rv]].map(function(x){return '<div><b>'+x[1]+'</b><span>'+x[0]+'</span></div>'}).join('')+'</div><div class=vsm>'+S.ans+' of '+S.q.length+' answered this session'+(b?' · Best '+b:'')+'</div>'}
function sel(k,o,v,id){return '<select class=vsel data-s='+k+(id?' id='+id:'')+'>'+o.map(function(x){return '<option value="'+esc(x[0])+'"'+(String(x[0])==String(v)?' selected':'')+'>'+esc(x[1])+'</option>'}).join('')+'</select>'}
function chk(k,l){return '<label class=vck><input type=checkbox data-s='+k+(V.s[k]?' checked':'')+'><span>'+l+'</span></label>'}
var MO=[['choice','4 Choices'],['time','Time (8s)'],['mic','Mic'],['type','Typing'],['flash','Flashcard'],['listen','Listening'],['match','Match'],['spell','Spelling']],DO=[['ke','Korean → English'],['ek','English → Korean']];
function summ(){var s=V.s;return (s.cat=='all'?'All':s.cat=='day'?'Daily Set':cname(s.cat))+' · '+MO.find(function(x){return x[0]==s.mode})[1]+(s.mode=='listen'||s.mode=='match'||s.mode=='spell'?'':' · '+(s.dir=='ke'?'KR → EN':'EN → KR'))}
function sw(k,l){return '<label class=vsw><span>'+l+'</span><input type=checkbox data-s='+k+(V.s[k]?' checked':'')+'><i></i></label>'}
function lk(a,i,l,d){return '<button class="vlk'+(d?' dg':'')+'" data-a='+a+'>'+ic(i)+'<span class=vlt>'+l+'</span><span class=vc>'+ic('chev',16)+'</span></button>'}
function setup(){var s=V.s,co=[['all','All ('+V.w.length+')'],['day','Daily Set ('+daily().length+')']].concat(V.c.map(function(c){return [c.id,c.n+' ('+cnt(c.id)+')']}));
 return '<div class="vgrp vfg"><div class=vf><label>Category</label><div class=vcr>'+sel('cat',co,s.cat)+'<button class=vib data-a=cats aria-label="Edit categories">'+ic('edit')+'</button></div></div><div class=vf><label>Words</label><div class=vcr><button class="vsel vmw" data-a=words>'+ic('list',18)+'<span>Manage words ('+V.w.length+')</span></button><button class=vib data-a=add aria-label="Add word">'+ic('plus')+'</button></div></div><div class=vf><label>Direction</label>'+sel('dir',DO,s.dir)+'</div><div class=vf><label>Daily limit (answers)</label>'+sel('lim',[[10,'10'],[20,'20'],[30,'30'],[50,'50'],[100,'100']],s.lim)+'</div></div><div class=vgrp>'+sw('miss','Review missed only')+sw('star','Starred only')+sw('play','Auto-play sound')+sw('next','Auto-next')+'</div><div class=vgrp>'+lk('reset','reset','Reset progress',1)+'</div>'}
var MI=['check','clock','mic','kbd','layers','vol','shuffle','edit'],NM={1:'Vowels',0:'Consonants',2:'Lessons',3:'Basics',6:'Sentences',7:'Intro',8:'Vocab',4:'Conjugate'};
function pager(){return '<div class=vpg>'+[1,0,2,3,6,7,8,4].map(function(n){return '<button class="vdt'+(n==8?' on':'')+'" data-a=gt data-t='+n+' aria-label='+NM[n]+'></button>'}).join('')+'</div><div class=vhint2>Swipe or use ← → to change tab</div>'}
function body(){var c=card(),s=V.s;return '<details class=\"sghow\"><summary>How to use this tab</summary><ol><li><span>Tap <b>Settings</b> to pick a <b>Category</b>, the <b>Direction</b> (Korean → English or English → Korean), and your daily limit.</span></li><li><span>Choose a <b>Practice mode</b>: Choices, Time (8 seconds), Mic, Typing, Cards, Listening, Match, or Spelling. In Listening, hear the word and pick its meaning. In Match, tap a Korean word and then its meaning. In Spelling, hear the word and pick the correct Hangul.</span></li><li><span>Answer the word on the card. Tap <b>Hear Korean</b> to listen. In Cards mode, tap <b>Tap to show answer</b>, then tap <b>I know</b> or <b>Not yet</b>.</span></li><li><span>Tap the star to mark a word. Turn on <b>Review missed only</b> or <b>Starred only</b> in Settings to practice just those words.</span></li><li><span>Tap <b>Manage words</b> to search, edit, or delete words. Tap + to add your own words. Tap the pencil to edit categories.</span></li><li><span><b>Progress:</b> the streak shows your days in a row. The Today bar shows your answers for the day. Score, Known, and Review show how you are doing. It saves on this device. Back it up in <b>⚙ Settings</b> with Export.</span></li></ol></details><div class=vp><button class=vsh data-a=tog aria-expanded='+S.open+'>'+ic('sliders',20)+'<span class=vsl><b>Settings</b><small id=vsum>'+esc(summ())+'</small></span><span class="vc'+(S.open?' up':'')+'">'+ic('chev',18)+'</span></button>'+(S.open?setup():'')+'</div>'+'<div class=vlb>Practice mode</div><div class=vmo>'+MO.map(function(x,i){return '<button class="vmc'+(x[0]==s.mode?' on':'')+'" data-a=mode data-v='+x[0]+' aria-label="'+x[1]+'">'+ic(MI[i],20)+'<span>'+x[1].replace(' (8s)','').replace('4 ','').replace('Flashcard','Cards')+'</span></button>'}).join('')+'</div><div class="vp vcd" id=vcard>'+c+'</div><div class=vp id=vstat>'+stat()+'</div>'}
function rr(){var l=G('list');if(l)l.innerHTML='<div class=vx>'+body()+'</div>';foc()}
function rc(){var c=card(),a=G('vstat'),b=G('vcard');if(!a||!b){rr();return}a.innerHTML=stat();b.innerHTML=c;foc()}
function foc(){var i=G('vti');if(i&&!S.res)try{i.focus({preventScroll:true});kbs()}catch(x){}}
function kbs(){setTimeout(function(){var c=G('vcard'),i=G('vti');if(!i||document.activeElement!==i)return;try{c.scrollIntoView({block:'start',behavior:'smooth'})}catch(x){}},320)}
document.addEventListener('focusin',function(e){if(e.target.id=='vti')kbs()});
if(window.visualViewport)visualViewport.addEventListener('resize',kbs);
function on8(){var b=G('t8');return b&&b.getAttribute('aria-selected')=='true'}
window.vocabList=function(){return '<div class=vx>'+body()+'</div>'};
window.vocCnt=function(){var k=V.w.filter(function(w){return lv(w)==2}).length;window.__vp=V.w.length?k/V.w.length*100:0;return k+' of '+V.w.length+' words known'};
window.vocPct=function(){window.vocCnt();return window.__vp};
window.vocStop=function(){clr();if(syn)try{syn.cancel()}catch(x){}closeM()};
function toastM(t){if(typeof toast=='function')toast(t,2000)}
function modal(h){closeM();var d=document.createElement('div');d.id='vm';d.className='vm';d.innerHTML='<div class=vb role=dialog aria-modal=true>'+h+'</div>';d.addEventListener('click',function(e){if(e.target===d)mclose()});document.body.appendChild(d)}
function closeM(){var d=G('vm');if(d)d.remove()}
function mclose(){closeM();if(S.dirty){S.dirty=0;S.q=[];clr()}if(on8())rr()}
function wlist(){var q=norm(S.wq),a=V.w.filter(function(w){return (S.wc=='all'||w.c==S.wc)&&(!q||norm(w.k+w.r+w.e).indexOf(q)>=0)});
 return a.length?a.map(function(w){return '<div class=vrw><div class=vrt><b class=kr>'+esc(w.k)+'</b> <i>'+esc(w.r)+'</i><div>'+esc(w.e)+' · <small>'+esc(cname(w.c))+' · '+['New','Learning','Known'][lv(w)]+'</small></div></div><button class=vib data-a=we data-id='+w.id+' aria-label=Edit>'+ic('edit')+'</button><button class=vib data-a=wd data-id='+w.id+' aria-label=Delete>'+ic('trash')+'</button></div>'}).join(''):'<div class=vem>No words found.</div>'}
function words(){S.wq='';S.wc='all';modal('<h3>Words ('+V.w.length+')</h3><div class=vtp><input id=vwq class=vin placeholder="Search words"><button class=vbtn data-a=add2>'+ic('plus')+' Add</button></div>'+sel('wc',[['all','All categories']].concat(V.c.map(function(c){return [c.id,c.n]})),'all')+'<div class=vls id=vl>'+wlist()+'</div><div class=vrow><button class=vbtn data-a=mc>Close</button></div>')}
var RI=['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'],IJ='ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ',
RV=['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'],
RF=['','ㄱ','ㄲ','ㄱㅅ','ㄴ','ㄴㅈ','ㄴㅎ','ㄷ','ㄹ','ㄹㄱ','ㄹㅁ','ㄹㅂ','ㄹㅅ','ㄹㅌ','ㄹㅍ','ㄹㅎ','ㅁ','ㅂ','ㅂㅅ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'],
FS={'ㄱ':'ㄱ','ㄲ':'ㄱ','ㅋ':'ㄱ','ㄱㅅ':'ㄱ','ㄴ':'ㄴ','ㄴㅈ':'ㄴ','ㄴㅎ':'ㄴ','ㄷ':'ㄷ','ㅅ':'ㄷ','ㅆ':'ㄷ','ㅈ':'ㄷ','ㅊ':'ㄷ','ㅌ':'ㄷ','ㅎ':'ㄷ','ㄹ':'ㄹ','ㄹㅂ':'ㄹ','ㄹㅅ':'ㄹ','ㄹㅌ':'ㄹ','ㄹㅎ':'ㄹ','ㅁ':'ㅁ','ㄹㅁ':'ㅁ','ㅂ':'ㅂ','ㅍ':'ㅂ','ㅂㅅ':'ㅂ','ㄹㅍ':'ㅂ','ㅇ':'ㅇ'},
FR={'ㄱ':'k','ㄴ':'n','ㄷ':'t','ㄹ':'l','ㅁ':'m','ㅂ':'p','ㅇ':'ng'};
function romOf(s){var T=[],i,c,o='',pv=0;s=String(s||'');
 for(i=0;i<s.length;i++){c=s.charCodeAt(i);
  if(s[i]=='['){var j=s.indexOf(']',i);if(j<0)j=s.length-1;T.push({raw:s.slice(i,j+1)});i=j}
  else if(c>=44032&&c<=55203){var n=c-44032;T.push({c:Math.floor(n/588),v:Math.floor(n%588/28),f:RF[n%28],h:s[i]})}
  else if(c>=12593&&c<=12686){}
  else T.push({raw:s[i]})}
 T.forEach(function(t,k){if(t.raw!=null)return;var n=T[k+1],f=t.f,sf='',p,nx;if(n&&n.raw!=null)n=null;
  if(!f){t.o='';return}
  if(!n){t.o=FR[FS[f]];return}
  if(f=='ㅂ'&&t.h=='십'&&n.h=='육'){n.c=2;t.o='m';return}
  if(n.c==11){
   if(f=='ㅇ'){t.o='ng';return}
   p=f.split('');
   if(p.length==1){if(f=='ㅎ'){t.o='';return}nx=IJ.indexOf(f);if(n.v==20&&n.h=='이'&&!n.f){if(f=='ㄷ')nx=12;else if(f=='ㅌ')nx=14}n.c=nx;t.o='';return}
   if(p[1]=='ㅎ'){n.c=IJ.indexOf(p[0]);t.o='';return}
   n.c=IJ.indexOf(p[1]);t.o=FR[FS[p[0]]];return}
  sf=FS[f];
  if(f.slice(-1)=='ㅎ'&&(n.c==0||n.c==3||n.c==12)){n.c=n.c==0?15:n.c==3?16:14;t.o=f=='ㅎ'?'':FR[FS[f]];return}
  if(f=='ㄹㄱ'&&n.c!=0)sf='ㄹ';
  if(n.c==5){if(sf=='ㄴ'||sf=='ㄹ'){sf='ㄹ';n.lat=1}else n.c=2}
  else if(n.c==2&&sf=='ㄹ'){n.c=5;n.lat=1}
  if(n.c==2||n.c==6){if(sf=='ㄱ')sf='ㅇ';else if(sf=='ㄷ')sf='ㄴ';else if(sf=='ㅂ')sf='ㅁ'}
  t.o=FR[sf]});
 T.forEach(function(t){if(t.raw!=null){o+=t.raw;pv=0;return}
  o+=(pv?'-':'')+(t.lat&&t.c==5?'l':RI[t.c])+RV[t.v]+t.o;pv=1});
 return o}
var RM=null;
function rmap(){if(RM)return RM;RM={};var ok=/^[a-z][a-z' ,.?!\-]*$/i;try{L.forEach(function(l){(l.ex||[]).forEach(function(e){if(typeof e[0]=='string'&&typeof e[1]=='string'&&ok.test(e[1])&&/[가-힣]/.test(e[0])&&!RM[e[0]])RM[e[0]]=e[1]})})}catch(x){}V.w.forEach(function(w){if(w.r)RM[w.k]=w.r});return RM}
window.__rom=function(k){var ps=String(k||'').trim().split(/(\[[^\]]*\])/),o='',H=/[가-힣]/;ps.forEach(function(p,i){if(!p)return;if(p.charAt(0)=='['&&p.slice(-1)==']'){var n=p.slice(1,-1);if(o&&H.test(ps[i-1].slice(-1)))o+='-';o+='['+(H.test(n)?romOf(n):n)+']'}else{if(o&&o.slice(-1)==']'&&H.test(p.charAt(0)))o+='-';o+=romOf(p)}});return o.replace(/\)([a-z])/g,')-$1')};
window.__mean=function(k,cb){k=String(k||'').trim();if(!/[가-힣]/.test(k)){cb('');return}
 var m={};try{L.forEach(function(l){(l.ex||[]).forEach(function(e){if(typeof e[0]=='string'&&typeof e[2]=='string'&&e[2]&&!/[가-힣]/.test(e[2])&&!m[e[0]])m[e[0]]=e[2]})})}catch(x){}
 try{V.w.forEach(function(w){if(w.e)m[w.k]=w.e})}catch(x){}
 if(Object.prototype.hasOwnProperty.call(m,k)){cb(m[k]);return}
 if(navigator.onLine===false||!window.fetch){cb('');return}
 var c=window.AbortController?new AbortController():null,t=setTimeout(function(){if(c)c.abort()},7000);
 fetch('https://api.mymemory.translated.net/get?langpair=ko|en&q='+encodeURIComponent(k.replace(/\[[^\]]*\]/g,'___')),c?{signal:c.signal}:{}).then(function(r){return r.json()}).then(function(j){clearTimeout(t);var s=j&&j.responseData&&j.responseData.translatedText;cb(typeof s=='string'&&!/MYMEMORY|INVALID|QUERY LENGTH/i.test(s)?s:'')}).catch(function(){clearTimeout(t);cb('')})};
var vmT;function vm(k){clearTimeout(vmT);var ei=G('vfe');if(!ei||(ei.value.trim()&&ei.dataset.a!=='1'))return;vmT=setTimeout(function(){window.__mean(k,function(s){var e2=G('vfe'),k2=G('vfk');if(!s||!e2||!k2||k2.value!==k)return;if(e2.value.trim()&&e2.dataset.a!=='1')return;e2.value=s;e2.dataset.a='1'})},700)}
function romAuto(k){k=k.trim();var m=rmap();return Object.prototype.hasOwnProperty.call(m,k)?m[k]:romOf(k)}
function wform(id){RM=null;if(!V.c.length){V.c.push({id:uid(),n:'General'});sv()}var s=V.s.cat,w=id?W(id):{k:'',r:'',e:'',x:'',c:(s!='all'&&s!='day'?s:V.c[0].id)};
 modal('<h3>'+(id?'Edit word':'Add word')+'</h3><label>Korean</label><input id=vfk class=vin value="'+esc(w.k)+'" lang=ko><label>Romanization <small>(auto, you can edit)</small></label><input id=vfr class=vin value="'+esc(w.r)+'" autocapitalize=off'+(w.r?' data-m=1':'')+'><label>Meaning</label><input id=vfe class=vin value="'+esc(w.e)+'"><label>Category</label>'+sel('x',V.c.map(function(c){return [c.id,c.n]}),w.c,'vfc')+'<label>Example (optional)</label><input id=vfx class=vin value="'+esc(w.x)+'"><div class=vrow><button class=vbtn2 data-a=wcancel>Cancel</button><button class=vbtn data-a=ws data-id="'+(id||'')+'">Save</button></div>')}
function cats(){modal('<h3>Categories</h3><div class=vls>'+V.c.map(function(c){return '<div class=vrw><input class=vin data-s=cn data-id='+c.id+' value="'+esc(c.n)+'"><small>'+cnt(c.id)+'</small><button class=vib data-a=cd data-id='+c.id+' aria-label=Delete>'+ic('trash')+'</button></div>'}).join('')+'</div><div class=vtp><input id=vnc class=vin placeholder="New category"><button class=vbtn data-a=cadd>Add</button></div><div class=vrow><button class=vbtn data-a=mc>Done</button></div>')}
function two(b,fn){var t=b.querySelector('.vlt')||b;if(!b.dataset.c){b.dataset.c=1;b.dataset.o=t.textContent;t.textContent='Tap again to confirm';setTimeout(function(){if(b.isConnected&&b.dataset.o){t.textContent=b.dataset.o;delete b.dataset.c}},3000)}else fn()}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-a]');if(!b||!(b.closest('#vm')||(on8()&&b.closest('#list'))))return;var a=b.dataset.a,id=b.dataset.id,w=cur(),s=V.s;
 if(a=='tog'){S.open=!S.open;rr()}
 else if(a=='gt'){goTab(+b.dataset.t)}
 else if(a=='mode'){s.mode=b.dataset.v;sv();S.q=[];clr();rr()}
 else if(a=='cats')cats();else if(a=='add'){S.back='';wform('')}else if(a=='add2'){S.back='w';wform('')}else if(a=='words')words();
 else if(a=='we'){S.back='w';wform(id)}
 else if(a=='wcancel'){S.back=='w'?words():mclose()}
 else if(a=='mc')mclose();
 else if(a=='shuf'||a=='again'){S.open=false;start();rr()}
 else if(a=='miss'){s.miss=1;sv();S.open=false;start();rr()}
 else if(a=='reset')two(b,function(){V.w.forEach(function(x){x.ok=x.no=x.st=x.m=0});V.g={n:0,d:'',st:0,l:''};V.best={};sv();S.q=[];rr();toastM('Progress reset.')});
 else if(a=='star'&&w){w.f=w.f?0:1;sv();rc()}
 else if(a=='say'&&w)say(w.k);
 else if(a=='pick'&&w){var i=+b.dataset.i;answer(S.o[i]==((s.mode=='spell'?false:(s.dir=='ke'||s.mode=='listen'))?w.e:w.k),i)}
 else if(a=='check')check();
 else if(a=='flip'){S.fl=1;rc()}else if(a=='sc'){clr();S.fl=1;rc()}
 else if(a=='yes')answer(true,0);else if(a=='no'||a=='skip')answer(false,a=='skip'?-1:0);
 else if(a=='mic')mic();
 else if(a=='mp'&&S.mt)mpick(b.dataset.sd,id);
 else if(a=='mnext'){S.i+=5;prep();rc()}
 else if(a=='next')next();
 else if(a=='ws'){var k=G('vfk').value.trim(),e2=G('vfe').value.trim();if(!k||!e2){toastM('Korean and meaning are required.');return}
  var o=id?W(id):null;if(!o){o={id:uid(),f:0,ok:0,no:0,st:0,m:0};V.w.push(o)}o.k=k;o.r=G('vfr').value.trim();o.e=e2;o.x=G('vfx').value.trim();o.c=G('vfc').value;V.dl.d='';sv();S.dirty=!id;toastM('Saved.');S.back=='w'?words():mclose()}
 else if(a=='wd')two(b,function(){V.w=V.w.filter(function(x){return x.id!=id});S.dirty=1;sv();G('vl').innerHTML=wlist()})
 else if(a=='cadd'){var n=G('vnc').value.trim();if(!n)return;V.c.push({id:uid(),n:n});sv();cats()}
 else if(a=='cd')two(b,function(){var u=V.c.find(function(c){return c.n=='Uncategorized'&&c.id!=id});if(cnt(id)&&!u){u={id:uid(),n:'Uncategorized'};V.c.push(u)}
  V.w.forEach(function(x){if(x.c==id)x.c=u.id});V.c=V.c.filter(function(c){return c.id!=id});if(s.cat==id)s.cat='all';S.dirty=1;sv();cats()})});
document.addEventListener('change',function(e){var t=e.target,k=t.dataset&&t.dataset.s;if(!k)return;
 if(k=='cn'){var c=V.c.find(function(x){return x.id==t.dataset.id});if(c&&t.value.trim()){c.n=t.value.trim();sv()}return}
 if(k=='wc'){S.wc=t.value;G('vl').innerHTML=wlist();return}
 if(!on8()||k=='x')return;V.s[k]=t.type=='checkbox'?(t.checked?1:0):t.value;sv();
 if(k=='lim')V.s.lim=+t.value||20;if(k=='play'||k=='next'||k=='lim'){sv();rc();return}
 S.q=[];clr();rc();var m=G('vsum');if(m)m.textContent=summ()});
document.addEventListener('input',function(e){if(e.target.id=='vwq'){S.wq=e.target.value;G('vl').innerHTML=wlist()}else if(e.target.id=='vfk'){var r=G('vfr');if(r&&!r.dataset.m)r.value=romAuto(e.target.value);vm(e.target.value)}else if(e.target.id=='vfr')e.target.dataset.m=e.target.value.trim()?'1':'';else if(e.target.id=='vfe')e.target.dataset.a=''});
document.addEventListener('keydown',function(e){if(e.key=='Escape'&&G('vm'))mclose();else if(e.key=='Enter'&&!e.isComposing){if(e.target.id=='vti')check();else if(e.target.id=='vnc')G('vm').querySelector('[data-a=cadd]').click()}});
})();

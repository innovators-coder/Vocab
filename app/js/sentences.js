// ---------- SENTENCES (Sentences tab logic) ----------
(function(){
var DBG=false,UNL=0;
var SK='eps-sent-v1',LV={b:'Beginner',h:'Hard',e:'Extreme'},LN=['b','h','e'],MN={s:'Reading',l:'Listening'};
var SQ={m:'s',l:'b'},SP={},S=null,TI=null,CF={vs:1,tm:1,rp:2,bn:1,bs:0,ts:0,rt:0},AU={tok:0,act:0,ok:0,nt:0,warn:0},AC=null,PL={b:{vs:1,bs:0,ts:0,rt:0},h:{vs:1,bs:0,ts:0,rt:0},e:{vs:1,bs:0,ts:0,rt:0}};var RC=0,RCT=null,RTS=[0,60,120,180,300,420,600];function cfGet(l){var p=PL[l];CF.vs=p.vs;CF.bs=p.bs;CF.ts=p.ts;CF.rt=p.rt}function fmtT(n){var m=Math.floor(n/60),r=n%60;return m+':'+(r<10?'0':'')+r}function rtot(l,n){return CF.rt>0?CF.rt:({b:60,h:30,e:20})[l]*(n||10)}
try{var o0=JSON.parse(localStorage.getItem(SK)||'{}')||{};if(o0.sp&&typeof o0.sp=='object')SP=o0.sp;if(o0.m=='s'||o0.m=='l')SQ.m=o0.m;if(LN.indexOf(o0.l)>=0)SQ.l=o0.l;var c0=o0.c;if(c0&&typeof c0=='object'){if(c0.vs>=0&&c0.vs<=2)CF.vs=c0.vs|0;if(c0.tm>=0&&c0.tm<=2)CF.tm=c0.tm|0;if(c0.bn===0||c0.bn===1)CF.bn=1;if(c0.bs>=0&&c0.bs<=4)CF.bs=c0.bs|0;if([0,10,15,20,30,45,60].indexOf(c0.ts)>=0)CF.ts=c0.ts}var p0=o0.pl;LN.forEach(function(l){var q=p0&&p0[l];if(q&&typeof q=='object'){if(q.vs>=0&&q.vs<=2)PL[l].vs=q.vs|0;if(q.bs>=0&&q.bs<=4)PL[l].bs=q.bs|0;if([0,10,15,20,30,45,60].indexOf(q.ts)>=0)PL[l].ts=q.ts;if(RTS.indexOf(q.rt)>=0)PL[l].rt=q.rt}else PL[l]={vs:CF.vs,bs:CF.bs,ts:CF.ts,rt:0}});cfGet(SQ.l)}catch(e){}
function sv(){PL[SQ.l]={vs:CF.vs,bs:CF.bs,ts:CF.ts,rt:CF.rt};try{localStorage.setItem(SK,JSON.stringify({sp:SP,m:SQ.m,l:SQ.l,c:CF,pl:PL}))}catch(e){}}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function nz(s){return String(s||'').normalize('NFC').replace(/[\s.,!?'"“”‘’。]/g,'')}
function sh(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function hb(c){var n=c.charCodeAt(0)-0xAC00;return n>=0&&n<11172&&n%28!==0}
function ky(m,l,g){return m+l+SG[g].id}
function best(m,l,g){return SP[ky(m,l,g)]||0}
function pas(m,l,g){return best(m,l,g)>=80}
function lessonsMiss(g){if(UNL)return '';var r=SG[g].req;for(var i=0;i<r.length;i++){if(typeof grpOpen!='function'||!grpOpen(r[i]))return r[i]}return ''}
function lockWhy(m,l,g){if(DBG||UNL)return '';var x=lessonsMiss(g);if(x)return 'Pass lesson '+x+' (80%) first to open this group.';
 if(l=='h'&&!pas(m,'b',g))return 'Pass Beginner ('+MN[m]+') in this group first.';
 if(l=='e'&&!pas(m,'h',g))return 'Pass Hard ('+MN[m]+') in this group first.';return ''}
function SN(q){return SG[S.g].S[q.si]}
function lref(id){var t='';try{var x=L.filter(function(z){return z.id==id})[0]||LW.filter(function(z){return z.id==id})[0];if(x)t=' · '+x.t}catch(e){}return 'Lesson '+id+esc(t)}
function tgs(s){return s.f?'formal':'polite'}

// ----- accepted answers -----
function bvars(b,vr){var v=[b[0]];if(vr&&b[1]=='s'){var m=b[0].match(/^(.*)(이|가|은|는)$/);if(m){var st=m[1],c=st.charAt(st.length-1);
 if(st=='누'){}else if(st=='저'){v.push('제가')}else{var h=hb(c);v.push(st+(h?'이':'가'),st+(h?'은':'는'))}}}return v}
function accSet(s,vr){var key=vr?'_a1':'_a0';if(s[key])return s[key];var set={},vb=s.b[s.b.length-1][0],ot=s.b.slice(0,-1);
 function go(rest,acc){if(!rest.length){set[nz(acc.join('')+vb)]=1;return}
  rest.forEach(function(b,i){var r2=rest.slice(0,i).concat(rest.slice(i+1));bvars(b,vr).forEach(function(t){go(r2,acc.concat([t]))})})}
 go(ot,[]);if(vr&&s.a)s.a.forEach(function(x){set[nz(x)]=1});s[key]=set;return set}
function ordOk(s,txt){return SG[S.g].strict?nz(txt)==nz(s.k):!!accSet(s,false)[nz(txt)]}

// ----- similar-meaning check (no two right answers) -----
var STP={a:1,an:1,the:1,is:1,are:1,am:1,i:1,to:1,of:1,in:1,at:1,on:1,it:1,you:1,do:1,does:1,will:1,be:1,formal:1,polite:1,subject:1};
function etok(e){var o={},n=0;String(e).toLowerCase().replace(/\((formal|polite|subject)\)/g,' ').replace(/[^a-z0-9' ]/g,' ').split(/\s+/).forEach(function(w){if(w&&!STP[w]){o[w]=1;n++}});return o}
function simE(a,b){var x=etok(a),y=etok(b),kx=Object.keys(x),kz=Object.keys(y);if(!kx.length||!kz.length)return String(a).toLowerCase()==String(b).toLowerCase();var c=0;kx.forEach(function(w){if(y[w])c++});return c/(kx.length+kz.length-c)>=.5||c==kx.length||c==kz.length}
// ----- listening audio: bell, question number, sentence x N, then timer -----
var NUMW=['','일','이','삼','사','오','육','칠','팔','구','십'];
function kv(){try{var v=speechSynthesis.getVoices().filter(function(x){return /^ko/i.test(x.lang)});return v[0]||null}catch(e){return null}}
function rate(){return [.65,.85,1.05][CF.vs]}
function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
function ctx(){try{if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(C)AC=new C()}if(AC&&AC.state=='suspended')AC.resume()}catch(e){}return AC}
var BS=[[[880,0,.7,'sine'],[659,.5,1,'sine']],[[523,0,.6,'triangle'],[659,.22,.6,'triangle'],[784,.44,.9,'triangle']],[[1319,0,.9,'sine']],[[523,0,.55,'sine'],[392,.5,1,'sine']],[[1000,0,.18,'square'],[1000,.3,.18,'square'],[1000,.6,.18,'square']]];
function bell(){return new Promise(function(done){var c=ctx();if(c){try{var t=c.currentTime;(BS[CF.bs]||BS[0]).forEach(function(n){var o=c.createOscillator(),g=c.createGain(),v=n[3]=='square'?.12:.35;o.type=n[3];o.frequency.value=n[0];g.gain.setValueAtTime(.0001,t+n[1]);g.gain.exponentialRampToValueAtTime(v,t+n[1]+.02);g.gain.exponentialRampToValueAtTime(.0001,t+n[1]+n[2]);o.connect(g);g.connect(c.destination);o.start(t+n[1]);o.stop(t+n[1]+n[2]+.05)})}catch(e){}}setTimeout(done,1500)})}
function say(t,r){return new Promise(function(res){if(!window.speechSynthesis){res('nosp');return}
 var u=new SpeechSynthesisUtterance(t),d=0,a,b;function fin(x){if(d)return;d=1;clearTimeout(a);clearTimeout(b);res(x)}
 u.lang='ko-KR';u.rate=r;var v=kv();if(v)u.voice=v;
 u.onstart=function(){AU.ok=1;clearTimeout(b)};u.onend=function(){fin('ok')};u.onerror=function(e){fin(e&&(e.error=='canceled'||e.error=='interrupted')?'stop':'err')};
 a=setTimeout(function(){fin('ok')},2500+t.length*450/r);
 b=setTimeout(function(){if(!AU.ok){try{speechSynthesis.cancel()}catch(x){}fin('blocked')}},3500);
 try{speechSynthesis.speak(u)}catch(x){fin('err')}})}
function ltim(){return tlim()}
function secs(){return Math.max(0,Math.ceil((ltim()-S.el)/1000))}
var SI={vol:'<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',timer:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',play:'<path d="M7 4.5v15l12-7.5z"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',lock:'<rect x="4.5" y="10.5" width="15" height="10.5" rx="3.2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',unlock:'<rect x="4.5" y="10.5" width="15" height="10.5" rx="3.2"/><path d="M8 10.5V8a4 4 0 0 1 7.6-1.7"/>',heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',replay:'<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>'};
function si(n,z,f){return '<svg viewBox="0 0 24 24" width="'+z+'" height="'+z+'" fill="'+(f?'currentColor':'none')+'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-3px">'+SI[n]+'</svg>'}
var RPI=si('replay',22);
function auHTML(){var st=S.au,b='';if(S.ans&&st!='play')st='done';
 var tx=st=='play'?si('vol',16)+' '+(S.pt||'Listen…'):st=='wait'?si('timer',16)+' '+secs()+' s left':st=='blocked'?'Tap to play the audio':st=='nosp'?'No voice on this browser. Use Chrome or Edge.':'Answered';
 if(!S.ans){if(st=='blocked')b='<button type="button" class="sgbtn p sgab" data-sa="play">'+si('play',16)+' Play</button>';
  else if(S.l=='b'){var d=st=='play'?' disabled':'';b='<button type="button" class="sgbtn sgab" data-sa="rp" aria-label="Replay"'+d+'>'+RPI+'</button>'}
  else if(S.l=='h')b='<button type="button" class="sgbtn sgab" data-sa="rp"'+(st=='play'||S.rp<=0?' disabled':'')+' aria-label="Replay, '+S.rp+' left">'+RPI+'<b style="margin-left:6px">'+S.rp+'</b></button>'}
 return '<span id="sgaus">'+tx+'</span>'+(b?'<span class="sgabs">'+b+'</span>':'')}
function paintAu(){if(!S)return;var e=$('sgau');if(e)e.innerHTML=auHTML()}
function lab(t){if(!S)return;S.pt=t;var e=$('sgaus');if(e)e.innerHTML=si('vol',16)+' '+t}
function stopAudio(){AU.tok++;AU.act=0;clearTimeout(AU.nt);try{if(window.speechSynthesis)speechSynthesis.cancel()}catch(e){}}
function runSeq(mode){var q=S.qs[S.i],s=SN(q),tk=++AU.tok,full=mode=='full',reps=full?CF.rp:1,r=mode=='slow'?.55:rate(),n=S.i+1,txt=s.k.replace(/[.,!?~·]/g,' ');
 AU.act=1;if(full)AU.ok=0;try{if(window.speechSynthesis)speechSynthesis.cancel()}catch(e){}
 S.au='play';S.pt='';paintAu();
 var p=wait(full?120:60);
 function st(f){p=p.then(function(){if(tk!==AU.tok)throw 'x';return f()})}
 function ck(x){if(tk!==AU.tok)throw 'x';if(x!='ok')throw x}
 if(full&&CF.bn){st(function(){lab(si('bell',16));return bell()});st(function(){return wait(350)});st(function(){lab('Question '+n);return say((NUMW[n]||n)+' 번',rate()).then(ck)});st(function(){return wait(700)})}
 for(var k=1;k<=reps;k++)(function(k){st(function(){lab(reps>1?'Sentence '+k+' of '+reps:'Sentence');return say(txt,r).then(ck)});if(k<reps)st(function(){return wait(1300)})})(k);
 p.then(function(){if(tk!==AU.tok)return;AU.act=0;S.au=S.ans?'done':'wait';paintAu()}).catch(function(x){if(tk!==AU.tok)return;AU.act=0;S.au=x=='nosp'?'nosp':'blocked';paintAu()})}
function dist(g,s,q,ok){var p=SG[g].S.filter(function(x,i){return i!=q.si&&nz(x.k)!=nz(s.k)&&ok(x)});return sh(p.filter(function(x){return x.lv==s.lv})).concat(sh(p.filter(function(x){return x.lv!=s.lv})))}

// ----- building questions -----
function build(m,l,g){var gr=SG[g],hasLv=gr.S.some(function(s){return s.lv}),li=LN.indexOf(l),own=[],oth=[];
 gr.S.forEach(function(s,si){var many=s.b.length>=3&&gr.ord,pool=[];
  if(gr.pron)pool.push({t:m=='s'?'psel':'lpron',si:si});
  else if(m=='s'){pool.push({t:'fill',si:si});if(l!='e')pool.push({t:'pick',si:si});if(l=='h'&&many)pool.push({t:'order',si:si});if(l=='e'&&s.wr)pool.push({t:'wrong',si:si})}
  else if(l=='h')pool.push({t:many?'lorder':'lkor',si:si});
  else pool.push({t:'lmean',si:si},{t:'lkor',si:si});
  if(!pool.length)return;
  if(hasLv){if(s.lv==l)own.push(pool)}else (si%3==li?own:oth).push(pool)});
 return sh(sh(own).concat(sh(oth)).slice(0,10).map(function(p){return p[Math.floor(Math.random()*p.length)]}))}
function prep(q,g){var s=SG[g].S[q.si],l=S?S.l:SQ.l,n=l=='b'?2:3,f=s.fl;
 if(q.t=='fill'){q.o=sh([{t:f.a,ok:1}].concat(f.d.slice(0,n).map(function(d){return {t:d}})));q.ci=q.o.findIndex(function(x){return x.ok})}
 else if(q.t=='pick'){var ds=sh(SG[g].S.filter(function(x,i){return i!=q.si&&nz(x.k)!=nz(s.k)&&!simE(x.e,s.e)})).slice(0,n);q.o=sh([{t:s.k,r:s.r,ok:1}].concat(ds.map(function(d){return {t:d.k,r:d.r}})));q.ci=q.o.findIndex(function(x){return x.ok})}
 else if(q.t=='order'||q.t=='lorder'){var idx=s.b.map(function(b,i){return i}),tries=0,sc;do{sc=sh(idx);tries++}while(tries<30&&sc.every(function(v,i){return v==i}));q.sc=sc}
 else if(q.t=='psel'){q.o=sh([{t:s.p,ok:1}].concat(s.pd.slice(0,n).map(function(d){return {t:d}})));q.ci=q.o.findIndex(function(x){return x.ok})}
 else if(q.t=='wrong'){q.ci=s.wr.i}
 else if(q.t=='lmean'){q.o=sh([{t:s.e,ok:1}].concat(dist(g,s,q,function(x){return !simE(x.e,s.e)}).slice(0,n).map(function(d){return {t:d.e}})));q.ci=q.o.findIndex(function(x){return x.ok})}
 else if(q.t=='lpron'){q.o=sh([{t:s.e,ok:1}].concat(dist(g,s,q,function(x){return x.p!=s.p&&!simE(x.e,s.e)}).slice(0,n).map(function(d){return {t:d.e}})));q.ci=q.o.findIndex(function(x){return x.ok})}
 else if(q.t=='lkor'){q.o=sh([{t:s.k,r:s.r,ok:1}].concat(dist(g,s,q,function(){return true}).slice(0,n).map(function(d){return {t:d.k,r:d.r}})));q.ci=q.o.findIndex(function(x){return x.ok})}
 return q}

// ----- screens -----
function bk(a,v,txt,on){return '<button type="button" data-sa="'+a+'" data-v="'+v+'" aria-pressed="'+(!!on)+'">'+txt+'</button>'}
function doneCount(){var n=0;SG.forEach(function(g,i){LN.forEach(function(l){if(pas(SQ.m,l,i))n++})});return n}
window.sentUnl=function(){return SG.map(function(g,i){return !lessonsMiss(i)})};window.sentNm=function(i){return SG[i].t};window.sentCnt=function(){return doneCount()+' of '+SG.length*3+' levels passed · '+MN[SQ.m]};
window.sentPct=function(){return doneCount()/(SG.length*3)*100};
function lnote(l){var t=tsec(l),pl=CF.rp==1?'1 time':CF.rp+' times';
 if(l=='b')return 'Bell, question number, then the sentence ('+pl+'). Replay button. No romanization. Timer: '+t+' s.';
 if(l=='h')return 'Bell, question number, then the sentence ('+pl+'). 3 replays per practice. No colors or romanization. Timer: '+t+' s.';
 return 'Bell, question number, then the sentence ('+pl+'). No replay. 3 lives. Timer: '+t+' s.'}
function cfgHTML(){function row(t,k,o){return '<div class="sglab">'+t+'</div><div class="sgseg">'+o.map(function(x){return bk('cfg',k+':'+x[0],x[1],CF[k]==x[0])}).join('')+'</div>'}
 return '<button type="button" class="sgbtn" style="width:100%;margin-top:12px" data-sa="cfgreset">Reset to exam settings</button><p class="sgnote">Exam settings: normal speed, default timer, plays 2 times, default bell.</p>'}
function setupHTML(){var m=SQ.m,l=SQ.l,h='<div class="sg">';

 h+='<details class="sghow"><summary>How to use this tab</summary><ol><li><span><b>Mode:</b> Reading = look at the Korean and tap the answer. Listening = like the exam: you hear a bell, the question number, and the sentence. Then you tap the answer before the timer ends.</span></li><li><span><b>Level (Reading):</b> Beginner shows romanization and colors, with unlimited hints. Hard has no colors or romanization and gives 2 hints. Extreme has no hints and 3 lives. Reading has one timer for the whole quiz: Beginner 10:00, Hard 5:00, Extreme 3:20 (for 10 questions). It pauses while you see the answer. If time runs out, the quiz ends and the questions you did not answer count as wrong. You can change it with the Timer button in Settings. In Reading it sets the total time (1 to 10 min). In Listening it sets the seconds per question (up to 60 s).</span></li><li><span><b>Level (Listening):</b> Beginner has a replay icon. Hard has 3 replays. Extreme has no replay and 3 lives. Every level has a timer for each question. You can change the voice speed in Settings.</span></li><li><span><b>Settings:</b> tap <b>Settings</b> to open it. Tap an icon to change it: <b>Timer</b> (Auto, or 10 to 60 s), <b>Voice speed</b> (Slow, Normal, Fast), and <b>Bell sound</b> (5 sounds). Voice speed and Bell sound show only in Listening. Each level keeps its own settings, so Beginner, Hard, and Extreme can be different. Tap <b>Reset settings</b> at the bottom to put the settings of all levels back to default. Your scores and unlocked levels do not change.</span></li><li><span><b>Group:</b> Tap a group to start. The stars show which levels you passed: Beginner, Hard, Extreme. A locked group tells you which lesson to pass first.</span></li><li><span>Score <b>80%</b> to pass. Passing opens the next level of that group. Your best score is saved.</span></li><li><span><b>Progress:</b> the top bar shows levels passed in the mode you chose. Each group shows your best score. It saves on this device. Back it up in <b>⚙ Settings</b> with Export.</span></li></ol></details>';
 var inn='<div class="sglab">Mode</div><div class="sgseg">'+bk('mode','s','Reading<small>see Korean, tap the answer</small>',m=='s')+bk('mode','l','Listening<small>hear Korean, tap the answer</small>',m=='l')+'</div>';
 inn+='<div class="sglab">Level</div><div class="sgseg">'+LN.map(function(x){return bk('lvl',x,LV[x],l==x)}).join('')+'</div>';
 inn+='<p class="sgnote">'+(m=='l'?lnote(l):({b:'Romanization and colors are shown. Unlimited hints.',h:'No colors or romanization. 2 hints per practice.',e:'No hints. 3 lives.'}[l])+(m=='l'?' Timer: '+tsec(l)+' s per question.':' One timer for the whole quiz: '+fmtT(rtot(l,10))+'.'))+'</p>';var IC={t:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',v:'<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',b:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>'};
 function bx(act,ic,lab,val){return '<div class="cfi"><button type="button" data-sa="'+act+'" aria-label="'+lab+'"><span class="ci"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[ic]+'</svg></span><b>'+val+'</b></button><small>'+lab+'</small></div>'}
 inn+='<div class="sgcf" style="grid-template-columns:repeat('+(m=='l'?3:1)+',minmax(0,1fr))">'+(m=='l'?bx('tscy','t','Timer per question',CF.ts?CF.ts+' s':'Auto'):bx('tscy','t','Total quiz timer',CF.rt?CF.rt/60+' min':'Auto'))+(m=='l'?bx('vscy','v','Voice speed',['Slow','Normal','Fast'][CF.vs])+bx('bellcy','b','Bell sound',['Default','Chime','Ding','Ding-dong','Beep'][CF.bs]):'')+'</div><button type="button" class="sgbtn'+(RC?' p':'')+'" style="width:100%;margin-top:12px" data-sa="cfgrl">'+(RC?'Tap to confirm':'Reset settings')+'</button>';
 var sm=MN[m]+' · '+LV[l]+(m=='l'?' · '+['Slow','Normal','Fast'][CF.vs]+' speed':'');
 h+='<div class="vp" style="margin-top:14px"><button class="vsh" type="button" data-sa="sopen" aria-expanded="'+(!!SQ.open)+'"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg><span class="vsl"><b>Settings</b><small>'+sm+'</small></span><span class="vc'+(SQ.open?' up':'')+'"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></span></button>'+(SQ.open?inn:'')+'</div>';
 h+='<div class="sglab">Choose a group</div>';
 SG.forEach(function(g,i){var w=lockWhy(m,l,i),st=LN.slice(0,LN.indexOf(l)+1).map(function(x){var on=pas(m,x,i);return '<i class="'+(on?'on':'')+'" title="'+LV[x]+(on?' passed':' not passed')+'"><svg viewBox="0 0 24 24" width="14" height="14" fill="'+(on?'currentColor':'none')+'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IP['🎉']+'</svg></i>'}).join(''),b=best(m,l,i);
  h+='<button type="button" class="sgc'+(w?' lk':'')+'" data-sa="start" data-v="'+i+'"><span><b>'+(w?LKB(22):'')+esc(g.t)+(!w&&window.nwHas&&window.nwHas('sg'+i)?' <i class="nwb">NEW</i>':'')+'</b><small>'+esc(g.sub)+'</small><small>'+g.S.length+(g.pron?' words':' sentences')+(b?' · best '+b+'%':'')+'</small>'+(w?'<small class="sgwy">'+LKI(13)+' '+esc(w)+'</small>':'')+'</span><span class="st" aria-label="Stars for Beginner, Hard, Extreme">'+st+'</span></button>'});
 return h+'</div>'}
function blks(s){return '<div class="vz">'+s.b.map(function(b){return '<div class="bx b'+b[1]+'">'+esc(b[0])+'<small>'+({s:'S',t:'T',p:'P',o:'O',v:'V',c:'C'})[b[1]]+' · '+esc(b[2])+'</small></div>'}).join('')+'</div>'}
function blankK(s){return s.b.map(function(b,i){return i==s.fl.i?s.fl.h:b[0]}).join(' ')}
function hearts(){var h='';for(var i=0;i<3;i++)h+=si('heart',18,i<S.lv);return h}
function chip(a,v,s,i,col){var b=s.b[i];return '<button type="button" class="sgb'+(col?' b'+b[1]:'')+'" data-sa="'+a+'" data-v="'+v+'">'+esc(b[0])+(col?'<small>'+esc(b[2])+'</small>':'')+'</button>'}
function qnote(){var L=S.l,x=S.m=='l'?'Listen to the sentence, tap your answer, then tap <b>Check</b>. For word order, tap the words in the order you hear them. Answer before the timer ends. '+({b:'Tap the <b>replay icon</b> to hear it again.',h:'You have 3 replays. No colors or romanization.',e:'No replay. You have 3 lives: a wrong answer or time out costs 1 life.'})[L]:'Read the Korean, tap your answer, then tap <b>Check</b>. For word order, tap the words in order. One timer runs for the whole quiz and it pauses while you see the answer. '+({b:'Tap <b>Hint</b> to show romanization and remove one wrong choice. Hints are unlimited.',h:'You have 2 hints. A hint shows romanization and removes one wrong choice. No colors.',e:'No hints. You have 3 lives: a wrong answer or time out costs 1 life.'})[L];return '<p class="sgnote">'+x+'</p>'}
function quizHTML(){var q=S.qs[S.i],s=SN(q),L=S.l,B=L=='b',a=S.ans,h='<div class="sg" data-noswipe><h2 class="sgh">Sentences</h2><p class="sgnote sgsub">'+esc(SG[S.g].t)+' · '+LV[S.l]+' · '+MN[S.m]+'</p>';
 h+='<div class="sgtop"><span>'+(S.i+1)+' / '+S.qs.length+'</span><div class="sgbar"><i style="width:'+(S.i/S.qs.length*100)+'%"></i></div>'+(L=='e'?'<span class="sgl" aria-label="Lives">'+hearts()+'</span>':'')+(S.m=='s'?'<span id="sgtt" class="sgl" aria-label="Time left">'+si('timer',14)+' '+fmtT(Math.max(0,Math.ceil((S.tt-S.te)/1000)))+'</span>':'')+'<button type="button" class="sgx" data-sa="quit" aria-label="Quit practice">'+si('x',18)+'</button></div>';
 if(S.m=='l')h+='<div class="sgtm"><i id="sgtm" style="width:'+Math.max(0,100-S.el/(ltim()/100))+'%"></i></div>';else h+='<div class="sgtm"><i id="sgtm" style="width:'+Math.max(0,100-S.te/(S.tt/100))+'%"></i></div>';
 h+=qnote()+'<div class="sgq">';if(S.m=='l')h+='<div class="sgau" id="sgau">'+auHTML()+'</div>';var en='<p class="sgen">'+esc(s.e)+'</p>',rom=(B||S.hs)?'<p class="sgr">'+esc(s.r)+'</p>':'';
 function opts(list,txt){return list.map(function(o,i){var c='sgo';if(a){if(i==q.ci)c+=' ok';else if(i==S.sel)c+=' bad'}else if(i==S.sel)c+=' on';var d=a||S.rm.indexOf(i)>=0;
  return '<button type="button" class="'+c+'" data-sa="opt" data-v="'+i+'"'+(d?' disabled':'')+'>'+esc(o.t)+(txt&&o.r&&(B||S.hs)?'<small>'+esc(o.r)+'</small>':'')+'</button>'}).join('')}
 if(q.t=='lmean'){h+='<p class="sgp">Listen. What does it mean?</p>'+opts(q.o,0)}
 else if(q.t=='lpron'){h+='<p class="sgp">Listen. What word is this?</p>'+opts(q.o,0)}
 else if(q.t=='lkor'){h+='<p class="sgp">Listen. Which sentence do you hear?</p>'+opts(q.o,1)}
 else if(q.t=='lorder'){var lf=q.sc.filter(function(i){return S.arr.indexOf(i)<0});h+='<p class="sgp">Listen. Tap the words in the order you hear them.</p><div class="sgrow" aria-label="Your answer">'+(S.arr.length?S.arr.map(function(i,k){return a?'<span class="sgb">'+esc(s.b[i][0])+'</span>':chip('unblk',k,s,i,false)}).join(''):'<span class="sgph">Tap the words below</span>')+'</div>'+(a?'':'<div class="sgpool">'+lf.map(function(i){return chip('blk',i,s,i,false)}).join('')+'</div>')}
 else if(q.t=='psel'){h+='<p class="sgp">How does it sound?</p>'+en+'<div class="sgko">'+esc(s.k)+'</div>'+(S.hs?'<p class="sgr">'+esc(s.r)+'</p>':'')+opts(q.o,0)}
  else if(q.t=='fill'){h+='<p class="sgp">Fill in the blank</p>'+en+'<div class="sgko">'+esc(blankK(s))+'</div>'+rom+opts(q.o,0)}
 else if(q.t=='pick'){h+='<p class="sgp">Which sentence means this?</p>'+en+opts(q.o,1)}
 else if(q.t=='order'){var n=s.b.length,left=q.sc.filter(function(i){return S.arr.indexOf(i)<0});
  h+='<p class="sgp">Put the words in order. '+(SG[S.g].strict?'Pattern: S → T → P → O → V.':'The verb goes last.')+'</p>'+en+rom+'<div class="sgrow" aria-label="Your answer">'+(S.arr.length?S.arr.map(function(i,k){return a?'<span class="sgb'+(B?' b'+s.b[i][1]:'')+'">'+esc(s.b[i][0])+'</span>':chip('unblk',k,s,i,B)}).join(''):'<span class="sgph">Tap the words below</span>')+'</div>'+
  (a?'':'<div class="sgpool">'+left.map(function(i){return chip('blk',i,s,i,B)}).join('')+'</div>')}
 else if(q.t=='wrong'){h+='<p class="sgp">Tap the part that is wrong</p>'+en+'<div class="sgpool">'+s.b.map(function(b,i){var t=i==s.wr.i?s.wr.x:b[0],c='sgb';if(a){if(i==q.ci)c+=' okc';else if(i==S.sel)c+=' badc'}else if(i==S.sel)c+=' onc';return '<button type="button" class="'+c+'" data-sa="opt" data-v="'+i+'"'+(a?' disabled':'')+'>'+esc(t)+'</button>'}).join('')+'</div>'+rom}
 if(DBG&&!a){var an=q.t=='psel'?s.p:q.t=='fill'?s.fl.a:q.t=='wrong'?s.b[s.wr.i][0]:(q.t=='lmean'||q.t=='lpron')?s.e:s.k;h+='<p class="sgfx" style="border:1px dashed #c33;border-radius:8px;padding:6px 8px">TEST · Answer: <b>'+esc(an)+'</b></p>'}
 h+='</div>';
 if(a){h+=fbHTML(q,s)+'<div class="sgact"><button type="button" class="sgbtn p" data-sa="next">'+((S.i+1>=S.qs.length||(S.l=='e'&&S.lv<=0))?'See result':'Next')+'</button></div>'}
 else{var need=(q.t=='order'||q.t=='lorder')?S.arr.length<s.b.length:(q.t=='fill'||q.t=='pick'||q.t=='wrong'||q.t=='psel'||q.t=='lmean'||q.t=='lkor'||q.t=='lpron')?S.sel<0:false;
  h+='<div class="sgact">'+(L!='e'&&S.m=='s'?'<button type="button" class="sgbtn" data-sa="hint"'+(S.hl<=0?' disabled':'')+'>Hint'+(L=='h'?' ('+S.hl+' left)':'')+'</button>':'')+'<button type="button" class="sgbtn p" data-sa="check"'+(need?' disabled':'')+'>Check</button></div>'}
 return h+'</div>'}
function fbx(q){var h='';if(S.m=='l'){if(S.ans&&S.ans.to)h+='<p class="sgfx">The next question starts in a few seconds. Tap Next to go now.</p>';h+='<div class="sgact"><button type="button" class="sgbtn" data-sa="hear">'+si('vol',16)+' Hear it again</button></div>'}return h}
function fbHTML(q,s){var a=S.ans,h='<div class="sgfb '+(a.ok?'ok':'no')+'" role="status"><b>'+(a.ok?si('check',16)+' Correct!':a.to?si('timer',16)+' Time’s up':si('x',16)+' Not quite')+'</b>';
 if(q.t=='psel'||q.t=='lpron'){if(!a.ok&&a.ut&&typeof a.ut=='string')h+='<p class="sgfx">You wrote: '+esc(a.ut)+'</p>';return h+'<div class="sgko">'+esc(s.k)+' → '+esc(s.p)+'</div><p class="sgr">'+esc(s.r)+'</p><p class="sgfx">'+esc(s.e)+'</p><p class="sgfx"><b>Why:</b> '+esc(s.w)+'</p><p class="sgfx sgref">'+lref(s.l)+'</p>'+fbx(q)+'</div>'}
  if(q.t=='wrong')h+='<p class="sgfx">Wrong part: <s>'+esc(s.wr.x)+'</s> → <b>'+esc(s.b[s.wr.i][0])+'</b></p>';
 if(!a.ok&&a.ut&&typeof a.ut=='string')h+='<p class="sgfx">You wrote: '+esc(a.ut)+'</p>';
 h+='<div class="sgko">'+esc(s.k)+'</div>'+blks(s)+'<p class="sgr">'+esc(s.r)+'</p><p class="sgfx">'+esc(s.e)+'</p>';
 var w=q.t=='wrong'?s.wr.w:s.fl.w;if(q.t[0]!='l')h+='<p class="sgfx"><b>Why:</b> '+esc(w)+'</p>';
 if(q.t=='fill'&&s.fl.fa)h+='<p class="sgfx">Also correct: '+esc(s.fl.fa.join(', '))+'</p>';
 return h+'<p class="sgfx sgref">'+lref(s.l)+'</p>'+fbx(q)+'</div>'}
function resHTML(){var pc=S.pct,h='<div class="sg"><div class="sgres"><div class="sgbig">'+pc+'%</div><p><b>'+(S.pass?'Passed! '+si('star',18,1):(S.tup?'Time’s up':S.over?'Game over':'Not yet'))+'</b></p><p class="sgnote">'+S.ok+' of '+S.qs.length+' correct · pass mark 80% · '+esc(SG[S.g].t)+' · '+LV[S.l]+' · '+MN[S.m]+'</p>';
 if(S.rt)h+='<p class="sgnote">Retry practice is not saved.</p>';
 else if(S.pass&&S.l=='b')h+='<p class="sgnote">Hard is now open for this group.</p>';
 else if(S.pass&&S.l=='h')h+='<p class="sgnote">Extreme is now open for this group.</p>';
 else if(S.pass)h+='<p class="sgnote">All levels done for this group. '+si('star',16,1)+'</p>';
 else if(S.tup)h+='<p class="sgnote">Time ran out. Questions you did not answer count as wrong.</p>';
 else if(S.over)h+='<p class="sgnote">You used all 3 lives.</p>';
 h+='</div><div class="sgact sgcol">';
 if(S.pass&&S.l!='e'&&!S.rt)h+='<button type="button" class="sgbtn p" data-sa="nextlvl">Next level: '+LV[S.l=='b'?'h':'e']+'</button>';
 h+='<button type="button" class="sgbtn'+(S.pass&&S.l!='e'&&!S.rt?'':' p')+'" data-sa="again">Try again</button>';
 if(S.wr.length)h+='<button type="button" class="sgbtn" data-sa="retry">Retry the '+S.wr.length+' wrong</button>';
 h+='<button type="button" class="sgbtn" data-sa="home">Back to groups</button></div>';
 if(S.wr.length){h+='<div class="sglab">Review</div>';S.wr.forEach(function(q){var s=SG[S.g].S[q.si];h+='<div class="sgrv"><div class="sgko">'+esc(s.k)+(s.p?' → '+esc(s.p):'')+'</div><p class="sgr">'+esc(s.r)+'</p><p class="sgfx">'+esc(s.e)+'</p></div>'})}
 return h+'</div>'}
window.sentQuiz=function(){return !!(S&&S.scr=='quiz')};window.sentList=function(){return S?(S.scr=='quiz'?quizHTML():resHTML()):setupHTML()};

// ----- flow -----
function sdraw(top){var y=window.pageYOffset||0;render();window.scrollTo(0,top?0:y);}
function stopT(){if(TI){clearInterval(TI);TI=null}}
function tsec(l){return CF.ts>0?CF.ts:({b:60,h:30,e:20})[l]}
function tlim(){return tsec(S?S.l:SQ.l)*1000}
function tick(){if(!S||S.scr!='quiz'||S.ans||tab!=6||document.hidden)return;
 if(S.m=='l'){if(S.au!='wait')return;S.el+=250;var lm=ltim(),t=$('sgtm');if(t)t.style.width=Math.max(0,100-S.el/(lm/100))+'%';var sc=secs(),e=$('sgaus');if(e&&sc!=S.sc){S.sc=sc;e.innerHTML=si('timer',16)+' '+sc+' s left'}if(S.el>=lm)grade(true);return}
 S.te+=250;var t=$('sgtm');if(t)t.style.width=Math.max(0,100-S.te/(S.tt/100))+'%';var sc=Math.max(0,Math.ceil((S.tt-S.te)/1000)),e=$('sgtt');if(e&&sc!=S.sc){S.sc=sc;e.innerHTML=si('timer',14)+' '+fmtT(sc)}if(S.te>=S.tt){stopT();for(var i=S.ans?S.i+1:S.i;i<S.qs.length;i++)S.wr.push(S.qs[i]);S.tup=1;finish()}}
function begin(g,raw,rt){stopT();stopAudio();var qs=(raw||build(SQ.m,SQ.l,g)).map(function(r){return {t:r.t,si:r.si}});
 S={scr:'quiz',m:SQ.m,l:SQ.l,g:g,qs:[],te:0,tt:0,tup:0,i:0,ok:0,hl:SQ.l=='h'?2:SQ.l=='b'?99:0,lv:3,el:0,arr:[],sel:-1,ans:null,hs:false,rm:[],wr:[],rt:!!rt,au:'play',pt:'',rp:3,sc:-1};
 S.qs=qs.map(function(q){return prep(q,g)});S.tt=rtot(S.l,S.qs.length)*1000;TI=setInterval(tick,250);sdraw(1);
 if(S.m=='l'){if(window.speechSynthesis&&speechSynthesis.getVoices().length&&!kv()&&!AU.warn){AU.warn=1;toast('No Korean voice found on this phone. Install a Korean voice in your phone settings.',4500)}runSeq('full')}}
function grade(to){var q=S.qs[S.i],s=SN(q),ok=false,ut='';if(S.m=='l')stopAudio();
 if(q.t=='order'||q.t=='lorder')ut=S.arr.map(function(i){return s.b[i][0]}).join(' ');
 if(!to){if(q.t=='lorder')ok=nz(ut)==nz(s.k);else if(q.t=='order')ok=ordOk(s,ut);else ok=S.sel==q.ci}
 S.ans={ok:ok,to:!!to,ut:ut};S.au='done';if(ok)S.ok++;else{S.wr.push(q);if(S.l=='e')S.lv--}
 if(to&&S.m=='l'){var i0=S.i;AU.nt=setTimeout(function(){if(S&&S.scr=='quiz'&&S.i==i0&&S.ans&&tab==6)nextQ()},4500)}sdraw()}
function finish(){stopT();stopAudio();var pc=Math.round(S.ok/S.qs.length*100),pass=pc>=80,k=ky(S.m,S.l,S.g),first=!(SP[k]>=80);
 S.pct=pc;S.pass=pass;S.over=S.l=='e'&&S.lv<=0;S.scr='result';
 if(!S.rt){if(pc>(SP[k]||0))SP[k]=pc;sv();if(pass&&first){try{logAdd('🗣️','Sentences · '+SG[S.g].t+' · '+LV[S.l]+' passed ('+MN[S.m]+')');var nl=LN[LN.indexOf(S.l)+1];if(nl){logAdd('🔓','Unlocked: Sentences · '+SG[S.g].t+' · '+LV[nl]+' ('+MN[S.m]+')');toast(si('unlock',16)+' Unlocked: <b>'+LV[nl]+'</b> · '+esc(SG[S.g].t),5000)}}catch(e){}}}
 sdraw(1)}
function nextQ(){if(S.i+1>=S.qs.length||(S.l=='e'&&S.lv<=0)){finish();return}
 S.i++;S.arr=[];S.sel=-1;S.ans=null;S.hs=false;S.rm=[];S.el=0;S.sc=-1;S.au='play';S.pt='';clearTimeout(AU.nt);sdraw(1);if(S.m=='l')runSeq('full')}
function hint(){var q=S.qs[S.i];if(S.ans||S.hl<=0)return;S.hl--;S.hs=true;
 if(q.t=='fill'||q.t=='pick'||q.t=='psel'){var live=q.o.map(function(o,i){return i}).filter(function(i){return S.rm.indexOf(i)<0}),wrongs=live.filter(function(i){return i!=q.ci&&i!=S.sel});if(live.length>2&&wrongs.length)S.rm.push(wrongs[Math.floor(Math.random()*wrongs.length)])}
 sdraw()}
function check(){var q=S.qs[S.i];if(S.ans)return;
 grade(false)}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-sa]');if(!b||tab!=6)return;var a=b.dataset.sa,v=b.dataset.v;
 if(a=='mode'){SQ.m=v;sv();sdraw()}
 else if(a=='lvl'){SQ.l=v;cfGet(v);sv();sdraw()}
 else if(a=='start'){var g=+v,w=lockWhy(SQ.m,SQ.l,g);if(w){toast(LKI(15)+' '+esc(w),2800);return}if(!build(SQ.m,SQ.l,g).length){toast('No sentences for this level yet.',2200);return}if(window.nwClr)window.nwClr('sg'+g);begin(g)}

 else if(a=='vscy'){var VS=[1,0,2];CF.vs=VS[(VS.indexOf(CF.vs)+1)%3];sv();sdraw();toast('Voice speed: '+['Slow','Normal','Fast'][CF.vs],1500)}
 else if(a=='tscy'&&SQ.m=='s'){CF.rt=RTS[(RTS.indexOf(CF.rt)+1)%RTS.length];sv();sdraw();toast('Total timer: '+(CF.rt?CF.rt/60+' min':'Auto ('+fmtT(rtot(SQ.l,10))+')'),1500)}
 else if(a=='tscy'){var TS=[0,10,15,20,30,45,60];CF.ts=TS[(TS.indexOf(CF.ts)+1)%TS.length];sv();sdraw();toast('Timer: '+(CF.ts?CF.ts+' s':'Auto ('+tsec(SQ.l)+' s)'),1500)}
 else if(a=='bellcy'){CF.bs=(CF.bs+1)%5;sv();sdraw();toast('Bell sound: '+['Default','Chime','Ding','Ding-dong','Beep'][CF.bs],1500);bell()}
 else if(a=='sopen'){SQ.open=!SQ.open;sdraw()}
 else if(a=='cfg'){var pp=v.split(':');CF[pp[0]]=+pp[1];sv();sdraw()}
 else if(a=='cfgrl'&&!RC){RC=1;clearTimeout(RCT);RCT=setTimeout(function(){RC=0;if(!S&&tab==6)sdraw()},4000);sdraw()}
 else if(a=='cfgrl'){RC=0;clearTimeout(RCT);CF.vs=1;CF.bs=0;CF.ts=0;CF.rt=0;LN.forEach(function(l){PL[l]={vs:1,bs:0,ts:0,rt:0}});sv();sdraw();toast('Settings are back to default.',1800)}
 else if(a=='cfgreset'){CF={vs:1,tm:1,rp:2,bn:1,bs:0,ts:0,rt:0};LN.forEach(function(l){PL[l]={vs:1,bs:0,ts:0,rt:0}});sv();sdraw()}
  else if(!S)return;
 else if(a=='opt'){if(!S.ans){S.sel=+v;sdraw()}}
 else if(a=='blk'){if(!S.ans){S.arr.push(+v);sdraw()}}
 else if(a=='unblk'){if(!S.ans){S.arr.splice(+v,1);sdraw()}}
 else if(a=='hint')hint()
 else if(a=='check')check()
 else if(a=='next')nextQ()
 else if(a=='play'){if(!S.ans)runSeq('full')}
 else if(a=='rp'){if(S.ans||S.au=='play'||S.m!='l')return;if(S.l=='h'){if(S.rp<=0)return;S.rp--}runSeq('one')}
 else if(a=='slow'){if(!S.ans&&S.au!='play'&&S.m=='l')runSeq('slow')}
 else if(a=='hear'){if(S.m=='l')runSeq('one')}
 else if(a=='quit'){epsAsk({t:'Stop this practice?',m:'Your score will not be saved.',b:[{l:'Keep going',k:'pri'},{l:'Stop practice',k:'dng',f:function(){stopT();stopAudio();S=null;sdraw(1)}}]})}
 else if(a=='again'){begin(S.g)}
 else if(a=='retry'){begin(S.g,S.wr,1)}
 else if(a=='nextlvl'){SQ.l=S.l=='b'?'h':'e';sv();begin(S.g)}
 else if(a=='home'){stopT();stopAudio();S=null;sdraw(1)}});
$('t6').onclick=function(){goTab(6)};
window.sentStop=function(){if(AU.act&&S&&S.m=='l'){stopAudio();if(!S.ans)S.au='blocked'}};document.addEventListener('visibilitychange',function(){if(document.hidden)window.sentStop()});
window.__sg={SG:SG,build:build,prep:prep,accSet:accSet,SQ:SQ,SP:SP,get S(){return S}};
})();
// ---------- INTRO (Intro tab) ----------
(function(){
var K='eps-intro-v1',syn=window.speechSynthesis;
var DEF=[["안녕하세요?","an-nyeong-ha-se-yo","Hello?","가",""],["네, 안녕하세요.","ne, an-nyeong-ha-se-yo","Yes, hello.","나",""],["자기소개하세요.","ja-gi-so-gae-ha-se-yo","Please introduce yourself.","가",""],["네, 알겠습니다. 자기소개하겠습니다.","ne, al-get-seum-ni-da. ja-gi-so-gae-ha-get-seum-ni-da","Yes, I understand. I will introduce myself.","나","(Bowing of Head)"],["안녕하십니까?","an-nyeong-ha-sim-ni-kka","Hello.","",""],["만나서 반갑습니다.","man-na-seo ban-gap-seum-ni-da","Nice to meet you.","",""],["제 이름은 [SN,N] 입니다.","je i-reu-meun [SN,N] im-ni-da","My name is ___ (surname, name).","",""],["저는 [Age] 살입니다.","jeo-neun [Age] sa-rim-ni-da","I am ___ years old.","",""],["제 생일은 [Year]년 [month]월 [day]일입니다.","je saeng-i-reun [Year]-nyeon [month]-wol [day]-i-rim-ni-da","My birthday is ___ (year, month, day).","",""],["[Province]에 살고 있습니다.","[Province]-e sal-go it-seum-ni-da","I live in ___ (province).","",""],["필리핀에서 왔습니다.","pil-li-pi-ne-seo wat-seum-ni-da","I come from the Philippines.","",""],["감사합니다.","gam-sa-ham-ni-da","Thank you.","",""]];
function mk(a){return a.map(function(x){return {k:x[0],r:x[1],e:x[2],s:x[3]||'',n:x[4]||''}})}
var D={rate:.75,pause:1,pv:0,lines:mk(DEF)};
try{var o=JSON.parse(localStorage.getItem(K)||'null');if(o&&Array.isArray(o.lines)){D.lines=o.lines.map(function(l){return {k:String(l.k||''),r:String(l.r||''),e:String(l.e||''),s:String(l.s||''),n:String(l.n||'')}});D.pv=o.pv?1:0;if(D.lines.length==7&&D.lines[1].k=='저는 ___입니다.'&&D.lines[6].k=='감사합니다.')D.lines=mk(DEF);if(+o.rate>=.4&&+o.rate<=1.1)D.rate=+o.rate;if(+o.pause>=0&&+o.pause<=3)D.pause=+o.pause}}catch(x){}
function sv(){try{localStorage.setItem(K,JSON.stringify(D))}catch(x){}}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
var amT;function am(t){clearTimeout(amT);var k=t.value,i=+t.dataset.i,l=t.closest('.ik-l'),ei=l&&l.querySelector('.ik-e');if(!ei||(ei.value.trim()&&ei.dataset.a!=='1'))return;amT=setTimeout(function(){var kk=k.trim(),h='';D.lines.forEach(function(x,j){if(j!=i&&x.k.trim()==kk&&x.e)h=x.e});PB.forEach(function(g){g[1].forEach(function(x){if(x[0]==kk)h=x[2]})});
 function ap(s){if(!s||!D.lines[i]||D.lines[i].k!==k||!document.body.contains(ei))return;if(ei.value.trim()&&ei.dataset.a!=='1')return;ei.value=s;ei.dataset.a='1';D.lines[i].e=s;sv()}
 if(h)ap(h);else if(window.__mean)window.__mean(kk,ap)},700)}
function ar(k){try{return window.__rom?window.__rom(k):''}catch(x){return ''}}
function hb(c){var n=(c||'').charCodeAt(0)-0xAC00;return n>=0&&n<11172&&n%28!==0}
var PR={'이':['이','가'],'가':['이','가'],'은':['은','는'],'는':['은','는'],'을':['을','를'],'를':['을','를'],'이에요':['이에요','예요'],'예요':['이에요','예요']};
function fx(st,sf){var p=PR[sf];return p?st+p[hb(st.charAt(st.length-1))?0:1]:st+sf}
var SJ=['','입니다','이','가','은','는','을','를','이에요','예요','도'],SP=['','에','에서','에는','에서는','도'];
var G=[{x:1,w:['저는','제가','저도','우리는','저희는','우리도']},{x:1,w:['안녕하세요','감사합니다','고맙습니다','죄송합니다','반갑습니다']},{x:1,w:['열심히','천천히','잘','매일','정말','아주']},
{s:SJ,w:['학생','회사원','의사','간호사','농부','요리사','선생님','운전사']},
{s:SP,w:['필리핀','한국','베트남','인도네시아','태국','네팔','캄보디아','미얀마','스리랑카','몽골']},
{s:SP,w:['집','학교','회사','공장','병원','시장','도서관','식당']}];
function alts(tok){var m=tok.match(/^(.*?)([.,!?]*)$/),b=m[1],pu=m[2],out=[];
 G.forEach(function(g){if(g.x){if(g.w.indexOf(b)>=0)g.w.forEach(function(w){if(w!=b)out.push(w+pu)});return}
  g.w.forEach(function(w){if(b.indexOf(w)==0){var sf=b.slice(w.length);if(g.s.indexOf(sf)>=0)g.w.forEach(function(w2){if(w2!=w)out.push(fx(w2,sf)+pu)})}})});
 return out.filter(function(v,i){return out.indexOf(v)==i})}
var PB=[['Job',[['지금 직업이 없습니다.','ji-geum ji-geo-bi eop-seum-ni-da','I have no job now. / I am unemployed now.'],['제 직업이 [Occupation]입니다.','je ji-geo-bi [Occupation]-im-ni-da','My work is (occupation).'],['[Occupation]입니다.','[Occupation]-im-ni-da','I am (occupation).']]],
['Civil status 혼인 상태',[['미혼입니다.','mi-hon-im-ni-da','I am single / unmarried.'],['미혼모입니다.','mi-hon-mo-im-ni-da','I am a single mother.'],['미혼부입니다.','mi-hon-bu-im-ni-da','I am a single father.'],['결혼했습니다.','gyeol-hon-haet-seum-ni-da','I am married.'],['아내하고 별거했습니다.','a-nae-ha-go byeol-geo-haet-seum-ni-da','I legally separated from my wife.'],['남편하고 별거했습니다.','nam-pyeon-ha-go byeol-geo-haet-seum-ni-da','I legally separated from my husband.'],['아이 아빠하고 같이 삽니다.','a-i a-ppa-ha-go ga-chi sam-ni-da',"I live together with my children's father."],['아이 엄마하고 같이 삽니다.','a-i eom-ma-ha-go ga-chi sam-ni-da',"I live together with my children's mother."],['아이 아빠하고 동거 중입니다.','a-i a-ppa-ha-go dong-geo jung-im-ni-da',"I live together with my children's father."],['아이 엄마하고 동거 중입니다.','a-i eom-ma-ha-go dong-geo jung-im-ni-da',"I live together with my children's mother."]]],
['Work experience 경력',[['[Industry]에서 [Years]년의 경력이 있습니다.','[Industry]-e-seo [Years]-nyeo-nui gyeong-ryeo-gi it-seum-ni-da','I have ___ years of experience in (industry).'],['[Occupation](으)로서 [Years]년동안 일했습니다.','[Occupation](eu)-ro-seo [Years]-nyeon-dong-an il-haet-seum-ni-da','I worked as a (occupation) for ___ years.'],['제조업','je-jo-eop','Manufacturing industry'],['건설업','geon-seol-eop','Construction industry'],['조선공업','jo-seon-gong-eop','Shipbuilding industry'],['서비스업','seo-bi-seu-eop','Service industry'],['사업진행 아웃소싱','sa-eop-jin-haeng a-ut-so-sing','Business process outsourcing']]],
['Work goals and plans',[['한국에서 일하면서 많이 배우고 싶습니다.','han-gu-ge-seo il-ha-myeon-seo ma-ni bae-u-go sip-seum-ni-da','I want to learn a lot in Korea while working.'],['회사를 도와주고 싶습니다.','hoe-sa-reul do-wa-ju-go sip-seum-ni-da','I want to help my company.'],['들어갈 회사에게 제 실력과 경험이 도움이 됐으면 좋겠습니다.','deu-reo-gal hoe-sa-e-ge je sil-ryeok-gwa gyeong-heo-mi do-u-mi dwae-sseu-myeon jo-ket-seum-ni-da','I hope my skills and experience will be helpful to the company I will work for.'],['열심히 일하고 동료들끼리 사이좋게 지내보겠습니다.','yeol-sim-hi il-ha-go dong-ryo-deul-kki-ri sa-i-jo-ke ji-nae-bo-get-seum-ni-da','I plan to work hard and get along with my co-workers.'],['저에게 기회를 주신다면 최선을 다 하겠습니다.','jeo-e-ge gi-hoe-reul ju-sin-da-myeon choe-seo-neul da ha-get-seum-ni-da','If you give me an opportunity, I will do my very best.']]],
['Final greeting',[['저를 뽑아주시기 바랍니다.','jeo-reul ppo-ba-ju-si-gi ba-ram-ni-da','I hope you select me.'],['저는 열심히 일하겠습니다.','jeo-neun yeol-sim-hi il-ha-get-seum-ni-da','I will work hard.'],['잘 부탁드립니다.','jal bu-tak-deu-rim-ni-da','Please take care of me.']]]];
var PBO=0;
var PBG=-1,MULTI={2:1,3:1,4:1};
function pbHTML(){var has=function(k){return D.lines.some(function(l){return l.k==k})},h='<div style="margin:10px 0;padding:10px;border:1px solid var(--line);border-radius:14px;background:var(--card)"><div style="font:700 15px var(--sans);margin:0 2px 8px">'+kic('book')+' Phrase bank <small style="font-weight:400;opacity:.7">· tap + to add a line</small></div>';
PB.forEach(function(g,gi){var o=PBG==gi,n=g[1].filter(function(x){return has(x[0])}).length;
h+='<button type="button" data-ik="pbg" data-g="'+gi+'" style="display:flex;justify-content:space-between;align-items:center;width:100%;padding:10px 12px;margin:4px 0;border:1px solid var(--line);border-radius:10px;background:var(--bg,transparent);color:inherit;font:600 14px var(--sans);text-align:left;cursor:pointer"><span>'+(o?kic('chevd',14)+' ':kic('chevr',14)+' ')+esc(g[0])+'</span><small style="opacity:.7">'+n+'/'+g[1].length+'</small></button>';
if(o){h+='<div style="padding:2px 0 6px">';var pk=!MULTI[gi]&&g[1].some(function(x){return has(x[0])});g[1].forEach(function(x,j){var a=has(x[0]),lk=pk&&!a;h+='<div style="display:flex;align-items:center;gap:10px;padding:8px 6px;border-bottom:1px solid var(--line)"><div style="flex:1;min-width:0"><div lang="ko" style="font:600 15px/1.35 var(--sans)">'+esc(x[0])+'</div><div style="font:12px/1.3 var(--sans);opacity:.7;margin-top:2px">'+esc(x[2])+'</div></div><button type="button" data-ik="pbadd" data-g="'+gi+'" data-j="'+j+'" aria-label="Add phrase" style="flex:none;width:34px;height:34px;border-radius:50%;border:1px solid var(--line);background:'+(a?'var(--seal)':'var(--jade)')+';border-color:transparent;color:#fff;font:700 20px/1 var(--sans);cursor:pointer;opacity:'+(lk?'.3':'1')+'" '+(lk?'disabled ':'')+'aria-label="'+(a?'Remove phrase':'Add phrase')+'">'+(a?kic('minus',18):kic('plus',18))+'</button></div>'});h+='</div>'}});
return h+'</div>'}
var EI=-1,OC=null,UN=null,PL=-1,tok=0,playing=false,RPon=false,RPi=0,RPz=0,PAon=false,PAi=0,PAz=0,RV={},TM=0,NX=null,REC=null,SR=window.SpeechRecognition||window.webkitSpeechRecognition;
function toks(k){return String(k).split(/\s+/).filter(Boolean)}
function chips(i){var t=toks(D.lines[i].k);return t.map(function(w,c){return '<button type="button" class="ik-c'+(w.indexOf('___')>=0||w.indexOf('[')>=0?' bl':'')+(OC&&OC.i==i&&OC.c==c?' sel':'')+'" data-ik="chip" data-i="'+i+'" data-c="'+c+'">'+esc(w)+'</button>'}).join('')}
function pop(i){if(!OC||OC.i!=i)return '';var w=toks(D.lines[i].k)[OC.c];if(w==null)return '';var a=alts(w);
 return '<div class="ik-p"><div class="ik-pt">Change “'+esc(w)+'”'+(a.length?'':' · no quick swaps, type your own')+'</div>'+(a.length?'<div class="ik-pa">'+a.map(function(x){return '<button type="button" class="ik-a" data-ik="pick" data-i="'+i+'" data-v="'+esc(x)+'">'+esc(x)+'</button>'}).join('')+'</div>':'')+'<div class="ik-pc"><input type="text" id="ik-pi" lang="ko" value="'+esc(w.replace(/^(.*?)\[([^\]]*)\](.*)$/,'$2'))+'" placeholder="Type your own"><button type="button" class="ik-b" data-ik="apply" data-i="'+i+'">Apply</button><button type="button" class="ik-b" data-ik="close">Close</button></div></div>'}
function rl(r){return r<=.55?'Slow':r<=.85?'Normal':'Fast'}
var IKNOTE='<details class="sghow"><summary>How to use this tab</summary><ol><li><span>Tap a line to edit it.</span></li><li><span>Press and hold a line, then drag it up or down to move it.</span></li><li><span>In the editor, tap a word under the Korean line to swap it.</span></li><li><span>Write a blank as [Age] or ___. Words inside [ ] are not read aloud.</span></li><li><span>Romanization and meaning do not change by themselves, so edit them yourself.</span></li><li><span><b>Progress:</b> your lines save on this device by themselves. Back them up in <b>⚙ Settings</b> with Export.</span></li></ol></details>';
function rowHTML(l,i){var sp=l.s?'<span class="ik-sb">'+esc(l.s)+'</span>':'';return '<div class="ik-l ik-cr'+(PL==i?' on':'')+'" data-i="'+i+'"><span class="ik-n">'+(i+1)+'</span><div class="ik-cm" data-ik="open" data-i="'+i+'" role="button" aria-label="Edit line '+(i+1)+'">'+(l.k.trim()?'<div class="ik-ck" lang="ko">'+sp+fk(l.k)+'</div>':'<div class="ik-ck ik-em">Empty line. Tap to write.</div>')+(l.e?'<div class="ik-ce">'+esc(l.e)+'</div>':'')+'</div><button type="button" class="ik-ic pl" data-ik="play" data-i="'+i+'" aria-label="Play line '+(i+1)+'">'+kic('play',16)+'</button></div>'}
window.introCnt=function(){return D.lines.length+' lines · saved on this device'};
function hl(p){var re=/([가-힣]?)([가-힣])니([다까])/g,o='',l=0,m,f=function(c){return c?(c.charCodeAt(0)-0xAC00)%28:0};while((m=re.exec(p))){var a=m[1],b=m[2];if(f(b)!=17)continue;var rd=f(a)==20?a:'';o+=esc(p.slice(l,m.index+(rd?0:a.length)))+'<span class="ik-fe">'+esc(rd+b+'니'+m[3])+'</span>';l=m.index+m[0].length}return o+esc(p.slice(l))}
function fk(s){return String(s).split(/(\[[^\]]*\]|_{2,})/).map(function(p,j){return j%2?'<span class="ik-bk">'+(p.charAt(0)=='['?esc(p.slice(1,-1)):'')+'</span>':hl(p)}).join('')}
function paperLines(){var h='<div class="ik-pp"><div class="ik-t0">자기소개</div><div class="ik-t1">Self Introduction</div>';D.lines.forEach(function(l,i){if(!l.k.trim())return;h+='<div class="ik-pl'+(PL==i?' on':'')+(hid(i)?' hid':'')+'" data-ik="play" data-i="'+i+'"><span class="ik-sk">'+(l.s?esc(l.s)+(l.s=='가'?' (A)':l.s=='나'?' (B)':'')+':':'')+'</span><div class="ik-pb"><div class="ik-pk">'+fk(l.k)+'</div>'+(l.n?'<div class="ik-pn">'+esc(l.n)+'</div>':'')+((l.r||ar(l.k))?'<div class="ik-pr">'+esc(l.r||ar(l.k))+'</div>':'')+(l.e?'<div class="ik-pe">'+esc(l.e)+'</div>':'')+'</div>'+(hid(i)?'<span class="ik-yt">'+kic('mic',14)+' Your turn</span>':'')+'</div>'});return h+'</div>'}
window.introList=function(){
 var h='<div>'+IKNOTE+'<div class="ik-bar ik-grid'+(D.pv?' g2':'')+'"><button type="button" class="ik-b ik-pri" data-ik="playall">'+(playing?kic('stop')+' Stop':kic('play')+' Play (listen)')+'</button>'+(D.pv?'<button type="button" class="ik-b" data-ik="edit">'+kic('edit')+' Edit lines</button><button type="button" class="ik-b" data-ik="rp">'+(RPon?kic('stop')+' Stop role-play':kic('users')+' Role-play')+'</button>'+'':'<button type="button" class="ik-b" data-ik="paper">'+kic('file')+' Paper view</button><div class="ik-two"><button type="button" class="ik-b" data-ik="add">'+kic('plus')+' Add line</button><button type="button" class="ik-b" data-ik="pbt">'+(PBO?kic('x')+' Close phrases':kic('book')+' Phrases')+'</button></div>')+(UN&&!D.pv?'<button type="button" class="ik-b" data-ik="undo">'+kic('undo')+' Undo delete</button>':'')+'</div>';
 if(!D.pv&&PBO)h+=pbHTML();
 if(D.pv){h+=paperLines()}else D.lines.forEach(function(l,i){if(EI!=i){h+=rowHTML(l,i);return}h+='<div class="ik-l'+(PL==i?' on':'')+'" data-i="'+i+'"><div class="ik-h"><span class="ik-n">'+(i+1)+'</span><button type="button" class="ik-ic pl" data-ik="play" data-i="'+i+'" aria-label="Play line '+(i+1)+'">'+kic('play',16)+'</button><span class="ik-sp"></span><button type="button" class="ik-ic" data-ik="up" data-i="'+i+'" aria-label="Move up"'+(i==0?' disabled':'')+'>'+kic('up',16)+'</button><button type="button" class="ik-ic" data-ik="down" data-i="'+i+'" aria-label="Move down"'+(i==D.lines.length-1?' disabled':'')+'>'+kic('down',16)+'</button><button type="button" class="ik-ic" data-ik="del" data-i="'+i+'" aria-label="Delete line">'+kic('trash',16)+'</button></div>'
  +'<input type="text" class="ik-s" data-f="s" data-i="'+i+'" lang="ko" value="'+esc(l.s||'')+'" placeholder="Speaker (가 / 나, optional)">'
  +'<input type="text" class="ik-k" data-f="k" data-i="'+i+'" lang="ko" value="'+esc(l.k)+'" placeholder="한국어">'
  +'<div class="ik-ch">'+chips(i)+'</div>'+pop(i)
  +'<input type="text" class="ik-r" data-f="r" data-i="'+i+'" value="'+esc(l.r)+'" placeholder="Romanization (auto, you can edit)">'
  +'<input type="text" class="ik-e" data-f="e" data-i="'+i+'" value="'+esc(l.e)+'" placeholder="Meaning (auto, you can edit)">'+'<input type="text" class="ik-nt" data-f="n" data-i="'+i+'" value="'+esc(l.n||'')+'" placeholder="Note (optional, not read aloud)">'+'<button type="button" class="ik-b ik-pri" data-ik="done" style="width:100%;margin-top:8px">Done</button></div>'});
 if(!D.lines.length)h+='<p class="note">No lines yet. Tap + Add line.</p>';
 if(D.pv)h+=(RPon?rpHTML():'')+'</div>';else h+='<div class="ik-bar"><button type="button" class="ik-b" data-ik="reset">Reset to sample</button></div></div>';
 return h};
var _il=window.introList;window.introList=function(){var h=_il();return PAon?h.replace(/<\/div>$/,paHTML()+'</div>'):h};
function rr(){var y=window.pageYOffset||0,el=document.getElementById('list'),h=el.offsetHeight;el.style.minHeight=h+'px';el.innerHTML=window.introList();try{window.scrollTo({top:y,left:0,behavior:'instant'})}catch(x){window.scrollTo(0,y)}el.style.minHeight=''}
function mark(){var ls=document.querySelectorAll('#list .ik-l,#list .ik-pl');[].forEach.call(ls,function(e){var on=+e.dataset.i===PL;e.classList.toggle('on',on);if(on&&playing)try{e.scrollIntoView({block:'center',behavior:'smooth'})}catch(x){}});var b=document.querySelector('#list [data-ik=playall]');if(b)b.innerHTML=playing?kic('stop')+' Stop':kic('play')+' Play (listen)'}
function stop(){tok++;try{if(REC){REC.onend=null;REC.abort()}}catch(x){}REC=null;playing=false;PL=-1;clearTimeout(TM);NX=null;try{if(syn)syn.cancel()}catch(x){}if(RPon){RPon=false;RV={};if(on7())rr()}if(PAon){PAon=false;if(on7())rr()}mark()}
window.introStop=function(){if(playing||PL>=0)stop()};
function say(t,done){var s=String(t).replace(/\[[^\]]*\]/g,' ').replace(/_+/g,' ').replace(/\s+/g,' ').trim();if(!syn||!s){if(!syn&&typeof toast=='function')toast('This device cannot play Korean voice.');done&&setTimeout(done,0);return}
 var u=new SpeechSynthesisUtterance(s);u.lang='ko-KR';u.rate=D.rate;try{var v=syn.getVoices().filter(function(x){return /^ko/i.test(x.lang)})[0];if(v)u.voice=v}catch(x){}
 var f=0,end=function(){if(f)return;f=1;done&&done()};u.onend=end;u.onerror=end;try{syn.cancel()}catch(x){}syn.speak(u)}
function playLine(i){stop();var my=++tok;PL=i;mark();say(D.lines[i].k,function(){if(my!=tok)return;PL=-1;mark()})}
function hid(i){return false}
function reveal(i){RV[i]=1;var e=document.querySelector('#list .ik-pl[data-i="'+i+'"]');if(e)e.classList.remove('hid')}
function nrm(t){return String(t).replace(/\[[^\]]*\]/g,' ').replace(/[^가-힣0-9]/g,'')}
function lcs(a,b){var d=[],i,j;for(i=0;i<=a.length;i++){d[i]=[];for(j=0;j<=b.length;j++)d[i][j]=!i||!j?0:a[i-1]==b[j-1]?d[i-1][j-1]+1:Math.max(d[i-1][j],d[i][j-1])}return d[a.length][b.length]}
function kic(n,z){return window.skSI?window.skSI(n,z):''}
function ms(t){var e=document.getElementById('ik-rps');if(e)e.innerHTML=t}
function rs(t,c){var e=document.getElementById('ik-rpr');if(e){e.textContent=t;e.className=c||''}}
function rpPz(){var e=document.getElementById('ik-rpp'),I=window.skSI;if(e&&I)e.innerHTML=RPz?I('play'):I('pause')}
function rpHTML(){var I=window.skSI||function(){return''};return'<div class="sk dp"><div class="vp dbar" id="ik-rpb"><div class="dst"><b id="ik-rps">가 is asking…</b><span id="ik-rpn"></span></div><div class="dtx kr" id="ik-rpt" lang="ko"></div><div id="ik-rpr"></div><div class="vrow dbt"><button type="button" class="vbtn alt" data-ik="rprev" aria-label="Previous">'+I('prev')+'</button><button type="button" class="vbtn" id="ik-rpp" data-ik="rpp" aria-label="Pause">'+(RPz?I('play'):I('pause'))+'</button><button type="button" class="vbtn alt" data-ik="rnext" aria-label="Next">'+I('next')+'</button><button type="button" class="vbtn alt" data-ik="rspd" data-v="-1" aria-label="Slower">'+I('minus')+'</button><span class="dsp" id="ik-rsv">'+D.rate+'×</span><button type="button" class="vbtn alt" data-ik="rspd" data-v="1" aria-label="Faster">'+I('plus')+'</button><button type="button" class="vbtn alt" data-ik="rp" aria-label="Close">'+I('x')+'</button></div></div></div>'}
function listen(i,my,miss){if(my!=tok)return;var t=nrm(D.lines[i].k),al=(D.lines[i].k.match(/\[[^\]]*\]|_{2,}/g)||[]).length*6+2,r=new SR(),ok=0;REC=r;r.lang='ko-KR';r.continuous=true;r.interimResults=true;r.maxAlternatives=3;
 r.onresult=function(e){if(ok||my!=tok)return;var b=0,n,a,h,last=e.results[e.results.length-1],fin=!!(last&&last.isFinal);var tx0=document.getElementById('ik-rpt');if(tx0&&last)tx0.textContent=last[0].transcript;for(n=0;n<e.results.length;n++){h=e.results[n];for(a=0;a<h.length;a++){var tr=nrm(h[a].transcript),lh=window.__lh||'';if(lh&&tr.indexOf(lh)==0)tr=tr.slice(lh.length);if(!tr)continue;b=Math.max(b,t?lcs(tr,t)/Math.max(t.length,tr.length-al):(tr.length>=2?1:0))}}
  if(b>=(fin?(miss>=3?.6:.75):.85)){ok=1;window.__lh=nrm(last[0].transcript);rs('✓ Good!','ok');r.onend=null;try{r.abort()}catch(x){}if(REC===r)REC=null;TM=setTimeout(function(){rpStep(i+1,my)},400)}else if(fin&&b>0){miss++;rs('✗ Not quite. Try again.','bad')}};
 r.onerror=function(e){if(e.error=='not-allowed'||e.error=='service-not-allowed'){if(typeof toast=='function')toast('Please allow the microphone.');stop()}};
 r.onend=function(){if(ok||my!=tok)return;TM=setTimeout(function(){listen(i,my,miss)},300)};
 var tx1=document.getElementById('ik-rpt');if(tx1)tx1.textContent='';rs('','');ms(kic('mic',16)+' Your turn: say it');try{r.start()}catch(x){}}
function rpStep(i,my){if(my!=tok)return;var L=D.lines;while(i<L.length&&!L[i].k.trim())i++;
 if(i>=L.length){RPon=false;RV={};playing=false;PL=-1;NX=null;rr();window.scrollTo({top:0,behavior:'smooth'});if(typeof toast=='function')toast('Role-play done. Well done!');return}
 var l=L[i];PL=i;RPi=i;mark();rs('','');var cn=document.getElementById('ik-rpn');if(cn)cn.textContent=(i+1)+' / '+L.length;
 if(l.s==='가'){ms('가 is asking…');NX=function(){try{if(syn)syn.cancel()}catch(x){}};say(l.k,function(){if(my!=tok)return;NX=null;TM=setTimeout(function(){rpStep(i+1,my)},D.pause*1000)});return}
 NX=null;listen(i,my,0)}
function rpStart(){if(RPon){stop();return}if(!SR){if(typeof toast=='function')toast('Mic not supported here. Use Chrome or Edge.',3500);return}if(!D.lines.some(function(l){return l.s==='가'&&l.k.trim()})){if(typeof toast=='function')toast('Add a line with speaker 가 so the app can ask the questions.');return}
 stop();window.__lh='';var my=++tok;RPon=true;RPz=0;RV={};playing=true;rr();rpStep(0,my)}
function paHTML(){var I=window.skSI||function(){return''};return'<div class="sk dp"><div class="vp dbar" id="ik-pab"><div class="dst"><b id="ik-pas">'+(PAz?I('pause',16)+' Paused':'Listening…')+'</b><span id="ik-pan"></span></div><div class="dtx kr" id="ik-pat" lang="ko"></div><div class="vrow dbt"><button type="button" class="vbtn alt" data-ik="pprev" aria-label="Previous">'+I('prev')+'</button><button type="button" class="vbtn" id="ik-pap" data-ik="ppp" aria-label="Pause">'+(PAz?I('play'):I('pause'))+'</button><button type="button" class="vbtn alt" data-ik="pnext" aria-label="Next">'+I('next')+'</button><button type="button" class="vbtn alt" data-ik="rspd" data-v="-1" aria-label="Slower">'+I('minus')+'</button><span class="dsp" id="ik-rsv">'+D.rate+'×</span><button type="button" class="vbtn alt" data-ik="rspd" data-v="1" aria-label="Faster">'+I('plus')+'</button><button type="button" class="vbtn alt" data-ik="pclose" aria-label="Close">'+I('x')+'</button></div></div></div>'}
function paPz(){var e=document.getElementById('ik-pap'),I=window.skSI;if(e&&I)e.innerHTML=PAz?I('play'):I('pause')}
function paInfo(i){var n=document.getElementById('ik-pan'),t=document.getElementById('ik-pat'),s=document.getElementById('ik-pas'),I=window.skSI,l=D.lines[i];if(n)n.textContent=(i+1)+' / '+D.lines.length;if(t)t.textContent=l?String(l.k).replace(/\[[^\]]*\]/g,'…'):'';if(s&&I)s.innerHTML=PAz?I('pause',16)+' Paused':(l&&l.s==='나'?'나 is answering…':l&&l.s==='가'?'가 is asking…':'Listening…')}
function paStep(i,my){if(my!=tok)return;var L=D.lines;while(i<L.length&&!L[i].k.trim())i++;if(i>=L.length){PAon=false;playing=false;PL=-1;rr();window.scrollTo({top:0,behavior:'smooth'});return}PAi=i;PL=i;mark();paInfo(i);say(L[i].k,function(){if(my!=tok)return;TM=setTimeout(function(){paStep(i+1,my)},D.pause*1000)})}
function playAll(){if(playing){stop();return}stop();var my=++tok;playing=true;PAon=true;PAz=0;rr();paStep(0,my)}
function setTok(i,c,v){var t=toks(D.lines[i].k);if(!v)return;t[c]=v;D.lines[i].k=t.join(' ');OC=null;sv()}
function on7(){var b=document.getElementById('t7');return b&&b.getAttribute('aria-selected')=='true'}
document.addEventListener('click',function(e){if(!on7())return;if(window.__dgT&&Date.now()-window.__dgT<450)return;var b=e.target.closest&&e.target.closest('#list [data-ik]');if(!b||b.tagName=='INPUT')return;var a=b.dataset.ik,i=+b.dataset.i,L=D.lines;
 if(a=='paper'){stop();D.pv=1;OC=null;sv();rr()}else if(a=='edit'){stop();D.pv=0;sv();rr()}else if(a=='playall'){playAll()}else if(a=='open'){stop();EI=EI==i?-1:i;OC=null;rr();var oe=document.querySelector('#list .ik-l:not(.ik-cr)');if(oe)try{oe.scrollIntoView({block:'nearest'})}catch(x){}}else if(a=='done'){EI=-1;OC=null;rr()}else if(a=='play'){if(RPon){if(hid(i))reveal(i)}else playLine(i)}else if(a=='rp'){rpStart()}
 else if(a=='rpp'){if(!RPon)return;if(RPz){RPz=0;var my3=++tok;rpPz();rpStep(RPi,my3)}else{RPz=1;tok++;try{if(REC){REC.onend=null;REC.abort()}}catch(x){}REC=null;clearTimeout(TM);NX=null;try{if(syn)syn.cancel()}catch(x){}ms(kic('pause',16)+' Paused');rpPz()}}
 else if(a=='rprev'||a=='rnext'){if(!RPon)return;var j=Math.max(0,RPi+(a=='rnext'?1:-1));RPz=0;rpPz();tok++;try{if(REC){REC.onend=null;REC.abort()}}catch(x){}REC=null;clearTimeout(TM);NX=null;try{if(syn)syn.cancel()}catch(x){}var my2=++tok;rpStep(j,my2)}
 else if(a=='ppp'){if(!PAon)return;if(PAz){PAz=0;paPz();paStep(PAi,++tok)}else{PAz=1;tok++;clearTimeout(TM);try{if(syn)syn.cancel()}catch(x){}paInfo(PAi);paPz()}}
 else if(a=='pprev'||a=='pnext'){if(!PAon)return;var j=Math.max(0,PAi+(a=='pnext'?1:-1));PAz=0;paPz();tok++;clearTimeout(TM);try{if(syn)syn.cancel()}catch(x){}paStep(j,++tok)}
 else if(a=='pclose'){stop()}
 else if(a=='rspd'){var st=[.5,.6,.75,.9,1],n0=0;st.forEach(function(x,k){if(Math.abs(x-D.rate)<Math.abs(st[n0]-D.rate))n0=k});n0=Math.max(0,Math.min(st.length-1,n0+(+b.dataset.v)));D.rate=st[n0];sv();var rv=document.getElementById('ik-rsv');if(rv)rv.textContent=D.rate+'×'}
 else if(a=='pbg'){var gg=+b.dataset.g;PBG=PBG==gg?-1:gg;rr()}else if(a=='pbt'){PBO=PBO?0:1;rr()}else if(a=='pbadd'){var q=PB[+b.dataset.g][1][+b.dataset.j],ix=-1;for(var z=L.length-1;z>=0;z--)if(L[z].k==q[0]){ix=z;break}if(ix>=0){stop();L.splice(ix,1);EI=-1;OC=null;sv();rr();if(typeof toast=='function')toast('Removed.',1500)}else if(!MULTI[+b.dataset.g]&&PB[+b.dataset.g][1].some(function(x){return L.some(function(l){return l.k==x[0]})})){if(typeof toast=='function')toast('Only one per category. Remove the other first.',2000)}else{L.push({k:q[0],r:q[1],e:q[2],s:'',n:''});sv();rr();if(typeof toast=='function')toast('Added line '+L.length+'.',1500)}}
 else if(a=='add'){stop();L.push({k:'',r:'',e:'',s:'',n:''});EI=L.length-1;OC=null;sv();rr();var ks=document.querySelectorAll('#list .ik-k'),k=ks[ks.length-1];if(k){k.focus();k.scrollIntoView({block:'center'})}}
 else if(a=='del'){stop();UN={l:L[i],i:i};L.splice(i,1);EI=-1;OC=null;sv();rr();if(typeof toast=='function')toast('Line deleted. Tap Undo to bring it back.',3500)}
 else if(a=='undo'&&UN){EI=-1;L.splice(Math.min(UN.i,L.length),0,UN.l);UN=null;sv();rr()}
 else if(a=='up'&&i>0){stop();var t=L[i];L[i]=L[i-1];L[i-1]=t;if(EI==i)EI=i-1;OC=null;sv();rr()}
 else if(a=='down'&&i<L.length-1){stop();var t2=L[i];L[i]=L[i+1];L[i+1]=t2;if(EI==i)EI=i+1;OC=null;sv();rr()}
 else if(a=='chip'){var c=+b.dataset.c;OC=(OC&&OC.i==i&&OC.c==c)?null:{i:i,c:c};rr();if(OC){var pi=document.getElementById('ik-pi');if(pi)pi.scrollIntoView({block:'nearest'})}}
 else if(a=='pick'){setTok(i,OC.c,b.dataset.v);rr()}
 else if(a=='apply'){var p=document.getElementById('ik-pi'),ow=toks(L[i].k)[OC.c]||'',bm=ow.match(/^(.*?)\[([^\]]*)\](.*)$/),nv=p?p.value.replace(/[\[\]]/g,'').trim():'';if(nv){if(bm)nv=bm[1]+'['+nv+']'+bm[3];else{nv=nv.replace(/[.,!?]+$/,'');if(nv!==ow.replace(/[.,!?]+$/,''))nv='['+nv+']'+(ow.match(/[.,!?]*$/)||[''])[0];else nv=ow}}setTok(i,OC.c,nv);rr()}
 else if(a=='close'){OC=null;rr()}
 else if(a=='reset'){if(!b.dataset.c){b.dataset.c='1';b.textContent='Tap again to confirm';setTimeout(function(){if(b.isConnected){delete b.dataset.c;b.textContent='Reset to sample'}},4000)}else{stop();D.lines=mk(DEF);EI=-1;OC=null;UN=null;sv();rr();if(typeof toast=='function')toast('Intro reset to sample.',2000)}}});
/* long press + drag to reorder lines */
var dgT=null,dgP=null,dg=null,dgRaf=0;
function dgRows(){return [].slice.call(document.querySelectorAll('#list .ik-cr'))}
function dgCancelP(){clearTimeout(dgT);dgT=null;dgP=null}
function dgDown(x,y,t){dgCancelP();if(!on7()||D.pv||!t||!t.closest)return;var r=t.closest('#list .ik-cr');if(!r||t.closest('button'))return;dgP={i:+r.dataset.i,x:x,y:y};dgT=setTimeout(function(){dgT=null;if(dgP){var p=dgP;dgP=null;dgBegin(p)}},380)}
function dgBegin(p){window.SW=null;stop();if(EI>=0){EI=-1;OC=null;rr()}var rows=dgRows(),r=rows[p.i];if(!r)return;var sy=window.pageYOffset||0,rc=rows.map(function(e){var b=e.getBoundingClientRect();return {m:b.top+sy+b.height/2}});dg={from:p.i,to:p.i,rows:rows,rc:rc,cy:p.y,off:p.y+sy-rc[p.i].m,step:r.offsetHeight+6};r.classList.add('ik-dg');rows.forEach(function(e){if(e!==r)e.classList.add('ik-sh')});if(navigator.vibrate)try{navigator.vibrate(18)}catch(x){}dgLoop()}
function dgUpd(){if(!dg)return;var sy=window.pageYOffset||0,fp=dg.cy+sy,n=dg.rows.length,c=fp-dg.off,to=dg.from,k;dg.rows[dg.from].style.transform='translateY('+(c-dg.rc[dg.from].m)+'px) scale(1.02)';
 for(k=dg.from+1;k<n;k++)if(c>dg.rc[k].m)to=k;
 if(to==dg.from)for(k=0;k<dg.from;k++)if(c<dg.rc[k].m){to=k;break}
 dg.to=to;for(k=0;k<n;k++){if(k==dg.from)continue;var sh=0;if(dg.from<to&&k>dg.from&&k<=to)sh=-dg.step;else if(dg.from>to&&k>=to&&k<dg.from)sh=dg.step;dg.rows[k].style.transform=sh?'translateY('+sh+'px)':''}}
function dgLoop(){cancelAnimationFrame(dgRaf);(function f(){if(!dg)return;var H=window.innerHeight,y=dg.cy,v=0;if(y<90)v=-Math.min(16,Math.ceil((90-y)/6));else if(y>H-90)v=Math.min(16,Math.ceil((y-(H-90))/6));if(v)window.scrollBy(0,v);dgUpd();dgRaf=requestAnimationFrame(f)})()}
function dgEnd(ok){dgCancelP();if(!dg)return;cancelAnimationFrame(dgRaf);var d=dg;dg=null;window.__dgT=Date.now();d.rows.forEach(function(e){e.style.transform='';e.classList.remove('ik-dg','ik-sh')});if(ok&&d.to!=d.from){var L=D.lines,m=L.splice(d.from,1)[0];L.splice(d.to,0,m);sv();EI=-1;OC=null;rr();if(typeof toast=='function')toast('Moved to line '+(d.to+1)+'.',1500)}}
document.addEventListener('touchstart',function(e){if(e.touches.length!=1){if(dg)dgEnd(false);else dgCancelP();return}var t=e.touches[0];dgDown(t.clientX,t.clientY,e.target)},{passive:true});
document.addEventListener('touchmove',function(e){var t=e.touches[0];if(dg){if(e.cancelable)e.preventDefault();dg.cy=t.clientY;return}if(dgP&&Math.hypot(t.clientX-dgP.x,t.clientY-dgP.y)>10)dgCancelP()},{passive:false});
document.addEventListener('touchend',function(e){if(dg){if(e.cancelable)e.preventDefault();dgEnd(true)}else dgCancelP()},{passive:false});
document.addEventListener('touchcancel',function(){if(dg)dgEnd(false);else dgCancelP()},{passive:true});
document.addEventListener('mousedown',function(e){if(e.button===0)dgDown(e.clientX,e.clientY,e.target)});
document.addEventListener('mousemove',function(e){if(dg){dg.cy=e.clientY;return}if(dgP&&Math.hypot(e.clientX-dgP.x,e.clientY-dgP.y)>10)dgCancelP()});
document.addEventListener('mouseup',function(){if(dg)dgEnd(true);else dgCancelP()});
document.addEventListener('contextmenu',function(e){if(on7()&&e.target.closest&&e.target.closest('#list .ik-cr'))e.preventDefault()});
document.addEventListener('input',function(e){var t=e.target;if(!on7()||!t||!t.closest||!t.closest('#list'))return;
 if(t.dataset.ik=='rate'){D.rate=+t.value;document.getElementById('ik-rv').textContent=rl(D.rate);sv();return}
 if(t.dataset.ik=='pause'){D.pause=+t.value;document.getElementById('ik-pv').textContent=D.pause+'s';sv();return}
 if(t.dataset.f){var i=+t.dataset.i;D.lines[i][t.dataset.f]=t.value;var ri0=t.closest('.ik-l').querySelector('.ik-r');if(t.dataset.f=='r')t.dataset.m=t.value.trim()?'1':'';if(t.dataset.f=='e')t.dataset.a='';if(t.dataset.f=='k')am(t);if(t.dataset.f=='k'&&ri0&&!ri0.dataset.m){var nr=t.value.trim()?ar(t.value):'';D.lines[i].r=nr;ri0.value=nr}sv();if(t.dataset.f=='k'){OC=null;var l=t.closest('.ik-l'),ch=l.querySelector('.ik-ch'),pp=l.querySelector('.ik-p');if(pp)pp.remove();ch.innerHTML=chips(i)}}});
document.addEventListener('change',function(e){var t=e.target;if(on7()&&t&&t.dataset&&t.dataset.ik=='rate'){var i=D.lines.findIndex(function(l){return l.k.trim()});if(i>=0)playLine(i)}});
})();

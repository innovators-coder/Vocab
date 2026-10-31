(function(){
var K='eps-skill-v1',syn=window.speechSynthesis,SR=window.SpeechRecognition||window.webkitSpeechRecognition;
var BASE=[
['i','이름이 뭐예요?','What is your name?','제 이름은 마리아예요.','My name is Maria.','이름|저는|제'],
['i','몇 살이에요?','How old are you?','저는 스물다섯 살이에요.','I am 25 years old.','살'],
['i','어느 나라 사람이에요?','Which country are you from?','저는 필리핀 사람이에요.','I am Filipino.','사람|나라|에서'],
['i','가족이 몇 명이에요?','How many people are in your family?','우리 가족은 다섯 명이에요.','There are five people in my family.','명|가족'],
['i','직업이 뭐예요?','What is your job?','저는 용접공이에요.','I am a welder.','저는|직업|일|제'],
['i','한국에 왜 가고 싶어요?','Why do you want to go to Korea?','돈을 벌고 싶어서 한국에 가고 싶어요.','I want to earn money, so I want to go to Korea.','싶|가려고|벌'],
['i','한국어를 얼마나 공부했어요?','How long have you studied Korean?','육 개월 동안 한국어를 공부했어요.','I studied Korean for six months.','공부'],
['i','취미가 뭐예요?','What is your hobby?','제 취미는 노래하기예요.','My hobby is singing.','취미|좋아'],
['i','무슨 일을 해 봤어요?','What work have you done?','공장에서 일해 봤어요.','I have worked in a factory.','일|에서'],
['i','자기소개를 해 주세요.','Please introduce yourself.','안녕하세요. 저는 마리아입니다. 필리핀에서 왔습니다.','Hello. I am Maria. I came from the Philippines.','저는|제 이름'],
['w','몇 시에 일어나요?','What time do you get up?','저는 여섯 시에 일어나요.','I get up at six.','시'],
['w','어디가 아파요?','Where does it hurt?','머리가 아파요.','My head hurts.','아파|아픕'],
['w','일이 힘들어요?','Is the work hard?','아니요, 괜찮아요. 일이 재미있어요.','No, it is fine. The work is fun.','네|예|아니요|괜찮|힘들|재미'],
['w','이 기계를 사용해 봤어요?','Have you used this machine?','네, 사용해 봤어요.','Yes, I have used it.','네|예|아니요|사용'],
['w','점심시간이 몇 시예요?','What time is lunch?','열두 시예요.','It is twelve o\'clock.','시'],
['w','오늘 몇 시까지 일해요?','Until what time do you work today?','저녁 여섯 시까지 일해요.','I work until six in the evening.','까지|시'],
['w','안전모를 썼어요?','Did you wear a hard hat?','네, 안전모를 썼어요.','Yes, I wore a hard hat.','네|예|아니요|썼'],
['w','모르면 어떻게 해요?','What do you do if you do not know?','모르면 선생님에게 물어봐요.','If I do not know, I ask the teacher.','물어|질문|도움|말'],
['w','월급은 어떻게 받아요?','How do you get your pay?','은행 계좌로 받아요.','I get it in my bank account.','은행|계좌|받'],
['w','사고가 나면 어떻게 해요?','What do you do if an accident happens?','바로 사장님에게 말해요.','I tell the boss right away.','말|전화|연락|신고']
];
var MY=[];try{MY=JSON.parse(localStorage.getItem('eps-skill-my-v1')||'[]')||[]}catch(e){MY=[]}var ED={};try{ED=JSON.parse(localStorage.getItem('eps-skill-ed-v1')||'{}')||{}}catch(e){ED={}}var EB=null;function svEd(){try{localStorage.setItem('eps-skill-ed-v1',JSON.stringify(ED))}catch(e){}}function B2(){return BASE.map(function(x,i){var o=ED[i];return o?[x[0],o.k,o.e||'',o.a,o.ae||'',o.kw||'']:x})}var EI=null;function svMy(){try{localStorage.setItem('eps-skill-my-v1',JSON.stringify(MY))}catch(e){}}function ALL(){return B2().concat(MY.map(function(m){return['m',m.k,m.e||'',m.a,m.ae||'',m.kw||'']}))}
var P={cat:'b',n:10,best:0,rate:.85,voice:'',auto:1,pz:8},AK=0,AT=0;try{var o=JSON.parse(localStorage.getItem(K)||'{}');for(var k in o)if(k in P)P[k]=o[k]}catch(e){}
function sv(){try{localStorage.setItem(K,JSON.stringify(P))}catch(e){}}
var S=null,REC=null;
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function vo(){try{var v=syn.getVoices().filter(function(x){return /^ko/i.test(x.lang)});for(var i=0;i<v.length;i++)if(v[i].name==P.voice)return v[i];return v[0]||null}catch(e){return null}}
function mk(t){var u=new SpeechSynthesisUtterance(t);u.lang='ko-KR';u.rate=P.rate;var v=vo();if(v)u.voice=v;return u}
function say(t,cb){if(!syn){if(cb)cb();return}try{syn.cancel();var u=mk(t);if(cb){u.onend=cb;u.onerror=cb}syn.speak(u)}catch(e){if(cb)cb()}}
function sayq(a,b){if(!syn)return;try{syn.cancel();[a,b].forEach(function(t){syn.speak(mk(t))})}catch(e){}}
var RT=[[.6,'0.6×'],[.75,'0.75×'],[.85,'0.85×'],[1,'1×'],[1.2,'1.2×']];
var SI={play:['M7 4.5v15l12-7.5z'],pause:['M8 5v14M16 5v14'],prev:['M19 20 9 12l10-8z','M5 19V5'],next:['M5 4l10 8-10 8z','M19 5v14'],stop:['M6 6h12v12H6z'],x:['M18 6 6 18M6 6l12 12'],edit:['M12 20h9','M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z'],trash:['M3 6h18','M8 6V4h8v2','M19 6l-1 14H6L5 6','M10 11v6M14 11v6'],reset:['M3 12a9 9 0 1 0 3-6.7L3 8','M3 3v5h5'],mic:['M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z','M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8'],users:['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z','M23 21v-2a4 4 0 0 0-3-3.9','M16 3.1a4 4 0 0 1 0 7.8'],minus:['M5 12h14'],plus:['M12 5v14M5 12h14'],check:['M20 6 9 17l-5-5'],undo:['M3 7v6h6','M21 17a9 9 0 0 0-15-6.7L3 13'],up:['M12 19V5','M5 12l7-7 7 7'],down:['M12 5v14','M19 12l-7 7-7-7'],file:['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M8 13h8M8 17h8'],book:['M4 19.5A2.5 2.5 0 0 1 6.5 17H20','M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],chevd:['M6 9l6 6 6-6'],chevr:['M9 6l6 6-6 6']};
function si(n,z){return'<svg class="vi" viewBox="0 0 24 24" width="'+(z||18)+'" height="'+(z||18)+'" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+SI[n].map(function(d){return'<path d="'+d+'"/>'}).join('')+'</svg>'}
var D=null,DT=0,DK=0;
window.skSI=si;
function dstop(){DK++;clearTimeout(DT);stopRec();if(syn)try{syn.cancel()}catch(e){}}
function dwait(k,ms,f){clearTimeout(DT);DT=setTimeout(function(){if(k==DK)f()},ms)}
function dsay(k,t,f){if(!syn){dwait(k,1800,f);return}say(t,function(){if(k==DK)f()})}
function hl(){var a=document.querySelectorAll('.ql .bb.act');for(var n=0;n<a.length;n++)a[n].classList.remove('act','me','ok','bad');if(!D||D.done||D.cur<0)return;var row=document.querySelector('.ql[data-gi="'+D.i+'"]');if(!row)return;var t=row.querySelectorAll('.bb')[D.cur];if(!t)return;t.classList.add('act');if(D.me)t.classList.add('me');else if(D.res!=null&&D.cur==(D.role=='a'?1:0))t.classList.add(D.res?'ok':'bad');if(D.sc){D.sc=0;try{t.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}}}
function dbar(){if(D.done)return'<div class="dst"><b>'+si('check',18)+' Done</b><span>'+D.q.length+' dialogues</span></div><div class="vrow"><button class="vbtn" data-sk="dagain">Again</button><button class="vbtn alt" data-sk="dexit">Close</button></div>';
var st=D.me?si('mic',16)+' '+(SR?'Speak now':'Your turn')+' · '+D.cd+'s':D.pause?si('pause',16)+' Paused':D.cur==0?'가 is asking…':'나 is answering…';
return'<div class="dst"><b>'+st+'</b><span>'+(D.i+1)+' / '+D.q.length+'</span></div>'+(D.tx?'<div class="dtx kr">'+esc(D.tx)+'</div>':'')+(D.res!=null&&!D.me?'<div class="'+(D.res?'ok':'bad')+'">'+(D.res?'✓ Good!':'✗ '+esc(D.msg||'Not quite. Try again next time.'))+'</div>':'')+'<div class="vrow dbt"><button class="vbtn alt" data-sk="dprev" aria-label="Previous">'+si('prev')+'</button>'+'<button class="vbtn" data-sk="dpp" aria-label="Pause">'+(D.pause?si('play'):si('pause'))+'</button><button class="vbtn alt" data-sk="dnext" aria-label="Next">'+si('next')+'</button><button class="vbtn alt" data-sk="spd" data-v="-1" aria-label="Slower">'+si('minus')+'</button><span class="dsp">'+P.rate+'×</span><button class="vbtn alt" data-sk="spd" data-v="1" aria-label="Faster">'+si('plus')+'</button><button class="vbtn alt" data-sk="dexit" aria-label="Close">'+si('x')+'</button></div>'}
function dr(){var b=document.getElementById('dbar');if(!b||!D)return;b.innerHTML=dbar();hl()}
function drun(){var k=++DK;clearTimeout(DT);var q=D.q[D.i];if(!q){D.done=1;D.cur=-1;D.me=0;dr();return}D.me=0;D.cd=0;D.tx='';D.res=null;D.pause=0;D.ec=0;
var nq=function(){D.i++;drun()},na=function(){D.cur=1;D.me=0;D.sc=1;dr();dsay(k,q[3],function(){dwait(k,500,nq)})},ga=function(nx){D.cur=0;D.me=0;D.sc=1;dr();dsay(k,q[1],nx)},w=function(f){return function(){dwait(k,300,f)}};
if(D.role=='n')ga(w(na));else if(D.role=='a')ga(function(){listen(k,function(){dwait(k,600,nq)})});else listen(k,function(){dwait(k,250,function(){na()})})}
function listen(k,f){var lim=Math.max(P.pz,8),done=0,r=null,fatal='',rs=0;D.cur=D.role=='a'?1:0;D.me=1;D.err=0;D.msg='';D.sc=1;D.tx='';D.res=null;
var chk=function(t){var q=D.q[D.i];return D.role=='a'?check(t,q):checkQ(t,q)};
var fin=function(){if(done||k!=DK)return;done=1;clearTimeout(DT);stopRec();D.me=0;D.cd=0;D.fin=null;var t=D.tx.trim();if(!SR){D.res=null;dr();f();return}
if(fatal){D.res=false;D.msg=fatal;D.pause=1;dr();return}
var m=t?chk(t):'No answer heard. Try again.';
if(t&&!m){D.ec=0;D.res=true;dr();f();return}
D.ec=(D.ec||0)+1;D.res=false;D.msg=m;
if(D.ec>=3){D.msg=m+' Tap Play to retry or Next to skip.';D.pause=1;dr();return}
dr();dwait(k,900,function(){listen(k,f)})};
D.fin=fin;
var tick=function(n){D.cd=n;dr();if(n<=0){if(r)try{r.stop()}catch(e){}dwait(k,1500,fin);return}dwait(k,1000,function(){tick(n-1)})};
if(SR){try{r=new SR();r.lang='ko-KR';r.continuous=false;r.interimResults=true;r.maxAlternatives=5;
r.onresult=function(ev){if(done)return;var res=ev.results[ev.results.length-1],alts=[];for(var i=0;i<res.length;i++)alts.push((res[i].transcript||'').trim());var t=alts[0]||'';D.tx=t;
if(res.isFinal){var hit=alts.filter(function(x){return x&&!chk(x)})[0];if(hit){D.tx=hit;fin()}else dr()}
else{if(t&&!chk(t))fin();else dr()}};
r.onend=function(){if(done||k!=DK)return;if(D.cd>0&&!fatal&&++rs<=8){setTimeout(function(){if(!done&&k==DK&&D.cd>0&&!fatal){try{r.start()}catch(e){fin()}}},250)}else fin()};
r.onerror=function(ev){var e=ev&&ev.error;if(e=='no-speech'||e=='aborted')return;
fatal=(e=='not-allowed'||e=='service-not-allowed')?'Mic blocked. Allow the microphone (needs https or localhost), then tap Play.':e=='audio-capture'?'No microphone found, or another app is using it.':e=='network'?'No internet. Speech recognition needs a connection.':e=='language-not-supported'?'Korean speech is not supported in this browser.':'Mic error ('+e+'). Tap Play to retry.';D.err=1;fin()};
REC=r;r.start()}catch(e){r=null}}
tick(lim)}
function dstart(role){aclr();S=null;dstop();D={q:ALL(),i:0,role:role,cur:-1,me:0,cd:0,tx:'',res:null,pause:0,done:0,sc:0};rr();drun()}
var SO=false;
function setBox(){return'<div class="vp"><button class="vsh" data-sk="tog" aria-expanded="'+SO+'"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M20 18h0"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/></svg><span class="vsl"><b>Settings</b><small id="sksum">Auto-next: '+(P.auto?'ON':'OFF')+'</small></span><span class="vc'+(SO?' up':'')+'"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></span></button>'+(SO?'<div class="vgrp"><label class="vsw"><span>Auto-next</span><input type="checkbox" data-sk="autosw"'+(P.auto?' checked':'')+'><i></i></label></div><div class="vgrp"><div class="vlb" style="margin:0 0 4px">Max time to answer</div>'+seg('pz',[[8,'8s'],[12,'12s'],[20,'20s'],[30,'30s']],P.pz,'c4')+'</div>':'')+'</div>'}
function opts(full){var h='<div class="vlb" style="margin-top:12px">🔊 Voice speed</div>'+seg('rate',RT,P.rate,'c5');if(full){var vs=[];try{vs=syn.getVoices().filter(function(x){return /^ko/i.test(x.lang)})}catch(e){}h+='<div class="vlb" style="margin-top:12px">Voice</div><select class="vin" data-sk="voice"><option value="">Auto (Korean)</option>'+vs.map(function(v){return'<option value="'+esc(v.name)+'"'+(v.name==P.voice?' selected':'')+'>'+esc(v.name)+'</option>'}).join('')+'</select>'+(syn&&!vs.length?'<div class="vhint">No Korean voice found yet. Install one in your phone settings (Text-to-speech).</div>':'')+'<button class="vsp" data-sk="tv">🔊 Test voice</button>'}return h+'<div class="vlb" style="margin-top:12px">Auto next</div>'+seg('auto',[[1,'ON · next after answer'],[0,'OFF']],P.auto,'c2')}
function aclr(){clearTimeout(AT);AT=0;AK++}
function auto(){if(!P.auto||!S||!S.res)return;var k=++AK,go=function(ms){clearTimeout(AT);AT=setTimeout(function(){if(k==AK&&S&&S.res&&tab==9)nxt()},ms)};if(S.ph=='q')say(S.q[S.i][3],function(){go(1500)});else go(3000)}
function keep(){var i0=document.getElementById('skin'),v0=i0?i0.value:'';rr();var i1=document.getElementById('skin');if(i1&&v0)i1.value=v0}
function nxt(){stopRec();S.en=0;S.res=null;if(S.ph=='a'){S.ph='q';rr()}else{S.ph='a';S.i++;if(S.i>=S.q.length){var t=S.q.length*2,pc=Math.round(S.sc/t*100);if(pc>P.best){P.best=pc;sv()}rr()}else{rr();say(S.q[S.i][1])}}}
function stopRec(){if(REC){try{REC.abort()}catch(e){}REC=null}}
function check(a,q){var t=a.trim().replace(/[\s.!?~\u2026]+$/,''),n=t.replace(/\s+/g,'');if(!/[\uac00-\ud7a3]/.test(t))return'Write your answer in Hangul (\ud55c\uae00).';if((n.match(/[\uac00-\ud7a3]/g)||[]).length<2)return'Too short. Say a full sentence.';if(!/[\uc694\ub2e4\uc8e0]$/.test(t))return'End with a polite ending (\u2026\uc694 or \u2026\uc2b5\ub2c8\ub2e4).';if(q[5]){var ok=1;try{var re=new RegExp(q[5]);ok=re.test(t)||re.test(n)}catch(e){}if(!ok)return'Use a word like: '+q[5].split('|')[0]}return''}
function seg(id,arr,cur,cls){return'<div class="vmo '+(cls||'')+'">'+arr.map(function(x){return'<button class="vmc'+(x[0]==cur?' on':'')+'" data-sk="'+id+'" data-v="'+x[0]+'">'+x[1]+'</button>'}).join('')+'</div>'}
function row(x,gi,own){var oi=gi-BASE.length;return'<div class="ql" data-gi="'+gi+'"><div class="qh">'+(gi<BASE.length?DGH:'')+'<button class="ib" data-sk="play" data-v="'+gi+'" aria-label="Play">'+si('play')+'</button>'+(gi<BASE.length?'<button class="ib" data-sk="editb" data-v="'+gi+'" aria-label="Edit">'+si('edit')+'</button>'+(ED[gi]?'<button class="ib" data-sk="resetb" data-v="'+gi+'" aria-label="Reset">'+si('reset')+'</button>':''):own?'<button class="ib" data-sk="edit" data-v="'+oi+'" aria-label="Edit">'+si('edit')+'</button><button class="ib" data-sk="del" data-v="'+oi+'" aria-label="Delete">'+si('trash')+'</button>':'')+'</div>'+bub('가',x[1],x[2],0)+bub('나',x[3],x[4],0)+'</div>'}
function form(){var m=EB!==null?(function(x){return{k:x[1],e:x[2],a:x[3],ae:x[4],kw:x[5]}})(B2()[EB]):EI>=0?MY[EI]:{k:'',e:'',a:'',ae:'',kw:''};function f(id,v,ph){return'<input id="'+id+'" class="vin" autocomplete="off" spellcheck="false" value="'+esc(v||'')+'" placeholder="'+ph+'">'}return'<div class="vp fm"><div class="vlb">'+(EI>=0||EB!==null?'Edit Q&A':'New Q&A')+'</div><div class="vlb">가 asks (Korean)</div>'+f('fk',m.k,'이름이 뭐예요?')+f('fe',m.e,'English (auto-fills when you type Korean)')+'<div class="vlb">나 answers (Korean)</div>'+f('fa',m.a,'제 이름은 마리아예요.')+f('fae',m.ae,'English (auto-fills when you type Korean)')+'<div class="vlb">Key word to check (optional)</div>'+f('fw',m.kw,'e.g. 이름 or 시|살')+'<div class="vrow"><button class="vbtn" data-sk="save">Save</button><button class="vbtn alt" data-sk="cancel">Cancel</button></div></div>'}
function home(){var all=ALL(),av=all.filter(function(x){return P.cat=='b'||x[0]==P.cat}).length;P.cat='b';var h=EI!==null||EB!==null?form():'';
h+='<details class="sghow"><summary>How to use this tab</summary><ol><li><span>It works like a self-introduction dialogue with two speakers: <b>가</b> asks and <b>나</b> answers.</span></li><li><span><b>Round 1:</b> you are <b>나</b>. Answer 가 in Korean (type or 🎤), then tap <b>Check</b>.</span></li><li><span><b>Round 2:</b> roles switch. You are <b>가</b> and you ask. 나 answers you.</span></li><li><span>Tap <b>+ Add Q&A</b> to add your own question and answer. Tap the pencil to edit or the trash icon to delete.</span></li><li><span><b>Play:</b> reads the whole Built-in script. A color light moves down the list: 가 asks, then 나 answers. <b>Role play:</b> you take 나 or 가. Only the other speaker talks. When it is your turn the light turns red and the mic turns on by itself to listen to you and check your line. Read the line in the list and say it. Tap Done to finish early.</span></li></ol></details>';
h+=setBox();
h+='<div class="vp"><div class="vlb">Dialogue</div><button class="vbtn" data-sk="dplay" style="width:100%">'+si('play')+' Play (listen)</button><div class="vlb" style="margin-top:12px">Role play</div>'+seg('drole',[['a',si('users')+' I am 나'],['g',si('users')+' I am 가']],'','c2')+'</div>';
h+='<div class="vp"><div class="vlb">Q&A list</div><button class="vbtn alt" data-sk="add" style="width:100%;margin-top:12px">+ Add Q&A</button><details id="skbi" class="sghow" style="margin-top:12px"'+(D||BO?' open':'')+'><summary>Built-in questions ('+BASE.length+')</summary><div class="vhint">Touch and hold a box, then drag it to move. You can also drag ⋮⋮ right away.'+(ORD.some(function(v,i){return v!=i})?' <button class="vhint" data-sk="ordreset" style="background:none;border:0;text-decoration:underline;cursor:pointer">Reset order</button>':'')+'</div>'+B2().map(function(x,i){return row(x,i,0)}).join('')+'</details>'+(MY.length?'<div class="vlb" style="margin-top:12px">My Q&A</div>'+MY.map(function(m,i){return row(all[BASE.length+i],BASE.length+i,1)}).join(''):'<div class="vhint">Your own Q&A will show here.</div>')+'</div>';
if(D)h+='<div id="dbar" class="vp dbar">'+dbar()+'</div>';
return h}

function qk(q){var w=q[1].split(' ')[0].replace(/[이가은는을를에]$/,'');return w}
function checkQ(t,q){t=t.trim().replace(/[\s.!?~\u2026]+$/,'');if(!/[\uac00-\ud7a3]/.test(t))return'Write your question in Hangul (\ud55c\uae00).';if(!/[\uc694\uae4c\uc8e0]$/.test(t))return'End the question with \u2026\uc694? or \u2026\uae4c?';var k=qk(q);if(k&&t.indexOf(k)<0&&t.replace(/\s+/g,'').indexOf(k.replace(/\s+/g,''))<0)return'Use the key word: '+k;return''}
function bub(role,text,en,me){var L=role=='가';return'<div class="bb'+(L?'':' r')+'"><span class="rl'+(me?' me':'')+'">'+role+'</span><div class="bw"><div class="bt kr">'+esc(text)+'</div>'+(en?'<div class="be">'+esc(en)+'</div>':'')+(me?'<small class="yu">YOU</small>':'')+'</div></div>'}
function qcard(){var q=S.q[S.i],r=S.res,A=S.ph=='a',h='<div class="vp vcd vq"><div class="vhd"><span class="vch">'+(A?'You are 나 · answer':'You are 가 · ask')+'</span><span class="vn">'+(S.i+1)+' / '+S.q.length+'</span><button class="vhint" data-sk="home" style="background:none;border:0;cursor:pointer">✕ End</button></div><div class="dlg">';
if(A){h+=bub('가',q[1],S.en||r?q[2]:'',0);if(r)h+=bub('나',r.a,'',1)}
else{h+='<div class="vhint">Ask 나 this: <b>'+esc(q[2])+'</b></div>';if(S.en||r)h+=bub('가',r?r.a:q[1],'',1);if(r)h+=bub('나',q[3],q[4],0)}
h+='</div>'+opts(0);
if(!r){h+='<div class="vtp"><input id="skin" class="vin" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="'+(A?'Answer as 나 in Korean':'Ask as 가 in Korean')+'"><button class="vbtn" data-sk="check">Check</button></div>'+(SR?'<button class="vsp" data-sk="mic" id="skmic">🎤 Speak</button>':'')+(A?'<button class="vsp" data-sk="say">🔊 Hear 가 again</button>':'')+'<div><button class="vhint" data-sk="en" style="background:none;border:0;text-decoration:underline;cursor:pointer">'+(A?'Show English':'Show hint')+'</button></div><div class="vhint" id="skerr" style="color:var(--seal)"></div>'}
else{h+='<div class="vans"><div class="'+(r.m?'bad':'ok')+'">'+(r.m?'✗ '+esc(r.m):'✓ Good!')+'</div>'+(A?'<b>Model answer</b><span class="kr">'+esc(q[3])+'</span><div style="font:14px var(--sans);color:var(--mute)">'+esc(q[4])+'</div>':'<b>Model question</b><span class="kr">'+esc(q[1])+'</span>')+'</div><div class="vrow">'+(A?'':'<button class="vsp" data-sk="say2">🔊 나</button>')+'<button class="vbtn" data-sk="next">'+(A?'Switch roles →':(S.i+1>=S.q.length?'Finish':'Next'))+'</button></div>'}
return h+'</div>'}
function sum(){var t=S.q.length*2;return'<div class="vp vsum"><div class="vbig">'+S.sc+' / '+t+'</div><p>'+Math.round(S.sc/t*100)+'% correct (answering and asking)</p><div class="vrow"><button class="vbtn" data-sk="again">Again</button><button class="vbtn alt" data-sk="home">Change topic</button></div></div>'}
function rr(){var l=document.getElementById('list');if(l&&tab==9)l.innerHTML=window.skillList();if(D)hl();var i=document.getElementById('skin');if(i)try{i.focus({preventScroll:true})}catch(e){}}
window.skillList=function(){return'<div class="sk'+(D?' dp':'')+'">'+(!S?home():S.i>=S.q.length?sum():qcard())+'</div>'};
window.skillStop=function(){aclr();if(D){D.pause=1;dstop()}stopRec();if(syn)try{syn.cancel()}catch(e){}};
function start(){var p=ALL().filter(function(x){return P.cat=='b'||x[0]==P.cat});if(!p.length){if(window.toast)toast('Add a Q&A first.',2000);return}for(var z=p.length-1;z>0;z--){var r=Math.floor(Math.random()*(z+1)),t=p[z];p[z]=p[r];p[r]=t}S={q:p.slice(0,P.n),i:0,ph:'a',sc:0,res:null,en:0};rr();say(S.q[0][1])}
function grade(){var i=document.getElementById('skin'),a=i?i.value:'';if(!a.trim()){var e=document.getElementById('skerr');if(e)e.textContent='Type or say it first.';return}var q=S.q[S.i],m=S.ph=='a'?check(a,q):checkQ(a,q);if(!m)S.sc++;S.res={a:a.trim(),m:m};rr();if(P.auto)auto();else if(S.ph=='q')say(q[3])}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-sk]');if(!b||tab!=9)return;var a=b.dataset.sk,v=b.dataset.v;if(a=='next'||a=='home'||a=='again'||a=='start')aclr();
if(a=='cat'){P.cat=v;sv();rr()}else if(a=='n'){P.n=+v;sv();rr()}else if(a=='start')start();
else if(a=='say')say(S.q[S.i][1]);else if(a=='say2')say(S.q[S.i][3]);else if(a=='en'){var v0=(document.getElementById('skin')||{}).value;S.en=1;rr();var i=document.getElementById('skin');if(i&&v0)i.value=v0}
else if(a=='rate'){P.rate=+v;sv();keep();if(!S&&!D)say('안녕하세요')}
else if(a=='auto'){P.auto=+v;sv();aclr();keep();if(P.auto)auto()}
else if(a=='tog'){SO=!SO;rr()}
else if(a=='ddone'){if(D&&D.fin)D.fin()}
else if(a=='dplay')dstart('n');
else if(a=='drole')dstart(v);
else if(a=='dpp'){if(D.pause){D.pause=0;drun()}else{D.pause=1;dstop();dr()}}
else if(a=='spd'){var ix=0;RT.forEach(function(x,n){if(x[0]==P.rate)ix=n});ix=Math.max(0,Math.min(RT.length-1,ix+(+v)));P.rate=RT[ix][0];sv();if(D)dr()}
else if(a=='dprev'||a=='dnext'){D.i=a=='dnext'?D.i+1:Math.max(0,D.i-1);D.pause=0;drun()}
else if(a=='dagain')dstart(D.role);
else if(a=='dexit'){dstop();D=null;rr()}
else if(a=='pz'){P.pz=+v;sv();rr()}
else if(a=='tv')say('안녕하세요. 저는 마리아입니다.')
else if(a=='editb'){EB=+v;rr();window.scrollTo(0,0)}
else if(a=='resetb'){delete ED[+v];svEd();rr()}
else if(a=='check')grade();
else if(a=='next')nxt();
else if(a=='again')start();else if(a=='home'){stopRec();S=null;rr()}
else if(a=='play'){var x=ALL()[+v];if(x)sayq(x[1],x[3])}
else if(a=='add'){EI=-1;rr();window.scrollTo(0,0)}
else if(a=='edit'){EI=+v;rr();window.scrollTo(0,0)}
else if(a=='cancel'){EI=null;EB=null;rr()}
else if(a=='del'){if(confirm('Delete this Q&A?')){MY.splice(+v,1);svMy();rr()}}
else if(a=='save'){var g=function(i){var e=document.getElementById(i);return e?e.value.trim():''},o={k:g('fk'),e:g('fe'),a:g('fa'),ae:g('fae'),kw:g('fw')};if(!o.k||!o.a){if(window.toast)toast('Write the question and the answer in Korean.',2200);return}if(EB!==null){ED[EB]=o;EB=null;svEd();rr();return}if(EI>=0)MY[EI]=o;else MY.push(o);EI=null;svMy();rr()}
else if(a=='mic'){if(REC){REC._x=1;stopRec();b.textContent='🎤 Speak';return}try{var r=new SR(),base='',idle=0,go=function(){clearTimeout(idle);idle=setTimeout(function(){r._x=1;try{r.stop()}catch(e){}},15000)};r.lang='ko-KR';r.continuous=true;r.interimResults=true;r.onresult=function(ev){var i=document.getElementById('skin'),t='';for(var n=0;n<ev.results.length;n++)t+=ev.results[n][0].transcript;if(i)i.value=base+t;go()};r.onend=function(){if(REC===r&&!r._x){var i=document.getElementById('skin');base=i&&i.value?i.value+' ':'';setTimeout(function(){if(REC===r&&!r._x){try{r.start()}catch(e){}}},150);return}clearTimeout(idle);if(REC===r)REC=null;b.textContent='🎤 Speak'};r.onerror=function(e){if(e.error=='not-allowed'||e.error=='service-not-allowed')r._x=1};REC=r;b.textContent='🎤 Listening…';go();r.start()}catch(x){REC=null;b.textContent='🎤 Speak'}}
});
var BO=false,BASE0=BASE.slice(),ORD=BASE0.map(function(_,i){return i}),DGH='<button class="ib dgh" data-dg="1" type="button" aria-label="Drag to move"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg></button>';
try{var o2=JSON.parse(localStorage.getItem('eps-skill-ord-v1')||'null');if(Array.isArray(o2)&&o2.length==BASE0.length&&o2.slice().sort(function(a,b){return a-b}).every(function(v,i){return v==i})){ORD=o2;BASE=ORD.map(function(i){return BASE0[i]})}}catch(e){}
function svOrd(){try{localStorage.setItem('eps-skill-ord-v1',JSON.stringify(ORD))}catch(e){}}
function mvB(f,t){if(f==t)return;BASE.splice(t,0,BASE.splice(f,1)[0]);ORD.splice(t,0,ORD.splice(f,1)[0]);var ne={};Object.keys(ED).forEach(function(k){k=+k;var n=k;if(k==f)n=t;else if(f<t&&k>f&&k<=t)n=k-1;else if(f>t&&k>=t&&k<f)n=k+1;ne[n]=ED[k]});ED=ne;svEd();svOrd()}
(function(){var st=document.createElement('style');st.textContent='#skbi .ql{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}.dgh{touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none}.ql.dgo{transition:transform .15s}.ql.dgg{position:relative;z-index:5;transition:none;box-shadow:0 6px 18px rgba(0,0,0,.25);opacity:.96}';document.head.appendChild(st)})();
document.addEventListener('toggle',function(e){var t=e.target;if(t&&t.id=='skbi')BO=t.open},true);
function dragStart(row,e){var rows=[].slice.call(row.parentNode.querySelectorAll('.ql[data-gi]')),from=rows.indexOf(row);if(from<0)return;var sy=window.scrollY,rc=rows.map(function(r){var b=r.getBoundingClientRect();return{t:b.top+sy,h:b.height}}),gap=rc.length>1?Math.max(0,rc[1].t-rc[0].t-rc[0].h):0,y0=e.clientY+sy,cy=e.clientY,to=from,raf=0,done=0;
row.classList.add('dgg');rows.forEach(function(r,i){if(i!=from)r.classList.add('dgo')});
function upd(){var dy=cy+window.scrollY-y0;row.style.transform='translateY('+dy+'px)';var c=rc[from].t+rc[from].h/2+dy;to=0;rows.forEach(function(r,i){if(i!=from&&rc[i].t+rc[i].h/2<c)to++});var sh=rc[from].h+gap;rows.forEach(function(r,i){if(i==from)return;var m=0;if(from<to&&i>from&&i<=to)m=-sh;else if(from>to&&i>=to&&i<from)m=sh;r.style.transform=m?'translateY('+m+'px)':''})}
function loop(){if(done)return;if(cy<90)window.scrollBy(0,-14);else if(cy>window.innerHeight-90)window.scrollBy(0,14);upd();raf=requestAnimationFrame(loop)}
function tm(ev){ev.preventDefault()}
function fin(ok){if(done)return;done=1;cancelAnimationFrame(raf);document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',cn);document.removeEventListener('touchmove',tm,{passive:false});rows.forEach(function(r){r.classList.remove('dgg','dgo');r.style.transform=''});if(ok&&to!=from){mvB(from,to);BO=true;rr()}}
function mv(ev){cy=ev.clientY;upd()}function up(){fin(1)}function cn(){fin(0)}
document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up);document.addEventListener('pointercancel',cn);document.addEventListener('touchmove',tm,{passive:false});loop()}
document.addEventListener('pointerdown',function(e){if(tab!=9||D||e.button>0)return;var t=e.target;if(!t.closest)return;var row=t.closest('#skbi .ql[data-gi]');if(!row)return;
if(t.closest('[data-dg]')){e.preventDefault();dragStart(row,e);return}
if(t.closest('button,a,input,select,textarea,summary'))return;
var x0=e.clientX,y0=e.clientY,ly=y0,touch=e.pointerType!='mouse',tmr=0,pid=e.pointerId;
function cancel(){clearTimeout(tmr);document.removeEventListener('pointermove',pm);document.removeEventListener('pointerup',cancel);document.removeEventListener('pointercancel',cancel)}
function pm(ev){if(ev.pointerId!=pid)return;ly=ev.clientY;if(Math.abs(ev.clientX-x0)+Math.abs(ev.clientY-y0)>(touch?10:5)){cancel();if(!touch)dragStart(row,ev)}}
document.addEventListener('pointermove',pm);document.addEventListener('pointerup',cancel);document.addEventListener('pointercancel',cancel);
if(touch)tmr=setTimeout(function(){cancel();try{if(navigator.vibrate)navigator.vibrate(15)}catch(x){}dragStart(row,{clientY:ly})},280)});
document.addEventListener('contextmenu',function(e){if(tab==9&&e.target.closest&&e.target.closest('#skbi .ql'))e.preventDefault()});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-sk="ordreset"]');if(!b||tab!=9)return;if(!confirm('Reset to the original order?'))return;var ne={};Object.keys(ED).forEach(function(k){ne[ORD[+k]]=ED[k]});ED=ne;BASE=BASE0.slice();ORD=BASE0.map(function(_,i){return i});svEd();svOrd();rr()});
function skNorm(t){return String(t||'').replace(/[\s.,!?~。？！]/g,'')}function skMean(k,cb){var n=skNorm(k),r='';try{ALL().some(function(x){if(skNorm(x[1])==n&&x[2]){r=x[2];return 1}if(skNorm(x[3])==n&&x[4]){r=x[4];return 1}})}catch(e){}if(r){cb(r);return}window.__mean(k,cb)}
var skT={};document.addEventListener('input',function(e){var t=e.target,id=t&&t.id;if(tab!=9||(id!='fk'&&id!='fa'))return;var eid=id=='fk'?'fe':'fae',ei=document.getElementById(eid);if(!ei)return;if(!ei.value.trim())delete ei.dataset.a;else if(!ei.dataset.a)ei.dataset.a='0';clearTimeout(skT[id]);var k=t.value.trim();if(!k){if(ei.dataset.a==='1')ei.value='';return}skT[id]=setTimeout(function(){if(ei.dataset.a==='0')return;skMean(k,function(r){var e2=document.getElementById(eid),k2=document.getElementById(id);if(!r||!e2||!k2||k2.value.trim()!==k)return;if(e2.dataset.a==='0')return;e2.value=r;e2.dataset.a='1'})},700)});
document.addEventListener('input',function(e){var t=e.target;if(tab==9&&t&&(t.id=='fe'||t.id=='fae')&&t.dataset.a==='1')t.dataset.a='0'});
document.addEventListener('keydown',function(e){if(e.key=='Enter'&&e.target&&e.target.id=='skin'&&tab==9&&S&&!S.res){e.preventDefault();grade()}});
document.addEventListener('change',function(e){var t=e.target;if(t&&t.dataset&&t.dataset.sk=='autosw'&&tab==9){P.auto=t.checked?1:0;sv();aclr();if(P.auto)auto();var sm=document.getElementById('sksum');if(sm)sm.textContent='Auto-next: '+(P.auto?'ON':'OFF')}
if(t&&t.dataset&&t.dataset.sk=='voice'&&tab==9){P.voice=t.value;sv();say('안녕하세요. 저는 마리아입니다.')}});
document.addEventListener('keydown',function(e){if(e.key=='Enter'&&tab==9&&S&&S.res&&S.i<S.q.length&&e.target.tagName!='BUTTON'){aclr();nxt()}});
if(syn&&syn.addEventListener)syn.addEventListener('voiceschanged',function(){if(tab==9&&!S&&EI===null&&EB===null)rr()});
})();

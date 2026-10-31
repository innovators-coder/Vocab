(function(){
var b=document.getElementById('burger'),l=document.getElementById('links');
function tog(o){l.classList.toggle('open',o);b.setAttribute('aria-expanded',o)}
b.addEventListener('click',function(){tog(!l.classList.contains('open'))});
l.addEventListener('click',function(e){if(e.target.closest('a'))tog(false)});
var f=document.getElementById('form'),fb=document.getElementById('fb'),last=0;
f.addEventListener('submit',function(e){e.preventDefault();
  if(document.getElementById('hp').value)return;
  if(Date.now()-last<30000){fb.textContent='Please wait a moment before sending again.';return}
  var d=new FormData();['name','email','message'].forEach(function(k){d.append(k,f.elements[k].value.trim())});
  fb.textContent='Sending…';
  fetch(f.action,{method:'POST',body:d,mode:'no-cors'}).then(function(){last=Date.now();f.reset();fb.textContent='Message sent! We will get back to you soon.'})
  .catch(function(){fb.textContent='Could not send. Please try again later.'});
});
})();

// van intro: drives right and pulls the page open behind it
(function(){
  const intro=document.getElementById('intro'), van=document.getElementById('intro-van');
  if(!intro) return;
  const kill=()=>{intro.remove(); if(van) van.remove();};
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){kill();return;}
  const root=document.documentElement;
  root.classList.add('intro-on');
  let gone=false;
  const done=()=>{if(gone)return;gone=true;kill();root.classList.remove('intro-on');};
  intro.addEventListener('animationend',e=>{if(e.animationName==='curtain')done();});
  setTimeout(done,3300);
})();

// quote blocks: one template, cloned into every page that needs it
(function(){
  const tpl=document.getElementById('quote-block');
  if(!tpl) return;
  document.querySelectorAll('.quote-slot').forEach(slot=>slot.appendChild(tpl.content.cloneNode(true)));
  const PHONE='353858191847', MAIL='info@pentiumlogistics.ie';
  const FIELDS=[['Name','name'],['Phone','phone'],['Collection','from'],['Delivery','to'],['Pallets / items','qty'],['Dimensions','dims'],['Weight','weight'],['Collection date','date'],['Tail lift','taillift'],['Moffett','moffett'],['Notes','notes']];
  function message(form){
    const val=n=>{const el=form.elements[n];return el&&el.value?el.value.trim():'';};
    const lines=FIELDS.map(([label,n])=>val(n)?label+': '+val(n):'').filter(Boolean);
    const photo=form.elements['photo'];
    if(photo&&photo.files&&photo.files.length) lines.push('Photo: '+photo.files[0].name+' (attaching separately)');
    return 'Transport quote request\n\n'+(lines.length?lines.join('\n'):'(no details filled in)');
  }
  document.querySelectorAll('.qform2').forEach(form=>{
    const err=form.querySelector('.qerr'), done=form.querySelector('.qdone');
    const fail=(msg,el)=>{
      err.textContent=msg; err.hidden=false;
      if(el){el.closest('label').classList.add('field-bad'); el.focus();}
      return false;
    };
    const check=()=>{
      err.hidden=true;
      form.querySelectorAll('.field-bad').forEach(l=>l.classList.remove('field-bad'));
      const phone=form.elements['phone'], from=form.elements['from'];
      const digits=(phone.value.match(/\d/g)||[]).length;
      if(!phone.value.trim()) return fail('We need a phone number to come back to you on.',phone);
      if(digits<7) return fail('That phone number looks too short — check it and try again.',phone);
      if(!from.value.trim()) return fail('Where is it being collected from? A town or Eircode is enough.',from);
      return true;
    };
    const send=how=>{
      if(!check()) return;
      const text=message(form);
      if(how==='wa') window.open('https://wa.me/'+PHONE+'?text='+encodeURIComponent(text),'_blank','noopener');
      else window.location.href='mailto:'+MAIL+'?subject='+encodeURIComponent('Transport quote request')+'&body='+encodeURIComponent(text);
      if(done) done.hidden=false;
    };
    form.querySelectorAll('[data-send]').forEach(el=>{
      el.addEventListener('click',e=>{e.preventDefault();send(el.dataset.send);});
    });
    form.addEventListener('input',e=>{
      const l=e.target.closest('label'); if(l) l.classList.remove('field-bad');
    });
  });
})();

// mobile menu
const b=document.querySelector('.burger'),m=document.querySelector('.nav-links');
if(b){b.addEventListener('click',()=>{const o=m.classList.toggle('open');b.setAttribute('aria-expanded',o);});}

// expandable service areas
document.querySelectorAll('.area').forEach(card=>{
  const btn=card.querySelector('.area-btn'), panel=card.querySelector('.area-panel');
  if(!btn||!panel) return;              // static cards (FAQ) reuse this markup without a control
  const toggle=()=>{const open=card.classList.toggle('open');btn.setAttribute('aria-expanded',open);};
  btn.addEventListener('click',e=>{e.stopPropagation();toggle();});
  card.addEventListener('click',e=>{
    if(panel.contains(e.target)||e.target.closest('a')) return;
    toggle();
  });
});

// reveal on scroll + mark the current page in the nav
function reveal(scope){
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.12});
  scope.querySelectorAll('.rv:not(.in)').forEach(el=>io.observe(el));
}
reveal(document);

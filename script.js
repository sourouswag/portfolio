// script.js — interactions pour le portfolio (tilt photo, reveal on scroll, tags, FAB)
(function(){
  'use strict'

  /* Photo tilt effect */
  const photo = document.querySelector('.photo');
  if(photo){
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const onMove = (e)=>{
      const rect = photo.getBoundingClientRect();
      const clientX = (e.clientX !== undefined) ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX);
      const clientY = (e.clientY !== undefined) ? e.clientY : (e.touches && e.touches[0] && e.touches[0].clientY);
      if(clientX == null || clientY == null) return;
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      const rx = (y - 0.5) * 10; // rotation x
      const ry = (x - 0.5) * -10; // rotation y
      photo.style.transform = `perspective(900px) rotateX(${clamp(rx,-12,12)}deg) rotateY(${clamp(ry,-12,12)}deg) scale(1.03)`;
      photo.style.boxShadow = '0 26px 60px rgba(59,39,32,0.12)';
    }
    const onLeave = ()=>{ photo.style.transform='none'; photo.style.boxShadow='var(--glass-shadow)'; }
    photo.addEventListener('mousemove', onMove);
    photo.addEventListener('touchmove', onMove, {passive:true});
    photo.addEventListener('mouseleave', onLeave);
    photo.addEventListener('touchend', onLeave);
  }

  /* Reveal on scroll */
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  if('IntersectionObserver' in window && reveals.length){
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(en => { if(en.isIntersecting) en.target.classList.add('visible'); });
    },{threshold:0.12});
    reveals.forEach(r=>obs.observe(r));
  } else {
    // fallback
    reveals.forEach(r=>r.classList.add('visible'));
  }

  /* Tag ripple + keyboard focus */
  const tags = Array.from(document.querySelectorAll('.tag'));
  tags.forEach(t => {
    t.addEventListener('click', ()=>{
      if (t.animate) {
        t.animate([
          {transform:'scale(1)', boxShadow:'0 6px 18px rgba(0,0,0,0.04)'},
          {transform:'scale(1.04)', boxShadow:'0 18px 40px rgba(0,0,0,0.06)'},
          {transform:'scale(1)', boxShadow:'0 6px 18px rgba(0,0,0,0.04)'}
        ],{duration:360,easing:'cubic-bezier(.2,.9,.3,1)'});
      }
    });
    t.addEventListener('keydown',(ev)=>{ if(ev.key==='Enter' || ev.key===' ') { ev.preventDefault(); t.click(); } });
  });

  /* Floating CTA: scroll to contact */
  const fab = document.createElement('button');
  fab.className='fab';
  fab.type='button';
  fab.textContent='Contact →';
  document.body.appendChild(fab);
  fab.addEventListener('click', ()=>{
    const contact = document.querySelector('.contact');
    if(contact){
      contact.scrollIntoView({behavior:'smooth',block:'center'});
      contact.classList.add('visible');
      // set focus for accessibility
      const focusable = contact.querySelector('a,button,input,textarea');
      if(focusable) focusable.focus({preventScroll:true});
    }
  });

  /* Smooth internal links */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',(e)=>{
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior:'smooth',block:'center'});
    });
  });

})();

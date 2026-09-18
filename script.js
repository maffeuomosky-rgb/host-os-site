
(() => {
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const features=[
    {title:'Ogni immobile sotto controllo',copy:'Centralizza dati anagrafici, costi fissi, performance, conformità e rendimento di ogni struttura.',detail:'Immobili, costi fissi e rendimento',label:'Immobili'},
    {title:'Dal soggiorno al margine reale',copy:'Controlla prenotazioni, canali, notti, ricavi, commissioni e contribuzione di ogni soggiorno.',detail:'Prenotazioni, ricavi e costi diretti',label:'Prenotazioni'},
    {title:'Disponibilità e blocchi in una sola vista',copy:'Leggi occupazione, soggiorni, uso proprietario e manutenzioni direttamente sul calendario.',detail:'Occupazione, blocchi e disponibilità',label:'Calendario'},
    {title:'Ricavi, costi e utile senza fogli paralleli',copy:'HOST OS costruisce automaticamente il quadro economico con margini, ROI, ADR, RevPAR e punto di pareggio.',detail:'Ricavi, costi, utile e rendimento',label:'Redditività'},
  ];
  const tabs=$$('.feature-tabs button'), screens=$$('.scroll-screen');
  const title=$('#feature-panel .feature-copy h3'), copy=$('#feature-panel .feature-copy p'), detail=$('#feature-panel .feature-detail'), bottom=$('#feature-panel .screen-bottom > span');
  function selectFeature(i){
    tabs.forEach((b,j)=>{b.setAttribute('aria-selected',j===i?'true':'false');b.tabIndex=j===i?0:-1;});
    screens.forEach((im,j)=>{im.style.opacity=j===i?'1':'0';im.style.transform=j===i?'none':'translateY(12px) scale(.985)';im.setAttribute('aria-hidden',j===i?'false':'true');});
    const f=features[i]; if(title) title.textContent=f.title;if(copy) copy.textContent=f.copy;if(detail) detail.textContent=f.detail;if(bottom) bottom.textContent=f.label;
  }
  tabs.forEach((b,i)=>b.addEventListener('click',()=>selectFeature(i)));
  selectFeature(0);

  // FAQ
  $$('.faq-trigger').forEach(btn=>btn.addEventListener('click',()=>{
    const item=btn.closest('.faq-item'), ans=$('.faq-answer',item), open=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded',open?'false':'true'); item.classList.toggle('open',!open); ans.hidden=open;
  }));

  // Dialog helpers
  const purchase=$('#purchase-dialog');
  function openDlg(d){ if(d && !d.open) d.showModal(); }
  $$('.nav-buy,.hero-buy,.price-buy,.cart-trigger').forEach(b=>b.addEventListener('click',()=>openDlg(purchase)));
  $$('dialog .dialog-close').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
  $$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));

  const info=$('#info-dialog-custom'), infoTitle=$('#info-dialog-title'), infoCopy=$('#info-dialog-copy');
  const infoData={
    'contatti':['Contatti','Il canale di supporto definitivo sarà indicato prima della pubblicazione commerciale.'],
    'termini':['Termini','HOST OS è un prodotto digitale fornito come copia personale del sistema e relativo materiale di supporto. I dati legali completi del venditore saranno inseriti prima del lancio.'],
    'privacy':['Privacy','La pagina Privacy definitiva sarà collegata prima della pubblicazione. HOST OS opera all’interno dell’ambiente Google dell’utente per il prodotto Sheets.'],
    'rimborsi':['Rimborsi','Trattandosi di un prodotto digitale con accesso immediato, la policy definitiva sarà pubblicata prima del checkout. La configurazione commerciale attuale prevede assistenza in caso di errore tecnico accertato.']
  };
  $$('[data-info]').forEach(b=>b.addEventListener('click',()=>{const d=infoData[b.dataset.info];if(!d)return;infoTitle.textContent=d[0];infoCopy.innerHTML='<p>'+d[1]+'</p>';openDlg(info);}));

  // Image viewer
  const imgDlg=$('#image-dialog-custom'), imgView=$('.image-viewer-img',imgDlg), imgTitle=$('#image-dialog-title');
  function showImage(img,title){imgView.src=img.src;imgView.alt=img.alt||'Schermata HOST OS';imgTitle.textContent=title||'HOST OS';openDlg(imgDlg)}
  const dash=$('.dashboard-frame img'); if(dash) $('.dashboard-frame').addEventListener('click',()=>showImage(dash,'Panoramica HOST OS'));
  const az=$('#analytics-visual img'); if(az) $('#analytics-visual').addEventListener('click',()=>showImage(az,'Analytics HOST OS'));
  const zoom=$('#explorer-zoom'); if(zoom) zoom.addEventListener('click',()=>{const i=tabs.findIndex(b=>b.getAttribute('aria-selected')==='true');showImage(screens[i],features[i].label)});
  $$('.image-open').forEach(b=>{if(b===zoom||b.classList.contains('analytics-open-caption'))return;if(b.closest('.hero-product'))b.addEventListener('click',()=>showImage(dash,'Panoramica HOST OS'));});
  const ac=$('.analytics-open-caption'); if(ac) ac.addEventListener('click',()=>showImage(az,'Analytics HOST OS'));

  // Mobile nav
  const mt=$('.menu-toggle'), mp=$('#mobile-panel');
  if(mt&&mp){mt.addEventListener('click',()=>{const o=mp.classList.toggle('open');mt.setAttribute('aria-expanded',o?'true':'false')});$$('a',mp).forEach(a=>a.addEventListener('click',()=>{mp.classList.remove('open');mt.setAttribute('aria-expanded','false')}));}

  // Smooth scroll and subtle reveal
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id==='#')return;const t=$(id);if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}}));
  const reveal=$$('.section-intro,.dual-card,.pricing-layout,.included-list li,.analytics-surface');
  if('IntersectionObserver'in window){
    reveal.forEach(el=>{el.style.opacity='0';el.style.transform='translateY(14px)'});
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.style.transition='opacity .65s ease, transform .65s ease';e.target.style.opacity='1';e.target.style.transform='none';io.unobserve(e.target)}}),{threshold:.12}); reveal.forEach(el=>io.observe(el));
  }
})();

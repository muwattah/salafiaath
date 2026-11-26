'use strict';
document.addEventListener('DOMContentLoaded', () => {
 const query=new URLSearchParams(location.search); let lang='nl'; try{lang=localStorage.getItem('salafiaathLang')==='en'?'en':'nl';}catch(e){} if(['nl','en'].includes(query.get('lang')))lang=query.get('lang');
 const t=(nl,en)=>lang==='en'?en:nl;
 document.querySelectorAll('[data-en]').forEach(el=>el.dataset.nl=el.textContent);
 const models=[{id:'long',nl:'Lange khimaar',en:'Long khimaar',price:39.95,scale:.90},{id:'extra-long',nl:'Extra lange khimaar',en:'Extra-long khimaar',price:44.95,scale:1.03}];
 const fabrics=[{id:'nida',name:'Nida',nl:'Iets dikker, soepel vallend; niet doorschijnend.',en:'Slightly thicker, flowing; not sheer.'},{id:'medina',name:'Medina Silk',nl:'Luchtig en soepel vallend; niet doorschijnend.',en:'Airy and flowing; not sheer.'},{id:'jazz',name:'Jazz',nl:'Licht en luchtig; niet doorschijnend.',en:'Light and airy; not sheer.'},{id:'light',name:'Lightweight',nl:'Zeer licht; kan doorschijnend zijn.',en:'Very lightweight; may be sheer.'}];
 const colors=[['black','Zwart','Black','#141414'],['mocha','Mokka','Mocha','#6B4F3A'],['olive','Olijfgroen','Olive','#4A5333'],['taupe','Taupe','Taupe','#8A7A6B'],['navy','Donkerblauw','Navy','#1C2A44'],['chocolate','Chocoladebruin','Chocolate','#3B2418']];
 const money=n=>new Intl.NumberFormat(lang==='en'?'en-IE':'nl-BE',{style:'currency',currency:'EUR'}).format(n);
 const el=id=>document.getElementById(id);
 const sizeFor=v=>{let n=Number(v);return !Number.isInteger(n)||n<120||n>220?'':n<150?'XS':n<160?'S':n<167?'M':n<174?'L':n<181?'XL':'XXL'};
 const advice=(v,target)=>{const size=sizeFor(v);target.textContent=!v?'':size?t('Indicatief maatadvies: ','Indicative size guidance: ')+size:t('Vul een hele lengte tussen 120 en 220 cm in.','Enter a whole number between 120 and 220 cm.');return size;};
 const form=el('requestForm'), fit=el('fitFinderInput'); let step=1, busy=false, sent=false; const state={model:models.some(m=>m.id===query.get('model'))?query.get('model'):'long',fabric:'nida',color:'black'};

 const mobileMode=window.matchMedia('(max-width:760px)');let compactPreview=false;
 function updateMobilePreviewToggle(){const preview=el('requestPreview'),toggle=el('minimizePreview'),label=el('previewToggleText');if(!preview||!toggle||!label)return;preview.classList.toggle('is-compact',compactPreview);document.body.classList.toggle('atelier-compact-preview',compactPreview);toggle.setAttribute('aria-expanded',String(!compactPreview));label.textContent=compactPreview?t('Vergroot','Expand'):t('Verklein','Minimise');}
 function initMobileAtelier(){const tools=el('designTools');const fabric=form.querySelector('.fabric-field'),colour=form.querySelector('.colour-field');const sortFields=()=>{if(!fabric||!colour)return;if(mobileMode.matches)fabric.parentNode.insertBefore(colour,fabric);else colour.parentNode.insertBefore(fabric,colour);};sortFields();if(tools&&mobileMode.matches)tools.open=false;const updateMode=()=>{sortFields();if(tools)tools.open=!mobileMode.matches;};if(mobileMode.addEventListener)mobileMode.addEventListener('change',updateMode);else if(mobileMode.addListener)mobileMode.addListener(updateMode);
 const toggle=el('minimizePreview');if(toggle)toggle.addEventListener('click',()=>{compactPreview=!compactPreview;updateMobilePreviewToggle();});const zoom=el('mobileZoom');if(zoom)zoom.addEventListener('click',openZoom);
 if(window.visualViewport){const keyboard=()=>{const focused=document.activeElement;const editing=focused&&focused.matches('input:not([type=checkbox]):not([type=radio]),textarea,select');document.body.classList.toggle('atelier-keyboard',Boolean(mobileMode.matches&&editing&&window.innerHeight-window.visualViewport.height>120));};window.visualViewport.addEventListener('resize',keyboard);document.addEventListener('focusin',keyboard);document.addEventListener('focusout',()=>setTimeout(keyboard,100));}
 }
 const draftKey='salafiaathDesignV1';let requestNumber='';
 function updateThanks(){
   const p=el('thanksReference'),m=el('thanksMessage');if(!p||!m)return;
   const ref=query.get('ref')||'';
   if(query.get('submitted')==='1'&&/^SA-[A-Z0-9-]{10,40}$/.test(ref)){p.hidden=false;p.textContent=t('Aanvraagnummer: ','Request reference: ')+ref;if(query.get('confirmation')==='failed'){m.textContent=t('Je aanvraag is ontvangen. De automatische bevestigingsmail kon niet worden bevestigd. Bewaar je aanvraagnummer; Salafiaath neemt contact met je op. Verstuur je aanvraag niet opnieuw.','Your request has been received. The automatic confirmation email could not be confirmed. Keep your reference; Salafiaath will contact you. Do not submit again.');}}
   else{p.hidden=true;m.textContent=t('Verstuur eerst je aanvraag via de ontwerper.','Submit your request through the designer first.');}
 }
 function loadDraft(){try{const d=JSON.parse(localStorage.getItem(draftKey)||'null');if(!d)return;if(models.some(m=>m.id===d.model)&&!models.some(m=>m.id===query.get('model')))state.model=d.model;if(fabrics.some(f=>f.id===d.fabric))state.fabric=d.fabric;if(colors.some(c=>c[0]===d.color))state.color=d.color;if(sizeFor(d.height)&&!sizeFor(query.get('height')))el('height').value=d.height;if(Number.isInteger(d.quantity)&&d.quantity>=1&&d.quantity<=20)el('quantity').value=d.quantity;el('designStatus').textContent=t('Bewaard ontwerp geladen.','Saved design loaded.');}catch(e){}}
 function saveDraft(){try{localStorage.setItem(draftKey,JSON.stringify({...state,height:el('height').value,quantity:quantity()}));el('designStatus').textContent=t('Ontwerp bewaard op dit apparaat.','Design saved on this device.');}catch(e){el('designStatus').textContent=t('Bewaren is niet mogelijk in deze browser.','Saving is unavailable in this browser.');}}
 function newReference(){const day=new Date().toISOString().slice(0,10).replace(/-/g,'');const random=Array.from(crypto.getRandomValues(new Uint8Array(6)),v=>v.toString(16).padStart(2,'0')).join('').toUpperCase();return 'SA-'+day+'-'+random;}
 function openZoom(){const dialog=el('zoomDialog'),dest=el('zoomContent');dest.replaceChildren();const c=el('previewCanvas');if(!c.hidden){const copy=document.createElement('canvas');copy.width=c.width;copy.height=c.height;copy.getContext('2d').drawImage(c,0,0);dest.append(copy);}else{const img=el('previewSource').cloneNode();img.removeAttribute('id');img.hidden=false;dest.append(img);}if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');}
 const currentModel=()=>models.find(x=>x.id===state.model);
 const currentFabric=()=>fabrics.find(x=>x.id===state.fabric);
 const currentColor=()=>colors.find(x=>x[0]===state.color);
 function updateFit(){if(!fit)return;const s=advice(fit.value,el('fitFinderMsg'));const url=new URL('bestellen.html',location.href);if(s)url.searchParams.set('height',fit.value);url.searchParams.set('lang',lang);el('fitLink').href=url.href;}
 function syncLinks(){document.querySelectorAll('a[href]').forEach(a=>{const raw=a.getAttribute('href');if(raw.startsWith('#'))return;try{const url=new URL(raw,location.href);if(url.origin===location.origin&&/\/(index|bestellen|privacy|lookbook|bedankt)\.html$/.test(url.pathname)){url.searchParams.set('lang',lang);a.href=url.href;}}catch(e){}});}
 function applyLanguage(){document.documentElement.lang=lang;document.title=document.documentElement.dataset.page==='lookbook'?'Lookbook | Salafiaath':document.documentElement.dataset.page==='thanks'?t('Bedankt | Salafiaath','Thank you | Salafiaath'):document.documentElement.dataset.page==='privacy'?'Privacy | Salafiaath':form?t('Bestelling aanvragen | Salafiaath','Request a khimaar | Salafiaath'):t('Handgemaakte khimaars | Salafiaath','Handmade khimaars | Salafiaath');document.querySelectorAll('[data-en]').forEach(x=>{x.textContent=lang==='en'?x.dataset.en:x.dataset.nl;});el('language').textContent=lang==='en'?'NL':'EN';el('language').setAttribute('aria-label',t('Switch to English','Schakel naar Nederlands'));const menu=el('menuToggle');if(menu)menu.setAttribute('aria-label',menu.getAttribute('aria-expanded')==='true'?t('Menu sluiten','Close menu'):t('Menu openen','Open menu'));syncLinks();updateFit();updateThanks();if(form&&!sent){renderChoices();updatePreview();updateSummary();showStep(step,false);if(el('height').value)advice(el('height').value,el('sizeAdvice'));}}
 el('language').addEventListener('click',()=>{lang=lang==='en'?'nl':'en';try{localStorage.setItem('salafiaathLang',lang);}catch(e){}try{const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);}catch(e){}applyLanguage();});
 if(fit){fit.addEventListener('input',updateFit);if(sizeFor(query.get('height')))fit.value=query.get('height');}
 function choice(container,key,id,title,desc,color){const b=document.createElement('button');b.type='button';b.className=(key==='color'?'swatch':'choice')+(state[key]===id?' is-on':'');b.setAttribute('aria-pressed',String(state[key]===id));if(key==='fabric'){const sample=document.createElement('span');sample.className='fabric-sample fabric-'+id;sample.setAttribute('aria-hidden','true');b.append(sample);}if(color){const sw=document.createElement('span');sw.style.setProperty('--sw',color);b.append(sw);}const label=document.createElement('strong');label.textContent=title;b.append(label);if(desc){const p=document.createElement('span');p.textContent=desc;b.append(p);}b.addEventListener('click',()=>{state[key]=id;container.querySelectorAll('button').forEach(x=>{const selected=x===b;x.classList.toggle('is-on',selected);x.setAttribute('aria-pressed',String(selected));});updatePreview();updateSummary();});container.append(b);}
 function renderChoices(){for(const id of ['models','fabrics','colors'])el(id).replaceChildren();models.forEach(m=>choice(el('models'),'model',m.id,m[lang],money(m.price)));fabrics.forEach(f=>choice(el('fabrics'),'fabric',f.id,f.name,f[lang]));colors.forEach(c=>choice(el('colors'),'color',c[0],c[lang==='en'?2:1],null,c[3]));}
 function quantity(){let n=Number(el('quantity').value);return Number.isInteger(n)&&n>=1&&n<=20?n:1;}
 // Atelier preview: recolour the actual fabric pixels, not the mannequin's skin.
 let sourcePixels=null, shadeCanvas=null, lastPaint='', previewWaiting=false;
 const clamp01=x=>Math.min(1,Math.max(0,x));
 function paintAtelier(){
   const img=el('previewSource'),canvas=el('previewCanvas');
   if(!img||!canvas)return;
   if(!img.complete||!img.naturalWidth){
     if(!previewWaiting){previewWaiting=true;img.addEventListener('load',()=>{previewWaiting=false;paintAtelier();},{once:true});}
     return;
   }
   try{
     const w=img.naturalWidth,h=img.naturalHeight,ctx=canvas.getContext('2d');
     if(!ctx)return;
     const key=state.color+'|'+state.model+'|'+state.fabric;
     if(lastPaint===key)return;
     if(!sourcePixels){shadeCanvas=document.createElement('canvas');shadeCanvas.width=w;shadeCanvas.height=h;const sc=shadeCanvas.getContext('2d',{willReadFrequently:true});sc.drawImage(img,0,0,w,h);sourcePixels=sc.getImageData(0,0,w,h);}
     const hex=currentColor()[3].slice(1),rgb=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16));
     const shaded=new ImageData(new Uint8ClampedArray(sourcePixels.data),w,h),d=shaded.data;
     for(let i=0;i<d.length;i+=4){
       if(!d[i+3])continue;
       const r=d[i],g=d[i+1],b=d[i+2],lum=.2126*r+.7152*g+.0722*b;
       // The warm skin areas are distinct from the neutral charcoal fabric.
       const y=Math.floor(i/4/w)/h,x=(i/4%w)/w;
       const skinRegion=(y<.15&&x>.35&&x<.65)||(y>.47&&y<.59&&(x<.25||x>.75));
       const skin=skinRegion?clamp01(Math.min((r-b-5)/14,(r-g-2)/8)):0;
       const shade=Math.pow(Math.max(.04,lum/82),1.22);
       const texture=state.fabric==='jazz'?Math.sin((i/4%w)*2.9)*1.8+Math.sin(y*h*2.2)*1.3:state.fabric==='nida'?Math.sin((i/4%w)*2.4)*.5:state.fabric==='medina'?Math.max(0,lum-72)*.055:Math.sin(y*h*1.7)*.8;const highlight=Math.max(0,lum-76)*(state.fabric==='medina' ? .43 : .34)+texture;
       for(let c=0;c<3;c++){const target=Math.min(255,rgb[c]*shade+highlight+2);d[i+c]=d[i+c]*skin+target*(1-skin);}
     }
     shadeCanvas.getContext('2d').putImageData(shaded,0,0);
     canvas.width=w;canvas.height=h;
     ctx.clearRect(0,0,w,h);
     if(state.model==='long'){
       // Shorten the lower drape only, keeping head, hands and floor-length base in place.
       const a=Math.round(h*.59),b=Math.round(h*.80),end=Math.round(h*.74);
       ctx.drawImage(shadeCanvas,0,0,w,a,0,0,w,a);
       ctx.drawImage(shadeCanvas,0,a,w,b-a,0,a,w,end-a);
       ctx.drawImage(shadeCanvas,0,b,w,h-b,0,end,w,h-end);
     }else ctx.drawImage(shadeCanvas,0,0);
     canvas.hidden=false;img.hidden=true;lastPaint=key;if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&canvas.animate)canvas.animate([{opacity:.72},{opacity:1}],{duration:190});
   }catch(e){canvas.hidden=true;img.hidden=false;}
 }
 function updatePreview(){
   const p=el('cfgPreview');p.style.setProperty('--khimaar',currentColor()[3]);p.style.setProperty('--fall',String(currentModel().scale));
   const priceText=money(currentModel().price*quantity());el('price').textContent=priceText;const mp=el('mobilePrice');if(mp)mp.textContent=priceText;
   const selected=currentModel()[lang]+' · '+currentFabric().name+' · '+currentColor()[lang==='en'?2:1];
   const label=el('previewSelection');if(label)label.textContent=selected;
   const canvas=el('previewCanvas');if(canvas)canvas.setAttribute('aria-label',t('Illustratief voorbeeld: ','Illustrative preview: ')+selected);
   const img=el('previewSource');if(img)img.alt=t('Gezichtsloze khimaar mannequin','Faceless khimaar mannequin');
   paintAtelier();
 }
 function rows(){const m=currentModel(),f=currentFabric(),c=currentColor(),height=el('height').value;return [[t('Model','Model'),m[lang]],[t('Stof','Fabric'),f.name],[t('Kleur','Colour'),c[lang==='en'?2:1]],[t('Lichaamslengte','Height'),height?height+' cm':'—'],[t('Indicatieve maat','Indicative size'),sizeFor(height)||'—'],[t('Aantal','Quantity'),String(quantity())],[t('Indicatieve productprijs','Estimated product price'),money(m.price*quantity())],[t('Naam','Name'),el('name').value],[t('E-mail','Email'),el('email').value],[t('Telefoon','Phone'),el('phone').value.trim()||t('Niet opgegeven','Not provided')],[t('Opmerkingen','Notes'),el('notes').value||'—']];}
 function updateSummary(){const target=el('summary');target.replaceChildren();rows().forEach(([k,v])=>{const d=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;d.append(dt,dd);target.append(d);});}

 // EmailJS browser integration. These are public identifiers, never private credentials.
 const emailConfig=Object.freeze({service:'service_gbgvxem',ownerTemplate:'template_qw7itxx',customerTemplate:'template_7my1iwq',publicKey:'cdgjPSmdVsaYu1lW5'});
 async function sendTemplate(template,params){
   const controller=new AbortController();
   const timeout=setTimeout(()=>controller.abort(),25000);
   try{
     const response=await fetch('https://api.emailjs.com/api/v1.0/email/send',{
       method:'POST',headers:{'Content-Type':'application/json'},
       body:JSON.stringify({service_id:emailConfig.service,template_id:template,user_id:emailConfig.publicKey,template_params:params}),
       signal:controller.signal
     });
     if(!response.ok){const error=new Error('Email service returned '+response.status);error.status=response.status;throw error;}
   }finally{clearTimeout(timeout);}
 }
 function buildEmailParams(){
   const height=el('height').value;
   const shared={request_id:requestNumber,date:new Intl.DateTimeFormat(lang==='en'?'en-GB':'nl-BE',{dateStyle:'medium',timeStyle:'short',timeZone:'Europe/Brussels'}).format(new Date()),name:el('name').value.trim(),email:el('email').value.trim(),fabric:currentFabric().name,quantity:String(quantity()),price:money(currentModel().price*quantity()),size:sizeFor(height)||t('Niet opgegeven','Not provided')};
   const owner={...shared,model:currentModel().nl,color:currentColor()[1],phone:el('phone').value.trim()||'Niet opgegeven',language:lang==='en'?'Engels':'Nederlands',height:height?height+' cm':'Niet opgegeven',notes:el('notes').value.trim()||'Geen opmerkingen'};
   const customer={request_id:shared.request_id,name:shared.name,email:shared.email,fabric:shared.fabric,quantity:shared.quantity,price:shared.price,size:shared.size,model:currentModel()[lang],color:currentColor()[lang==='en'?2:1],
     confirmation_subject:t('Bevestiging van je aanvraag | Salafiaath','Your request confirmation | Salafiaath'),
     confirmation_title:t('Jouw aanvraag is ontvangen','Your request has been received'),
     greeting:t('Beste','Dear'),
     confirmation_intro:t('Bedankt voor je vertrouwen in Salafiaath. We hebben je persoonlijke ontwerp ontvangen en nemen contact met je op.','Thank you for choosing Salafiaath. We have received your personal design request and will contact you.'),
     reference_label:t('AANVRAAGNUMMER','REQUEST REFERENCE'),
     design_title:t('Jouw persoonlijke ontwerp','Your personal design'),
     model_label:t('Model','Model'),fabric_label:t('Stof','Fabric'),color_label:t('Kleur','Colour'),quantity_label:t('Aantal','Quantity'),size_label:t('Indicatief maatadvies','Indicative size guidance'),price_label:t('Indicatieve prijs','Estimated price'),
     price_note:t('De prijs is indicatief. Eventuele extra wensen en verzendkosten worden nog besproken.','The price is an estimate. Special requests and delivery costs will be discussed.'),
     next_steps_title:t('Hoe gaat het verder?','What happens next?'),
     next_steps_text:t('Wij nemen persoonlijk contact met je op via de opgegeven gegevens om de details van je aanvraag af te spreken.','We will contact you personally using the details you provided to discuss your request.'),
     payment_note:t('Je hoeft nu niets te betalen.','You do not need to pay anything now.'),
     website_button:t('BEZOEK SALAFIAATH','VISIT SALAFIAATH'),
     closing:t('Met vriendelijke groet,','Kind regards,')};
   return {owner,customer};
 }
 async function sendRequestEmails(params){
   await sendTemplate(emailConfig.ownerTemplate,params.owner);
   // EmailJS permits one request per second. Never resend the owner email when the second email fails.
   await new Promise(resolve=>setTimeout(resolve,1250));
   try{await sendTemplate(emailConfig.customerTemplate,params.customer);return true;}catch(e){return false;}
 }

 function clearError(){el('formError').hidden=true;el('formError').textContent='';}
 function fail(message,field){const box=el('formError');box.textContent=message;box.hidden=false;if(field){field.focus();field.setAttribute('aria-invalid','true');if(mobileMode.matches)field.scrollIntoView({block:'center',behavior:'auto'});}else if(mobileMode.matches){box.scrollIntoView({block:'center',behavior:'auto'});}return false;}
 function valid(n){clearError();if(n===1&&el('height').value&&!sizeFor(el('height').value))return fail(t('Controleer je lichaamslengte of laat het veld leeg.','Check your height or leave it blank.'),el('height'));if(n===3){const name=el('name'),email=el('email'),phone=el('phone'),q=el('quantity');if(!name.value.trim())return fail(t('Vul je naam in.','Enter your name.'),name);if(!email.validity.valid||!email.value.trim())return fail(t('Vul een geldig e-mailadres in.','Enter a valid email address.'),email);const phoneValue=phone.value.trim(),digits=phoneValue.replace(/\D/g,'');if(phoneValue&&(!/^\+?[0-9() .-]+$/.test(phoneValue)||digits.length<7||digits.length>15))return fail(t('Vul een geldig telefoonnummer in, liefst met landcode, of laat het veld leeg.','Enter a valid phone number, preferably with country code, or leave the field blank.'),phone);if(!q.validity.valid||!Number.isInteger(Number(q.value)))return fail(t('Kies een aantal van 1 tot 20.','Choose a quantity from 1 to 20.'),q);}if(n===4&&!el('privacyConsent').checked)return fail(t('Bevestig dat je de privacyinformatie hebt gelezen.','Confirm you have read the privacy information.'),el('privacyConsent'));return true;}
 function showStep(n,focus=true){step=n;document.body.dataset.atelierStep=String(n);const mobileStep=el('mobileStep');if(mobileStep)mobileStep.textContent=t('Stap ','Step ')+n+' / 4';updateMobilePreviewToggle();form.querySelectorAll('.form-step').forEach(p=>{const on=Number(p.dataset.step)===n;p.hidden=!on;p.classList.toggle('active',on);});document.querySelectorAll('.progress-step').forEach(p=>{const on=Number(p.dataset.step)===n;p.classList.toggle('active',on);if(on)p.setAttribute('aria-current','step');else p.removeAttribute('aria-current');});el('prevBtn').hidden=n===1;el('nextBtn').hidden=n===4;el('submitBtn').hidden=n!==4;clearError();if(n===4)updateSummary();if(focus){const h=form.querySelector('.form-step.active h2');h.tabIndex=-1;if(mobileMode.matches){h.focus({preventScroll:true});const layout=document.querySelector('.request-layout');if(layout)layout.scrollIntoView({block:'start',behavior:'instant'});}else{h.focus();h.scrollIntoView({block:'nearest'});}}}
 if(form){initMobileAtelier();loadDraft();el('saveDesign').addEventListener('click',saveDraft);el('resetDesign').addEventListener('click',()=>{if(!confirm(t('Een nieuw ontwerp starten? Je bewaarde keuzes worden gewist.','Start a new design? Your saved choices will be cleared.')))return;try{localStorage.removeItem(draftKey);}catch(e){}state.model='long';state.fabric='nida';state.color='black';el('height').value='';el('quantity').value='1';el('sizeAdvice').textContent='';requestNumber='';renderChoices();updatePreview();updateSummary();showStep(1);el('designStatus').textContent=t('Nieuw ontwerp gestart.','New design started.');});el('zoomPreview').addEventListener('click',openZoom);el('closeZoom').addEventListener('click',()=>{const d=el('zoomDialog');if(d.close)d.close();else d.removeAttribute('open');});if(sizeFor(query.get('height')))el('height').value=query.get('height');form.addEventListener('input',e=>{e.target.removeAttribute('aria-invalid');if(e.target.id==='height')advice(e.target.value,el('sizeAdvice'));updatePreview();updateSummary();});el('prevBtn').addEventListener('click',()=>{if(!busy)showStep(Math.max(1,step-1));});el('nextBtn').addEventListener('click',()=>{if(!busy&&valid(step))showStep(Math.min(4,step+1));});form.addEventListener('submit',async e=>{e.preventDefault();if(busy||sent)return;if(step!==4){if(valid(step))showStep(step+1);return;}for(const n of [1,3,4])if(!valid(n)){showStep(n);valid(n);return;}if(form.querySelector('[name="_honey"]').value)return;requestNumber=requestNumber||newReference();busy=true;const submitLabel=el('submitBtn').querySelector('[data-en]');submitLabel.textContent=t('Bezig met versturen…','Sending request…');el('submitBtn').disabled=true;el('prevBtn').disabled=true;el('language').disabled=true;form.setAttribute('aria-busy','true');
 const params=buildEmailParams();
 try{
   const confirmed=await sendRequestEmails(params);
   sent=true;
   const url=new URL('bedankt.html',location.href);
   url.searchParams.set('submitted','1');url.searchParams.set('lang',lang);url.searchParams.set('ref',requestNumber);
   url.searchParams.set('confirmation',confirmed?'sent':'failed');
   location.assign(url.href);
 }catch(err){
   const knownRejected=Number.isInteger(err.status)&&err.status>=400&&err.status<500;
   fail(knownRejected?t('Je aanvraag is niet geaccepteerd door de e-maildienst. Je gegevens blijven staan. Probeer opnieuw of neem contact op met Salafiaath.','The email service did not accept your request. Your details remain on this page. Try again or contact Salafiaath.'):t('We konden niet controleren of je aanvraag is ontvangen. Neem contact op met Salafiaath met aanvraagnummer '+requestNumber+' voordat je opnieuw verstuurt.','We could not verify whether your request was received. Contact Salafiaath with reference '+requestNumber+' before submitting again.'));
 }finally{if(!sent){busy=false;form.removeAttribute('aria-busy');el('submitBtn').disabled=false;el('prevBtn').disabled=false;el('language').disabled=false;submitLabel.textContent=t('Aanvraag versturen','Send request');}}
 });}
 window.addEventListener('pageshow',e=>{if(e.persisted&&form&&busy){busy=false;form.removeAttribute('aria-busy');el('submitBtn').disabled=false;el('prevBtn').disabled=false;el('language').disabled=false;el('submitBtn').querySelector('[data-en]').textContent=t('Aanvraag versturen','Send request');}});applyLanguage();
 if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}});},{threshold:.08});document.querySelectorAll('main .section:not(.form-section),.editorial-section').forEach(s=>{s.classList.add('reveal');observer.observe(s);});}
});
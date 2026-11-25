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
 const currentModel=()=>models.find(x=>x.id===state.model);
 const currentFabric=()=>fabrics.find(x=>x.id===state.fabric);
 const currentColor=()=>colors.find(x=>x[0]===state.color);
 function updateFit(){if(!fit)return;const s=advice(fit.value,el('fitFinderMsg'));const url=new URL('bestellen.html',location.href);if(s)url.searchParams.set('height',fit.value);url.searchParams.set('lang',lang);el('fitLink').href=url.href;}
 function syncLinks(){document.querySelectorAll('a[href]').forEach(a=>{const raw=a.getAttribute('href');if(raw.startsWith('#'))return;try{const url=new URL(raw,location.href);if(url.origin===location.origin&&/\/(index|bestellen|privacy)\.html$/.test(url.pathname)){url.searchParams.set('lang',lang);a.href=url.href;}}catch(e){}});}
 function applyLanguage(){document.documentElement.lang=lang;document.title=document.documentElement.dataset.page==='privacy'?'Privacy | Salafiaath':form?t('Bestelling aanvragen | Salafiaath','Request a khimaar | Salafiaath'):t('Handgemaakte khimaars | Salafiaath','Handmade khimaars | Salafiaath');document.querySelectorAll('[data-en]').forEach(x=>{x.textContent=lang==='en'?x.dataset.en:x.dataset.nl;});el('language').textContent=lang==='en'?'NL':'EN';el('language').setAttribute('aria-label',t('Switch to English','Schakel naar Nederlands'));const menu=el('menuToggle');if(menu)menu.setAttribute('aria-label',menu.getAttribute('aria-expanded')==='true'?t('Menu sluiten','Close menu'):t('Menu openen','Open menu'));syncLinks();updateFit();if(form&&!sent){renderChoices();updatePreview();updateSummary();showStep(step,false);if(el('height').value)advice(el('height').value,el('sizeAdvice'));}}
 el('language').addEventListener('click',()=>{lang=lang==='en'?'nl':'en';try{localStorage.setItem('salafiaathLang',lang);}catch(e){}try{const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);}catch(e){}applyLanguage();});
 if(fit){fit.addEventListener('input',updateFit);if(sizeFor(query.get('height')))fit.value=query.get('height');}
 function choice(container,key,id,title,desc,color){const b=document.createElement('button');b.type='button';b.className=(key==='color'?'swatch':'choice')+(state[key]===id?' is-on':'');b.setAttribute('aria-pressed',String(state[key]===id));if(color){const sw=document.createElement('span');sw.style.setProperty('--sw',color);b.append(sw);}const label=document.createElement('strong');label.textContent=title;b.append(label);if(desc){const p=document.createElement('span');p.textContent=desc;b.append(p);}b.addEventListener('click',()=>{state[key]=id;container.querySelectorAll('button').forEach(x=>{const selected=x===b;x.classList.toggle('is-on',selected);x.setAttribute('aria-pressed',String(selected));});updatePreview();updateSummary();});container.append(b);}
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
     const key=state.color+'|'+state.model;
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
       const highlight=Math.max(0,lum-76)*.34;
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
     canvas.hidden=false;img.hidden=true;lastPaint=key;
   }catch(e){canvas.hidden=true;img.hidden=false;}
 }
 function updatePreview(){
   const p=el('cfgPreview');p.style.setProperty('--khimaar',currentColor()[3]);p.style.setProperty('--fall',String(currentModel().scale));
   el('price').textContent=money(currentModel().price*quantity());
   const selected=currentModel()[lang]+' · '+currentFabric().name+' · '+currentColor()[lang==='en'?2:1];
   const label=el('previewSelection');if(label)label.textContent=selected;
   const canvas=el('previewCanvas');if(canvas)canvas.setAttribute('aria-label',t('Illustratief voorbeeld: ','Illustrative preview: ')+selected);
   const img=el('previewSource');if(img)img.alt=t('Gezichtsloze khimaar mannequin','Faceless khimaar mannequin');
   paintAtelier();
 }
 function rows(){const m=currentModel(),f=currentFabric(),c=currentColor(),height=el('height').value;return [[t('Model','Model'),m[lang]],[t('Stof','Fabric'),f.name],[t('Kleur','Colour'),c[lang==='en'?2:1]],[t('Lichaamslengte','Height'),height?height+' cm':'—'],[t('Indicatieve maat','Indicative size'),sizeFor(height)||'—'],[t('Aantal','Quantity'),String(quantity())],[t('Indicatieve productprijs','Estimated product price'),money(m.price*quantity())],[t('Naam','Name'),el('name').value],[t('E-mail','Email'),el('email').value],[t('Telefoon','Phone'),el('phone').value],[t('Opmerkingen','Notes'),el('notes').value||'—']];}
 function updateSummary(){const target=el('summary');target.replaceChildren();rows().forEach(([k,v])=>{const d=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;d.append(dt,dd);target.append(d);});}
 function clearError(){el('formError').hidden=true;el('formError').textContent='';}
 function fail(message,field){const box=el('formError');box.textContent=message;box.hidden=false;if(field){field.focus();field.setAttribute('aria-invalid','true');}return false;}
 function valid(n){clearError();if(n===1&&el('height').value&&!sizeFor(el('height').value))return fail(t('Controleer je lichaamslengte of laat het veld leeg.','Check your height or leave it blank.'),el('height'));if(n===3){const name=el('name'),email=el('email'),phone=el('phone'),q=el('quantity');if(!name.value.trim())return fail(t('Vul je naam in.','Enter your name.'),name);if(!email.validity.valid||!email.value.trim())return fail(t('Vul een geldig e-mailadres in.','Enter a valid email address.'),email);const digits=phone.value.replace(/\D/g,'');if(!/^\+?[0-9() .-]+$/.test(phone.value.trim())||digits.length<7||digits.length>15)return fail(t('Vul een geldig telefoonnummer in, liefst met landcode.','Enter a valid phone number, preferably with country code.'),phone);if(!q.validity.valid||!Number.isInteger(Number(q.value)))return fail(t('Kies een aantal van 1 tot 20.','Choose a quantity from 1 to 20.'),q);}if(n===4&&!el('privacyConsent').checked)return fail(t('Bevestig dat je de privacyinformatie hebt gelezen.','Confirm you have read the privacy information.'),el('privacyConsent'));return true;}
 function showStep(n,focus=true){step=n;form.querySelectorAll('.form-step').forEach(p=>{const on=Number(p.dataset.step)===n;p.hidden=!on;p.classList.toggle('active',on);});document.querySelectorAll('.progress-step').forEach(p=>{const on=Number(p.dataset.step)===n;p.classList.toggle('active',on);if(on)p.setAttribute('aria-current','step');else p.removeAttribute('aria-current');});el('prevBtn').hidden=n===1;el('nextBtn').hidden=n===4;el('submitBtn').hidden=n!==4;clearError();if(n===4)updateSummary();if(focus){const h=form.querySelector('.form-step.active h2');h.tabIndex=-1;h.focus();h.scrollIntoView({block:'nearest'});}}
 if(form){if(sizeFor(query.get('height')))el('height').value=query.get('height');form.addEventListener('input',e=>{e.target.removeAttribute('aria-invalid');if(e.target.id==='height')advice(e.target.value,el('sizeAdvice'));updatePreview();updateSummary();});el('prevBtn').addEventListener('click',()=>{if(!busy)showStep(Math.max(1,step-1));});el('nextBtn').addEventListener('click',()=>{if(!busy&&valid(step))showStep(Math.min(4,step+1));});form.addEventListener('submit',async e=>{e.preventDefault();if(busy||sent)return;if(step!==4){if(valid(step))showStep(step+1);return;}for(const n of [1,3,4])if(!valid(n)){showStep(n);valid(n);return;}busy=true;const submitLabel=el('submitBtn').querySelector('[data-en]');submitLabel.textContent=t('Bezig met versturen…','Sending request…');el('submitBtn').disabled=true;el('prevBtn').disabled=true;el('language').disabled=true;form.setAttribute('aria-busy','true');const data=Object.fromEntries(new FormData(form));Object.assign(data,{model:currentModel().nl,stof:currentFabric().name,kleur:currentColor()[1],lichaamslengte:el('height').value||'Niet opgegeven',maatadvies:sizeFor(el('height').value)||'Niet opgegeven',aantal:quantity(),indicatieve_productprijs:'EUR '+(currentModel().price*quantity()).toFixed(2),naam:el('name').value.trim(),email:el('email').value.trim(),telefoon:el('phone').value.trim(),opmerkingen:el('notes').value.trim(),taal:lang,privacy:'Gelezen / aanvraag akkoord'});for(const k of ['height','name','phone','quantity','notes'])delete data[k];const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),30000);try{const res=await fetch(form.action,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data),signal:controller.signal});const result=await res.json();const message=typeof result.message==='string'?result.message:'';if(/activat|confirm your email|verify your email/i.test(message))throw Error('ACTIVATION');if(!res.ok||!(result.success===true||String(result.success).toLowerCase()==='true'))throw Error('UNCONFIRMED');sent=true;form.hidden=true;el('formProgress').hidden=true;const preview=document.querySelector('.request-preview');if(preview)preview.hidden=true;const success=el('formSuccess');success.hidden=false;success.classList.add('show');success.style.display='block';success.tabIndex=-1;success.style.scrollMarginTop='90px';success.focus({preventScroll:true});success.scrollIntoView({block:'start',behavior:'auto'});}catch(err){const msg=err.message==='ACTIVATION'?t('De aanvraagservice is nog niet geactiveerd. Je aanvraag is niet bevestigd. Neem contact op via Instagram.','The request service has not been activated yet. Your request was not confirmed. Please contact us on Instagram.'):t('We konden je aanvraag niet bevestigen. Controleer je verbinding of neem contact op via Instagram. Je ingevulde gegevens blijven staan.','We could not confirm your request. Check your connection or contact us on Instagram. Your details remain on this page.');fail(msg);const errorBox=el('formError');errorBox.tabIndex=-1;errorBox.style.scrollMarginTop='220px';errorBox.focus({preventScroll:true});errorBox.scrollIntoView({block:'center',behavior:'auto'});}finally{clearTimeout(timer);busy=false;form.removeAttribute('aria-busy');submitLabel.textContent=t('Aanvraag versturen','Send request');el('submitBtn').disabled=false;el('prevBtn').disabled=false;el('language').disabled=false;}});}
 applyLanguage();
});
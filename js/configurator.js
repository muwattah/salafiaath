const khimaarConfig = {
  contact: {
    instagram: 'https://www.instagram.com/salafiaath/',
    instagramHandle: '@salafiaath',
    whatsapp: ''
  },
  models: [
    { id: 'long', name: 'Long Khimaar', price: 39.95, previewScale: 1 },
    { id: 'extra-long', name: 'Extra Long Khimaar', price: 44.95, previewScale: 1.08 }
  ],
  coverages: [
    { id: 'standard', name: 'Standard', extra: 0, length: 0.86 },
    { id: 'long', name: 'Long', extra: 0, length: 0.94 },
    { id: 'extra', name: 'Extra Coverage', extra: 5, length: 1.04 }
  ],
  fabrics: [
    { id: 'nida', name: 'Nida', breath: 3, weight: 4, drape: 4, summer: 3, sheer: false },
    { id: 'medina', name: 'Medina Silk', breath: 4, weight: 3, drape: 5, summer: 4, sheer: false },
    { id: 'jazz', name: 'Jazz', breath: 4, weight: 2, drape: 4, summer: 5, sheer: false },
    { id: 'light', name: 'Lightweight', breath: 5, weight: 1, drape: 3, summer: 5, sheer: true }
  ],
  colors: [
    { id: 'black', name: 'Black', hex: '#141414' },
    { id: 'mocha', name: 'Mocha', hex: '#6B4F3A' },
    { id: 'olive', name: 'Olive', hex: '#4A5333' },
    { id: 'taupe', name: 'Taupe', hex: '#8A7A6B' },
    { id: 'navy', name: 'Navy', hex: '#1C2A44' },
    { id: 'chocolate', name: 'Chocolate', hex: '#3B2418' }
  ],
  chin: [
    { id: 'standard', name: 'Standaard' },
    { id: 'narrow', name: 'Smaller' },
    { id: 'wide', name: 'Ruimer' }
  ],
  head: [
    { id: 'standard', name: 'Standaard' },
    { id: 'custom', name: 'Eigen maat' }
  ],
  extras: { customSize: 3 },
  fitRules: [
    { min: 0, max: 149, size: 'XS' },
    { min: 150, max: 159, size: 'S' },
    { min: 160, max: 166, size: 'M' },
    { min: 167, max: 173, size: 'L' },
    { min: 174, max: 180, size: 'XL' },
    { min: 181, max: 250, size: 'XXL' }
  ]
};
function formatPrice(n){return '€'+n.toFixed(2).replace('.',',');}
function findSize(cm){var n=Number(cm);if(!n||n<120||n>220)return null;var rule=khimaarConfig.fitRules.find(function(r){return n>=r.min&&n<=r.max;});return rule?rule.size:null;}
function calcPrice(state){var model=khimaarConfig.models.find(function(m){return m.id===state.model;});var cov=khimaarConfig.coverages.find(function(c){return c.id===state.coverage;});var total=(model?model.price:0)+(cov?cov.extra:0);if(state.head==='custom')total+=khimaarConfig.extras.customSize;return total;}
function labelOf(list,id){var item=list.find(function(x){return x.id===id;});return item?item.name:'—';}
var cfgState={step:1,totalSteps:6,model:'long',height:'',coverage:'standard',fabric:'nida',color:'black',chin:'standard',head:'standard',headCm:''};
function dots(score){var html='<span class="score" aria-hidden="true">';for(var i=1;i<=5;i++)html+='<i class="'+(i<=score?'on':'')+'"></i>';return html+'</span>';}
function renderOptions(){
  document.getElementById('cfgModels').innerHTML=khimaarConfig.models.map(function(m){return '<button type="button" class="choice'+(cfgState.model===m.id?' is-on':'')+'" data-k="model" data-v="'+m.id+'"><strong>'+m.name+'</strong><span>'+formatPrice(m.price)+'</span></button>';}).join('');
  document.getElementById('cfgCoverage').innerHTML=khimaarConfig.coverages.map(function(c){return '<button type="button" class="choice'+(cfgState.coverage===c.id?' is-on':'')+'" data-k="coverage" data-v="'+c.id+'"><strong>'+c.name+'</strong><span>'+(c.extra?'+'+formatPrice(c.extra):'inbegrepen')+'</span></button>';}).join('');
  document.getElementById('cfgFabrics').innerHTML=khimaarConfig.fabrics.map(function(f){return '<button type="button" class="fabric'+(cfgState.fabric===f.id?' is-on':'')+'" data-k="fabric" data-v="'+f.id+'"><strong>'+f.name+'</strong><ul><li>Luchtigheid '+dots(f.breath)+'</li><li>Dikte '+dots(f.weight)+'</li><li>Drape '+dots(f.drape)+'</li><li>Zomer '+dots(f.summer)+'</li><li>Doorschijnend: '+(f.sheer?'ja':'nee')+'</li></ul></button>';}).join('');
  document.getElementById('cfgColors').innerHTML=khimaarConfig.colors.map(function(c){return '<button type="button" class="swatch'+(cfgState.color===c.id?' is-on':'')+'" data-k="color" data-v="'+c.id+'" style="--sw:'+c.hex+'" aria-label="'+c.name+'">'+'<span></span>'+c.name+'</button>';}).join('');
  document.getElementById('cfgChin').innerHTML=khimaarConfig.chin.map(function(c){return '<button type="button" class="choice slim'+(cfgState.chin===c.id?' is-on':'')+'" data-k="chin" data-v="'+c.id+'">'+c.name+'</button>';}).join('');
  document.getElementById('cfgHead').innerHTML=khimaarConfig.head.map(function(c){return '<button type="button" class="choice slim'+(cfgState.head===c.id?' is-on':'')+'" data-k="head" data-v="'+c.id+'">'+c.name+'</button>';}).join('');
}
function updateAdvice(elId,height){var size=findSize(height);var el=document.getElementById(elId);if(!el)return size;if(!height){el.textContent='Vul je lichaamslengte in centimeters in.';return null;}if(!size){el.textContent='Vul een lengte tussen 120 en 220 cm in.';return null;}el.textContent='Voor jouw lengte adviseren wij maat '+size+'.';return size;}
function updatePreview(){var color=khimaarConfig.colors.find(function(c){return c.id===cfgState.color;});var model=khimaarConfig.models.find(function(m){return m.id===cfgState.model;});var cov=khimaarConfig.coverages.find(function(c){return c.id===cfgState.coverage;});var root=document.getElementById('cfgPreview');if(!root)return;root.style.setProperty('--khimaar',color?color.hex:'#141414');var len=(cov?cov.length:0.9)*(model?model.previewScale:1);root.style.setProperty('--fall',String(len));var size=findSize(cfgState.height);var mark=document.getElementById('fitMark');if(mark){var h=Number(cfgState.height)||165;var t=Math.min(0.92,Math.max(0.55,0.58+(h-150)*0.006));mark.style.top=(t*100)+'%';mark.textContent=size?'valt ~ maat '+size:'lengte';}}
function updateSummary(){var size=findSize(cfgState.height)||'—';var price=calcPrice(cfgState);var rows=[['Model',labelOf(khimaarConfig.models,cfgState.model)],['Kleur',labelOf(khimaarConfig.colors,cfgState.color)],['Stof',labelOf(khimaarConfig.fabrics,cfgState.fabric)],['Lichaamslengte',cfgState.height?cfgState.height+' cm':'—'],['Aanbevolen maat',size],['Dekking',labelOf(khimaarConfig.coverages,cfgState.coverage)],['Kinopening',labelOf(khimaarConfig.chin,cfgState.chin)],['Hoofdomtrek',cfgState.head==='custom'&&cfgState.headCm?cfgState.headCm+' cm':labelOf(khimaarConfig.head,cfgState.head)]];document.getElementById('cfgSummary').innerHTML=rows.map(function(r){return '<li><span>'+r[0]+'</span><strong>'+r[1]+'</strong></li>';}).join('');document.getElementById('cfgPrice').textContent=formatPrice(price);document.getElementById('cfgLivePrice').textContent=formatPrice(price);}
function orderText(){var size=findSize(cfgState.height)||'—';return ['Assalamu alaykum,','','Ik wil graag deze Salafiaath khimaar bestellen:','','Model: '+labelOf(khimaarConfig.models,cfgState.model),'Kleur: '+labelOf(khimaarConfig.colors,cfgState.color),'Stof: '+labelOf(khimaarConfig.fabrics,cfgState.fabric),'Lichaamslengte: '+(cfgState.height?cfgState.height+' cm':'—'),'Aanbevolen maat: '+size,'Dekking: '+labelOf(khimaarConfig.coverages,cfgState.coverage),'Kinopening: '+labelOf(khimaarConfig.chin,cfgState.chin),'Hoofdomtrek: '+(cfgState.head==='custom'&&cfgState.headCm?cfgState.headCm+' cm':labelOf(khimaarConfig.head,cfgState.head)),'Prijs: '+formatPrice(calcPrice(cfgState))].join('\n');}
function showStep(n){cfgState.step=n;document.querySelectorAll('.cfg-pane').forEach(function(p){p.hidden=Number(p.getAttribute('data-step'))!==n;});document.getElementById('cfgBar').style.width=(((n-1)/(cfgState.totalSteps-1))*100)+'%';document.getElementById('cfgStepLabel').textContent='Stap '+n+' van '+cfgState.totalSteps;document.getElementById('cfgPrev').disabled=n===1;document.getElementById('cfgNext').hidden=n===cfgState.totalSteps;document.getElementById('cfgOrderWrap').hidden=n!==cfgState.totalSteps;document.getElementById('cfgCustomHead').hidden=cfgState.head!=='custom';if(n===cfgState.totalSteps)updateSummary();updatePreview();}
function openConfigurator(){var modal=document.getElementById('configurator');modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';renderOptions();showStep(1);}
function closeConfigurator(){var modal=document.getElementById('configurator');modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.addEventListener('DOMContentLoaded',function(){
  renderOptions();updatePreview();updateSummary();
  document.getElementById('cfgChoices').addEventListener('click',function(e){var btn=e.target.closest('[data-k]');if(!btn)return;cfgState[btn.getAttribute('data-k')]=btn.getAttribute('data-v');renderOptions();document.getElementById('cfgCustomHead').hidden=cfgState.head!=='custom';updatePreview();updateSummary();});
  document.getElementById('cfgHeight').addEventListener('input',function(e){cfgState.height=e.target.value;updateAdvice('cfgFitMsg',cfgState.height);updatePreview();updateSummary();});
  document.getElementById('cfgHeadCm').addEventListener('input',function(e){cfgState.headCm=e.target.value;updateSummary();});
  document.getElementById('cfgNext').addEventListener('click',function(){if(cfgState.step===2&&!findSize(cfgState.height)){updateAdvice('cfgFitMsg',cfgState.height);document.getElementById('cfgHeight').focus();return;}showStep(Math.min(cfgState.totalSteps,cfgState.step+1));});
  document.getElementById('cfgPrev').addEventListener('click',function(){showStep(Math.max(1,cfgState.step-1));});
  document.querySelectorAll('[data-open-config]').forEach(function(btn){btn.addEventListener('click',openConfigurator);});
  document.getElementById('cfgClose').addEventListener('click',closeConfigurator);
  document.getElementById('configurator').addEventListener('click',function(e){if(e.target.id==='configurator')closeConfigurator();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeConfigurator();});
  document.getElementById('cfgOrder').addEventListener('click',function(){var text=orderText();var wa=khimaarConfig.contact.whatsapp;if(wa){window.open('https://wa.me/'+wa+'?text='+encodeURIComponent(text),'_blank','noopener');return;}if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).catch(function(){});}window.open(khimaarConfig.contact.instagram,'_blank','noopener');var note=document.getElementById('cfgCopied');note.hidden=false;note.textContent='Bestelling gekopieerd. Plak de tekst in Instagram DM '+khimaarConfig.contact.instagramHandle+'.';});
  var mini=document.getElementById('fitFinderInput');if(mini){mini.addEventListener('input',function(e){updateAdvice('fitFinderMsg',e.target.value);var size=findSize(e.target.value);var bar=document.getElementById('fitFinderBar');if(!bar)return;var h=Number(e.target.value)||160;bar.style.height=Math.min(100,Math.max(8,(h-145)*2.2))+'%';bar.setAttribute('data-size',size||'');});}
});

const input = document.getElementById('opt-folder');
const choose = document.getElementById('opt-choose');
const save = document.getElementById('opt-save');
const reset = document.getElementById('opt-reset');
const status = document.getElementById('opt-status');

function setStatus(t, ok=true){status.textContent=t;status.style.color=ok?'#0a0':'#a00'}

chrome.storage.local.get(['soura_folder'], (res)=>{
  if(res && res.soura_folder) input.value = res.soura_folder;
});

choose.addEventListener('click', async ()=>{
  try {
    if('showDirectoryPicker' in window){
      const handle = await window.showDirectoryPicker({ mode:'read' });
      if(handle && handle.name){ input.value = handle.name; setStatus('Folder selected'); setTimeout(()=>setStatus(''),1500) }
    }else{
      const v = prompt('Enter folder inside Downloads (e.g., Soura/Images):', input.value || 'Soura/Images');
      if(v!==null){ input.value = v.trim(); setStatus('Folder set (not saved)'); setTimeout(()=>setStatus(''),1500) }
    }
  } catch(e){ setStatus('Selection cancelled', false); setTimeout(()=>setStatus(''),1500) }
});

save.addEventListener('click', ()=>{
  const v = (input.value||'').trim();
  if(v){ chrome.storage.local.set({soura_folder:v}, ()=>{ setStatus('Saved ✔'); setTimeout(()=>setStatus(''),1500) }); }
  else{ chrome.storage.local.remove('soura_folder', ()=>{ setStatus('Reset to default (Downloads) ✔'); setTimeout(()=>setStatus(''),1500) }); }
});

reset.addEventListener('click', ()=>{
  input.value='';
  chrome.storage.local.remove('soura_folder', ()=>{ setStatus('Reset to default (Downloads) ✔'); setTimeout(()=>setStatus(''),1500) });
});

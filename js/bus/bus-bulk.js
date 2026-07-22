// ============================================================
// BUS-BULK.JS - BUS Bulk Service
// ============================================================

var bkCalYear, bkCalMonth, bkSelectedDate = null;
var BK_DOWS = ["B","E","Ç","A","C","Ş","B"];
var BK_MONTHS = ["Yanvar","Fevral","Mart","Aprel","May","İyun","İyul","Avqust","Sentyabr","Oktyabr","Noyabr","Dekabr"];
var bkPreviewData = null;
var bkFormDataLoaded = false;

function init_bus_bulk() {
  var now = bakuNowDate();
  document.getElementById("bkDateDisplay").textContent = 
    String(now.getDate()).padStart(2,"0")+"."+String(now.getMonth()+1).padStart(2,"0")+"."+now.getFullYear();
  document.getElementById("bk_date_picker").value = now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+String(now.getDate()).padStart(2,"0");

  document.getElementById("bus-bus-bulkContainer").style.display = "flex";
  ensureBulkFormData();
  if(!bkSelectedDate){
    bkCalYear = now.getFullYear(); bkCalMonth = now.getMonth();
    bkSelectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    renderBkCal();
  }
}

function closeBusBulk(){
  document.getElementById("bus-bus-bulkContainer").style.display = "none";
  document.getElementById("bus-bus-serviceContainer").style.display = "block";
}

function bkDateChanged(val){
  if(!val) return;
  var parts = val.split("-");
  var d = new Date(+parts[0], +parts[1]-1, +parts[2]);
  bkSelectedDate = d;
  document.getElementById("bkDateDisplay").textContent = 
    String(d.getDate()).padStart(2,"0")+"."+String(d.getMonth()+1).padStart(2,"0")+"."+d.getFullYear();
  renderBkCal();
}

function ensureBulkFormData(){
  if(bsFormData && bsFormData.carriers){ bkFillSelects(); bkFormDataLoaded=true; return; }
  fetch(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"getFormData"})})
    .then(function(r){return r.json();})
    .then(function(d){ if(d.status==="OK"){ bsFormData=d; } bkFillSelects(); bkFormDataLoaded=true; });
}

function bkFillSelects(){
  var d = bsFormData || {};
  bkFillSel("bk_carrier",  d.carriers,     "Seçin");
  bkFillSel("bk_category", d.busEquipment, "Seçin");
  bkFillSel("bk_location", d.locations,    "Seçin (könüllü)");
  bkFillSel("bk_tech1",    d.technicians,  "Seçin");
  bkFillSel("bk_tech2",    d.technicians,  "Seçin");
  bkFillSel("bk_leader",   d.leaders,      "Seçin");
  var locEl = document.getElementById("bk_location");
  if(locEl) locEl.onchange = function(){
    var isDigar = (this.value||"").toLowerCase().indexOf("digər") !== -1;
    document.getElementById("bk_location_note_wrap").style.display = isDigar ? "block" : "none";
  };
}

function bkFillSel(id, arr, placeholder){
  var el = document.getElementById(id); if(!el) return;
  el.innerHTML = '<option value="">'+placeholder+'</option>' + (arr||[]).map(function(x){ return '<option value="'+escapeHtml(x)+'">'+escapeHtml(x)+'</option>'; }).join("");
}

function renderBkCal(){
  document.getElementById("bkCalLabel").textContent = BK_MONTHS[bkCalMonth] + " " + bkCalYear;
  var grid = document.getElementById("bkCalGrid"); grid.innerHTML = "";
  BK_DOWS.forEach(function(d){ var el=document.createElement("div"); el.className="bk-cal-dow"; el.textContent=d; grid.appendChild(el); });
  var firstDay = new Date(bkCalYear, bkCalMonth, 1);
  var startOffset = (firstDay.getDay()+6)%7;
  var daysInMonth = new Date(bkCalYear, bkCalMonth+1, 0).getDate();
  var daysInPrev  = new Date(bkCalYear, bkCalMonth, 0).getDate();
  var today = bakuNowDate();
  for(var i=0;i<startOffset;i++){ var el=document.createElement("div"); el.className="bk-cal-day muted"; el.textContent=daysInPrev-startOffset+i+1; grid.appendChild(el); }
  for(var d=1;d<=daysInMonth;d++){
    (function(day){
      var el=document.createElement("div"); el.className="bk-cal-day"; el.textContent=day;
      var thisDate=new Date(bkCalYear,bkCalMonth,day);
      if(bkSameDay(thisDate,today)) el.classList.add("today");
      if(bkSelectedDate && bkSameDay(thisDate,bkSelectedDate)) el.classList.add("selected");
      el.onclick=function(){ bkSelectedDate=thisDate; renderBkCal(); };
      grid.appendChild(el);
    })(d);
  }
}

function bkSameDay(a,b){ return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate(); }

function bkCalNav(dir){ bkCalMonth+=dir; if(bkCalMonth<0){bkCalMonth=11;bkCalYear--;} if(bkCalMonth>11){bkCalMonth=0;bkCalYear++;} renderBkCal(); }

function bkDateIso(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }

function bkDateAz(d){ return String(d.getDate()).padStart(2,"0")+"."+String(d.getMonth()+1).padStart(2,"0")+"."+d.getFullYear(); }

function bkFormatTime(el){
  var digits=el.value.replace(/[^0-9]/g,"").slice(0,4);
  el.value=digits.length>2?digits.slice(0,2)+":"+digits.slice(2):digits;
}

function bkGetTime(id){ var v=(document.getElementById(id).value||"").trim(); return /^([01]\d|2[0-3]):[0-5]\d$/.test(v)?v:""; }

function bkOnCarrierChange(){
  var carrier=document.getElementById("bk_carrier").value;
  var wrap=document.getElementById("bkCarrierCountWrap");
  bkPreviewData=null; bkClosePreview();
  if(!carrier){ wrap.innerHTML=""; return; }
  var matches=(bsFormData.busRegistry||[]).filter(function(r){ return String(r.carrier||"").trim().toLowerCase()===carrier.trim().toLowerCase(); });
  if(matches.length===0){
    wrap.innerHTML='<div class="bk-count-badge empty"><div class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><div><div class="bk-count-num">0</div><div class="bk-count-txt">Bu daşıyıcıya aid reyestrdə avtobus tapılmadı</div></div></div>';
  } else {
    wrap.innerHTML='<div class="bk-count-badge"><div class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M3 16V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9"/><path d="M3 16h18"/><circle cx="7" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></svg></div><div><div class="bk-count-num">'+matches.length+'</div><div class="bk-count-txt">avtobus tapıldı</div></div></div>';
  }
}

function bkCollectData(){
  return {
    carrier: document.getElementById("bk_carrier").value,
    report_date: bkSelectedDate ? bkDateIso(bkSelectedDate) : "",
    service_start_time: bkGetTime("bk_start_time"),
    service_end_time: bkGetTime("bk_end_time"),
    changed_device_type: document.getElementById("bk_category").value,
    service_location: document.getElementById("bk_location").value,
    service_location_note: document.getElementById("bk_location_note").value,
    request_template: document.getElementById("bk_request_tmpl").value.trim(),
    note: document.getElementById("bk_note").value.trim(),
    solution_template: document.getElementById("bk_solution_tmpl").value.trim(),
    technician_1: document.getElementById("bk_tech1").value,
    technician_2: document.getElementById("bk_tech2").value,
    team_leader: document.getElementById("bk_leader").value
  };
}

function bkValidate(data){
  if(!data.carrier)              return "Daşıyıcı firma seçilməyib";
  if(!data.report_date)         return "Servis tarixi seçilməyib";
  if(!data.service_start_time)  return "Servis başlanğıc saatı düzgün deyil";
  if(!data.service_end_time)    return "Servis bitiş saatı düzgün deyil";
  if(!data.changed_device_type) return "Servis kateqoriyası seçilməyib";
  if(!data.request_template)    return "Tələb (şablon) mətni boşdur";
  if(!data.solution_template)   return "Həll (şablon) mətni boşdur";
  if(!data.team_leader)         return "Qrup rəhbəri seçilməyib";
  if(data.service_location && data.service_location.toLowerCase().indexOf("digər")!==-1 && !data.service_location_note) return "Ünvan qeydi yazın";
  return null;
}

function bkOpenPreview(){
  var data=bkCollectData(); var err=bkValidate(data); if(err){alert(err);return;}
  document.getElementById("bkGrid").classList.add("preview-open");
  var panel=document.getElementById("bkPreviewPanel");
  panel.innerHTML='<div class="bk-loading-mini"><div class="spinner" style="width:38px;height:38px;border-width:4px;"></div><div style="font-size:13px;color:#5C7089;font-weight:600;">Hazırlanır...</div></div>';
  fetch(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"previewBulkImport",data:data})})
  .then(function(r){return r.json();})
  .then(function(d){
    if(d.status!=="OK"){panel.innerHTML=bkEmptyHtml(d.message||"Xəta baş verdi");return;}
    bkPreviewData=d; renderBkPreviewPanel(data,d);
  })
  .catch(function(e){panel.innerHTML=bkEmptyHtml("Şəbəkə xətası: "+e.message);});
}

function bkClosePreview(){
  document.getElementById("bkGrid").classList.remove("preview-open");
}

function bkEmptyHtml(msg){
  return '<div class="bk-preview-head"><div class="bk-preview-title">Ön baxış</div><button class="bk-preview-close" onclick="bkClosePreview()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="bk-empty-state"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div>'+escapeHtml(msg)+'</div></div>';
}

function renderBkPreviewPanel(data, previewResult){
  var count=previewResult.count||0, sample=previewResult.sample||[];
  var html='<div class="bk-preview-head"><div class="bk-preview-title">Ön baxış</div><button class="bk-preview-close" onclick="bkClosePreview()" aria-label="Bağla"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>';
  html+='<div class="bk-preview-body">';
  html+='<div class="bk-carrier-card"><div class="bk-carrier-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 16V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9"/><path d="M3 16h18"/><circle cx="7" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></svg></div><div><div class="bk-carrier-name">"'+escapeHtml(data.carrier)+'"</div><div class="bk-carrier-count">'+count+' avtobus tapıldı</div></div></div>';
  if(count===0){
    html+='<div class="bk-empty-state" style="padding:30px 10px;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div>Bu daşıyıcıya aid reyestrdə avtobus tapılmadı. İdxal etmək mümkün deyil.</div></div></div>';
    document.getElementById("bkPreviewPanel").innerHTML=html; return;
  }
  var pvRows=[
    ["Servis tarixi", bkDateAz(bkSelectedDate)],
    ["Başlanğıc - Bitiş", data.service_start_time+" - "+data.service_end_time],
    ["Servis kateqoriyası", data.changed_device_type],
    ["Servis ünvanı", data.service_location?(data.service_location+(data.service_location_note?" ("+data.service_location_note+")" : "")):"—"],
    ["Texniklər", [data.technician_1,data.technician_2].filter(Boolean).join(", ")||"—"],
    ["Qrup rəhbəri", data.team_leader],
    ["Tələb (şablon)", data.request_template],
    ["Həll (şablon)", data.solution_template]
  ];
  if(data.note) pvRows.splice(7,0,["Qeyd",data.note]);
  pvRows.forEach(function(r){ html+='<div class="bk-pv-row"><div class="bk-pv-label">'+r[0]+':</div><div class="bk-pv-value">'+escapeHtml(r[1])+'</div></div>'; });
  html+='<div class="bk-pv-section-title">Nümunə siyahı (ilk '+sample.length+' sətir)</div>';
  html+='<table class="bk-sample-table"><thead><tr><th>BUS ID</th><th>D.Q.N.</th><th>Marka / Model</th></tr></thead><tbody>';
  sample.forEach(function(s){ html+='<tr><td>'+escapeHtml(s.busId)+'</td><td>'+escapeHtml(s.dqn)+'</td><td>'+escapeHtml(s.model)+'</td></tr>'; });
  html+='</tbody></table>';
  if(count>sample.length) html+='<div class="bk-sample-more">... və daha <b>'+(count-sample.length)+'</b> avtobus</div>';
  html+='</div>';
  html+='<div class="bk-preview-footer"><button class="bk-btn-outline" onclick="bkClosePreview()">Ləğv et</button><button class="bk-btn-primary" onclick="bkConfirmImport()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>İdxal et ('+count+' ticket)</button></div>';
  document.getElementById("bkPreviewPanel").innerHTML=html;
}

function bkConfirmImport(){
  var data=bkCollectData(); var err=bkValidate(data); if(err){alert(err);return;}
  if(!bkPreviewData||bkPreviewData.count===0){alert("İdxal ediləcək avtobus yoxdur");return;}
  bkRunImport(data,bkPreviewData.count);
}

function bkSubmitDirect(){
  var data=bkCollectData(); var err=bkValidate(data); if(err){alert(err);return;}
  var btn=document.getElementById("bkDirectSubmitBtn"); btn.disabled=true;
  fetch(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"previewBulkImport",data:data})})
  .then(function(r){return r.json();})
  .then(function(d){
    btn.disabled=false;
    if(d.status!=="OK"){alert(d.message||"Xəta baş verdi");return;}
    if(d.count===0){alert('"'+data.carrier+'" daşıyıcısına aid reyestrdə avtobus tapılmadı.');return;}
    if(!confirm(d.count+" avtobus üçün ticket yaradılacaq. Davam edilsin?")) return;
    bkRunImport(data,d.count);
  })
  .catch(function(e){btn.disabled=false;alert("Şəbəkə xətası: "+e.message);});
}

function bkRunImport(data,count){
  var ov=document.getElementById("bkLoadingOverlay");
  var sp=document.getElementById("bkSpinner");
  var ic=document.getElementById("bkSuccessIcon");
  var tx=document.getElementById("bkLoadingText");
  ov.classList.add("open"); sp.style.display="block"; ic.style.display="none";
  tx.textContent=count+" ticket idxal edilir...";
  fetch(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"submitBulkImport",data:data,userEmail:currentUser?currentUser.email:""})})
  .then(function(r){return r.json();})
  .then(function(result){
    sp.style.display="none"; ic.style.display="flex";
    if(result.status==="OK"){
      tx.textContent="İdxal tamamlandı! "+result.count+" ticket ("+result.firstTicketId+" → "+result.lastTicketId+")";
    } else { tx.textContent="Xəta: "+(result.message||""); }
    setTimeout(function(){ ov.classList.remove("open"); if(result.status==="OK"){ resetBulkForm(); closeBusBulk(); } },2200);
  })
  .catch(function(e){ sp.style.display="none"; tx.textContent="Şəbəkə xətası"; setTimeout(function(){ov.classList.remove("open");},1500); });
}

function resetBulkForm(){
  bkClosePreview(); bkPreviewData=null;
  ["bk_carrier","bk_category","bk_location","bk_tech1","bk_tech2","bk_leader"].forEach(function(id){ var el=document.getElementById(id); if(el)el.value=""; });
  ["bk_location_note","bk_request_tmpl","bk_note","bk_solution_tmpl","bk_start_time","bk_end_time"].forEach(function(id){ var el=document.getElementById(id); if(el)el.value=""; });
  document.getElementById("bk_location_note_wrap").style.display="none";
  document.getElementById("bkCarrierCountWrap").innerHTML="";
  var now=bakuNowDate();
  bkCalYear=now.getFullYear(); bkCalMonth=now.getMonth();
  bkSelectedDate=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  renderBkCal();
}
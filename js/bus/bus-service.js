// ============================================================
// BUS-SERVICE.JS - BUS Service forması
// ============================================================

var bsFormData = {};
var bsFormDirty = false;
var bsNextTicketId = "";
var bsRegistryLocked = false;
var bsSelected = {
  carrier:"", brand:"", problem:"", solution:[], equipment:"", location:"", tech1:"", tech2:"", leader:""
};
var activeDDKey = null;
var bsEditMode = false;
var bsEditTicketId = null;
var bsReturnTarget = "dashboard";

// ===== DROPDOWN META =====
var ddMeta = {
  carrier:   { lbl:"bs_carrier_lbl",   list:"dd_carrier_list",   multi:false, onSelect: null },
  brand:     { lbl:"bs_brand_lbl",     list:"dd_brand_list",     multi:false, onSelect: null },
  equipment: { lbl:"bs_equipment_lbl", list:"dd_equipment_list", multi:false, onSelect: null },
  problem:   { lbl:"bs_problem_lbl",   list:"dd_problem_list",   multi:false, onSelect: onProblemSelect },
  solution:  { lbl:"bs_solution_lbl",  list:"dd_solution_list",  multi:true,  onSelect: onSolutionSelect },
  location:  { lbl:"bs_location_lbl",  list:"dd_location_list",  multi:false, onSelect: onLocationSelect },
  tech1:     { lbl:"bs_tech1_lbl",     list:"dd_tech1_list",     multi:false, onSelect: null },
  tech2:     { lbl:"bs_tech2_lbl",     list:"dd_tech2_list",     multi:false, onSelect: null },
  leader:    { lbl:"bs_leader_lbl",    list:"dd_leader_list",    multi:false, onSelect: null }
};

// ===== INIT =====
function init_bus_service() {
  // Overlay göstər
  var ov = document.getElementById("busOpenOverlay");
  ov.style.display = "flex";
  
  preloadBusData(function(){
    ov.style.display = "none";
    openBusService();
  });
}

// ===== DATA YÜKLƏ =====
function preloadBusData(callback){
  setTimeout(callback, 900);
  fetch(API_URL, {
    method:"POST",
    headers:{"Content-Type":"text/plain;charset=utf-8"},
    body:JSON.stringify({action:"getFormData"})
  })
  .then(function(r){ return r.json(); })
  .then(function(d){
    if(d.status === "OK"){
      bsFormData = d;
      var tid = d.nextTicketId || "BUS-00001";
      bsNextTicketId = tid;
      updateTicketBadge();
    }
  })
  .catch(function(){ /* offline */ });
}

function updateTicketBadge(){
  var badge = document.getElementById("bsTicketBadge");
  if(badge && !bsEditMode){
    badge.innerHTML = '<span style="display:inline-flex;align-items:center;background:#2F6FED;border-radius:10px;padding:6px 16px;font-family:IBM Plex Mono,monospace;font-weight:700;font-size:14px;color:#FFFFFF;letter-spacing:1px;">' + (bsNextTicketId || "---") + '</span>';
  }
}

// ===== FORM AÇ =====
function openBusService(){
  bsEditMode = false;
  bsEditTicketId = null;
  bsReturnTarget = "dashboard";

  var now = new Date();
  var bParts = new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Baku",year:"numeric",month:"2-digit",day:"2-digit"}).format(now);

  resetBusFormFields();
  document.getElementById("bs_date").value = bParts;

  // Bulk banner görünürlüyü
  var _bkLvl = getAccessLevel(currentUser ? currentUser.role : "");
  var _bkWrap = document.getElementById("bsBulkBannerWrap");
  if(_bkWrap) _bkWrap.style.display = (_bkLvl === "leader" || _bkLvl === "admin") ? "block" : "none";

  var draft = loadBsDraft();
  if(draft){ offerBsDraftRestore(draft); }

  var btn = document.getElementById("bsSubmitBtn");
  if(btn) btn.textContent = "Göndər";

  updateTicketBadge();
}

function resetBusFormFields(){
  ["bs_time_lbl","bs_start_lbl","bs_end_lbl"].forEach(function(id){
    var el = document.getElementById(id);
    if(el){ el.value = ""; }
  });

  bsFormDirty = false;
  bsSelected = {carrier:"",brand:"",problem:"",solution:[],equipment:"",location:"",tech1:"",tech2:"",leader:""};

  Object.keys(ddMeta).forEach(function(k){
    var m = ddMeta[k];
    var el = document.getElementById(m.lbl);
    if(el){
      el.textContent = (k==="tech2"||k==="tech1") ? "Seçin (könüllü)" : k==="solution" ? "Seçin (çoxlu seçim)" : "Seçin";
      el.style.color = "#9AACC4";
      el.classList.remove("filled");
    }
    closeDD(k);
  });

  ["bs_requester","bs_phone","bs_route","bs_busid","bs_plate","bs_old_sn","bs_new_sn","bs_note","bs_location_note"].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.value = "";
  });
  document.getElementById("bs_solution_chips").innerHTML = "";
  document.getElementById("bs_location_note_wrap").style.display = "none";
  unlockRegistryFields();
  closeBusRegistryDD();
}

// ===== DROPDOWN FUNKSİYALARI =====
function toggleDD(key){
  if((key==="carrier" || key==="brand") && bsRegistryLocked) return;
  if(activeDDKey && activeDDKey !== key){ closeDD(activeDDKey); }
  var listEl = document.getElementById("dd_" + key + "_list");
  var arrow  = document.getElementById("dd_" + key + "_arrow");
  if(!listEl) return;
  var isOpen = listEl.classList.contains("open");
  if(isOpen){
    closeDD(key);
  } else {
    renderDD(key);
    listEl.classList.add("open");
    if(arrow) arrow.style.transform = "rotate(180deg)";
    activeDDKey = key;
  }
}

function closeDD(key){
  var listEl = document.getElementById("dd_" + key + "_list");
  var arrow  = document.getElementById("dd_" + key + "_arrow");
  if(listEl) listEl.classList.remove("open");
  if(arrow)  arrow.style.transform = "";
  if(activeDDKey === key) activeDDKey = null;
}

function closeAllDD(){
  Object.keys(ddMeta).forEach(function(k){ closeDD(k); });
}

document.addEventListener("click", function(e){
  if(!e.target.closest(".bs-inline-dd") && !e.target.closest("#bs_time_wrap")){
    closeAllDD();
  }
});

function renderDD(key){
  var meta = ddMeta[key];
  var listEl = document.getElementById(meta.list);
  if(!listEl) return;
  var items = getListForKey(key);
  listEl.innerHTML = "";

  items.forEach(function(item){
    var div = document.createElement("div");
    div.className = "bs-dd-item";
    var isMulti = meta.multi;
    var isSelected = isMulti
      ? (bsSelected[key].indexOf(item) !== -1)
      : (bsSelected[key] === item);
    if(isSelected) div.classList.add("selected");

    if(isMulti){
      div.innerHTML = '<div class="bs-dd-check">'
        + (isSelected ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M4 12l6 6L20 6"/></svg>' : '')
        + '</div><span>' + item + '</span>';
    } else {
      div.innerHTML = (isSelected
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2F6FED" stroke-width="2.5"><path d="M4 12l6 6L20 6"/></svg>'
        : '<div style="width:14px;"></div>')
        + '<span>' + item + '</span>';
    }
    div.addEventListener("click", function(e){ e.stopPropagation(); selectDDItem(key, item); });
    listEl.appendChild(div);
  });

  if(meta.multi){
    var done = document.createElement("button");
    done.type = "button";
    done.className = "bs-dd-done";
    done.textContent = "Təsdiqlə";
    done.addEventListener("click", function(e){ e.stopPropagation(); closeDD(key); });
    listEl.appendChild(done);
  }
}

function getListForKey(key){
  var map = {
    carrier:   bsFormData.carriers || [],
    brand:     bsFormData.busModels || [],
    equipment: bsFormData.busEquipment || [],
    problem:   bsFormData.busProblems || [],
    solution:  bsFormData.solutions || [],
    location:  bsFormData.locations || [],
    tech1:     bsFormData.technicians || [],
    tech2:     bsFormData.technicians || [],
    leader:    bsFormData.leaders || []
  };
  return map[key] || [];
}

function selectDDItem(key, item){
  var meta = ddMeta[key];
  bsFormDirty = true;
  scheduleBsDraftSave();

  if(meta.multi){
    var arr = bsSelected[key];
    var idx = arr.indexOf(item);
    if(idx !== -1) arr.splice(idx, 1); else arr.push(item);
    renderDD(key);
    updateMultiLabel(key);
    if(meta.onSelect) meta.onSelect(item);
  } else {
    bsSelected[key] = item;
    var lblEl = document.getElementById(meta.lbl);
    if(lblEl){
      lblEl.textContent = item;
      lblEl.style.color = "#12233B";
      lblEl.classList.add("filled");
    }
    if(meta.onSelect) meta.onSelect(item);
    closeDD(key);
  }
}

function updateMultiLabel(key){
  var arr = bsSelected[key];
  var meta = ddMeta[key];
  var lblEl = document.getElementById(meta.lbl);
  if(lblEl){
    lblEl.textContent = arr.length ? arr.length + " seçim" : "Seçin (çoxlu seçim)";
    lblEl.style.color = arr.length ? "#12233B" : "#9AACC4";
    if(arr.length) lblEl.classList.add("filled");
    else lblEl.classList.remove("filled");
  }
}

function onProblemSelect(item){ /* qeyd sahəsi lazım deyil */ }
function onSolutionSelect(item){ updateSolutionChips(); }
function onLocationSelect(item){
  var isDigar = item.toLowerCase().indexOf("digər") !== -1;
  document.getElementById("bs_location_note_wrap").style.display = isDigar ? "block" : "none";
  if(!isDigar) document.getElementById("bs_location_note").value = "";
}

function updateSolutionChips(){
  var arr = bsSelected.solution;
  var chips = document.getElementById("bs_solution_chips");
  chips.innerHTML = "";
  arr.forEach(function(a){
    var c = document.createElement("span");
    c.className = "bs-chip";
    c.textContent = a.length > 32 ? a.slice(0,32)+"…" : a;
    chips.appendChild(c);
  });
}

// ===== SAAT FORMATI =====
function formatTimeInput(el){
  var digits = el.value.replace(/[^0-9]/g,"").slice(0,4);
  var formatted = digits.length > 2 ? digits.slice(0,2)+":"+digits.slice(2) : digits;
  el.value = formatted;
  el.setSelectionRange(formatted.length, formatted.length);
  bsFormDirty = true;
}

function getTimeInputValue(id){
  var el = document.getElementById(id);
  if(!el) return "";
  var v = el.value.trim();
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(v) ? v : "";
}

function setTimeInputValue(id, hhmm){
  var el = document.getElementById(id);
  if(el && hhmm) el.value = hhmm;
}

function getTimeValue(){ return getTimeInputValue("bs_time_lbl"); }

// ===== DQN REGISTRY =====
function normalizeDqn(s){
  return String(s||"").toUpperCase().replace(/[^0-9A-Z]/g,"")
    .replace(/^(\d{2})([A-Z]{2})(\d{3})$/, "$1-$2-$3")
    || String(s||"").toUpperCase();
}

function filterBusRegistry(query){
  var reg = (bsFormData && bsFormData.busRegistry) || [];
  if(!query || query.length < 2) return [];
  var q = query.toUpperCase().replace(/\s/g,"");
  return reg.filter(function(r){
    var dqn = String(r.dqn||"").toUpperCase().replace(/\s/g,"");
    return dqn.indexOf(q) === 0;
  });
}

function renderBusRegistryDropdown(matches){
  var dd = document.getElementById("bs_registry_dd");
  if(!dd) return;
  if(!matches.length){
    dd.innerHTML = '<div class="bs-registry-empty">Uyğun D.Q.N. tapılmadı</div>';
  } else {
    dd.innerHTML = matches.slice(0,8).map(function(m){
      return '<div class="bs-registry-item" data-dqn="'+ (m.dqn||"") +'">'
        + '<span class="reg-id">'+ (m.dqn||"—") +'</span>'
        + '<span class="reg-meta">BUS ID: '+ (m.id||"—") +' · '+ (m.carrier||"—") +' · '+ (m.model||"—") +'</span>'
        + '</div>';
    }).join("");
    Array.from(dd.querySelectorAll(".bs-registry-item")).forEach(function(el){
      el.addEventListener("click", function(e){
        e.stopPropagation();
        var dqn = el.getAttribute("data-dqn");
        var match = matches.find(function(m){ return String(m.dqn) === String(dqn); });
        if(match) selectBusRegistryMatch(match);
      });
    });
  }
  dd.classList.add("open");
}

function closeBusRegistryDD(){
  var dd = document.getElementById("bs_registry_dd");
  if(dd) dd.classList.remove("open");
}

function selectBusRegistryMatch(match){
  document.getElementById("bs_plate").value = match.dqn || "";
  document.getElementById("bs_busid").value = match.id || "";
  if(match.carrier) setDDValue("carrier", match.carrier);
  if(match.model)   setDDValue("brand",   match.model);
  closeBusRegistryDD();
  lockRegistryFields();
  bsFormDirty = true;
  scheduleBsDraftSave();
}

function lockRegistryFields(){
  bsRegistryLocked = true;
  document.getElementById("bs_busid").classList.add("bs-locked");
  document.getElementById("bs_busid").setAttribute("readonly","readonly");
  document.getElementById("bs_carrier_btn").classList.add("bs-locked");
  document.getElementById("bs_brand_btn").classList.add("bs-locked");
  document.getElementById("bs_registry_reset").classList.add("show");
}

function unlockRegistryFields(){
  bsRegistryLocked = false;
  var busidEl = document.getElementById("bs_busid");
  busidEl.classList.remove("bs-locked");
  busidEl.removeAttribute("readonly");
  document.getElementById("bs_carrier_btn").classList.remove("bs-locked");
  document.getElementById("bs_brand_btn").classList.remove("bs-locked");
  document.getElementById("bs_registry_reset").classList.remove("show");
}

function resetRegistrySelection(){
  document.getElementById("bs_plate").value = "";
  document.getElementById("bs_busid").value = "";
  bsSelected.carrier = "";
  var cLbl = document.getElementById("bs_carrier_lbl");
  if(cLbl){ cLbl.textContent="Seçin"; cLbl.style.color="#9AACC4"; cLbl.classList.remove("filled"); }
  bsSelected.brand = "";
  var bLbl = document.getElementById("bs_brand_lbl");
  if(bLbl){ bLbl.textContent="Seçin"; bLbl.style.color="#9AACC4"; bLbl.classList.remove("filled"); }
  unlockRegistryFields();
  closeBusRegistryDD();
  bsFormDirty = true;
  scheduleBsDraftSave();
}

// ===== DQN EVENTLERİ =====
document.addEventListener("DOMContentLoaded", function(){
  var plateEl = document.getElementById("bs_plate");
  if(!plateEl) return;

  plateEl.addEventListener("input", function(e){
    if(bsRegistryLocked){ unlockRegistryFields(); }
    var raw = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g,"");
    if(raw.length > 8) raw = raw.slice(0,8);
    var res = "";
    if(raw.length <= 2)      res = raw.replace(/[^0-9]/g,"").slice(0,2);
    else if(raw.length <= 4){ var d1=raw.slice(0,2).replace(/[^0-9]/g,""); var l=raw.slice(2).replace(/[^A-Z]/g,"").slice(0,2); res=d1+(d1.length===2?"-":"")+l; }
    else { var d1=raw.slice(0,2).replace(/[^0-9]/g,""); var l=raw.slice(2,4).replace(/[^A-Z]/g,"").slice(0,2); var d2=raw.slice(4).replace(/[^0-9]/g,"").slice(0,3); res=d1; if(d1.length===2)res+="-"; res+=l; if(l.length===2)res+="-"; res+=d2; }
    e.target.value = res;
    e.target.setSelectionRange(res.length, res.length);
    bsFormDirty = true;
    scheduleBsDraftSave();

    if(res.replace(/[^0-9A-Z]/g,"").length >= 2){
      renderBusRegistryDropdown(filterBusRegistry(res));
    } else {
      closeBusRegistryDD();
    }
  });

  plateEl.addEventListener("focus", function(){
    var v = this.value;
    if(v.replace(/[^0-9A-Z]/g,"").length >= 2 && !bsRegistryLocked){
      renderBusRegistryDropdown(filterBusRegistry(v));
    }
  });

  plateEl.addEventListener("paste", function(){
    setTimeout(function(){ plateEl.dispatchEvent(new Event("input")); }, 0);
  });

  // BUS ID
  var busidEl = document.getElementById("bs_busid");
  if(busidEl){
    busidEl.addEventListener("input", function(){
      this.value = this.value.replace(/[^0-9]/g,"").slice(0,5);
      bsFormDirty = true;
      scheduleBsDraftSave();
    });
  }

  // Marşrut
  var routeEl = document.getElementById("bs_route");
  if(routeEl){
    routeEl.addEventListener("input", function(){
      var pos = this.selectionStart;
      this.value = this.value.toUpperCase();
      this.setSelectionRange(pos, pos);
      bsFormDirty = true;
    });
  }
});

// ===== SET DD VALUE (edit üçün) =====
function setDDValue(key, value){
  if(!value) return;
  var meta = ddMeta[key];
  if(!meta) return;
  bsSelected[key] = value;
  var lblEl = document.getElementById(meta.lbl);
  if(lblEl){
    lblEl.textContent = value;
    lblEl.style.color = "#12233B";
    lblEl.classList.add("filled");
  }
}

function setTimeLabel(which, hhmm){
  if(!hhmm) return;
  var lblId = which==="main" ? "bs_time_lbl" : "bs_"+which+"_lbl";
  setTimeInputValue(lblId, hhmm);
}

// ===== EDIT =====
function openBusServiceForEdit(ticketId){
  var ov = document.getElementById("busOpenOverlay");
  ov.style.display = "flex";

  var ensureFormData = bsFormData && bsFormData.carriers ? Promise.resolve(bsFormData) :
    fetch(API_URL, {
      method:"POST",
      headers:{"Content-Type":"text/plain;charset=utf-8"},
      body:JSON.stringify({action:"getFormData"})
    }).then(function(r){ return r.json(); }).then(function(d){
      if(d.status==="OK"){ bsFormData = d; bsNextTicketId = d.nextTicketId || bsNextTicketId; }
      return bsFormData;
    });

  ensureFormData.then(function(){
    return fetch(API_URL, {
      method:"POST",
      headers:{"Content-Type":"text/plain;charset=utf-8"},
      body:JSON.stringify({action:"getServiceById", ticketId:ticketId})
    }).then(function(r){ return r.json(); });
  }).then(function(d){
    ov.style.display = "none";
    if(d.status !== "OK"){
      alert(d.message || "Ticket yüklənə bilmədi");
      return;
    }

    bsEditMode = true;
    bsEditTicketId = ticketId;
    bsReturnTarget = "report";

    resetBusFormFields();

    document.getElementById("bsTicketBadge").innerHTML =
      '<span style="display:inline-flex;align-items:center;background:#D97706;border-radius:10px;padding:6px 16px;font-family:IBM Plex Mono,monospace;font-weight:700;font-size:14px;color:#FFFFFF;letter-spacing:1px;">REDAKTƏ: ' + d.ticketId + '</span>';

    var btn = document.getElementById("bsSubmitBtn");
    if(btn) btn.textContent = "Yadda saxla";

    document.getElementById("bs_date").value = d.report_date_raw || "";
    document.getElementById("bs_requester").value = d.requester_name || "";
    document.getElementById("bs_phone").value = d.requester_phone || "";
    document.getElementById("bs_route").value = d.route_number || "";
    document.getElementById("bs_busid").value = d.bus_id || "";
    document.getElementById("bs_plate").value = d.license_plate || "";
    document.getElementById("bs_old_sn").value = d.old_sn || "";
    document.getElementById("bs_new_sn").value = d.new_sn || "";
    document.getElementById("bs_note").value = d.note || "";
    document.getElementById("bs_location_note").value = d.service_location_note || "";

    setTimeLabel("main", d.report_time);
    setTimeLabel("start", d.service_start_time);
    setTimeLabel("end", d.service_end_time);

    setDDValue("carrier", d.carrier);
    setDDValue("brand", d.brand_model);
    setDDValue("equipment", d.changed_device_type);
    setDDValue("problem", d.problem);
    setDDValue("location", d.service_location);
    setDDValue("tech1", d.technician_1);
    if(d.technician_2){ setDDValue("tech2", d.technician_2); }
    setDDValue("leader", d.team_leader);

    bsSelected.solution = Array.isArray(d.solution) ? d.solution.slice() : [];
    updateMultiLabel("solution");
    updateSolutionChips();

    document.getElementById("bs_location_note_wrap").style.display = (d.service_location||"").toLowerCase().indexOf("digər")!==-1 ? "block" : "none";

    bsFormDirty = false;
  })
  .catch(function(){
    ov.style.display = "none";
    alert("Şəbəkə xətası: ticket yüklənə bilmədi");
  });
}

// ===== SUBMIT =====
function submitBusService(){
  if(!document.getElementById("bs_date").value){ alert("Tarix daxil edin"); return; }
  if(getTimeValue()===""){ alert("Saat seçin"); return; }
  if(!document.getElementById("bs_requester").value.trim()){ alert("Müraciət edəni daxil edin"); return; }
  if(!document.getElementById("bs_plate").value.trim()){ alert("D.Q.N. daxil edin"); return; }
  if(!document.getElementById("bs_busid").value.trim()){ alert("BUS ID daxil edin"); return; }
  if(!bsSelected.carrier){ alert("Daşıyıcı şirkəti seçin"); return; }
  if(!bsSelected.brand){ alert("Marka/Modeli seçin"); return; }
  if(!bsSelected.problem){ alert("Müraciət/Problemi seçin"); return; }
  if(bsSelected.problem.toLowerCase().indexOf("digər")!==-1 && !document.getElementById("bs_note").value.trim()){ alert("Problem üçün qeyd yazın"); return; }
  if(bsSelected.solution.length===0){ alert("Həll / Açıqlama seçin"); return; }
  if(!bsSelected.equipment){ alert("Servis Kategoriyasını seçin"); return; }
  var startVal = getTimeInputValue("bs_start_lbl");
  var endVal = getTimeInputValue("bs_end_lbl");
  if(!startVal){ alert("Başlanğıc saatını seçin"); return; }
  if(!endVal){ alert("Bitiş saatını seçin"); return; }
  if(!bsSelected.location){ alert("Servis verilən ünvanı seçin"); return; }
  if(bsSelected.location.toLowerCase().indexOf("digər")!==-1 && !document.getElementById("bs_location_note").value.trim()){ alert("Ünvan qeydi yazın"); return; }
  if(!bsSelected.leader){ alert("Qrup rəhbərini seçin"); return; }

  var hasDigarSol = bsSelected.solution.some(function(s){ return s.toLowerCase().indexOf("digər")!==-1; });
  if(hasDigarSol && !document.getElementById("bs_note").value.trim()){ alert("Həll üçün qeyd yazın"); return; }

  var data = {
    report_date: document.getElementById("bs_date").value,
    report_time: getTimeValue(),
    requester_name: document.getElementById("bs_requester").value,
    requester_phone: document.getElementById("bs_phone").value,
    route_number: document.getElementById("bs_route").value,
    bus_id: document.getElementById("bs_busid").value,
    carrier: bsSelected.carrier,
    license_plate: document.getElementById("bs_plate").value,
    brand_model: bsSelected.brand,
    problem: bsSelected.problem,
    request: bsSelected.problem,
    solution: bsSelected.solution,
    changed_device_type: bsSelected.equipment || "",
    old_sn: document.getElementById("bs_old_sn").value,
    new_sn: document.getElementById("bs_new_sn").value,
    service_start_time: getTimeInputValue("bs_start_lbl"),
    service_end_time: getTimeInputValue("bs_end_lbl"),
    service_location: bsSelected.location,
    service_location_note: document.getElementById("bs_location_note").value,
    technician_1: bsSelected.tech1,
    technician_2: bsSelected.tech2,
    team_leader: bsSelected.leader,
    note: document.getElementById("bs_note").value
  };

  var ov = document.getElementById("bsLoadingOverlay");
  var sp = document.getElementById("bsSpinner");
  var tx = document.getElementById("bsLoadingText");
  var ic = document.getElementById("bsSuccessIcon");
  ov.classList.add("open");
  sp.style.display="block"; ic.style.display="none";
  tx.textContent = bsEditMode ? "Yadda saxlanılır..." : "Göndərilir...";

  var payload = bsEditMode
    ? { action:"updateBusService", ticketId:bsEditTicketId, data:data, userEmail:currentUser?currentUser.email:"" }
    : { action:"submitBusService", data:data, userEmail:currentUser?currentUser.email:"" };

  fetch(API_URL, {
    method:"POST",
    headers:{"Content-Type":"text/plain;charset=utf-8"},
    body:JSON.stringify(payload)
  })
  .then(function(r){ return r.json(); })
  .then(function(result){
    sp.style.display = "none";
    ic.style.display = "flex";
    if(result.status==="OK"){
      tx.textContent = bsEditMode ? "Yadda saxlanıldı! " + result.ticketId : "Göndərildi! " + result.ticketId;
    } else {
      tx.textContent = "Xəta baş verdi";
    }
    setTimeout(function(){
      ov.classList.remove("open");
      if(result.status==="OK"){
        bsFormDirty=false;
        if(!bsEditMode) clearBsDraft();
        var wasEdit = bsEditMode;
        bsGoBack();
        if(wasEdit && typeof loadReportData === 'function'){ loadReportData(); }
      }
    }, 1800);
  })
  .catch(function(){
    sp.style.display = "none";
    tx.textContent = "Şəbəkə xətası";
    setTimeout(function(){ ov.classList.remove("open"); }, 1500);
  });
}

// ===== EXIT / HOME =====
function attemptBusHome(){
  if(bsFormDirty){ document.getElementById("bsConfirmOverlay").classList.add("open"); }
  else { bsGoBack(); }
}

function closeConfirm(){ document.getElementById("bsConfirmOverlay").classList.remove("open"); }

function confirmExit(){
  document.getElementById("bsConfirmOverlay").classList.remove("open");
  if(!bsEditMode) clearBsDraft();
  var ov=document.getElementById("bsLoadingOverlay");
  var sp=document.getElementById("bsSpinner");
  var tx=document.getElementById("bsLoadingText");
  var ic=document.getElementById("bsSuccessIcon");
  ov.classList.add("open");
  sp.style.display="block"; ic.style.display="none"; tx.textContent="Gözləyin...";
  setTimeout(function(){ ov.classList.remove("open"); bsGoBack(); }, 900);
}

function bsGoBack(){
  closeAllDD();
  var container = document.getElementById("bus-bus-serviceContainer");
  if(container) container.style.display = "none";
  if(bsReturnTarget === "report"){
    document.getElementById("bus-bus-reportContainer").style.display = "flex";
  } else {
    document.getElementById("dashboardView").style.display = "block";
  }
  bsEditMode = false;
  bsEditTicketId = null;
  bsReturnTarget = "dashboard";
}

// ===== DRAFT =====
var bsDraftSaveTimer = null;

function scheduleBsDraftSave(){
  if(bsDraftSaveTimer) clearTimeout(bsDraftSaveTimer);
  bsDraftSaveTimer = setTimeout(saveBsDraft, 500);
}

function saveBsDraft(){
  if(bsEditMode) return;
  try{
    var draft = {
      date: (document.getElementById("bs_date")||{}).value || "",
      time: (document.getElementById("bs_time_lbl")||{}).value || "",
      requester: (document.getElementById("bs_requester")||{}).value || "",
      phone: (document.getElementById("bs_phone")||{}).value || "",
      route: (document.getElementById("bs_route")||{}).value || "",
      busid: (document.getElementById("bs_busid")||{}).value || "",
      plate: (document.getElementById("bs_plate")||{}).value || "",
      oldsn: (document.getElementById("bs_old_sn")||{}).value || "",
      newsn: (document.getElementById("bs_new_sn")||{}).value || "",
      start: (document.getElementById("bs_start_lbl")||{}).value || "",
      end: (document.getElementById("bs_end_lbl")||{}).value || "",
      note: (document.getElementById("bs_note")||{}).value || "",
      locationNote: (document.getElementById("bs_location_note")||{}).value || "",
      selected: bsSelected,
      savedAt: Date.now()
    };
    localStorage.setItem(bsDraftKey(), JSON.stringify(draft));
  }catch(e){}
}

function restoreBsDraft(draft){
  if(draft.date) document.getElementById("bs_date").value = draft.date;
  setTimeInputValue("bs_time_lbl", draft.time);
  document.getElementById("bs_requester").value = draft.requester || "";
  document.getElementById("bs_phone").value = draft.phone || "";
  document.getElementById("bs_route").value = draft.route || "";
  document.getElementById("bs_busid").value = draft.busid || "";
  document.getElementById("bs_plate").value = draft.plate || "";
  document.getElementById("bs_old_sn").value = draft.oldsn || "";
  document.getElementById("bs_new_sn").value = draft.newsn || "";
  setTimeInputValue("bs_start_lbl", draft.start);
  setTimeInputValue("bs_end_lbl", draft.end);
  document.getElementById("bs_note").value = draft.note || "";
  document.getElementById("bs_location_note").value = draft.locationNote || "";

  bsSelected = draft.selected || bsSelected;
  Object.keys(ddMeta).forEach(function(k){
    if(k==="solution"){
      updateMultiLabel("solution");
      updateSolutionChips();
    } else if(bsSelected[k]){
      setDDValue(k, bsSelected[k]);
    }
  });
  document.getElementById("bs_location_note_wrap").style.display = (bsSelected.location||"").toLowerCase().indexOf("digər")!==-1 ? "block" : "none";

  bsFormDirty = true;
}

function offerBsDraftRestore(draft){
  var minsAgo = Math.max(1, Math.round((Date.now() - (draft.savedAt||0)) / 60000));
  var timeText = minsAgo < 60 ? (minsAgo + " dəqiqə əvvəl") : (Math.round(minsAgo/60) + " saat əvvəl");
  document.getElementById("bsDraftConfirmText").textContent =
    "Bu formada " + timeText + " saxlanılmış yarımçıq məlumat var. Davam etmək istəyirsiniz?";
  document.getElementById("bsDraftConfirmOverlay").style.display = "flex";
}

function acceptBsDraft(){
  document.getElementById("bsDraftConfirmOverlay").style.display = "none";
  if(pendingBsDraft) restoreBsDraft(pendingBsDraft);
  pendingBsDraft = null;
}

function declineBsDraft(){
  document.getElementById("bsDraftConfirmOverlay").style.display = "none";
  clearBsDraft();
  pendingBsDraft = null;
}

var pendingBsDraft = null;

// ===== ENTER → TAB =====
document.addEventListener("keydown", function(e){
  if(e.key !== "Enter") return;
  var container = document.getElementById("bus-bus-serviceContainer");
  if(!container || container.style.display === "none") return;
  var active = document.activeElement;
  if(!active || !container.contains(active)) return;
  if(active.tagName === "BUTTON" || active.tagName === "TEXTAREA") return;
  e.preventDefault();
  var focusable = Array.from(container.querySelectorAll('input:not([type="hidden"]), select, textarea, button:not([tabindex="-1"])')).filter(function(el){ return !el.disabled && el.offsetParent !== null; });
  var idx = focusable.indexOf(active);
  if(idx !== -1 && idx < focusable.length-1) focusable[idx+1].focus();
});

// ===== DIRTY FLAG =====
document.addEventListener("DOMContentLoaded", function(){
  var container = document.getElementById("bus-bus-serviceContainer");
  if(!container) return;
  var inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach(function(el){
    el.addEventListener("input",function(){bsFormDirty=true; scheduleBsDraftSave();});
    el.addEventListener("change",function(){bsFormDirty=true; scheduleBsDraftSave();});
  });
});
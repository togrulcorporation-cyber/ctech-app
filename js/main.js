var API_URL = httpsscript.google.commacrossAKfycbytFqFdrsHqKrD2YnurKsXATyjAMLbFAtV3gEcLxmPF_DjfGk2A9yyBrhs7XgoM-uYcbwexec;
var currentUser = null;
var SESSION_KEY = ctech_session;
var SESSION_DAYS = 14;

function saveSession(u){ try{ localStorage.setItem(SESSION_KEY, JSON.stringify({useru, expiresDate.now()+(SESSION_DAYS86400000)})); }catch(e){} }
function clearSession(){ try{ localStorage.removeItem(SESSION_KEY); }catch(e){} }
function loadSession(){ try{ var r=localStorage.getItem(SESSION_KEY); if(!r)return null; var d=JSON.parse(r); if(Date.now()d.expires){clearSession();return null;} return d.user; }catch(e){return null;} }

var clockStarted = false;

function togglePassword(){
  var pw=document.getElementById(password);
  var icon=document.getElementById(eyeIcon);
  if(pw.type===password){ pw.type=text; icon.innerHTML='path d=M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a19.9 19.9 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a19.9 19.9 0 0 1-2.16 3.19M1 1l22 22path d=M14.12 14.12A3 3 0 1 1 9.88 9.88'; }
  else { pw.type=password; icon.innerHTML='path d=M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7zcircle cx=12 cy=12 r=3'; }
}

function showLoading(){ document.getElementById(loadingSpinner).style.display=block; document.getElementById(successIcon).classList.remove(show); document.getElementById(failIcon).classList.remove(show); document.getElementById(loadingText).innerHTML=Yoxlanılır...; document.getElementById(loadingOverlay).classList.add(open); }
function showLoadingSuccess(cb){ document.getElementById(loadingSpinner).style.display=none; document.getElementById(successIcon).classList.add(show); document.getElementById(loadingText).innerHTML=Uğurlu!; setTimeout(function(){ document.getElementById(loadingOverlay).classList.remove(open); cb(); }, 700); }
function showLoadingFail(msg){ document.getElementById(loadingSpinner).style.display=none; document.getElementById(failIcon).classList.add(show); document.getElementById(loadingText).innerHTML=Uğursuz; setTimeout(function(){ document.getElementById(loadingOverlay).classList.remove(open); var btn=document.getElementById(loginBtn); btn.disabled=false; btn.innerHTML=Daxil ol; alert(msg); }, 700); }

function login(){
  var email=document.getElementById(email).value;
  var password=document.getElementById(password).value;
  var btn=document.getElementById(loginBtn);
  if(!email){ alert(Email daxil edin); return; }
  if(!password){ alert(Şifrəni daxil edin); return; }
  btn.disabled=true; btn.innerHTML=Yoxlanılır...; showLoading();
  fetch(API_URL,{ methodPOST, headers{Content-Typetextplain;charset=utf-8}, bodyJSON.stringify({actioncheckUser,emailemail,passwordpassword}) })
  .then(function(r){return r.json();})
  .then(function(result){
    if(result.status==OK){ currentUser=result; if(document.getElementById(rememberMe).checked){saveSession(result);}else{clearSession();} showLoadingSuccess(function(){showDashboard();}); }
    else if(result.status==WRONG_PASSWORD){ showLoadingFail(Şifrə yanlışdır); }
    else { showLoadingFail(result.debugDENIEDnn+result.debugBu hesab üçün giriş icazəsi yoxdur); }
  })
  .catch(function(e){ showLoadingFail(XƏTA +e.message); });
}

document.getElementById(password).addEventListener(keydown,function(e){ if(e.key===Enter){login();} });

function showDashboard(){
  document.getElementById(loginView).style.display=none;
  document.getElementById(busServiceView).style.display=none;
  document.getElementById(dashboardView).style.display=block;
  document.getElementById(welcomeName).innerHTML=Xoş gəlmisiniz;
  document.getElementById(profileName).innerHTML=currentUser.name;
  document.getElementById(profileRole).innerHTML=currentUser.role;
  applyAccessLevel();
  if(!clockStarted){ clockStarted=true; updateClock(); setInterval(updateClock,1000); }
}

function getAccessLevel(role){ var r=(role).toLowerCase(); if(r.indexOf(admin)!==-1)returnadmin; if(r.indexOf(team)!==-1r.indexOf(leader)!==-1r.indexOf(rəhbər)!==-1)returnleader; returntechnician; }

function applyAccessLevel(){
  var level=getAccessLevel(currentUser.role);
  document.getElementById(dashboardsSection).style.display=(level===technician)noneblock;
  document.getElementById(reportsSection).style.display=block;
  document.getElementById(adminMenuItem).style.display=(level===admin)flexnone;
}

function updateClock(){
  var now=new Date();
  var parts=new Intl.DateTimeFormat(en-GB,{timeZoneAsiaBaku,day2-digit,month2-digit,yearnumeric,hour2-digit,minute2-digit,hour12false}).formatToParts(now);
  var map={}; parts.forEach(function(p){map[p.type]=p.value;});
  document.getElementById(clockDate).innerHTML=map.day+.+map.month+.+map.year;
  document.getElementById(clock).innerHTML=map.hour++map.minute;
}

function goHome(){ document.getElementById(loginView).style.display=none; document.getElementById(busServiceView).style.display=none; document.getElementById(dashboardView).style.display=block; closeMenu(); }
function toggleMenu(){ document.getElementById(menuPanel).classList.toggle(open); }
function closeMenu(){ document.getElementById(menuPanel).classList.remove(open); }
document.addEventListener(click,function(e){ var panel=document.getElementById(menuPanel); if(!panel)return; if(!panel.contains(e.target)&&!e.target.closest(.icon-btn))closeMenu(); });
function showAbout(){ closeMenu(); document.getElementById(aboutModal).classList.add(open); }
function hideAbout(){ document.getElementById(aboutModal).classList.remove(open); }
function signOut(){ closeMenu(); clearSession(); currentUser=null; document.getElementById(email).value=; document.getElementById(password).value=; var btn=document.getElementById(loginBtn); btn.disabled=false; btn.innerHTML=Daxil ol; document.getElementById(dashboardView).style.display=none; document.getElementById(busServiceView).style.display=none; document.getElementById(loginView).style.display=flex; }
function moduleAlert(n){ alert(n+ modulu tezliklə hazır olacaq); }

var MOON_PATH='path d=M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z';
var SUN_PATH='circle cx=12 cy=12 r=4path d=M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41';
function applyTheme(isDark){
    var icons = [document.getElementById(themeIcon), document.getElementById(rptThemeIcon), document.getElementById(dashThemeIcon), document.getElementById(bkThemeIcon)];
  icons.forEach(function(icon){
    if(!icon) return;
    icon.innerHTML = isDark  SUN_PATH  MOON_PATH;
  });
  if(isDark){ document.body.classList.add(dark-mode); } else { document.body.classList.remove(dark-mode); }
}
function toggleTheme(){ var isDark=!document.body.classList.contains(dark-mode); applyTheme(isDark); try{localStorage.setItem(ctech_theme,isDarkdarklight);}catch(e){} }

if(serviceWorker in navigator){ navigator.serviceWorker.register(service-worker.js); }
var savedUser=loadSession(); if(savedUser){currentUser=savedUser;showDashboard();}
try{ var savedTheme=localStorage.getItem(ctech_theme); if(savedTheme===dark){applyTheme(true);} }catch(e){}

 ═══════════════════════════════════════════════════
 BUS SERVICE — İNLİNE DROPDOWN SİSTEMİ
 ═══════════════════════════════════════════════════

var bsFormData = {};
var bsFormDirty = false;
var bsNextTicketId = ;
var bsRegistryLocked = false;
var bsSelected = {
  carrier, brand, problem, solution[], equipment, location, tech1, tech2, leader
};
var activeDDKey = null;

 ── Dropdown meta ────────────────────────────────────
var ddMeta = {
  carrier   { lblbs_carrier_lbl,   listdd_carrier_list,   multifalse, onSelect null },
  brand     { lblbs_brand_lbl,     listdd_brand_list,     multifalse, onSelect null },
  system    { lblbs_system_lbl,    listdd_system_list,    multifalse, onSelect null },
  equipment { lblbs_equipment_lbl, listdd_equipment_list, multifalse, onSelect null },
  problem   { lblbs_problem_lbl,   listdd_problem_list,   multifalse, onSelect onProblemSelect },
  solution  { lblbs_solution_lbl,  listdd_solution_list,  multitrue,  onSelect onSolutionSelect },
  location  { lblbs_location_lbl,  listdd_location_list,  multifalse, onSelect onLocationSelect },
  tech1     { lblbs_tech1_lbl,     listdd_tech1_list,     multifalse, onSelect null },
  tech2     { lblbs_tech2_lbl,     listdd_tech2_list,     multifalse, onSelect null },
  leader    { lblbs_leader_lbl,    listdd_leader_list,    multifalse, onSelect null }
};

 ── DD açqapat ─────────────────────────────────────
function toggleDD(key){
  if((key===carrier  key===brand) && bsRegistryLocked) return;
  if(activeDDKey && activeDDKey !== key){ closeDD(activeDDKey); }
  var listEl = document.getElementById(dd_ + key + _list);
  var arrow  = document.getElementById(dd_ + key + _arrow);
  if(!listEl) return;
  var isOpen = listEl.classList.contains(open);
  if(isOpen){
    closeDD(key);
  } else {
    renderDD(key);
    listEl.classList.add(open);
    if(arrow) arrow.style.transform = rotate(180deg);
    activeDDKey = key;
  }
}

function closeDD(key){
  var listEl = document.getElementById(dd_ + key + _list);
  var arrow  = document.getElementById(dd_ + key + _arrow);
  if(listEl) listEl.classList.remove(open);
  if(arrow)  arrow.style.transform = ;
  if(activeDDKey === key) activeDDKey = null;
}

function closeAllDD(){
  Object.keys(ddMeta).forEach(function(k){ closeDD(k); });
}

 Forma dışına tıklayınca kapat
document.addEventListener(click, function(e){
  if(!e.target.closest(.bs-inline-dd) && !e.target.closest(#bs_time_wrap)){
    closeAllDD();
  }
});

 ── DD siyahısını render et ──────────────────────────
function renderDD(key){
  var meta = ddMeta[key];
  var listEl = document.getElementById(meta.list);
  if(!listEl) return;
  var items = getListForKey(key);
  listEl.innerHTML = ;

  items.forEach(function(item){
    var div = document.createElement(div);
    div.className = bs-dd-item;
    var isMulti = meta.multi;
    var isSelected = isMulti
       (bsSelected[key].indexOf(item) !== -1)
       (bsSelected[key] === item);
    if(isSelected) div.classList.add(selected);

    if(isMulti){
      div.innerHTML = 'div class=bs-dd-check'
        + (isSelected  'svg width=11 height=11 viewBox=0 0 24 24 fill=none stroke=#fff stroke-width=3path d=M4 12l6 6L20 6svg'  '')
        + 'divspan' + item + 'span';
    } else {
      div.innerHTML = (isSelected
         'svg width=14 height=14 viewBox=0 0 24 24 fill=none stroke=#2F6FED stroke-width=2.5path d=M4 12l6 6L20 6svg'
         'div style=width14px;div')
        + 'span' + item + 'span';
    }
    div.addEventListener(click, function(e){ e.stopPropagation(); selectDDItem(key, item); });
    listEl.appendChild(div);
  });

   Multi-select üçün Təsdiqlə düyməsi
  if(meta.multi){
    var done = document.createElement(button);
    done.type = button;
    done.className = bs-dd-done;
    done.textContent = Təsdiqlə;
    done.addEventListener(click, function(e){ e.stopPropagation(); closeDD(key); });
    listEl.appendChild(done);
  }
}

function getListForKey(key){
  var map = {
    carrier   bsFormData.carriers  [],
    brand     bsFormData.busModels  [],
    equipment bsFormData.busEquipment  [],
    problem   bsFormData.busProblems  [],
    solution  bsFormData.solutions  [],
    location  bsFormData.locations  [],
    tech1     bsFormData.technicians  [],
    tech2     bsFormData.technicians  [],
    leader    bsFormData.leaders  []
  };
  return map[key]  [];
}

 ── Seçim et ────────────────────────────────────────
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
      lblEl.style.color = #12233B;
      lblEl.style.fontSize = 14px;
      lblEl.style.fontWeight = 400;
      lblEl.classList.add(filled);
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
    lblEl.textContent = arr.length  arr.length +  seçim  Seçin (çoxlu seçim);
    lblEl.style.color = arr.length  #12233B  #9AACC4;
    lblEl.style.fontSize = 14px;
    lblEl.style.fontWeight = 400;
    if(arr.length) lblEl.classList.add(filled);
    else lblEl.classList.remove(filled);
  }
}

 ── Xüsusi onSelect callback-lər ────────────────────
function onProblemSelect(item){
   Qeyd sahəsi artıq həmişə görünür, xüsusi əməliyyat lazım deyil
}

function onSolutionSelect(item){
  updateSolutionChips();
}

function onLocationSelect(item){
  var isDigar = item.toLowerCase().indexOf(digər) !== -1;
  document.getElementById(bs_location_note_wrap).style.display = isDigar  block  none;
  if(!isDigar) document.getElementById(bs_location_note).value = ;
}

function updateSolutionChips(){
  var arr = bsSelected.solution;
  var chips = document.getElementById(bs_solution_chips);
  chips.innerHTML = ;
  arr.forEach(function(a){
    var c = document.createElement(span);
    c.className = bs-chip;
    c.textContent = a.length  32  a.slice(0,32)+…  a;
    chips.appendChild(c);
  });
}

 ── Saat sahələri (əl ilə yazma, avtomatik format) ───
function formatTimeInput(el){
  var digits = el.value.replace([^0-9]g,).slice(0,4);
  var formatted = digits.length  2  digits.slice(0,2)++digits.slice(2)  digits;
  el.value = formatted;
  el.setSelectionRange(formatted.length, formatted.length);
  bsFormDirty = true;
}

function getTimeInputValue(id){
  var el = document.getElementById(id);
  if(!el) return ;
  var v = el.value.trim();
  return ^([01]d2[0-3])[0-5]d$.test(v)  v  ;
}

function setTimeInputValue(id, hhmm){
  var el = document.getElementById(id);
  if(el && hhmm) el.value = hhmm;
}

function getTimeValue(){ return getTimeInputValue(bs_time_lbl); }

 ── fillDD API datası gəldikdə siyahıları hazırla ──
function fillAllDDs(data){
  bsFormData = data;
}

 ── Form açılışı ─────────────────────────────────────
var bsEditMode = false;
var bsEditTicketId = null;
var bsReturnTarget = dashboard;

function startBusService(){
  var ov = document.getElementById(busOpenOverlay);
  ov.style.display = flex;
  preloadBusData(function(){
    ov.style.display = none;
    openBusService();
  });
}

function preloadBusData(callback){
  setTimeout(callback, 900);
  fetch(API_URL, {
    methodPOST,
    headers{Content-Typetextplain;charset=utf-8},
    bodyJSON.stringify({actiongetFormData})
  })
  .then(function(r){ return r.json(); })
  .then(function(d){
    if(d.status === OK){
      bsFormData = d;
      var tid = d.nextTicketId  BUS-00001;
      bsNextTicketId = tid;
      var badge = document.getElementById(bsTicketBadge);
      if(badge && !bsEditMode && document.getElementById(busServiceView).style.display !== none){
        badge.innerHTML = 'span style=displayinline-flex;align-itemscenter;background#2F6FED;border-radius10px;padding6px 16px;font-familyIBM Plex Mono,monospace;font-weight700;font-size14px;color#FFFFFF;letter-spacing1px;' + tid + 'span';
      }
    }
  })
  .catch(function(){  offline, fallback data işlər  });
}

function resetBusFormFields(){
  [bs_time_lbl,bs_start_lbl,bs_end_lbl].forEach(function(id){
    var el = document.getElementById(id);
    if(el){ el.value = ; }
  });

  bsFormDirty = false;
  bsSelected = {carrier,brand,problem,solution[],equipment,location,tech1,tech2,leader};

  Object.keys(ddMeta).forEach(function(k){
    var m = ddMeta[k];
    var el = document.getElementById(m.lbl);
    if(el){
      el.textContent = (k===tech2k===tech1)  Seçin (könüllü)  k===solution  Seçin (çoxlu seçim)  Seçin;
      el.style.color = #9AACC4;
      el.style.fontSize = ;
      el.style.fontWeight = ;
      el.classList.remove(filled);
    }
    closeDD(k);
  });

  [bs_requester,bs_phone,bs_route,bs_busid,bs_plate,bs_old_sn,bs_new_sn,bs_note,bs_location_note].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.value = ;
  });
  document.getElementById(bs_solution_chips).innerHTML = ;
  document.getElementById(bs_location_note_wrap).style.display = none;
  if(typeof unlockRegistryFields === function) unlockRegistryFields();
  closeBusRegistryDD();
}

function closeBusRegistryDD(){
  var dd = document.getElementById(bs_registry_dd);
  if(dd) dd.classList.remove(open);
}

function openBusService(){
  bsEditMode = false;
  bsEditTicketId = null;
  bsReturnTarget = dashboard;

  var now = new Date();
  var bParts = new Intl.DateTimeFormat(en-CA,{timeZoneAsiaBaku,yearnumeric,month2-digit,day2-digit}).format(now);

  resetBusFormFields();
  document.getElementById(bs_date).value = bParts;

  document.getElementById(dashboardView).style.display = none;
  document.getElementById(busReportView).style.display = none;
  document.getElementById(busServiceView).style.display = block;
  document.getElementById(busServiceView).scrollTop = 0;

  var _bkLvl = getAccessLevel(currentUser  currentUser.role  );
  var _bkWrap = document.getElementById(bsBulkBannerWrap);
  if(_bkWrap) _bkWrap.style.display = (_bkLvl === leader  _bkLvl === admin)  block  none;

  var draft = loadBsDraft();
  if(draft){ offerBsDraftRestore(draft); }

  var btn = document.getElementById(bsSubmitBtn);
  if(btn) btn.textContent = Göndər;

  if(bsNextTicketId){
    document.getElementById(bsTicketBadge).innerHTML =
      'span style=displayinline-flex;align-itemscenter;background#2F6FED;border-radius10px;padding6px 16px;font-familyIBM Plex Mono,monospace;font-weight700;font-size14px;color#FFFFFF;letter-spacing1px;' + bsNextTicketId + 'span';
  } else {
    document.getElementById(bsTicketBadge).innerHTML =
      'span style=displayinline-flex;align-itemscenter;background#B0C4E0;border-radius10px;padding6px 16px;font-familyIBM Plex Mono,monospace;font-weight700;font-size14px;color#FFFFFF;letter-spacing1px;yüklənir...span';
    loadBusFormData();
  }
}

 ── API form data yüklə ─────────────────────────────
function loadBusFormData(){
  fetch(API_URL, {
    methodPOST,
    headers{Content-Typetextplain;charset=utf-8},
    bodyJSON.stringify({actiongetFormData})
  })
  .then(function(r){ return r.json(); })
  .then(function(d){
    if(d.status !== OK) return;
    bsFormData = d;
    var tid = d.nextTicketId  BUS-00001;
    bsNextTicketId = tid;
    if(!bsEditMode){
      document.getElementById(bsTicketBadge).innerHTML =
        'span style=displayinline-flex;align-itemscenter;background#2F6FED;border-radius10px;padding6px 16px;font-familyIBM Plex Mono,monospace;font-weight700;font-size14px;color#FFFFFF;letter-spacing1px;' + tid + 'span';
    }
  })
  .catch(function(){
    bsFormData = {
      carriers[BakuBus MMC,Xaliq Faiqoğlu MMC,Çinar-Trans MMC,General Auto Company MMC,ENA Transport MMC,Transkontrol MMC,Vətən-Az MMC,Vətən MMC,K-Group MMC,AYNA - Monitoring],
      busModels[BMC,BYD,Daewoo,Isuzu,Karsan,Otokar,Iveco,King-Long,Dragon,Digər],
      busProblems[Validator ödəniş kartını qəbul etmir,Validator açılmır,Validator elektrik almır,Digər],
      solutions[Validator dəyişdirildi,Problem aşkar olunmadı,Elektrik söndürülüb-yandırıldı,Digər],
      busEquipment[Validator,SAM Card,Ethernet Cable,RJ45,Broket,Avtobus elektrik problemi,Demontaj,Montaj,Təmir sonrası baxış,Call center vasitəsilə uzaqdan servis,Route-Update,Distributions],
      systems[LIT,LIT-2],
      locations[Daşıyıcı qarajı,Son dayanacaq,Dayanacaq,Digər],
      technicians[Tural Əmmədov,Amil İbrahimov,Rövşən Nurəhmədov,Sənan Nuriyev,Surxay Qasımov,Hikmət Musazadə],
      leaders[Mustafa Salmanov,Ramil İbrahimov,Elvin Şamilov,Vüsal Məmmədov,Toğrul Əliyev,Nazim Dinavasov]
    };
    if(!bsEditMode){
      document.getElementById(bsTicketBadge).innerHTML =
        'span style=displayinline-flex;align-itemscenter;background#6B7280;border-radius10px;padding6px 16px;font-familyIBM Plex Mono,monospace;font-weight700;font-size14px;color#FFFFFF;letter-spacing1px;OFFLINEspan';
    }
  });
}

 ── Redaktə üçün mövcud ticket-i formaya yüklə ──────
function setDDValue(key, value){
  if(!value) return;
  var meta = ddMeta[key];
  if(!meta) return;
  bsSelected[key] = value;
  var lblEl = document.getElementById(meta.lbl);
  if(lblEl){
    lblEl.textContent = value;
    lblEl.style.color = #12233B;
    lblEl.style.fontSize = 14px;
    lblEl.style.fontWeight = 400;
    lblEl.classList.add(filled);
  }
}

function setTimeLabel(which, hhmm){
  if(!hhmm) return;
  var lblId = which===main  bs_time_lbl  bs_+which+_lbl;
  setTimeInputValue(lblId, hhmm);
}

function openBusServiceForEdit(ticketId){
  var ov = document.getElementById(busOpenOverlay);
  ov.style.display = flex;

  var ensureFormData = bsFormData && bsFormData.carriers  Promise.resolve(bsFormData) 
    fetch(API_URL, {
      methodPOST,
      headers{Content-Typetextplain;charset=utf-8},
      bodyJSON.stringify({actiongetFormData})
    }).then(function(r){ return r.json(); }).then(function(d){
      if(d.status===OK){ bsFormData = d; bsNextTicketId = d.nextTicketId  bsNextTicketId; }
      return bsFormData;
    });

  ensureFormData.then(function(){
    return fetch(API_URL, {
      methodPOST,
      headers{Content-Typetextplain;charset=utf-8},
      bodyJSON.stringify({actiongetServiceById, ticketIdticketId})
    }).then(function(r){ return r.json(); });
  }).then(function(d){
    ov.style.display = none;
    if(d.status !== OK){
      alert(d.message  Ticket yüklənə bilmədi);
      return;
    }

    bsEditMode = true;
    bsEditTicketId = ticketId;
    bsReturnTarget = report;

    resetBusFormFields();

    document.getElementById(dashboardView).style.display = none;
    document.getElementById(busReportView).style.display = none;
    document.getElementById(busServiceView).style.display = block;
    document.getElementById(busServiceView).scrollTop = 0;

    document.getElementById(bsTicketBadge).innerHTML =
      'span style=displayinline-flex;align-itemscenter;background#D97706;border-radius10px;padding6px 16px;font-familyIBM Plex Mono,monospace;font-weight700;font-size14px;color#FFFFFF;letter-spacing1px;REDAKTƏ ' + d.ticketId + 'span';

    var btn = document.getElementById(bsSubmitBtn);
    if(btn) btn.textContent = Yadda saxla;

    document.getElementById(bs_date).value = d.report_date_raw  ;
    document.getElementById(bs_requester).value = d.requester_name  ;
    document.getElementById(bs_phone).value = d.requester_phone  ;
    document.getElementById(bs_route).value = d.route_number  ;
    document.getElementById(bs_busid).value = d.bus_id  ;
    document.getElementById(bs_plate).value = d.license_plate  ;
    document.getElementById(bs_old_sn).value = d.old_sn  ;
    document.getElementById(bs_new_sn).value = d.new_sn  ;
    document.getElementById(bs_note).value = d.note  ;
    document.getElementById(bs_location_note).value = d.service_location_note  ;

    setTimeLabel(main, d.report_time);
    setTimeLabel(start, d.service_start_time);
    setTimeLabel(end, d.service_end_time);

    setDDValue(carrier, d.carrier);
    setDDValue(brand, d.brand_model);
    setDDValue(equipment, d.changed_device_type);
    setDDValue(problem, d.problem);
    setDDValue(location, d.service_location);
    setDDValue(tech1, d.technician_1);
    if(d.technician_2){ setDDValue(tech2, d.technician_2); }
    setDDValue(leader, d.team_leader);

    bsSelected.solution = Array.isArray(d.solution)  d.solution.slice()  [];
    updateMultiLabel(solution);
    updateSolutionChips();

    document.getElementById(bs_location_note_wrap).style.display = (d.service_location).toLowerCase().indexOf(digər)!==-1  block  none;

    bsFormDirty = false;
  })
  .catch(function(){
    ov.style.display = none;
    alert(Şəbəkə xətası ticket yüklənə bilmədi);
  });
}

 ── Submit (yaratma və ya redaktə) ───────────────────
function submitBusService(){
  if(!document.getElementById(bs_date).value){ alert(Tarix daxil edin); return; }
  if(getTimeValue()===){ alert(Saat seçin); return; }
  if(!document.getElementById(bs_requester).value.trim()){ alert(Müraciət edəni daxil edin); return; }
  if(!document.getElementById(bs_plate).value.trim()){ alert(D.Q.N. daxil edin); return; }
  if(!document.getElementById(bs_busid).value.trim()){ alert(BUS ID daxil edin); return; }
  if(!bsSelected.carrier){ alert(Daşıyıcı şirkəti seçin); return; }
  if(!bsSelected.brand){ alert(MarkaModeli seçin); return; }
  if(!bsSelected.problem){ alert(MüraciətProblemi seçin); return; }
  if(bsSelected.problem.toLowerCase().indexOf(digər)!==-1 && !document.getElementById(bs_note).value.trim()){ alert(Problem üçün qeyd yazın); return; }
  if(bsSelected.solution.length===0){ alert(Həll  Açıqlama seçin); return; }
  if(!bsSelected.equipment){ alert(Servis Kategoriyasını seçin); return; }
  var startVal = getTimeInputValue(bs_start_lbl);
  var endVal = getTimeInputValue(bs_end_lbl);
  if(!startVal){ alert(Başlanğıc saatını seçin); return; }
  if(!endVal){ alert(Bitiş saatını seçin); return; }
  if(!bsSelected.location){ alert(Servis verilən ünvanı seçin); return; }
  if(bsSelected.location.toLowerCase().indexOf(digər)!==-1 && !document.getElementById(bs_location_note).value.trim()){ alert(Ünvan qeydi yazın); return; }
  if(!bsSelected.leader){ alert(Qrup rəhbərini seçin); return; }

  var hasDigarSol = bsSelected.solution.some(function(s){ return s.toLowerCase().indexOf(digər)!==-1; });
  if(hasDigarSol && !document.getElementById(bs_note).value.trim()){ alert(Həll üçün qeyd yazın); return; }

  var data = {
    report_date document.getElementById(bs_date).value,
    report_time getTimeValue(),
    requester_name document.getElementById(bs_requester).value,
    requester_phone document.getElementById(bs_phone).value,
    route_number document.getElementById(bs_route).value,
    bus_id document.getElementById(bs_busid).value,
    carrier bsSelected.carrier,
    license_plate document.getElementById(bs_plate).value,
    brand_model bsSelected.brand,
    problem bsSelected.problem,
    request bsSelected.problem,
    solution bsSelected.solution,
    changed_device_type bsSelected.equipment  ,
    old_sn document.getElementById(bs_old_sn).value,
    new_sn document.getElementById(bs_new_sn).value,
    service_start_time getTimeInputValue(bs_start_lbl),
    service_end_time getTimeInputValue(bs_end_lbl),
    service_location bsSelected.location,
    service_location_note document.getElementById(bs_location_note).value,
    technician_1 bsSelected.tech1,
    technician_2 bsSelected.tech2,
    team_leader bsSelected.leader,
    note document.getElementById(bs_note).value
  };

  var ov = document.getElementById(bsLoadingOverlay);
  var sp = document.getElementById(bsSpinner);
  var tx = document.getElementById(bsLoadingText);
  var ic = document.getElementById(bsSuccessIcon);
  ov.classList.add(open);
  sp.style.display=block; ic.style.display=none;
  tx.textContent = bsEditMode  Yadda saxlanılır...  Göndərilir...;

  var payload = bsEditMode
     { actionupdateBusService, ticketIdbsEditTicketId, datadata, userEmailcurrentUsercurrentUser.email }
     { actionsubmitBusService, datadata, userEmailcurrentUsercurrentUser.email };

  fetch(API_URL, {
    methodPOST,
    headers{Content-Typetextplain;charset=utf-8},
    bodyJSON.stringify(payload)
  })
  .then(function(r){ return r.json(); })
  .then(function(result){
    sp.style.display = none;
    ic.style.display = flex;
    if(result.status===OK){
      tx.textContent = bsEditMode  Yadda saxlanıldı!  + result.ticketId  Göndərildi!  + result.ticketId;
    } else {
      tx.textContent = Xəta baş verdi;
    }
    setTimeout(function(){
      ov.classList.remove(open);
      if(result.status===OK){
        bsFormDirty=false;
        if(!bsEditMode) clearBsDraft();
        var wasEdit = bsEditMode;
        bsGoBack();
        if(wasEdit){ loadReportData(); }
      }
    }, 1800);
  })
  .catch(function(){
    sp.style.display = none;
    tx.textContent = Şəbəkə xətası;
    setTimeout(function(){ ov.classList.remove(open); }, 1500);
  });
}

 ── Home  Confirm  Exit ────────────────────────────
function attemptBusHome(){
  if(bsFormDirty){ document.getElementById(bsConfirmOverlay).classList.add(open); }
  else { bsGoBack(); }
}
function closeConfirm(){ document.getElementById(bsConfirmOverlay).classList.remove(open); }
function confirmExit(){
  document.getElementById(bsConfirmOverlay).classList.remove(open);
  if(!bsEditMode) clearBsDraft();
  var ov=document.getElementById(bsLoadingOverlay);
  var sp=document.getElementById(bsSpinner);
  var tx=document.getElementById(bsLoadingText);
  var ic=document.getElementById(bsSuccessIcon);
  ov.classList.add(open);
  sp.style.display=block; ic.style.display=none; tx.textContent=Gözləyin...;
  setTimeout(function(){ ov.classList.remove(open); bsGoBack(); }, 900);
}
function bsGoBack(){
  closeAllDD();
  document.getElementById(busServiceView).style.display=none;
  if(bsReturnTarget === report){
    document.getElementById(busReportView).style.display=flex;
  } else {
    document.getElementById(dashboardView).style.display=block;
  }
  bsEditMode = false;
  bsEditTicketId = null;
  bsReturnTarget = dashboard;
}


 ═══════════════════════════════════════════════════
 DQN REYESTR AXTARIŞI
 ═══════════════════════════════════════════════════

var bsRegistryLocked = false;

function normalizeDqn(s){
  return String(s).toUpperCase().replace([^0-9A-Z]g,)
    .replace(^(d{2})([A-Z]{2})(d{3})$, $1-$2-$3)
     String(s).toUpperCase();
}

function filterBusRegistry(query){
  var reg = (bsFormData && bsFormData.busRegistry)  [];
  if(!query  query.length  2) return [];
  var q = query.toUpperCase().replace(sg,);
  return reg.filter(function(r){
    var dqn = String(r.dqn).toUpperCase().replace(sg,);
    return dqn.indexOf(q) === 0;
  });
}

function renderBusRegistryDropdown(matches){
  var dd = document.getElementById(bs_registry_dd);
  if(!dd) return;
  if(!matches.length){
    dd.innerHTML = 'div class=bs-registry-emptyUyğun D.Q.N. tapılmadı — məlumatları əl ilə daxil edindiv';
  } else {
    dd.innerHTML = matches.slice(0,8).map(function(m){
      return 'div class=bs-registry-item data-dqn='+ (m.dqn) +''
        + 'span class=reg-id'+ (m.dqn—) +'span'
        + 'span class=reg-metaBUS ID '+ (m.id—) +' · '+ (m.carrier—) +' · '+ (m.model—) +'span'
        + 'div';
    }).join();
    Array.from(dd.querySelectorAll(.bs-registry-item)).forEach(function(el){
      el.addEventListener(click, function(e){
        e.stopPropagation();
        var dqn = el.getAttribute(data-dqn);
        var match = matches.find(function(m){ return String(m.dqn) === String(dqn); });
        if(match) selectBusRegistryMatch(match);
      });
    });
  }
  dd.classList.add(open);
}

function closeBusRegistryDD(){
  var dd = document.getElementById(bs_registry_dd);
  if(dd) dd.classList.remove(open);
}

function selectBusRegistryMatch(match){
  var plateEl = document.getElementById(bs_plate);
  plateEl.value = match.dqn  ;

  var busidEl = document.getElementById(bs_busid);
  busidEl.value = match.id  ;

  if(match.carrier) setDDValue(carrier, match.carrier);
  if(match.model)   setDDValue(brand,   match.model);

  closeBusRegistryDD();
  lockRegistryFields();
  bsFormDirty = true;
  scheduleBsDraftSave();
}

function lockRegistryFields(){
  bsRegistryLocked = true;
  var busidEl = document.getElementById(bs_busid);
  busidEl.classList.add(bs-locked);
  busidEl.setAttribute(readonly,readonly);
  document.getElementById(bs_carrier_btn).classList.add(bs-locked);
  document.getElementById(bs_brand_btn).classList.add(bs-locked);
  document.getElementById(bs_registry_reset).classList.add(show);
}

function unlockRegistryFields(){
  bsRegistryLocked = false;
  var busidEl = document.getElementById(bs_busid);
  busidEl.classList.remove(bs-locked);
  busidEl.removeAttribute(readonly);
  document.getElementById(bs_carrier_btn).classList.remove(bs-locked);
  document.getElementById(bs_brand_btn).classList.remove(bs-locked);
  document.getElementById(bs_registry_reset).classList.remove(show);
}

function resetRegistrySelection(){
  document.getElementById(bs_plate).value = ;
  document.getElementById(bs_busid).value = ;
  bsSelected.carrier = ;
  var cLbl = document.getElementById(bs_carrier_lbl);
  if(cLbl){ cLbl.textContent=Seçin; cLbl.style.color=#9AACC4; cLbl.classList.remove(filled); }
  bsSelected.brand = ;
  var bLbl = document.getElementById(bs_brand_lbl);
  if(bLbl){ bLbl.textContent=Seçin; bLbl.style.color=#9AACC4; bLbl.classList.remove(filled); }
  unlockRegistryFields();
  closeBusRegistryDD();
  bsFormDirty = true;
  scheduleBsDraftSave();
}

document.addEventListener(click, function(e){
  if(!e.target.closest(.bs-busid-wrap)){
    closeBusRegistryDD();
  }
});

 ── D.Q.N. xanası — avtomatik format + reyestr axtarışı ──
document.addEventListener(DOMContentLoaded, function(){
  var plateEl = document.getElementById(bs_plate);
  if(!plateEl) return;

  plateEl.addEventListener(input, function(e){
    if(bsRegistryLocked){ unlockRegistryFields(); }

    var raw = e.target.value.toUpperCase().replace([^0-9A-Z]g,);
    if(raw.length  8) raw = raw.slice(0,8);
    var res = ;
    if(raw.length = 2)      res = raw.replace([^0-9]g,).slice(0,2);
    else if(raw.length = 4){ var d1=raw.slice(0,2).replace([^0-9]g,); var l=raw.slice(2).replace([^A-Z]g,).slice(0,2); res=d1+(d1.length===2-)+l; }
    else { var d1=raw.slice(0,2).replace([^0-9]g,); var l=raw.slice(2,4).replace([^A-Z]g,).slice(0,2); var d2=raw.slice(4).replace([^0-9]g,).slice(0,3); res=d1; if(d1.length===2)res+=-; res+=l; if(l.length===2)res+=-; res+=d2; }
    e.target.value = res;
    e.target.setSelectionRange(res.length, res.length);
    bsFormDirty = true;
    scheduleBsDraftSave();

    if(res.replace([^0-9A-Z]g,).length = 2){
      renderBusRegistryDropdown(filterBusRegistry(res));
    } else {
      closeBusRegistryDD();
    }
  });

  plateEl.addEventListener(focus, function(){
    var v = this.value;
    if(v.replace([^0-9A-Z]g,).length = 2 && !bsRegistryLocked){
      renderBusRegistryDropdown(filterBusRegistry(v));
    }
  });

  plateEl.addEventListener(paste, function(){
    setTimeout(function(){ plateEl.dispatchEvent(new Event(input)); }, 0);
  });
});

 ── BUS ID yalnız rəqəm (əl ilə yazılanda) ──────────
document.addEventListener(DOMContentLoaded, function(){
  var busidEl = document.getElementById(bs_busid);
  if(busidEl){
    busidEl.addEventListener(input, function(){
      this.value = this.value.replace([^0-9]g,).slice(0,5);
      bsFormDirty = true;
      scheduleBsDraftSave();
    });
  }
});

 ── Marşrut böyük hərf ──────────────────────────────
document.addEventListener(DOMContentLoaded, function(){
  var routeEl = document.getElementById(bs_route);
  if(routeEl){
    routeEl.addEventListener(input, function(){
      var pos = this.selectionStart;
      this.value = this.value.toUpperCase();
      this.setSelectionRange(pos, pos);
      bsFormDirty = true;
    });
  }
});

 ── Enter → Tab (yalnız BUS Service formasında) ─────
document.addEventListener(keydown, function(e){
  if(e.key !== Enter) return;
  var view = document.getElementById(busServiceView);
  if(!view  view.style.display === none) return;
  var active = document.activeElement;
  if(!active  !view.contains(active)) return;
  if(active.tagName === BUTTON  active.tagName === TEXTAREA) return;
  e.preventDefault();
  var focusable = Array.from(view.querySelectorAll('inputnot([type=hidden]), select, textarea, buttonnot([tabindex=-1])')).filter(function(el){ return !el.disabled && el.offsetParent !== null; });
  var idx = focusable.indexOf(active);
  if(idx !== -1 && idx  focusable.length-1) focusable[idx+1].focus();
});

 ── Qaralama (draft) avtomatik saxlama ───────────────
function bsDraftKey(){ return ctech_bs_draft; }

function saveBsDraft(){
  if(bsEditMode) return;
  try{
    var draft = {
      date (document.getElementById(bs_date){}).value  ,
      time (document.getElementById(bs_time_lbl){}).value  ,
      requester (document.getElementById(bs_requester){}).value  ,
      phone (document.getElementById(bs_phone){}).value  ,
      route (document.getElementById(bs_route){}).value  ,
      busid (document.getElementById(bs_busid){}).value  ,
      plate (document.getElementById(bs_plate){}).value  ,
      oldsn (document.getElementById(bs_old_sn){}).value  ,
      newsn (document.getElementById(bs_new_sn){}).value  ,
      start (document.getElementById(bs_start_lbl){}).value  ,
      end (document.getElementById(bs_end_lbl){}).value  ,
      note (document.getElementById(bs_note){}).value  ,
      locationNote (document.getElementById(bs_location_note){}).value  ,
      selected bsSelected,
      savedAt Date.now()
    };
    localStorage.setItem(bsDraftKey(), JSON.stringify(draft));
  }catch(e){}
}

var bsDraftSaveTimer = null;
function scheduleBsDraftSave(){
  if(bsDraftSaveTimer) clearTimeout(bsDraftSaveTimer);
  bsDraftSaveTimer = setTimeout(saveBsDraft, 500);
}

function clearBsDraft(){
  try{ localStorage.removeItem(bsDraftKey()); }catch(e){}
}

function loadBsDraft(){
  try{
    var raw = localStorage.getItem(bsDraftKey());
    if(!raw) return null;
    var d = JSON.parse(raw);
    var hasContent = d.requester  d.phone  d.route  d.busid  d.plate  d.note 
      (d.selected && (d.selected.carrier  d.selected.brand  d.selected.problem  (d.selected.solution&&d.selected.solution.length)));
    return hasContent  d  null;
  }catch(e){ return null; }
}

function restoreBsDraft(draft){
  if(draft.date) document.getElementById(bs_date).value = draft.date;
  setTimeInputValue(bs_time_lbl, draft.time);
  document.getElementById(bs_requester).value = draft.requester  ;
  document.getElementById(bs_phone).value = draft.phone  ;
  document.getElementById(bs_route).value = draft.route  ;
  document.getElementById(bs_busid).value = draft.busid  ;
  document.getElementById(bs_plate).value = draft.plate  ;
  document.getElementById(bs_old_sn).value = draft.oldsn  ;
  document.getElementById(bs_new_sn).value = draft.newsn  ;
  setTimeInputValue(bs_start_lbl, draft.start);
  setTimeInputValue(bs_end_lbl, draft.end);
  document.getElementById(bs_note).value = draft.note  ;
  document.getElementById(bs_location_note).value = draft.locationNote  ;

  bsSelected = draft.selected  bsSelected;
  Object.keys(ddMeta).forEach(function(k){
    if(k===solution){
      updateMultiLabel(solution);
      updateSolutionChips();
    } else if(bsSelected[k]){
      setDDValue(k, bsSelected[k]);
    }
  });
  document.getElementById(bs_location_note_wrap).style.display = (bsSelected.location).toLowerCase().indexOf(digər)!==-1  block  none;

  bsFormDirty = true;
}

 ── Dirty flag ───────────────────────────────────────
document.addEventListener(DOMContentLoaded, function(){
  var inputs = document.querySelectorAll(#busServiceView input, #busServiceView select, #busServiceView textarea);
  inputs.forEach(function(el){
    el.addEventListener(input,function(){bsFormDirty=true; scheduleBsDraftSave();});
    el.addEventListener(change,function(){bsFormDirty=true; scheduleBsDraftSave();});
  });
});


 ═══════════════════════════════════════════════════
 BUS REAL-TIME REPORT
 ═══════════════════════════════════════════════════

var rptAllRows = [];
var rptColumns = [];
var rptFiltered = [];
var rptShownCount = 20;
var rptPageSize = 20;
var rptAutoRefresh = null;

var RPT_SEARCH_FIELDS = [Ticket ID, Tarix, D.Q.N., BUS ID, Daşıyıcı];

function updateRptDate(){
  var dEl = document.getElementById(rptDateBox);
  var tEl = document.getElementById(rptClockBox);
  if(!dEl  !tEl) return;
  var now = new Date();
  var parts = new Intl.DateTimeFormat(en-GB,{timeZoneAsiaBaku,day2-digit,month2-digit,yearnumeric,hour2-digit,minute2-digit,second2-digit,hour12false}).formatToParts(now);
  var map = {}; parts.forEach(function(p){ map[p.type]=p.value; });
  dEl.textContent = map.day + . + map.month + . + map.year;
  tEl.textContent = map.hour +  + map.minute +  + map.second;
}
var rptDateInterval = null;

function openBusReport(){
  document.getElementById(dashboardView).style.display = none;
  var view = document.getElementById(busReportView);
  view.style.display = flex;
  document.getElementById(rptGlobalSearch).value = ;
  document.getElementById(rptExcelBtn).style.display =
    (getAccessLevel(currentUser.role) === technician)  none  flex;
  rptShownCount = rptPageSize;
  updateRptDate();
  if(rptDateInterval) clearInterval(rptDateInterval);
  rptDateInterval = setInterval(updateRptDate, 1000);
  loadReportData();
  if(rptAutoRefresh) clearInterval(rptAutoRefresh);
  rptAutoRefresh = setInterval(loadReportData, 120000);
}

function closeBusReport(){
  if(rptAutoRefresh){ clearInterval(rptAutoRefresh); rptAutoRefresh = null; }
  if(rptDateInterval){ clearInterval(rptDateInterval); rptDateInterval = null; }
  document.getElementById(busReportView).style.display = none;
  document.getElementById(dashboardView).style.display = block;
}

function rptSortKey(row){
  var d = row[Tarix]  ;
  var t = row[Saat]  ;
  var dp = d.split(.);
  if(dp.length !== 3) return 0;
  var iso = dp[2] + - + dp[1] + - + dp[0] + T + (t  0000) + 00;
  var ts = new Date(iso).getTime();
  return isNaN(ts)  0  ts;
}

function loadReportData(){
  document.getElementById(rptTableBody).innerHTML =
    'trtd colspan=6div class=rpt-loadingdiv class=spinner style=width36px;height36px;border-width4px;divspanYüklənir...spandivtdtr';

  fetch(API_URL, {
    methodPOST,
    headers{Content-Typetextplain;charset=utf-8},
    bodyJSON.stringify({actiongetReportData})
  })
  .then(function(r){ return r.json(); })
  .then(function(d){
    if(d.status !== OK){
      document.getElementById(rptTableBody).innerHTML =
        'trtd colspan=6div class=rpt-emptyXəta ' + (d.messageməlumat gəlmədi) + 'divtdtr';
      return;
    }
    rptAllRows = (d.rows  []).slice().sort(function(a,b){ return rptSortKey(b) - rptSortKey(a); });
    rptColumns = d.columns  [];
    applyFilters();
  })
  .catch(function(e){
    document.getElementById(rptTableBody).innerHTML =
      'trtd colspan=6div class=rpt-emptyŞəbəkə xətası ' + e.message + 'divtdtr';
  });
}

function applyFilters(){
  var q = (document.getElementById(rptGlobalSearch).value  ).toLowerCase().trim();
  rptShownCount = rptPageSize;

  if(!q){
    rptFiltered = rptAllRows;
  } else {
    rptFiltered = rptAllRows.filter(function(row){
      for(var i=0;iRPT_SEARCH_FIELDS.length;i++){
        var f = RPT_SEARCH_FIELDS[i];
        if((row[f]).toLowerCase().indexOf(q) !== -1) return true;
      }
      return false;
    });
  }

  renderTable();
}

function canEditTicket(row){
  var level = getAccessLevel(currentUser.role);
  if(level === leader  level === admin) return true;
  var createdBy = (row[_created_by]  ).toLowerCase().trim();
  var me = (currentUser.email  ).toLowerCase().trim();
  return createdBy && me && createdBy === me;
}

function renderTable(){
  var body = document.getElementById(rptTableBody);
  document.getElementById(rptCount).textContent = rptFiltered.length +  nəticə;

  if(rptFiltered.length === 0){
    body.innerHTML = 'trtd colspan=6div class=rpt-emptyMəlumat tapılmadıdivtdtr';
    document.getElementById(rptLoadMoreWrap).style.display = none;
    return;
  }

  var visible = rptFiltered.slice(0, rptShownCount);
  var html = ;

  visible.forEach(function(row){
    var ticketId = row[Ticket ID]  ;
    var safeId = ticketId.replace('g,);
    var editable = canEditTicket(row);
    html += 'tr'
      + 'td class=rpt-td-id' + ticketId + 'td'
      + 'td' + (row[Tarix]) + 'td'
      + 'td class=rpt-td-plate' + (row[D.Q.N.]) + 'td'
      + 'td' + (row[BUS ID]) + 'td'
      + 'td class=col-carrier title=' + (row[Daşıyıcı]).replace(g,&quot;) + '' + (row[Daşıyıcı]) + 'td'
      + 'td class=col-actdiv class=rpt-row-actions'
      +   'button class=rpt-icon-btn onclick=openBusDetail('' + safeId + '') aria-label=Baxış title=Baxış'
      +     'svg viewBox=0 0 24 24 fill=none stroke=currentColor stroke-width=2path d=M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7zcircle cx=12 cy=12 r=3svg'
      +   'button'
      +   (editable
           'button class=rpt-icon-btn rpt-edit-btn onclick=openBusServiceForEdit('' + safeId + '') aria-label=Redaktə et title=Redaktə et'
            + 'svg viewBox=0 0 24 24 fill=none stroke=currentColor stroke-width=2path d=M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3zsvg'
            + 'button'
           '')
      + 'divtd'
      + 'tr';
  });

  body.innerHTML = html;

  var loadMoreWrap = document.getElementById(rptLoadMoreWrap);
  if(rptFiltered.length  rptShownCount){
    document.getElementById(rptLoadMoreBtn).textContent = Daha çox göstər ( + (rptFiltered.length - rptShownCount) + );
    loadMoreWrap.style.display = flex;
  } else {
    loadMoreWrap.style.display = none;
  }
}

function rptShowMore(){
  rptShownCount += rptPageSize;
  renderTable();
}


 ── Detail (baxış) görünüşü ───────────────────────────
var DV_FIELD_MAP = [
  { sectionMüraciət məlumatları, rows[
    [Tarix,Tarix], [Saat,Saat], [Müraciət edən,Müraciət edən], [Telefon,Telefon]
  ]},
  { sectionAvtobus məlumatları, rows[
    [Marşrut №,Marşrut №], [BUS ID,BUS ID], [Daşıyıcı,Daşıyıcı],
    [D.Q.N.,D.Q.N.], [MarkaModel,MarkaModel], [Sistem,Sistem]
  ]},
  { sectionServis məlumatları, rows[
    [Problem,Problem], [Həll,Həll], [Qeyd,Qeyd]
  ]},
  { sectionServis Kateqoriyası, rows[
    [Servis Kat.,Servis Kat.], [Köhnə SN,Köhnə SN], [Yeni SN,Yeni SN]
  ]},
  { sectionServis vaxtı və yeri, rows[
    [Başlanğıc,Başlanğıc], [Bitiş,Bitiş], [Servis yeri,Servis yeri]
  ]},
  { sectionTexnik heyət, rows[
    [1. Texnik,1. Texnik], [2. Texnik,2. Texnik], [Qrup rəhbəri,Qrup rəhbəri]
  ]}
];

function openBusDetail(ticketId){
  var row = rptAllRows.find(function(r){ return r[Ticket ID] === ticketId; });
  if(!row){ alert(Ticket tapılmadı); return; }

  document.getElementById(dvTicketTitle).textContent = ticketId;

  var html = ;
  DV_FIELD_MAP.forEach(function(sec){
    var rowsHtml = ;
    sec.rows.forEach(function(pair){
      var val = row[pair[1]];
      if(!val) return;
      rowsHtml += 'div class=dv-rowspan class=dv-label' + pair[0] + 'spanspan class=dv-value' + val + 'spandiv';
    });
    if(rowsHtml){
      html += 'div class=dv-sectiondiv class=dv-section-title' + sec.section + 'div' + rowsHtml + 'div';
    }
  });

  html += 'div class=dv-sectiondiv class=dv-section-titleStatusdiv'
    + 'div class=dv-rowspan class=dv-labelVəziyyətspanspan class=dv-valuespan class=dv-status-chip' + (row[Status]) + 'spanspandiv'
    + 'div';

  document.getElementById(dvBody).innerHTML = html;

  document.getElementById(busReportView).style.display = none;
  document.getElementById(busDetailView).style.display = flex;
}

function closeBusDetail(){
  document.getElementById(busDetailView).style.display = none;
  document.getElementById(busReportView).style.display = flex;
}

 ═══════════════════════════════════════════════════
 BUS DASHBOARD
 ═══════════════════════════════════════════════════

function escapeHtml(s){ return String(s==nulls).replace(&g,&amp;).replace(g,&lt;).replace(g,&gt;).replace(g,&quot;); }

function getBakuNowParts(){
  var now = new Date();
  var parts = new Intl.DateTimeFormat(en-GB,{timeZoneAsiaBaku,yearnumeric,month2-digit,day2-digit,hour2-digit,minute2-digit,second2-digit,hour12false}).formatToParts(now);
  var map={}; parts.forEach(function(p){map[p.type]=p.value;});
  return { y+map.year, mo+map.month, d+map.day, h+map.hour, mi+map.minute, s+map.second };
}
function bakuNowDate(){
  var p = getBakuNowParts();
  return new Date(p.y, p.mo-1, p.d, p.h, p.mi, p.s);
}
function daysInCurrentMonth(){
  var p = getBakuNowParts();
  return new Date(p.y, p.mo, 0).getDate();
}
function dashComputeRange(period){
  if(period === all) return {startnull, endnull};
  var end = bakuNowDate();
  var start = new Date(end);
  if(period === 24h) start.setDate(start.getDate()-1);
  else if(period === week) start.setDate(start.getDate()-7);
  else if(period === month) start.setDate(start.getDate()-daysInCurrentMonth());
  return {startstart, endend};
}
function rowDate(row){
  var d = row[Tarix]; var t = row[Saat]0000;
  var dp = d.split(.);
  if(dp.length!==3) return null;
  var tp = t.split();
  return new Date(+dp[2], +dp[1]-1, +dp[0], +(tp[0]0), +(tp[1]0));
}

var DASH_CATS = [
  {keyProblem, typemulti, getOptionsfunction(){ return bsFormData.busProblems[]; }},
  {keyHəll, typemulti, getOptionsfunction(){ return bsFormData.solutions[]; }},
  {keyDaşıyıcı, typemulti, getOptionsfunction(){ return bsFormData.carriers[]; }},
  {keyD.Q.N., typetext},
  {keyBUS ID, typenumeric, maxlen5},
  {keyQrup Rəhbəri, typemulti, getOptionsfunction(){ return bsFormData.leaders[]; }},
  {keyTexnik, typemulti, getOptionsfunction(){ return bsFormData.technicians[]; }},
  {keyServis verilən Ünvan, typemulti, getOptionsfunction(){ return bsFormData.locations[]; }},
  {keyServis Kateqoriyaları, typemulti, getOptionsfunction(){ return bsFormData.busEquipment[]; }}
];

var dashActiveChips = {};
var dashSubfilterState = {};
var dashTextFilters = {};
var dashCustomRange = null;
var dashPeriod = 24h;
var dashAllRows = [];

function dashSelectedOptions(key){
  return Object.keys(dashSubfilterState).filter(function(k){ return k.indexOf(key+)===0 && dashSubfilterState[k]; }).map(function(k){ return k.slice(key.length+2); });
}
function dashHasActiveOptions(key){ return dashSelectedOptions(key).length0; }
function dashMatchMulti(val, key){
  if(!val) return false;
  return dashSelectedOptions(key).indexOf(val) !== -1;
}
function dashMatchSolution(val, key){
  if(!val) return false;
  var sel = dashSelectedOptions(key);
  return val.split(  ).some(function(p){ return sel.indexOf(p.trim())!==-1; });
}
function dashMatchLocation(val, key){
  if(!val) return false;
  var base = val.replace(s(.)$,).trim();
  return dashSelectedOptions(key).indexOf(base)!==-1;
}
function dashGetFilteredRows(){
  var range = dashCustomRange  dashComputeRange(dashPeriod);
  return dashAllRows.filter(function(row){
    if(range.start && range.end){
      var rd = rowDate(row);
      if(!rd  rd  range.start  rd  range.end) return false;
    }
    if(dashHasActiveOptions(Problem) && !dashMatchMulti(row[Problem],Problem)) return false;
    if(dashHasActiveOptions(Həll) && !dashMatchSolution(row[Həll],Həll)) return false;
    if(dashHasActiveOptions(Daşıyıcı) && !dashMatchMulti(row[Daşıyıcı],Daşıyıcı)) return false;
    if(dashTextFilters[D.Q.N.] && (row[D.Q.N.]).toLowerCase().indexOf(dashTextFilters[D.Q.N.].toLowerCase())===-1) return false;
    if(dashTextFilters[BUS ID] && (row[BUS ID]).indexOf(dashTextFilters[BUS ID])===-1) return false;
    if(dashHasActiveOptions(Qrup Rəhbəri) && !dashMatchMulti(row[Qrup rəhbəri],Qrup Rəhbəri)) return false;
    if(dashHasActiveOptions(Texnik) && !(dashMatchMulti(row[1. Texnik],Texnik)  dashMatchMulti(row[2. Texnik],Texnik))) return false;
    if(dashHasActiveOptions(Servis verilən Ünvan) && !dashMatchLocation(row[Servis yeri],Servis verilən Ünvan)) return false;
    if(dashHasActiveOptions(Servis Kateqoriyaları) && !dashMatchMulti(row[Servis Kat.],Servis Kateqoriyaları)) return false;
    return true;
  });
}

function dashCount(rows, field, splitMulti){
  var map = {};
  rows.forEach(function(r){
    var v = r[field];
    if(!v) return;
    var vals = splitMulti  v.split(  )  [v];
    vals.forEach(function(vv){ vv=(vv).trim(); if(!vv) return; map[vv]=(map[vv]0)+1; });
  });
  return Object.keys(map).map(function(k){ return {namek,countmap[k]}; }).sort(function(a,b){ return b.count-a.count; });
}
function dashCountLocation(rows){
  var map={};
  rows.forEach(function(r){
    var v=r[Servis yeri]; if(!v) return;
    var base=v.replace(s(.)$,).trim(); if(!base) return;
    map[base]=(map[base]0)+1;
  });
  return Object.keys(map).map(function(k){ return {namek,countmap[k]}; }).sort(function(a,b){ return b.count-a.count; });
}
function dashCountTech(rows){
  var map={};
  rows.forEach(function(r){
    [r[1. Texnik], r[2. Texnik]].forEach(function(v){ if(!v) return; map[v]=(map[v]0)+1; });
  });
  return Object.keys(map).map(function(k){ return {namek,countmap[k]}; }).sort(function(a,b){ return b.count-a.count; });
}
function dashCountRecurringBuses(rows){
  var map={};
  rows.forEach(function(r){
    var id=r[BUS ID]; if(!id) return;
    if(!map[id]) map[id]={plater[D.Q.N.],count0};
    map[id].count++;
  });
  return Object.keys(map).map(function(id){ return {busIdid, platemap[id].plate, countmap[id].count}; })
    .filter(function(x){ return x.count=3; }).sort(function(a,b){ return b.count-a.count; });
}
function dashFixedMetrics(){
  var now = bakuNowDate();
  var todayStart = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0);
  var weekStart = new Date(now); weekStart.setDate(weekStart.getDate()-7);
  var totalToday=0, totalWeek=0;
  dashAllRows.forEach(function(r){
    var rd = rowDate(r); if(!rd) return;
    if(rd=todayStart) totalToday++;
    if(rd=weekStart) totalWeek++;
  });
  return {totalAlldashAllRows.length, totalTodaytotalToday, totalWeektotalWeek};
}

function dashRenderRadial(containerId, items, total){
  var el = document.getElementById(containerId);
  var top = items.slice(0,4);
  if(top.length===0){ el.innerHTML='div class=dash-empty-txtBu dövr üçün qeydə alınmayıb.div'; return; }
  var R=30, C=2Math.PIR, html=;
  top.forEach(function(it){
    var pct = total0  Math.round(it.counttotal100)  0;
    var offset = C - (Cpct100);
    html += 'div class=dash-radial-card'
      + 'svg width=68 height=68 viewBox=0 0 72 72'
      +   'circle cx=36 cy=36 r='+R+' fill=none stroke=#E6F1FB stroke-width=8'
      +   'circle cx=36 cy=36 r='+R+' fill=none stroke=#2F6FED stroke-width=8 stroke-dasharray='+C.toFixed(1)+' stroke-dashoffset='+offset.toFixed(1)+' stroke-linecap=round transform=rotate(-90 36 36)'
      +   'text x=36 y=41 text-anchor=middle font-family=Rajdhani font-weight=700 font-size=17 fill=#12233B'+pct+'%text'
      + 'svg'
      + 'div class=dash-radial-textbox'+escapeHtml(it.name)+'div'
      + 'div class=dash-radial-count'+it.count+' servisdiv'
      + 'div';
  });
  el.innerHTML = html;
}
function buildRankTableRows(items, numStyle, countStyle){
  var html = ;
  items.forEach(function(it,i){
    html += 'tr'
      + 'td class=dr-num-colspan'+(numStyle' style='+numStyle+'''')+''+(i+1)+'spantd'
      + 'td'+escapeHtml(it.name)+'td'
      + 'td class=dr-count-colspan class=dash-rank-count-val'+(countStyle' style='+countStyle+'''')+''+it.count+'spantd'
      + 'tr';
  });
  return html;
}
function dashRenderRankList(containerId, items, max, headerLabel, nameHeader){
  var el = document.getElementById(containerId);
  var top = items.slice(0, max6);
  if(top.length===0){ el.innerHTML='div class=dash-empty-txtBu dövr üçün qeydə alınmayıb.div'; return; }
  var html = 'div class=dash-ranklist-wraptable class=dash-ranklisttheadtr'
    + 'th class=dr-num-colthth'+(nameHeaderAd)+'thth class=dr-count-col'+(headerLabelServis sayı)+'th'
    + 'trtheadtbody' + buildRankTableRows(top) + 'tbodytablediv';
  el.innerHTML = html;
}
function dashRenderTiles(containerId, items, max){
  var el = document.getElementById(containerId);
  var top = items.slice(0, max8);
  if(top.length===0){ el.innerHTML='div class=dash-empty-txtBu dövr üçün qeydə alınmayıb.div'; return; }
  var icon = 'svg width=20 height=20 viewBox=0 0 24 24 fill=none stroke=currentColor stroke-width=2rect x=4 y=3 width=16 height=18 rx=2path d=M9 8h6M9 12h6svg';
  var html=;
  top.forEach(function(it){
    html += 'div class=dash-tilediv class=dash-tile-icon'+icon+'divdiv class=dash-tile-name'+escapeHtml(it.name)+'divdiv class=dash-tile-count'+it.count+'divdiv';
  });
  el.innerHTML = html;
}
function dashRenderLeaders(containerId, items, max){
  var el = document.getElementById(containerId);
  var top = items.slice(0, max6);
  if(top.length===0){ el.innerHTML='div class=dash-empty-txtBu dövr üçün qeydə alınmayıb.div'; return; }
  var maxCount = top[0].count  1, html=;
  top.forEach(function(it){
    var initials = it.name.split( ).map(function(w){ return w[0]; }).join().slice(0,2).toUpperCase();
    var pct = Math.round(it.countmaxCount100);
    html += 'div class=dash-lead-rowdiv class=dash-avatar'+escapeHtml(initials)+'divdiv class=dash-lead-name'+escapeHtml(it.name)+'divdiv class=dash-lead-bar-wrapdiv class=dash-lead-bar style=width'+pct+'%;divdivdiv class=dash-lead-count'+it.count+'divdiv';
  });
  el.innerHTML = html;
}
function dashRenderRecurring(containerId, items){
  var el = document.getElementById(containerId);
  if(items.length===0){ el.innerHTML='div class=dash-empty-txtBu dövr üçün heç bir avtobus 3 və ya daha çox servis almayıb — təkrarlanan problem qeydə alınmayıb.div'; return; }
  var mapped = items.slice(0,15).map(function(it){ return { name(it.plate—)+ · BUS +it.busId, countit.count }; });
  var html = 'div class=dash-ranklist-wraptable class=dash-ranklisttheadtr'
    + 'th class=dr-num-colththAvtobus (D.Q.N. · BUS ID)thth class=dr-count-colServis sayıth'
    + 'trtheadtbody' + buildRankTableRows(mapped, background#FEECEC;color#A32D2D;, color#A32D2D;) + 'tbodytablediv';
  el.innerHTML = html;
}
function dashMobileSection(title, items, max, headerLabel){
  var top = items.slice(0, max6);
  var html = 'div class=dash-m-sectiondiv class=dash-m-title'+title+'div';
  if(top.length===0){
    html += 'div class=dash-m-card-emptyBu dövr üçün qeydə alınmayıb.div';
  } else {
    html += 'div class=dash-ranklist-wraptable class=dash-ranklisttheadtr'
      + 'th class=dr-num-colththAdthth class=dr-count-col'+(headerLabelSay)+'th'
      + 'trtheadtbody' + buildRankTableRows(top) + 'tbodytablediv';
  }
  html += 'div';
  return html;
}
function dashRenderMobile(agg){
  document.getElementById(dashMTotalAll).textContent = agg.totalAll;
  document.getElementById(dashMTotalToday).textContent = agg.totalToday;
  document.getElementById(dashMTotalWeek).textContent = agg.totalWeek;

  var html = ;
  html += dashMobileSection(Ən çox rast gəlinən problem, agg.problems, 4);
  html += dashMobileSection(Ən çox rast gəlinən həll, agg.solutions, 4);
  html += dashMobileSection(Servis kateqoriyaları, agg.categories, 8);
  html += dashMobileSection(Texnik fəaliyyəti, agg.tech, 8);
  html += dashMobileSection(Qrup rəhbəri fəaliyyəti, agg.leaders, 8);
  html += dashMobileSection(Daşıyıcı firma üzrə statistika, agg.carriers, 8);
  html += dashMobileSection(Servis verilən ünvan, agg.locations, 8);

  var recItems = agg.recurring.map(function(it){ return {name(it.plate—)+ · BUS +it.busId, countit.count}; });
  html += dashMobileSection(Təkrarlanan problemli avtobuslar, recItems, 15, Servis sayı);

  document.getElementById(dashMobileSections).innerHTML = html;
}

function dashComputeAndRender(){
  var fixed = dashFixedMetrics();
  document.getElementById(dashTotalAll).textContent = fixed.totalAll;
  document.getElementById(dashTotalToday).textContent = fixed.totalToday;
  document.getElementById(dashTotalWeek).textContent = fixed.totalWeek;

  var range = dashCustomRange  dashComputeRange(dashPeriod);
  var filtered = dashGetFilteredRows();

  var problems = dashCount(filtered, Problem, false);
  var solutions = dashCount(filtered, Həll, true);
  var categories = dashCount(filtered, Servis Kat., false);
  var tech = dashCountTech(filtered);
  var leaders = dashCount(filtered, Qrup rəhbəri, false);
  var carriers = dashCount(filtered, Daşıyıcı, false);
  var locations = dashCountLocation(filtered);
  var recurring = dashCountRecurringBuses(filtered);

  dashRenderRadial(dashProblemGrid, problems, filtered.length);
  dashRenderRankList(dashSolutionList, solutions, 4);
  dashRenderTiles(dashCategoryGrid, categories, 8);
  dashRenderLeaders(dashTechList, tech, 8);
  dashRenderLeaders(dashLeaderList, leaders, 8);
  dashRenderRankList(dashCarrierList, carriers, 8);
  dashRenderRankList(dashLocationList, locations, 8);
  dashRenderRecurring(dashRecurringPanel, recurring);

  dashRenderMobile({
    totalAllfixed.totalAll, totalTodayfixed.totalToday, totalWeekfixed.totalWeek,
    problemsproblems, solutionssolutions, categoriescategories, techtech, leadersleaders,
    carrierscarriers, locationslocations, recurringrecurring
  });
}

function loadDashData(){
  var ov = document.getElementById(dashLoading);
  ov.classList.add(open);
  var reportPromise = fetch(API_URL,{methodPOST,headers{Content-Typetextplain;charset=utf-8},bodyJSON.stringify({actiongetReportData})}).then(function(r){return r.json();});
  var formPromise = (bsFormData && bsFormData.carriers)  Promise.resolve(bsFormData) 
    fetch(API_URL,{methodPOST,headers{Content-Typetextplain;charset=utf-8},bodyJSON.stringify({actiongetFormData})}).then(function(r){return r.json();}).then(function(d){ if(d.status===OK) bsFormData=d; return bsFormData; });
  Promise.all([reportPromise, formPromise]).then(function(results){
    var d = results[0];
    if(d.status===OK){ dashAllRows = d.rows[]; }
    ov.classList.remove(open);
    dashComputeAndRender();
  }).catch(function(){
    ov.classList.remove(open);
  });
}

function updateDashTabsUI(){
  document.querySelectorAll(#dashTabs .dash-tab).forEach(function(t){ t.classList.toggle(active, t.getAttribute(data-period)===dashPeriod); });
}

function openBusDashboard(){
  document.getElementById(dashboardView).style.display = none;
  document.getElementById(busDashboardView).style.display = flex;
  dashCustomRange = null;
  dashPeriod = 24h;
  updateDashTabsUI();
  loadDashData();
}
function closeBusDashboard(){
  document.getElementById(busDashboardView).style.display = none;
  document.getElementById(dashboardView).style.display = block;
}

document.addEventListener(DOMContentLoaded, function(){
  var tabs = document.querySelectorAll(#dashTabs .dash-tab);
  tabs.forEach(function(t){
    t.addEventListener(click, function(){
      tabs.forEach(function(x){ x.classList.remove(active); });
      t.classList.add(active);
      dashPeriod = t.getAttribute(data-period);
      dashCustomRange = null;
      dashComputeAndRender();
    });
  });
});

 ── Modal kalendar + filtrlər ───────────────────────
function openDashModal(){
  ensureDashFormDataThenBuildChips();
  document.getElementById(dashModal).classList.add(open);
}
function closeDashModal(){
  document.getElementById(dashModal).classList.remove(open);
  document.getElementById(dashModalFilterBody).style.display = flex;
  document.getElementById(dashModalResults).classList.remove(open);
  document.getElementById(dashResetBtnEl).style.display = ;
  document.getElementById(dashModalTitle).textContent = Tarix aralığı və filtrlər;
  document.getElementById(dashSearchWarn).style.display = none;
}

function ensureDashFormDataThenBuildChips(){
  if(bsFormData && bsFormData.carriers){ buildDashChips(); }
  else {
    fetch(API_URL,{methodPOST,headers{Content-Typetextplain;charset=utf-8},bodyJSON.stringify({actiongetFormData})}).then(function(r){return r.json();}).then(function(d){ if(d.status===OK) bsFormData=d; buildDashChips(); });
  }
}
function buildDashChips(){
  var row = document.getElementById(dashChipRow);
  row.innerHTML = ;
  DASH_CATS.forEach(function(cat){
    var c = document.createElement(div);
    c.className = dash-chip + (dashActiveChips[cat.key]   active  );
    c.textContent = cat.key;
    c.onclick = function(){
      dashActiveChips[cat.key] = !dashActiveChips[cat.key];
      var warnEl = document.getElementById(dashSearchWarn);
      if(warnEl) warnEl.style.display = none;
      c.classList.toggle(active);
      renderDashSubfilters();
    };
    row.appendChild(c);
  });
  renderDashSubfilters();
}
function renderDashSubfilters(){
  var wrap = document.getElementById(dashSubfilters);
  wrap.innerHTML = ;
  DASH_CATS.forEach(function(cat){
    if(!dashActiveChips[cat.key]) return;
    var box = document.createElement(div);
    box.className = dash-subfilter;
    var title = document.createElement(div);
    title.className = dash-subfilter-title;
    title.textContent = cat.key;
    box.appendChild(title);
    if(cat.type === multi){
      var opts = document.createElement(div);
      opts.className = dash-subfilter-opts;
      (cat.getOptions()[]).forEach(function(opt){
        var o = document.createElement(div);
        var key = cat.key++opt;
        o.className = dash-opt-chip + (dashSubfilterState[key]   sel  );
        o.textContent = opt.length28  opt.slice(0,28)+…  opt;
        o.title = opt;
        o.onclick = function(){ dashSubfilterState[key] = !dashSubfilterState[key]; o.classList.toggle(sel); };
        opts.appendChild(o);
      });
      box.appendChild(opts);
    } else if(cat.type === text){
      var inp = document.createElement(input);
      inp.type=text; inp.placeholder=Axtar...;
      inp.value = dashTextFilters[cat.key]  ;
      inp.oninput = function(){ dashTextFilters[cat.key] = this.value; };
      box.appendChild(inp);
    } else if(cat.type === numeric){
      var inp2 = document.createElement(input);
      inp2.type=text; inp2.inputMode=numeric; inp2.placeholder=ID; inp2.maxLength = cat.maxlen;
      inp2.value = dashTextFilters[cat.key]  ;
      inp2.oninput = function(){ this.value = this.value.replace([^0-9]g,).slice(0,cat.maxlen); dashTextFilters[cat.key]=this.value; };
      box.appendChild(inp2);
    }
    wrap.appendChild(box);
  });
}
function resetDashFilters(){
  dashActiveChips = {}; dashSubfilterState = {}; dashTextFilters = {};
  dcalRangeStart = null; dcalRangeEnd = null;
  buildDashChips();
  renderDcal();
  document.getElementById(dashModalFilterBody).style.display = flex;
  document.getElementById(dashModalResults).classList.remove(open);
  document.getElementById(dashModalTitle).textContent = Tarix aralığı və filtrlər;
  document.getElementById(dashSearchWarn).style.display = none;
}

var dcalYear, dcalMonth, dcalRangeStart=null, dcalRangeEnd=null;
var DCAL_DOWS = [B.e,Ç.a,Ç,C.a,C,Ş,B];
var DCAL_MONTHS = [Yanvar,Fevral,Mart,Aprel,May,İyun,İyul,Avqust,Sentyabr,Oktyabr,Noyabr,Dekabr];
function initDcal(){ var now=bakuNowDate(); dcalYear=now.getFullYear(); dcalMonth=now.getMonth(); renderDcal(); }
function dcalNav(dir){ dcalMonth+=dir; if(dcalMonth0){dcalMonth=11;dcalYear--;} if(dcalMonth11){dcalMonth=0;dcalYear++;} renderDcal(); }
function renderDcal(){
  document.getElementById(dcalLabel).textContent = DCAL_MONTHS[dcalMonth]+ +dcalYear;
  var grid = document.getElementById(dcalGrid);
  grid.innerHTML = ;
  DCAL_DOWS.forEach(function(d){ var el=document.createElement(div); el.className=dcal-dow; el.textContent=d; grid.appendChild(el); });
  var firstDay = new Date(dcalYear,dcalMonth,1);
  var startOffset = (firstDay.getDay()+6)%7;
  var daysInMonth = new Date(dcalYear,dcalMonth+1,0).getDate();
  var daysInPrev = new Date(dcalYear,dcalMonth,0).getDate();
  for(var i=0;istartOffset;i++){ var el=document.createElement(div); el.className=dcal-day muted; el.textContent=daysInPrev-startOffset+i+1; grid.appendChild(el); }
  for(var d=1; d=daysInMonth; d++){
    (function(day){
      var el = document.createElement(div); el.className=dcal-day; el.textContent=day;
      var thisDate = new Date(dcalYear,dcalMonth,day);
      if(dcalRangeStart && sameDayDc(thisDate,dcalRangeStart)) el.classList.add(range-start);
      if(dcalRangeEnd && sameDayDc(thisDate,dcalRangeEnd)) el.classList.add(range-end);
      if(dcalRangeStart && dcalRangeEnd && thisDatedcalRangeStart && thisDatedcalRangeEnd) el.classList.add(in-range);
      el.onclick = function(){ pickDcalDate(thisDate); };
      grid.appendChild(el);
    })(d);
  }
  updateDcalTxt();
}
function sameDayDc(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
function pickDcalDate(d){
  if(!dcalRangeStart  (dcalRangeStart && dcalRangeEnd)){ dcalRangeStart=d; dcalRangeEnd=null; }
  else { if(ddcalRangeStart){ dcalRangeEnd=dcalRangeStart; dcalRangeStart=d; } else { dcalRangeEnd=d; } }
  renderDcal();
  var warnEl = document.getElementById(dashSearchWarn);
  if(warnEl) warnEl.style.display = none;
}
function fmtDc(d){ return String(d.getDate()).padStart(2,0)+.+String(d.getMonth()+1).padStart(2,0)+.+d.getFullYear(); }
function updateDcalTxt(){
  var t = document.getElementById(dcalSelectedTxt);
  if(dcalRangeStart && dcalRangeEnd) t.textContent = fmtDc(dcalRangeStart)+  →  +fmtDc(dcalRangeEnd);
  else if(dcalRangeStart) t.textContent = fmtDc(dcalRangeStart)+ seçildi — bitiş tarixini seçin;
  else t.textContent = Başlanğıc tarixi seçin;
}
initDcal();

function runDashSearch(){
  var hasRange = dcalRangeStart && dcalRangeEnd;
  var hasActiveCat = Object.keys(dashActiveChips).some(function(k){ return dashActiveChips[k]; });

  if(!hasRange && !hasActiveCat){
    document.getElementById(dashSearchWarn).style.display = flex;
    return;
  }
  document.getElementById(dashSearchWarn).style.display = none;

  if(hasRange){
    dashCustomRange = {
      start new Date(dcalRangeStart.getFullYear(),dcalRangeStart.getMonth(),dcalRangeStart.getDate(),0,0,0),
      end new Date(dcalRangeEnd.getFullYear(),dcalRangeEnd.getMonth(),dcalRangeEnd.getDate(),23,59,59)
    };
    document.querySelectorAll(#dashTabs .dash-tab).forEach(function(t){ t.classList.remove(active); });
  }

  document.getElementById(dashModalFilterBody).style.display = none;
  document.getElementById(dashModalTitle).textContent = Nəticələr;
  var resultsPanel = document.getElementById(dashModalResults);
  resultsPanel.classList.add(open);
  document.getElementById(dashModalResultsBody).innerHTML =
    'div style=displayflex;flex-directioncolumn;align-itemscenter;gap14px;padding50px 0;'
    + 'div class=spinner style=width38px;height38px;border-width4px;div'
    + 'div style=font-size13.5px;color#5C7089;font-weight600;Hazırlanır...divdiv';

  setTimeout(function(){
    dashComputeAndRender();
    renderDashModalResults();
  }, 1400);
}

function dashPivotBlock(title, items, countLabel, nameHeader){
  if(!items  items.length===0) return '';
  var b = 'div style=font-size12px;font-weight700;color#8CA0BC;margin-bottom8px;'+title+'div';
  b += 'div class=dash-ranklist-wrap style=margin-bottom20px;table class=dash-ranklisttheadtr'
    + 'th class=dr-num-colthth'+(nameHeaderAd)+'thth class=dr-count-col'+(countLabelServis sayı)+'th'
    + 'trtheadtbody' + buildRankTableRows(items.slice(0,10)) + 'tbodytablediv';
  return b;
}

function renderDashModalResults(){
  var filtered = dashGetFilteredRows();
  var activeAny = Object.keys(dashActiveChips).some(function(k){ return dashActiveChips[k]; });

  var html = 'div style=font-size13.5px;color#5C7089;margin-bottom18px;Seçilmiş aralıqda b style=color#12233B;font-family'Rajdhani',sans-serif;font-size19px;'+filtered.length+'b nəticə tapıldı.div';

  if(dashActiveChips[Problem]) html += dashPivotBlock(Problem üzrə bölgü, dashCount(filtered,Problem,false), Servis sayı, Problem);
  if(dashActiveChips[Həll]) html += dashPivotBlock(Həll üzrə bölgü, dashCount(filtered,Həll,true), Servis sayı, Həll);
  if(dashActiveChips[Daşıyıcı]) html += dashPivotBlock(Daşıyıcı üzrə bölgü, dashCount(filtered,Daşıyıcı,false), Servis sayı, Daşıyıcı);
  if(dashActiveChips[Qrup Rəhbəri]) html += dashPivotBlock(Qrup Rəhbəri üzrə bölgü, dashCount(filtered,Qrup rəhbəri,false), Servis sayı, Qrup Rəhbəri);
  if(dashActiveChips[Texnik]) html += dashPivotBlock(Texnik üzrə bölgü, dashCountTech(filtered), Servis sayı, Texnik);
  if(dashActiveChips[Servis verilən Ünvan]) html += dashPivotBlock(Servis verilən ünvan üzrə bölgü, dashCountLocation(filtered), Servis sayı, Ünvan);
  if(dashActiveChips[Servis Kateqoriyaları]) html += dashPivotBlock(Servis kateqoriyası üzrə bölgü, dashCount(filtered,Servis Kat.,false), Servis sayı, Kateqoriya);

  if(dashActiveChips[D.Q.N.]  dashActiveChips[BUS ID]){
    var ticketItems = filtered.slice(0,15).map(function(r){
      return { name(r[Ticket ID])+ · +(r[Tarix])+ · +(r[D.Q.N.]), count(r[BUS ID]) };
    });
    html += dashPivotBlock(Uyğun gələn ticket-lər, ticketItems, BUS ID, Ticket);
  }

  if(!activeAny){
    html += dashPivotBlock(Ən çox rast gəlinən problem (ümumi baxış), dashCount(filtered,Problem,false).slice(0,4), Servis sayı, Problem);
  }

  html += 'div style=font-size12px;color#8CA0BC;line-height1.5;Tam hesabat əsas Dashboard səhifəsində də yeniləndi. Bağlamaq üçün yuxarıdakı X düyməsinə basın.div';

  document.getElementById(dashModalResultsBody).innerHTML = html;
}

function exportDashboardExcel(){
  if(typeof XLSX === undefined){ alert(Excel kitabxanası yüklənməyib, bir az gözləyin); return; }
  var filtered = dashGetFilteredRows();
  var wb = XLSX.utils.book_new();
  function addSheet(name, items, headers){
    var aoa = [headers];
    items.forEach(function(it){ aoa.push([it.name, it.count]); });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), name);
  }
  addSheet(Problem, dashCount(filtered,Problem,false), [Problem,Say]);
  addSheet(Hell, dashCount(filtered,Həll,true), [Hell,Say]);
  addSheet(Kateqoriya, dashCount(filtered,Servis Kat.,false), [Kateqoriya,Say]);
  addSheet(Texnik, dashCountTech(filtered), [Texnik,Say]);
  addSheet(Rehber, dashCount(filtered,Qrup rəhbəri,false), [Qrup Rehberi,Say]);
  addSheet(Dasiyici, dashCount(filtered,Daşıyıcı,false), [Dasiyici,Say]);
  addSheet(Unvan, dashCountLocation(filtered), [Unvan,Say]);
  var recur = dashCountRecurringBuses(filtered);
  var recurAoa = [[D.Q.N.,BUS ID,Say]];
  recur.forEach(function(it){ recurAoa.push([it.plate, it.busId, it.count]); });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(recurAoa), Tekrarlanan);
  var today = new Date();
  var fname = BUS_Dashboard_ + String(today.getDate()).padStart(2,0) + . + String(today.getMonth()+1).padStart(2,0) + . + today.getFullYear() + .xlsx;
  XLSX.writeFile(wb, fname);
}

function exportToExcel(){
  if(rptFiltered.length === 0){ alert(Export üçün məlumat yoxdur); return; }
  if(typeof XLSX === undefined){ alert(Excel kitabxanası yüklənməyib, bir az gözləyin); return; }

  var cols = rptColumns;
  var wsData = [];
  wsData.push(cols);
  rptFiltered.forEach(function(row){
    var r = cols.map(function(c){ return row[c]  ; });
    wsData.push(r);
  });

  var ws = XLSX.utils.aoa_to_sheet(wsData);
  var colWidths = cols.map(function(c){
    var max = c.length;
    rptFiltered.forEach(function(row){
      var v = (row[c]  ).length;
      if(v  max) max = v;
    });
    return { wch Math.min(max + 2, 40) };
  });
  ws[!cols] = colWidths;

  var range = XLSX.utils.decode_range(ws[!ref]);
  for(var C = range.s.c; C = range.e.c; C++){
    var cell = ws[XLSX.utils.encode_cell({r0, cC})];
    if(!cell) continue;
    cell.s = {
      font { boldtrue, color{rgb1B4A8A} },
      fill { fgColor{rgbE6F1FB} },
      alignment { horizontalcenter },
      border {
        bottom { stylemedium, color{rgbC8D8EE} }
      }
    };
  }

  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, BUS Report);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2,0);
  var mm = String(today.getMonth()+1).padStart(2,0);
  var yyyy = today.getFullYear();
  var fname = BUS_Report_ + dd + . + mm + . + yyyy + .xlsx;

  XLSX.writeFile(wb, fname);
}

 ═══════════════════════════════════════════════════
 DRAFT BƏRPA WİDGET
 ═══════════════════════════════════════════════════
var pendingBsDraft = null;

function offerBsDraftRestore(draft){
  pendingBsDraft = draft;
  var minsAgo = Math.max(1, Math.round((Date.now() - (draft.savedAt0))  60000));
  var timeText = minsAgo  60  (minsAgo +  dəqiqə əvvəl)  (Math.round(minsAgo60) +  saat əvvəl);
  document.getElementById(bsDraftConfirmText).textContent =
    Bu formada  + timeText +  saxlanılmış yarımçıq məlumat var. Davam etmək istəyirsiniz;
  var ov = document.getElementById(bsDraftConfirmOverlay);
  ov.style.display = flex;
}

function acceptBsDraft(){
  document.getElementById(bsDraftConfirmOverlay).style.display = none;
  if(pendingBsDraft) restoreBsDraft(pendingBsDraft);
  pendingBsDraft = null;
}

function declineBsDraft(){
  document.getElementById(bsDraftConfirmOverlay).style.display = none;
  clearBsDraft();
  pendingBsDraft = null;
}

 ═══════════════════════════════════════════════════
 PULL-TO-REFRESH
 ═══════════════════════════════════════════════════
var ptrStartY = 0;
var ptrTracking = false;
var PTR_THRESHOLD = 80;

function isUnsavedWorkPresent(){
  var bsView = document.getElementById(busServiceView);
  return bsFormDirty && bsView && bsView.style.display !== none;
}

document.addEventListener(touchstart, function(e){
  ptrTracking = (window.scrollY === 0 && document.documentElement.scrollTop === 0);
  ptrStartY = e.touches[0].clientY;
}, {passivetrue});

document.addEventListener(touchmove, function(e){
  if(!ptrTracking) return;
  if(e.touches[0].clientY - ptrStartY  PTR_THRESHOLD){
    ptrTracking = false;
    triggerPullRefresh();
  }
}, {passivetrue});

document.addEventListener(touchend, function(){ ptrTracking = false; });

function triggerPullRefresh(){
  if(isUnsavedWorkPresent()){
    document.getElementById(bsRefreshConfirmOverlay).style.display = flex;
  } else {
    location.reload();
  }
}
function cancelPullRefresh(){
  document.getElementById(bsRefreshConfirmOverlay).style.display = none;
}
function confirmPullRefresh(){
  document.getElementById(bsRefreshConfirmOverlay).style.display = none;
  clearBsDraft();
  location.reload();
}
window.addEventListener(beforeunload, function(e){
  if(isUnsavedWorkPresent()){ e.preventDefault(); e.returnValue = ; }
});

 ═══════════════════════════════════════════════════
 BUS BULK SERVICE
 ═══════════════════════════════════════════════════
var bkCalYear, bkCalMonth, bkSelectedDate = null;
var BK_DOWS   = [B,E,Ç,A,C,Ş,B];
var BK_MONTHS = [Yanvar,Fevral,Mart,Aprel,May,İyun,İyul,Avqust,Sentyabr,Oktyabr,Noyabr,Dekabr];
var bkPreviewData = null;
var bkFormDataLoaded = false;

function bkDateChanged(val){
  if(!val) return;
  var parts = val.split(-);
  var d = new Date(+parts[0], +parts[1]-1, +parts[2]);
  bkSelectedDate = d;
  document.getElementById(bkDateDisplay).textContent = 
    String(d.getDate()).padStart(2,0)+.+String(d.getMonth()+1).padStart(2,0)+.+d.getFullYear();
  renderBkCal();
}

function openBusBulk(){
  // Access control: yalnız admin və leader görə bilər
  if(currentUser){
    var level = getAccessLevel(currentUser.role);
    if(level === 'technician'){
      alert('Bu bölməyə giriş icazəniz yoxdur. Yalnız admin və qrup rəhbərləri istifadə edə bilər.');
      return;
    }
  }
  var now = bakuNowDate();
  document.getElementById('busServiceView').style.display = 'none';
  document.getElementById('busBulkView').style.display = 'flex';
  ensureBulkFormData();
  if(!bkSelectedDate){
    bkCalYear = now.getFullYear(); bkCalMonth = now.getMonth();
    bkSelectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  renderBkCal();
  bkUpdateImportCount();
}
function closeBusBulk(){
  document.getElementById('busBulkView').style.display = 'none';
  document.getElementById('busServiceView').style.display = 'block';
}
function ensureBulkFormData(){
  if(bsFormData && bsFormData.carriers){ bkFillSelects(); bkFormDataLoaded=true; return; }
  fetch(API_URL,{methodPOST,headers{Content-Typetextplain;charset=utf-8},bodyJSON.stringify({actiongetFormData})})
    .then(function(r){return r.json();})
    .then(function(d){ if(d.status===OK){ bsFormData=d; } bkFillSelects(); bkFormDataLoaded=true; });
}
function bkFillSelects(){
  var d = bsFormData || {};
  bkFillSel('bk_carrier',  d.carriers,     'Seçin');
  bkFillSel('bk_category', d.busEquipment, 'Seçin');
  bkFillSel('bk_location', d.locations,    'Seçin (könüllü)');
  bkFillSel('bk_tech1',    d.technicians,  'Seçin');
  bkFillSel('bk_tech2',    d.technicians,  'Seçin');
  bkFillSel('bk_leader',   d.leaders,      'Seçin');
  var locEl = document.getElementById('bk_location');
  if(locEl) locEl.onchange = function(){
    var isDigar = (this.value).toLowerCase().indexOf('digər') !== -1;
    document.getElementById('bk_location_note_wrap').style.display = isDigar ? 'block' : 'none';
  };
}
function bkFillSel(id, arr, placeholder){
  var el = document.getElementById(id); if(!el) return;
  el.innerHTML = '<option value="">' + placeholder + '</option>' + (arr||[]).map(function(x){ return '<option value="'+escapeHtml(x)+'">'+escapeHtml(x)+'</option>'; }).join('');
}

function renderBkCal(){
  var labelEl = document.getElementById('bkCalLabel');
  var daysEl  = document.getElementById('bkCalDays');
  if(!labelEl || !daysEl) return;
  labelEl.textContent = BK_MONTHS[bkCalMonth] + ' ' + bkCalYear;
  daysEl.innerHTML = '';
  daysEl.style.display = 'contents';
  var firstDay = new Date(bkCalYear, bkCalMonth, 1);
  var startOffset = (firstDay.getDay()+6)%7;
  var daysInMonth = new Date(bkCalYear, bkCalMonth+1, 0).getDate();
  var daysInPrev  = new Date(bkCalYear, bkCalMonth, 0).getDate();
  var today = bakuNowDate();
  for(var i=0; i<startOffset; i++){
    var el=document.createElement('div'); el.className='bk-cal-day muted';
    el.textContent=daysInPrev-startOffset+i+1; daysEl.appendChild(el);
  }
  for(var d=1; d<=daysInMonth; d++){
    (function(day){
      var el=document.createElement('div'); el.className='bk-cal-day'; el.textContent=day;
      var thisDate=new Date(bkCalYear,bkCalMonth,day);
      if(bkSameDay(thisDate,today)) el.classList.add('today');
      if(bkSelectedDate && bkSameDay(thisDate,bkSelectedDate)) el.classList.add('selected');
      el.onclick=function(){ bkSelectedDate=thisDate; renderBkCal(); bkUpdateImportCount(); };
      daysEl.appendChild(el);
    })(d);
  }
}
function bkSameDay(a,b){ return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate(); }
function bkCalNav(dir){ bkCalMonth+=dir; if(bkCalMonth0){bkCalMonth=11;bkCalYear--;} if(bkCalMonth11){bkCalMonth=0;bkCalYear++;} renderBkCal(); }
function bkDateIso(d){ return d.getFullYear()+-+String(d.getMonth()+1).padStart(2,0)+-+String(d.getDate()).padStart(2,0); }
function bkDateAz(d){ return String(d.getDate()).padStart(2,0)+.+String(d.getMonth()+1).padStart(2,0)+.+d.getFullYear(); }

function bkFormatTime(el){
  var digits=el.value.replace([^0-9]g,).slice(0,4);
  el.value=digits.length2digits.slice(0,2)++digits.slice(2)digits;
}
function bkGetTime(id){ var v=(document.getElementById(id).value).trim(); return ^([01]d2[0-3])[0-5]d$.test(v)v; }

function bkOnCarrierChange(){
  var carrier=document.getElementById('bk_carrier').value;
  var wrap=document.getElementById('bkCarrierCountWrap');
  bkPreviewData=null; bkClosePreview();
  bkUpdateImportCount();
  if(!carrier){ wrap.innerHTML=''; return; }
  var matches=(bsFormData&&bsFormData.busRegistry?bsFormData.busRegistry:[]).filter(function(r){ return String(r.carrier).trim().toLowerCase()===carrier.trim().toLowerCase(); });
  if(matches.length===0){
    wrap.innerHTML='<div class="bk-count-badge empty"><div class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><div><div class="bk-count-num">0</div><div class="bk-count-txt">Bu daşıyıcıya aid avtobus tapılmadı</div></div></div>';
  } else {
    wrap.innerHTML='<div class="bk-count-badge"><div class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M3 16V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9"/><path d="M3 16h18"/><circle cx="7" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></svg></div><div><div class="bk-count-num">'+matches.length+'</div><div class="bk-count-txt">avtobus tapıldı</div></div></div>';
  }
}

function bkCollectData(){
  return {
    carrier: document.getElementById('bk_carrier').value,
    report_date: bkSelectedDate ? bkDateIso(bkSelectedDate) : '',
    service_start_time: bkGetTime('bk_start_time'),
    service_end_time: bkGetTime('bk_end_time'),
    changed_device_type: document.getElementById('bk_category').value,
    service_location: document.getElementById('bk_location').value,
    service_location_note: document.getElementById('bk_location_note').value,
    request_template: document.getElementById('bk_request_tmpl').value.trim(),
    note: document.getElementById('bk_note').value.trim(),
    solution_template: document.getElementById('bk_solution_tmpl').value.trim(),
    technician_1: document.getElementById('bk_tech1').value,
    technician_2: document.getElementById('bk_tech2').value,
    team_leader: document.getElementById('bk_leader').value
  };
}
function bkValidate(data){
  if(!data.carrier)              return 'Daşıyıcı firma seçilməyib';
  if(!data.report_date)         return 'Servis tarixi seçilməyib';
  if(!data.service_start_time)  return 'Servis başlanğıc saatı düzgün deyil';
  if(!data.service_end_time)    return 'Servis bitiş saatı düzgün deyil';
  if(!data.changed_device_type) return 'Servis kateqoriyası seçilməyib';
  if(!data.request_template)    return 'Tələb (şablon) mətni boşdur';
  if(!data.solution_template)   return 'Həll (şablon) mətni boşdur';
  if(!data.team_leader)         return 'Qrup rəhbəri seçilməyib';
  if(data.service_location && data.service_location.toLowerCase().indexOf('digər')!==-1 && !data.service_location_note) return 'Ünvan qeydi yazın';
  return null;
}

function bkOpenPreview(){
  var data=bkCollectData(); var err=bkValidate(data); if(err){alert(err);return;}
  document.getElementById('bkMainLayout').classList.add('preview-open');
  var body=document.getElementById('bkPreviewBody');
  body.innerHTML='<div class="bk-loading-mini"><div class="spinner" style="width:38px;height:38px;border-width:4px;"></div><div style="font-size:13px;color:#5C7089;font-weight:600;">Hazırlanır...</div></div>';
  fetch(API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'previewBulkImport',data:data})})
  .then(function(r){return r.json();})
  .then(function(d){
    if(d.status!=='OK'){body.innerHTML=bkEmptyBodyHtml(d.message||'Xəta baş verdi');return;}
    bkPreviewData=d; renderBkPreviewPanel(data,d);
  })
  .catch(function(e){body.innerHTML=bkEmptyBodyHtml('Şəbəkə xətası: '+e.message);});
}
function bkClosePreview(){
  document.getElementById('bkMainLayout').classList.remove('preview-open');
  var body=document.getElementById('bkPreviewBody');
  if(body) body.innerHTML='<div class="bk-empty-state"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg><div>Parametrləri doldurun və "Ön baxış" düyməsinə basın</div></div>';
}
function bkEmptyBodyHtml(msg){
  return '<div class="bk-empty-state"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div>'+escapeHtml(msg)+'</div></div>';
}
function bkEmptyHtml(msg){ return bkEmptyBodyHtml(msg); }
function bkEmptyHtml(msg){
  return 'div class=bk-preview-headdiv class=bk-preview-titleÖn baxışdivbutton class=bk-preview-close onclick=bkClosePreview()svg width=13 height=13 viewBox=0 0 24 24 fill=none stroke=currentColor stroke-width=2.5path d=M6 6l12 12M18 6L6 18svgbuttondivdiv class=bk-empty-statesvg width=44 height=44 viewBox=0 0 24 24 fill=none stroke=currentColor stroke-width=1.6path d=M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zline x1=12 y1=9 x2=12 y2=13line x1=12 y1=17 x2=12.01 y2=17svgdiv'+escapeHtml(msg)+'divdiv';
}

function renderBkPreviewPanel(data, previewResult){
  var count=previewResult.count||0, sample=previewResult.sample||[];
  var body=document.getElementById('bkPreviewBody');
  if(!body) return;
  var html='';
  // Carrier card
  html+='<div class="bk-carrier-card"><div class="bk-carrier-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 16V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9"/><path d="M3 16h18"/><circle cx="7" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></svg></div><div><div class="bk-carrier-name">'+escapeHtml(data.carrier)+'</div><div class="bk-carrier-count">'+count+' avtobus tapıldı</div></div></div>';
  if(count===0){
    html+='<div class="bk-empty-state"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div>Bu daşıyıcıya aid reyestrdə avtobus tapılmadı.</div></div>';
    body.innerHTML=html; return;
  }
  var pvRow=function(label,value,extra){
    return '<div class="bk-pv-row'+(extra?' '+extra:'')+'" ><div class="bk-pv-label">'+label+'</div><div class="bk-pv-value">'+escapeHtml(value||'—')+'</div></div>';
  };
  html+=pvRow('Servis tarixi:',       bkDateAz(bkSelectedDate));
  html+=pvRow('Başlanğıc - Bitiş:',   (data.service_start_time||'—')+' - '+(data.service_end_time||'—'));
  html+=pvRow('Servis kateqoriyası:', data.changed_device_type);
  html+=pvRow('Servis ünvanı:',       data.service_location?(data.service_location+(data.service_location_note?' ('+data.service_location_note+')':'')):'—');
  html+=pvRow('Daşıyıcı firma:',      data.carrier);
  html+=pvRow('Tapılan avtobus sayı:', String(count), 'highlight');
  html+=pvRow('Texniklər:',           [data.technician_1,data.technician_2].filter(Boolean).join(', ')||'—');
  html+=pvRow('Qrup rəhbəri:',        data.team_leader);
  html+=pvRow('Tələb (şablon):',      data.request_template);
  html+=pvRow('Qeyd / Note:',         data.note||'Qeyd daxil edilməyib');
  html+=pvRow('Həll (şablon):',       data.solution_template);
  if(sample.length){
    html+='<div class="bk-pv-section-title">Nümunə siyahı (ilk '+sample.length+' sətir)</div>';
    html+='<table class="bk-sample-table"><thead><tr><th>BUS ID</th><th>D.Q.N.</th><th>Marka / Model</th></tr></thead><tbody>';
    sample.forEach(function(s){ html+='<tr><td>'+escapeHtml(s.busId||'')+'</td><td>'+escapeHtml(s.dqn||'')+'</td><td>'+escapeHtml(s.model||'')+'</td></tr>'; });
    html+='</tbody></table>';
    if(count>sample.length) html+='<div class="bk-sample-more">... və daha <b>'+(count-sample.length)+'</b> avtobus</div>';
  }
  html+='<div class="bk-preview-note"><div class="bk-preview-note-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><div><div class="bk-preview-note-title">Qeyd:</div><div class="bk-preview-note-text">İdxal prosesi tamamlandıqdan sonra bütün ticket-lər BUS Service siyahısına əlavə olunacaq və müvafiq bildirişlər göndəriləcək.</div></div></div>';
  html+='<div class="bk-preview-footer"><button class="bk-btn-outline" onclick="bkClosePreview()">Ləğv et</button><button class="bk-btn-primary" onclick="bkConfirmImport()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>İdxal et ('+count+' ticket)</button></div>';
  body.innerHTML=html;
  bkUpdateImportCount();
}

function bkConfirmImport(){
  var data=bkCollectData(); var err=bkValidate(data); if(err){alert(err);return;}
  if(!bkPreviewDatabkPreviewData.count===0){alert(İdxal ediləcək avtobus yoxdur);return;}
  bkRunImport(data,bkPreviewData.count);
}
function bkSubmitDirect(){
  var data=bkCollectData(); var err=bkValidate(data); if(err){alert(err);return;}
  var btn=document.getElementById(bkDirectSubmitBtn); btn.disabled=true;
  fetch(API_URL,{methodPOST,headers{Content-Typetextplain;charset=utf-8},bodyJSON.stringify({actionpreviewBulkImport,datadata})})
  .then(function(r){return r.json();})
  .then(function(d){
    btn.disabled=false;
    if(d.status!==OK){alert(d.messageXəta baş verdi);return;}
    if(d.count===0){alert(''+data.carrier+' daşıyıcısına aid reyestrdə avtobus tapılmadı.');return;}
    if(!confirm(d.count+ avtobus üçün ticket yaradılacaq. Davam edilsin)) return;
    bkRunImport(data,d.count);
  })
  .catch(function(e){btn.disabled=false;alert(Şəbəkə xətası +e.message);});
}
function bkRunImport(data,count){
  var ov=document.getElementById(bkLoadingOverlay);
  var sp=document.getElementById(bkSpinner);
  var ic=document.getElementById(bkSuccessIcon);
  var tx=document.getElementById(bkLoadingText);
  ov.classList.add(open); sp.style.display=block; ic.style.display=none;
  tx.textContent=count+ ticket idxal edilir...;
  fetch(API_URL,{methodPOST,headers{Content-Typetextplain;charset=utf-8},bodyJSON.stringify({actionsubmitBulkImport,datadata,userEmailcurrentUsercurrentUser.email})})
  .then(function(r){return r.json();})
  .then(function(result){
    sp.style.display=none; ic.style.display=flex;
    if(result.status===OK){
      tx.textContent=İdxal tamamlandı! +result.count+ ticket (+result.firstTicketId+ → +result.lastTicketId+);
    } else { tx.textContent=Xəta +(result.message); }
    setTimeout(function(){ ov.classList.remove(open); if(result.status===OK){ resetBulkForm(); closeBusBulk(); } },2200);
  })
  .catch(function(e){ sp.style.display=none; tx.textContent=Şəbəkə xətası; setTimeout(function(){ov.classList.remove(open);},1500); });
}

function resetBulkForm(){
  bkClosePreview(); bkPreviewData=null;
  ['bk_carrier','bk_category','bk_location','bk_tech1','bk_tech2','bk_leader'].forEach(function(id){ var el=document.getElementById(id); if(el)el.value=''; });
  ['bk_location_note','bk_request_tmpl','bk_note','bk_solution_tmpl','bk_start_time','bk_end_time'].forEach(function(id){ var el=document.getElementById(id); if(el)el.value=''; });
  document.getElementById('bk_location_note_wrap').style.display='none';
  document.getElementById('bkCarrierCountWrap').innerHTML='';
  var now=bakuNowDate();
  bkCalYear=now.getFullYear(); bkCalMonth=now.getMonth();
  bkSelectedDate=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  renderBkCal();
  bkUpdateImportCount();
}

// ── bkUpdateImportCount: footer-dakı sayı ─────────────────
function bkUpdateImportCount(){
  var carrier = document.getElementById('bk_carrier') ? document.getElementById('bk_carrier').value : '';
  var count = 0;
  if(carrier && bsFormData && bsFormData.busRegistry){
    count=(bsFormData.busRegistry||[]).filter(function(r){
      return String(r.carrier).trim().toLowerCase()===carrier.trim().toLowerCase();
    }).length;
  }
  var el = document.getElementById('bkImportCount');
  if(el) el.textContent = count;
}

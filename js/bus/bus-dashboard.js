// ============================================================
// BUS-DASHBOARD.JS - BUS Dashboard
// ============================================================

var dashActiveChips = {};
var dashSubfilterState = {};
var dashTextFilters = {};
var dashCustomRange = null;
var dashPeriod = "24h";
var dashAllRows = [];

var dcalYear, dcalMonth, dcalRangeStart=null, dcalRangeEnd=null;
var DCAL_DOWS = ["B.e","Ç.a","Ç","C.a","C","Ş","B"];
var DCAL_MONTHS = ["Yanvar","Fevral","Mart","Aprel","May","İyun","İyul","Avqust","Sentyabr","Oktyabr","Noyabr","Dekabr"];

var DASH_CATS = [
  {key:"Problem", type:"multi", getOptions:function(){ return bsFormData.busProblems||[]; }},
  {key:"Həll", type:"multi", getOptions:function(){ return bsFormData.solutions||[]; }},
  {key:"Daşıyıcı", type:"multi", getOptions:function(){ return bsFormData.carriers||[]; }},
  {key:"D.Q.N.", type:"text"},
  {key:"BUS ID", type:"numeric", maxlen:5},
  {key:"Qrup Rəhbəri", type:"multi", getOptions:function(){ return bsFormData.leaders||[]; }},
  {key:"Texnik", type:"multi", getOptions:function(){ return bsFormData.technicians||[]; }},
  {key:"Servis verilən Ünvan", type:"multi", getOptions:function(){ return bsFormData.locations||[]; }},
  {key:"Servis Kateqoriyaları", type:"multi", getOptions:function(){ return bsFormData.busEquipment||[]; }}
];

// ===== INIT =====
function init_bus_dashboard() {
  document.getElementById("bus-bus-dashboardContainer").style.display = "flex";
  dashCustomRange = null;
  dashPeriod = "24h";
  updateDashTabsUI();
  loadDashData();
}

function closeBusDashboard(){
  var container = document.getElementById("bus-bus-dashboardContainer");
  if(container) container.style.display = "none";
  document.getElementById("dashboardView").style.display = "block";
}

function getBakuNowParts(){
  var now = new Date();
  var parts = new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Baku",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).formatToParts(now);
  var map={}; parts.forEach(function(p){map[p.type]=p.value;});
  return { y:+map.year, mo:+map.month, d:+map.day, h:+map.hour, mi:+map.minute, s:+map.second };
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
  if(period === "all") return {start:null, end:null};
  var end = bakuNowDate();
  var start = new Date(end);
  if(period === "24h") start.setDate(start.getDate()-1);
  else if(period === "week") start.setDate(start.getDate()-7);
  else if(period === "month") start.setDate(start.getDate()-daysInCurrentMonth());
  return {start:start, end:end};
}

function rowDate(row){
  var d = row["Tarix"]||""; var t = row["Saat"]||"00:00";
  var dp = d.split(".");
  if(dp.length!==3) return null;
  var tp = t.split(":");
  return new Date(+dp[2], +dp[1]-1, +dp[0], +(tp[0]||0), +(tp[1]||0));
}

function dashSelectedOptions(key){
  return Object.keys(dashSubfilterState).filter(function(k){ return k.indexOf(key+"::")===0 && dashSubfilterState[k]; }).map(function(k){ return k.slice(key.length+2); });
}

function dashHasActiveOptions(key){ return dashSelectedOptions(key).length>0; }

function dashMatchMulti(val, key){
  if(!val) return false;
  return dashSelectedOptions(key).indexOf(val) !== -1;
}

function dashMatchSolution(val, key){
  if(!val) return false;
  var sel = dashSelectedOptions(key);
  return val.split(" | ").some(function(p){ return sel.indexOf(p.trim())!==-1; });
}

function dashMatchLocation(val, key){
  if(!val) return false;
  var base = val.replace(/\s*\(.*\)$/,"").trim();
  return dashSelectedOptions(key).indexOf(base)!==-1;
}

function dashGetFilteredRows(){
  var range = dashCustomRange || dashComputeRange(dashPeriod);
  return dashAllRows.filter(function(row){
    if(range.start && range.end){
      var rd = rowDate(row);
      if(!rd || rd < range.start || rd > range.end) return false;
    }
    if(dashHasActiveOptions("Problem") && !dashMatchMulti(row["Problem"],"Problem")) return false;
    if(dashHasActiveOptions("Həll") && !dashMatchSolution(row["Həll"],"Həll")) return false;
    if(dashHasActiveOptions("Daşıyıcı") && !dashMatchMulti(row["Daşıyıcı"],"Daşıyıcı")) return false;
    if(dashTextFilters["D.Q.N."] && (row["D.Q.N."]||"").toLowerCase().indexOf(dashTextFilters["D.Q.N."].toLowerCase())===-1) return false;
    if(dashTextFilters["BUS ID"] && (row["BUS ID"]||"").indexOf(dashTextFilters["BUS ID"])===-1) return false;
    if(dashHasActiveOptions("Qrup Rəhbəri") && !dashMatchMulti(row["Qrup rəhbəri"],"Qrup Rəhbəri")) return false;
    if(dashHasActiveOptions("Texnik") && !(dashMatchMulti(row["1. Texnik"],"Texnik") || dashMatchMulti(row["2. Texnik"],"Texnik"))) return false;
    if(dashHasActiveOptions("Servis verilən Ünvan") && !dashMatchLocation(row["Servis yeri"],"Servis verilən Ünvan")) return false;
    if(dashHasActiveOptions("Servis Kateqoriyaları") && !dashMatchMulti(row["Servis Kat."],"Servis Kateqoriyaları")) return false;
    return true;
  });
}

function dashCount(rows, field, splitMulti){
  var map = {};
  rows.forEach(function(r){
    var v = r[field];
    if(!v) return;
    var vals = splitMulti ? v.split(" | ") : [v];
    vals.forEach(function(vv){ vv=(vv||"").trim(); if(!vv) return; map[vv]=(map[vv]||0)+1; });
  });
  return Object.keys(map).map(function(k){ return {name:k,count:map[k]}; }).sort(function(a,b){ return b.count-a.count; });
}

function dashCountLocation(rows){
  var map={};
  rows.forEach(function(r){
    var v=r["Servis yeri"]; if(!v) return;
    var base=v.replace(/\s*\(.*\)$/,"").trim(); if(!base) return;
    map[base]=(map[base]||0)+1;
  });
  return Object.keys(map).map(function(k){ return {name:k,count:map[k]}; }).sort(function(a,b){ return b.count-a.count; });
}

function dashCountTech(rows){
  var map={};
  rows.forEach(function(r){
    [r["1. Texnik"], r["2. Texnik"]].forEach(function(v){ if(!v) return; map[v]=(map[v]||0)+1; });
  });
  return Object.keys(map).map(function(k){ return {name:k,count:map[k]}; }).sort(function(a,b){ return b.count-a.count; });
}

function dashCountRecurringBuses(rows){
  var map={};
  rows.forEach(function(r){
    var id=r["BUS ID"]; if(!id) return;
    if(!map[id]) map[id]={plate:r["D.Q.N."],count:0};
    map[id].count++;
  });
  return Object.keys(map).map(function(id){ return {busId:id, plate:map[id].plate, count:map[id].count}; })
    .filter(function(x){ return x.count>=3; }).sort(function(a,b){ return b.count-a.count; });
}

function dashFixedMetrics(){
  var now = bakuNowDate();
  var todayStart = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0);
  var weekStart = new Date(now); weekStart.setDate(weekStart.getDate()-7);
  var totalToday=0, totalWeek=0;
  dashAllRows.forEach(function(r){
    var rd = rowDate(r); if(!rd) return;
    if(rd>=todayStart) totalToday++;
    if(rd>=weekStart) totalWeek++;
  });
  return {totalAll:dashAllRows.length, totalToday:totalToday, totalWeek:totalWeek};
}

function dashRenderRadial(containerId, items, total){
  var el = document.getElementById(containerId);
  var top = items.slice(0,4);
  if(top.length===0){ el.innerHTML='<div class="dash-empty-txt">Bu dövr üçün qeydə alınmayıb.</div>'; return; }
  var R=30, C=2*Math.PI*R, html="";
  top.forEach(function(it){
    var pct = total>0 ? Math.round(it.count/total*100) : 0;
    var offset = C - (C*pct/100);
    html += '<div class="dash-radial-card">'
      + '<svg width="68" height="68" viewBox="0 0 72 72">'
      +   '<circle cx="36" cy="36" r="'+R+'" fill="none" stroke="#E6F1FB" stroke-width="8"/>'
      +   '<circle cx="36" cy="36" r="'+R+'" fill="none" stroke="#2F6FED" stroke-width="8" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+offset.toFixed(1)+'" stroke-linecap="round" transform="rotate(-90 36 36)"/>'
      +   '<text x="36" y="41" text-anchor="middle" font-family="Rajdhani" font-weight="700" font-size="17" fill="#12233B">'+pct+'%</text>'
      + '</svg>'
      + '<div class="dash-radial-textbox">'+escapeHtml(it.name)+'</div>'
      + '<div class="dash-radial-count">'+it.count+' servis</div>'
      + '</div>';
  });
  el.innerHTML = html;
}

function buildRankTableRows(items, numStyle, countStyle){
  var html = "";
  items.forEach(function(it,i){
    html += '<tr>'
      + '<td class="dr-num-col"><span'+(numStyle?' style="'+numStyle+'"':'')+'">'+(i+1)+'</span></td>'
      + '<td>'+escapeHtml(it.name)+'</td>'
      + '<td class="dr-count-col"><span class="dash-rank-count-val"'+(countStyle?' style="'+countStyle+'"':'')+'>'+it.count+'</span></td>'
      + '</tr>';
  });
  return html;
}

function dashRenderRankList(containerId, items, max, headerLabel, nameHeader){
  var el = document.getElementById(containerId);
  var top = items.slice(0, max||6);
  if(top.length===0){ el.innerHTML='<div class="dash-empty-txt">Bu dövr üçün qeydə alınmayıb.</div>'; return; }
  var html = '<div class="dash-ranklist-wrap"><table class="dash-ranklist"><thead><tr>'
    + '<th class="dr-num-col"></th><th>'+(nameHeader||"Ad")+'</th><th class="dr-count-col">'+(headerLabel||"Servis sayı")+'</th>'
    + '</tr></thead><tbody>' + buildRankTableRows(top) + '</tbody></table></div>';
  el.innerHTML = html;
}

function dashRenderTiles(containerId, items, max){
  var el = document.getElementById(containerId);
  var top = items.slice(0, max||8);
  if(top.length===0){ el.innerHTML='<div class="dash-empty-txt">Bu dövr üçün qeydə alınmayıb.</div>'; return; }
  var icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 8h6M9 12h6"/></svg>';
  var html="";
  top.forEach(function(it){
    html += '<div class="dash-tile"><div class="dash-tile-icon">'+icon+'</div><div class="dash-tile-name">'+escapeHtml(it.name)+'</div><div class="dash-tile-count">'+it.count+'</div></div>';
  });
  el.innerHTML = html;
}

function dashRenderLeaders(containerId, items, max){
  var el = document.getElementById(containerId);
  var top = items.slice(0, max||6);
  if(top.length===0){ el.innerHTML='<div class="dash-empty-txt">Bu dövr üçün qeydə alınmayıb.</div>'; return; }
  var maxCount = top[0].count || 1, html="";
  top.forEach(function(it){
    var initials = it.name.split(" ").map(function(w){ return w[0]||""; }).join("").slice(0,2).toUpperCase();
    var pct = Math.round(it.count/maxCount*100);
    html += '<div class="dash-lead-row"><div class="dash-avatar">'+escapeHtml(initials)+'</div><div class="dash-lead-name">'+escapeHtml(it.name)+'</div><div class="dash-lead-bar-wrap"><div class="dash-lead-bar" style="width:'+pct+'%;"></div></div><div class="dash-lead-count">'+it.count+'</div></div>';
  });
  el.innerHTML = html;
}

function dashRenderRecurring(containerId, items){
  var el = document.getElementById(containerId);
  if(items.length===0){ el.innerHTML='<div class="dash-empty-txt">Bu dövr üçün heç bir avtobus 3 və ya daha çox servis almayıb.</div>'; return; }
  var mapped = items.slice(0,15).map(function(it){ return { name:(it.plate||"—")+" · BUS "+it.busId, count:it.count }; });
  var html = '<div class="dash-ranklist-wrap"><table class="dash-ranklist"><thead><tr>'
    + '<th class="dr-num-col"></th><th>Avtobus (D.Q.N. · BUS ID)</th><th class="dr-count-col">Servis sayı</th>'
    + '</tr></thead><tbody>' + buildRankTableRows(mapped, "background:#FEECEC;color:#A32D2D;", "color:#A32D2D;") + '</tbody></table></div>';
  el.innerHTML = html;
}

function dashMobileSection(title, items, max, headerLabel){
  var top = items.slice(0, max||6);
  var html = '<div class="dash-m-section"><div class="dash-m-title">'+title+'</div>';
  if(top.length===0){
    html += '<div class="dash-m-card-empty">Bu dövr üçün qeydə alınmayıb.</div>';
  } else {
    html += '<div class="dash-ranklist-wrap"><table class="dash-ranklist"><thead><tr>'
      + '<th class="dr-num-col"></th><th>Ad</th><th class="dr-count-col">'+(headerLabel||"Say")+'</th>'
      + '</tr></thead><tbody>' + buildRankTableRows(top) + '</tbody></table></div>';
  }
  html += '</div>';
  return html;
}

function dashRenderMobile(agg){
  document.getElementById("dashMTotalAll").textContent = agg.totalAll;
  document.getElementById("dashMTotalToday").textContent = agg.totalToday;
  document.getElementById("dashMTotalWeek").textContent = agg.totalWeek;

  var html = "";
  html += dashMobileSection("Ən çox rast gəlinən problem", agg.problems, 4);
  html += dashMobileSection("Ən çox rast gəlinən həll", agg.solutions, 4);
  html += dashMobileSection("Servis kateqoriyaları", agg.categories, 8);
  html += dashMobileSection("Texnik fəaliyyəti", agg.tech, 8);
  html += dashMobileSection("Qrup rəhbəri fəaliyyəti", agg.leaders, 8);
  html += dashMobileSection("Daşıyıcı firma üzrə statistika", agg.carriers, 8);
  html += dashMobileSection("Servis verilən ünvan", agg.locations, 8);

  var recItems = agg.recurring.map(function(it){ return {name:(it.plate||"—")+" · BUS "+it.busId, count:it.count}; });
  html += dashMobileSection("Təkrarlanan problemli avtobuslar", recItems, 15, "Servis sayı");

  document.getElementById("dashMobileSections").innerHTML = html;
}

function dashComputeAndRender(){
  var fixed = dashFixedMetrics();
  document.getElementById("dashTotalAll").textContent = fixed.totalAll;
  document.getElementById("dashTotalToday").textContent = fixed.totalToday;
  document.getElementById("dashTotalWeek").textContent = fixed.totalWeek;

  var filtered = dashGetFilteredRows();

  var problems = dashCount(filtered, "Problem", false);
  var solutions = dashCount(filtered, "Həll", true);
  var categories = dashCount(filtered, "Servis Kat.", false);
  var tech = dashCountTech(filtered);
  var leaders = dashCount(filtered, "Qrup rəhbəri", false);
  var carriers = dashCount(filtered, "Daşıyıcı", false);
  var locations = dashCountLocation(filtered);
  var recurring = dashCountRecurringBuses(filtered);

  dashRenderRadial("dashProblemGrid", problems, filtered.length);
  dashRenderRankList("dashSolutionList", solutions, 4);
  dashRenderTiles("dashCategoryGrid", categories, 8);
  dashRenderLeaders("dashTechList", tech, 8);
  dashRenderLeaders("dashLeaderList", leaders, 8);
  dashRenderRankList("dashCarrierList", carriers, 8);
  dashRenderRankList("dashLocationList", locations, 8);
  dashRenderRecurring("dashRecurringPanel", recurring);

  dashRenderMobile({
    totalAll:fixed.totalAll, totalToday:fixed.totalToday, totalWeek:fixed.totalWeek,
    problems:problems, solutions:solutions, categories:categories, tech:tech, leaders:leaders,
    carriers:carriers, locations:locations, recurring:recurring
  });
}

function loadDashData(){
  var ov = document.getElementById("dashLoading");
  ov.classList.add("open");
  var reportPromise = fetch(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"getReportData"})}).then(function(r){return r.json();});
  var formPromise = (bsFormData && bsFormData.carriers) ? Promise.resolve(bsFormData) :
    fetch(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"getFormData"})}).then(function(r){return r.json();}).then(function(d){ if(d.status==="OK") bsFormData=d; return bsFormData; });
  Promise.all([reportPromise, formPromise]).then(function(results){
    var d = results[0];
    if(d.status==="OK"){ dashAllRows = d.rows||[]; }
    ov.classList.remove("open");
    dashComputeAndRender();
  }).catch(function(){
    ov.classList.remove("open");
  });
}

function updateDashTabsUI(){
  document.querySelectorAll("#dashTabs .dash-tab").forEach(function(t){ t.classList.toggle("active", t.getAttribute("data-period")===dashPeriod); });
}

document.addEventListener("DOMContentLoaded", function(){
  var tabs = document.querySelectorAll("#dashTabs .dash-tab");
  tabs.forEach(function(t){
    t.addEventListener("click", function(){
      tabs.forEach(function(x){ x.classList.remove("active"); });
      t.classList.add("active");
      dashPeriod = t.getAttribute("data-period");
      dashCustomRange = null;
      dashComputeAndRender();
    });
  });
});

// ===== MODAL =====
function openDashModal(){
  ensureDashFormDataThenBuildChips();
  document.getElementById("dashModal").classList.add("open");
}

function closeDashModal(){
  document.getElementById("dashModal").classList.remove("open");
  document.getElementById("dashModalFilterBody").style.display = "flex";
  document.getElementById("dashModalResults").classList.remove("open");
  document.getElementById("dashResetBtnEl").style.display = "";
  document.getElementById("dashModalTitle").textContent = "Tarix aralığı və filtrlər";
  document.getElementById("dashSearchWarn").style.display = "none";
}

function ensureDashFormDataThenBuildChips(){
  if(bsFormData && bsFormData.carriers){ buildDashChips(); }
  else {
    fetch(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"getFormData"})}).then(function(r){return r.json();}).then(function(d){ if(d.status==="OK") bsFormData=d; buildDashChips(); });
  }
}

function buildDashChips(){
  var row = document.getElementById("dashChipRow");
  row.innerHTML = "";
  DASH_CATS.forEach(function(cat){
    var c = document.createElement("div");
    c.className = "dash-chip" + (dashActiveChips[cat.key] ? " active" : "");
    c.textContent = cat.key;
    c.onclick = function(){
      dashActiveChips[cat.key] = !dashActiveChips[cat.key];
      var warnEl = document.getElementById("dashSearchWarn");
      if(warnEl) warnEl.style.display = "none";
      c.classList.toggle("active");
      renderDashSubfilters();
    };
    row.appendChild(c);
  });
  renderDashSubfilters();
}

function renderDashSubfilters(){
  var wrap = document.getElementById("dashSubfilters");
  wrap.innerHTML = "";
  DASH_CATS.forEach(function(cat){
    if(!dashActiveChips[cat.key]) return;
    var box = document.createElement("div");
    box.className = "dash-subfilter";
    var title = document.createElement("div");
    title.className = "dash-subfilter-title";
    title.textContent = cat.key;
    box.appendChild(title);
    if(cat.type === "multi"){
      var opts = document.createElement("div");
      opts.className = "dash-subfilter-opts";
      (cat.getOptions()||[]).forEach(function(opt){
        var o = document.createElement("div");
        var key = cat.key+"::"+opt;
        o.className = "dash-opt-chip" + (dashSubfilterState[key] ? " sel" : "");
        o.textContent = opt.length>28 ? opt.slice(0,28)+"…" : opt;
        o.title = opt;
        o.onclick = function(){ dashSubfilterState[key] = !dashSubfilterState[key]; o.classList.toggle("sel"); };
        opts.appendChild(o);
      });
      box.appendChild(opts);
    } else if(cat.type === "text"){
      var inp = document.createElement("input");
      inp.type="text"; inp.placeholder="Axtar...";
      inp.value = dashTextFilters[cat.key] || "";
      inp.oninput = function(){ dashTextFilters[cat.key] = this.value; };
      box.appendChild(inp);
    } else if(cat.type === "numeric"){
      var inp2 = document.createElement("input");
      inp2.type="text"; inp2.inputMode="numeric"; inp2.placeholder="ID"; inp2.maxLength = cat.maxlen;
      inp2.value = dashTextFilters[cat.key] || "";
      inp2.oninput = function(){ this.value = this.value.replace(/[^0-9]/g,"").slice(0,cat.maxlen); dashTextFilters[cat.key]=this.value; };
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
  document.getElementById("dashModalFilterBody").style.display = "flex";
  document.getElementById("dashModalResults").classList.remove("open");
  document.getElementById("dashModalTitle").textContent = "Tarix aralığı və filtrlər";
  document.getElementById("dashSearchWarn").style.display = "none";
}

// ===== CALENDAR =====
function initDcal(){ var now=bakuNowDate(); dcalYear=now.getFullYear(); dcalMonth=now.getMonth(); renderDcal(); }

function dcalNav(dir){ dcalMonth+=dir; if(dcalMonth<0){dcalMonth=11;dcalYear--;} if(dcalMonth>11){dcalMonth=0;dcalYear++;} renderDcal(); }

function renderDcal(){
  document.getElementById("dcalLabel").textContent = DCAL_MONTHS[dcalMonth]+" "+dcalYear;
  var grid = document.getElementById("dcalGrid");
  grid.innerHTML = "";
  DCAL_DOWS.forEach(function(d){ var el=document.createElement("div"); el.className="dcal-dow"; el.textContent=d; grid.appendChild(el); });
  var firstDay = new Date(dcalYear,dcalMonth,1);
  var startOffset = (firstDay.getDay()+6)%7;
  var daysInMonth = new Date(dcalYear,dcalMonth+1,0).getDate();
  var daysInPrev = new Date(dcalYear,dcalMonth,0).getDate();
  for(var i=0;i<startOffset;i++){ var el=document.createElement("div"); el.className="dcal-day muted"; el.textContent=daysInPrev-startOffset+i+1; grid.appendChild(el); }
  for(var d=1; d<=daysInMonth; d++){
    (function(day){
      var el = document.createElement("div"); el.className="dcal-day"; el.textContent=day;
      var thisDate = new Date(dcalYear,dcalMonth,day);
      if(dcalRangeStart && sameDayDc(thisDate,dcalRangeStart)) el.classList.add("range-start");
      if(dcalRangeEnd && sameDayDc(thisDate,dcalRangeEnd)) el.classList.add("range-end");
      if(dcalRangeStart && dcalRangeEnd && thisDate>dcalRangeStart && thisDate<dcalRangeEnd) el.classList.add("in-range");
      el.onclick = function(){ pickDcalDate(thisDate); };
      grid.appendChild(el);
    })(d);
  }
  updateDcalTxt();
}

function sameDayDc(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }

function pickDcalDate(d){
  if(!dcalRangeStart || (dcalRangeStart && dcalRangeEnd)){ dcalRangeStart=d; dcalRangeEnd=null; }
  else { if(d<dcalRangeStart){ dcalRangeEnd=dcalRangeStart; dcalRangeStart=d; } else { dcalRangeEnd=d; } }
  renderDcal();
  var warnEl = document.getElementById("dashSearchWarn");
  if(warnEl) warnEl.style.display = "none";
}

function fmtDc(d){ return String(d.getDate()).padStart(2,"0")+"."+String(d.getMonth()+1).padStart(2,"0")+"."+d.getFullYear(); }

function updateDcalTxt(){
  var t = document.getElementById("dcalSelectedTxt");
  if(dcalRangeStart && dcalRangeEnd) t.textContent = fmtDc(dcalRangeStart)+"  →  "+fmtDc(dcalRangeEnd);
  else if(dcalRangeStart) t.textContent = fmtDc(dcalRangeStart)+" seçildi — bitiş tarixini seçin";
  else t.textContent = "Başlanğıc tarixi seçin";
}
initDcal();

function runDashSearch(){
  var hasRange = dcalRangeStart && dcalRangeEnd;
  var hasActiveCat = Object.keys(dashActiveChips).some(function(k){ return dashActiveChips[k]; });

  if(!hasRange && !hasActiveCat){
    document.getElementById("dashSearchWarn").style.display = "flex";
    return;
  }
  document.getElementById("dashSearchWarn").style.display = "none";

  if(hasRange){
    dashCustomRange = {
      start: new Date(dcalRangeStart.getFullYear(),dcalRangeStart.getMonth(),dcalRangeStart.getDate(),0,0,0),
      end: new Date(dcalRangeEnd.getFullYear(),dcalRangeEnd.getMonth(),dcalRangeEnd.getDate(),23,59,59)
    };
    document.querySelectorAll("#dashTabs .dash-tab").forEach(function(t){ t.classList.remove("active"); });
  }

  document.getElementById("dashModalFilterBody").style.display = "none";
  document.getElementById("dashModalTitle").textContent = "Nəticələr";
  var resultsPanel = document.getElementById("dashModalResults");
  resultsPanel.classList.add("open");
  document.getElementById("dashModalResultsBody").innerHTML =
    '<div style="display:flex;flex-direction:column;align-items:center;gap:14px;padding:50px 0;">'
    + '<div class="spinner" style="width:38px;height:38px;border-width:4px;"></div>'
    + '<div style="font-size:13.5px;color:#5C7089;font-weight:600;">Hazırlanır...</div></div>';

  setTimeout(function(){
    dashComputeAndRender();
    renderDashModalResults();
  }, 1400);
}

function dashPivotBlock(title, items, countLabel, nameHeader){
  if(!items || items.length===0) return '';
  var b = '<div style="font-size:12px;font-weight:700;color:#8CA0BC;margin-bottom:8px;">'+title+'</div>';
  b += '<div class="dash-ranklist-wrap" style="margin-bottom:20px;"><table class="dash-ranklist"><thead><tr>'
    + '<th class="dr-num-col"></th><th>'+(nameHeader||"Ad")+'</th><th class="dr-count-col">'+(countLabel||"Servis sayı")+'</th>'
    + '</tr></thead><tbody>' + buildRankTableRows(items.slice(0,10)) + '</tbody></table></div>';
  return b;
}

function renderDashModalResults(){
  var filtered = dashGetFilteredRows();
  var activeAny = Object.keys(dashActiveChips).some(function(k){ return dashActiveChips[k]; });

  var html = '<div style="font-size:13.5px;color:#5C7089;margin-bottom:18px;">Seçilmiş aralıqda <b style="color:#12233B;font-family:\'Rajdhani\',sans-serif;font-size:19px;">'+filtered.length+'</b> nəticə tapıldı.</div>';

  if(dashActiveChips["Problem"]) html += dashPivotBlock("Problem üzrə bölgü", dashCount(filtered,"Problem",false), "Servis sayı", "Problem");
  if(dashActiveChips["Həll"]) html += dashPivotBlock("Həll üzrə bölgü", dashCount(filtered,"Həll",true), "Servis sayı", "Həll");
  if(dashActiveChips["Daşıyıcı"]) html += dashPivotBlock("Daşıyıcı üzrə bölgü", dashCount(filtered,"Daşıyıcı",false), "Servis sayı", "Daşıyıcı");
  if(dashActiveChips["Qrup Rəhbəri"]) html += dashPivotBlock("Qrup Rəhbəri üzrə bölgü", dashCount(filtered,"Qrup rəhbəri",false), "Servis sayı", "Qrup Rəhbəri");
  if(dashActiveChips["Texnik"]) html += dashPivotBlock("Texnik üzrə bölgü", dashCountTech(filtered), "Servis sayı", "Texnik");
  if(dashActiveChips["Servis verilən Ünvan"]) html += dashPivotBlock("Servis verilən ünvan üzrə bölgü", dashCountLocation(filtered), "Servis sayı", "Ünvan");
  if(dashActiveChips["Servis Kateqoriyaları"]) html += dashPivotBlock("Servis kateqoriyası üzrə bölgü", dashCount(filtered,"Servis Kat.",false), "Servis sayı", "Kateqoriya");

  if(dashActiveChips["D.Q.N."] || dashActiveChips["BUS ID"]){
    var ticketItems = filtered.slice(0,15).map(function(r){
      return { name:(r["Ticket ID"]||"")+" · "+(r["Tarix"]||"")+" · "+(r["D.Q.N."]||""), count:(r["BUS ID"]||"") };
    });
    html += dashPivotBlock("Uyğun gələn ticket-lər", ticketItems, "BUS ID", "Ticket");
  }

  if(!activeAny){
    html += dashPivotBlock("Ən çox rast gəlinən problem (ümumi baxış)", dashCount(filtered,"Problem",false).slice(0,4), "Servis sayı", "Problem");
  }

  html += '<div style="font-size:12px;color:#8CA0BC;line-height:1.5;">Tam hesabat əsas Dashboard səhifəsində də yeniləndi.</div>';

  document.getElementById("dashModalResultsBody").innerHTML = html;
}

function exportDashboardExcel(){
  if(typeof XLSX === "undefined"){ alert("Excel kitabxanası yüklənməyib"); return; }
  var filtered = dashGetFilteredRows();
  var wb = XLSX.utils.book_new();
  function addSheet(name, items, headers){
    var aoa = [headers];
    items.forEach(function(it){ aoa.push([it.name, it.count]); });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), name);
  }
  addSheet("Problem", dashCount(filtered,"Problem",false), ["Problem","Say"]);
  addSheet("Hell", dashCount(filtered,"Həll",true), ["Hell","Say"]);
  addSheet("Kateqoriya", dashCount(filtered,"Servis Kat.",false), ["Kateqoriya","Say"]);
  addSheet("Texnik", dashCountTech(filtered), ["Texnik","Say"]);
  addSheet("Rehber", dashCount(filtered,"Qrup rəhbəri",false), ["Qrup Rehberi","Say"]);
  addSheet("Dasiyici", dashCount(filtered,"Daşıyıcı",false), ["Dasiyici","Say"]);
  addSheet("Unvan", dashCountLocation(filtered), ["Unvan","Say"]);
  var recur = dashCountRecurringBuses(filtered);
  var recurAoa = [["D.Q.N.","BUS ID","Say"]];
  recur.forEach(function(it){ recurAoa.push([it.plate||"", it.busId, it.count]); });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(recurAoa), "Tekrarlanan");
  var today = new Date();
  var fname = "BUS_Dashboard_" + String(today.getDate()).padStart(2,"0") + "." + String(today.getMonth()+1).padStart(2,"0") + "." + today.getFullYear() + ".xlsx";
  XLSX.writeFile(wb, fname);
}
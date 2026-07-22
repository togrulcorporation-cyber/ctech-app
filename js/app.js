// ============================================================
// APP.JS - Ümumi funksiyalar (Login, Dashboard, Theme, Clock)
// ============================================================

var API_URL = "https://script.google.com/macros/s/AKfycbytFqFdrsHqKrD2YnurKsXATyjAMLbFAtV3gEcLxmPF_DjfGk2A9yyBrhs7XgoM-uYcbw/exec";
var currentUser = null;
var SESSION_KEY = "ctech_session";
var SESSION_DAYS = 14;

// ===== SESSION =====
function saveSession(u){ try{ localStorage.setItem(SESSION_KEY, JSON.stringify({user:u, expires:Date.now()+(SESSION_DAYS*86400000)})); }catch(e){} }
function clearSession(){ try{ localStorage.removeItem(SESSION_KEY); }catch(e){} }
function loadSession(){ try{ var r=localStorage.getItem(SESSION_KEY); if(!r)return null; var d=JSON.parse(r); if(Date.now()>d.expires){clearSession();return null;} return d.user; }catch(e){return null;} }

// ===== LOGIN =====
var clockStarted = false;

function togglePassword(){
  var pw=document.getElementById("password");
  var icon=document.getElementById("eyeIcon");
  if(pw.type==="password"){ pw.type="text"; icon.innerHTML='<path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a19.9 19.9 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a19.9 19.9 0 0 1-2.16 3.19M1 1l22 22"/><path d="M14.12 14.12A3 3 0 1 1 9.88 9.88"/>'; }
  else { pw.type="password"; icon.innerHTML='<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>'; }
}

function showLoading(){ document.getElementById("loadingSpinner").style.display="block"; document.getElementById("successIcon").classList.remove("show"); document.getElementById("failIcon").classList.remove("show"); document.getElementById("loadingText").innerHTML="Yoxlanılır..."; document.getElementById("loadingOverlay").classList.add("open"); }
function showLoadingSuccess(cb){ document.getElementById("loadingSpinner").style.display="none"; document.getElementById("successIcon").classList.add("show"); document.getElementById("loadingText").innerHTML="Uğurlu!"; setTimeout(function(){ document.getElementById("loadingOverlay").classList.remove("open"); cb(); }, 700); }
function showLoadingFail(msg){ document.getElementById("loadingSpinner").style.display="none"; document.getElementById("failIcon").classList.add("show"); document.getElementById("loadingText").innerHTML="Uğursuz"; setTimeout(function(){ document.getElementById("loadingOverlay").classList.remove("open"); var btn=document.getElementById("loginBtn"); btn.disabled=false; btn.innerHTML="Daxil ol"; alert(msg); }, 700); }

function login(){
  var email=document.getElementById("email").value;
  var password=document.getElementById("password").value;
  var btn=document.getElementById("loginBtn");
  if(!email){ alert("Email daxil edin"); return; }
  if(!password){ alert("Şifrəni daxil edin"); return; }
  btn.disabled=true; btn.innerHTML="Yoxlanılır..."; showLoading();
  fetch(API_URL,{ method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"}, body:JSON.stringify({action:"checkUser",email:email,password:password}) })
  .then(function(r){return r.json();})
  .then(function(result){
    if(result.status=="OK"){ currentUser=result; if(document.getElementById("rememberMe").checked){saveSession(result);}else{clearSession();} showLoadingSuccess(function(){showDashboard();}); }
    else if(result.status=="WRONG_PASSWORD"){ showLoadingFail("Şifrə yanlışdır"); }
    else { showLoadingFail(result.debug?"DENIED\n\n"+result.debug:"Bu hesab üçün giriş icazəsi yoxdur"); }
  })
  .catch(function(e){ showLoadingFail("XƏTA: "+e.message); });
}

document.getElementById("password").addEventListener("keydown",function(e){ if(e.key==="Enter"){login();} });

// ===== DASHBOARD =====
function showDashboard(){
  document.getElementById("loginView").style.display="none";
  document.getElementById("dashboardView").style.display="block";
  document.getElementById("welcomeName").innerHTML="Xoş gəlmisiniz";
  document.getElementById("profileName").innerHTML=currentUser.name;
  document.getElementById("profileRole").innerHTML=currentUser.role||"";
  applyAccessLevel();
  if(!clockStarted){ clockStarted=true; updateClock(); setInterval(updateClock,1000); }
}

function getAccessLevel(role){ var r=(role||"").toLowerCase(); if(r.indexOf("admin")!==-1)return"admin"; if(r.indexOf("team")!==-1||r.indexOf("leader")!==-1||r.indexOf("rəhbər")!==-1)return"leader"; return"technician"; }

function applyAccessLevel(){
  var level=getAccessLevel(currentUser.role);
  document.getElementById("dashboardsSection").style.display=(level==="technician")?"none":"block";
  document.getElementById("reportsSection").style.display="block";
  document.getElementById("adminMenuItem").style.display=(level==="admin")?"flex":"none";
}

function updateClock(){
  var now=new Date();
  var parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Baku",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(now);
  var map={}; parts.forEach(function(p){map[p.type]=p.value;});
  document.getElementById("clockDate").innerHTML=map.day+"."+map.month+"."+map.year;
  document.getElementById("clock").innerHTML=map.hour+":"+map.minute;
}

function goHome(){ 
  document.getElementById("loginView").style.display="none"; 
  document.getElementById("dashboardView").style.display="block"; 
  closeMenu(); 
  // Bütün view-ləri gizlət
  document.querySelectorAll('[id$="Container"]').forEach(function(el){ el.style.display = 'none'; });
}

function toggleMenu(){ document.getElementById("menuPanel").classList.toggle("open"); }
function closeMenu(){ document.getElementById("menuPanel").classList.remove("open"); }
document.addEventListener("click",function(e){ var panel=document.getElementById("menuPanel"); if(!panel)return; if(!panel.contains(e.target)&&!e.target.closest(".icon-btn"))closeMenu(); });

function showAbout(){ closeMenu(); document.getElementById("aboutModal").classList.add("open"); }
function hideAbout(){ document.getElementById("aboutModal").classList.remove("open"); }

function signOut(){ 
  closeMenu(); clearSession(); currentUser=null; 
  document.getElementById("email").value=""; 
  document.getElementById("password").value=""; 
  var btn=document.getElementById("loginBtn"); btn.disabled=false; btn.innerHTML="Daxil ol"; 
  document.getElementById("dashboardView").style.display="none"; 
  document.getElementById("loginView").style.display="flex"; 
}
function moduleAlert(n){ alert(n+" modulu tezliklə hazır olacaq"); }

// ===== THEME =====
var MOON_PATH='<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
var SUN_PATH='<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>';

function applyTheme(isDark){
  var icons = [
    document.getElementById("themeIcon"),
    document.getElementById("rptThemeIcon"),
    document.getElementById("dashThemeIcon"),
    document.getElementById("bkThemeIcon")
  ];
  icons.forEach(function(icon){
    if(!icon) return;
    icon.innerHTML = isDark ? SUN_PATH : MOON_PATH;
  });
  if(isDark){ document.body.classList.add("dark-mode"); } else { document.body.classList.remove("dark-mode"); }
}

function toggleTheme(){ 
  var isDark=!document.body.classList.contains("dark-mode"); 
  applyTheme(isDark); 
  try{localStorage.setItem("ctech_theme",isDark?"dark":"light");}catch(e){} 
}

// ===== PULL-TO-REFRESH =====
var ptrStartY = 0;
var ptrTracking = false;
var PTR_THRESHOLD = 80;
var bsFormDirty = false;

function isUnsavedWorkPresent(){
  var bsView = document.getElementById("bus-serviceContainer");
  return bsFormDirty && bsView && bsView.style.display !== "none";
}

document.addEventListener("touchstart", function(e){
  ptrTracking = (window.scrollY === 0 && document.documentElement.scrollTop === 0);
  ptrStartY = e.touches[0].clientY;
}, {passive:true});

document.addEventListener("touchmove", function(e){
  if(!ptrTracking) return;
  if(e.touches[0].clientY - ptrStartY > PTR_THRESHOLD){
    ptrTracking = false;
    triggerPullRefresh();
  }
}, {passive:true});

document.addEventListener("touchend", function(){ ptrTracking = false; });

function triggerPullRefresh(){
  if(isUnsavedWorkPresent()){
    document.getElementById("bsRefreshConfirmOverlay").style.display = "flex";
  } else {
    location.reload();
  }
}
function cancelPullRefresh(){
  document.getElementById("bsRefreshConfirmOverlay").style.display = "none";
}
function confirmPullRefresh(){
  document.getElementById("bsRefreshConfirmOverlay").style.display = "none";
  clearBsDraft();
  location.reload();
}
window.addEventListener("beforeunload", function(e){
  if(isUnsavedWorkPresent()){ e.preventDefault(); e.returnValue = ""; }
});

// ===== DRAFT (qaralama) =====
function bsDraftKey(){ return "ctech_bs_draft"; }

function saveBsDraft(){
  // Bu funksiya bus-service.js-də ətraflı işlənir
}

function clearBsDraft(){
  try{ localStorage.removeItem(bsDraftKey()); }catch(e){}
}

function loadBsDraft(){
  try{
    var raw = localStorage.getItem(bsDraftKey());
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){ return null; }
}

// ===== INIT =====
if("serviceWorker" in navigator){ navigator.serviceWorker.register("service-worker.js"); }
var savedUser=loadSession(); if(savedUser){currentUser=savedUser;showDashboard();}
try{ var savedTheme=localStorage.getItem("ctech_theme"); if(savedTheme==="dark"){applyTheme(true);} }catch(e){}
// ============================================================
// BUS-REPORT.JS - BUS Real-Time Report
// ============================================================

var rptAllRows = [];
var rptColumns = [];
var rptFiltered = [];
var rptShownCount = 20;
var rptPageSize = 20;
var rptAutoRefresh = null;
var rptDateInterval = null;

var RPT_SEARCH_FIELDS = ["Ticket ID", "Tarix", "D.Q.N.", "BUS ID", "Daşıyıcı"];

// ===== INIT =====
function init_bus_report() {
  document.getElementById("bus-bus-reportContainer").style.display = "flex";
  document.getElementById("rptGlobalSearch").value = "";
  document.getElementById("rptExcelBtn").style.display =
    (getAccessLevel(currentUser.role) === "technician") ? "none" : "flex";
  rptShownCount = rptPageSize;
  updateRptDate();
  if(rptDateInterval) clearInterval(rptDateInterval);
  rptDateInterval = setInterval(updateRptDate, 1000);
  loadReportData();
  if(rptAutoRefresh) clearInterval(rptAutoRefresh);
  rptAutoRefresh = setInterval(loadReportData, 120000);
}

function closeBusReport() {
  if(rptAutoRefresh){ clearInterval(rptAutoRefresh); rptAutoRefresh = null; }
  if(rptDateInterval){ clearInterval(rptDateInterval); rptDateInterval = null; }
  var container = document.getElementById("bus-bus-reportContainer");
  if(container) container.style.display = "none";
  document.getElementById("dashboardView").style.display = "block";
}

function updateRptDate(){
  var dEl = document.getElementById("rptDateBox");
  var tEl = document.getElementById("rptClockBox");
  if(!dEl || !tEl) return;
  var now = new Date();
  var parts = new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Baku",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).formatToParts(now);
  var map = {}; parts.forEach(function(p){ map[p.type]=p.value; });
  dEl.textContent = map.day + "." + map.month + "." + map.year;
  tEl.textContent = map.hour + ":" + map.minute + ":" + map.second;
}

function rptSortKey(row){
  var d = row["Tarix"] || "";
  var t = row["Saat"] || "";
  var dp = d.split(".");
  if(dp.length !== 3) return 0;
  var iso = dp[2] + "-" + dp[1] + "-" + dp[0] + "T" + (t || "00:00") + ":00";
  var ts = new Date(iso).getTime();
  return isNaN(ts) ? 0 : ts;
}

function loadReportData(){
  document.getElementById("rptTableBody").innerHTML =
    '<tr><td colspan="6"><div class="rpt-loading"><div class="spinner" style="width:36px;height:36px;border-width:4px;"></div><span>Yüklənir...</span></div></td></tr>';

  fetch(API_URL, {
    method:"POST",
    headers:{"Content-Type":"text/plain;charset=utf-8"},
    body:JSON.stringify({action:"getReportData"})
  })
  .then(function(r){ return r.json(); })
  .then(function(d){
    if(d.status !== "OK"){
      document.getElementById("rptTableBody").innerHTML =
        '<tr><td colspan="6"><div class="rpt-empty">Xəta: ' + (d.message||"məlumat gəlmədi") + '</div></td></tr>';
      return;
    }
    rptAllRows = (d.rows || []).slice().sort(function(a,b){ return rptSortKey(b) - rptSortKey(a); });
    rptColumns = d.columns || [];
    applyFilters();
  })
  .catch(function(e){
    document.getElementById("rptTableBody").innerHTML =
      '<tr><td colspan="6"><div class="rpt-empty">Şəbəkə xətası: ' + e.message + '</div></td></tr>';
  });
}

function applyFilters(){
  var q = (document.getElementById("rptGlobalSearch").value || "").toLowerCase().trim();
  rptShownCount = rptPageSize;

  if(!q){
    rptFiltered = rptAllRows;
  } else {
    rptFiltered = rptAllRows.filter(function(row){
      for(var i=0;i<RPT_SEARCH_FIELDS.length;i++){
        var f = RPT_SEARCH_FIELDS[i];
        if((row[f]||"").toLowerCase().indexOf(q) !== -1) return true;
      }
      return false;
    });
  }
  renderTable();
}

function canEditTicket(row){
  var level = getAccessLevel(currentUser.role);
  if(level === "leader" || level === "admin") return true;
  var createdBy = (row["_created_by"] || "").toLowerCase().trim();
  var me = (currentUser.email || "").toLowerCase().trim();
  return createdBy && me && createdBy === me;
}

function renderTable(){
  var body = document.getElementById("rptTableBody");
  document.getElementById("rptCount").textContent = rptFiltered.length + " nəticə";

  if(rptFiltered.length === 0){
    body.innerHTML = '<tr><td colspan="6"><div class="rpt-empty">Məlumat tapılmadı</div></td></tr>';
    document.getElementById("rptLoadMoreWrap").style.display = "none";
    return;
  }

  var visible = rptFiltered.slice(0, rptShownCount);
  var html = "";

  visible.forEach(function(row){
    var ticketId = row["Ticket ID"] || "";
    var safeId = ticketId.replace(/'/g,"");
    var editable = canEditTicket(row);
    html += '<tr>'
      + '<td class="rpt-td-id">' + ticketId + '</td>'
      + '<td>' + (row["Tarix"]||"") + '</td>'
      + '<td class="rpt-td-plate">' + (row["D.Q.N."]||"") + '</td>'
      + '<td>' + (row["BUS ID"]||"") + '</td>'
      + '<td class="col-carrier" title="' + (row["Daşıyıcı"]||"").replace(/"/g,"&quot;") + '">' + (row["Daşıyıcı"]||"") + '</td>'
      + '<td class="col-act"><div class="rpt-row-actions">'
      +   '<button class="rpt-icon-btn" onclick="openBusDetail(\'' + safeId + '\')" aria-label="Baxış" title="Baxış">'
      +     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>'
      +   '</button>'
      +   (editable
          ? '<button class="rpt-icon-btn rpt-edit-btn" onclick="openBusServiceForEdit(\'' + safeId + '\')" aria-label="Redaktə et" title="Redaktə et">'
            + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>'
            + '</button>'
          : '')
      + '</div></td>'
      + '</tr>';
  });

  body.innerHTML = html;

  var loadMoreWrap = document.getElementById("rptLoadMoreWrap");
  if(rptFiltered.length > rptShownCount){
    document.getElementById("rptLoadMoreBtn").textContent = "Daha çox göstər (" + (rptFiltered.length - rptShownCount) + ")";
    loadMoreWrap.style.display = "flex";
  } else {
    loadMoreWrap.style.display = "none";
  }
}

function rptShowMore(){
  rptShownCount += rptPageSize;
  renderTable();
}

function exportToExcel(){
  if(rptFiltered.length === 0){ alert("Export üçün məlumat yoxdur"); return; }
  if(typeof XLSX === "undefined"){ alert("Excel kitabxanası yüklənməyib"); return; }

  var cols = rptColumns;
  var wsData = [];
  wsData.push(cols);
  rptFiltered.forEach(function(row){
    var r = cols.map(function(c){ return row[c] || ""; });
    wsData.push(r);
  });

  var ws = XLSX.utils.aoa_to_sheet(wsData);
  var colWidths = cols.map(function(c){
    var max = c.length;
    rptFiltered.forEach(function(row){
      var v = (row[c] || "").length;
      if(v > max) max = v;
    });
    return { wch: Math.min(max + 2, 40) };
  });
  ws["!cols"] = colWidths;

  var range = XLSX.utils.decode_range(ws["!ref"]);
  for(var C = range.s.c; C <= range.e.c; C++){
    var cell = ws[XLSX.utils.encode_cell({r:0, c:C})];
    if(!cell) continue;
    cell.s = {
      font: { bold:true, color:{rgb:"1B4A8A"} },
      fill: { fgColor:{rgb:"E6F1FB"} },
      alignment: { horizontal:"center" },
      border: { bottom: { style:"medium", color:{rgb:"C8D8EE"} } }
    };
  }

  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "BUS Report");

  var today = new Date();
  var dd = String(today.getDate()).padStart(2,"0");
  var mm = String(today.getMonth()+1).padStart(2,"0");
  var yyyy = today.getFullYear();
  var fname = "BUS_Report_" + dd + "." + mm + "." + yyyy + ".xlsx";

  XLSX.writeFile(wb, fname);
}
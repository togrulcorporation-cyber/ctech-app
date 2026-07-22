// ============================================================
// BUS-DETAIL.JS - BUS Detail View
// ============================================================

var DV_FIELD_MAP = [
  { section:"Müraciət məlumatları", rows:[
    ["Tarix","Tarix"], ["Saat","Saat"], ["Müraciət edən","Müraciət edən"], ["Telefon","Telefon"]
  ]},
  { section:"Avtobus məlumatları", rows:[
    ["Marşrut №","Marşrut №"], ["BUS ID","BUS ID"], ["Daşıyıcı","Daşıyıcı"],
    ["D.Q.N.","D.Q.N."], ["Marka/Model","Marka/Model"], ["Sistem","Sistem"]
  ]},
  { section:"Servis məlumatları", rows:[
    ["Problem","Problem"], ["Həll","Həll"], ["Qeyd","Qeyd"]
  ]},
  { section:"Servis Kateqoriyası", rows:[
    ["Servis Kat.","Servis Kat."], ["Köhnə SN","Köhnə SN"], ["Yeni SN","Yeni SN"]
  ]},
  { section:"Servis vaxtı və yeri", rows:[
    ["Başlanğıc","Başlanğıc"], ["Bitiş","Bitiş"], ["Servis yeri","Servis yeri"]
  ]},
  { section:"Texnik heyət", rows:[
    ["1. Texnik","1. Texnik"], ["2. Texnik","2. Texnik"], ["Qrup rəhbəri","Qrup rəhbəri"]
  ]}
];

function init_bus_detail(ticketId) {
  document.getElementById("bus-bus-detailContainer").style.display = "flex";
  openBusDetail(ticketId);
}

function openBusDetail(ticketId){
  var row = rptAllRows.find(function(r){ return r["Ticket ID"] === ticketId; });
  if(!row){ alert("Ticket tapılmadı"); return; }

  document.getElementById("dvTicketTitle").textContent = ticketId;

  var html = "";
  DV_FIELD_MAP.forEach(function(sec){
    var rowsHtml = "";
    sec.rows.forEach(function(pair){
      var val = row[pair[1]];
      if(!val) return;
      rowsHtml += '<div class="dv-row"><span class="dv-label">' + pair[0] + '</span><span class="dv-value">' + val + '</span></div>';
    });
    if(rowsHtml){
      html += '<div class="dv-section"><div class="dv-section-title">' + sec.section + '</div>' + rowsHtml + '</div>';
    }
  });

  html += '<div class="dv-section"><div class="dv-section-title">Status</div>'
    + '<div class="dv-row"><span class="dv-label">Vəziyyət</span><span class="dv-value"><span class="dv-status-chip">' + (row["Status"]||"") + '</span></span></div>'
    + '</div>';

  document.getElementById("dvBody").innerHTML = html;

  document.getElementById("bus-bus-reportContainer").style.display = "none";
  document.getElementById("bus-bus-detailContainer").style.display = "flex";
}

function closeBusDetail(){
  document.getElementById("bus-bus-detailContainer").style.display = "none";
  document.getElementById("bus-bus-reportContainer").style.display = "flex";
}
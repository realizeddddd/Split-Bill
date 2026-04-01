// ── i18n ──────────────────────────────────────────────────────────────────────

var LANG = localStorage.getItem('lang') || 'en';

var T = {
  en: {
    people: 'People', items: 'Items', tipTax: 'Tip & Tax', summary: 'Summary',
    enterManually: 'Enter item(s) manually',
    addPerson: 'Name', addItem: 'Item name', cost: 'Cost',
    add: 'Add', scanReceipt: '📷 Scan Receipt Image', or: 'OR',
    noPeople: 'No people added yet.', noItems: 'No items added yet.',
    addPeopleFirst: 'Add people first',
    noSplit: 'Add people to see the split.',
    tip: 'Tip', taxPct: 'Tax %', splitExtras: 'Split extras',
    equally: 'Equally', proportionally: 'Proportionally',
    subtotal: 'Subtotal', total: 'Total', tax: 'Tax',
    shareWa: '💬 Share WhatsApp ▾',
    shareText: '📝 Share as Text', shareJPG: '🖼️ Share as JPG', sharePDF: '📄 Share as PDF',
    splitBillSummary: 'Split Bill Summary',
    viewSession: 'View Session',
    createdUsing: 'Created using',
    appBy: 'App by realizeddddd',
    scanTitle: '📷 Scan Receipt',
    uploadLabel: '📂 Tap to upload receipt image',
    scanHint: 'Review detected items. Edit or remove before adding.',
    scanEmpty: 'No items detected. Try a clearer photo or add items manually.',
    reading: 'Reading receipt…', readingPct: 'Reading… ',
    scanFail: '❌ Failed to read image. Try a clearer photo.',
    back: '← Back', addAll: 'Add All Items',
    noItemsAssigned: 'No items assigned',
    tipAndTax: 'Tip & Tax',
    waTextSaved: 'Split Bill summary image saved! Attach it here.',
    waPdfSaved: 'Split Bill PDF saved! Attach it here.',
    eventPlaceholder: "Event name (e.g. Dinner at Joe's)",
  },
  id: {
    people: 'Peserta', items: 'Item', tipTax: 'Tip & Pajak', summary: 'Ringkasan',
    enterManually: 'Masukkan item secara manual',
    addPerson: 'Nama', addItem: 'Nama item', cost: 'Harga',
    add: 'Tambah', scanReceipt: '📷 Scan Struk', or: 'ATAU',
    noPeople: 'Belum ada peserta.', noItems: 'Belum ada item.',
    addPeopleFirst: 'Tambah peserta dulu',
    noSplit: 'Tambah peserta untuk melihat pembagian.',
    tip: 'Tip', taxPct: 'Pajak %', splitExtras: 'Bagi tambahan',
    equally: 'Rata', proportionally: 'Proporsional',
    subtotal: 'Subtotal', total: 'Total', tax: 'Pajak',
    shareWa: '💬 Bagikan WhatsApp ▾',
    shareText: '📝 Bagikan sebagai Teks', shareJPG: '🖼️ Bagikan sebagai JPG', sharePDF: '📄 Bagikan sebagai PDF',
    splitBillSummary: 'Ringkasan Split Bill',
    viewSession: 'Lihat Sesi',
    createdUsing: 'Dibuat menggunakan',
    appBy: 'App oleh realizeddddd',
    scanTitle: '📷 Scan Struk',
    uploadLabel: '📂 Ketuk untuk unggah foto struk',
    scanHint: 'Periksa item yang terdeteksi. Edit atau hapus sebelum menambahkan.',
    scanEmpty: 'Tidak ada item terdeteksi. Coba foto yang lebih jelas atau tambah manual.',
    reading: 'Membaca struk…', readingPct: 'Membaca… ',
    scanFail: '❌ Gagal membaca gambar. Coba foto yang lebih jelas.',
    back: '← Kembali', addAll: 'Tambah Semua Item',
    noItemsAssigned: 'Tidak ada item',
    tipAndTax: 'Tip & Pajak',
    waTextSaved: 'Gambar Split Bill tersimpan! Lampirkan di sini.',
    waPdfSaved: 'PDF Split Bill tersimpan! Lampirkan di sini.',
    eventPlaceholder: 'Nama acara (mis. Makan Malam di Joe)',
  }
};

function t(key) { return (T[LANG] && T[LANG][key]) || T.en[key] || key; }

function applyLang() {
  // Static labels
  document.getElementById('people-heading').textContent = t('people');
  document.getElementById('items-heading').textContent = t('items');
  document.getElementById('extras-heading').innerHTML = t('tipTax');
  document.getElementById('summary-heading').textContent = t('summary');
  document.getElementById('section-sub-items').textContent = t('enterManually');
  document.getElementById('personInput').placeholder = t('addPerson');
  document.getElementById('itemName').placeholder = t('addItem');
  document.getElementById('itemCost').placeholder = t('cost');
  document.getElementById('eventName').placeholder = t('eventPlaceholder');
  document.querySelectorAll('.btn-add-person').forEach(function(b) { b.textContent = t('add'); });
  document.querySelectorAll('.btn-add-item').forEach(function(b) { b.textContent = t('add'); });
  document.getElementById('btn-scan').textContent = t('scanReceipt');
  document.getElementById('or-label').textContent = t('or');
  document.getElementById('label-tip').childNodes[0].textContent = t('tip') + ' ';
  document.getElementById('label-tax').childNodes[0].textContent = t('taxPct') + ' ';
  document.getElementById('label-extras').childNodes[0].textContent = t('splitExtras') + ' ';
  document.getElementById('extrasMode').options[0].text = t('equally');
  document.getElementById('extrasMode').options[1].text = t('proportionally');
  document.getElementById('wa-toggle-btn').textContent = t('shareWa');
  document.getElementById('wa-text-btn').textContent = t('shareText');
  document.getElementById('wa-jpg-btn').textContent = t('shareJPG');
  document.getElementById('wa-pdf-btn').textContent = t('sharePDF');
  document.getElementById('scan-title').textContent = t('scanTitle');
  document.getElementById('uploadLabel').textContent = t('uploadLabel');
  document.getElementById('scan-hint').textContent = t('scanHint');
  document.getElementById('scan-back-btn').textContent = t('back');
  document.getElementById('scan-confirm-btn').textContent = t('addAll');
  // Lang toggle button
  document.getElementById('langToggle').textContent = LANG === 'en' ? '🇮🇩 ID' : '🇬🇧 EN';
  render();
}

function toggleLang() {
  LANG = LANG === 'en' ? 'id' : 'en';
  localStorage.setItem('lang', LANG);
  applyLang();
}


// ── Session ───────────────────────────────────────────────────────────────────

function encodeState(obj) {
  try {
    var bytes = new TextEncoder().encode(JSON.stringify(obj));
    return btoa(String.fromCharCode.apply(null, bytes));
  } catch(e) { return null; }
}

function decodeState(hash) {
  try {
    var binary = atob(hash);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch(e) { return null; }
}

function saveSession() {
  var state = {
    people: people, items: items,
    eventName: document.getElementById('eventName').value,
    tipAmt: document.getElementById('tipAmt').value,
    taxPct: document.getElementById('taxPct').value,
    extrasMode: document.getElementById('extrasMode').value,
  };
  var encoded = encodeState(state);
  if (encoded) history.replaceState(null, '', '#' + encoded);
}

function loadSession() {
  var hash = window.location.hash.slice(1);
  if (!hash) return;
  var state = decodeState(hash);
  if (!state) { history.replaceState(null, '', window.location.pathname); return; }
  people = state.people || [];
  items = state.items || [];
  if (state.eventName !== undefined) document.getElementById('eventName').value = state.eventName;
  if (state.tipAmt !== undefined) document.getElementById('tipAmt').value = state.tipAmt;
  if (state.taxPct !== undefined) document.getElementById('taxPct').value = state.taxPct;
  if (state.extrasMode) document.getElementById('extrasMode').value = state.extrasMode;
}

function getSessionLink() {
  saveSession();
  return window.location.origin + window.location.pathname + window.location.hash;
}

// ── State ─────────────────────────────────────────────────────────────────────

var people = [];
var items = [];

// ── Mutations ─────────────────────────────────────────────────────────────────

function addPerson() {
  var input = document.getElementById('personInput');
  var name = input.value.trim();
  if (!name || people.includes(name)) return;
  people.push(name);
  input.value = '';
  render(); saveSession();
}

function removePerson(name) {
  people = people.filter(function(p) { return p !== name; });
  items.forEach(function(item) {
    item.assignees = item.assignees.filter(function(p) { return p !== name; });
  });
  render(); saveSession();
}

function addItem() {
  var name = document.getElementById('itemName').value.trim();
  var cost = parseFloat(document.getElementById('itemCost').value);
  if (!name || isNaN(cost) || cost < 0) return;
  items.push({ id: Date.now(), name: name, cost: cost, assignees: people.slice() });
  document.getElementById('itemName').value = '';
  document.getElementById('itemCost').value = '';
  render(); saveSession();
}

function removeItem(id) {
  items = items.filter(function(i) { return i.id !== id; });
  render(); saveSession();
}

function toggleAssignee(itemId, person) {
  var item = items.find(function(i) { return i.id === itemId; });
  if (!item) return;
  if (item.assignees.includes(person)) {
    item.assignees = item.assignees.filter(function(p) { return p !== person; });
  } else {
    item.assignees.push(person);
  }
  render(); saveSession();
}

// ── Formatting ────────────────────────────────────────────────────────────────

function fmt(n) {
  return 'Rp\u00a0' + Math.round(n).toLocaleString('id-ID');
}


// ── Render ────────────────────────────────────────────────────────────────────

function render() {
  renderPeople();
  renderItems();
  renderSummary();
}

function renderPeople() {
  var el = document.getElementById('peopleList');
  if (!people.length) {
    el.innerHTML = '<li class="empty">' + t('noPeople') + '</li>';
    return;
  }
  el.innerHTML = people.map(function(p) {
    return '<li class="tag">' + p
      + '<button onclick="removePerson(\'' + p + '\')" aria-label="Remove ' + p + '">\u00d7</button>'
      + '</li>';
  }).join('');
}

function renderItems() {
  var el = document.getElementById('itemList');
  if (!items.length) {
    el.innerHTML = '<li class="empty">' + t('noItems') + '</li>';
    return;
  }
  el.innerHTML = items.map(function(item) {
    var chips = people.map(function(p) {
      var active = item.assignees.includes(p) ? ' active' : '';
      return '<button class="assignee-chip' + active + '" onclick="toggleAssignee(' + item.id + ',\'' + p + '\')" aria-pressed="' + item.assignees.includes(p) + '">' + p + '</button>';
    }).join('');
    var noPeople = !people.length ? '<span style="font-size:0.8rem;color:#9ca3af">' + t('addPeopleFirst') + '</span>' : '';
    return '<li class="item-row">'
      + '<span>' + item.name + ' \u2014 ' + fmt(item.cost) + '</span>'
      + '<div class="assignees" role="group">' + chips + noPeople + '</div>'
      + '<button class="btn-danger" onclick="removeItem(' + item.id + ')">\u2715</button>'
      + '</li>';
  }).join('');
}

function calcShares() {
  var subtotal = items.reduce(function(s, i) { return s + i.cost; }, 0);
  var tipAmt = parseFloat(document.getElementById('tipAmt').value) || 0;
  var taxPct = parseFloat(document.getElementById('taxPct').value) || 0;
  var tax = subtotal * taxPct / 100;
  var extrasTotal = tipAmt + tax;
  var extrasMode = document.getElementById('extrasMode').value;

  var itemShares = {};
  people.forEach(function(p) { itemShares[p] = 0; });
  items.forEach(function(item) {
    var assigned = item.assignees.filter(function(p) { return people.includes(p); });
    if (!assigned.length) return;
    assigned.forEach(function(p) { itemShares[p] += item.cost / assigned.length; });
  });

  var extrasPerPerson = {};
  people.forEach(function(p) { extrasPerPerson[p] = 0; });
  if (extrasTotal > 0 && people.length) {
    if (extrasMode === 'equal') {
      people.forEach(function(p) { extrasPerPerson[p] = extrasTotal / people.length; });
    } else {
      var itemTotal = Object.values(itemShares).reduce(function(a, b) { return a + b; }, 0);
      people.forEach(function(p) {
        extrasPerPerson[p] = itemTotal > 0 ? extrasTotal * (itemShares[p] / itemTotal) : extrasTotal / people.length;
      });
    }
  }

  var totals = {};
  people.forEach(function(p) { totals[p] = itemShares[p] + extrasPerPerson[p]; });
  return { subtotal: subtotal, tip: tipAmt, tax: tax, taxPct: taxPct, extrasTotal: extrasTotal, itemShares: itemShares, extrasPerPerson: extrasPerPerson, totals: totals };
}

function renderSummary() {
  var s = calcShares();
  var total = s.subtotal + s.tip + s.tax;
  var summaryEl = document.getElementById('summaryList');
  var totalsEl = document.getElementById('totals');

  if (!people.length) {
    summaryEl.innerHTML = '<li class="empty">' + t('noSplit') + '</li>';
    totalsEl.innerHTML = '';
    return;
  }

  summaryEl.innerHTML = people.map(function(p) {
    var myItems = items.filter(function(item) { return item.assignees.includes(p); });
    var itemLines = myItems.map(function(item) {
      var assigned = item.assignees.filter(function(x) { return people.includes(x); });
      var share = assigned.length ? item.cost / assigned.length : 0;
      return '<li class="summary-item">' + item.name + ' <span>' + fmt(share) + '</span></li>';
    }).join('');
    return '<li class="summary-row">'
      + '<div class="summary-top"><span class="name">' + p + '</span><strong class="amount">' + fmt(s.totals[p]) + '</strong></div>'
      + (myItems.length ? '<ul class="summary-items">' + itemLines + '</ul>' : '')
      + '</li>';
  }).join('');

  totalsEl.innerHTML = '<p class="line"><span>' + t('subtotal') + '</span><span>' + fmt(s.subtotal) + '</span></p>'
    + (s.tip > 0 ? '<p class="line"><span>' + t('tip') + '</span><span>' + fmt(s.tip) + '</span></p>' : '')
    + (s.tax > 0 ? '<p class="line"><span>' + t('tax') + ' (' + s.taxPct + '%)</span><span>' + fmt(s.tax) + '</span></p>' : '')
    + '<p class="line grand"><span>' + t('total') + '</span><span>' + fmt(total) + '</span></p>';
}


// ── Build card / capture ──────────────────────────────────────────────────────

function buildCardHTML() {
  var eventName = document.getElementById('eventName').value.trim();
  var link = getSessionLink();
  var s = calcShares();
  var grandTotal = s.subtotal + s.tip + s.tax;

  var eventNameEl = document.getElementById('print-event-name');
  if (!eventNameEl) {
    eventNameEl = document.createElement('p');
    eventNameEl.id = 'print-event-name';
    document.querySelector('header').appendChild(eventNameEl);
  }
  eventNameEl.textContent = eventName || 'Split Bill';

  var html = '<div class="pdf-grid">';
  people.forEach(function(person) {
    var myItems = items.filter(function(item) { return item.assignees.includes(person); });
    var extras = s.extrasPerPerson[person];
    html += '<div class="person-block"><div class="person-name">' + person + '</div><table><tbody>';
    if (!myItems.length) {
      html += '<tr><td colspan="2" class="empty-cell">' + t('noItemsAssigned') + '</td></tr>';
    } else {
      myItems.forEach(function(item) {
        var assigned = item.assignees.filter(function(p) { return people.includes(p); });
        var share = assigned.length ? item.cost / assigned.length : 0;
        var note = assigned.length > 1 ? ' <span class="split-note">\u00f7' + assigned.length + '</span>' : '';
        html += '<tr><td>' + item.name + note + '</td><td class="amt">' + fmt(share) + '</td></tr>';
      });
    }
    if (extras > 0) html += '<tr class="extras-row"><td>' + t('tipAndTax') + '</td><td class="amt">' + fmt(extras) + '</td></tr>';
    html += '<tr class="person-total"><td>' + t('total') + '</td><td class="amt">' + fmt(s.totals[person]) + '</td></tr>';
    html += '</tbody></table></div>';
  });
  html += '</div>';
  html += '<div class="pdf-totals">';
  html += '<span>' + t('subtotal') + ': ' + fmt(s.subtotal) + '</span>';
  if (s.tip > 0) html += '<span>' + t('tip') + ': ' + fmt(s.tip) + '</span>';
  if (s.tax > 0) html += '<span>' + t('tax') + ' (' + s.taxPct + '%): ' + fmt(s.tax) + '</span>';
  html += '<span class="pdf-grand">' + t('total') + ': ' + fmt(grandTotal) + '</span>';
  html += '</div>';

  document.getElementById('print-breakdown').innerHTML = html;
  document.getElementById('watermark').innerHTML =
    t('createdUsing') + ' <a href="' + link + '">Split Bill</a> ' + t('appBy')
    + ' \u2022 <a href="' + link + '">' + t('viewSession') + '</a>';
}

function captureCard(callback) {
  buildCardHTML();
  var target = document.getElementById('print-only');
  target.style.cssText = 'display:block;position:fixed;top:-9999px;left:0;width:559px;background:#fff;padding:20px;z-index:-1;';

  var wm = document.getElementById('watermark');
  wm.style.cssText = 'display:block;position:static;border-top:1px solid #e5e7eb;padding:6px 0 0;margin-top:8px;font-size:8px;color:#9ca3af;';
  target.appendChild(wm);

  var headerClone = document.querySelector('header').cloneNode(true);
  headerClone.style.cssText = 'background:linear-gradient(135deg,#6366f1,#a855f7,#ec4899);padding:10px 14px 8px;border-radius:0 0 8px 8px;margin-bottom:10px;';
  headerClone.querySelector('h1').style.cssText = 'font-size:16px;font-weight:800;color:#fff;margin:0 0 2px;background:none;-webkit-text-fill-color:#fff;';
  var pne = headerClone.querySelector('#print-event-name');
  if (pne) pne.style.cssText = 'display:block;text-align:center;font-size:11px;color:rgba(255,255,255,0.85);font-style:italic;margin:0;';
  ['#print-event-name','#print-event-name','#langToggle','.header-top','.event-name-wrap'].forEach(function(sel) {
    var el = headerClone.querySelector(sel); if (el && sel !== '#print-event-name') el.remove();
  });
  var ht = headerClone.querySelector('.header-top'); if (ht) ht.remove();
  var ew = headerClone.querySelector('.event-name-wrap'); if (ew) ew.remove();
  target.insertBefore(headerClone, target.firstChild);

  html2canvas(target, { scale: 2, useCORS: true, backgroundColor: '#ffffff', width: target.offsetWidth, height: target.scrollHeight })
    .then(function(canvas) {
      target.style.cssText = '';
      wm.style.cssText = '';
      target.removeChild(headerClone);
      document.querySelector('main').appendChild(wm);
      callback(canvas);
    });
}

// ── Share ─────────────────────────────────────────────────────────────────────

function toggleWaMenu() { document.getElementById('waMenu').classList.toggle('open'); }

document.addEventListener('click', function(e) {
  if (!e.target.closest('.wa-dropdown')) {
    var m = document.getElementById('waMenu'); if (m) m.classList.remove('open');
  }
});

function shareWhatsAppText() {
  document.getElementById('waMenu').classList.remove('open');
  saveSession();
  var s = calcShares();
  var grandTotal = s.subtotal + s.tip + s.tax;
  var eventName = document.getElementById('eventName').value.trim();
  var link = getSessionLink();
  var msg = '';
  if (eventName) msg += '*' + eventName + '*\n';
  msg += '*' + t('splitBillSummary') + '*\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n';
  people.forEach(function(person) {
    var myItems = items.filter(function(item) { return item.assignees.includes(person); });
    msg += '\n\ud83d\udc64 *' + person + '* \u2014 ' + fmt(s.totals[person]) + '\n';
    myItems.forEach(function(item) {
      var assigned = item.assignees.filter(function(p) { return people.includes(p); });
      var share = assigned.length ? item.cost / assigned.length : 0;
      var note = assigned.length > 1 ? ' (\u00f7' + assigned.length + ')' : '';
      msg += '  \u2022 ' + item.name + note + ': ' + fmt(share) + '\n';
    });
    if (s.extrasPerPerson[person] > 0) msg += '  \u2022 ' + t('tipAndTax') + ': ' + fmt(s.extrasPerPerson[person]) + '\n';
  });
  msg += '\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n';
  msg += t('subtotal') + ': ' + fmt(s.subtotal) + '\n';
  if (s.tip > 0) msg += t('tip') + ': ' + fmt(s.tip) + '\n';
  if (s.tax > 0) msg += t('tax') + ' (' + s.taxPct + '%): ' + fmt(s.tax) + '\n';
  msg += '*' + t('total') + ': ' + fmt(grandTotal) + '*\n\n\ud83d\udd17 ' + t('viewSession') + ': ' + link;
  window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
}

function shareWhatsAppJPG() {
  document.getElementById('waMenu').classList.remove('open');
  saveSession();
  captureCard(function(canvas) {
    var a = document.createElement('a');
    var name = document.getElementById('eventName').value.trim() || 'splitbill';
    a.download = name.replace(/\s+/g, '-') + '.jpg';
    a.href = canvas.toDataURL('image/jpeg', 0.92);
    a.click();
    var link = getSessionLink();
    var msg = (name !== 'splitbill' ? '*' + name + '*\n' : '') + t('waTextSaved') + '\n\n\ud83d\udd17 ' + t('viewSession') + ': ' + link;
    setTimeout(function() { window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank'); }, 800);
  });
}

function shareWhatsAppPDF() {
  document.getElementById('waMenu').classList.remove('open');
  saveSession();
  captureCard(function(canvas) {
    var pdf = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
    var imgW = 148, imgH = (canvas.height / canvas.width) * 148;
    if (imgH > 210) { imgW = (210 / imgH) * 148; imgH = 210; }
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', (148 - imgW) / 2, 0, imgW, imgH);
    var name = document.getElementById('eventName').value.trim() || 'splitbill';
    pdf.save(name.replace(/\s+/g, '-') + '.pdf');
    var link = getSessionLink();
    var msg = (name !== 'splitbill' ? '*' + name + '*\n' : '') + t('waPdfSaved') + '\n\n\ud83d\udd17 ' + t('viewSession') + ': ' + link;
    setTimeout(function() { window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank'); }, 800);
  });
}


// ── Scan Receipt ──────────────────────────────────────────────────────────────

var scannedItems = [];

function openScanModal() {
  document.getElementById('scanModal').classList.add('open');
  showScanStep(1);
}

function closeScanModal() {
  document.getElementById('scanModal').classList.remove('open');
  document.getElementById('receiptInput').value = '';
  document.getElementById('receiptPreview').src = '';
  document.getElementById('receiptPreview').style.display = 'none';
  document.getElementById('uploadLabel').textContent = t('uploadLabel');
  scannedItems = [];
}

function showScanStep(n) {
  document.getElementById('scanStep1').style.display = n === 1 ? 'block' : 'none';
  document.getElementById('scanStep2').style.display = n === 2 ? 'block' : 'none';
  document.getElementById('scanStep3').style.display = n === 3 ? 'block' : 'none';
}

function goBackScan() { showScanStep(1); }

function handleReceiptImage(e) {
  var file = e.target.files[0];
  if (!file) return;
  var url = URL.createObjectURL(file);
  var preview = document.getElementById('receiptPreview');
  preview.src = url;
  preview.style.display = 'block';
  document.getElementById('uploadLabel').textContent = '\u2705 ' + file.name;
  showScanStep(2);
  document.getElementById('scanStatus').textContent = t('reading');

  Tesseract.recognize(url, 'eng', {
    logger: function(m) {
      if (m.status === 'recognizing text')
        document.getElementById('scanStatus').textContent = t('readingPct') + Math.round(m.progress * 100) + '%';
    }
  }).then(function(result) {
    scannedItems = parseReceiptText(result.data.text);
    renderDetectedItems();
    showScanStep(3);
  }).catch(function() {
    document.getElementById('scanStatus').textContent = t('scanFail');
  });
}

function parseReceiptText(text) {
  var results = [];
  var priceRe = /^(.+?)\s+(?:Rp\.?\s*)?([\d.,]+)\s*$/i;
  var skipRe = /^(total|subtotal|tax|pajak|tip|service|discount|diskon|change|cash|card|receipt|struk|thank|terima|date|tanggal|time|table|order|bill|no\.|#|\d{1,2}[\/\-]\d{1,2})/i;
  text.split('\n').forEach(function(line) {
    line = line.trim();
    if (!line || line.length < 3 || skipRe.test(line)) return;
    var m = line.match(priceRe);
    if (!m) return;
    var name = m[1].trim().replace(/[^a-zA-Z0-9\s\-\/&'().]/g, '').trim();
    var priceStr = m[2].replace(/\./g, '').replace(',', '.');
    var price = parseFloat(priceStr);
    if (!name || name.length < 2 || isNaN(price) || price <= 0 || price > 100000000) return;
    results.push({ name: name, cost: price, include: true });
  });
  return results;
}

function renderDetectedItems() {
  var el = document.getElementById('detectedList');
  if (!scannedItems.length) {
    el.innerHTML = '<p class="scan-empty">' + t('scanEmpty') + '</p>';
    return;
  }
  el.innerHTML = scannedItems.map(function(item, i) {
    return '<div class="detected-item">'
      + '<input type="checkbox" ' + (item.include ? 'checked' : '') + ' onchange="toggleDetected(' + i + ')" />'
      + '<input class="di-name" type="text" value="' + item.name + '" onchange="updateDetected(' + i + ',\'name\',this.value)" />'
      + '<input class="di-cost" type="number" value="' + item.cost + '" min="0" step="1" onchange="updateDetected(' + i + ',\'cost\',this.value)" />'
      + '<button onclick="removeDetected(' + i + ')">\u2715</button>'
      + '</div>';
  }).join('');
}

function toggleDetected(i) { scannedItems[i].include = !scannedItems[i].include; }
function updateDetected(i, field, val) { scannedItems[i][field] = field === 'cost' ? parseFloat(val) || 0 : val; }
function removeDetected(i) { scannedItems.splice(i, 1); renderDetectedItems(); }

function confirmScannedItems() {
  var added = 0;
  scannedItems.forEach(function(item) {
    if (!item.include || !item.name || item.cost <= 0) return;
    items.push({ id: Date.now() + added++, name: item.name, cost: item.cost, assignees: people.slice() });
  });
  if (added) { render(); saveSession(); }
  closeScanModal();
}

// ── Init ──────────────────────────────────────────────────────────────────────

loadSession();
applyLang();

['eventName','tipAmt','taxPct','extrasMode'].forEach(function(id) {
  document.getElementById(id).addEventListener('change', saveSession);
});
document.getElementById('tipAmt').addEventListener('input', function() { render(); saveSession(); });
document.getElementById('taxPct').addEventListener('input', function() { render(); saveSession(); });

// Theme toggle
(function() {
  var btn = document.getElementById('themeToggle');
  var isLight = localStorage.getItem('theme') === 'light';
  if (isLight) document.body.classList.add('light');
  btn.textContent = isLight ? '\u2600\ufe0f' : '\ud83c\udf19';
  btn.addEventListener('click', function() {
    var nowLight = document.body.classList.toggle('light');
    btn.textContent = nowLight ? '\u2600\ufe0f' : '\ud83c\udf19';
    localStorage.setItem('theme', nowLight ? 'light' : 'dark');
  });
})();

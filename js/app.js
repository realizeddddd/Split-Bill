// ── i18n ──────────────────────────────────────────────────────────────────────

var LANG = localStorage.getItem('lang') || 'en';

// ── Section icons (SVG) ───────────────────────────────────────────────────────

var ICONS = {
  people: '<svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="7" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M3 19c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="17" cy="8" r="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M21 19c0-2.761-1.791-5-4-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  items:  '<svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  tipTax: '<svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="8.5" r="2" stroke="currentColor" stroke-width="1.8"/><circle cx="15.5" cy="15.5" r="2" stroke="currentColor" stroke-width="1.8"/><path d="M5 19L19 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  summary:'<svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="12" width="4" height="9" rx="1" stroke="currentColor" stroke-width="1.8"/><rect x="10" y="7" width="4" height="14" rx="1" stroke="currentColor" stroke-width="1.8"/><rect x="17" y="3" width="4" height="18" rx="1" stroke="currentColor" stroke-width="1.8"/></svg>'
};

var T = {
  en: {
    people: 'People', items: 'Items', tipTax: 'Tip & Tax', summary: 'Summary',
    enterManually: 'Enter item(s) manually',
    addPerson: 'Name', addItem: 'Item name', cost: 'Cost',
    add: 'Add',
    extrasQuestion: 'Any tip or tax on this bill?',
    noPeople: 'No people added yet.', noItems: 'No items added yet.',
    addPeopleFirst: 'Add people first',
    noSplit: 'Add people to see the split.',
    tip: 'Tip', taxPct: 'Tax %', splitExtras: 'Split extras',
    equally: 'Equally', proportionally: 'Proportionally',
    subtotal: 'Subtotal', total: 'Total', tax: 'Tax',
    shareWa: '💬 Share WhatsApp ▾',
    shareText: 'Share as Text', shareJPG: 'Share as JPG', sharePDF: 'Share as PDF',
    splitBillSummary: 'Split Bill Summary',
    viewSession: 'View on Web',
    createdUsing: 'Created using',
    appBy: 'App by realizeddddd',
    noItemsAssigned: 'No items assigned',
    tipAndTax: 'Tip & Tax',
    waTextSaved: 'Split Bill summary image saved! Attach it here.',
    waPdfSaved: 'Split Bill PDF saved! Attach it here.',
    eventPlaceholder: "Event name (e.g. Dinner at Lilis place)",
  },
  id: {
    people: 'Peserta', items: 'Item', tipTax: 'Tip & Pajak', summary: 'Ringkasan',
    enterManually: 'Masukkan item secara manual',
    addPerson: 'Nama', addItem: 'Nama item', cost: 'Harga',
    add: 'Tambah',
    extrasQuestion: 'Ada tip atau pajak di tagihan ini?',
    noPeople: 'Belum ada peserta.', noItems: 'Belum ada item.',
    addPeopleFirst: 'Tambah peserta dulu',
    noSplit: 'Tambah peserta untuk melihat pembagian.',
    tip: 'Tip', taxPct: 'Pajak %', splitExtras: 'Bagi tambahan',
    equally: 'Rata', proportionally: 'Proporsional',
    subtotal: 'Subtotal', total: 'Total', tax: 'Pajak',
    shareWa: '💬 Bagikan WhatsApp ▾',
    shareText: 'Bagikan sebagai Teks', shareJPG: 'Bagikan sebagai JPG', sharePDF: 'Bagikan sebagai PDF',
    splitBillSummary: 'Ringkasan Split Bill',
    viewSession: 'Lihat di Web',
    createdUsing: 'Dibuat menggunakan',
    appBy: 'App oleh realizeddddd',
    noItemsAssigned: 'Tidak ada item',
    tipAndTax: 'Tip & Pajak',
    waTextSaved: 'Gambar Split Bill tersimpan! Lampirkan di sini.',
    waPdfSaved: 'PDF Split Bill tersimpan! Lampirkan di sini.',
    eventPlaceholder: 'Nama acara (mis. Makan Malam di tempat Lilis)',
  }
};

function t(key) { return (T[LANG] && T[LANG][key]) || T.en[key] || key; }

function applyLang() {
  // Static labels
  document.getElementById('people-heading').innerHTML = ICONS.people + t('people');
  document.getElementById('items-heading').innerHTML = ICONS.items + t('items');
  document.getElementById('extras-heading').innerHTML = ICONS.tipTax + t('tipTax');
  document.getElementById('summary-heading').innerHTML = ICONS.summary + t('summary');
  document.getElementById('section-sub-items').textContent = t('enterManually');
  document.getElementById('extras-question').textContent = t('extrasQuestion');
  document.getElementById('personInput').placeholder = t('addPerson');
  document.getElementById('itemName').placeholder = t('addItem');
  document.getElementById('itemCost').placeholder = t('cost');
  document.getElementById('eventName').placeholder = t('eventPlaceholder');
  document.querySelectorAll('.btn-add-person').forEach(function(b) { b.textContent = t('add'); });
  document.querySelectorAll('.btn-add-item').forEach(function(b) { b.textContent = t('add'); });
  document.getElementById('label-tip').textContent = t('tip');
  document.getElementById('label-tax').textContent = t('taxPct');
  document.getElementById('label-extras').childNodes[0].textContent = t('splitExtras') + ' ';
  document.getElementById('extrasMode').options[0].text = t('equally');
  document.getElementById('extrasMode').options[1].text = t('proportionally');
  document.getElementById('wa-text-btn-label').textContent = t('shareText');
  document.getElementById('wa-jpg-btn-label').textContent = t('shareJPG');
  document.getElementById('wa-pdf-btn-label').textContent = t('sharePDF');
  // Lang toggle button
  document.getElementById('langToggle').textContent = LANG === 'en' ? 'ID' : 'EN';
  render();
}

function toggleLang() {
  LANG = LANG === 'en' ? 'id' : 'en';
  localStorage.setItem('lang', LANG);
  applyLang();
}

function toggleExtras() {
  var tipOn = document.getElementById('enableTip').checked;
  var taxOn = document.getElementById('enableTax').checked;
  document.getElementById('tipWrap').style.display = tipOn ? 'flex' : 'none';
  document.getElementById('taxWrap').style.display = taxOn ? 'flex' : 'none';
  document.getElementById('extrasSplitRow').style.display = (tipOn || taxOn) ? 'flex' : 'none';
  if (!tipOn) { document.getElementById('tipAmt').value = 0; }
  if (!taxOn) { document.getElementById('taxPct').value = 0; }
  render();
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

  var eventName = document.getElementById('eventName').value.trim() || 'Split Bill';
  var s = calcShares();
  var grandTotal = s.subtotal + s.tip + s.tax;
  var link = getSessionLink();

  // Accent colors cycling
  var accents = [
    ['#6366f1','#8b5cf6','#c7d2fe'],
    ['#ec4899','#f43f5e','#fbcfe8'],
    ['#14b8a6','#06b6d4','#99f6e4'],
    ['#f59e0b','#f97316','#fde68a'],
    ['#10b981','#84cc16','#bbf7d0'],
    ['#8b5cf6','#ec4899','#e9d5ff']
  ];

  // Build self-contained HTML string
  var cardHTML = '<!DOCTYPE html><html><head><meta charset="UTF-8">'
    + '<style>'
    + '*{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,sans-serif;}'
    + 'body{background:#fff;width:559px;padding:0;}'
    + '.hdr{background:linear-gradient(135deg,#6366f1,#a855f7,#ec4899);padding:14px 18px 12px;border-radius:0 0 10px 10px;margin-bottom:12px;text-align:center;}'
    + '.hdr h1{font-size:20px;font-weight:800;color:#fff;margin-bottom:3px;}'
    + '.hdr p{font-size:12px;color:rgba(255,255,255,0.85);font-style:italic;}'
    + '.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 12px;margin-bottom:8px;}'
    + '.block{border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;}'
    + '.pname{font-size:11px;font-weight:700;padding:5px 8px;color:#fff;}'
    + 'table{width:100%;border-collapse:collapse;}'
    + 'td{font-size:10px;padding:3px 7px;border-bottom:1px solid #f1f5f9;color:#374151;}'
    + 'td.amt{text-align:right;white-space:nowrap;font-weight:500;}'
    + 'td.note{font-size:8px;color:#9ca3af;}'
    + '.extras td{color:#6b7280;font-style:italic;}'
    + '.ptotal td{font-weight:700;border-top:1.5px solid #e5e7eb;border-bottom:none;background:#f8fafc;color:#1a1a2e;}'
    + '.totals-bar{display:flex;margin:0 12px 8px;border-radius:8px;overflow:hidden;}'
    + '.totals-bar span{flex:1;text-align:center;padding:5px 4px;font-size:9px;color:#fff;font-weight:600;}'
    + '.footer{text-align:center;font-size:8px;color:#9ca3af;border-top:1px solid #e5e7eb;padding:6px 12px 10px;margin-top:4px;}'
    + '.footer a{color:#6366f1;}'
    + '</style></head><body>'
    + '<div class="hdr"><h1>Split Bill</h1><p>' + eventName + '</p></div>'
    + '<div class="grid">';

  people.forEach(function(person, idx) {
    var ac = accents[idx % accents.length];
    var myItems = items.filter(function(item) { return item.assignees.includes(person); });
    var extras = s.extrasPerPerson[person];

    cardHTML += '<div class="block" style="border-color:' + ac[2] + '">'
      + '<div class="pname" style="background:linear-gradient(90deg,' + ac[0] + ',' + ac[1] + ')">' + person + '</div>'
      + '<table>';

    if (!myItems.length) {
      cardHTML += '<tr><td colspan="2" style="color:#9ca3af;font-style:italic">' + t('noItemsAssigned') + '</td></tr>';
    } else {
      myItems.forEach(function(item) {
        var assigned = item.assignees.filter(function(p) { return people.includes(p); });
        var share = assigned.length ? item.cost / assigned.length : 0;
        var note = assigned.length > 1 ? ' <span style="font-size:8px;color:#9ca3af">\u00f7' + assigned.length + '</span>' : '';
        cardHTML += '<tr><td>' + item.name + note + '</td><td class="amt">' + fmt(share) + '</td></tr>';
      });
    }

    if (extras > 0) {
      cardHTML += '<tr class="extras"><td>' + t('tipAndTax') + '</td><td class="amt">' + fmt(extras) + '</td></tr>';
    }
    cardHTML += '<tr class="ptotal"><td>' + t('total') + '</td><td class="amt">' + fmt(s.totals[person]) + '</td></tr>';
    cardHTML += '</table></div>';
  });

  cardHTML += '</div>';

  // Totals bar
  cardHTML += '<div class="totals-bar">'
    + '<span style="background:#6366f1">' + t('subtotal') + ': ' + fmt(s.subtotal) + '</span>';
  if (s.tip > 0) cardHTML += '<span style="background:#a855f7">' + t('tip') + ': ' + fmt(s.tip) + '</span>';
  if (s.tax > 0) cardHTML += '<span style="background:#ec4899">' + t('tax') + ' ' + s.taxPct + '%: ' + fmt(s.tax) + '</span>';
  cardHTML += '<span style="background:#1a1a2e;font-size:10px;font-weight:800">' + t('total') + ': ' + fmt(grandTotal) + '</span>'
    + '</div>';

  cardHTML += '<div class="footer">'
    + t('createdUsing') + ' <a href="' + link + '">Split Bill</a> ' + t('appBy')
    + ' &bull; <a href="' + link + '">' + t('viewSession') + '</a>'
    + '</div></body></html>';

  // Render in hidden iframe, then capture
  var iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;top:-9999px;left:0;width:559px;height:800px;border:none;visibility:hidden;';
  document.body.appendChild(iframe);
  iframe.contentDocument.open();
  iframe.contentDocument.write(cardHTML);
  iframe.contentDocument.close();

  setTimeout(function() {
    html2canvas(iframe.contentDocument.body, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 559,
      height: iframe.contentDocument.body.scrollHeight,
      windowWidth: 559
    }).then(function(canvas) {
      document.body.removeChild(iframe);
      callback(canvas);
    });
  }, 300);
}

// ── Share ─────────────────────────────────────────────────────────────────────

function shortenUrl(url, callback) {
  fetch('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url))
    .then(function(res) { return res.text(); })
    .then(function(short) { callback(short.trim()); })
    .catch(function() { callback(url); }); // fallback to original on error
}

function shareWhatsAppText() {
  saveSession();
  var s = calcShares();
  var grandTotal = s.subtotal + s.tip + s.tax;
  var eventName = document.getElementById('eventName').value.trim();
  var longLink = getSessionLink();

  function buildAndSend(link) {
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

  shortenUrl(longLink, buildAndSend);
}

function shareWhatsAppJPG() {
  saveSession();
  captureCard(function(canvas) {
    var a = document.createElement('a');
    var name = document.getElementById('eventName').value.trim() || 'splitbill';
    a.download = name.replace(/\s+/g, '-') + '.jpg';
    a.href = canvas.toDataURL('image/jpeg', 0.92);
    a.click();
  });
}

function shareWhatsAppPDF() {
  saveSession();
  captureCard(function(canvas) {
    var pdf = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
    var pageW = 148, pageH = 210;
    var imgW = pageW, imgH = (canvas.height / canvas.width) * pageW;
    if (imgH > pageH) { imgW = (pageH / imgH) * pageW; imgH = pageH; }
    var x = (pageW - imgW) / 2;
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', x, 0, imgW, imgH);

    // Add clickable link annotation over the footer area
    var link = getSessionLink();
    // Footer is at the very bottom of the image — estimate Y position
    var footerY = imgH - 6; // ~6mm from bottom
    pdf.link(x, footerY, imgW, 6, { url: link });

    var name = document.getElementById('eventName').value.trim() || 'splitbill';
    pdf.save(name.replace(/\s+/g, '-') + '.pdf');
  });
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

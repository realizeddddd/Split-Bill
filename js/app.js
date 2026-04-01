// ── Session ──────────────────────────────────────────────────────────────────

function genId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function getSessionId() {
  // Check URL hash first (shared link)
  const hash = window.location.hash.slice(1);
  if (hash) return hash;
  // Otherwise use or create a session id in localStorage
  let id = localStorage.getItem('currentSession');
  if (!id) {
    id = genId();
    localStorage.setItem('currentSession', id);
    window.location.hash = id;
  }
  return id;
}

let SESSION_ID = getSessionId();
// Keep URL hash in sync
window.location.hash = SESSION_ID;

function saveSession() {
  const state = {
    people,
    items,
    eventName: document.getElementById('eventName').value,
    currency: document.getElementById('currency').value,
    tipAmt: document.getElementById('tipAmt').value,
    taxPct: document.getElementById('taxPct').value,
    extrasMode: document.getElementById('extrasMode').value,
  };
  localStorage.setItem('session_' + SESSION_ID, JSON.stringify(state));
}

function loadSession() {
  const raw = localStorage.getItem('session_' + SESSION_ID);
  if (!raw) return;
  try {
    const state = JSON.parse(raw);
    people = state.people || [];
    items = state.items || [];
    if (state.eventName) document.getElementById('eventName').value = state.eventName;
    if (state.currency) document.getElementById('currency').value = state.currency;
    if (state.tipAmt) document.getElementById('tipAmt').value = state.tipAmt;
    if (state.taxPct) document.getElementById('taxPct').value = state.taxPct;
    if (state.extrasMode) document.getElementById('extrasMode').value = state.extrasMode;
  } catch(e) {}
}

function getSessionLink() {
  return window.location.origin + window.location.pathname + '#' + SESSION_ID;
}

// ── State ─────────────────────────────────────────────────────────────────────

let people = [];
let items = [];

// ── Mutations ─────────────────────────────────────────────────────────────────

function addPerson() {
  const input = document.getElementById('personInput');
  const name = input.value.trim();
  if (!name || people.includes(name)) return;
  people.push(name);
  input.value = '';
  render();
  saveSession();
}

function removePerson(name) {
  people = people.filter(function(p) { return p !== name; });
  items.forEach(function(item) {
    item.assignees = item.assignees.filter(function(p) { return p !== name; });
  });
  render();
  saveSession();
}

function addItem() {
  const name = document.getElementById('itemName').value.trim();
  const cost = parseFloat(document.getElementById('itemCost').value);
  if (!name || isNaN(cost) || cost < 0) return;
  items.push({ id: Date.now(), name, cost, assignees: people.slice() });
  document.getElementById('itemName').value = '';
  document.getElementById('itemCost').value = '';
  render();
  saveSession();
}

function removeItem(id) {
  items = items.filter(function(i) { return i.id !== id; });
  render();
  saveSession();
}

function toggleAssignee(itemId, person) {
  const item = items.find(function(i) { return i.id === itemId; });
  if (!item) return;
  if (item.assignees.includes(person)) {
    item.assignees = item.assignees.filter(function(p) { return p !== person; });
  } else {
    item.assignees.push(person);
  }
  render();
  saveSession();
}

// ── Formatting ────────────────────────────────────────────────────────────────

function fmt(n) {
  const currency = document.getElementById('currency').value;
  if (currency === 'IDR') {
    return 'Rp ' + Math.round(n).toLocaleString('id-ID');
  }
  return '$' + n.toFixed(2);
}

// ── Render ────────────────────────────────────────────────────────────────────

function render() {
  renderPeople();
  renderItems();
  renderSummary();
}

function renderPeople() {
  const el = document.getElementById('peopleList');
  if (!people.length) {
    el.innerHTML = '<li class="empty">No people added yet.</li>';
    return;
  }
  el.innerHTML = people.map(function(p) {
    return '<li class="tag">' + p
      + '<button onclick="removePerson(\'' + p + '\')" aria-label="Remove ' + p + '">\u00d7</button>'
      + '</li>';
  }).join('');
}

function renderItems() {
  const el = document.getElementById('itemList');
  if (!items.length) {
    el.innerHTML = '<li class="empty">No items added yet.</li>';
    return;
  }
  el.innerHTML = items.map(function(item) {
    const chips = people.map(function(p) {
      const active = item.assignees.includes(p) ? ' active' : '';
      return '<button class="assignee-chip' + active + '" onclick="toggleAssignee(' + item.id + ', \'' + p + '\')" aria-pressed="' + item.assignees.includes(p) + '">' + p + '</button>';
    }).join('');
    const noPeople = !people.length ? '<span style="font-size:0.8rem;color:#9ca3af">Add people first</span>' : '';
    return '<li class="item-row">'
      + '<span>' + item.name + ' \u2014 ' + fmt(item.cost) + '</span>'
      + '<div class="assignees" role="group" aria-label="Assign ' + item.name + ' to">' + chips + noPeople + '</div>'
      + '<button class="btn-danger" aria-label="Remove ' + item.name + '" onclick="removeItem(' + item.id + ')">\u2715</button>'
      + '</li>';
  }).join('');
}

function calcShares() {
  const subtotal = items.reduce(function(s, i) { return s + i.cost; }, 0);
  const tipAmt = parseFloat(document.getElementById('tipAmt').value) || 0;
  const taxPct = parseFloat(document.getElementById('taxPct').value) || 0;
  const tax = subtotal * taxPct / 100;
  const extrasTotal = tipAmt + tax;
  const extrasMode = document.getElementById('extrasMode').value;

  const itemShares = {};
  people.forEach(function(p) { itemShares[p] = 0; });
  items.forEach(function(item) {
    const assigned = item.assignees.filter(function(p) { return people.includes(p); });
    if (!assigned.length) return;
    assigned.forEach(function(p) { itemShares[p] += item.cost / assigned.length; });
  });

  const extrasPerPerson = {};
  people.forEach(function(p) { extrasPerPerson[p] = 0; });
  if (extrasTotal > 0 && people.length) {
    if (extrasMode === 'equal') {
      people.forEach(function(p) { extrasPerPerson[p] = extrasTotal / people.length; });
    } else {
      const itemTotal = Object.values(itemShares).reduce(function(a, b) { return a + b; }, 0);
      people.forEach(function(p) {
        extrasPerPerson[p] = itemTotal > 0
          ? extrasTotal * (itemShares[p] / itemTotal)
          : extrasTotal / people.length;
      });
    }
  }

  const totals = {};
  people.forEach(function(p) { totals[p] = itemShares[p] + extrasPerPerson[p]; });

  return { subtotal, tip: tipAmt, tax, taxPct, extrasTotal: extrasTotal, itemShares, extrasPerPerson, totals };
}

function renderSummary() {
  const shares = calcShares();
  const { subtotal, tip, tax, taxPct, totals } = shares;
  const total = subtotal + tip + tax;
  const summaryEl = document.getElementById('summaryList');
  const totalsEl = document.getElementById('totals');

  if (!people.length) {
    summaryEl.innerHTML = '<li class="empty">Add people to see the split.</li>';
    totalsEl.innerHTML = '';
    return;
  }

  summaryEl.innerHTML = people.map(function(p) {
    const myItems = items.filter(function(item) { return item.assignees.includes(p); });
    const itemLines = myItems.map(function(item) {
      const assigned = item.assignees.filter(function(x) { return people.includes(x); });
      const share = assigned.length ? item.cost / assigned.length : 0;
      return '<li class="summary-item">' + item.name + ' <span>' + fmt(share) + '</span></li>';
    }).join('');
    return '<li class="summary-row">'
      + '<div class="summary-top"><span class="name">' + p + '</span><strong class="amount">' + fmt(totals[p]) + '</strong></div>'
      + (myItems.length ? '<ul class="summary-items">' + itemLines + '</ul>' : '')
      + '</li>';
  }).join('');

  totalsEl.innerHTML = '<p class="line"><span>Subtotal</span><span>' + fmt(subtotal) + '</span></p>'
    + (tip > 0 ? '<p class="line"><span>Tip</span><span>' + fmt(tip) + '</span></p>' : '')
    + (tax > 0 ? '<p class="line"><span>Tax (' + taxPct + '%)</span><span>' + fmt(tax) + '</span></p>' : '')
    + '<p class="line grand"><span>Total</span><span>' + fmt(total) + '</span></p>';
}

// ── Export PDF ────────────────────────────────────────────────────────────────

function exportPDF() {
  const breakdown = document.getElementById('print-breakdown');
  const eventName = document.getElementById('eventName').value.trim();

  let eventNameEl = document.getElementById('print-event-name');
  if (!eventNameEl) {
    eventNameEl = document.createElement('p');
    eventNameEl.id = 'print-event-name';
    document.querySelector('header').appendChild(eventNameEl);
  }
  eventNameEl.textContent = eventName || 'Split Bill';

  const { subtotal, tip, tax, taxPct, extrasPerPerson, totals } = calcShares();
  const grandTotal = subtotal + tip + tax;

  if (!items.length) {
    breakdown.innerHTML = '<p>No items.</p>';
    window.print();
    return;
  }

  let html = '<div class="pdf-grid">';
  people.forEach(function(person) {
    const myItems = items.filter(function(item) { return item.assignees.includes(person); });
    const extras = extrasPerPerson[person];

    html += '<div class="person-block">';
    html += '<div class="person-name">' + person + '</div>';
    html += '<table><tbody>';

    if (!myItems.length) {
      html += '<tr><td colspan="2" class="empty-cell">No items assigned</td></tr>';
    } else {
      myItems.forEach(function(item) {
        const assigned = item.assignees.filter(function(p) { return people.includes(p); });
        const share = assigned.length ? item.cost / assigned.length : 0;
        const splitNote = assigned.length > 1 ? ' <span class="split-note">\u00f7' + assigned.length + '</span>' : '';
        html += '<tr><td>' + item.name + splitNote + '</td><td class="amt">' + fmt(share) + '</td></tr>';
      });
    }

    if (extras > 0) {
      html += '<tr class="extras-row"><td>Tip &amp; Tax</td><td class="amt">' + fmt(extras) + '</td></tr>';
    }

    html += '<tr class="person-total"><td>Total</td><td class="amt">' + fmt(totals[person]) + '</td></tr>';
    html += '</tbody></table></div>';
  });
  html += '</div>';

  html += '<div class="pdf-totals">';
  html += '<span>Subtotal: ' + fmt(subtotal) + '</span>';
  if (tip > 0) html += '<span>Tip: ' + fmt(tip) + '</span>';
  if (tax > 0) html += '<span>Tax (' + taxPct + '%): ' + fmt(tax) + '</span>';
  html += '<span class="pdf-grand">Total: ' + fmt(grandTotal) + '</span>';
  html += '</div>';

  breakdown.innerHTML = html;

  // Populate watermark with session link (shown at bottom of every print page)
  var link = getSessionLink();
  document.getElementById('watermark').innerHTML =
    'Created using <a href="' + link + '">Split Bill</a> App by realizeddddd'
    + ' \u2022 '
    + '<a href="' + link + '">' + link + '</a>';

  window.print();
}

// ── Share WhatsApp ────────────────────────────────────────────────────────────

function shareWhatsApp() {
  saveSession();
  const { subtotal, tip, tax, taxPct, totals, extrasPerPerson } = calcShares();
  const grandTotal = subtotal + tip + tax;
  const eventName = document.getElementById('eventName').value.trim();
  const link = getSessionLink();

  let msg = '';
  if (eventName) msg += '*' + eventName + '*\n';
  msg += '*Split Bill Summary*\n';
  msg += '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n';

  people.forEach(function(person) {
    const myItems = items.filter(function(item) { return item.assignees.includes(person); });
    msg += '\n\ud83d\udc64 *' + person + '* \u2014 ' + fmt(totals[person]) + '\n';
    myItems.forEach(function(item) {
      const assigned = item.assignees.filter(function(p) { return people.includes(p); });
      const share = assigned.length ? item.cost / assigned.length : 0;
      const note = assigned.length > 1 ? ' (\u00f7' + assigned.length + ')' : '';
      msg += '  \u2022 ' + item.name + note + ': ' + fmt(share) + '\n';
    });
    if (extrasPerPerson[person] > 0) {
      msg += '  \u2022 Tip & Tax: ' + fmt(extrasPerPerson[person]) + '\n';
    }
  });

  msg += '\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n';
  msg += 'Subtotal: ' + fmt(subtotal) + '\n';
  if (tip > 0) msg += 'Tip: ' + fmt(tip) + '\n';
  if (tax > 0) msg += 'Tax (' + taxPct + '%): ' + fmt(tax) + '\n';
  msg += '*Total: ' + fmt(grandTotal) + '*\n';
  msg += '\n\ud83d\udd17 View session: ' + link;

  window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
}

// ── Init ──────────────────────────────────────────────────────────────────────

loadSession();
render();

// Populate session link bar
(function() {
  const link = getSessionLink();
  const el = document.getElementById('sessionLinkText');
  if (el) el.textContent = link;
})();

function copySessionLink() {
  const link = getSessionLink();
  navigator.clipboard.writeText(link).then(function() {
    const btn = document.querySelector('.btn-copy');
    btn.textContent = 'Copied!';
    setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
  });
}

// Save on input changes
['eventName','currency','tipAmt','taxPct','extrasMode'].forEach(function(id) {
  document.getElementById(id).addEventListener('change', saveSession);
});
document.getElementById('tipAmt').addEventListener('input', function() { render(); saveSession(); });
document.getElementById('taxPct').addEventListener('input', function() { render(); saveSession(); });

// Theme toggle
(function() {
  const btn = document.getElementById('themeToggle');
  const isLight = localStorage.getItem('theme') === 'light';
  if (isLight) document.body.classList.add('light');
  btn.textContent = isLight ? '\u2600\ufe0f' : '\ud83c\udf19';

  btn.addEventListener('click', function() {
    const nowLight = document.body.classList.toggle('light');
    btn.textContent = nowLight ? '\u2600\ufe0f' : '\ud83c\udf19';
    localStorage.setItem('theme', nowLight ? 'light' : 'dark');
  });
})();

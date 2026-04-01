let people = [];
let items = [];

function addPerson() {
  const input = document.getElementById('personInput');
  const name = input.value.trim();
  if (!name || people.includes(name)) return;
  people.push(name);
  input.value = '';
  render();
}

function removePerson(name) {
  people = people.filter(p => p !== name);
  items.forEach(item => { item.assignees = item.assignees.filter(p => p !== name); });
  render();
}

function addItem() {
  const name = document.getElementById('itemName').value.trim();
  const cost = parseFloat(document.getElementById('itemCost').value);
  if (!name || isNaN(cost) || cost < 0) return;
  items.push({ id: Date.now(), name, cost, assignees: [...people] });
  document.getElementById('itemName').value = '';
  document.getElementById('itemCost').value = '';
  render();
}

function removeItem(id) {
  items = items.filter(i => i.id !== id);
  render();
}

function toggleAssignee(itemId, person) {
  const item = items.find(i => i.id === itemId);
  if (!item) return;
  if (item.assignees.includes(person)) {
    item.assignees = item.assignees.filter(p => p !== person);
  } else {
    item.assignees.push(person);
  }
  render();
}

function fmt(n) {
  const currency = document.getElementById('currency').value;
  if (currency === 'IDR') {
    return 'Rp ' + Math.round(n).toLocaleString('id-ID');
  }
  return '$' + n.toFixed(2);
}

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
  el.innerHTML = people.map(p =>
    '<li class="tag">' + p + '<button onclick="removePerson(\'' + p + '\')" aria-label="Remove ' + p + '">×</button></li>'
  ).join('');
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
      const pressed = item.assignees.includes(p);
      return '<button class="assignee-chip' + active + '" onclick="toggleAssignee(' + item.id + ', \'' + p + '\')" aria-pressed="' + pressed + '">' + p + '</button>';
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

  return { subtotal, tip: tipAmt, tax, taxPct, extrasTotal, itemShares, extrasPerPerson, totals };
}

function renderSummary() {
  const { subtotal, tip, tax, taxPct, totals, extrasPerPerson } = calcShares();
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

  const { subtotal, tip, tax, taxPct, extrasTotal, itemShares, extrasPerPerson, totals } = calcShares();
  const grandTotal = subtotal + tip + tax;

  if (!items.length) {
    breakdown.innerHTML = '<p>No items.</p>';
    window.print();
    return;
  }

  // Person blocks wrapped in grid
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
        const splitNote = assigned.length > 1 ? ' <span class="split-note">÷' + assigned.length + '</span>' : '';
        html += '<tr><td>' + item.name + splitNote + '</td><td class="amt">' + fmt(share) + '</td></tr>';
      });
    }

    if (extras > 0) {
      html += '<tr class="extras-row"><td>Tip &amp; Tax</td><td class="amt">' + fmt(extras) + '</td></tr>';
    }

    html += '<tr class="person-total"><td>Total</td><td class="amt">' + fmt(totals[person]) + '</td></tr>';
    html += '</tbody></table></div>';
  });
  html += '</div>'; // close pdf-grid

  // Bill totals at the bottom
  html += '<div class="pdf-totals">';
  html += '<span>Subtotal: ' + fmt(subtotal) + '</span>';
  if (tip > 0) html += '<span>Tip: ' + fmt(tip) + '</span>';
  if (tax > 0) html += '<span>Tax (' + taxPct + '%): ' + fmt(tax) + '</span>';
  html += '<span class="pdf-grand">Total: ' + fmt(grandTotal) + '</span>';
  html += '</div>';

  breakdown.innerHTML = html;
  window.print();
}

render();

// Theme toggle
(function() {
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved === 'light') { document.body.classList.add('light'); btn.textContent = '☀️'; }

  btn.addEventListener('click', function() {
    const isLight = document.body.classList.toggle('light');
    btn.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
})();

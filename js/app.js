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
    `<li class="tag">${p}<button onclick="removePerson('${p}')" aria-label="Remove ${p}">×</button></li>`
  ).join('');
}

function renderItems() {
  const el = document.getElementById('itemList');
  if (!items.length) {
    el.innerHTML = '<li class="empty">No items added yet.</li>';
    return;
  }
  el.innerHTML = items.map(item => `
    <li class="item-row">
      <span>${item.name} — ${fmt(item.cost)}</span>
      <div class="assignees" role="group" aria-label="Assign ${item.name} to">
        ${people.map(p => `
          <button class="assignee-chip ${item.assignees.includes(p) ? 'active' : ''}"
            onclick="toggleAssignee(${item.id}, '${p}')"
            aria-pressed="${item.assignees.includes(p)}">${p}</button>
        `).join('')}
        ${!people.length ? '<span style="font-size:0.8rem;color:#9ca3af">Add people first</span>' : ''}
      </div>
      <button class="btn-danger" aria-label="Remove ${item.name}" onclick="removeItem(${item.id})">✕</button>
    </li>
  `).join('');
}

function renderSummary() {
  const subtotal = items.reduce((s, i) => s + i.cost, 0);
  const tipAmt = parseFloat(document.getElementById('tipAmt').value) || 0;
  const taxPct = parseFloat(document.getElementById('taxPct').value) || 0;
  const tip = tipAmt;
  const tax = subtotal * taxPct / 100;
  const total = subtotal + tip + tax;
  const extrasMode = document.getElementById('extrasMode').value;

  const shares = {};
  people.forEach(p => shares[p] = 0);

  items.forEach(item => {
    const assigned = item.assignees.filter(p => people.includes(p));
    if (!assigned.length) return;
    const share = item.cost / assigned.length;
    assigned.forEach(p => shares[p] += share);
  });

  const extrasTotal = tip + tax;
  if (extrasTotal > 0 && people.length) {
    if (extrasMode === 'equal') {
      const perPerson = extrasTotal / people.length;
      people.forEach(p => shares[p] += perPerson);
    } else {
      const itemTotal = Object.values(shares).reduce((a, b) => a + b, 0);
      if (itemTotal > 0) {
        people.forEach(p => shares[p] += extrasTotal * (shares[p] / itemTotal));
      } else {
        const perPerson = extrasTotal / people.length;
        people.forEach(p => shares[p] += perPerson);
      }
    }
  }

  const summaryEl = document.getElementById('summaryList');
  const totalsEl = document.getElementById('totals');

  if (!people.length) {
    summaryEl.innerHTML = '<li class="empty">Add people to see the split.</li>';
    totalsEl.innerHTML = '';
    return;
  }

  summaryEl.innerHTML = people.map(p => `
    <li class="summary-row">
      <span class="name">${p}</span>
      <strong class="amount">${fmt(shares[p])}</strong>
    </li>
  `).join('');

  totalsEl.innerHTML = `
    <p class="line"><span>Subtotal</span><span>${fmt(subtotal)}</span></p>
    ${tip > 0 ? `<p class="line"><span>Tip</span><span>${fmt(tip)}</span></p>` : ''}
    ${tax > 0 ? `<p class="line"><span>Tax (${taxPct}%)</span><span>${fmt(tax)}</span></p>` : ''}
    <p class="line grand"><span>Total</span><span>${fmt(total)}</span></p>
  `;
}

function exportPDF() {
  const breakdown = document.getElementById('print-breakdown');

  const tipAmt = parseFloat(document.getElementById('tipAmt').value) || 0;
  const taxPct = parseFloat(document.getElementById('taxPct').value) || 0;
  const subtotal = items.reduce((s, i) => s + i.cost, 0);
  const tax = subtotal * taxPct / 100;
  const extrasTotal = tipAmt + tax;
  const extrasMode = document.getElementById('extrasMode').value;

  // Compute each person's item subtotal (before extras)
  const itemShares = {};
  people.forEach(p => itemShares[p] = 0);
  items.forEach(item => {
    const assigned = item.assignees.filter(p => people.includes(p));
    if (!assigned.length) return;
    assigned.forEach(p => itemShares[p] += item.cost / assigned.length);
  });

  // Compute each person's extras share
  const extrasPerPerson = {};
  people.forEach(p => extrasPerPerson[p] = 0);
  if (extrasTotal > 0 && people.length) {
    if (extrasMode === 'equal') {
      people.forEach(p => extrasPerPerson[p] = extrasTotal / people.length);
    } else {
      const itemTotal = Object.values(itemShares).reduce((a, b) => a + b, 0);
      people.forEach(p => {
        extrasPerPerson[p] = itemTotal > 0
          ? extrasTotal * (itemShares[p] / itemTotal)
          : extrasTotal / people.length;
      });
    }
  }

  if (!items.length) {
    breakdown.innerHTML = '<p>No items.</p>';
    window.print();
    return;
  }

  // Section 1: all items overview
  const overviewTable = `
    <table>
      <thead>
        <tr><th>Item</th><th>Cost</th><th>Assigned To</th><th>Per Person</th></tr>
      </thead>
      <tbody>
        ${items.map(item => {
          const assigned = item.assignees.filter(p => people.includes(p));
          const perPerson = assigned.length ? fmt(item.cost / assigned.length) : '—';
          return `<tr>
            <td>${item.name}</td>
            <td>${fmt(item.cost)}</td>
            <td>${assigned.length ? assigned.join(', ') : '—'}</td>
            <td>${perPerson}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;

  // Section 2: per-person itemized detail
  const personTables = people.map(person => {
    const myItems = items.filter(item =>
      item.assignees.includes(person) && people.includes(person)
    );

    const itemRows = myItems.map(item => {
      const assigned = item.assignees.filter(p => people.includes(p));
      const share = item.cost / assigned.length;
      return `<tr>
        <td>${item.name}</td>
        <td>${fmt(item.cost)}</td>
        <td>${assigned.length}</td>
        <td>${fmt(share)}</td>
      </tr>`;
    }).join('') || `<tr><td colspan="4" class="empty-cell">No items assigned</td></tr>`;

    const extras = extrasPerPerson[person];
    const extrasRow = extras > 0
      ? `<tr class="extras-row"><td><em>Tip &amp; Tax share</em></td><td></td><td></td><td>${fmt(extras)}</td></tr>`
      : '';

    const grandTotal = itemShares[person] + extras;

    return `
      <div class="person-block">
        <div class="person-name">${person}</div>
        <table>
          <thead>
            <tr><th>Item</th><th>Total Cost</th><th>Shared by</th><th>Your Share</th></tr>
          </thead>
          <tbody>
            ${itemRows}
            ${extrasRow}
            <tr class="person-total">
              <td colspan="3">Total</td>
              <td>${fmt(grandTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>`;
  }).join('');

  breakdown.innerHTML = overviewTable
    + (people.length ? `<h3 class="detail-heading">Per-Person Detail</h3>${personTables}` : '');

  window.print();
}

render();

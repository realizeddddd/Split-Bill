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
  window.print();
}

render();

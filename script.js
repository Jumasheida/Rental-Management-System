let houses = JSON.parse(localStorage.getItem('houses') || '[]');
let tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
let payments = JSON.parse(localStorage.getItem('payments') || '[]');

function save() {
  localStorage.setItem('houses', JSON.stringify(houses));
  localStorage.setItem('tenants', JSON.stringify(tenants));
  localStorage.setItem('payments', JSON.stringify(payments));
  renderAll();
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function addHouse(e) {
  e.preventDefault();
  const no = document.getElementById('houseNo').value;
  const rent = document.getElementById('houseRent').value;
  houses.push({ id: Date.now(), no: no, rent: Number(rent), status: 'vacant' });
  e.target.reset();
  save();
}

function addTenant(e) {
  e.preventDefault();
  const name = document.getElementById('tName').value;
  const phone = document.getElementById('tPhone').value;
  const houseId = document.getElementById('tHouse').value;
  const h = houses.find(x => x.id == houseId);
  if (!h || h.status == 'occupied') return alert('House already occupied or not found');
  
  tenants.push({ id: Date.now(), name: name, phone: phone, houseId: h.id, houseNo: h.no, balance: h.rent });
  h.status = 'occupied';
  e.target.reset();
  save();
}

function addPayment(e) {
  e.preventDefault();
  const tenantId = document.getElementById('pTenant').value;
  const amount = document.getElementById('pAmount').value;
  const month = document.getElementById('pMonth').value;
  const t = tenants.find(x => x.id == tenantId);
  
  payments.push({ id: Date.now(), tenant: t.name, amount: Number(amount), month: month, date: new Date().toLocaleDateString() });
  t.balance -= Number(amount);
  
  document.getElementById('receiptArea').innerHTML = `
    <div class="card">
      <h3>Receipt</h3>
      <p><b>${t.name}</b> Paid Ksh ${amount} for ${month}</p>
      <button onclick="window.print()">Print Receipt</button>
    </div>`;
  
  e.target.reset();
  save();
}

function renderAll() {
  document.getElementById('houseList').innerHTML = houses.map(h => `
    <tr><td>${h.no}</td><td>${h.rent}</td><td>${h.status}</td>
    <td><button onclick="delHouse(${h.id})">Delete</button></td></tr>`).join('');

  document.getElementById('tHouse').innerHTML = houses.filter(h => h.status == 'vacant')
    .map(h => `<option value="${h.id}">${h.no} - Rent ${h.rent}</option>`).join('');

  document.getElementById('tenantList').innerHTML = tenants.map(t => `
    <tr><td>${t.name}</td><td>${t.phone}</td><td>${t.houseNo}</td>
    <td>${t.balance > 0 ? '<b style=color:red>' + t.balance + '</b>' : 'Paid'}</td></tr>`).join('');

  document.getElementById('pTenant').innerHTML = tenants.map(t => `
    <option value="${t.id}">${t.name} (${t.houseNo})</option>`).join('');

  document.getElementById('paymentList').innerHTML = payments.map(p => `
    <tr><td>${p.date}</td><td>${p.tenant}</td><td>${p.amount}</td><td>${p.month}</td></tr>`).join('');

  document.getElementById('totalHouses').textContent = houses.length;
  document.getElementById('occupied').textContent = houses.filter(h => h.status == 'occupied').length;
  document.getElementById('collected').textContent = payments.reduce((a,b) => a + b.amount, 0);
  document.getElementById('arrears').textContent = tenants.reduce((a,b) => a + (b.balance > 0 ? b.balance : 0), 0);

  document.getElementById('smsList').innerHTML = tenants.filter(t => t.balance > 0).map(t => `
    <div class="card"><p>${t.name} - Balance Ksh ${t.balance}</p>
    <a target="_blank" href="https://wa.me/${t.phone}?text=Hello%20${t.name}%20your%20rent%20balance%20is%20Ksh%20${t.balance}">Send WhatsApp</a></div>`).join('');
}

function delHouse(id) {
  if (confirm('Delete this house?')) {
    houses = houses.filter(h => h.id != id);
    save();
  }
}

renderAll();
<template>
  <div id="app">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">📊</div>
          <span>BooksFlow</span>
        </div>
        <nav>
          <button :class="{ active: currentPage === 'dashboard' }" @click="currentPage = 'dashboard'">Dashboard</button>
          <button :class="{ active: currentPage === 'transactions' }" @click="currentPage = 'transactions'">Journal</button>
          <button :class="{ active: currentPage === 'invoices' }" @click="currentPage = 'invoices'">Invoices</button>
          <button :class="{ active: currentPage === 'reports' }" @click="currentPage = 'reports'">Reports</button>
        </nav>
      </div>
    </header>

    <main class="main">
      <!-- Dashboard -->
      <div v-if="currentPage === 'dashboard'">
        <div class="page-header">
          <h1 class="title">Dashboard</h1>
          <button class="btn btn-primary" @click="openTransactionModal">+ New Transaction</button>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-label">Total Revenue</span>
              <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--success);">💰</div>
            </div>
            <div class="stat-value">${{ formatNumber(dashboard.totalRevenue) }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-label">Total Expenses</span>
              <div class="stat-icon" style="background: rgba(239, 68, 68, 0.1); color: var(--danger);">💸</div>
            </div>
            <div class="stat-value" style="color: var(--danger);">${{ formatNumber(dashboard.totalExpenses) }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-label">Net Income</span>
              <div class="stat-icon" style="background: rgba(99, 102, 241, 0.1); color: var(--primary);">📈</div>
            </div>
            <div class="stat-value" :style="{ color: dashboard.netIncome >= 0 ? 'var(--success)' : 'var(--danger)' }">
              ${{ formatNumber(dashboard.netIncome) }}
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-label">Total Assets</span>
              <div class="stat-icon" style="background: rgba(245, 158, 11, 0.1); color: var(--warning);">🏢</div>
            </div>
            <div class="stat-value">${{ formatNumber(dashboard.totalAssets) }}</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Transactions</h3>
            <button class="btn btn-primary" @click="currentPage = 'transactions'">View All</button>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Entries</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in transactions.slice(0, 5)" :key="t.id">
                <td>{{ t.date }}</td>
                <td>{{ t.description }}</td>
                <td>
                  <span v-for="(e, i) in t.entries" :key="i" style="margin-right: 8px;">
                    {{ e.accountName }}: {{ e.debit > 0 ? 'Dr $' + e.debit : 'Cr $' + e.credit }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Transactions -->
      <div v-if="currentPage === 'transactions'">
        <div class="page-header">
          <h1 class="title">Journal Entries</h1>
          <button class="btn btn-primary" @click="openTransactionModal">+ New Transaction</button>
        </div>
        
        <div class="card">
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Entries</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in transactions" :key="t.id">
                <td>{{ t.date }}</td>
                <td>{{ t.description }}</td>
                <td>
                  <span v-for="(e, i) in t.entries" :key="i" style="margin-right: 12px; font-size: 13px;">
                    <strong>{{ e.accountName }}</strong>: Dr ${{ e.debit }} / Cr ${{ e.credit }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Chart of Accounts</h3>
            <button class="btn btn-primary" @click="openAccountModal">+ Add Account</button>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Type</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="acc in accounts" :key="acc.id">
                <td>{{ acc.name }}</td>
                <td style="text-transform: capitalize;">{{ acc.type }}</td>
                <td :style="{ color: acc.balance >= 0 ? 'var(--success)' : 'var(--danger)' }">
                  ${{ formatNumber(acc.balance) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Invoices -->
      <div v-if="currentPage === 'invoices'">
        <div class="page-header">
          <h1 class="title">Invoices & Bills</h1>
          <button class="btn btn-primary" @click="openInvoiceModal">+ New Invoice</button>
        </div>
        
        <div class="tabs">
          <button class="tab" :class="{ active: invoiceTab === 'invoices' }" @click="invoiceTab = 'invoices'">Invoices</button>
          <button class="tab" :class="{ active: invoiceTab === 'bills' }" @click="invoiceTab = 'bills'">Bills</button>
        </div>

        <div v-if="invoiceTab === 'invoices'" class="card">
          <table class="table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Client</th>
                <th>Date</th>
                <th>Due</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inv in invoices" :key="inv.id">
                <td><strong>{{ inv.number }}</strong></td>
                <td>{{ inv.client }}</td>
                <td>{{ inv.date }}</td>
                <td>{{ inv.dueDate }}</td>
                <td style="color: var(--success); font-weight: 600;">${{ formatNumber(inv.total) }}</td>
                <td><span class="badge" :class="'badge-' + inv.status">{{ inv.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="invoiceTab === 'bills'" class="card">
          <table class="table">
            <thead>
              <tr>
                <th>Bill</th>
                <th>Vendor</th>
                <th>Date</th>
                <th>Due</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bill in bills" :key="bill.id">
                <td><strong>{{ bill.number }}</strong></td>
                <td>{{ bill.vendor }}</td>
                <td>{{ bill.date }}</td>
                <td>{{ bill.dueDate }}</td>
                <td style="color: var(--danger); font-weight: 600;">${{ formatNumber(bill.total) }}</td>
                <td><span class="badge" :class="'badge-' + bill.status">{{ bill.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reports -->
      <div v-if="currentPage === 'reports'">
        <div class="page-header">
          <h1 class="title">Financial Reports</h1>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Profit & Loss</h3>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="2" style="font-weight: 600; background: var(--bg);">Income</td>
              </tr>
              <tr v-for="acc in reports.profitLoss?.incomeAccounts || []" :key="acc.id">
                <td>{{ acc.name }}</td>
                <td style="color: var(--success); font-weight: 600;">${{ formatNumber(acc.balance) }}</td>
              </tr>
              <tr>
                <td colspan="2" style="font-weight: 600; background: var(--bg);">Expenses</td>
              </tr>
              <tr v-for="acc in reports.profitLoss?.expenseAccounts || []" :key="acc.id">
                <td>{{ acc.name }}</td>
                <td style="color: var(--danger); font-weight: 600;">${{ formatNumber(acc.balance) }}</td>
              </tr>
              <tr style="font-weight: 700; background: var(--bg);">
                <td>Net Income</td>
                <td :style="{ color: reports.profitLoss?.netIncome >= 0 ? 'var(--success)' : 'var(--danger)' }">
                  ${{ formatNumber(reports.profitLoss?.netIncome || 0) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Transaction Modal -->
    <div class="modal-overlay" :class="{ active: showTransactionModal }">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">New Journal Entry</h3>
          <button class="modal-close" @click="showTransactionModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" class="form-input" v-model="newTransaction.date">
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <input type="text" class="form-input" v-model="newTransaction.description" placeholder="Transaction description">
          </div>
          <div class="form-group">
            <label class="form-label">Entries</label>
            <div v-for="(entry, i) in newTransaction.entries" :key="i" class="form-row" style="margin-bottom: 12px;">
              <select class="form-select" v-model="entry.accountId">
                <option v-for="acc in accounts" :key="acc.id" :value="acc.id">{{ acc.name }}</option>
              </select>
              <input type="number" class="form-input" v-model="entry.debit" placeholder="Debit">
              <input type="number" class="form-input" v-model="entry.credit" placeholder="Credit">
            </div>
            <button class="btn btn-primary" @click="newTransaction.entries.push({ accountId: '', debit: 0, credit: 0 })">+ Add Entry</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showTransactionModal = false">Cancel</button>
          <button class="btn btn-primary" @click="saveTransaction">Save Transaction</button>
        </div>
      </div>
    </div>

    <!-- Invoice Modal -->
    <div class="modal-overlay" :class="{ active: showInvoiceModal }">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">New Invoice</h3>
          <button class="modal-close" @click="showInvoiceModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Client</label>
              <input type="text" class="form-input" v-model="newInvoice.client" placeholder="Client name">
            </div>
            <div class="form-group">
              <label class="form-label">Date</label>
              <input type="date" class="form-input" v-model="newInvoice.date">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Due Date</label>
            <input type="date" class="form-input" v-model="newInvoice.dueDate">
          </div>
          <div class="form-group">
            <label class="form-label">Items</label>
            <div v-for="(item, i) in newInvoice.items" :key="i" class="form-row" style="margin-bottom: 12px;">
              <input type="text" class="form-input" v-model="item.description" placeholder="Description">
              <input type="number" class="form-input" v-model="item.quantity" placeholder="Qty">
              <input type="number" class="form-input" v-model="item.price" placeholder="Price">
            </div>
            <button class="btn btn-primary" @click="newInvoice.items.push({ description: '', quantity: 1, price: 0 })">+ Add Item</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showInvoiceModal = false">Cancel</button>
          <button class="btn btn-primary" @click="saveInvoice">Create Invoice</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentPage = ref('dashboard')
const invoiceTab = ref('invoices')
const dashboard = ref({})
const accounts = ref([])
const transactions = ref([])
const invoices = ref([])
const bills = ref([])
const reports = ref({})

const showTransactionModal = ref(false)
const showInvoiceModal = ref(false)

const newTransaction = ref({
  date: new Date().toISOString().split('T')[0],
  description: '',
  entries: [{ accountId: '', debit: 0, credit: 0 }]
})

const newInvoice = ref({
  client: '',
  date: new Date().toISOString().split('T')[0],
  dueDate: '',
  items: [{ description: '', quantity: 1, price: 0 }]
})

const formatNumber = (num) => num?.toLocaleString() || '0'

const loadDashboard = async () => {
  const res = await fetch('/api/dashboard')
  const data = await res.json()
  if (data.success) dashboard.value = data.data
}

const loadAccounts = async () => {
  const res = await fetch('/api/accounts')
  const data = await res.json()
  if (data.success) accounts.value = data.data
}

const loadTransactions = async () => {
  const res = await fetch('/api/transactions')
  const data = await res.json()
  if (data.success) transactions.value = data.data
}

const loadInvoices = async () => {
  const res = await fetch('/api/invoices')
  const data = await res.json()
  if (data.success) invoices.value = data.data
}

const loadBills = async () => {
  const res = await fetch('/api/bills')
  const data = await res.json()
  if (data.success) bills.value = data.data
}

const loadReports = async () => {
  const res = await fetch('/api/reports/profit-loss')
  const data = await res.json()
  if (data.success) reports.value = { profitLoss: data.data }
}

const openTransactionModal = () => {
  newTransaction.value = {
    date: new Date().toISOString().split('T')[0],
    description: '',
    entries: [{ accountId: accounts.value[0]?.id || '', debit: 0, credit: 0 }]
  }
  showTransactionModal.value = true
}

const saveTransaction = async () => {
  await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTransaction.value)
  })
  showTransactionModal.value = false
  await Promise.all([loadDashboard(), loadTransactions(), loadAccounts()])
}

const openInvoiceModal = () => {
  newInvoice.value = {
    client: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, price: 0 }]
  }
  showInvoiceModal.value = true
}

const saveInvoice = async () => {
  await fetch('/api/invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newInvoice.value)
  })
  showInvoiceModal.value = false
  await loadInvoices()
}

const openAccountModal = () => {
  const name = prompt('Account name:')
  const type = prompt('Type (asset/liability/income/expense/equity):')
  if (name && type) {
    fetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type })
    })
    loadAccounts()
  }
}

onMounted(async () => {
  await Promise.all([
    loadDashboard(),
    loadAccounts(),
    loadTransactions(),
    loadInvoices(),
    loadBills(),
    loadReports()
  ])
})
</script>

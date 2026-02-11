const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3017;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory database
let accounts = [
  { id: 'a1', name: 'Cash', type: 'asset', balance: 15000 },
  { id: 'a2', name: 'Accounts Receivable', type: 'asset', balance: 8500 },
  { id: 'a3', name: 'Inventory', type: 'asset', balance: 12000 },
  { id: 'a4', name: 'Accounts Payable', type: 'liability', balance: 5000 },
  { id: 'a5', name: 'Sales Revenue', type: 'income', balance: 45000 },
  { id: 'a6', name: 'Cost of Goods Sold', type: 'expense', balance: 18000 },
  { id: 'a7', name: 'Operating Expenses', type: 'expense', balance: 9500 },
];

let transactions = [
  { id: 't1', date: '2026-01-15', description: 'Sales - Invoice #101', entries: [
    { accountId: 'a2', debit: 2500, credit: 0 },
    { accountId: 'a5', debit: 0, credit: 2500 }
  ]},
  { id: 't2', date: '2026-01-18', description: 'Purchase Inventory', entries: [
    { accountId: 'a3', debit: 3000, credit: 0 },
    { accountId: 'a4', debit: 0, credit: 3000 }
  ]},
  { id: 't3', date: '2026-01-22', description: 'Received Payment', entries: [
    { accountId: 'a1', debit: 2500, credit: 0 },
    { accountId: 'a2', debit: 0, credit: 2500 }
  ]},
  { id: 't4', date: '2026-01-25', description: 'Operating Expenses', entries: [
    { accountId: 'a7', debit: 1500, credit: 0 },
    { accountId: 'a1', debit: 0, credit: 1500 }
  ]},
];

let invoices = [
  { id: 'inv1', number: 'INV-001', client: 'ABC Corp', date: '2026-02-01', dueDate: '2026-03-03', items: [
    { description: 'Consulting Services', quantity: 20, price: 150 }
  ], subtotal: 3000, tax: 0, total: 3000, status: 'sent' },
  { id: 'inv2', number: 'INV-002', client: 'XYZ Ltd', date: '2026-02-05', dueDate: '2026-03-07', items: [
    { description: 'Software License', quantity: 1, price: 2500 }
  ], subtotal: 2500, tax: 250, total: 2750, status: 'paid' },
];

let bills = [
  { id: 'b1', number: 'BILL-001', vendor: 'Office Supplies Inc', date: '2026-02-01', dueDate: '2026-03-03', items: [
    { description: 'Office Supplies', quantity: 1, price: 500 }
  ], total: 500, status: 'pending' },
];

// Dashboard
app.get('/api/dashboard', (req, res) => {
  const totalRevenue = accounts.find(a => a.name === 'Sales Revenue')?.balance || 0;
  const totalExpenses = accounts.filter(a => a.type === 'expense').reduce((sum, a) => sum + a.balance, 0);
  const totalAssets = accounts.filter(a => a.type === 'asset').reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.type === 'liability').reduce((sum, a) => sum + a.balance, 0);
  
  res.json({
    success: true,
    data: {
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
      totalAssets,
      totalLiabilities,
      equity: totalAssets - totalLiabilities,
      pendingInvoices: invoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + i.total, 0),
      pendingBills: bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.total, 0),
      transactionCount: transactions.length
    }
  });
});

// Accounts
app.get('/api/accounts', (req, res) => {
  res.json({ success: true, data: accounts });
});

app.post('/api/accounts', (req, res) => {
  const account = {
    id: 'a' + Date.now(),
    name: req.body.name,
    type: req.body.type,
    balance: 0
  };
  accounts.push(account);
  res.json({ success: true, data: account });
});

// Transactions
app.get('/api/transactions', (req, res) => {
  const data = transactions.map(t => ({
    ...t,
    entries: t.entries.map(e => ({
      ...e,
      accountName: accounts.find(a => a.id === e.accountId)?.name || 'Unknown'
    }))
  }));
  res.json({ success: true, data });
});

app.post('/api/transactions', (req, res) => {
  const transaction = {
    id: 't' + Date.now(),
    date: req.body.date,
    description: req.body.description,
    entries: req.body.entries.map(e => ({ accountId: e.accountId, debit: e.debit || 0, credit: e.credit || 0 }))
  };
  transactions.push(transaction);
  
  // Update account balances
  transaction.entries.forEach(e => {
    const account = accounts.find(a => a.id === e.accountId);
    if (account) {
      if (e.debit > 0) account.balance += e.debit;
      if (e.credit > 0) account.balance -= e.credit;
    }
  });
  
  res.json({ success: true, data: transaction });
});

// Invoices
app.get('/api/invoices', (req, res) => {
  res.json({ success: true, data: invoices });
});

app.post('/api/invoices', (req, res) => {
  const subtotal = req.body.items.reduce((sum, i) => sum + (i.quantity * i.price), 0);
  const invoice = {
    id: 'inv' + Date.now(),
    number: 'INV-' + String(invoices.length + 1).padStart(3, '0'),
    client: req.body.client,
    date: req.body.date,
    dueDate: req.body.dueDate,
    items: req.body.items,
    subtotal,
    tax: subtotal * 0.1,
    total: subtotal * 1.1,
    status: 'draft'
  };
  invoices.push(invoice);
  res.json({ success: true, data: invoice });
});

// Bills
app.get('/api/bills', (req, res) => {
  res.json({ success: true, data: bills });
});

// Reports
app.get('/api/reports/profit-loss', (req, res) => {
  const revenue = accounts.find(a => a.name === 'Sales Revenue')?.balance || 0;
  const expenses = accounts.filter(a => a.type === 'expense').reduce((sum, a) => sum + a.balance, 0);
  res.json({
    success: true,
    data: {
      revenue,
      expenses,
      netIncome: revenue - expenses,
      incomeAccounts: accounts.filter(a => a.type === 'income'),
      expenseAccounts: accounts.filter(a => a.type === 'expense')
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Serve Vue app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 BooksFlow server running on port ${PORT}`);
  console.log(`📊 Modern accounting with Vue.js 3 + Vite`);
});

# 📊 BooksFlow - Modern Accounting Software (Vue.js 3 + Vite)

<div align="center">

**Modern Accounting for Businesses - Built with Vue.js 3 + Vite**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Vue](https://img.shields.io/badge/Vue.js-3-42b883)
![Vite](https://img.shields.io/badge/Vite-5-646cff)

BooksFlow is a modern, intuitive accounting application built with Vue.js 3 Composition API and Vite.

[Website](https://booksflow.app) • [GitHub](https://github.com/Catalyst-thegoat/booksflow)

</div>

---

## ✨ Features

### 📊 Dashboard
- **Financial overview** - Revenue, expenses, net income at a glance
- **Asset tracking** - Total assets and liabilities
- **Quick stats** - Pending invoices and bills

### 📖 Journal Entries
- **Double-entry accounting** - Debits and credits
- **Chart of accounts** - Organize by type (asset, liability, income, expense)
- **Transaction history** - Full audit trail

### 🧾 Invoices & Bills
- **Create invoices** - Professional billing
- **Track bills** - Vendor payments
- **Status tracking** - Draft, Sent, Paid, Pending

### 📈 Financial Reports
- **Profit & Loss** - Income vs expenses
- **Balance Sheet** - Assets = Liabilities + Equity
- **Real-time calculations** - Always up to date

---

## 🚀 Quick Start

### Requirements
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Catalyst-thegoat/booksflow.git
cd booksflow

# Install dependencies
npm install

# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Start production server
npm start
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Vue.js 3 (Composition API) |
| **Build Tool** | Vite 5 |
| **State Management** | Pinia |
| **Routing** | Vue Router 4 |
| **Backend** | Node.js + Express |
| **API** | RESTful |

---

## 📁 Project Structure

```
booksflow/
├── src/
│   ├── components/       # Vue components
│   ├── views/           # Page views
│   ├── stores/          # Pinia stores
│   ├── router/          # Vue Router config
│   ├── App.vue          # Root component
│   ├── main.js          # Entry point
│   └── style.css        # Global styles
├── dist/                # Production build
├── server.js           # Express API server
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies
└── README.md          # Documentation
```

---

## 🎯 Development

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm start` | Start production server |

### Environment

The app uses environment-aware API configuration:
- Dev: API proxied to `http://localhost:3017`
- Production: API served by Express on same port

---

## 💼 Business Features

| Feature | Description |
|---------|-------------|
| Double-entry | Every transaction balanced |
| Chart of Accounts | Organized financial structure |
| Invoicing | Professional billing |
| Reporting | P&L and Balance Sheet |

---

## 🌐 Languages

| Language | Status |
|----------|--------|
| 🇺🇸 English | ✅ Full |
| 🌍 More | Coming soon |

---

## 📄 License

MIT License.

---

<div align="center">

**Accounting made simple** 📊

[⭐ Star on GitHub](https://github.com/Catalyst-thegoat/booksflow)

</div>

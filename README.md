# Enso DeFi Navigator

A web application for exploring and discovering DeFi tokens across multiple blockchain networks supported by Enso. 
Built with SvelteKit and powered by the Enso API.

![Enso DeFi Navigator Preview](https://github.com/EnsoBuild/defi-navigator/raw/main/preview.png)

## 🚀 Features

- **Token Search**: Filter tokens by multiple criteria including:
  - Token address
  - Underlying tokens
  - APY range (5-95%)
  - TVL (Total Value Locked)
  - Protocol and project
  - Token type (DeFi/Base)
  - Blockchain network
- **Search Interface**: Switch between visual filters and CLI-style search
- **Real-time Results**: Instant updates as you refine your search
- **Share Filters**: Generate shareable URLs for your token searches
- **Protocol Explorer**: Browse and explore DeFi protocols

## 🛠️ Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom theme
- **Icons**: [Lucide Svelte](https://lucide.dev/)
- **API**: [Enso Finance API](https://docs.enso.build/pages/api-reference/overview)
- **Language**: TypeScript


## Running locally

### Prerequisites

- Node.js 18+ and npm
- Modern web browser
- Internet connection

### Installation

1. Clone the repository:
```bash
git clone https://github.com/EnsoBuild/defi-navigator.git
cd defi-navigator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run Svelte checks

## Usage

### Visual Interface

1. Click the "Filter" button to open the dropdown
2. Select a filter type (Address, APY, TVL, etc.)
3. Enter your search criteria
4. Click "Add Filter" to apply
5. Results update automatically

### CLI Interface

1. Click the CLI toggle button to switch modes
2. Use filter syntax:
   ```
   apy>10                    # Find tokens with APY over 10%
   tvl>1000000              # Find tokens with TVL over $1M
   protocol:aave            # Filter by protocol
   chainId:1                  # Filter by Ethereum
   underlying:0x123...      # Filter by underlying token
   ```
3. Press CMD/CTRL+Enter to search

### Sharing

Click the Share button to copy a shareable URL with your current filters.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

## 📞 Support

- [Telegram Community](https://t.me/enso_shortcuts)
- [GitHub Issues](https://github.com/EnsoBuild/defi-navigator/issues)
- [Documentation](https://docs.enso.finance/)

## 🙏 Acknowledgments

Built with 🧡 by the Enso team and community.

---

<p align="center">Made with 🧡 by <a href="https://enso.finance">Enso</a></p>
# DeFi CDP Explorer

A Next.js application for exploring and managing Collateralized Debt Positions (CDPs) across different collateral types (ETH, WBTC, USDC).

## Features

- Web3 wallet integration with MetaMask
- Real-time CDP search and exploration
- Support for multiple collateral types
- Detailed CDP information including:
  - Collateralization ratio
  - Liquidation ratio
  - Maximum collateral withdrawal
  - Maximum additional debt
- Responsive design with dark/light mode support
- Client-side caching for improved performance

## Tech Stack

- Next.js 15.1
- TypeScript
- Web3.js
- Material-UI (MUI)
- React 19

## Getting Started

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser and connect your MetaMask wallet.

## Project Structure

```
src/
├── app/
│   ├── components/   # Reusable UI components
│   ├── context/      # React context providers
│   ├── hooks/        # Custom React hooks
│   ├── queries/      # Web3 data fetching logic
│   ├── utils/        # Helper functions
│   └── constants/    # Configuration and constants
```

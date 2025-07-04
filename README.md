# Cross-Chain Rewards Hub

Welcome to the **Cross-Chain Rewards Hub**, a decentralized application (dApp) built for the MetaMask Card Dev Cook-Off. This project enables users to unlock value from idle NFTs and tokens across Ethereum Sepolia and Polygon Amoy testnets, stake them to earn rewards, convert those rewards to USDC, and deposit them into a MetaMask wallet, simulating MetaMask Card spending.

By integrating **MetaMask SDK/DTK**, **Circle Wallets**, and **LI.FI SDK (CCTP V2)**, the project qualifies for all three $2,000 bonuses and aligns with the competition’s judging criteria:

| Criterion                  | Max Score |
|---------------------------|-----------|
| Real-World Relevance      | 25        |
| Creativity & Originality  | 20        |
| Functionality             | 20        |
| User Experience           | 15        |
| Potential Impact          | 20        |

---
## Architecture 
![image](https://github.com/user-attachments/assets/da6fe8c8-7a39-430c-b43d-64701368a261)

## 🧠 Project Overview

The Cross-Chain Rewards Hub addresses the challenge of idle digital assets scattered across blockchains. It aggregates NFTs and tokens, stakes them in a smart contract to generate rewards, converts rewards to USDC, and deposits them for real-world spending. 

**Bonus Gamification:** The dApp features a gamified experience, awarding bonus USDC for staking multiple assets to encourage deeper engagement.

---

## 🔑 Key Features

- **Wallet Connection:** MetaMask SDK for secure wallet authentication.
- **Asset Aggregation:** Use LI.FI SDK to fetch NFTs (ERC721) and tokens (ERC20) from Sepolia and Amoy testnets.
- **Staking:** Stake assets on Polygon Amoy with gasless transactions via MetaMask DTK (ERC-4337).
- **Reward Conversion:** Convert mock MATIC rewards to USDC using LI.FI’s cross-chain swaps.
- **USDC Deposit:** Transfer USDC to a developer-controlled Circle Wallet, then to MetaMask wallet.
- **Gamification:** Bonus USDC for staking ≥2 assets, with on-screen notifications.

---

## 🎥 Demo Video

Watch our 2-minute demo (link to be added) to see:
- Wallet connection
- Staking assets
- Claiming rewards
- Cross-chain USDC conversion
- Gamified reward bonuses

---

## 🧰 Tech Stack

- **Frontend:** React + Tailwind CSS
- **Smart Contracts:** Solidity (v0.8.0+) using Hardhat
- **Blockchains:**
  - Ethereum Sepolia (ID: 11155111) – for USDC deposit
  - Polygon Amoy (ID: 80002) – for staking & rewards

### Integrations
- **MetaMask SDK/DTK** – Wallet connection + ERC-4337 gasless transactions
- **Circle Wallets** – Secure USDC storage + transfer
- **LI.FI SDK (CCTP V2)** – Cross-chain swaps and asset aggregation

### Libraries & Hosting
- **ethers.js**, **OpenZeppelin**
- **Frontend:** Vercel
- **Smart Contracts:** Polygon Amoy

---

## 🧪 Judging Criteria Alignment

| Criterion               | Alignment |
|------------------------|-----------|
| **Real-World Relevance** | Monetizes idle assets for spending via MetaMask Card |
| **Creativity**          | Unique blend of staking, cross-chain swaps, and gamified rewards |
| **Functionality**       | Complete flow from connection to deposit |
| **User Experience**     | Clean UI, staking flow, PIN-based Circle Wallets UX |
| **Scalability**         | Expandable to mainnets and more chains |

---

## 💰 Bonus Tool Usage

- **MetaMask SDK/DTK ($2,000)**: Wallet integration and gasless staking via ERC-4337
- **Circle Wallets ($2,000)**: USDC management and PIN-authenticated wallets
- **LI.FI SDK ($2,000)**: Asset aggregation and cross-chain USDC swaps

---

## ⚙️ Prerequisites

- Node.js (v16+)
- MetaMask (browser or mobile)
- Hardhat
- API Keys:
  - Circle Wallets
  - LI.FI (optional)
  - Infura (Sepolia/Amoy)
- Testnet Funds (USDC/NFTs):  
  - [Sepolia Faucet](https://sepoliafaucet.com)  
  - [Polygon Amoy Faucet](https://faucet.polygon.technology/)

---

## 📦 Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/cross-chain-rewards-hub.git
cd cross-chain-rewards-hub
```
### Install Frontend Dependencies
```
cd frontend
npm install
```
### Install Contract Dependencies
```
cd ../contracts
npm install
```
### 🔐 Configure API Keys
Create frontend/src/config.js:
```
export const CIRCLE_API_KEY = "your_circle_api_key";
export const LIFI_API_KEY = "your_lifi_api_key"; // Optional
export const INFURA_API_KEY = "your_infura_api_key";
export const PRIVATE_KEY = "your_wallet_private_key";
export const STAKING_CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
export const USDC_TOKEN_ADDRESS = "0xYourTestUSDCTokenAddress";
```
### 🛠️ Configure Hardhat
In hardhat.config.js:
```
module.exports = {
  solidity: "0.8.0",
  networks: {
    amoy: {
      url: `https://polygon-amoy.infura.io/v3/your_infura_api_key`,
      accounts: ["your_wallet_private_key"]
    }
  }
};
```
### 🚀 Smart Contract Deployment
```
npx hardhat compile
```
Deploy to Polygon Amoy
```
npx hardhat run scripts/deploy.js --network amoy
```
### 🌐 Running the Frontend
```
cd frontend
npm start
```
- App opens at http://localhost:3000

- Connect MetaMask (Sepolia or Amoy)

- Use test tokens/NFTs to try the flow
### 🔑 API Key Usage
circle Wallet
```
import { CIRCLE_API_KEY } from './config';
const { initiateDeveloperControlledWalletsClient } = require('@circle-fin/developer-controlled-wallets');
const client = initiateDeveloperControlledWalletsClient({ apiKey: CIRCLE_API_KEY });

const walletSetResponse = await client.createWalletSet({ name: 'RewardsHubWalletSet' });
const walletResponse = await client.createWallets({
  blockchains: ['ETH-SEPOLIA'],
  count: 1,
  walletSetId: walletSetResponse.data?.walletSet?.id
});
```
LI.FI SDK
```
import { LIFI_API_KEY } from './config';
const LiFi = require('@lifi/sdk').default;
const lifi = new LiFi({ integrator: 'rewards-hub', apiKey: LIFI_API_KEY || '' });
const assets = await lifi.getWalletAssets({ address: '0xUserAddress', chainId: 11155111 });
```
Infura
```
import { INFURA_API_KEY } from './config';
const ethers = require('ethers');
const provider = new ethers.providers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
);
```
### 🧪 Testing
Testnets: Sepolia + Amoy

Test Cases:

Wallet connect + asset display

Stake NFT/token (gasless)

Claim + swap rewards to USDC

Check bonus reward for ≥2 stakes

Tools
Hardhat Tests: npx hardhat test

Frontend Tests (Jest): npm test
### 🚧 Limitations & 🔮 Future Enhancements
Known Limitations
MetaMask Card is simulated due to Linea testnet issues

Some Circle Wallets functionality may be mocked

Hardcoded API keys (temporary for hackathon)

### Future Work
Linea mainnet deployment

Add support for Arbitrum, Optimism, etc.

Reward leaderboard and tiers

Add wallet analytics, history, and performance charts
### 🙏 Acknowledgments
MetaMask: Wallet SDK & DTK

Circle: Web3 USDC Wallets

LI.FI: Cross-chain infra

OpenZeppelin: Secure smart contract templates



Thanks for reviewing the Cross-Chain Rewards Hub! 🚀


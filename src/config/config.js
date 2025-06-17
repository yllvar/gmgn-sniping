require('dotenv').config();

module.exports = {
  API_HOST: 'https://gmgn.ai',
  SOLANA_RPC: process.env.SOLANA_RPC || 'https://api.mainnet-beta.solana.com',
  WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  PUMP_FUN_PROGRAM: '6EF8rrecthR5Dkzon8N9uExB6uM9N2ksFz4rQ8rDhedG',
  MIN_LIQUIDITY: 100, // SOL
  MAX_DEV_HOLDINGS: 5, // %
  DEFAULT_AMOUNT: 0.5, // SOL
  DEFAULT_SLIPPAGE: 0.5, // 50%
  PRIORITY_FEE: 0.002 // SOL
};

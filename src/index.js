const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');
const { WALLET_PRIVATE_KEY } = require('./config/config');
const { startTelegramMonitor } = require('./signals/telegram');
const { startSolanaLogMonitor } = require('./signals/solanaLogs');
const { snipeToken } = require('./trading/snipe');
const logger = require('./utils/logger');

// Initialize wallet from private key
const wallet = Keypair.fromSecretKey(bs58.decode(WALLET_PRIVATE_KEY));

async function main() {
  logger.info('Starting GMGN Sniping Bot...');
  
  // Start Telegram signal monitoring
  startTelegramMonitor((tokenAddress) => snipeToken(wallet, tokenAddress));
  
  // Start Solana log monitoring
  startSolanaLogMonitor((tokenAddress) => snipeToken(wallet, tokenAddress));
}

// Start the bot and handle errors
main().catch((error) => {
  logger.error('Fatal error:', error);
  process.exit(1);
});

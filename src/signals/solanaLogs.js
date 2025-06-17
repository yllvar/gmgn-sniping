const { Connection, PublicKey } = require('@solana/web3.js');
const { SOLANA_RPC, PUMP_FUN_PROGRAM } = require('../config/config');
const logger = require('../utils/logger');

const connection = new Connection(SOLANA_RPC, 'confirmed');

function startSolanaLogMonitor(onNewToken) {
  connection.onLogs(new PublicKey(PUMP_FUN_PROGRAM), async (logs) => {
    try {
      const tokenAddress = extractTokenAddressFromLogs(logs);
      if (tokenAddress) {
        logger.info(`Detected new pool via logs: ${tokenAddress}`);
        onNewToken(tokenAddress);
      }
    } catch (error) {
      logger.error('Error processing logs:', error);
    }
  }, 'confirmed');
}

function extractTokenAddressFromLogs(logs) {
  // Placeholder: Parse Pump.fun logs for token mint address
  // This should be implemented with actual log parsing logic
  return logs.logs.find(l => l.includes('initialize')) ? 'NEW_MEMECOIN_ADDRESS' : null;
}

module.exports = { startSolanaLogMonitor };

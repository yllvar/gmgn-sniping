const fetch = require('node-fetch');
const { Connection, VersionedTransaction } = require('@solana/web3.js');
const { API_HOST, SOLANA_RPC, PRIORITY_FEE } = require('../config/config');
const logger = require('./logger');

const connection = new Connection(SOLANA_RPC, 'confirmed');

async function executeTrade(wallet, tokenAddress, amount, slippage) {
  try {
    const quoteUrl = `${API_HOST}/defi/router/v1/sol/tx/get_swap_route?token_in_address=So11111111111111111111111111111111111111112&token_out_address=${tokenAddress}&in_amount=${amount}&from_address=${wallet.publicKey.toBase58()}&slippage=${slippage}&priority_fee=${PRIORITY_FEE}`;
    const response = await fetch(quoteUrl);
    const route = await response.json();

    if (!route.data?.raw_tx?.swapTransaction) {
      logger.error(`No swap transaction for ${tokenAddress}: ${route.message || 'Unknown error'}`);
      return null;
    }

    const swapTransactionBuf = Buffer.from(route.data.raw_tx.swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    transaction.sign([wallet]);

    const serializedTx = transaction.serialize({ requireAllSignatures: true });
    const signedTx = Buffer.from(serializedTx).toString('base64');

    const submitUrl = `${API_HOST}/defi/router/v1/sol/tx/submit`;
    const submitResponse = await fetch(submitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tx: signedTx, priorityFee: PRIORITY_FEE })
    });
    const result = await submitResponse.json();

    if (result.success) {
      const signature = result.data.signature;
      await connection.confirmTransaction(signature, 'confirmed');
      logger.info(`Bought ${amount} SOL of ${tokenAddress}: ${signature}`);
      return signature;
    } else {
      logger.error(`Failed to submit transaction for ${tokenAddress}: ${result.message}`);
      return null;
    }
  } catch (error) {
    logger.error(`Error executing trade for ${tokenAddress}:`, error);
    return null;
  }
}

module.exports = { executeTrade };

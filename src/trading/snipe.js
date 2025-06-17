const { PublicKey } = require('@solana/web3.js');
const { checkTokenEligibility } = require('../utils/tokenEligibility');
const { executeTrade } = require('../utils/transaction');
const { setLimitOrders } = require('../utils/limitOrders');
const { DEFAULT_AMOUNT, DEFAULT_SLIPPAGE } = require('../config/config');
const logger = require('../utils/logger');

async function snipeToken(wallet, tokenAddress, amount = DEFAULT_AMOUNT, slippage = DEFAULT_SLIPPAGE) {
  try {
    if (!PublicKey.isOnCurve(tokenAddress)) {
      logger.error('Invalid token address:', tokenAddress);
      return;
    }

    const eligibility = await checkTokenEligibility(tokenAddress);
    if (!eligibility.eligible) {
      logger.warn(`Token ${tokenAddress} failed eligibility: Liquidity=${eligibility.liquidity}, DevHoldings=${eligibility.devHoldings}%`);
      return;
    }

    const signature = await executeTrade(wallet, tokenAddress, amount, slippage);
    if (signature) {
      await setLimitOrders(tokenAddress, amount);
    }
  } catch (error) {
    logger.error(`Error sniping ${tokenAddress}:`, error);
  }
}

module.exports = { snipeToken };

const { Telegraf } = require('telegraf');
const { TELEGRAM_BOT_TOKEN } = require('../config/config');
const logger = require('./logger');

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

async function setLimitOrders(tokenAddress, amount) {
  try {
    const takeProfitPrice = amount * 3; // 3x target
    const stopLossPrice = amount * 0.8; // 20% stop-loss
    
    // Send take-profit order
    await bot.telegram.sendMessage(
      '@GMGN_sol_bot',
      `/create limitsell ${tokenAddress} ${takeProfitPrice} -exp 3600`
    );
    
    // Send stop-loss order
    await bot.telegram.sendMessage(
      '@GMGN_sol_bot',
      `/create limitsell ${tokenAddress} ${stopLossPrice} -exp 3600`
    );
    
    logger.info(`Set take-profit at ${takeProfitPrice} and stop-loss at ${stopLossPrice} for ${tokenAddress}`);
  } catch (error) {
    logger.error(`Error setting limit orders for ${tokenAddress}:`, error);
  }
}

module.exports = { setLimitOrders };

const { Telegraf } = require('telegraf');
const { TELEGRAM_BOT_TOKEN } = require('../config/config');
const logger = require('../utils/logger');

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

function startTelegramMonitor(onNewToken) {
  bot.on('text', async (ctx) => {
    const message = ctx.message.text;
    if (message.includes('New Pool')) { // Adjust based on GMGN’s alert format
      const tokenAddress = extractTokenAddress(message);
      if (tokenAddress) {
        logger.info(`Detected new pool: ${tokenAddress}`);
        onNewToken(tokenAddress);
      }
    }
  });

  bot.launch().then(() => logger.info('Telegram bot running...'));
  process.on('SIGINT', () => bot.stop('SIGINT'));
  process.on('SIGTERM', () => bot.stop('SIGTERM'));
}

function extractTokenAddress(message) {
  const regex = /[A-Za-z0-9]{32,44}/;
  return message.match(regex)?.[0] || null;
}

module.exports = { startTelegramMonitor };

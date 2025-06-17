const log = (level, message, ...args) => {
  console[level](`[${new Date().toISOString()}] ${level.toUpperCase()}: ${message}`, ...args);
};

module.exports = {
  info: (message, ...args) => log('info', message, ...args),
  error: (message, ...args) => log('error', message, ...args),
  warn: (message, ...args) => log('warn', message, ...args)
};

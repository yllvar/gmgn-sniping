const fetch = require('node-fetch');
const { API_HOST } = require('../config/config');

async function checkTokenEligibility(tokenAddress) {
  try {
    const securityCheckUrl = `${API_HOST}/defi/sol/${tokenAddress}/security`;
    const securityResponse = await fetch(securityCheckUrl);
    const securityData = await securityResponse.json();

    const liquidity = await getLiquidity(tokenAddress);
    const devHoldings = securityData.dev_wallet_percentage || 10;
    const isSafe = securityData.is_safe || false;

    return {
      eligible: liquidity > 100 && devHoldings < 5 && isSafe,
      liquidity,
      devHoldings
    };
  } catch (error) {
    console.error(`Error checking eligibility for ${tokenAddress}:`, error);
    return { eligible: false };
  }
}

async function getLiquidity(tokenAddress) {
  // Integrate with Raydium/Dexscreener API
  return 150; // Mock value for initial testing
}

module.exports = { checkTokenEligibility };

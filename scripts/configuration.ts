import { ZERO_ADDRESS } from './consts';
import { toWei } from './helper';
import { calculateParameters } from './param-helper';

/**
 * @dev The following parameters are used to calculate the market deployment params
 * @minApy and @maxApy are the minimum and maximum APY of the interest bearing asset
 * @startTimestamp and @endTimestamp are the start and end time of the market
 */
const minApy = 0.0; // 0%
const maxApy = 0.06; // 6%
const startTimestamp = 1690848000;
const endTimestamp = 1727308800;

export const MarketConfiguration = {
    name: 'SY swETH-BbAWeth_BalancerLP Aura',
    symbol: 'SY-swETH-BbAWeth_BalancerLP Aura',
    doCacheIndex: true,
    expiry: endTimestamp,
    ...calculateParameters(minApy, maxApy, startTimestamp, endTimestamp),
};

// address(0) is native
// Either you can put the address of the ERC20 underlying token here
export const UNDERLYING_TO_SEED_LIQUIDITY = ZERO_ADDRESS;

// We highly recommend you to put only very minimal amount to seed liquidity
// The rest of the liquidity should be seeded through our UI
// where you have better slippage control

// The toWei function multiply your input with 10^18 by default
// So do consider using customized amount (BN.from(10).pow(6) for example) for other cases
export const AMOUNT_TO_SEED = toWei(0.01);

# Pendle Market Deployer

This repository uses swETH as an example for developing/deploying a SY (EIP-5115) onto Pendle system.

## ENV preparation

In order to run the deployment script, it is required to create a `.env` file containing these two fields as in `.env_example`:
```
ETHERSCAN_KEY=...
PRIVATE_KEY=...
```

**Note**: `ETHERSCAN_KEY` should match the block explorer key of the network you are deploying.

## Deployment

### Set up

This repository runs in yarn environment so this step is as simple as running:

```
yarn install
```

### Contract and Parameters preparation


#### SY contract
First step is to get your contract ready inside `./contracts/` folder as we currently have `./contracts/SwETHSY.sol`.

Next, you will prepare the deploy implementation for your SY contract in `./scripts/deploy-sy.ts`. Below is an example of SwETHSY deployment.

```ts
/**
 * @dev This function aims to deploy your SY contract
 * @dev The below implementation show how to deploy a SwETH SY contract
 *
 * To deploy your own SY contract, you need to:
 * - Change the contract name / type name in "deploy<YOUR_CONTRACT_NAME>(deployer, 'YOUR_CONTRACT_NAME', [...])"
 * - Change the deployment params to match your constructor arguments
 */
export async function deploySY(deployer: SignerWithAddress): Promise<IStandardizedYield> {
    const sy = await deploy<SwETHSY>(deployer, 'SwETHSY', [
        MarketConfiguration.name,
        MarketConfiguration.symbol,
        '0xf951E335afb289353dc249e82926178EaC7DEd78', // SWETH address
    ]);

    return await getContractAt<IStandardizedYield>('IStandardizedYield', sy.address);
}
```

#### Parameters

Once you are done with SY deploy implementation, you will have to fill in the parameters for the following parameters corresponding to your interest bearing token:
```ts
/**
 * @dev The following parameters are used to calculate the market deployment params
 * @minApy and @maxApy are the minimum and maximum APY of the interest bearing asset
 * @startTimestamp and @endTimestamp are the start and end time of the market 
 */
const minApy = 0.01; // 1%
const maxApy = 0.05; // 5%
const startTimestamp = 1689206400;
const endTimestamp = 1750896000;

export const MarketConfiguration = {
    name: 'SY swETH',
    symbol: 'SY-swETH',
    doCacheIndex: true,
    expiry: endTimestamp,
    ...calculateParameters(minApy, maxApy, startTimestamp, endTimestamp),
};
```

The remaining three fields in MarketConfiguration are `name`, `symbol` (quite straight-forward) and `doCacheIndex`. For `doCacheIndex`, we usually leave it as `true` for ethereum mainnet deployment and `false` for any other chain to save gas for PT/YT related transactions. 

### Run deployment script

After contracts and parameters are ready, here are the steps to deploy:
```
yarn hardhat clean
yarn hardhat compile
yarn hardhat run scripts/deploy.ts --network <YOUR_NETWORK_NAME>
```

The first two commands will ensure that your contract verification runs through without any error.

Once the script is done, you should find your deployment result in `./deployments` folder.


## Seed liquidity

This step is only to ensure your market has minimum liquidity before you can actually seed a considerable amount of liquidity on Pendle UI. Please only proceed this step with the amount of liquidity you afford to lose.

### Parameters preparation

Inside `./scripts/seed-liquidity.ts`, make sure the import in line 6 is point to your according deployment output file, in case of swETH, it should be:
```ts
import marketAddresses from '../deployments/SY-swETH.json';
```

Inside `./scripts/configuration.ts`, please fill in the parameters for these two variables:

```ts
// address(0) is native
// Either you can put the address of the ERC20 underlying token here
export const UNDERLYING_TO_SEED_LIQUIDITY = ZERO_ADDRESS;

// We highly recommend you to put only very minimal amount to seed liquidity
// The rest of the liquidity should be seeded through our UI
// where you have better slippage control

// The toWei function multiply your input with 10^18 by default
// So do consider using customized amount (BN.from(10).pow(6) for example) for other cases
export const AMOUNT_TO_SEED = toWei(0.01);
```

### Run script

```
yarn hardhat run scripts/seed-liquidity.ts --network <YOUR_NETWORK_NAME>
```

## Final notes

We highly recommend you to use a stable RPC with good nonce management for the deployment. Otherwise sending two transactions in a row could result in transaction replacement. 

The current script has already put a delay between any two transactions being sent but sometime it is still not enough on bad RPC.

Please contact us if you run into any problem.
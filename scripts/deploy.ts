import { ethers } from 'hardhat';
import { JSONReplacerBigNum, delay, deploy, getPendleContracts } from './helper';
import { MarketConfiguration } from './configuration';
import fs from 'fs';
import path from 'path';
import { SAFE_WAIT_TIME } from './consts';
import { deploySY } from './deploy-sy';

async function main() {
    const [deployer] = await ethers.getSigners();

    const pendleContracts = await getPendleContracts();

    const sy = await deploySY(deployer);

    await delay(SAFE_WAIT_TIME, 'before deploying PT/YT');

    const [PT, YT] = await pendleContracts.yieldContractFactory.callStatic.createYieldContract(
        sy.address,
        MarketConfiguration.expiry,
        MarketConfiguration.doCacheIndex
    );

    await pendleContracts.yieldContractFactory.createYieldContract(
        sy.address,
        MarketConfiguration.expiry,
        MarketConfiguration.doCacheIndex
    );

    await delay(SAFE_WAIT_TIME, 'before deploying markets');

    const market = await pendleContracts.marketFactory.callStatic.createNewMarket(
        PT,
        MarketConfiguration.scalarRoot,
        MarketConfiguration.initialRateAnchor
    );

    await pendleContracts.marketFactory.createNewMarket(
        PT,
        MarketConfiguration.scalarRoot,
        MarketConfiguration.initialRateAnchor
    );
    await delay(SAFE_WAIT_TIME, 'after create market');

    // approve inf tokenIns for the path of pendle router -> sy address
    await pendleContracts.router.approveInf([
        {
            tokens: await sy.getTokensIn(),
            spender: sy.address,
        },
    ]);

    fs.writeFileSync(
        path.resolve(__dirname, '../deployments', `${MarketConfiguration.symbol}.json`),
        JSON.stringify(
            {
                ...MarketConfiguration,
                SY: sy.address,
                PT,
                YT,
                market,
            },
            JSONReplacerBigNum,
            4
        )
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

//synchronous action creator
import {ethers} from "ethers";
import {balanceOfABI, PAIR_ABI, PAIR_CONTRACT_ADDRESS, PAIR_FACTORY_ABI} from "../config";
import {collect} from "collect.js";
import {BigNumber} from '@ethersproject/bignumber';
import {cryptoCoinsEnum} from "../staticData";
import {getNumberValue, getNumberValueForTest} from "../helper";

const Tag = 'action';
const fetchPostsSuccess = data => ({
    type: 'FETCH_POOL_DATA',
    payload: {data}
})

function assignTokenPrice(address){
    if(address === cryptoCoinsEnum.usdc.address || address === cryptoCoinsEnum.note.address){
        return 1;
    } else if (address === cryptoCoinsEnum.wcanto.address){
        return 0.30;
    } else if (address == cryptoCoinsEnum.atom.address){
        return 13;
    } else return 0;

}

export const fetchPoolData = (pairs) => {
    return async dispatch => {
        try {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = web3Provider.getSigner();
            const contract = new ethers.Contract(PAIR_CONTRACT_ADDRESS, PAIR_FACTORY_ABI, web3Provider);
            const systemTokens = collect(collect(cryptoCoinsEnum).values());
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            let data = []
            let totalPoolAmount = [];
            let userWalletBalance = [];
            let userPoolAmount = [];
            let sharePer = [];
            let token1Claim = BigNumber.from(0);
            let token2Claim = BigNumber.from(0);
            for (const i of pairs) {
                const LpAddress = await contract.allPairs(i);
                const poolContract = new ethers.Contract(LpAddress, PAIR_ABI, web3Provider);
                const LpBalanceContractToken = new ethers.Contract(LpAddress, balanceOfABI, web3Provider);
                const LpBalance = await LpBalanceContractToken.balanceOf(accounts[0]);
                const LpTotalSupply = await LpBalanceContractToken.totalSupply();
                const LpBalanceFinal = LpBalance.toString();
                const LpTotalSupplyFinal = LpTotalSupply.toString();
                const poolSymbol = await poolContract.symbol();
                const poolTokens = await poolContract.tokens();
                const isStable = await poolContract.stable();
                // @todo this is unsafe and bad
                // eslint-disable-next-line no-loop-func
                await poolContract.connect(signer).callStatic.claimFees().then((response) => {
                    token1Claim = response.claimed0;
                    token2Claim = response.claimed1;
                });
                const token1 = systemTokens.where('address',poolTokens[0]).first();
                const token2 = systemTokens.where('address',poolTokens[1]).first();

                const share = LpBalanceFinal/LpTotalSupplyFinal;
                const tokenNames = poolSymbol.split('-')[1].split('/');
                // Token 1
                const erc20ContractToken1 = new ethers.Contract(poolTokens[0], balanceOfABI, web3Provider);
                const poolAmountToken1 = await erc20ContractToken1.balanceOf(LpAddress);
                const walletAmountToken1 = await erc20ContractToken1.balanceOf(accounts[0]);
                const decimal1 = (token1 === undefined) ? 18 : token1.decimal;
                userWalletBalance[poolTokens[0]] = getNumberValue(walletAmountToken1,decimal1);
                userPoolAmount[poolTokens[0]] = getNumberValue(share * poolAmountToken1,decimal1);
                totalPoolAmount[poolTokens[0]] = getNumberValue(poolAmountToken1,decimal1);
                sharePer[poolTokens[0]] = 0;

                // Token 2
                const erc20ContractToken2 = new ethers.Contract(poolTokens[1], balanceOfABI, web3Provider);
                const poolAmountToken2 = await erc20ContractToken2.balanceOf(LpAddress);
                const walletAmountToken2 = await erc20ContractToken2.balanceOf(accounts[0]);
                const decimal2 = (token2 === undefined) ? 18 : token2.decimal;
                userWalletBalance[poolTokens[1]] = getNumberValue(walletAmountToken2,decimal2);
                userPoolAmount[poolTokens[1]] = getNumberValue(share * poolAmountToken2,decimal2);
                totalPoolAmount[poolTokens[1]] = getNumberValue(poolAmountToken2,decimal2);
                sharePer[poolTokens[1]] = 0;

                const token1EconomicValue = assignTokenPrice(poolTokens[0]);
                const token2EconomicValue = assignTokenPrice(poolTokens[1]);

                const tvlForPool = (getNumberValue(poolAmountToken1,decimal1) * token1EconomicValue) +
                    (getNumberValue(poolAmountToken2,decimal2) * token2EconomicValue);
                const singleLp = {
                    pairName: poolSymbol,
                    isStable: isStable,
                    token1Name: tokenNames[0].toLowerCase(),
                    token2Name: tokenNames[1].toLowerCase(),
                    pairAddress: LpAddress,
                    tvl: tvlForPool,
                    slug: (isStable ? 'stable' : 'volatile') + '-' + tokenNames[0].toLowerCase() + '-' + tokenNames[1].toLowerCase(),
                    address: {
                        token1: poolTokens[0],
                        token2: poolTokens[1]
                    },
                    wallet: {
                        token1: userWalletBalance[poolTokens[0]] || 0,
                        token2: userWalletBalance[poolTokens[1]] || 0
                    },
                    myPool: {
                        token1:  userPoolAmount[poolTokens[0]].toString(),
                        token2:  userPoolAmount[poolTokens[1]].toString()
                    },
                    totalPool: {
                        token1: totalPoolAmount[poolTokens[0]] || 0,
                        token2: totalPoolAmount[poolTokens[1]] || 0
                    },
                    apr: {
                        token1: sharePer[poolTokens[0]] || 0,
                        token2: sharePer[poolTokens[1]] || 0
                    },
                    claim: {
                        token1: token1Claim.toString(),
                        token2: token2Claim.toString()
                    },
                    share: (share*100).toFixed(4),
                    userLpBalance: LpBalanceFinal>0 ? getNumberValueForTest(LpBalanceFinal) : getNumberValue(LpBalanceFinal)
                }
                data.push(singleLp)
            }
            dispatch(fetchPostsSuccess(data)) //store first five posts
        }
        catch(e){
            console.log(e)
        }
    }
}
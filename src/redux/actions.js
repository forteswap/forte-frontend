//synchronous action creator
import {ethers} from "ethers";
import {balanceOfABI, PAIR_ABI, PAIR_CONTRACT_ADDRESS, PAIR_FACTORY_ABI} from "../config";
import {collect} from "collect.js";
import {cryptoCoinsEnum} from "../staticData";
import {getNumberValue, getNumberValueForTest} from "../helper";

const Tag = 'action';
const fetchPostsSuccess = data => ({
    type: 'FETCH_POOL_DATA',
    payload: {data}
})

export const fetchPoolData = (pairs) => {
    return async dispatch => {
        try {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(PAIR_CONTRACT_ADDRESS, PAIR_FACTORY_ABI, web3Provider);
            const systemTokens = collect(collect(cryptoCoinsEnum).values());
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            let data = []
            let totalPoolAmount = [];
            let userWalletBalance = [];
            let userPoolAmount = [];
            let sharePer = [];
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
                console.log(poolAmountToken1.toString());

                const token1EconomicValue = poolTokens[0] == 0x826551890Dc65655a0Aceca109aB11AbDbD7a07B ? 0.30 : 0 
                const token2EconomicValue = poolTokens[1] == 0xdE59F060D7ee2b612E7360E6C1B97c4d8289Ca2e ? 1 : 0
                const tvlForPool = (poolAmountToken1.toString() * token1EconomicValue) + (poolAmountToken2.toString() * token2EconomicValue);
                const singleLp = {
                    pairName: poolSymbol,
                    isStable: isStable,
                    token1Name: tokenNames[0].toLowerCase(),
                    token2Name: tokenNames[1].toLowerCase(),
                    pairAddress: LpAddress,
                    lpTotalSupplyF: Number(tvlForPool),
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
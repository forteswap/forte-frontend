import {CHUNK_SIZE, CONTRACT_ADDRESS, DEADLINE_MINUTES, PAIR_CONTRACT_ADDRESS, PAIR_FACTORY_ABI} from "./config.js";
import {cryptoCoinsEnum} from "./staticData.js";
import { toast } from 'react-toastify';
import {ethers} from "ethers";
import {batch} from "react-redux";
import store from "./redux/store.js";
import {fetchPoolData} from "./redux/actions.js";

export function displayMessage(message) {
    // Snackbar.show({text: message, pos: 'top-center', backgroundColor : '#00ff721f',actionTextColor: '#28c76f', duration: 6000});
}

export const displayErrorMessage = (message) => toast.error(message, {theme: 'dark', position: 'bottom-right', style: {backgroundColor: 'rgb(39, 43, 131)'}});

export function getNumberValue(value, decimal = 18) {
    if(value !== 0){
        return parseFloat((value.toString() / Math.pow(10,decimal)).toFixed(6))
    }
    return 0;
}

export function getNumberValueForTest(value,decimal= 18) {
    if(value !== 0){
        // return new ethers.utils.parseEther(value)
        return (value.toString() / Math.pow(10,decimal)).toFixed(18)
    }
    return 0;
}

export async function isTokenApproved(contract, owner, spender = CONTRACT_ADDRESS) {
    const checkAllowance = await contract.allowance(owner, spender);
    return getNumberValue(checkAllowance,18) > 0
}

export const getEstimatedPriceImpact = (amountIn, tinyAmountIn, amountOut, tinyAmountOut, decimalsA, decimalsB) => {
    const getParsedPricePerUnit = (amountA, amountB, decimalsA, decimalsB) => {
        return ethers.utils.parseUnits(amountA.toString(), decimalsA) / ethers.utils.parseUnits(amountB.toString(), decimalsB);
    }

    const pricePerUnit = getParsedPricePerUnit(amountOut, amountIn, decimalsB, decimalsA);
    const tinyPricePerUnit = getParsedPricePerUnit(tinyAmountOut, tinyAmountIn, decimalsB, decimalsA);

    let priceImpactPercent = Number(((tinyPricePerUnit - pricePerUnit) / tinyPricePerUnit * 100).toLocaleString(undefined, {maximumFractionDigits: 2}))

    if(isNaN(priceImpactPercent) || priceImpactPercent <= 0) priceImpactPercent = 0;

    let severity;

    switch (true) {
        case priceImpactPercent > 1 && priceImpactPercent < 5:
            severity = 2
            break;
        case priceImpactPercent >= 5:
            severity = 3
            break;
        default:
            severity = 1
    }

    return {
        priceImpactPercent,
        severity
    }
}

export const getPoolData = async () => {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = web3Provider.getSigner();
    const contract = new ethers.Contract(PAIR_CONTRACT_ADDRESS, PAIR_FACTORY_ABI, web3Provider);
    const totalPairs = await contract.connect(signer).allPairsLength();
    const totalPool = Array.from(Array(totalPairs.toNumber()),(_, i) => i);
    const chunkSize = CHUNK_SIZE;
    batch(() => {
        for (let i = 0; i < totalPairs; i += chunkSize) {
            const chunk = totalPool.slice(i, i + chunkSize);
            store.dispatch(fetchPoolData(chunk))
        }
    })
}

export const roundDown = (number, decimals = 18) => {
   const value = ethers.utils.formatUnits(number, decimals);
   let index = value.indexOf(".");
    return value.substring(0, index+4);
}

export const roundDownForSwap = (number, decimals = 18, displayDecimal = 6) => {
    const value = ethers.utils.formatUnits(number, decimals);
    let index = value.indexOf(".");
    return value.substring(0, index+displayDecimal);
}

export const roundDownAndParse = (number, decimals = 18) => {
    let index = number.indexOf(".");
    return ethers.utils.parseUnits(number.substring(0, index+(decimals+1)), decimals);
}

export const getTokenData = (token) => {
    if(!(token in cryptoCoinsEnum)){
        return {
            icon: "question.png",
            name: token.toUpperCase(),
            decimal: 18,
            stable:false,
        };
    }else{
        return cryptoCoinsEnum[token]
    }
}

export const getDeadline = (minutes = DEADLINE_MINUTES) => {
    return Math.round(new Date(new Date().getTime() + minutes * 60000) / 1000);
}


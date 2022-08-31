import {CHUNK_SIZE, CONTRACT_ADDRESS, DEADLINE_MINUTES, PAIR_CONTRACT_ADDRESS, PAIR_FACTORY_ABI} from "./config";
import {cryptoCoinsEnum, modalTypesEnum} from "./staticData";
import {ethers} from "ethers";
import {batch} from "react-redux";
import store from "./redux/store";
import {fetchPoolData} from "./redux/actions";
import {useGlobalModalContext} from "./components/modal/GlobalModal";

const Snackbar = require('node-snackbar');

export function displayMessage(message) {
    Snackbar.show({text: message, pos: 'top-center', backgroundColor : '#00ff721f',actionTextColor: '#28c76f', duration: 6000});
}

export function displayErrorMessage(message) {
    Snackbar.show({text: message, pos: 'top-center', backgroundColor : '#f910111f', actionTextColor: '#ea5455', duration: 6000});
}

export function getNumberValue(value,decimal= 18,isWallet) {
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

export const roundDownForSwap = (number, decimals = 18) => {
    const value = ethers.utils.formatUnits(number, decimals);
    let index = value.indexOf(".");
    return value.substring(0, index+6);
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

import {CONTRACT_ADDRESS, PAIR_CONTRACT_ADDRESS, PAIR_FACTORY_ABI} from "./config";
import {cryptoCoinsEnum} from "./staticData";
import {ethers} from "ethers";
import {batch} from "react-redux";
import store from "./redux/store";
import {fetchPoolData} from "./redux/actions";

const Snackbar = require('node-snackbar');

export function displayMessage(message) {
    Snackbar.show({text: message, pos: 'top-center', backgroundColor : '#00ff721f',actionTextColor: '#28c76f', duration: 6000});
}

export function displayErrorMessage(message) {
    Snackbar.show({text: message, pos: 'top-center', backgroundColor : '#f910111f', actionTextColor: '#ea5455', duration: 6000});
}

export function getNumberValue(value,decimal= 18) {
    if(value !== 0){
        return parseFloat((value.toString() / Math.pow(10,decimal)).toFixed(3))
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

export async function getTokenImage(token){
    return Object.keys(cryptoCoinsEnum).includes(token) ? cryptoCoinsEnum[token].icon : "question.png";
}

export const getPoolData = async () => {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = web3Provider.getSigner();
    const contract = new ethers.Contract(PAIR_CONTRACT_ADDRESS, PAIR_FACTORY_ABI, web3Provider);
    const totalPairs = await contract.connect(signer).allPairsLength();
    const totalPool = Array.from(Array(totalPairs.toNumber()),(_, i) => i);
    const chunkSize = 4;
    batch(() => {
        for (let i = 0; i < totalPairs; i += chunkSize) {
            const chunk = totalPool.slice(i, i + chunkSize);
            store.dispatch(fetchPoolData(chunk))
        }
    })
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
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Container,
    Modal,
    ModalBody, ModalFooter,
    ModalHeader,
    Row
} from "reactstrap";
import Input from "../../components/NumericalInput";
import downArrowImage from "../../assets/images/down-arrow.svg";
import fetchingLoader from "../../assets/images/fetchingLoader.gif";
import CryptoListModal from "../../components/modal/CryptoList";
import {cryptoCoinsEnum, modalTypesEnum} from "../../staticData";
import SwapSetting from "../../components/modal/SwapSetting";
import settingImg from "../../assets/images/setting.svg";
import {
    APPROVAL_TOKENS,
    balanceOfABI,
    CONTRACT_ABI,
    CONTRACT_ADDRESS,
} from "../../config";
import {
    getDeadline,
    isTokenApproved,
    roundDownAndParse,
    roundDownForSwap,
    getEstimatedPriceImpact
} from "../../helper";
import { formatUnits } from '../../utils/formatUnits';
import detectEthereumProvider from "@metamask/detect-provider";
import {ethers} from "ethers";
import {useGlobalModalContext} from "../../components/modal/GlobalModal";

const Index = () => {
    let signer, web3Provider, erc20ContractToken1, erc20ContractToken2, contract, accounts, button;
    const [formData, setFormData] = useState({
        from: "",
        to: "",
    });
    const [crypto1, setCrypto1] = useState(cryptoCoinsEnum.wcanto);
    const [crypto2, setCrypto2] = useState(null);
    const [token1, setToken1] = useState(cryptoCoinsEnum.wcanto.address);
    const [token2, setToken2] = useState("");
    const [previewModal, setPreviewModal] = useState(false);
    const [cryptoModal1, setCryptoModal1] = useState(false);
    const [cryptoModal2, setCryptoModal2] = useState(false);
    const [priceImpact, setPriceImpact] = useState({
        priceImpactPercent: 0,
        severity: 1
    });
    // const [walletModal, setWalletModal] = useState(false);
    const [settingModal, setSettingModal] = useState(false);
    // @todo refactor: remove repetition
    const [token1Balance, setToken1Balance] = useState({
        raw: '0',
        parsedForView: '0'
    });
    const [token2Balance, setToken2Balance] = useState({
        raw: '0',
        parsedForView: '0'
    });
    const [confirmationWaitingModal, setConfirmationWaitingModal] = useState(false);
    const [isToken1Approved, setIsToken1Approved] = useState(true);
    const [isToken2Approved, setIsToken2Approved] = useState(true);
    const [isPairAvailable, setIsPairAvailable] = useState(false);
    const [isFetchingPrice, setIsFetchingPrice] = useState(false);
    const [button1, setButton1] = useState("");
    const [routes, setRoutes] = useState([]);
    const {showModal, hideModal} = useGlobalModalContext();

    const toggleCryptoModal1 = () => setCryptoModal1(!cryptoModal1);
    const toggleCryptoModal2 = () => setCryptoModal2(!cryptoModal2);
    const toggleSettingModal = () => setSettingModal(!settingModal);
    const togglePreviewModal = () => setPreviewModal(!previewModal);
    const toggleConfirmationWaitingModal = () => setConfirmationWaitingModal(!confirmationWaitingModal);
    // const toggleWalletModal = () => setWalletModal(!walletModal);
    const waitForConfirmation = () => {
        togglePreviewModal();
        toggleConfirmationWaitingModal();
    }

    const cryptoUpdate = (type, value) =>   {
        switch (type) {
            case 1:
                if(value) {
                    setToken1Balance({
                        raw: '0',
                        parsedForView: '0'
                    });
                    setToken1(value.address);
                    setCrypto1(value);
                }
                setCryptoModal1(false);
                break;
            case 2:
                if(value) {
                    setToken2Balance({
                        raw: '0',
                        parsedForView: '0'
                    });
                    setToken2(value.address);
                    setCrypto2(value);
                }
                setCryptoModal2(false);
                break;
            default: break;
        }
    }

    const setInputVal = (name,value) => {
        setFormData(oldValues => ({...oldValues, [name]: value}));
        submitButton()
    };

    useEffect(() => {
        contractInitialize().then()
        submitButton()
    }, [token1,token2,crypto1,crypto2]);

    const contractInitialize = async () => {
        try {
            let provider = await detectEthereumProvider();
            if (provider) {
                web3Provider = new ethers.providers.Web3Provider(window.ethereum);
                erc20ContractToken1 = await new ethers.Contract(token1, balanceOfABI, web3Provider);
                erc20ContractToken2 = await new ethers.Contract(token2, balanceOfABI, web3Provider);
                contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Provider);
                accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                signer = web3Provider.getSigner();
                await checkAllowance()
            } else {
                console.log("Install the metamask extension first !");
            }
        } catch (e) {
            console.log("Ensure that you are connecting the correct wallet address with Metamask");
        }
    }

    const checkAllowance = async () => {
        try {
            const cantoBalance = await web3Provider.getBalance(accounts[0]);

            if(token1 !== "") {
                const BalanceOfToken11 = await isTokenApproved(erc20ContractToken1.connect(signer), accounts[0]);

                setIsToken1Approved(BalanceOfToken11);

                if(crypto1.title === cryptoCoinsEnum.canto.title){
                    setToken1Balance(previousState => ({...previousState,
                        raw: formatUnits(cantoBalance, crypto1.decimal),
                        parsedForView: formatUnits(cantoBalance, crypto1.decimal, true)
                    }));
                }
                else {
                    const BalanceOfToken1 = await erc20ContractToken1.connect(signer).balanceOf(accounts[0]);

                    if (BalanceOfToken1.toString() > 0) {
                        const decimalOfToken1 = await erc20ContractToken1.connect(signer).decimals();

                        setToken1Balance(previousState => ({...previousState,
                            raw: formatUnits(BalanceOfToken1, decimalOfToken1),
                            parsedForView: formatUnits(BalanceOfToken1, decimalOfToken1, true)
                        }));
                    } else {
                        setToken1Balance(previousState => ({...previousState,
                            raw: '0',
                            parsedForView: '0'
                        }));
                    }
                }
            }
            if(token2 !== ""){
                const BalanceOfToken22 = await isTokenApproved(erc20ContractToken2.connect(signer), accounts[0]);
                setIsToken2Approved(BalanceOfToken22);

                if(crypto2.title === cryptoCoinsEnum.canto.title){
                    setToken2Balance(previousState => ({...previousState,
                        raw: formatUnits(cantoBalance, crypto2.decimal),
                        parsedForView: formatUnits(cantoBalance, crypto2.decimal, true)
                    }));
                } else {
                    const BalanceOfToken2 = await erc20ContractToken2.connect(signer).balanceOf(accounts[0]);
                    if (BalanceOfToken2.toString() > 0) {
                        const decimalOfToken2 = await erc20ContractToken2.connect(signer).decimals();

                        setToken2Balance(previousState => ({...previousState,
                            raw: formatUnits(BalanceOfToken2, decimalOfToken2),
                            parsedForView: formatUnits(BalanceOfToken2, decimalOfToken2, true)
                        }));
                    } else {
                        setToken2Balance(previousState => ({...previousState,
                            raw: '0',
                            parsedForView: '0'
                        }));
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function tokenApproval(i) {
        try {
            showModal(modalTypesEnum.CUSTOM_MODAL, {title1:"Waiting for token Approval",description:"Please give permission to access your token "})
            await contractInitialize()
            switch (i) {
                case 1:
                    erc20ContractToken1.connect(signer).approve(CONTRACT_ADDRESS, APPROVAL_TOKENS).then(() => {
                        setIsToken1Approved(true)
                        hideModal(modalTypesEnum.CUSTOM_MODAL)
                    }).catch(function () {
                        showModal(modalTypesEnum.TRANSACTION_FAIL_MODAL);
                    });
                    break;
                case 2:
                    erc20ContractToken2.connect(signer).approve(CONTRACT_ADDRESS, APPROVAL_TOKENS).then(() => {
                        setIsToken2Approved(true)
                        hideModal(modalTypesEnum.CUSTOM_MODAL)
                    }).catch(function (err) {
                        console.log(err);
                        showModal(modalTypesEnum.TRANSACTION_FAIL_MODAL);
                    });
                    break;
                default:
            }
        } catch (e) {
            showModal(modalTypesEnum.TRANSACTION_FAIL_MODAL);
            console.log(e)
        }
    }

    const swapTokens = () => {
        if(token1 !== "" && token2 !== "") {
            const tempToken = token1;
            const tempCrypto = crypto1;
            setToken1(token2);
            setToken2(tempToken);
            setCrypto1(crypto2);
            setCrypto2(tempCrypto);
            setInputVal( "from", formData.to)
        }
    }

    const submitButton = () => {
        if(token1.length <= 0  || token2.length <= 0 ){
            button = <button className="btn btn-lg btn-primary align-items-center btn-starch fs-6 py-md-4 mt-md-3 btn-submit">
                Select Token
            </button>
        }  else {
            button = <button onClick={togglePreviewModal} className="btn btn-lg btn-primary align-items-center btn-starch fs-6  py-md-4 py-xs-2  mt-md-3  btn-submit">
                Swap In
            </button>
        }

        setButton1(button)
    }

    const intervalRef = useRef(null);

    useEffect(() => {
        if(!formData?.from || formData?.from === 0) setFormData(oldValues => ({...oldValues, "to": ''}));

        if (token2.length > 0 && formData.from.length > 0) {
            intervalRef.current = setTimeout(async () => {
                setIsFetchingPrice(true);
                setIsPairAvailable(false);
                const parseValue = roundDownAndParse(formData.from, crypto1.decimal);
                await contractInitialize().then()
                let to;
                const stableRate = await contract.connect(signer).getAmountsOut(parseValue, [[token1, token2, true]]);
                const volatileRate = await contract.connect(signer).getAmountsOut(parseValue, [[token1, token2, false]]);

                let amountOut;
                let tinyAmountOut;
                const tinyPriceDivisor = 1000;
                const tinyStableRate = await contract.connect(signer).getAmountsOut(parseValue.div(tinyPriceDivisor), [[token1, token2, true]]);
                const tinyVolatileRate = await contract.connect(signer).getAmountsOut(parseValue.div(tinyPriceDivisor), [[token1, token2, false]]);

                if (stableRate && volatileRate) {
                    if (stableRate[1].gt(volatileRate[1])) {
                        to = roundDownForSwap(stableRate[1].toString(), crypto2.decimal);
                        amountOut = stableRate[1];
                        tinyAmountOut = tinyStableRate[1];
                        setRoutes([[token1, token2, true]])
                    } else {
                        to = roundDownForSwap(volatileRate[1].toString(), crypto2.decimal);
                        amountOut = volatileRate[1];
                        tinyAmountOut = tinyVolatileRate[1];
                        setRoutes([[token1, token2, false]])
                    }
                    setFormData(oldValues => ({...oldValues, ["to"]: to}));

                    const {priceImpactPercent, severity} = getEstimatedPriceImpact(parseValue, parseValue.div(tinyPriceDivisor), amountOut, tinyAmountOut, crypto1.decimal, crypto2.decimal)

                    setPriceImpact({
                        priceImpactPercent,
                        severity
                    });

                    if (to == 0 && formData.from > 0) {

                        setIsPairAvailable(true);
                    } else {
                        setIsPairAvailable(false);
                    }
                    setIsFetchingPrice(false);
                }
            }, 1000);
        } else  {
            clearTimeout(intervalRef.current);
        }

        return () => clearTimeout(intervalRef.current);
    }, [contract, crypto1?.decimal, crypto1?.name, crypto2?.decimal, crypto2?.name, formData?.from, signer, token1, token2])

    // //@todo this code compliments the code above, needs to be refactored too
    useEffect(() => {
        if(isFetchingPrice) return

        if(!formData?.from || formData?.from === 0) {
            setFormData(oldValues => ({...oldValues, "to": ''}));
            setPriceImpact(previousState => ({...previousState,
                priceImpactPercent: 0,
                severity: 1
            }));
        }
    }, [formData?.from, isFetchingPrice])

    const swapIn = async () => {
        const slippage = localStorage.getItem('forteSlippage');
        const afterSlippage = (1 - (slippage / 100)) * formData.to;
        console.log('slip', slippage, formData.to, afterSlippage.toFixed(5))
        const amountOutMin = roundDownAndParse(afterSlippage.toFixed(5), crypto2.decimal)
        if (crypto1.title === cryptoCoinsEnum.canto.title) {
            swapExactCANTOForTokens(amountOutMin).then();
        } else if (crypto1.title !== cryptoCoinsEnum.canto.title && crypto2.title === cryptoCoinsEnum.canto.title) {
            swapExactTokensForCANTO(amountOutMin).then()
        } else if (crypto1.title == cryptoCoinsEnum.rab.title) {
            UNSAFE_swapExactTokensForTokens(amountOutMin).then();
        } else {
            swapExactTokensForTokens(amountOutMin).then()
        }
    }

    const swapExactCANTOForTokens = async (amountOutMin) => {
        console.log("from CANTO to ERC20")
        try {
            waitForConfirmation();
            await contractInitialize();
            const deadline =  getDeadline();
            const transaction  = await contract.connect(signer).swapExactCANTOForTokens(
                amountOutMin,
                routes,
                accounts[0],
                deadline,
                {
                    value: roundDownAndParse(formData.from,crypto1.decimal),
                }
            )
            await transaction.wait()
            showModal(modalTypesEnum.TRANSACTION_SUCCESS_MODAL, {
                hash: transaction.hash,
                title: "Swap was successful!",
                isSwap: true
            })
        } catch (e) {
            handleException(e)
        }
    }

    const swapExactTokensForCANTO = async (amountOutMin) => {
        console.log("from ERC20 to CANTO")
        try {
            waitForConfirmation();
            await contractInitialize();
            const deadline = getDeadline();
            const transaction = await contract.connect(signer).swapExactTokensForCANTO(
                roundDownAndParse(formData.from,crypto1.decimal),
                amountOutMin,
                routes,
                accounts[0],
                deadline
            )
            await transaction.wait()
            showModal(modalTypesEnum.TRANSACTION_SUCCESS_MODAL, {
                hash: transaction.hash,
                title: "Swap was successful!",
                isSwap: true
            })
        } catch (e) {
            handleException(e)
        }
    }

    const swapExactTokensForTokens = async (amountOutMin) => {
        console.log("between two ERC20 token")
        try {
            waitForConfirmation();
            await contractInitialize();
            const deadline = getDeadline();
            const transaction = await contract.connect(signer).swapExactTokensForTokens(
                roundDownAndParse(formData.from,crypto1.decimal),
                amountOutMin,
                routes,
                accounts[0],
                deadline
            )
            await transaction.wait()
            showModal(modalTypesEnum.TRANSACTION_SUCCESS_MODAL, {
                hash: transaction.hash,
                title: "Swap was successful!",
                isSwap: true
            })
        } catch (e) {
            handleException(e)
        }
    }

    const UNSAFE_swapExactTokensForTokens = async (amountOutExact) => {
        console.log("between two ERC20 token")
        try {
            waitForConfirmation();
            await contractInitialize();
            const deadline = getDeadline();
            const amounts = [roundDownAndParse(formData.from,crypto1.decimal), amountOutExact];
            const transaction = await contract.connect(signer).UNSAFE_swapExactTokensForTokens(
                amounts,
                routes,
                accounts[0],
                deadline
            )
            await transaction.wait()
            showModal(modalTypesEnum.TRANSACTION_SUCCESS_MODAL, {
                hash: transaction.hash,
                title: "Swap was successful!",
                isSwap: true
            })
        } catch (e) {
            handleException(e)
        }
    }

    const handleException = (e) => {
        setConfirmationWaitingModal(false)
        switch (e.code) {
            case "ACTION_REJECTED":
                showModal(modalTypesEnum.TRANSACTION_REJECTED_MODAL, { isSwap: true });
                break;
            default:
                showModal(modalTypesEnum.TRANSACTION_FAIL_MODAL, { isSwap: true });
        }
        return true
    }

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col lg={6}>
                        <Card>
                            <CardHeader className='align-items-center align-items-start border-bottom'>
                                <Row>
                                    <Col xs={8}>
                                        <CardTitle tag='h3' className="mt-2">Swap</CardTitle>
                                    </Col>
                                    <Col xs={4}>
                                        <div className='d-flex mt-2 float-end'>
                                           <span onClick={toggleSettingModal} className="cursor-pointer">
                                              <img className="align-middle" src={settingImg} alt="info" height="25" width="25"/>
                                           </span>
                                        </div>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col sm={12} >
                                        <div className="balance-card">
                                            <div className="d-flex">
                                                <Input autoComplete="off" type="text"
                                                   value={formData.from}
                                                   onUserInput={(value) => setInputVal("from", value)}
                                                   placeholder="0.00"
                                                   spellCheck="false" className="form-control-coin"/>

                                                <div className="text-end">
                                                    <button className="btn btn-forte-image py-md-2 px-md-3 ms-auto"
                                                            onClick={toggleCryptoModal1}>
                                                        {
                                                            crypto1 ?
                                                                <>
                                                                    <img className="align-middle float-start coin-icon" height="28"
                                                                         src={require("../../assets/images/coins/" + crypto1.icon)}
                                                                         alt="coinImg"/>
                                                                    <span className="align-middle px-1"> {crypto1.name}</span>
                                                                    <img className="align-middle pe-md-2" height="20"
                                                                         src={downArrowImage} alt="coinImg"/>
                                                                </>
                                                                : <>
                                                                    <span className="align-middle px-2">Select Token</span>
                                                                    <img className="align-middle pe-md-2" height="20"
                                                                         src={downArrowImage} alt="coinImg"/>
                                                                </>
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-end" style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: '0.25rem', fontSize: '14px', marginTop: '0.5rem'}}>
                                                <span className="text-balance">
                                                    {token1Balance.parsedForView + ' ' + crypto1.name}
                                                </span>
                                                <button
                                                    className="btn btn-outline-light btn-sm ms-2 fw-normal button-max"
                                                    onClick={() => setInputVal("from", token1Balance.raw)}>
                                                    Max
                                                </button>
                                            </div>
                                        </div>
                                        <div className="balance-card-swapper">
                                            <div className="balance-card-swapper-parent" onClick={swapTokens}>
                                                <img src={downArrowImage} alt="coinImg" height="18" width="18"/>
                                            </div>
                                        </div>
                                        <div className="balance-card">
                                            <div className="d-flex">
                                                <Input autoComplete="off" type="text"
                                                   value={formData.to} readOnly
                                                   onUserInput={(value) => setInputVal("to", value)}
                                                   placeholder="0.00"
                                                   spellCheck="false" className="form-control-coin"/>

                                                <div className="text-end">
                                                    <button className="btn btn-forte-image py-md-2 px-md-3 ms-auto"
                                                            onClick={toggleCryptoModal2}>
                                                        {
                                                            crypto2 !== null ?
                                                                <>
                                                                    <img className="align-middle float-start" height="28"
                                                                         src={require("../../assets/images/coins/" + crypto2.icon)}
                                                                         alt="coinImg"/>
                                                                    <span className="align-middle ps-2 pe-2"> {crypto2.name}</span>
                                                                    <img className="align-middle pe-2" height="20"
                                                                         src={downArrowImage} alt="coinImg"/>
                                                                </>
                                                                : <>
                                                                    <span className="align-middle px-2  ">Select Token</span>
                                                                    <img className="align-middle pe-md-2" height="20"
                                                                         src={downArrowImage} alt="coinImg"/>
                                                                </>
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                            {
                                                crypto2  ?
                                                    <div className="text-end" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '0.25rem', fontSize: '14px'}}>
                                                        {formData?.to && <span>
                                                            <span>price impact: </span>
                                                            <span
                                                                style={{color: `${priceImpact.severity === 2 ? '#ebbe67' : priceImpact.severity === 3 ? 'rgb(253, 118, 107)' : '#AAAAAA'}`}}
                                                            >
                                                                ~{priceImpact.priceImpactPercent || '0'}%
                                                            </span>
                                                        </span>}
                                                        <span className="text-balance" style={{marginLeft: 'auto', marginTop: '0.5rem'}}>
                                                            {token2Balance.parsedForView + ' ' + crypto2.name}
                                                        </span>
                                                    </div> : ""
                                            }
                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                        <div className="d-flex my-2">
                                            {(crypto1 && !isToken1Approved) ?
                                                <button className="btn btn-primary flex-grow-1 me-1 pe-4 btn-approval"
                                                        onClick={() => tokenApproval(1)}>
                                                    <img className="align-middle float-start" height="28"
                                                         src={require("../../assets/images/coins/" + crypto1.icon)}
                                                         alt="coinImg"/>
                                                    <span
                                                        className="align-middle flex-grow-1">Approve {crypto1.name}</span>
                                                </button>
                                                : null}

                                            {(crypto2 && !isToken2Approved) ?
                                                <button className="btn btn-primary flex-grow-1 ms-1 pe-4 btn-approval"
                                                        onClick={() => tokenApproval(2)}>
                                                    <img className="align-middle float-start" height="28"
                                                         src={require("../../assets/images/coins/" + crypto2.icon)}
                                                         alt="coinImg"/>
                                                    <span
                                                        className="align-middle flex-grow-1">Approve {crypto2.name}</span>
                                                </button>
                                                : null}
                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                        { (isPairAvailable) ?
                                            <span className="text-danger ps-2"> Pair is not available</span>
                                            : null
                                        }
                                        { (isFetchingPrice) ?
                                            <span className="ps-2">
                                                <img src={fetchingLoader} height="20px" alt=""/>
                                                &nbsp;Fetching best price...
                                            </span>
                                            : null
                                        }
                                    </Col>
                                    <Col sm={12}>
                                        {button1}
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>

                    <Modal isOpen={previewModal} backdrop={true} keyboard={false} centered={true}>
                        <ModalHeader toggle={togglePreviewModal}>Confirm Swap</ModalHeader>
                        <ModalBody>
                            <Row>
                                {token1 && token2 ?
                                    <>
                                        <div className="d-flex justify-content-between mb-3">
                                            <span className="text-secondary">Your Swap</span>
                                            <div className="text-primary text-end">
                                                1 {crypto1.name} = {(formData.to / formData.from).toFixed(3)} {crypto2.name}
                                            </div>
                                        </div>
                                        <Col sm={12}>
                                            <div className="balance-card-group">
                                                <div className="balance-card d-flex">
                                                    <span className="align-middle coin-value">{formData.from}</span>
                                                    <div className="text-end">
                                                        <div className="align-items-center px-3">
                                                            <img className="me-2 align-middle" alt="coinImg"
                                                                 src={require("../../assets/images/coins/" + crypto1.icon)}
                                                                 height="30" width="30"/>
                                                            <span className="align-middle coin-symbol">{crypto1.name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="balance-card-swapper">
                                                    <div className="balance-card-swapper-parent">
                                                        <img src={downArrowImage} alt="add" height="24" width="24"/>
                                                    </div>
                                                    <div className="separator"/>
                                                </div>
                                                <div className="balance-card d-flex">
                                                    <span className="align-middle coin-value">{formData.to}</span>
                                                    <div className="text-end">
                                                        <div className="align-items-center px-3">
                                                            <img className="me-2 align-middle" alt="coinImg"
                                                                 src={require("../../assets/images/coins/" + crypto2.icon)}
                                                                 height="30" width="30"/>
                                                            <span className="align-middle coin-symbol">{crypto2.name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </>: ""
                                }
                                <Col sm={12} className="mt-4">
                                    <div className="h6">Transaction Summary</div>
                                    <hr className="mt-4"/>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-secondary">Price Impact</span>
                                        <span className="text-end">
                                            <span
                                                style={{color: `${priceImpact.severity === 2 ? '#ebbe67' : priceImpact.severity === 3 ? 'rgb(253, 118, 107)' : null}`}}>~{priceImpact.priceImpactPercent || '0'}%</span>
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter className="with-bg full-btn">
                            <Button color="none" className="btn-starch btn btn-lg" onClick={swapIn}>
                                Confirm swap
                            </Button>
                        </ModalFooter>
                    </Modal>

                    {/*Info: Confirmation Waiting Modal */}
                    <Modal isOpen={confirmationWaitingModal} backdrop={true} keyboard={false} centered={true}>
                        <ModalHeader toggle={toggleConfirmationWaitingModal}/>
                        <ModalBody>
                            <Row>
                                <Col sm="12" className="text-center">
                                    <div className="modal-confirmation-wrapper"/>
                                    <div className="h5">Waiting for Confirmation</div>
                                    <hr className="mt-4 "/>
                                    <p className="mt-3 text-secondary">
                                        {crypto1 && crypto2 ?
                                            <b>Creating {formData.from + ' ' + crypto1.name} and&nbsp;
                                                {formData.to + ' ' + crypto2.name}
                                            </b>
                                            : ''}
                                        <br/>
                                        Confirm this transaction in your wallet
                                    </p>
                                </Col>
                            </Row>
                        </ModalBody>
                    </Modal>

                    <CryptoListModal isOpen={cryptoModal1} skipToken={token2} onValueUpdate={val => cryptoUpdate(1, val)}/>

                    <CryptoListModal isOpen={cryptoModal2} skipToken={token1} onValueUpdate={val => cryptoUpdate(2, val)}/>

                    {/*<WalletConnectModal isOpen={walletModal} onValueUpdate={toggleWalletModal}/>*/}
                    <SwapSetting isOpen={settingModal} onValueUpdate={toggleSettingModal}/>
                </Row>
            </Container>
        </>
    );
}

export default Index;
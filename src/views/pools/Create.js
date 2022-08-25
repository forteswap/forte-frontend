import {useGlobalModalContext} from "../../components/modal/GlobalModal";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Container,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from "reactstrap";
import {Link} from "react-router-dom";
import leftArrowImage from "../../assets/images/left-arrow.svg";
import downArrowImage from "../../assets/images/down-arrow.svg";
import React, {useEffect, useState} from "react";
import {cryptoCoinsEnum, modalTypesEnum} from "../../staticData";
import detectEthereumProvider from "@metamask/detect-provider";
import {APPROVAL_TOKENS, balanceOfABI, CONTRACT_ABI, CONTRACT_ADDRESS} from "../../config";
import CryptoListModal from "../../components/modal/CryptoList";
import {getNumberValue, isTokenApproved} from "../../helper";

const {ethers} = require('ethers');
const Create = () => {
    let signer, web3Provider, erc20ContractToken1, erc20ContractToken2, contract, accounts;
    const [crypto1, setCrypto1] = useState(cryptoCoinsEnum.wcanto);
    const [crypto2, setCrypto2] = useState(null);
    const [token1, setToken1] = useState(cryptoCoinsEnum.wcanto.address);
    const [token2, setToken2] = useState("");
    const deadlineMinutes = 30;
    const {showModal, hideModal} = useGlobalModalContext();
    const [previewModal, setPreviewModal] = useState(false);
    const [confirmationWaitingModal, setConfirmationWaitingModal] = useState(false);
    const [cryptoModal1, setCryptoModal1] = useState(false);
    const [cryptoModal2, setCryptoModal2] = useState(false);
    const [isStable, setIsStable] = useState(false);
    const [isToken1Approved, setIsToken1Approved] = useState(false);
    const [isToken2Approved, setIsToken2Approved] = useState(false);
    const togglePreviewModal = () => setPreviewModal(!previewModal);
        const [isNativeCANTO, setNativeCanto] = useState(false);
    const toggleConfirmationWaitingModal = () => setConfirmationWaitingModal(!confirmationWaitingModal);
    const [formData, setFormData] = useState({
        amountADesired: "",
        amountBDesired: "",
    });
    const [token1Balance, setToken1Balance] = useState(0);
    const [token2Balance, setToken2Balance] = useState(0);
    const toggleCryptoModal1 = () => setCryptoModal1(!cryptoModal1);
    const toggleCryptoModal2 = () => setCryptoModal2(!cryptoModal2);
    const waitForConfirmation = () => {
        togglePreviewModal();
        toggleConfirmationWaitingModal();
    }

    useEffect(() => {
        contractInitialize().then()
    }, [token1,token2,crypto1,crypto2]);

    const cryptoUpdate = (type, value) => {
        switch (type) {
            case 1:
                if(value) {
                    setToken1Balance(0);
                    setToken1(value.address);
                    setCrypto1(value);
                }
                setCryptoModal1(false);
                break;
            case 2:
                if(value) {
                    setToken2Balance(0);
                    setToken2(value.address);
                    setCrypto2(value);
                }
                setCryptoModal2(false);
                break;
            default: break;
        }
    }

    const setInputVal = name => {
        return ({target: {value}}) => {
            setFormData(oldValues => ({...oldValues, [name]: value}));
        }
    };

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
            if(token1 !== "") {
                const BalanceOfToken1 = await erc20ContractToken1.connect(signer).balanceOf(accounts[0]);
                const BalanceOfToken11 = await isTokenApproved(erc20ContractToken1.connect(signer), accounts[0]);
                setIsToken1Approved(BalanceOfToken11);

                if (BalanceOfToken1.toString() > 0) {
                    const decimalOfToken1 = await erc20ContractToken1.connect(signer).decimals();
                    setToken1Balance(getNumberValue(BalanceOfToken1, decimalOfToken1));
                } else {
                    setToken1Balance(0);
                }
            }
            if(token2 !== ""){
                const BalanceOfToken2 = await erc20ContractToken2.connect(signer).balanceOf(accounts[0]);
                const BalanceOfToken22 = await isTokenApproved(erc20ContractToken2.connect(signer), accounts[0]);
                setIsToken2Approved(BalanceOfToken22);
                if (BalanceOfToken2.toString() > 0) {
                    const decimalOfToken2 = await erc20ContractToken2.connect(signer).decimals();
                    setToken2Balance(getNumberValue(BalanceOfToken2, decimalOfToken2));
                }else {
                    setToken2Balance(0);
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

    const setToken1Max =(val) =>{
        setFormData(oldValues => ({...oldValues, ["amountADesired"]: val}));
    };

    const setToken2Max =(val) =>{
        setFormData(oldValues => ({...oldValues, ["amountBDesired"]: val}));
    };

    const handleCheckbox = (val) => {
        setNativeCanto(val.target.checked);
    }

    const changePosition = (val) => {
       setIsStable(val.target.checked);
    }

    async function addLiquidityCANTO() {
        waitForConfirmation();
        await contractInitialize();
        const deadline = Math.round(new Date(new Date().getTime() + deadlineMinutes * 60000) / 1000);

        const parsedAmountADesired = ethers.utils.parseUnits(Number(formData.amountADesired).toFixed(crypto1.decimal)),
        const parsedAmountBDesired = ethers.utils.parseUnits(Number(formData.amountBDesired).toFixed(crypto2.decimal)),


        if (crypto1.name === 'WCANTO') {

            contract.connect(signer).addLiquidityCANTO(
                token2,
                isStable,
                parsedAmountBDesired,
                0,
                0,
                accounts[0],
                deadline, {
                    value: parsedAmountADesired
                }
            ).then((result) => {
                setConfirmationWaitingModal(false)
                showModal(modalTypesEnum.TRANSACTION_SUCCESS_MODAL, {hash: result.hash})
            }).catch(function (err) {
                setConfirmationWaitingModal(false)
                showModal(modalTypesEnum.TRANSACTION_FAIL_MODAL);
                console.log(err);
            });

        } else {
            contract.connect(signer).addLiquidityCANTO(
                token1,
                isStable,
                parsedAmountADesired,
                0,
                0,
                accounts[0],
                deadline, {
                    value: parsedAmountBDesired
                }
            ).then((result) => {
                setConfirmationWaitingModal(false)
                showModal(modalTypesEnum.TRANSACTION_SUCCESS_MODAL, {hash: result.hash})
            }).catch(function (err) {
                setConfirmationWaitingModal(false)
                showModal(modalTypesEnum.TRANSACTION_FAIL_MODAL);
                console.log(err);
            });

        }
    }

    async function addLiquidity() {
        waitForConfirmation();
        await contractInitialize();
        const deadline = Math.round(new Date(new Date().getTime() + deadlineMinutes * 60000) / 1000);
        // const amountAMin = (99 * parseInt(formData.amountADesired)) / 100;
        // const amountBMin = (99 * parseInt(formData.amountBDesired)) / 100;
        contract.connect(signer).addLiquidity(
            token1,
            token2,
            isStable,
            ethers.utils.parseUnits(Number(formData.amountADesired).toFixed(crypto1.decimal)),
            ethers.utils.parseUnits(Number(formData.amountBDesired).toFixed(crypto2.decimal)),
            0,
            0,
            accounts[0],
            deadline,
        ).then((result) => {
            setConfirmationWaitingModal(false)
            showModal(modalTypesEnum.TRANSACTION_SUCCESS_MODAL, {hash: result.hash})
            showModal(modalTypesEnum.TRANSACTION_SUCCESS_MODAL, {hash:result.hash,title:"You created a pool!"})
            console.log(result);
        }).catch(function (err) {
            setConfirmationWaitingModal(false)
            showModal(modalTypesEnum.TRANSACTION_FAIL_MODAL);
            console.log(err);
        });
    }
    return (
        <>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col lg={6}>
                        <Card>
                            <CardHeader>
                                <div className="d-flex w-100">
                                    <Link to={"/"} className="me-3">
                                        <img src={leftArrowImage} className="align-middle flex-grow-0 me-1" alt="back"/>
                                    </Link>
                                    <CardTitle tag='h3' className="flex-grow-0">Create a Pool</CardTitle>
                                    {((crypto1 != null && crypto1.name === 'WCANTO') || (crypto2 != null && crypto2.name === 'WCANTO')) ? (

                                        <div className="flex-grow-1">
                                            <div className="form-check float-end">
                                                <input className="form-check-input" id="nativeCantoCheckbox"
                                                       type="checkbox" onChange={handleCheckbox}/>
                                                <label htmlFor="nativeCantoCheckbox" className="col-form-label pt-0">Supply
                                                    Native Canto</label>
                                            </div>
                                        </div>

                                    ) : ""}
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                <div className="form-switch row" style={{ display: 'flex', alignItems: 'center'}}>
                                    <label className="col-sm-3 col-form-label">Volatile</label>
                                    <input className="col-sm-3 form-check-input cursor-pointer" type="checkbox" role="switch"
                                           onChange={changePosition}/>
                                    <label className="col-sm-3 col-form-label">Stable</label>
                                </div>
                                    <Col sm={12}>
                                        <div className="balance-card">
                                            <Input autoComplete="off" type="text"
                                                   value={formData.amountADesired}
                                                   onChange={setInputVal("amountADesired")}
                                                   pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.00"
                                                   spellCheck="false" className="form-control-coin"/>
                                            <div className="text-end">
                                                <button className="btn btn-forte-image py-2 px-3 ms-auto"
                                                        onClick={toggleCryptoModal1}>
                                                    {
                                                        crypto1 ?
                                                            <>
                                                                <img className="align-middle float-start" height="28"
                                                                     src={require("../../assets/images/coins/" + crypto1.icon)}
                                                                     alt="coinImg"/>
                                                                <span
                                                                    className="align-middle px-2"> {crypto1.name}</span>
                                                                <img className="align-middle pe-2" height="20"
                                                                     src={downArrowImage} alt="coinImg"/>
                                                            </>
                                                            : <>
                                                                <span className="align-middle px-2">Select a Token</span>
                                                                <img className="align-middle pe-2" height="20"
                                                                     src={downArrowImage} alt="coinImg"/>
                                                            </>
                                                    }
                                                </button>
                                                <div className="mt-2">
                                                    <span
                                                        className="text-balance">Balance: {token1Balance + ' ' + crypto1.name}</span>
                                                    <button className="btn btn-outline-light btn-sm ms-2 fw-normal"
                                                            onClick={() => setToken1Max(token1Balance)}>
                                                        Max
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="balance-card-swapper">
                                            <div className="balance-card-swapper-parent">
                                                <img src={downArrowImage} alt="coinImg" height="18" width="18"/>
                                            </div>
                                        </div>
                                        <div className="balance-card">
                                            <Input autoComplete="off" type="text"
                                                   value={formData.amountBDesired}
                                                   onChange={setInputVal("amountBDesired")}
                                                   pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.00" max={token2Balance}
                                                   spellCheck="false" className="form-control-coin"/>
                                            <div className="text-end">
                                                <button className="btn btn-forte-image py-2 px-3 ms-auto"
                                                        onClick={toggleCryptoModal2}>
                                                    {
                                                        crypto2 !== null ?
                                                            <>
                                                                <img className="align-middle float-start" height="28"
                                                                     src={require("../../assets/images/coins/" + crypto2.icon)}
                                                                     alt="coinImg"/>
                                                                <span
                                                                    className="align-middle ps-2 pe-2"> {crypto2.name}</span>
                                                                <img className="align-middle pe-2" height="20"
                                                                     src={downArrowImage} alt="coinImg"/>
                                                            </>
                                                            : <>
                                                                <span className="align-middle ps-2 pe-2">Select a Token</span>
                                                                <img className="align-middle pe-2" height="20"
                                                                     src={downArrowImage} alt="coinImg"/>
                                                            </>
                                                    }
                                                </button>

                                                {
                                                    crypto2 ?
                                                        <div className="mt-2">
                                                            <span
                                                                className="text-balance">Balance: {token2Balance + ' ' + crypto2.name}</span>
                                                            <button onClick={() => setToken2Max(token2Balance)}
                                                                    className="btn btn-outline-light btn-sm ms-2 fw-normal">
                                                                Max
                                                            </button>
                                                        </div>
                                                        : ""}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={12} className="mt-4">
                                        <p>Initial Prices and Pool Share</p>
                                    </Col>
                                    <Col sm={12} className="mt-4 price-info">
                                        <div className="d-flex justify-content-evenly">
                                            <div className="text-center flex-grow-1">
                                                <span className="title">{formData.amountADesired}</span>
                                                <p className="mb-0 sub-title">{crypto1 ? crypto1.name : ''}</p>
                                            </div>
                                            <div className="text-center border-start border-end flex-grow-1">
                                                <span className="title">{formData.amountBDesired}</span>
                                                <p className="mb-0 sub-title">{crypto2 ? crypto2.name : '-'}</p>
                                            </div>
                                            <div className="text-center flex-grow-1">
                                                <span className="title">100%</span>
                                                <p className="mb-0 sub-title">Share of Pool </p>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={12} className={(!isToken1Approved || !isToken2Approved) ? "my-5" : "mb-5" }>
                                        <div className="d-flex">
                                            {(crypto1 && !isToken1Approved) ?
                                                <button className="btn btn-primary flex-grow-1 me-1 pe-4 min-h-50"
                                                        onClick={() => tokenApproval(1)}>
                                                    <img className="align-middle float-start" height="28"
                                                         src={require("../../assets/images/coins/" + crypto1.icon)}
                                                         alt="coinImg"/>
                                                    <span
                                                        className="align-middle flex-grow-1">Approve {crypto1.name}</span>
                                                </button>
                                                : null}

                                            {(crypto2 && !isToken2Approved) ?
                                                <button className="btn btn-primary flex-grow-1 ms-1 pe-4 min-h-50"
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
                                        <button onClick={togglePreviewModal}
                                                disabled={formData.amountADesired.length <= 0 && formData.amountBDesired.length <= 0}
                                                className="btn btn-lg btn-primary align-items-center py-4 btn-starch fs-6">
                                            Add
                                        </button>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                        {/*Info: Preview Modal */}
                        <Modal isOpen={previewModal} backdrop={true} keyboard={false} centered={true}>
                            <ModalHeader toggle={togglePreviewModal}>Preview</ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col sm={12}>
                                        <div className="balance-card-group">
                                            {token1 && token2 ?
                                                <div className="balance-card">
                                                    <div>
                                                        <small className="text-primary">Pair</small>
                                                        <span className="align-middle coin-value ps-2">{crypto1.name}/{crypto2.name}</span>
                                                    </div>
                                                    <div className="text-end">
                                                        <div className="coin-group pe-2">
                                                            <div className="coin pull-up">
                                                                <img src={require("../../assets/images/coins/" + crypto1.icon)} alt="coinImg" height="35" width="35"/>
                                                            </div>
                                                            <div className="coin pull-up">
                                                                <img src={require("../../assets/images/coins/" + crypto2.icon)} alt="coinImg" height="35" width="35"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            : ''}
                                        </div>
                                    </Col>
                                    {crypto1 && crypto2 ?
                                    <Col sm={12} className="mt-4">
                                        <div className="h6">Pool Details</div>
                                        <hr className="mt-4"/>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-secondary">{crypto1.name} Deposited</span>
                                            <span className="text-end text-primary">
                                                {formData.amountADesired + ' ' + crypto1.name}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between pt-2">
                                            <span className="text-secondary">{crypto2.name} Deposited</span>
                                            <span className="text-end text-primary">
                                                {formData.amountBDesired + ' ' + crypto2.name}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between pt-2">
                                            <span className="text-secondary">Rates</span>
                                            <div className="text-primary">
                                                <div>1{crypto1.name} = 0.00 {crypto2.name}</div>
                                                <div>1{crypto2.name} = 0.00 {crypto1.name}</div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between pt-2">
                                            <span className="text-secondary">Share of Pool</span>
                                            <span className="text-end text-primary">100%</span>
                                        </div>
                                    </Col>
                                    : ""}
                                    <Col sm={12} className="mt-4">
                                        <div className="h6">Transaction Summary</div>
                                        <hr className="mt-4"/>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-secondary">Price Impact</span>
                                            <span className="text-end">--</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-secondary">Network Fee</span>
                                            <span className="text-end">--</span>
                                        </div>
                                    </Col>
                                </Row>
                            </ModalBody>
                            <ModalFooter className="with-bg full-btn">
                                <Button color="none" onClick={isNativeCANTO ? addLiquidityCANTO : addLiquidity} className="btn-starch btn btn-lg">
                                    Confirm to Create a Pool
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
                                                <b>Creating {formData.amountADesired + ' ' + crypto1.name} and&nbsp;
                                                    {formData.amountBDesired + ' ' + crypto2.name}
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
                </Row>
            </Container>
        </>
    );
}

export default Create;
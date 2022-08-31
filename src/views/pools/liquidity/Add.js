import {useGlobalModalContext} from "../../../components/modal/GlobalModal";
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
import leftArrowImage from "../../../assets/images/left-arrow.svg";
import addImage from '../../../assets/images/add.svg';
import infoImage from '../../../assets/images/info.svg';
import React, {useEffect, useRef, useState} from "react";
import {cryptoCoinsEnum, modalTypesEnum} from "../../../staticData";
import detectEthereumProvider from "@metamask/detect-provider";
import {useParams} from "react-router";
import {APPROVAL_TOKENS, balanceOfABI, CONTRACT_ABI, CONTRACT_ADDRESS} from "../../../config";
import collect from "collect.js";
import {getNumberValue, getTokenData, isTokenApproved, roundDown, roundDownAndParse} from "../../../helper";
import {connect} from "react-redux";

const {ethers} = require('ethers');

const Add = (props) => {
    let signer, web3Provider, erc20ContractToken1, erc20ContractToken2, contract, accounts;
    const {slug} = useParams();
    let tokens = slug.split("-");
    const [currentPool, setCurrentPool] = useState({myPool: {},address: {}});
    useEffect(() => {
        if (props.data.length > 0) {
            const getCurrentPool = collect(props.data).where("slug", slug).first();
            setCurrentPool(getCurrentPool);
            setToken1(getCurrentPool.address.token1)
            setToken2(getCurrentPool.address.token2)
        }
    }, [props.data]);

    const [crypto1] = useState(getTokenData(tokens[1]));
    const [crypto2] = useState(getTokenData(tokens[2]));
    const [token1,setToken1] = useState(currentPool.address.token1 || "");
    const [token2,setToken2] = useState(currentPool.address.token2 || "");
    const {showModal, hideModal} = useGlobalModalContext();
    const [previewModal, setPreviewModal] = useState(false);
    const [confirmationWaitingModal, setConfirmationWaitingModal] = useState(false);
    const [isToken1Approved, setIsToken1Approved] = useState(false);
    const [isToken2Approved, setIsToken2Approved] = useState(false);
    const [isNativeCANTO, setNativeCanto] = useState(false);
    const [poolAmountToken1, setPoolAmountToken1] = useState(0);
    const [poolAmountToken2, setPoolAmountToken2] = useState(0);
    const token1Input = useRef(null);
    const token2Input = useRef(null);
    // const unlimitedToken = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
    const deadlineMinutes = 30;

    const togglePreviewModal = () => setPreviewModal(!previewModal);
    const toggleConfirmationWaitingModal = () => setConfirmationWaitingModal(!confirmationWaitingModal);
    const [formData, setFormData] = useState({
        amountADesired: "",
        amountBDesired: "",
    });
    const [token1Balance, setToken1Balance] = useState(0);
    const [token2Balance, setToken2Balance] = useState(0);

    const waitForConfirmation = () => {
        togglePreviewModal();
        toggleConfirmationWaitingModal();
    }

    useEffect(() => {
        if (currentPool.pairAddress) {
            contractInitialize().then()
        }
    }, [currentPool]);

    const setInputVal = (name) => {
        return ({target: {value}}) => {
            setFormData(oldValues => ({...oldValues, [name]: value}));
            if (name === "amountADesired") {
                const priceRatioForToken2 = poolAmountToken2 / poolAmountToken1;
                setFormData(oldValues => ({
                    ...oldValues,
                    ['amountBDesired']: isNaN(value * priceRatioForToken2) ? 0 : (value * priceRatioForToken2).toString()
                }));
            } else {
                const priceRatioForToken1 = poolAmountToken1 / poolAmountToken2;
                setFormData(oldValues => ({
                    ...oldValues,
                    ['amountADesired']: isNaN(value * priceRatioForToken1) ? 0 : (value * priceRatioForToken1).toString()
                }));
            }
        }
    };

    const contractInitialize = async () => {
        try {
            let provider = await detectEthereumProvider();
            if (provider) {
                web3Provider = new ethers.providers.Web3Provider(window.ethereum);
                erc20ContractToken1 = new ethers.Contract(token1, balanceOfABI, web3Provider);
                erc20ContractToken2 = new ethers.Contract(token2, balanceOfABI, web3Provider);
                contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Provider);
                accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                signer = web3Provider.getSigner();
                await checkAllowance()
            } else {
                console.log("Install the metamask extension first !");
            }
        } catch (e) {
            showModal(modalTypesEnum.TRANSACTION_FAIL_MODAL);
            console.log(e)
        }
    }

    const checkAllowance = async () => {
        try {
            const BalanceOfToken1 = await erc20ContractToken1.connect(signer).balanceOf(accounts[0]);
            const BalanceOfToken2 = await erc20ContractToken2.connect(signer).balanceOf(accounts[0]);
            const BalanceOfToken11 = await isTokenApproved(erc20ContractToken1.connect(signer), accounts[0]);
            const BalanceOfToken22 = await isTokenApproved(erc20ContractToken2.connect(signer), accounts[0]);
            setIsToken1Approved(BalanceOfToken11);
            setIsToken2Approved(BalanceOfToken22);
            const poolAmountT1 = await erc20ContractToken1.balanceOf(currentPool.pairAddress);
            const poolAmountT2 = await erc20ContractToken2.balanceOf(currentPool.pairAddress);
            if (BalanceOfToken1.toString()) {
                const decimalOfToken1 = await erc20ContractToken1.connect(signer).decimals();
                setToken1Balance(roundDown(BalanceOfToken1, decimalOfToken1));
                setPoolAmountToken1(getNumberValue(poolAmountT1, decimalOfToken1));
            }

            if (BalanceOfToken2.toString()) {
                const decimalOfToken2 = await erc20ContractToken2.connect(signer).decimals();
                setToken2Balance(roundDown(BalanceOfToken2, decimalOfToken2));
                setPoolAmountToken2(getNumberValue(poolAmountT2, decimalOfToken2));
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function tokenApproval(i) {
        try {
            showModal(modalTypesEnum.CUSTOM_MODAL, {
                title1: "Waiting for token Approval",
                description: "Please give permission to access your token "
            })
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
                    }).catch(function () {
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

    async function addLiquidity() {
        waitForConfirmation();
        await contractInitialize();
        const deadline = Math.round(new Date(new Date().getTime() + deadlineMinutes * 60000) / 1000);
        contract.connect(signer).addLiquidity(
            token1,
            token2,
            currentPool.isStable,
            roundDownAndParse(formData.amountADesired,crypto1.decimal),
            roundDownAndParse(formData.amountBDesired,crypto2.decimal),
            0,
            0,
            accounts[0],
            deadline,
        ).then((result) => {
            setConfirmationWaitingModal(false)
            showModal(modalTypesEnum.TRANSACTION_SUCCESS_MODAL, {hash: result.hash})
        }).catch(function (err) {
            setConfirmationWaitingModal(false)
            showModal(modalTypesEnum.TRANSACTION_FAIL_MODAL);
            console.log(err);
        });
    }

    async function addLiquidityCANTO() {
        waitForConfirmation();
        await contractInitialize();
        const deadline = Math.round(new Date(new Date().getTime() + deadlineMinutes * 60000) / 1000);
        // const stable = crypto1.stable || crypto2.stable;

        if (crypto1.name === 'WCANTO') {

            contract.connect(signer).addLiquidityCANTO(
                token2,
                currentPool.isStable,
                roundDownAndParse(formData.amountBDesired,crypto2.decimal),
                0,
                0,
                accounts[0],
                deadline, {
                    value: roundDownAndParse(formData.amountADesired,crypto1.decimal),
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
                currentPool.isStable,
                roundDownAndParse(formData.amountADesired,crypto1.decimal),
                0,
                0,
                accounts[0],
                deadline, {
                value: roundDownAndParse(formData.amountBDesired,crypto2.decimal),
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

    const setToken1Max = (val) => {
        setFormData(oldValues => ({...oldValues, ["amountADesired"]: val.toString()}));
            const priceRatioForToken2 = poolAmountToken2 / poolAmountToken1;
            setFormData(oldValues => ({
                ...oldValues,
                ['amountBDesired']: isNaN(val * priceRatioForToken2) ? 0 : (val * priceRatioForToken2).toString()
            }));
        }

    const setToken2Max = (val) => {
        setFormData(oldValues => ({...oldValues, ["amountBDesired"]: val.toString()}));
        const priceRatioForToken1 = poolAmountToken1 / poolAmountToken2;
            setFormData(oldValues => ({
                ...oldValues,
                ['amountADesired']: isNaN(val * priceRatioForToken1) ? 0 : (val * priceRatioForToken1).toString()
            }));
        }

    const handleCheckbox = (val) => {
        setNativeCanto(val.target.checked);
    }

    return (
        <>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col lg={6}>
                        <Card>
                            <CardHeader>
                                <div className="d-flex w-100">
                                    <Link to={"/pool"} className="me-3 flex-grow-0">
                                        <img src={leftArrowImage} className="align-middle me-1" alt="back"/>
                                    </Link>
                                    <CardTitle className="align-middle flex-grow-0">Add Liquidity</CardTitle>

                                    {(crypto1.name === 'WCANTO' || crypto2.name === 'WCANTO') ? (

                                        <div className="flex-grow-1">
                                            <div className="form-check float-end">
                                                <input className="form-check-input" id="nativeCantoCheckbox"
                                                       type="checkbox" onChange={handleCheckbox}/>
                                                <label htmlFor="nativeCantoCheckbox" className="col-form-label pt-0">
                                                    Supply Native Canto
                                                </label>
                                            </div>
                                        </div>

                                    ) : ""}
                                </div>
                                <p className="mt-4 card-text">
                                    When you add liquidity, you will receive pool tokens representing your position.
                                    These tokens automatically earn proportional to your share of the pool and can be
                                    redeemed at any time.
                                </p>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col sm={12}>
                                        <div className="balance-card">
                                            <Input autoComplete="off" type="text"
                                                   value={formData.amountADesired}
                                                   onChange={setInputVal("amountADesired")}
                                                   pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.00"
                                                   spellCheck="false" className="form-control-coin" ref={token1Input}/>
                                            <div className="text-end">
                                                <button className="btn btn-forte-image py-2 px-3 ms-auto">
                                                    <img className="align-middle float-start coin-img" height="28"
                                                         src={require("../../../assets/images/coins/" + crypto1.icon)}
                                                         alt="coinImg"/>
                                                    <span className="align-middle ps-2 pe-4"> {crypto1.name}</span>
                                                </button>
                                                <div className="mt-2">
                                                    <span
                                                        className="text-balance">Balance: {token1Balance + ' ' + crypto1.name}</span>
                                                    <button className="btn button-max btn-sm ms-2"
                                                            onClick={() => setToken1Max(token1Balance)}>
                                                        Max
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="balance-card-swapper">
                                            <div className="balance-card-swapper-parent">
                                                <img src={addImage} alt="add" height="32" width="32" className="mt-0"/>
                                            </div>
                                        </div>
                                        <div className="balance-card">
                                            <Input autoComplete="off" type="text"
                                                   value={formData.amountBDesired}
                                                   onChange={setInputVal("amountBDesired")}
                                                   pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.00" max={token2Balance}
                                                   spellCheck="false" className="form-control-coin" ref={token2Input}/>
                                            <div className="text-end">
                                                <button className="btn btn-forte-image py-2 px-3 ms-auto">
                                                    <img className="align-middle float-start coin-img" height="28"
                                                         src={require("../../../assets/images/coins/" + crypto2.icon)}
                                                         alt="coinImg"/>
                                                    <span className="align-middle ps-2 pe-4"> {crypto2.name}</span>
                                                </button>
                                                <div className="mt-2">
                                                    <span
                                                        className="text-balance">Balance: {token2Balance + ' ' + crypto2.name}</span>
                                                    <button className="btn button-max btn-sm ms-2"
                                                            onClick={() => setToken2Max(token2Balance)}>
                                                        Max
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={12} className="mt-4">
                                        <p className="text-primary">Initial Prices and Pool Share</p>
                                    </Col>
                                    <Col sm={12} className="mt-4 price-info">
                                        <div className="d-flex justify-content-evenly">
                                            <div className="text-center flex-grow-1">
                                                <span className="title">--</span>
                                                <p className="mb-0 sub-title">{crypto1.name}</p>
                                            </div>
                                            <div className="text-center border-start border-end flex-grow-1">
                                                <span className="title">--</span>
                                                <p className="mb-0 sub-title">{crypto2.name}</p>
                                            </div>
                                            <div className="text-center flex-grow-1">
                                                <span className="title">--</span>
                                                <p className="mb-0 sub-title">Share of Pool </p>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={12} className={(!isToken1Approved || !isToken2Approved) ? "m-5" : "mb-5" }>
                                        <div className="d-flex">
                                            {(crypto1 && !isToken1Approved) ?
                                                <button className="btn btn-primary flex-grow-1 me-1 pe-4 min-h-50"
                                                        onClick={() => tokenApproval(1)}>
                                                    <img className="align-middle float-start coin-img" height="28"
                                                         src={require("../../../assets/images/coins/" + crypto1.icon)}
                                                         alt="coinImg"/>
                                                    <span
                                                        className="align-middle flex-grow-1">Approve {crypto1.name}</span>
                                                </button>
                                                : null}

                                            {(crypto2 && !isToken2Approved) ?
                                                <button className="btn btn-primary flex-grow-1 ms-1 pe-4 min-h-50"
                                                        onClick={() => tokenApproval(2)}>
                                                    <img className="align-middle float-start coin-img" height="28"
                                                         src={require("../../../assets/images/coins/" + crypto2.icon)}
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
                                                className="btn btn-lg btn-primary align-items-center` py-4` btn-starch fs-6">
                                            Add
                                        </button>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm={12}>
                        {/*Info: Preview Modal */}
                        <Modal isOpen={previewModal} backdrop={true} keyboard={false} centered={true}>
                            <ModalHeader toggle={togglePreviewModal}>Preview</ModalHeader>
                            <ModalBody>
                                <Row>
                                    {/*<Col sm={12}>{JSON.stringify(formData)}</Col>*/}
                                    <Col sm={12}>
                                        <div className="balance-card-group">
                                            <div className="balance-card">
                                                <span
                                                    className="align-middle coin-value">{formData.amountADesired}</span>
                                                <div className="text-end">
                                                    <div className="align-items-center px-3">
                                                        <img className="me-2 align-middle coin-img" alt="coinImg"
                                                             src={require("../../../assets/images/coins/" + crypto1.icon)}
                                                             height="30" width="30"/>
                                                        <span className="align-middle coin-symbol">{crypto1.name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="balance-card-swapper">
                                                <div className="balance-card-swapper-parent">
                                                    <img src={addImage} alt="add" height="24" width="24"/>
                                                </div>
                                                <div className="separator"/>
                                            </div>
                                            <div className="balance-card">
                                                <span
                                                    className="align-middle coin-value">{formData.amountBDesired}</span>
                                                <div className="text-end">
                                                    <div className="align-items-center px-3">
                                                        <img className="me-2 align-middle coin-img" alt="coinImg"
                                                             src={require("../../../assets/images/coins/" + crypto2.icon)}
                                                             height="30" width="30"/>
                                                        <span className="align-middle coin-symbol">{crypto2.name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={12} className="mt-4">
                                        <div className="h6">Pool Details</div>
                                        <hr className="mt-4"/>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-secondary">{crypto1.name}/{crypto2.name} Burned</span>
                                            <span className="text-end text-primary">0.3456494</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-secondary ">Rates</span>
                                            <div>
                                                <div className="text-primary text-end">1{crypto1.name} = 0.00 TPK</div>
                                                <div className="text-primary text-end">1{crypto2.name} = 0.00 BMC</div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={12} className="mt-3">
                                        <div className="d-flex">
                                            <div className="info-wrapper">
                                                <img className="align-middle" src={infoImage} alt="info"
                                                     height="20" width="20"/>
                                            </div>
                                            <p className="flex-grow-1 text-secondary">
                                                Important Information - Here will be a note informing you about
                                                estimated output and revert of transaction.
                                            </p>
                                        </div>
                                    </Col>
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
                                <Button color="none" onClick={isNativeCANTO ? addLiquidityCANTO : addLiquidity}
                                        className="btn-starch btn btn-lg">
                                    Confirm to Add
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
                                            <b>Adding {formData.amountADesired + ' ' + crypto1.name} and&nbsp;
                                                {formData.amountBDesired + ' ' + crypto2.name}
                                            </b>
                                            <br/>
                                            Confirm this transaction in your wallet
                                        </p>
                                    </Col>
                                </Row>
                            </ModalBody>
                        </Modal>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

const mapStateToProps = state => {
    return {
        data: state
    };
};
export default connect(mapStateToProps)(Add);
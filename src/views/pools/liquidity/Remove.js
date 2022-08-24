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
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import infoImage from "../../../assets/images/info.svg";
import {cryptoCoinsEnum, modalTypesEnum} from "../../../staticData";
import collect from 'collect.js';
import detectEthereumProvider from "@metamask/detect-provider";
import {ethers} from "ethers";
import {APPROVAL_TOKENS, balanceOfABI, CONTRACT_ABI, CONTRACT_ADDRESS} from "../../../config";
import {useGlobalModalContext} from "../../../components/modal/GlobalModal";
import {getTokenData, isTokenApproved} from "../../../helper";
import {connect} from "react-redux";

function Remove(props) {
    let signer, web3Provider, erc20ContractLp, contract, accounts;
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
    const [previewModal, setPreviewModal] = useState(false);
    const [crypto1] = useState(getTokenData(tokens[1]));
    const [crypto2] = useState(getTokenData(tokens[2]));
    const [token1,setToken1] = useState(currentPool.address.token1 || "");
    const [token2,setToken2] = useState(currentPool.address.token2 || "");
    const [confirmationWaitingModal, setConfirmationWaitingModal] = useState(false);
    const deadlineMinutes = 30;
    const {showModal} = useGlobalModalContext();
    const [formData, setFormData] = useState({
        liquidity: "",
    });
    const togglePreviewModal = () => setPreviewModal(!previewModal);
    const toggleConfirmationWaitingModal = () => setConfirmationWaitingModal(!confirmationWaitingModal);
    const setInputVal = name => {
        return ({target: {value}}) => {
            setFormData(oldValues => ({...oldValues, [name]: value}));
        }
    };

    const waitForConfirmation = () => {
        togglePreviewModal();
        toggleConfirmationWaitingModal();
    }



    const contractInitialize = async () => {
        try {
            let provider = await detectEthereumProvider();
            if (provider) {
                web3Provider = new ethers.providers.Web3Provider(window.ethereum);
                contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Provider);
                accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                signer = web3Provider.getSigner();
                erc20ContractLp = new ethers.Contract(currentPool.pairAddress, balanceOfABI, web3Provider);
            } else {
                console.log("Install the metamask extension first !");
            }
        } catch (e) {
            console.log("Ensure that you are connecting the correct wallet address with Metamask");
        }
    }

    const LpApproval = async () => {
        const tokenApproval = await isTokenApproved(await erc20ContractLp.connect(signer), accounts[0]);
        if (!tokenApproval) {
            const transaction = await erc20ContractLp.connect(signer).approve(CONTRACT_ADDRESS, APPROVAL_TOKENS);
            const receipt = await transaction.wait();
            return true;
        } else {
            return true;
        }
    }

    async function removeLiquidity() {
        waitForConfirmation();
        await contractInitialize();
        const approval = await LpApproval();
        if (approval) {
            const decimalLiquidity = new ethers.utils.parseUnits(formData.liquidity, 18);
            const deadline = Math.round(new Date(new Date().getTime() + deadlineMinutes * 60000) / 1000);
            contract.connect(signer).removeLiquidity(
                token1,
                token2,
                currentPool.isStable,
                decimalLiquidity,
                0,
                0,
                accounts[0],
                deadline,
            ).then((result) => {
                setConfirmationWaitingModal(false)
                showModal(modalTypesEnum.TRANSACTION_SUCCESS_MODAL, {
                    hash: result.hash,
                    title: "You removed liquidity!"
                })
            }).catch(function (err) {
                console.log(err);
                setConfirmationWaitingModal(false)
                showModal(modalTypesEnum.TRANSACTION_FAIL_MODAL);
            });
        }else{
            showModal(modalTypesEnum.TRANSACTION_FAIL_MODAL);
        }
    }

    const setLiquidityMax = () => {
        setFormData(oldValues => ({...oldValues, ["liquidity"]: currentPool.userLpBalance.toString()}));
    };

    return (
        <Container className="mt-5">
            <Row className={"justify-content-center"}>
                <Col lg={6}>
                    <Card>
                        <CardHeader>
                            <div className="d-flex">
                                <Link to={"/"} className="me-3">
                                    <img src={leftArrowImage} className="align-middle me-1" alt="back"/>
                                </Link>
                                <CardTitle tag='h3'>Remove Liquidity</CardTitle>
                            </div>
                            <p className="mt-4 text-secondary">
                                When you remove liquidity, you will receive pool tokens representing your position.
                                These tokens automatically earn proportional to your share of the pool and can be
                                redeemed at any time.
                            </p>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col sm={12}>
                                    <div className="balance-card">
                                        <Input autoComplete="off" type="text" onChange={setInputVal("liquidity")}
                                               pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.00"
                                               value={formData.liquidity}
                                               spellCheck="false" className="form-control-coin"/>
                                        <div className="text-end">
                                            <button
                                                className="btn btn-forte-image align-items-center d-flex py-2 px-3 ms-auto">
                                                <div className="coin-group me-2">
                                                    <div className="coin pull-up">
                                                        <img alt="coinImg" height="35" width="35"
                                                             src={require("../../../assets/images/coins/" + crypto1.icon)}/>
                                                    </div>
                                                    <div className="coin pull-up">
                                                        <img alt="coinImg" height="35" width="35"
                                                             src={require("../../../assets/images/coins/" + crypto2.icon)}/>
                                                    </div>
                                                </div>
                                                <span
                                                    className="align-middle"> {crypto1.name + '/' + crypto2.name} </span>
                                            </button>
                                            <div className="mt-2">
                                                <span className="text-balance">Balance: {currentPool.userLpBalance} LP Tokens</span>
                                                <button className="btn btn-outline-light btn-sm ms-2 fw-normal"
                                                        onClick={setLiquidityMax}>
                                                    Max
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <div className="balance-card d-block">
                                        <Row className={"mt-4 pb-3 border-bottom d-flex text-center "}>
                                            <Col md={12} className={"pb-3 d-flex"}>
                                                <h5 className="pe-3">Preview</h5>
                                                <span>Your Position</span>
                                            </Col>
                                            <Col md={4}>
                                                <div className="coin-group text-center pe-2 d-block">
                                                    <div className="coin pull-up">
                                                        <img alt="coinImg" height="35" width="35"
                                                             src={require("../../../assets/images/coins/" + crypto1.icon)}/>
                                                    </div>
                                                    <div className="coin pull-up">
                                                        <img alt="coinImg" height="35" width="35"
                                                             src={require("../../../assets/images/coins/" + crypto2.icon)}/>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={4} className="border-start border-end">
                                                <h6>{crypto1.name + '/' + crypto2.name}  </h6>
                                            </Col>
                                            <Col md={4}>
                                                <h6>0.288</h6>
                                            </Col>
                                        </Row>
                                        <Row className="mt-4 pb-3 text-center">
                                            <Col md={4}>
                                                <h6>{currentPool.myPool.token1}</h6>
                                                <p className={"mb-0"}>{crypto1.name}</p>
                                            </Col>
                                            <Col md={4} className=" border-start border-end">
                                                <h6>{currentPool.myPool.token2}</h6>
                                                <p className={"mb-0"}>{crypto2.name}</p>
                                            </Col>
                                            <Col md={4}>
                                                <h6>{(currentPool.share)} %</h6>
                                                <p className={"mb-0"}>Share of Pool </p>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col sm={12} className={"mt-5"}>
                                    <button onClick={togglePreviewModal}
                                            className="btn btn-lg btn-primary align-items-center py-4 btn-starch fs-6">
                                        Withdraw
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
                                <div className="h6">Pool Details</div>
                                <hr className="mt-4"/>
                                <div className="d-flex justify-content-between pt-2">
                                    <span className="text-secondary"> {crypto1.name + '/' + crypto2.name} Burned</span>
                                    <span className="text-end text-primary ">{formData.liquidity}</span>
                                </div>
                                <div className="d-flex justify-content-between pt-2">
                                    <span className="text-secondary">Rates</span>
                                    <div>
                                        <div className="text-primary">1{crypto1.name} = 0.00 {crypto2.name}</div>
                                        <div className="text-primary">1{crypto2.name} = 0.00 {crypto1.name}</div>
                                    </div>
                                </div>
                            </Col>
                            <hr className="mt-4"/>
                            <Col sm={12}>
                                <div className="d-flex justify-content-between">
                                    <span className="text-secondary">Your Pooled Tokens</span>
                                    <span className="text-end text-primary">{formData.liquidity}</span>
                                </div>
                                <div className="d-flex justify-content-between pt-2">
                                    <span className="text-secondary">Pooled {crypto1.name}</span>
                                    <span
                                        className="text-end text-primary">{currentPool.myPool.token1} {crypto1.name}</span>
                                </div>
                                <div className="d-flex justify-content-between pt-2">
                                    <span className="text-secondary">Pooled {crypto2.name}</span>
                                    <span
                                        className="text-end  text-primary">{currentPool.myPool.token2} {crypto2.name}</span>
                                </div>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <div className="d-flex">
                                    <div className="info-wrapper">
                                        <img className="align-middle" src={infoImage} alt="info" height="20"
                                             width="20"/>
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
                                    <span className="text-end">0.00 %</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-secondary">Network Fee</span>
                                    <span className="text-end">--</span>
                                </div>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter className="with-bg full-btn">
                        <Button color="none" onClick={removeLiquidity} className="btn-starch btn btn-lg">
                            Confirm to Withdraw
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
                                    {/*<b>Removing 0.8292 UNI and 2.9989 ETH</b>*/}
                                    Removing {formData.liquidity} {crypto1.name + '/' + crypto2.name}
                                    <br/>
                                    Confirm this transaction in your wallet
                                </p>
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>
            </Row>
        </Container>
    )
}

const mapStateToProps = (state) => {
    return {
        data: state
    };
};
export default connect(mapStateToProps)(Remove);
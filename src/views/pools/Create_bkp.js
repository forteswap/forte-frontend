import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Container, Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from "reactstrap";
import {Link} from "react-router-dom";
import leftArrowImage from "../../assets/images/left-arrow.svg";
import chainImage from "../../assets/images/chain.svg";
import downArrowImage from "../../assets/images/down-arrow.svg"
import {useEffect, useState} from "react";
import CryptoListModal from "../../components/modal/CryptoList.js";
import coinImage from "../../assets/images/coin.svg";
import {cryptoCoinsEnum, modalTypesEnum} from "../../staticData.js";
import {useGlobalModalContext} from "../../components/modal/GlobalModal.js";
import TokenImage from "../../components/Image/token.tsx";

const Create = () => {
    const { showModal } = useGlobalModalContext();
    const [previewModal, setPreviewModal] = useState(false);
    const [confirmationWaitingModal, setConfirmationWaitingModal] = useState(false);
    const [transactionSuccessModal, setTransactionSuccessModal] = useState(false);
    const [crypto1, setCrypto1] = useState(cryptoCoinsEnum.eth);
    const [crypto2, setCrypto2] = useState(null);

    const [cryptoModal2, setCryptoModal2] = useState(false);

    const togglePreviewModal = () => setPreviewModal(!previewModal);
    const toggleConfirmationWaitingModal = () => setConfirmationWaitingModal(!confirmationWaitingModal);
    const toggleTransactionSuccessModal = () => setTransactionSuccessModal(!transactionSuccessModal);

    const toggleCryptoModal2 = () => setCryptoModal2(!cryptoModal2);

    const waitForConfirmation = () => {
        togglePreviewModal();
        toggleConfirmationWaitingModal();
    }

    const transactionSuccess = () => {
        toggleConfirmationWaitingModal();
        toggleTransactionSuccessModal();
    }

    const cryptoUpdate = (type, value) => {
        switch (type) {
            case 1:
                setCrypto1(value);
                break;
            case 2:
                if(value.name !== crypto1.name) {
                    setCrypto2(value);
                }else{
                    setCrypto2(null);
                }
                setCryptoModal2(false);
                break;
        }
    }

    return (
        <>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col lg={6}>
                        <Card>
                            <CardHeader>
                                <div className="d-flex">
                                    <Link to={"/"} className="me-3">
                                        <img src={leftArrowImage} className="align-middle me-1" alt="back"/>
                                    </Link>
                                    <CardTitle tag='h3'>Create a Pool</CardTitle>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col sm={12}>
                                        <div className="balance-card">
                                            <Input autoComplete="off" type="text"
                                                   pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.00"
                                                   spellCheck="false" className="form-control-coin"/>
                                            <div className="text-end">
                                                <button className="btn btn-forte-image py-1">
                                                    {
                                                        crypto1 ?
                                                            <>
                                                                <TokenImage src={crypto.icon} height={28} width={28}/>
                                                                <span className="align-middle ps-2 pe-4"> {crypto1.name}</span>
                                                            </>
                                                            : <>
                                                                <span className="align-middle ps-2 pe-2">Select a Token</span>
                                                            </>
                                                    }
                                                </button>
                                                <div className="mt-2">
                                                    <span className="text-balance">Balance: 0.657 ETH</span>
                                                    <button className="btn btn-forte-primary btn-sm ms-2 text-white">
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
                                                   pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.00"
                                                   spellCheck="false" className="form-control-coin"/>
                                            <div className="text-end">
                                                <button className="btn btn-forte-image py-1"
                                                        onClick={toggleCryptoModal2}>
                                                    {
                                                        crypto2 !== null ?
                                                            <>
                                                                <TokenImage src={crypto2.icon} height={28} width={28}/>
                                                                <span className="align-middle ps-2 pe-4"> {crypto2.name}</span>
                                                            </>
                                                            : <>
                                                                <span className="align-middle ps-2 pe-2">Select a Token</span>
                                                            </>
                                                    }
                                                </button>
                                                <CryptoListModal isOpen={cryptoModal2}
                                                                 onValueUpdate={val => cryptoUpdate(2, val)}/>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={12} className="mt-4">
                                        <p className="text-primary">Initial Prices and Pool Share</p>
                                    </Col>
                                    <Col sm={12} className="mt-4 price-info">
                                        <div className="d-flex justify-content-evenly">
                                            <div className="text-center flex-grow-1">
                                                <h6>3.12345</h6>
                                                <p className="mb-0">TKP and BMC</p>
                                            </div>
                                            <div className="text-center border-start border-end flex-grow-1">
                                                <h6>0.29</h6>
                                                <p className="mb-0">BMC per TKP</p>
                                            </div>
                                            <div className="text-center flex-grow-1">
                                                <h6>100%</h6>
                                                <p className="mb-0">Share of Pool</p>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={12} className="mt-3">
                                        <div className="d-flex">
                                            <button className="btn btn-forte-image flex-grow-1 me-1 pe-4 min-h-50">
                                                <img className="align-middle float-start" src={chainImage}
                                                     alt="coinImg"/>
                                                <span className="align-middle flex-grow-1">Approve ETH</span>
                                            </button>
                                            <button className="btn btn-forte-image flex-grow-1 ms-1 pe-4 min-h-50">
                                                <img className="align-middle float-start" src={chainImage}
                                                     alt="coinImg"/>
                                                <span className="align-middle flex-grow-1">Approve BMC</span>
                                            </button>
                                        </div>
                                    </Col>
                                    <Col sm={12} className="mt-3">
                                        <button onClick={togglePreviewModal}
                                                className="btn btn-lg btn-forte-primary align-items-center py-3 btn-starch">
                                            <span className="align-middle flex-grow-1">Add</span>
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
                                    <Col sm={12}>
                                        <div className="balance-card-group">
                                            <div className="balance-card">
                                                <div>
                                                    <small className="text-primary">Pair</small>
                                                    <span className="align-middle coin-value ps-2">BMC/TKP</span>
                                                </div>
                                                <div className="text-end">
                                                    <div className="coin-group pe-2">
                                                        <div className="coin pull-up">
                                                            <TokenImage src={coinImage}/>
                                                        </div>
                                                        <div className="coin pull-up">
                                                            <TokenImage src={coinImage}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={12} className="mt-4">
                                        <div className="h6">Pool Details</div>
                                        <hr className="mt-4"/>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-secondary">BMC Deposited</span>
                                            <span className="text-end text-primary">1340</span>
                                        </div>
                                        <div className="d-flex justify-content-between pt-2">
                                            <span className="text-secondary">TKP Deposited</span>
                                            <span className="text-end text-primary">5000</span>
                                        </div>
                                        <div className="d-flex justify-content-between pt-2">
                                            <span className="text-secondary">Rates</span>
                                            <div className="text-primary">
                                                <div>1BMC = 0.00 TPK</div>
                                                <div>1TKP = 0.00 BMC</div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between pt-2">
                                            <span className="text-secondary">Share of Pool</span>
                                            <span className="text-end text-primary">100%</span>
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
                                            <span className="text-end">~$14.50</span>
                                        </div>
                                    </Col>
                                </Row>
                            </ModalBody>
                            <ModalFooter className="with-bg full-btn">
                                <Button color="none" onClick={waitForConfirmation} className="btn-starch btn btn-lg">
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
                                            <b>Adding 0.8292 UNI and 2.9989 ETH</b>
                                            <br/>
                                            Confirm this transaction in your wallet
                                        </p>
                                        <div className="d-flex flex-wrap">
                                            <Button className="btn btn-forte-primary align-items-center px-3 btn-starch"
                                                    onClick={() => showModal(modalTypesEnum.TRANSACTION_SUCCESS_MODAL)}>
                                                Success
                                            </Button>
                                            <Button className="btn btn-forte-primary align-items-center px-3 btn-starch"
                                                    onClick={() => showModal(modalTypesEnum.SIGNATURE_FAIL_MODAL)}>
                                                Signature Fail
                                            </Button>
                                            <Button className="btn btn-forte-primary align-items-center px-3 btn-starch"
                                                    onClick={() => showModal(modalTypesEnum.NETWORK_ERROR_MODAL)}>
                                                Network Error
                                            </Button>
                                            <Button className="btn btn-forte-primary align-items-center px-3 btn-starch"
                                                    onClick={() => showModal(modalTypesEnum.TRANSACTION_CANCELED_MODAL)}>
                                                Transaction Canceled
                                            </Button>
                                            <Button className="btn btn-forte-primary align-items-center px-3 btn-starch"
                                                    onClick={() => showModal(modalTypesEnum.TRANSACTION_REJECTED_MODAL)}>
                                                Transaction Rejected
                                            </Button>
                                            <Button className="btn btn-forte-primary align-items-center px-3 btn-starch"
                                                    onClick={() => showModal(modalTypesEnum.TRANSACTION_FAIL_MODAL)}>
                                                Transaction Fail
                                            </Button>
                                            <Button className="btn btn-forte-primary align-items-center px-3 btn-starch"
                                                    onClick={() => showModal(modalTypesEnum.CUSTOM_MODAL,{
                                                        title1:"Title1",
                                                        title2:"Line 2",
                                                        description:"sample description"
                                                    })}>
                                                Custom
                                            </Button>
                                        </div>
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

export default Create;
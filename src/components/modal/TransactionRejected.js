import {useEffect, useState} from "react";
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {useNavigate} from "react-router";
import polygonImg from "../../assets/images/polygon.svg";
import {useGlobalModalContext} from "./GlobalModal";

const TransactionRejectedModal = (props) => {
    const { hideModal, store } = useGlobalModalContext();
    const { modalProps } = store || {};
    const { isSwap } = modalProps || {};
    const navigate = useNavigate();

    const toggleIsOpenModal = () => {
        hideModal();
    };

    const poolIndex = () => {
        navigate('/pool');
        hideModal();
    }

    const swapIndex = () => {
        navigate('/');
        hideModal();
    }
    return (
        <>
            <Modal isOpen={true} backdrop={true} keyboard={false} centered={true}>
                <ModalHeader toggle={toggleIsOpenModal}></ModalHeader>
                <ModalBody>
                    <Row>
                        <Col sm="12" className="text-center">
                            <img src={polygonImg} height="125" width="125" className="mb-3"/>
                            <div className="h5">
                                Transaction Rejected
                            </div>
                            <hr className="mt-4 "/>
                            <p className="mt-3 text-secondary">
                                There was an error with your transaction.
                            </p>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className="with-bg full-btn">
                    {isSwap ?
                        <Button onClick={swapIndex} color="none" className="btn-starch btn btn-lg">
                            Return to Swap
                        </Button>
                        :
                        <Button onClick={poolIndex} color="none" className="btn-starch btn btn-lg">
                            Return to Pools
                        </Button>
                    }
                </ModalFooter>
            </Modal>
        </>
    );
}

export default TransactionRejectedModal;
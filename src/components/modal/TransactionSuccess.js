import {useEffect, useState} from "react";
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {useNavigate} from "react-router";
import ellipseImg from "../../assets/images/ellipse.svg";
import {useGlobalModalContext} from "./GlobalModal";

const TransactionSuccessModal = (props) => {
    const { hideModal, store } = useGlobalModalContext();
    const { modalProps } = store || {};
    const { hash, title, isSwap } = modalProps || {};
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
                            <img src={ellipseImg} height="125" width="125" className="mb-3"/>
                            <div className="h5">
                                Congrats! <br/>{title || "You have added liquidity!"}
                            </div>
                            <hr className="mt-4 "/>
                            <p className="mt-3 text-secondary">
                                Now you can check liquidity from the pool list
                            </p>
                            <a className="text-secondary" href={"https://evm.explorer.canto.io/tx/"+ hash}
                               target="_blank" rel="noreferrer">
                                <b>View on evm.explorer.canto.io</b>
                            </a>
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

export default TransactionSuccessModal;
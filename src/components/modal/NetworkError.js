import {useEffect, useState} from "react";
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {useNavigate} from "react-router";
import ellipseImg from "../../assets/images/ellipse.svg";
import {useGlobalModalContext} from "./GlobalModal";

const NetworkErrorModal = (props) => {
    const { hideModal, store } = useGlobalModalContext();
    // const { modalProps } = store || {};
    // const { title, confirmBtn } = modalProps || {};
    const navigate = useNavigate();

    const toggleIsOpenModal = () => {
        hideModal();
    };

    const poolIndex = () => {
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
                                The network is currently unavailable.
                            </div>
                            <hr className="mt-4 "/>
                            <p className="mt-3 text-secondary">
                                Sorry about that! Please wait or check back in later.
                            </p>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className="with-bg full-btn">
                    <Button onClick={poolIndex} color="none" className="btn-starch btn btn-lg">
                        Return to Pools
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default NetworkErrorModal;
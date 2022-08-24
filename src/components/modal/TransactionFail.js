import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import ellipseImg from "../../assets/images/ellipse.svg"

import {useNavigate} from "react-router";
import {useGlobalModalContext} from "./GlobalModal";

const TransactionFailModal = () => {
    const {hideModal} = useGlobalModalContext();
    // const { hideModal, store } = useGlobalModalContext();
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
                <ModalHeader toggle={toggleIsOpenModal}/>
                <ModalBody>
                    <Row>
                        <Col sm="12" className="text-center">
                            <img src={ellipseImg} height="125" width="125" className="mb-3" alt="waring"/>
                            <div className="h5">
                                Transaction did not go through.
                            </div>
                            <hr className="mt-4 "/>
                            <a className="mt-3">
                                Try again
                            </a>
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

export default TransactionFailModal;
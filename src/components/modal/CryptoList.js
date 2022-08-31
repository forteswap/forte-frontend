import {useEffect, useState} from "react";
import {Button, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {ERC20_CONTRACT} from "../../config";
import {cryptoCoinsEnum} from "../../staticData";
import {ethers} from "ethers";

const CryptoListModal = (props) => {
    const {onValueUpdate} = props;
    const [cryptoList, setCryptoList] = useState([]);
    const [newAddress, setNewAddress] = useState("");

    useEffect(() => {
        updateCryptoList(Object.values(cryptoCoinsEnum));
    }, [props.skipToken]);

    const updateCryptoList = () => {
        let list = [];
        for (let crypto of Object.values(cryptoCoinsEnum)){
            if(props.skipToken !== crypto.address) {
                list.push(<Col sm={12} key={crypto.name}>
                    <div className="crypto-block" onClick={() => onValueUpdate(crypto)}>
                        <div className="coin-group pe-2">
                            <div className="coin pull-up">
                                <img src={require("../../assets/images/coins/" + crypto.icon)} alt="coinImg" height="35"
                                     width="35"/>
                            </div>
                        </div>
                        <div className="crypto-title">{crypto.title}</div>
                        <div className="crypto-name">{crypto.name}</div>
                    </div>
                </Col>);
            }
        }
        setCryptoList(list);
    }


    const addToken = async () => {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(newAddress, ERC20_CONTRACT, web3Provider);
        const tokenName = await contract.name();
        const symbol = await contract.symbol();
        const cryptoCoin = {
            icon: "question.png",
            title: tokenName,
            name: symbol,
            address: newAddress,
            decimal: 18,
            stable: false,
        };
        onValueUpdate(cryptoCoin);
    }
    return (
        <>
            <Modal scrollable={true} isOpen={props.isOpen} backdrop={true} keyboard={true} centered={true}
                   toggle={() => onValueUpdate(null)}>
                <ModalHeader toggle={() => onValueUpdate(null)}>Select a Token</ModalHeader>
                <Input className="mx-2 w-auto mb-2 with-bg" autoComplete="off" type="text"
                       placeholder="Custom token address"
                       onChange={(val) => setNewAddress(val.target.value)}
                />
                <ModalBody className="pt-0">
                    <Row>
                        <Col sm={12}>
                            <Row>
                                {cryptoList}
                            </Row>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className="with-bg full-btn">
                    <Button color="none" className="btn-starch btn btn-lg" onClick={addToken}>
                        Add Token
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default CryptoListModal;
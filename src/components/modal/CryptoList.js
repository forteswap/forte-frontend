import {useEffect, useState} from "react";
import {Col, Input, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {ERC20_CONTRACT} from "../../config";
import {cryptoCoinsEnum} from "../../staticData";
import {ethers} from "ethers";

const CryptoListModal = (props) => {
    const {onValueUpdate} = props;
    const [cryptoList, setCryptoList] = useState([]);

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

    const onKeyPressHandler = async (e) => {
         if (e.key === 'Enter') {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(e.target.value, ERC20_CONTRACT, web3Provider);
            const tokenName = await contract.name();
            const symbol = await contract.symbol();
             const cryptoCoin = {
                icon: "question.png",
                title: tokenName,
                name: symbol,
                address: e.target.value,
                decimal: 18,
                stable:false,
            };
            onValueUpdate(cryptoCoin);
         }
     };

    return (
        <>
            <Modal scrollable={true} isOpen={props.isOpen} backdrop={true} keyboard={false} centered={true}>
                <ModalHeader toggle={() => onValueUpdate(null)}>Select a Token</ModalHeader>
                <Input className="mx-2 w-auto mb-2 with-bg" autoComplete="off" type="text"
                       onKeyPress={onKeyPressHandler} placeholder="Custom token address"
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
            </Modal>
        </>
    );
}

export default CryptoListModal;
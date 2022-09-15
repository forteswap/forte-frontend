import {
    Button,
    Card,
    CardHeader,
    CardTitle,
    Col,
    Container,
    Input, Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table, UncontrolledAccordion
} from "reactstrap";
import loader from '../../assets/images/loader.gif';
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {modalTypesEnum} from "../../staticData";
import {connect} from "react-redux";
import {getPoolData, getTokenData, roundDownForSwap} from "../../helper";
import {collect} from "collect.js";
import {useGlobalModalContext} from "../../components/modal/GlobalModal";
import {ethers} from "ethers";
import {PAIR_ABI} from "../../config";
import React from "react";
import BigScreenPoolList from "../../components/BigScreenPoolList";
import SmallScreenPoolList from "../../components/SmallScreenPoolList";

function Index(props) {
    const [tableData, setTableData] = useState([]);
    const [myTableData, setMyTableData] = useState([]);
    const [tableDataCount, setTableDataCount] = useState(0);
    const [myTableDataCount, setMyTableDataCount] = useState(0);
    const [tableList, setTableList] = useState([]);
    const [table2List, setTable2List] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [isMyPosition, setIsMyPosition] = useState(false);
    const [themeMode] = useState("dark-mode");
    const [allItemPage, setAllItemPage] = useState(10);
    const [myItemPage, setMyItemPage] = useState(10);
    const [selectedPair, setSelectedPair] = useState({claim : { token1: "",token2: ""}, pairAddress: ""});
    const [rewardModal, setRewardModal] = useState(false);
    const toggleRewardModal = () => setRewardModal(!rewardModal);
    const [crypto1,setCrypto1] = useState(null);
    const [crypto2,setCrypto2] = useState(null);

    const {showModal} = useGlobalModalContext();

    useEffect(() => {
        setTableData(props.data);
        let filter = props.data.filter(val => {
            return parseFloat(val.myPool.token1) > 0 && parseFloat(val.myPool.token2) > 0;
        });
        setMyTableData(filter);
    }, [props.data]);

    useEffect(() => {
        getPoolData().then()
    }, []);

    useEffect(() => {
        filterList();
    }, [tableData, myTableData, allItemPage, myItemPage, filterText, isMyPosition]);

    const filterList = () => {
        let poolList;
        if (isMyPosition) {
            poolList = myTableData;
        } else {
            poolList = tableData;
        }
        if (filterText) {
            poolList = poolList.filter(val => {
                return (val.pairName.toLowerCase().includes(filterText.toLowerCase()) ||
                    val.pairAddress.toLowerCase().includes(filterText.toLowerCase()) ||
                    val.address.token1.toLowerCase().includes(filterText.toLowerCase()) ||
                    val.address.token2.toLowerCase().includes(filterText.toLowerCase()));
            });
        }
        if (isMyPosition) {
            setMyTableDataCount(poolList.length);
            poolList = collect(poolList).take(myItemPage);
        } else {
            setTableDataCount(poolList.length);
            poolList = collect(poolList).take(allItemPage);
        }
        updateTableList(poolList).then();
    }

    const changePosition = (val) => {
        setIsMyPosition(val.target.checked);
        setFilterText('');
    }

    const selectRewardPair = (pair) => {
        setSelectedPair(pair);
        setCrypto1(getTokenData(pair.token1Name))
        setCrypto2(getTokenData(pair.token2Name))
        setRewardModal(true);
    }

    const claimReward = async (LpAddress) => {
        try {
            setRewardModal(false);
            showModal(modalTypesEnum.CONFIRMATION_WAITING, {msg: "Claim withdrawing from "+selectedPair.pairName})
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = web3Provider.getSigner();
            const contract = new ethers.Contract(LpAddress, PAIR_ABI, web3Provider);
            const transaction = await contract.connect(signer).claimFees();
            transaction.wait();
            if(transaction.hash){
                getPoolData().then()
                showModal(modalTypesEnum.TRANSACTION_SUCCESS_MODAL, {
                    hash: transaction.hash,
                    title:"You have claimed your token",
                    hidePoolListMsg: true
                })

            }else{
                showModal(modalTypesEnum.TRANSACTION_FAIL_MODAL);
            }
        } catch (e) {
            showModal(modalTypesEnum.TRANSACTION_FAIL_MODAL);
        }
    }

    const updateTableList = async (poolList) => {
        let pairForBigScreenList = [];
        let pairForSmallScreenList = [];

        for (let pair of poolList) {
            pairForBigScreenList.push(
                <BigScreenPoolList pair={pair} themeMode={themeMode} selectRewardPair={(pair) => selectRewardPair(pair)}/>
            );
            pairForSmallScreenList.push(
                <SmallScreenPoolList pair={pair} themeMode={themeMode} selectRewardPair={(pair) => selectRewardPair(pair)}/>
            );
        }
        setTableList(pairForBigScreenList);
        setTable2List(pairForSmallScreenList);
    }

    return (
        <Container className="mt-md-5 pool">
            <Row>
                <Col>
                    <Card>
                        <CardHeader className='align-items-center align-items-start border-bottom'>
                            <Row>
                                <Col xs={5}>
                                    <CardTitle tag='h3' className="mt-2">Pools</CardTitle>
                                </Col>
                                <Col xs={7}>
                                    <div className='mt-md-0 float-end'>
                                        <Link to="/pool/create" className="btn btn-primary wallet-button">Create a Pool</Link>
                                    </div>
                                </Col>
                            </Row>
                        </CardHeader>
                        <Row className='mx-0 py-md-3'>
                            <Col className='d-flex align-items-center mt-1 form-switch my-position' md='6' sm='12'>
                                <label className={"me-1 form-label " + (!isMyPosition ? 'label-selected' : '')}>
                                    All Positions
                                </label>
                                <label className="ms-5 me-2 form-label">
                                    <input className="form-check-input cursor-pointer form-control" type="checkbox"
                                           role="switch" onChange={changePosition}/>
                                </label>
                                <label className={"me-1 form-label " + (isMyPosition ? 'label-selected' : '')}>
                                    My Positions
                                </label>
                            </Col>
                            <Col className='d-flex align-items-center justify-content-end my-1' md='6' sm='12'>
                                <Input
                                    value={filterText}
                                    className='dataTable-filter with-bg'
                                    type='text'
                                    id='search-input'
                                    placeholder="Search Token or Address"
                                    onChange={(val) => setFilterText(val.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='pool-list justify-content-end mx-0'>
                            <Col md='12' sm='12'>
                                <Table responsive>
                                    <thead>
                                    <tr>
                                        <th>Pair</th>
                                        <th className="text-center sm-hidden">Wallet</th>
                                        <th className="text-center sm-hidden">My Pool Amount</th>
                                        <th className="text-center sm-hidden">Total Pool Amount</th>
                                        <th className="text-center sm-hidden">Add or Remove Liquidity</th>
                                    </tr>
                                    </thead>
                                    {tableList.length ?
                                        <>
                                            <tbody className="d-none sm-show">
                                                <UncontrolledAccordion defaultOpen="1">
                                                    {table2List}
                                                </UncontrolledAccordion>
                                            </tbody>
                                            <tbody className="sm-hidden">
                                                {tableList}
                                            </tbody>
                                        </>
                                        :
                                        <tbody>
                                            <tr>
                                                <td colSpan={6} className="text-muted text-center py-5">
                                                    <img src={loader} alt="loader" className="min-h-150 loader"/>
                                                    <h4 className="fetching-data ">Fetching data..</h4>
                                                </td>
                                            </tr>
                                        </tbody>
                                    }
                                </Table>
                            </Col>
                        </Row>
                        <Row className='justify-content-end mt-0 py-3 text-center show-more'>
                            <Col md='12' sm='12'>
                                {isMyPosition ?
                                    (myTableDataCount > myItemPage) ?
                                        <button onClick={() => setMyItemPage(myItemPage + 10)}
                                                className="btn btn-outline-primary px-5 py-3"
                                                disabled={myTableDataCount <= myItemPage}
                                        >
                                            Show More
                                        </button> : null
                                    :
                                    (tableDataCount > allItemPage) ?
                                        <button onClick={() => setAllItemPage(allItemPage + 10)}
                                                className="btn btn-outline-primary px-5 py-3"
                                                disabled={tableDataCount <= allItemPage}
                                        >
                                            Show More
                                        </button> : null
                                }
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Modal isOpen={rewardModal} backdrop={true} keyboard={false} centered={true}>
                <ModalHeader toggle={toggleRewardModal}>Claim Rewards</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col sm={12}>
                            { crypto1 && crypto2 ?
                                <div className="balance-card-group">
                                    <div className="balance-card">
                                        <span className="align-middle coin-value">
                                            { selectedPair ? roundDownForSwap(selectedPair.claim.token1,crypto1.decimal,18) : "" }
                                        </span>
                                        <div className="text-end">
                                            <div className="align-items-center px-3">
                                                <img className="me-2 align-middle coin-img" alt="coinImg"
                                                     src={require("../../assets/images/coins/" + crypto1.icon)}
                                                     height="30" width="30"/>
                                                <span className="align-middle coin-symbol">{crypto1.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="balance-card">
                                        <span className="align-middle coin-value">
                                            {roundDownForSwap(selectedPair.claim.token2,crypto2.decimal,18)}
                                        </span>
                                        <div className="text-end">
                                            <div className="align-items-center px-3">
                                                <img className="me-2 align-middle coin-img" alt="coinImg"
                                                     src={require("../../assets/images/coins/" + crypto2.icon)}
                                                     height="30" width="30"/>
                                                <span className="align-middle coin-symbol">{crypto2.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : ""}
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className="with-bg full-btn">
                    <Button color="none" className="btn-starch btn btn-lg" onClick={() => claimReward(selectedPair.pairAddress)}>
                        Claim Fees
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
}

const mapStateToProps = (state) => {
    return {
        data: state
    };
};
export default connect(mapStateToProps)(Index);
import {Card, CardHeader, CardTitle, Col, Container, Input, Row, Table} from "reactstrap";
import loader from '../../assets/images/loader.gif';
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {cryptoCoinsEnum} from "../../staticData";
import {connect} from "react-redux";
import {getPoolData} from "../../helper";

function Index(props) {
    const [tableData, setTableData] = useState([]);
    const [tableList, setTableList] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [isMyPosition, setIsMyPosition] = useState(false);
    const [themeMode] = useState("dark-mode");

    useEffect(() => {
        setTableData(props.data)
    }, [props]);

    useEffect(() => {
        getPoolData().then()
    }, []);

    useEffect(() => {
        filterList();
    }, [tableData]);

    useEffect(() => {
        filterList()
    }, [filterText, isMyPosition]);

    const filterList = () => {
        let poolList = tableData.filter(val => {
            let filter = (val.pairName.toLowerCase().includes(filterText.toLowerCase()) ||
                val.pairAddress.toLowerCase().includes(filterText.toLowerCase()) ||
                val.address.token1.toLowerCase().includes(filterText.toLowerCase()) ||
                val.address.token2.toLowerCase().includes(filterText.toLowerCase()));
            let myPosition = isMyPosition ? parseFloat(val.myPool.token1) > 0 && parseFloat(val.myPool.token2) > 0 : true;
            return filter && myPosition;
        });
        updateTableList(poolList).then();
    }

    const changePosition = (val) => {
        setIsMyPosition(val.target.checked);
        setFilterText('');
    }

    const updateTableList = async (poolList) => {
        let pairList = [];
        for (let pair of poolList) {
        	const icon1 =  Object.keys(cryptoCoinsEnum).includes(pair.token1Name) ? cryptoCoinsEnum[pair.token1Name].icon : "question.png";
    		const icon2 =  Object.keys(cryptoCoinsEnum).includes(pair.token2Name) ? cryptoCoinsEnum[pair.token2Name].icon : "question.png";

            pairList.push(<tr key={pair.pairAddress}>

                <td>
                    <div className="d-flex px-2 py-1">
                        <div className="coin-group">
                            <div className="coin pull-up">
								<img src={require("../../assets/images/coins/" + icon1)}
                                     alt="coinImg" height="35" width="35"/>
                            </div>
                            <div className="coin pull-up">
								<img src={require("../../assets/images/coins/" + icon2)}
                                     alt="coinImg" height="35" width="35"/>
                            </div>
                        </div>
                        <div className="d-flex flex-column justify-content-center ps-2">
                            <h6 className="mb-0 "> <a className="text-white text-decoration-none" target="_blank" href = {'https://evm.explorer.canto.io/address/' + pair.pairAddress}>{pair.pairName}</a></h6>
                            <p className="text-xs text-secondary mb-0">{pair.isStable ? "Stable" : "Volatile"} Pool</p>
                        </div>
                    </div>
                </td>
                <td className="text-center">
                    <p className="text-xs text-secondary mb-0">{pair.wallet.token1 + ' ' + pair.token1Name}</p>
                    <p className="text-xs text-secondary mb-0">{pair.wallet.token2 + ' ' + pair.token2Name}</p>
                </td>
                <td className="text-center">
                    <p className="text-xs text-secondary mb-0">{pair.myPool.token1 + ' ' + pair.token1Name}</p>
                    <p className="text-xs text-secondary mb-0">{pair.myPool.token2 + ' ' + pair.token2Name}</p>
                </td>
                <td className="text-center">
                    <p className="text-xs text-secondary mb-0">{pair.totalPool.token1 + ' ' + pair.token1Name}</p>
                    <p className="text-xs text-secondary mb-0">{pair.totalPool.token2 + ' ' + pair.token2Name}</p>
                </td>
                <td className="text-center action">
                    <div className="border-start ms-2">
                        <Link type="button" className="btn btn-forte btn-success me-3"
                              to={'/pool/add-liquidity/' + pair.slug}>
                            <img
                                src={require("../../assets/images/" + (themeMode === "dark-mode" ? 'dark-mode/' : '') + "add.svg")}
                                className="align-middle me-1" alt="add"/>
                            <span className="align-middle">Add</span>
                        </Link>
                    {parseFloat(pair.myPool.token1) > 0 && parseFloat(pair.myPool.token2) > 0 ?
                        <Link className="btn btn-forte btn-danger" to={'/pool/remove-liquidity/' + pair.slug}>
                            <img
                                src={require("../../assets/images/" + (themeMode === "dark-mode" ? 'dark-mode/' : '') + "remove.svg")}
                                className="align-middle me-1" alt="remove"/>
                            <span className="align-middle">Remove</span>
                        </Link>
                        : ""}
                    </div>
                </td>
            </tr>);
        }
        setTableList(pairList);
    }

    return (
        <Container className="mt-5 pool">
            <Row>
                <Col>
                    <Card>
                        <CardHeader
                            className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                            <CardTitle tag='h3'>Pools</CardTitle>
                            <div className='d-flex mt-md-0 mt-1'>
                                <Link to="/pool/create" className="btn btn-primary">Create a Pool</Link>
                            </div>
                        </CardHeader>
                        <Row className='justify-content-end mx-0 py-3'>
                            <Col className='align-items-center justify-content-start mt-1' md='6' sm='12'>
                                <div className="form-check form-switch row">
                                    <label
                                        className={"col-lg-3 col-sm-4 col-form-label " + (!isMyPosition ? 'text-white fw-bold' : '')}>All
                                        Positions</label>
                                    <input className="col-lg-3 col-sm-4 form-check-input cursor-pointer" type="checkbox" role="switch"
                                           onChange={changePosition}/>
                                    <label
                                        className={"col-lg-3 col-sm-4 col-form-label " + (isMyPosition ? 'text-white fw-bold' : '')}>My
                                        Positions</label>
                                </div>
                            </Col>
                            <Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12'>
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
                        <Row className='justify-content-end mx-0 py-3'>
                            <Col md='12' sm='12'>
                                <Table responsive>
                                    <thead>
                                    <tr>
                                        <th width="25%">Pair</th>
                                        <th width="15%" className="text-center">Wallet</th>
                                        <th width="15%" className="text-center">My Pool Amount</th>
                                        <th width="20%" className="text-center">Total Pool Amount</th>
                                        <th width="25%" className="text-center">Add or Remove Liquidity</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {tableList.length ?
                                        tableList :
                                        <tr>
                                            <td colSpan={6} className="text-muted text-center">
                                                <img src={loader} alt="loader" className="min-h-150 loader"/>
                                                <h4 className="text-white">Fetching data..</h4>
                                            </td>
                                        </tr>}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        {/*<Row className='justify-content-end mt-0 py-3 text-center show-more'>*/}
                        {/*    <Col md='12' sm='12'>*/}
                        {/*        <button className="btn btn-forte-primary px-5">Show More</button>*/}
                        {/*    </Col>*/}
                        {/*    <hr className="mt-4"/>*/}
                        {/*</Row>*/}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

const mapStateToProps = (state) => {
    return {
        data: state
    };
};
export default connect(mapStateToProps)(Index);
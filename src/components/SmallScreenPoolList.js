import {AccordionBody, AccordionHeader, AccordionItem} from "reactstrap";
import {Link} from "react-router-dom";
import {cryptoCoinsEnum} from "../staticData";

const SmallScreenPoolList = (props) => {
    const pair = props.pair;
    const icon1 = Object.keys(cryptoCoinsEnum).includes(props.pair.token1Name) ? cryptoCoinsEnum[props.pair.token1Name].icon : "question.png";
    const icon2 = Object.keys(cryptoCoinsEnum).includes(props.pair.token2Name) ? cryptoCoinsEnum[props.pair.token2Name].icon : "question.png";
    const rewardButtonClass =  (parseFloat(props.pair.userLpBalance) > 0) ? "claim-button-1" : "";

    return (
        <>
            <tr key={pair.pairAddress + 'sm'}>
                <AccordionItem>
                    <td>
                        <AccordionHeader targetId={pair.pairAddress}>
                        <div className="d-flex px-2 py-1">
                            <div className="coin-group">
                                <div className="coin pull-up">
                                    <img src={require("../assets/images/coins/" + icon1)} alt="coinImg" height="35" width="35"/>
                                </div>
                                <div className="coin pull-up">
                                    <img src={require("../assets/images/coins/" + icon2)} alt="coinImg" height="35" width="35"/>
                                </div>
                            </div>
                            <div className="d-flex flex-column justify-content-center ps-2">
                                <h6 className="mb-0 ">
                                    <span className="pair-title text-decoration-none" rel="noreferrer">{pair.pairName}</span>
                                </h6>
                                <p className="text-xs text-secondary mb-0">{pair.isStable ? "Stable" : "Volatile"} Pool</p>
                            </div>
                        </div>
                    </AccordionHeader>
                    </td>
                    <td className="py-0">
                        <AccordionBody accordionId={pair.pairAddress}>
                            <div className="table-responsive">
                                <table className="table table-striped table-dark mb-0">
                                    <tbody className="sm-device">
                                        <tr>
                                            <td>
                                                <span className="mobile-title">Wallet</span><br/>
                                                <span className="connector">{pair.wallet.token1 + ' ' + pair.token1Name} / {pair.wallet.token2 + ' ' + pair.token2Name}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span className="mobile-title">My Pool Amount</span><br/>
                                                <span className="connector">{pair.myPool.token1 + ' ' + pair.token1Name} / {pair.myPool.token2 + ' ' + pair.token2Name}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span className="mobile-title">Total Pool Amount</span><br/>
                                                <span className="connector">{pair.totalPool.token1 + ' ' + pair.token1Name} / {pair.totalPool.token2 + ' ' + pair.token2Name}</span>
                                            </td>
                                        </tr>
                                        <tr className="my-2">
                                            <td className="action text-center">
                                                <Link className="btn btn-forte btn-success me-md-3" to={'/pool/add-liquidity/' + pair.slug}>
                                                    <span className="align-middle">Add</span>
                                                </Link>
                                                { parseFloat(pair.userLpBalance) > 0 ?
                                                    <Link className="btn btn-forte btn-danger me-md-3" to={'/pool/remove-liquidity/' + pair.slug}>
                                                        <span className="align-middle">Remove</span>
                                                    </Link>
                                                    : ""}
                                                { (Number(pair.claim.token1) > 0 ||  Number(pair.claim.token2) > 0) ?
                                                    <button className={"btn btn-forte btn-primary claim-button " + rewardButtonClass} onClick={() => props.selectRewardPair(pair)} >
                                                        <span className="align-middle">Claim Fees</span>
                                                    </button>
                                                    : ""
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </AccordionBody>
                    </td>
                </AccordionItem>
            </tr>
        </>
    )
}

export default SmallScreenPoolList;
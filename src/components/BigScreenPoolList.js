import {cryptoCoinsEnum} from "../staticData";
import {Link} from "react-router-dom";
import claimImage from '../assets/images/claim.svg';

const BigScreenPoolList = (props) => {
    const pair = props.pair;
    const icon1 = Object.keys(cryptoCoinsEnum).includes(pair.token1Name) ? cryptoCoinsEnum[pair.token1Name].icon : "question.png";
    const icon2 = Object.keys(cryptoCoinsEnum).includes(pair.token2Name) ? cryptoCoinsEnum[pair.token2Name].icon : "question.png";
    const rewardButtonClass =  (parseFloat(pair.userLpBalance) > 0) ? "claim-button-1" : "";
    return (
        <>
            <tr key={pair.pairAddress}>
                <td>
                    <div className="d-flex px-2 py-1">
                        <div className="coin-group">
                            <div className="coin pull-up">
                                <img src={require("../assets/images/coins/" + icon1)}
                                     alt="coinImg" height="35" width="35"/>
                            </div>
                            <div className="coin pull-up">
                                <img src={require("../assets/images/coins/" + icon2)}
                                     alt="coinImg" height="35" width="35"/>
                            </div>
                        </div>
                        <div className="d-flex flex-column justify-content-center ps-2">
                            <h6 className="mb-0 ">
                                <a className="pair-title text-decoration-none" target="_blank" rel="noreferrer"
                                   href={'https://evm.explorer.canto.io/address/' + pair.pairAddress}>{pair.pairName}</a>
                            </h6>
                            <p className="text-xs text-secondary mb-0">{pair.isStable ? "Stable" : "Volatile"} Pool</p>
                        </div>
                    </div>
                </td>
                <td className="text-center">
                    <p className="text-xs text-primary mb-0">{pair.wallet.token1 + ' ' + pair.token1Name}</p>
                    <p className="text-xs text-primary mb-0">{pair.wallet.token2 + ' ' + pair.token2Name}</p>
                </td>
                <td className="text-center">
                    <p className="text-xs text-primary mb-0">{pair.myPool.token1 + ' ' + pair.token1Name}</p>
                    <p className="text-xs text-primary mb-0">{pair.myPool.token2 + ' ' + pair.token2Name}</p>
                </td>
                <td className="text-center">
                    <p className="text-xs text-primary mb-0">{pair.totalPool.token1 + ' ' + pair.token1Name}</p>
                    <p className="text-xs text-primary mb-0">{pair.totalPool.token2 + ' ' + pair.token2Name}</p>
                </td>
                <td className="text-center action">
                    <div className="border-start ps-2 ms-2">
                        <Link className="btn btn-forte btn-success me-md-3 mt-xs-2" to={'/pool/add-liquidity/' + pair.slug}>
                            <img className="align-middle me-1" alt="add button"
                                 src={require("../assets/images/" + (props.themeMode === "dark-mode" ? 'dark-mode/' : '') + "add.svg")}/>
                            <span className="align-middle">Add</span>
                        </Link>
                        { parseFloat(pair.userLpBalance) > 0 ?
                            <Link className="btn btn-forte btn-danger mt-xs-2 me-md-3" to={'/pool/remove-liquidity/' + pair.slug}>
                                <img  className="align-middle me-1" alt="remove button"
                                      src={require("../assets/images/" + (props.themeMode === "dark-mode" ? 'dark-mode/' : '') + "remove.svg")} />
                                <span className="align-middle">Remove</span>
                            </Link>
                            : ""}
                        { (Number(pair.claim.token1) > 0 ||  Number(pair.claim.token2) > 0) ?
                            <button className={"btn btn-primary mt-xs-2 claim-button " + rewardButtonClass} onClick={() => props.selectRewardPair(pair)} >
                                <img className="align-middle me-1" alt="Claim button" src={claimImage} height="16" width="16" />
                                <span className="align-middle">Claim Fees</span>
                            </button>
                            : ""}
                    </div>
                </td>
            </tr>
        </>
    )
}

export default BigScreenPoolList;
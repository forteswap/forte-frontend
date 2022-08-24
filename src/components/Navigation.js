import React, {useEffect, useState} from "react";
import {displayErrorMessage, getPoolData} from "../helper";
import logo from "../assets/images/forte_logo_white.png"
import {connect} from "react-redux";

const Navigation = () => {
    let provider = window.ethereum;
    const [buttonTitle, setButtonTitle] = useState('Connect Metamask');

    const connect = async (showMessage = false) => {
        try {
            if (provider) {
                setButtonTitle("Connecting ...")
                await provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x1e14',
                        rpcUrls: ['https://canto.evm.chandrastation.com'],
                        chainName: 'CANTO',
                        nativeCurrency: {
                            name: 'CANTO',
                            symbol: 'CANTO', // 2-6 characters long
                            decimals: 18,
                        },
                    }]
                });
                await provider.request({method: 'wallet_switchEthereumChain', params: [{chainId: '0x1e14'}]});
                const accounts = await provider.request({method: 'eth_requestAccounts'});
                setButtonTitle(accounts[0].slice(0, 6) + '...' + accounts[0].substr(-4))
                getPoolData().then(() => {
                });
            } else {
                if (!showMessage) {
                    displayErrorMessage("Please connect wallet first!");
                }
            }
        } catch (e) {
            setButtonTitle("Connect Metamask");
        }
    }

    useEffect(() => {
        connect(true).then();
    }, []);

    const changeMode = (val) => {
        if(val.target.checked){
            document.getElementById('main-body').classList.add('dark-mode');
        }else{
            document.getElementById('main-body').classList.remove('dark-mode');
        }
    }


    return (
        <header className="navbar">
            <div className="container-fluid">
                <div className="header-left">
                    <a href="http://explain.forteswap.xyz/">
                        <img src={logo} width="152" height="60" alt="logo"/>
                    </a>
                </div>
                <div className="header-center text-center">

                </div>
                <div className="header-right">
                    <div className="navbar navbar-default clearfix">
                        <div className="navbar-inner">
                            <div className="navbar-collapse justify-content-between">
                                <ul className="list-inline m-0 d-flex align-items-center justify-content-end gap-3">
                                    {/*<li>*/}
                                    {/*    <div className="form-check form-switch float-end">*/}
                                    {/*        <input className="form-check-input" type="checkbox" role="switch" onChange={changeMode}/>*/}
                                    {/*    </div>*/}
                                    {/*</li>*/}
                                    <li className="header-wallet nav-item dropdown">
                                        <button className="btn btn-primary"
                                                onClick={connect}> {buttonTitle}</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
const mapStateToProps = () => {
    return {};
};
export default connect(mapStateToProps)(Navigation);
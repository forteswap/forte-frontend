import React, {useEffect, useState} from "react";
import {displayErrorMessage, getPoolData} from "../helper";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {useLocation} from "react-router";
import { SLINGSHOT_RPC_URL } from '../global';
const themes = {
    dark: "",
    light: "white-layout",
};

const Navigation = () => {
    let provider = window.ethereum;
    const location = useLocation();
    const currentTheme = localStorage.getItem("forte-theme");
    const [theme, setTheme] = useState(currentTheme);
    const [darkMode, setDarkMode] = useState(currentTheme === 'null' || typeof currentTheme == "object");
    const [account, setAccount] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            connect().then()
        }
    }, []);

    window.ethereum?.on('accountsChanged', function (accounts) {
        if(account == null){
            window.localStorage.removeItem("forte-connected")
        }else {
            getPoolData().then()
            setAccount(accounts[0]);
        }
    });

    const connect = async () => {
        try {
            if (provider) {
                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{chainId: '0x1e14'}]
                });
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                setAccount(accounts[0]);
                window.localStorage.setItem("forte-connected", "injected");
            } else {
                displayErrorMessage("Please connect wallet first!");
            }
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x1e14',
                            rpcUrls: [SLINGSHOT_RPC_URL],
                            chainName: 'CANTO',
                            nativeCurrency: {
                                name: 'CANTO',
                                symbol: 'CANTO', // 2-6 characters long
                                decimals: 18,
                            },
                        }]
                    });
                } catch (addError) {
                    displayErrorMessage("Transaction did not go through");
                }
            }
        }
    }

    useEffect(() => {
        changeTheme(theme)
    }, [theme]);

    const changeTheme = (theme) => {
        setTheme(theme);
        switch (theme) {
            case themes.light:
                document.getElementById('main-body').classList.remove('dark-mode');
                localStorage.setItem("forte-theme","white-layout");
                break;
            case themes.dark:
            default:
                document.getElementById('main-body').classList.add('dark-mode');
                localStorage.setItem("forte-theme",null);
                break;
        }
    }

    return (
        <header className="navbar">
            <div className="container-fluid">
                <div className="header-left">
                    <a href="https://explain.forteswap.xyz/">
                        <img src={require('../assets/images/forte_logo_white.png')} width="152" height="60" alt="logo" className="logo"/>
                    </a>
                </div>
                <div className="header-center text-center">
                    <div className="navbar navbar-default clearfix">
                        <ul className="nav nav-pills" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <Link className={location.pathname === "/" ? `nav-link active` : 'nav-link'} id="pills-home-tab"
                                      data-bs-toggle="pill" to={'/'} type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                      swap
                                </Link>
                            </li>
                            <li className="nav-item" role="presentation">
                                <Link className={location.pathname.includes("pool") ? `nav-link active` : 'nav-link'} id="pills-profile-tab"
                                      data-bs-toggle="pill" to={'/pool'} type="button" role="tab" aria-controls="pills-profile" aria-selected="false">
                                      pool
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="header-right">
                    <div className="navbar navbar-default clearfix">
                        <div className="navbar-inner">
                            <div className="navbar-collapse justify-content-between">
                                <ul className="list-inline m-0 d-flex align-items-center justify-content-end gap-1">
                                    <li>
                                        <div className="form-check form-switch float-end">
                                            <label className="theme-setting">
                                                <input className='toggle-checkbox' type='checkbox' checked={darkMode} onChange={() => {
                                                    setDarkMode(!darkMode);
                                                    setTheme(darkMode ? themes.light : themes.dark);
                                                }} />
                                                <div className='toggle-slot'>
                                                    <div className='sun-icon-wrapper'>
                                                        <div className="iconify sun-icon" data-icon="feather-sun" data-inline="false"></div>
                                                    </div>
                                                    <div className='toggle-button'></div>
                                                    <div className='moon-icon-wrapper'>
                                                        <div className="iconify moon-icon" data-icon="feather-moon" data-inline="false"></div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </li>
                                    <li className="header-wallet nav-item dropdown">
                                        {account ?
                                            <button className="btn btn-primary wallet-button">
                                               {account.slice(0, 6) + '...' + account.slice(account.length - 4)}
                                            </button> :
                                            <button className="btn btn-primary wallet-button" onClick={connect}>
                                                Connect Metamask
                                            </button>
                                        }
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
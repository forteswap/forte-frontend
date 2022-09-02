import React, {useEffect, useState} from "react";
import {displayErrorMessage, getPoolData} from "../helper";
import logo from "../assets/images/forte_logo_white.png"
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {useLocation} from "react-router";
const themes = {
    dark: "",
    light: "white-layout",
};

const Navigation = () => {
    let provider = window.ethereum;
    const location = useLocation();
    const [buttonTitle, setButtonTitle] = useState('Connect Metamask');
    const currentTheme = localStorage.getItem("forte-theme");
    const [theme, setTheme] = useState(currentTheme);
    const [darkMode, setDarkMode] = useState(currentTheme === 'null' || typeof currentTheme == "object");

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
        changeTheme(theme)
    }, [theme]);

    useEffect(() => {
        connect(true).then();
    }, []);

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
                        <img src={logo} width="152" height="60" alt="logo" className="logo"/>
                    </a>
                </div>
                <div className="header-center text-center">
                    <div className="navbar navbar-default clearfix">
                        <ul className="nav nav-pills" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <Link className={location.pathname === "/" ? `nav-link active` : 'nav-link'} id="pills-home-tab" data-bs-toggle="pill"
                                      to={'/'} type="button" role="tab" aria-controls="pills-home"
                                      aria-selected="true">swap
                                </Link>
                            </li>
                            <li className="nav-item" role="presentation">
                                <Link className={location.pathname === "/pool" ? `nav-link active` : 'nav-link'} id="pills-profile-tab" data-bs-toggle="pill"
                                      to={'/pool'} type="button" role="tab"
                                      aria-controls="pills-profile" aria-selected="false">pool
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="header-right">
                    <div className="navbar navbar-default clearfix">
                        <div className="navbar-inner">
                            <div className="navbar-collapse justify-content-between">
                                <ul className="list-inline m-0 d-flex align-items-center justify-content-end gap-3">
                                    <li>
                                        <div className="form-check form-switch float-end">
                                            <label className="theme-setting">
                                                <input className='toggle-checkbox' type='checkbox' checked={darkMode} onClick={() => {
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
                                        <button className="btn btn-primary wallet-button"
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
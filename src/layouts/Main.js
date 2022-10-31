import React from 'react';
import Navigation from "../components/Navigation.js";
import { CookiesProvider } from 'react-cookie';
import GlobalModalProvider from "../components/modal/GlobalModal.js";
import Footer from "../components/Footer.js";
import Notice from "../components/notice/Notice.js";

const Main = ({children}) => {
    return (
        <React.Fragment>
            <CookiesProvider>
                <GlobalModalProvider>
                    <main className="mb-5">
                        <div id="radial-gradient-container" />
                        <Notice/>
                        <Navigation/>
                        {children}
                        <Footer/>
                    </main>
                </GlobalModalProvider>
            </CookiesProvider>
        </React.Fragment>
    );
};
export default Main;
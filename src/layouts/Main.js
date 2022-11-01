import React from 'react';
import Navigation from "../components/Navigation";
import { CookiesProvider } from 'react-cookie';
import GlobalModalProvider from "../components/modal/GlobalModal";
import Footer from "../components/Footer";
import Notice from "../components/notice/Notice";

const Main = ({children}) => {
    return (
        <React.Fragment>
            <CookiesProvider>
                <GlobalModalProvider>
                    <main className="mb-5">
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
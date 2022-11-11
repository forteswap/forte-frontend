import React from 'react';
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import { CookiesProvider } from 'react-cookie';
import GlobalModalProvider from "../components/modal/GlobalModal";
import Footer from "../components/Footer";
import Notice from "../components/notice/Notice";

const Main = ({children}) => {
    return (
        <React.Fragment>
            <CookiesProvider>
                <GlobalModalProvider>
                    <main className="w-full h-full">
                        <Notice/>
                        <Header/>
                        {children}
                        <Footer/>
                    </main>
                </GlobalModalProvider>
            </CookiesProvider>
        </React.Fragment>
    );
};
export default Main;
import React from 'react';
import Navigation from "../components/Navigation";
import { CookiesProvider } from 'react-cookie';
import GlobalModalProvider from "../components/modal/GlobalModal";
import Footer from "../components/Footer";
import Notice from "../components/notice/Notice";
import Header from '../components/header';
import Container from '../components/container';
import Background from '../components/background';

const logoPath = require("../assets/images/background.svg");

const Main = ({children}) => {
    return (
        <React.Fragment>
            <CookiesProvider>
                <GlobalModalProvider>
                    <main className="tw-w-full tw-h-full tw-flex tw-flex-col">
                        <Background/>
                        {/*@todo refactor this*/}
                        <img
                            className="-tw-z-10 tw-fixed tw-h-full tw-w-full tw-object-cover tw-filter tw-mix-blend-exclusion tw-brightness-50 tw-contrast-200"
                            src={logoPath}
                            alt="Your Company"
                        />
                        <Notice/>
                        <Header/>
                        <Container>
                            {children}
                        </Container>
                        <Footer/>
                    </main>
                </GlobalModalProvider>
            </CookiesProvider>
        </React.Fragment>
    );
};
export default Main;
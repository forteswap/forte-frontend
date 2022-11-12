import React from 'react';
import Navigation from "../components/Navigation";
import { CookiesProvider } from 'react-cookie';
import GlobalModalProvider from "../components/modal/GlobalModal";
import Footer from "../components/Footer";
import Notice from "../components/notice/Notice";
import Container from '../components/container';

const Main = ({children}) => {
    return (
        <React.Fragment>
            <CookiesProvider>
                <GlobalModalProvider>
                    <main className="tw-w-full tw-h-full tw-flex tw-flex-col">
                        <Notice/>
                        <Navigation/>
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
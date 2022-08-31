import React from 'react';
import Navigation from "../components/Navigation";
import GlobalModalProvider from "../components/modal/GlobalModal";
import Footer from "../components/Footer";

const Main = ({children}) => {
    return (
        <React.Fragment>
            <GlobalModalProvider>
                <main className="mb-5">
                    <Navigation/>
                    {children}
                    <Footer/>
                </main>
            </GlobalModalProvider>
        </React.Fragment>
    );
};
export default Main;
import React from 'react';
import Navigation from "../components/Navigation";
import GlobalModalProvider from "../components/modal/GlobalModal";

const Main = ({children}) => {
    return (
        <React.Fragment>
            <GlobalModalProvider>
                <main className="mb-5">
                    <Navigation/>
                    {children}
                </main>
            </GlobalModalProvider>
        </React.Fragment>
    );
};
export default Main;
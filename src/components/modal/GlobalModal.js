import React, {createContext, useContext, useState} from 'react';
import {modalComponentsEnum} from "../../staticData.js";

const initialState = {
    showModal: () => {},
    hideModal: () => {},
    store: {},
};

const GlobalModalContext = createContext(initialState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

const GlobalModalProvider = ({ children }) => {
    const [store, setStore] = useState();
    const { modalType, modalProps } = store || {};

    const showModal = (modalType, modalProps= {}) => {
        setStore({
            ...store,
            modalType,
            modalProps,
        });
    };

    const hideModal = () => {
        setStore({
            ...store,
            modalType: null,
            modalProps: {},
        });
    };

    const renderComponent = () => {
        const ModalComponent = modalComponentsEnum[modalType];
        if (!modalType || !ModalComponent) {
            return null;
        }
        return <ModalComponent id="global-modal" {...modalProps} />;
    };

    return (<>
        <GlobalModalContext.Provider value={{ store, showModal, hideModal }}>
            {renderComponent()}
            {children}
        </GlobalModalContext.Provider>
    </>);

}

export default GlobalModalProvider;
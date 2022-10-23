import TransactionSuccessModal from "./components/modal/TransactionSuccess";
import TransactionRejectedModal from "./components/modal/TransactionRejected";
import TransactionFailModal from "./components/modal/TransactionFail";
import TransactionCanceledModal from "./components/modal/TransactionCanceled";
import SignatureFailModal from "./components/modal/SignatureFail";
import NetworkErrorModal from "./components/modal/NetworkError";
import CustomModal from "./components/modal/Custom";
import ConfirmationWaitingModal from "./components/modal/ConfirmationWaitingModal";

export const cryptoCoinsEnum = {
    canto: {
        icon: "canto.svg",
        title: "Canto",
        name: "CANTO",
        address: "0x826551890Dc65655a0Aceca109aB11AbDbD7a07B",
        decimal: 18,
    },
    wcanto: {
        icon: "canto.svg",
        title: "WCanto",
        name: "WCANTO",
        address: "0x826551890Dc65655a0Aceca109aB11AbDbD7a07B",
        decimal: 18,
    },
    eth: {
        icon: "eth.png",
        title: "Ethereum",
        name: "ETH",
        address: "0x5FD55A1B9FC24967C4dB09C513C3BA0DFa7FF687",
        decimal: 18,
    },
    atom: {
        icon: "atom.png",
        title: "Cosmos",
        name: "ATOM",
        address: "0xecEEEfCEE421D8062EF8d6b4D814efe4dc898265",
        decimal: 6,
    },
    cinu: {
        icon: "cinu.png",
        title: "cINU",
        name: "cINU",
        address: "0x7264610A66EcA758A8ce95CF11Ff5741E1fd0455",
        decimal: 18,
    },
    ceth: {
        icon: "ceth.svg",
        title: "cEther",
        name: "CETH",
        address: "0x830b9849E7D79B92408a86A557e7baAACBeC6030",
        decimal: 18,
    },
    cusdc: {
        icon: "cusdc.svg",
        title: "cUSD",
        name: "CUSDC",
        address: "0xdE59F060D7ee2b612E7360E6C1B97c4d8289Ca2e",
        decimal: 6,
    },
    cusdt: {
        icon: "cusdt.svg",
        title: "cUSDT",
        name: "CUSDT",
        address: "0x6b46ba92d7e94FfA658698764f5b8dfD537315A9",
        decimal: 6,

    },
    note: {
        icon: "note.svg",
        title: "Note",
        name: "NOTE",
        address: "0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503",
        decimal: 18,
    },
    usdc: {
        icon: 'usdc.png',
        title: "USD Coin",
        name: "USDC",
        address: "0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd",
        decimal: 6,
    },
    usdt: {
        icon: "usdt.png",
        title: "Tether",
        name: "USDT",
        address: "0xd567B3d7B8FE3C79a1AD8dA978812cfC4Fa05e75",
        decimal: 6,
    },
    encanto: {
        icon: "encanto.png",
        title: "Encanto",
        name: "ENC",
        address: "0x373A8cD983948c5c20759dFae763D3bb7790F383",
        decimal: 18,
    }
};

export const modalTypesEnum = {
    TRANSACTION_SUCCESS_MODAL: "TRANSACTION_SUCCESS_MODAL",
    TRANSACTION_REJECTED_MODAL: "TRANSACTION_REJECTED_MODAL",
    TRANSACTION_FAIL_MODAL: "TRANSACTION_FAIL_MODAL",
    TRANSACTION_CANCELED_MODAL: "TRANSACTION_CANCELED_MODAL",
    SIGNATURE_FAIL_MODAL: "SIGNATURE_FAIL_MODAL",
    NETWORK_ERROR_MODAL: "NETWORK_ERROR_MODAL",
    CUSTOM_MODAL: "CUSTOM_MODAL",
    CONFIRMATION_WAITING: "CONFIRMATION_WAITING",
};

export const modalComponentsEnum = {
    [modalTypesEnum.TRANSACTION_SUCCESS_MODAL]: TransactionSuccessModal,
    [modalTypesEnum.TRANSACTION_REJECTED_MODAL]: TransactionRejectedModal,
    [modalTypesEnum.TRANSACTION_FAIL_MODAL]: TransactionFailModal,
    [modalTypesEnum.TRANSACTION_CANCELED_MODAL]: TransactionCanceledModal,
    [modalTypesEnum.SIGNATURE_FAIL_MODAL]: SignatureFailModal,
    [modalTypesEnum.NETWORK_ERROR_MODAL]: NetworkErrorModal,
    [modalTypesEnum.CUSTOM_MODAL]: CustomModal,
    [modalTypesEnum.CONFIRMATION_WAITING]: ConfirmationWaitingModal
};
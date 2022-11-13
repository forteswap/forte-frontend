import React, {useCallback} from 'react';
import { MegaphoneIcon, XMarkIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'
import { useCookies } from 'react-cookie';

const Notice = () => {
    let provider = window.ethereum;
    const [cookie, setCookie] = useCookies(['hasUserOptedOut']);

    const SLINGSHOT_RPC_URL = 'https://canto.slingshot.finance/';
    const {hasUserOptedOut} = cookie;

    const handleClose = useCallback(() => {
        setCookie('hasUserOptedOut', true, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    }, [setCookie])

    const handleAddSlingshotRPC = useCallback(async () => {
        await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: '0x1e14',
                rpcUrls: [SLINGSHOT_RPC_URL],
                chainName: 'CANTO',
                nativeCurrency: {
                    name: 'CANTO',
                    symbol: 'CANTO',
                    decimals: 18,
                },
            }]
        });
    }, [provider])

        return (
            !hasUserOptedOut && <div className="tw-bg-sky-200">
                <div className="tw-mx-auto tw-max-w-7xl tw-py-3 tw-px-3 sm:tw-px-6 lg:tw-px-8">
                    <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between">
                        <div className="tw-flex tw-w-0 tw-flex-1 tw-items-center">
            <span className="tw-flex tw-rounded-lg tw-bg-sky-300 tw-p-2">
              <CheckBadgeIcon className="tw-h-6 tw-w-6 tw-text-neutral-800" aria-hidden="true" />
            </span>
                            <p className="tw-cursor-pointer tw-mb-0 tw-ml-3 tw-truncate tw-font-medium tw-text-neutral-800" onClick={handleAddSlingshotRPC} title={SLINGSHOT_RPC_URL}>
                                <span className="md:tw-hidden">Please use the <span className="tw-underline">Slingshot RPC.</span></span>
                                <span className="tw-hidden md:tw-inline">We recommend connecting using the <span className="tw-underline">Slingshot RPC</span> for the best experience.</span>
                            </p>
                        </div>
                        <div className="tw-order-2 tw-flex-shrink-0 sm:tw-order-3 sm:tw-ml-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="tw--mr-1 tw-flex tw-rounded-md tw-p-2 hover:tw-bg-sky-300 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-white sm:tw--mr-2"
                            >
                                <span className="tw-sr-only">Dismiss</span>
                                <XMarkIcon className="tw-h-6 tw-w-6 tw-text-neutral-800" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
};

export default Notice;
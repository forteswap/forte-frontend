import React, {useEffect, useState} from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLocation } from "react-router";
import Button from '../Button';
import { NavLink } from "react-router-dom";
import {displayErrorMessage, getPoolData} from "../../helper";

const logoPath = require("../../assets/images/forte-logomark-white.svg") as string;

const navigation = [
    { name: 'Swap', href: '/', current: true },
    { name: 'Pool', href: 'pool', current: false },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Header = () => {
    // @todo refactor entire logic below
    let provider = window.ethereum;
    const location = useLocation();
    const [account, setAccount] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            connect().then()
        }
    }, []);

    // @ts-ignore
    window.ethereum?.on('accountsChanged', function (accounts) {
        if (account === null) return

        getPoolData().then()
        setAccount(accounts[0]);
    });

    console.log('account', account)

    const connect = async () => {
        try {
            if (provider) {
                // @ts-ignore
                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{chainId: '0x1e14'}]
                });
                // @ts-ignore
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                setAccount(accounts[0]);
                window.localStorage.setItem("forte-connected", "injected");
            } else {
                displayErrorMessage("Please connect wallet first!");
            }
        } catch (switchError) {
            // @ts-ignore
            if (switchError.code === 4902) {
                try {
                    // @ts-ignore
                    await provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x1e14',
                            rpcUrls: ['https://canto.evm.chandrastation.com'],
                            chainName: 'CANTO',
                            nativeCurrency: {
                                name: 'CANTO',
                                symbol: 'CANTO',
                                decimals: 18,
                            },
                        }]
                    });
                } catch (addError) {
                    displayErrorMessage("Transaction did not go through");
                }
            }
        }
    }
    //end of refactor chunk

    return (
        <Disclosure as="nav" className="tw-bg-neutral-800">
            {({ open }) => (
                <>
                    <div className="tw-mx-auto tw-max-w-7xl tw-px-4 tw-sm:px-6 lg:tw-px-8">
                        <div className="tw-flex tw-h-16 tw-justify-between">
                            <div className="tw-flex">
                                <div className="tw--ml-2 tw-mr-2 tw-flex tw-items-center md:tw-hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-p-2 tw-text-neutral-400 hover:tw-bg-neutral-700 hover:tw-text-white focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-inset focus:tw-ring-white">
                                        <span className="tw-sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="tw-block tw-h-6 tw-w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="tw-block tw-h-6 tw-w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <div className="tw-flex tw-flex-shrink-0 tw-items-center">
                                    <img
                                        className="tw-block tw-h-8 tw-w-auto lg:tw-hidden"
                                        src={logoPath}
                                        alt="Your Company"
                                    />
                                    <img
                                        className="tw-hidden tw-h-8 w-auto lg:tw-block"
                                        src={logoPath}
                                        alt="Your Company"
                                    />
                                </div>
                                <div className="tw-hidden md:tw-ml-6 md:tw-flex md:tw-items-center md:tw-space-x-4">
                                    {navigation.map((item) => (
                                        <NavLink
                                            key={item.name}
                                            className={({isActive}) =>
                                                classNames(
                                                    isActive ?
                                                        'tw-bg-neutral-900 tw-text-white': 'tw-text-neutral-300 hover:tw-bg-neutral-700 hover:tw-text-white',
                                                    'tw-px-3 tw-py-2 tw-rounded-md tw-text-sm tw-font-medium'
                                                ) }
                                            to={item.href}
                                            aria-current={location.pathname.includes(item.name.toLowerCase()) ? 'page' : undefined}>
                                            {item.name}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                            <div className="tw-flex tw-items-center">
                                <div className="tw-flex-shrink-0">
                                    <Button
                                        onClick={connect}
                                        label={account.length ? account.slice(0, 6) + '...' + account.slice(account.length - 4) : 'Connect Wallet'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="md:tw-hidden">
                        <div className="tw-space-y-1 tw-px-2 tw-pt-2 tw-pb-3 sm:tw-px-3">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.current ? 'tw-bg-neutral-900 tw-text-white' : 'tw-text-neutral-300 hover:tw-bg-neutral-700 hover:tw-text-white',
                                        'tw-block tw-px-3 tw-py-2 tw-rounded-md tw-text-base tw-font-medium'
                                    )}
                                    aria-current={location.pathname.includes(item.name.toLowerCase()) ? 'page' : undefined}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}

export default Header;
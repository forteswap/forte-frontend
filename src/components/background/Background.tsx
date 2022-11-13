import React, {useMemo, useState} from "react";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Background = () => {
    // @todo refactor logic below - needs to be global state - redux -> useQuery, support typescript
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [activeChainID, setActiveChainID] = useState<string>('');

    const test = useMemo(async () => {
        // @ts-ignore
        const accounts = await window?.ethereum?.request({method: 'eth_requestAccounts'});
        // @ts-ignore
        const activeChainID = await window?.ethereum?.request({method: 'eth_chainId'});
        document.body.setAttribute('data-chain', activeChainID)

        setIsConnected(accounts.length)
        setActiveChainID(activeChainID)
    }, [window.ethereum])

    // @ts-ignore
    window?.ethereum.on('chainChanged', handleChainChanged);

    function handleChainChanged(_chainId: string) {
        // We recommend reloading the page, unless you must do otherwise
        document.body.setAttribute('data-chain', _chainId)

        setActiveChainID(_chainId)
    }

    return (
        <div
            className={
                classNames(
                    isConnected ?
                        'tw-opacity-100': 'tw-opacity-0',
                    '-tw-z-20 tw-fixed tw-inset-0 tw-bg-scroll tw-transition-opacity tw-duration-[1500ms] tw-bg-clip-border tw-bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] tw-from-skin-hue tw-via-slate-800 tw-to-neutral-900'
                    )
                }
            />
    )

}

export default Background;
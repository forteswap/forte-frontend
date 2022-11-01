import React, {useCallback} from 'react';
import { useCookies } from 'react-cookie';
import {X as CloseIcon} from 'react-feather';

const Notice = () => {
    let provider = window.ethereum;
    const [cookie, setCookie] = useCookies(['hasUserOptedOut']);

    const {hasUserOptedOut} = cookie

    const handleClose = useCallback(() => {
        setCookie('hasUserOptedOut', true, { path: '/' });
    }, [setCookie])

    const handleAddSlingshotRPC = useCallback(async () => {
        await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: '0x1e14',
                rpcUrls: ['https://canto.slingshot.finance/'],
                chainName: 'CANTO',
                nativeCurrency: {
                    name: 'CANTO',
                    symbol: 'CANTO', // 2-6 characters long
                    decimals: 18,
                },
            }]
        });
    }, [provider])

    console.log('hasUserOptedOut', hasUserOptedOut)

    return (
        !hasUserOptedOut && <div style={{backgroundColor: '#ebbe67', color: '#272179', padding: '1rem 2rem', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div>

            We recommend connecting using the <span style={{fontWeight: 'bold', cursor: 'pointer'}}
              onClick={handleAddSlingshotRPC} title={'https://canto.slingshot.finance/'}>Slingshot RPC</span> for the best experience.
            </div>
            <span style={{cursor: 'pointer'}}>
                <span onClick={handleClose} style={{backgroundColor: 'rgb(255 230 123)', padding: '0.5rem 1rem', borderRadius: '1rem', fontWeight: 'bold'}}>I understand</span>
            </span>
        </div>
    );
};

export default Notice;
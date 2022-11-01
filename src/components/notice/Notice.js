import React, {useCallback} from 'react';
import { useCookies } from 'react-cookie';

const Notice = () => {
    let provider = window.ethereum;
    const [cookie, setCookie] = useCookies(['hasUserOptedOut']);

    const SLINGSHOT_RPC_URL = 'https://canto.slingshot.finance/';
    const {hasUserOptedOut} = cookie;

    const handleClose = useCallback(() => {
        setCookie('hasUserOptedOut', true, { path: '/' });
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
        !hasUserOptedOut && <div style={{backgroundColor: '#ebbe67', color: '#272179', padding: '1rem 2rem', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div>

            We recommend connecting using the <span style={{fontWeight: 'bold', cursor: 'pointer'}}
              onClick={handleAddSlingshotRPC} title={SLINGSHOT_RPC_URL}>Slingshot RPC</span> for the best experience.
            </div>
            <span style={{cursor: 'pointer'}}>
                <span onClick={handleClose} style={{backgroundColor: 'rgb(255 230 123)', padding: '0.5rem 1rem', borderRadius: '1rem', fontWeight: 'bold'}}>I understand</span>
            </span>
        </div>
    );
};

export default Notice;
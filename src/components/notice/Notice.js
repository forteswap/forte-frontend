import React, {useCallback} from 'react';
import { useCookies } from 'react-cookie';
import { SLINGSHOT_RPC_URL } from '../../global';

const Notice = () => {
    let provider = window.ethereum;
    const [cookie, setCookie] = useCookies(['hasUserOptedOut']);

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
        !hasUserOptedOut && <div style={{backgroundColor: '#ebbe67', color: 'rgb(45 44 108)', padding: '1rem', textAlign: 'center', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '1rem'}}>
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
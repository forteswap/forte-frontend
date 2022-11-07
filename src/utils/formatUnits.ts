import { formatUnits as formatUnitsEthers, formatEther } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';

// @todo implement safety guards
export const parseUnitsForView = (bigNumberAmount: BigNumber): string => {
    // cuts down to maximum 3 decimal points
    const remainder = bigNumberAmount.mod(1e14);

    return formatEther(bigNumberAmount.sub(remainder));
}

// @todo implement safety guards
export const formatUnits = (bigNumberAmount: BigNumber, decimals: BigNumber, shouldParseUnitsForView = false): string => {
    return shouldParseUnitsForView ? parseUnitsForView(bigNumberAmount) : formatUnitsEthers(bigNumberAmount, decimals);
}
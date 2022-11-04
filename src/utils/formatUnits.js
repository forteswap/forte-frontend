// @todo implement with typescript later
import { formatUnits as formatUnitsEthers, formatEther } from '@ethersproject/units';

export const parseUnitsForView = (bigNumberAmount) => {
    // cuts down to maximum 3 decimal points
    const remainder = bigNumberAmount.mod(1e14);

    return formatEther(bigNumberAmount.sub(remainder));
}

export const formatUnits = (bigNumberAmount, decimals, shouldParseUnitsForView = false) => {
    return shouldParseUnitsForView ? parseUnitsForView(bigNumberAmount) : formatUnitsEthers(bigNumberAmount, decimals);
}
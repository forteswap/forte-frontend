// @todo implement with typescript later
import { formatUnits as formatUnitsEthers, formatEther } from '@ethersproject/units';

export const parseForView = (bigNumberAmount) => {
    // cuts down to maximum 4 decimal points
    const remainder = bigNumberAmount.mod(1e14);

    return formatEther(bigNumberAmount.sub(remainder));
}

export const formatUnits = (bigNumberAmount, decimals, shouldParseForView = false) => {
    return shouldParseForView ? parseForView(bigNumberAmount) : formatUnitsEthers(bigNumberAmount, decimals);
}

import { useTheme } from 'UI/Contexts';

function isRetailTheme() {
    return useTheme().indexOf('default') < 0;
}

export function getWidthClass() {
    return `Controls-Colors-demo_widthPanel${isRetailTheme() ? '_retail' : ''}`;
}

export function getLimitedHeightClass() {
    return `Controls-Colors-demo_limitedHeight${isRetailTheme() ? '_retail' : ''}`;
}

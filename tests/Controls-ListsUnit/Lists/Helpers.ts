import { TGetRowPropsCallback } from 'Controls/gridReact';

export function getRowPropsWithBackgroundEvenItems(): TGetRowPropsCallback {
    return (item) => {
        return {
            backgroundStyle: item.getKey() % 2 === 0 ? 'success' : undefined,
        };
    };
}

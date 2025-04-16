import { ForwardedRef, forwardRef } from 'react';
import { View as GridView } from 'Controls/grid';

export const ContentTemplate = forwardRef(
    (props: { storeId: string }, ref: ForwardedRef<unknown>): JSX.Element | null => {
        return <GridView forwardedRef={ref} {...props} />;
    }
);

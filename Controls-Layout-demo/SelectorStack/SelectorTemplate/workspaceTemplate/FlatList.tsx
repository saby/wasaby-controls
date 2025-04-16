import { ForwardedRef, forwardRef, ReactElement } from 'react';
import { View } from 'Controls/grid';

export const ContentTemplate = forwardRef(
    (props: { storeId: string }, ref: ForwardedRef<unknown>): ReactElement => {
        return <View ref={ref} {...props} />;
    }
);

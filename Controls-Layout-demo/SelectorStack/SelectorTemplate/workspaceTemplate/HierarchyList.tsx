import { ForwardedRef, forwardRef, ReactElement } from 'react';
import { View } from 'Controls/explorer';

export const ContentTemplate = forwardRef(
    (props: { storeId: string }, ref: ForwardedRef<View>): ReactElement => {
        return <View ref={ref} {...props} />;
    }
);

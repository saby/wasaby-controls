import { forwardRef } from 'react';
import { View as GridView } from 'Controls/grid';

export const ContentTemplate = forwardRef((props: { storeId: string }): JSX.Element | null => {
    return <GridView storeId={props.storeId} className={'controls-air-m'} />;
});

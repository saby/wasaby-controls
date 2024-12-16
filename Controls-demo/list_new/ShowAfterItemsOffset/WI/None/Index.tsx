import { forwardRef } from 'react';
import BottomPaddingDemoComponent from 'Controls-demo/list_new/ShowAfterItemsOffset/WI/DemoComponent';

export default forwardRef(function BasicBottomPadding(_, ref) {
    return (
        <BottomPaddingDemoComponent
            ref={ref}
            bottomPaddingMode={'none'}
            itemActionsPosition={'outside'}
        />
    );
});

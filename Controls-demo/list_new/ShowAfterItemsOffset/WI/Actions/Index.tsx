import { forwardRef } from 'react';
import BottomPaddingDemoComponent from 'Controls-demo/list_new/ShowAfterItemsOffset/WI/DemoComponent';

export default forwardRef(function ActionsBottomPadding(_, ref) {
    return (
        <BottomPaddingDemoComponent
            ref={ref}
            bottomPaddingMode={'actions'}
            itemActionsPosition={'outside'}
        />
    );
});

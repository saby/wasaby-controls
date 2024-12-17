import { forwardRef } from 'react';
import BottomPaddingDemoComponent from 'Controls-demo/list_new/ShowAfterItemsOffset/WI/DemoComponent';

export default forwardRef(function AdditionalBottomPadding(_, ref) {
    return (
        <BottomPaddingDemoComponent
            ref={ref}
            bottomPaddingMode={'separate'}
            itemActionsPosition={'inside'}
        />
    );
});

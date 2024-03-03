import { View } from 'Controls/treeGrid';
import { IGridProps } from 'Controls/gridReact';
import * as React from 'react';

export default React.forwardRef(function DemoWidget(
    props: IGridProps,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    return (
        <div
            ref={ref}
            style={{
                background: 'white',
                width: '1000px',
                marginLeft: '50px',
                marginRight: '50px',
                marginBottom: '200px',
                marginTop: '50px',
                paddingTop: '20px',
                paddingBottom: '50px',
                border: '#d2d6da solid 1px',
                borderRadius: '10px',
            }}
        >
            <View
                storeId={'GridWidgetSlice'}
                {...props}
                rowSeparatorSize={'s'}
                columnSeparatorSize={'s'}
            />
        </div>
    );
});

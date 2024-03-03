import { View } from 'Controls/treeGrid';
import { IGridProps } from 'Controls/gridReact';
import * as React from 'react';
import { Container } from 'Controls/scroll';
export default React.forwardRef(function DemoWidget(
    props: IGridProps,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    return (
        <Container
            ref={ref}
            style={{
                background: 'white',
                width: '1000px',
                paddingTop: 'var(--offset_2xl)',
                paddingBottom: 'var(--offset_2xl)',
                border: '#d2d6da solid 1px',
                borderRadius: '10px',
            }}
        >
            <View
                storeId={'GridWidgetSlice'}
                {...props}
                rowSeparatorSize={'s'}
                columnScroll={true}
                columnSeparatorSize={'s'}
                width={1000}
            />
        </Container>
    );
});

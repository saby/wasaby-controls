import { View } from 'Controls/treeGrid';
import { IGridProps } from 'Controls/gridReact';
import * as React from 'react';
import { Container } from 'Controls/scroll';
import 'css!Controls-Lists-editors-demo/ColumnEditor/styles';
export default React.forwardRef(function DemoWidget(
    props: IGridProps,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    return (
        <Container ref={ref} className={'ControlsListsEditorsDemo_widget-wrapper'}>
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

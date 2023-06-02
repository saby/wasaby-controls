import * as React from 'react';

import { RecordSet } from 'Types/collection';

import 'Controls/gridReact';
import { IColumnConfig, TGetRowPropsCallback } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { TShadowVisibility } from 'Controls/display';
import { Control as Tumbler } from 'Controls/Tumbler';

import { getColumns, getItems } from 'Controls-demo/gridReact/resources/Data';

function getShadowVisibilities(): RecordSet {
    return new RecordSet({
        keyProperty: 'key',
        rawData: [{ key: 'hidden' }, { key: 'onhover' }, { key: 'visible' }],
    });
}

interface IProps {
    shadowVisibility?: TShadowVisibility;
}

export default React.forwardRef(
    (props: IProps, ref: React.ForwardedRef<HTMLDivElement>) => {
        const items = React.useMemo<RecordSet>(() => {
            return getItems();
        }, []);
        const columns = React.useMemo<IColumnConfig[]>(() => {
            return getColumns();
        }, []);

        const shadowVisibilities = React.useMemo(() => {
            return getShadowVisibilities();
        }, []);

        const [shadowVisibility, setShadowVisibility] =
            React.useState<TShadowVisibility>(props.shadowVisibility);

        const getRowProps = React.useCallback<TGetRowPropsCallback>(() => {
            return { shadowVisibility };
        }, [shadowVisibility]);

        return (
            <div ref={ref}>
                <Tumbler
                    keyProperty="key"
                    displayProperty="key"
                    items={shadowVisibilities}
                    selectedKey={shadowVisibility}
                    onSelectedKeyChanged={(value) => {
                        return setShadowVisibility(value);
                    }}
                    customEvents={['onSelectedKeyChanged']}
                />

                <GridItemsView
                    items={items}
                    columns={columns}
                    getRowProps={getRowProps}
                />
            </div>
        );
    }
);

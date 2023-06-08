import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { getArgs } from 'UICore/Events';

import 'Controls/gridReact';
import { IColumnConfig, TGetRowPropsCallback } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { TBorderStyle, TBorderVisibility } from 'Controls/display';
import { Control as Tumbler } from 'Controls/Tumbler';

import { getColumns, getItems } from 'Controls-demo/gridReact/resources/Data';

function getBorderVisibilities(): RecordSet {
    return new RecordSet({
        keyProperty: 'key',
        rawData: [{ key: 'hidden' }, { key: 'onhover' }, { key: 'visible' }],
    });
}

function getBorderStyles(): RecordSet {
    return new RecordSet({
        keyProperty: 'key',
        rawData: [{ key: 'default' }, { key: 'danger' }],
    });
}

interface IProps {
    borderVisibility?: TBorderVisibility;
    borderStyle?: TBorderStyle;
}

export default React.forwardRef(
    (props: IProps, ref: React.ForwardedRef<HTMLDivElement>) => {
        const items = React.useMemo<RecordSet>(() => {
            return getItems();
        }, []);
        const columns = React.useMemo<IColumnConfig[]>(() => {
            return getColumns();
        }, []);

        const borderVisibilities = React.useMemo(() => {
            return getBorderVisibilities();
        }, []);
        const borderStyles = React.useMemo(() => {
            return getBorderStyles();
        }, []);

        const [borderVisibility, setBorderVisibility] =
            React.useState<TBorderVisibility>(props.borderVisibility);
        const [borderStyle, setBorderStyle] = React.useState<TBorderStyle>(
            props.borderStyle
        );

        const getRowProps = React.useCallback<TGetRowPropsCallback>(() => {
            return {
                borderVisibility,
                borderStyle,
            };
        }, [borderVisibility, borderStyle]);

        return (
            <div ref={ref}>
                <Tumbler
                    keyProperty="key"
                    displayProperty="key"
                    items={borderVisibilities}
                    selectedKey={borderVisibility}
                    onSelectedKeyChanged={(event) => {
                        return setBorderVisibility(getArgs(event)[1]);
                    }}
                    customEvents={['onSelectedKeyChanged']}
                />
                <Tumbler
                    keyProperty="key"
                    displayProperty="key"
                    items={borderStyles}
                    selectedKey={borderStyle}
                    onSelectedKeyChanged={(event) => {
                        return setBorderStyle(getArgs(event)[1]);
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

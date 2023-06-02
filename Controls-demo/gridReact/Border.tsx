import * as React from 'react';

import { RecordSet } from 'Types/collection';

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

function getBorderModes(): RecordSet {
    return new RecordSet({
        keyProperty: 'key',
        rawData: [{ key: 'row' }, { key: 'cell' }],
    });
}

interface IProps {
    borderVisibility?: TBorderVisibility;
    borderStyle?: TBorderStyle;
}

export default React.forwardRef(
    (
        {
            borderVisibility: propBorderVisibility = 'hidden',
            borderStyle: propBorderStyle = 'default',
            borderMode: propsBorderMode = 'row'
        }: IProps & {
            borderMode: 'cell' | 'row';
        },
        ref: React.ForwardedRef<HTMLDivElement>
    ) => {
        const items = React.useMemo<RecordSet>(() => {
            return getItems();
        }, []);

        const borderVisibilities = React.useMemo(() => {
            return getBorderVisibilities();
        }, []);
        const borderStyles = React.useMemo(() => {
            return getBorderStyles();
        }, []);
        const borderModes = React.useMemo(() => {
            return getBorderModes();
        }, []);

        const [borderVisibility, setBorderVisibility] =
            React.useState<TBorderVisibility>(
                propBorderVisibility
            );
        const [borderStyle, setBorderStyle] = React.useState<TBorderStyle>(
            propBorderStyle
        );
        const [borderMode, setBorderMode] = React.useState<'cell' | 'row'>(
            propsBorderMode
        );

        const columns = React.useMemo<IColumnConfig[]>(() => {
            return getColumns(
                borderMode === 'cell' ? borderVisibility : undefined,
                borderMode === 'cell' ? borderStyle : undefined
            );
        }, [borderMode, borderStyle, borderVisibility]);

        const getRowProps = React.useCallback<TGetRowPropsCallback>(() => {
            return {
                borderVisibility:
                    borderMode === 'row' ? borderVisibility : undefined,
                borderStyle,
            };
        }, [borderVisibility, borderStyle, borderMode]);

        return (
            <div ref={ref}>
                <Tumbler
                    keyProperty="key"
                    displayProperty="key"
                    items={borderVisibilities}
                    selectedKey={borderVisibility}
                    onSelectedKeyChanged={(value) => {
                        return setBorderVisibility(value);
                    }}
                    customEvents={['onSelectedKeyChanged']}
                />
                <Tumbler
                    keyProperty="key"
                    displayProperty="key"
                    items={borderStyles}
                    selectedKey={borderStyle}
                    onSelectedKeyChanged={(value) => {
                        return setBorderStyle(value);
                    }}
                    customEvents={['onSelectedKeyChanged']}
                />
                <Tumbler
                    keyProperty="key"
                    displayProperty="key"
                    items={borderModes}
                    selectedKey={borderMode}
                    onSelectedKeyChanged={(value) => {
                        return setBorderMode(value);
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

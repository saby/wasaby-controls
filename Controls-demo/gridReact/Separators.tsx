import * as React from 'react';

import 'Controls/gridReact';
import 'Controls/gridColumnScroll';

import { IColumnConfig, TGetRowPropsCallback } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import {
    TBorderStyle,
    TBorderVisibility,
    TColumnSeparatorSize,
    TRowSeparatorSize,
    TRowSeparatorVisibility,
    IEditingConfig,
} from 'Controls/display';
import { useTumbler } from './Dev/Editors/Tumbler';
import { Container as ScrollContainer } from 'Controls/scroll';
import { TOffsetSize } from 'Controls/interface';
import { getHeader, getColumns, getMoreItems } from 'Controls-demo/gridReact/resources/Data';

type TBorderMode = 'cell' | 'row';

interface IProps {
    borderVisibility?: TBorderVisibility;
    borderStyle?: TBorderStyle;
    borderMode?: TBorderMode;
    columnSeparatorSize?: TColumnSeparatorSize;
    rowSeparatorSize?: TRowSeparatorSize;
    rowSeparatorVisibility?: TRowSeparatorVisibility;
    itemsSpacing?: TOffsetSize;
    isCellEditable?: boolean;
    columnScroll?: boolean;
}

const ITEMS = getMoreItems();

const WRAPPER_PADDING_CLASSNAME = ['top', 'bottom', 'left', 'right']
    .map((direction) => `controls-padding_${direction}-l`)
    .join(' ');

export default React.forwardRef(
    (
        {
            borderVisibility: propBorderVisibility = 'hidden',
            borderStyle: propBorderStyle = 'default',
            borderMode: propsBorderMode = 'row',
            columnSeparatorSize: propsColumnSeparatorSize = 'null',
            rowSeparatorVisibility: propsRowSeparatorVisibility = 'all',
            rowSeparatorSize: propsRowSeparatorSize = 'null',
            itemsSpacing: propsItemsSpacing = undefined,
            isCellEditable: propsIsCellEditable = false,
            columnScroll: propsColumnScroll = false
        }: IProps,
        ref: React.ForwardedRef<HTMLDivElement>
    ) => {
        const [borderVisibility, BorderVisibilityTumbler] = useTumbler<TBorderVisibility>(
            'borderVisibility',
            ['hidden', 'onhover', 'visible'],
            propBorderVisibility
        );

        const [borderStyle, BorderStyleTumbler] = useTumbler<TBorderStyle>(
            'borderStyle',
            ['default', 'danger'],
            propBorderStyle
        );

        const [borderMode, BorderModeTumbler] = useTumbler<TBorderMode>(
            'borderMode',
            ['cell', 'row'],
            propsBorderMode
        );

        const [rowSeparatorVisibility, RowSeparatorVisibilityTumbler] =
            useTumbler<TRowSeparatorVisibility>(
                'rowSeparatorVisibility',
                ['all', 'items', 'edges'],
                propsRowSeparatorVisibility
            );

        const [rowSeparatorSize, RowSeparatorSizeTumbler] = useTumbler<TRowSeparatorSize>(
            'rowSeparatorSize',
            ['null', 's', 'l'],
            propsRowSeparatorSize
        );

        const [columnSeparatorSize, ColumnSeparatorSizeTumbler] =
            useTumbler<TRowSeparatorSize>(
                'columnSeparatorSize',
                ['null', 's'],
                propsColumnSeparatorSize
            );

        const [itemsSpacing, ItemsSpacingTumbler] = useTumbler<TOffsetSize>(
            'itemsSpacing',
            [undefined, '3xs', 'xs', 's', 'st', 'm', 'l', 'xl', '2xl', '3xl'],
            propsItemsSpacing
        );

        const [isCellEditable, IsCellEditableTumbler] = useTumbler<boolean>(
            'isCellEditable',
            [true, false],
            propsIsCellEditable
        );

        const [columnScroll, ColumnScrollTumbler] = useTumbler<boolean>(
            'columnScroll',
            [true, false],
            propsColumnScroll
        );

        const header = React.useMemo<IColumnConfig[]>(() => {
            return getHeader();
        }, []);

        const columns = React.useMemo<IColumnConfig[]>(() => {
            return getColumns(
                borderMode === 'cell' ? borderVisibility : undefined,
                borderMode === 'cell' ? borderStyle : undefined,
                isCellEditable
            ).map((c) => {
                return {
                    ...c,
                    width: columnScroll && c.width === '1fr' ? '500px' : c.width,
                };
            });
        }, [borderMode, borderStyle, borderVisibility, isCellEditable, columnScroll]);

        const getRowProps = React.useCallback<TGetRowPropsCallback>(() => {
            return {
                borderVisibility: borderMode === 'row' ? borderVisibility : undefined,
                borderStyle,
            };
        }, [borderVisibility, borderStyle, borderMode]);

        const editingConfig = React.useMemo<IEditingConfig>(() => {
            return isCellEditable
                ? {
                      editOnClick: true,
                      mode: 'cell',
                  }
                : undefined;
        }, [isCellEditable]);

        const gridProps = {
            items: ITEMS,
            header,
            columns,
            getRowProps,
            itemsSpacing,
            rowSeparatorSize,
            rowSeparatorVisibility,
            columnSeparatorSize,
            editingConfig,
            columnScroll,
        };

        return (
            <div ref={ref}>
                <div className={'ws-flexbox ws-flex-wrap'}>
                    {BorderVisibilityTumbler}
                    {BorderStyleTumbler}
                    {BorderModeTumbler}
                    {RowSeparatorVisibilityTumbler}
                    {RowSeparatorSizeTumbler}
                    {ItemsSpacingTumbler}
                    {ColumnSeparatorSizeTumbler}
                    {IsCellEditableTumbler}
                    {ColumnScrollTumbler}
                </div>

                <div className={WRAPPER_PADDING_CLASSNAME}>
                    {columnScroll ? (
                        <ScrollContainer className="controlsDemo__max-height200 controlsDemo__width800px">
                            <GridItemsView {...gridProps} />
                        </ScrollContainer>
                    ) : (
                        <GridItemsView {...gridProps} />
                    )}
                </div>
            </div>
        );
    }
);

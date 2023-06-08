/*
   Демка демонстрирует работу с хуком useItemState.
   Он позволяет получить актуальное значение состояния записи(например маркированность, выбранность).
   При изменении состояния вызывает перерисовку.
 */
import * as React from 'react';

import { RecordSet } from 'Types/collection';

import 'Controls/gridReact';
import { IColumnConfig, useRenderData, useItemState } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { getItems } from 'Controls-demo/gridReact/resources/Data';

function getColumns(): IColumnConfig[] {
    return [
        { displayProperty: 'number' },
        {
            displayProperty: 'country',
            render: <CountryRender />,
        },
        { displayProperty: 'capital' },
    ];
}

function CountryRender() {
    const {
        renderValues: { country },
    } = useRenderData(['country']);
    // Используем хук, чтобы подписаться на актуальное состояние маркированности текущей записи.
    // При изменении маркированности хук вызывает перерисовку.
    const { marked } = useItemState(['marked']);

    const className = marked
        ? 'controls-fontsize-l controls-fontweight-bold'
        : '';

    return <div className={className}>{country}</div>;
}

export default React.forwardRef(
    (_, ref: React.ForwardedRef<HTMLDivElement>) => {
        const items = React.useMemo<RecordSet>(() => {
            return getItems();
        }, []);
        const columns = React.useMemo<IColumnConfig[]>(() => {
            return getColumns();
        }, []);

        return (
            <div ref={ref}>
                <GridItemsView items={items} columns={columns} />
            </div>
        );
    }
);

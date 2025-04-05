import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as TreeGridView } from 'Controls/treeGrid';
import { IColumnConfig, IHeaderConfig } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { IItemAction } from 'Controls/itemActions';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import 'css!Controls-demo/treeGridNew/Wi/ColumnScroll/ColumnScroll';

import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

const { getData } = Flat;

const columns: IColumnConfig[] = [
    {
        displayProperty: 'key',
        width: '80px',
    },
    {
        displayProperty: 'title',
        width: '200px',
    },
    {
        displayProperty: 'country',
        width: '200px',
    },
    {
        displayProperty: 'rating',
        width: '100px',
    },
    {
        displayProperty: 'hasChild',
        width: '120px',
    },
    {
        displayProperty: 'country',
        width: 'max-content',
    },
    {
        displayProperty: 'rating',
        width: '120px',
    },
];

const header: IHeaderConfig[] = [
    { caption: '#', key: 'header-key' },
    { caption: 'Бренд', key: 'header-title' },
    { caption: 'Страна производителя', key: 'header-country' },
    { caption: 'Рейтинг', key: 'header-rating' },
    { caption: 'Есть товары?', key: 'header-hasChild' },
    { caption: 'Еще раз страна', key: 'header-country-1' },
    { caption: 'Еще раз рейтинг', key: 'header-rating-1' },
];

const itemActions: IItemAction[] = getItemActions();

/**
 * Конфигурация горизонтального скролла в иерархической таблице
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <ScrollContainer className="Controls-demo__treeGridNew_ColumnScroll">
                <TreeGridView
                    storeId="ColumnScroll"
                    header={header}
                    columns={columns}
                    itemActions={itemActions}
                    rowSeparatorSize="s"
                    columnScroll={true}
                    stickyColumnsCount={2}
                />
            </ScrollContainer>
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnScroll: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [1, 11],
                },
            },
        };
    },
});

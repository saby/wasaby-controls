import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { View as TreeGridView, IColumnConfig } from 'Controls/treeGrid';
import {} from 'Controls/grid';
import { IListDataFactoryArguments, IDataConfig } from 'Controls/dataFactory';
import MultiNavigationMemory from 'Controls-demo/DemoData/MultiNavigationMemory';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

function getData() {
    return Flat.getData();
}

const columns: IColumnConfig[] = Flat.getColumns();

/**
 * Конфигурация иерархической таблицы с кнопкой "Ещё" в подвале развёрнутого узла по умолчанию
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div
            ref={ref}
            className="controlsDemo__cell"
            data-qa="controlsDemo-MoreFontColor_stylePrimary"
        >
            <TreeGridView
                storeId="NodeFooterMoreFontColorStylePrimary"
                columns={columns}
                moreFontColorStyle="primary"
            />
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NodeFooterMoreFontColorStylePrimary: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new MultiNavigationMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [1, 11],
                    navigation: {
                        source: 'page',
                        view: 'demand',
                        sourceConfig: {
                            pageSize: 3,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                    },
                },
            },
        };
    },
});

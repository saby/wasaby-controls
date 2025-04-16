import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { HierarchicalMemory } from 'Types/source';
import { View as TreeGridView, IColumnConfig } from 'Controls/treeGrid';
import { IFooterConfig } from 'Controls/grid';
import { IListDataFactoryArguments, IDataConfig } from 'Controls/dataFactory';

import { WithPhoto } from 'Controls-demo/treeGridNew/DemoHelpers/Data/WithPhoto';

function getData() {
    return WithPhoto.getDataTwoLvl();
}

const columns: IColumnConfig[] = [
    {
        displayProperty: 'title',
    },
    {
        displayProperty: 'rating',
    },
    {
        displayProperty: 'country',
    },
];

const footer: IFooterConfig[] = [
    {
        render: <div className="controlsDemo__hor-padding__list__footerContent">Подвал списка</div>,
        startColumn: 1,
        endColumn: 4,
    },
];

/**
 * Конфигурация иерархической таблицы с кнопкой "Ещё" в подвале развёрнутого узла по умолчанию
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth1700">
            <TreeGridView
                className="demoTreeWithProto__treeGridTwoLevels"
                storeId="Footer"
                columns={columns}
                footer={footer}
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
            Footer: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'Раздел',
                    }),
                    expandedItems: [1, 2, 4],
                    keyProperty: 'key',
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                },
            },
        };
    },
});

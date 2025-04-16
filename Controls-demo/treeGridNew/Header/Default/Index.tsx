import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as TreeGridView } from 'Controls/treeGrid';
import { IColumnConfig, IHeaderConfig } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

const { getData } = Flat;

const columns: IColumnConfig[] = Flat.getColumns();
const header: IHeaderConfig[] = Flat.getHeader();

/**
 * Конфигурация иерархической таблицы с отступом под фото в шаблоне ячейки
 * @param props
 * @param ref
 * @constructor
 */
function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo_fixedWidth500 controlsDemo_wrapper-treeGrid-header-default';
    return (
         <div className={rootClass} ref={ref}>
            <ScrollContainer>
                <TreeGridView storeId="HeaderDefault0" columns={columns} header={header} />
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
            HeaderDefault0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    multiSelectVisibility: 'onhover',
                },
            },
        };
    },
});

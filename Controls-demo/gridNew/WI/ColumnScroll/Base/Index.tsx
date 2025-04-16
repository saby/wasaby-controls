import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IHeaderConfig, IColumnConfig, View as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import 'css!Controls-demo/gridNew/WI/ColumnScroll/Base/BaseColumnScroll';

const { getData } = Countries;

const columns: IColumnConfig[] = [
    {
        displayProperty: 'number',
        width: '40px',
    },
    {
        displayProperty: 'country',
        width: '300px',
    },
    {
        displayProperty: 'capital',
        width: 'max-content',
    },
    {
        displayProperty: 'population',
        width: 'max-content',
    },
    {
        displayProperty: 'square',
        width: 'max-content',
    },
    {
        displayProperty: 'populationDensity',
        width: 'max-content',
    },
];

const header: IHeaderConfig[] = Countries.getHeader();

/**
 * Конфигурация таблицы с базовой настройкой горизонтального скролла
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <ScrollContainer className="Controls-demo__gridNew_ColumnScroll_Base" shadowMode="js">
                <GridView
                    storeId="ColumnScrollBase"
                    columns={columns}
                    columnScroll={true}
                    backgroundStyle="default"
                    header={header}
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
            ColumnScrollBase: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    },
});

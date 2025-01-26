import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IColumnConfig, IHeaderConfig, View as GridView } from 'Controls/grid';
import { Container as Scrollcontainer } from 'Controls/scroll';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

const header: IHeaderConfig[] = Countries.getHeader();
const columns: IColumnConfig[] = Countries.getColumnsWithFixedWidths();

/**
 * Конфигурация таблицы с прилипающей по умолчанию шапкой
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlDemo__grid-header-sticky">
            <Scrollcontainer className="controlsDemo__height400 controlsDemo__width800px">
                <GridView
                    backgroundStyle="default"
                    storeId="HeaderSticky"
                    header={header}
                    columns={columns}
                />
            </Scrollcontainer>
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            HeaderSticky: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: Countries.getData(),
                    }),
                },
            },
        };
    },
});

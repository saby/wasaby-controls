import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IColumnConfig, IHeaderConfig, View as GridView } from 'Controls/grid';
import { Container as Scrollcontainer } from 'Controls/scroll';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import 'css!Controls-demo/gridNew/WI/Header/Sticky/NoSticky/NoSticky';

const header: IHeaderConfig[] = Countries.getHeader();
const columns: IColumnConfig[] = Countries.getColumnsWithFixedWidths();

/**
 * Конфигурация таблицы с отключенным прилипанием шапки
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth800 controlDemo__grid-header-noSticky"
        >
            <Scrollcontainer className="Controls-demo__Header_NoSticky_ScrollContainer">
                <GridView
                    storeId="HeaderNoSticky"
                    header={header}
                    columns={columns}
                    stickyHeader={false}
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
            HeaderNoSticky: {
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

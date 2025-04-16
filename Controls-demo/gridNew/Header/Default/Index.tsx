import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as GridView } from 'Controls/grid';
import { IColumnConfig, IHeaderConfig } from 'Controls/gridRender';
import { Container as Scrollcontainer } from 'Controls/scroll';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

const MAXITEM = 10;

function getData() {
    return Countries.getData().slice(0, MAXITEM);
}

const header: IHeaderConfig[] = Countries.getHeader();
const columns: IColumnConfig[] = Countries.getColumnsWithWidths();

/**
 * Конфигурация таблицы с передачей настроек шапки
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <Scrollcontainer className="controlsDemo__inline-flex">
                <GridView
                    storeId="HeaderDefault"
                    columns={columns}
                    header={header}
                    className="tw-inline-flex"
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
            HeaderDefault: {
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

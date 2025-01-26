import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as GridView } from 'Controls/grid';
import { ICellProps, IColumnConfig, IHeaderConfig } from 'Controls/gridRender';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

const MAXITEM = 10;

function getData() {
    return Countries.getData().slice(0, MAXITEM);
}

const header: IHeaderConfig[] = [
    {
        caption: '# (default)',
    },
    {
        caption: 'Страна (left)',
        getCellProps(): ICellProps {
            return {
                halign: 'left',
            };
        },
    },
    {
        caption: 'Столица (center)',
        getCellProps(): ICellProps {
            return {
                halign: 'center',
            };
        },
    },
    {
        caption: 'Население (right)',
        getCellProps(): ICellProps {
            return {
                halign: 'right',
            };
        },
    },
];
const columns: IColumnConfig[] = [
    {
        displayProperty: 'number',
        width: '100px',
    },
    {
        displayProperty: 'country',
        width: '200px',
    },
    {
        displayProperty: 'capital',
        width: '150px',
    },
    {
        displayProperty: 'population',
        width: '150px',
    },
];

/**
 * Конфигурация таблицы с выравниванием текста в шапке
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__grid-header-default">
            <GridView
                storeId="HeaderAlign"
                columns={columns}
                header={header}
                rowSeparatorSize="s"
                columnSeparatorSize="s"
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
            HeaderAlign: {
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

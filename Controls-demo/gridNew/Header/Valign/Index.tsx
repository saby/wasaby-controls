import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { ICellProps, View as GridView } from 'Controls/grid';
import { IColumnConfig, IHeaderConfig } from 'Controls/gridRender';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import 'css!Controls-demo/gridNew/Header/Valign/Valign';

const MAXITEM = 10;

function getData() {
    return Countries.getData().slice(0, MAXITEM);
}

const header: IHeaderConfig[] = [
    {
        caption: '# (default)',
        getCellProps(): ICellProps {
            return {
                className: 'Controls-demo__Header_Valign_cell',
            };
        },
    },
    {
        caption: 'Страна (top)',
        getCellProps(): ICellProps {
            return {
                valign: 'top',
            };
        },
    },
    {
        caption: 'Столица (center)',
        getCellProps(): ICellProps {
            return {
                valign: 'center',
            };
        },
    },
    {
        caption: 'Население (bottom)',
        getCellProps(): ICellProps {
            return {
                valign: 'bottom',
            };
        },
    },
    {
        caption: 'Население (baseline)',
        getCellProps(): ICellProps {
            return {
                valign: 'baseline',
            };
        },
    },
];
const columns: IColumnConfig[] = [
    {
        displayProperty: 'number',
        width: '80px',
    },
    {
        displayProperty: 'country',
        width: '200px',
    },
    {
        displayProperty: 'capital',
        width: 'max-content',
        compatibleWidth: '98px',
    },
    {
        displayProperty: 'population',
        width: 'max-content',
        compatibleWidth: '118px',
    },
    {
        displayProperty: 'square',
        width: 'max-content',
        compatibleWidth: '156px',
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
                storeId="HeaderValign"
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
            HeaderValign: {
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

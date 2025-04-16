import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { ICellProps, IColumnConfig, View as GridView } from 'Controls/grid';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import 'css!Controls-demo/gridNew/Columns/Valign/Valign';

function getData() {
    return Countries.getData().slice(0, 5);
}

/**
 * Конфигурация вертикального выравнивания контента в ячейках таблицы
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const columns: IColumnConfig[] = React.useMemo(() => {
        return [
            {
                displayProperty: 'number',
                width: '40px',
                getCellProps(_item: Model): ICellProps {
                    return {
                        valign: 'center',
                        className: 'Controls-demo__Columns_Valign_cell',
                    };
                },
            },
            {
                displayProperty: 'country',
                width: '300px',
                getCellProps(_item: Model): ICellProps {
                    return {
                        valign: 'top',
                        className: 'Controls-demo__Columns_Valign_cell',
                    };
                },
            },
            {
                displayProperty: 'capital',
                width: '1fr',
                getCellProps(_item: Model): ICellProps {
                    return {
                        valign: 'bottom',
                        className: 'Controls-demo__Columns_Valign_cell',
                    };
                },
            },
            {
                displayProperty: 'population',
                width: '150px',
                getCellProps(_item: Model): ICellProps {
                    return {
                        className: 'Controls-demo__Columns_Valign_cell',
                    };
                },
            },
        ] as IColumnConfig[];
    }, []);

    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <GridView storeId="ColumnsValign" rowSeparatorSize="s" columns={columns} />
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnsValign: {
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

import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Model } from 'Types/entity';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { ICellProps, IColumnConfig, View as GridView } from 'Controls/grid';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

function getData() {
    return Countries.getData().splice(0, 5);
}

const columns: IColumnConfig[] = [
    {
        displayProperty: 'number',
        width: '40px',
        getCellProps(_item: Model): ICellProps {
            return {
                cursor: 'ponter',
            };
        },
    },
    {
        displayProperty: 'country',
        width: '300px',
        getCellProps(_item: Model): ICellProps {
            return {
                cursor: 'text',
            };
        },
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
 * Конфигурация курсора в ячейках таблицы
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <GridView storeId="CellTemplateCursor" columns={columns} />
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            CellTemplateCursor: {
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

import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IHeaderConfig, ICellProps, IColumnConfig, View as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

function getData() {
    return [
        {
            key: 0,
            number: 1,
            country: 'Россия',
            capital: 'Москва',
            population: 143420300,
            square: 17075200,
            populationDensity: 8,
        },
        {
            key: 1,
            number: 2,
            country: 'Соединенные Штаты Америки',
            capital: 'Вашингтон',
            population: 295734100,
            square: 9629091,
            populationDensity: 30.71,
        },
        {
            key: 2,
            number: 3,
            country: 'Доминиканская Республика',
            capital: 'Санто-Доминго',
            population: 10499707,
            square: 9629091,
            populationDensity: 30.71,
        },
        {
            key: 3,
            number: 4,
            country: 'Новая Зеландия',
            capital: 'Веллингтон',
            population: 4942500,
            square: 9629091,
            populationDensity: 30.71,
        },
        {
            key: 4,
            number: 5,
            country: 'Бразилия',
            capital: 'Бразилиа',
            population: 186112800,
            square: 8511965,
            populationDensity: 21.86,
        },
    ];
}

const header: IHeaderConfig[] = Countries.getHeader().slice(1, 4);
const columns: IColumnConfig[] = [
    {
        displayProperty: 'country',
        width: '100px',
        getCellProps(_item: Model): ICellProps {
            return {
                textOverflow: 'ellipsis',
            };
        },
    },
    {
        displayProperty: 'capital',
        width: '200px',
    },
    {
        displayProperty: 'population',
        width: '200px',
    },
];

/**
 * Конфигурация таблицы с переполнением текста в ячейках
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <ScrollContainer className="tw-inline-flex">
                <GridView storeId="ColumnsTextOverflowEllipsis" columns={columns} header={header} />
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
            ColumnsTextOverflowEllipsis: {
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

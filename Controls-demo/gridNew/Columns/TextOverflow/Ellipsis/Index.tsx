import { forwardRef } from 'react';
import { View } from 'Controls/grid';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

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
const columns: IColumn[] = [
    {
        displayProperty: 'country',
        width: '100px',
        textOverflow: 'ellipsis',
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
const header: IHeaderCell[] = Countries.getHeader().slice(1, 4);

const Component = forwardRef(function (props, ref) {
    /**
     * Необязательно оборачивать список в скролл контейнер.
     * Здесь это сделано для местного решения этих ошибок со stickyHeader.
     * https://online.sbis.ru/opendoc.html?guid=64a425b7-4a53-4bb1-932e-2899ffe5fd98
     * https://online.sbis.ru/opendoc.html?guid=138c14b7-d571-4e61-8177-cb0322763bff
     */
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <Container className="controlsDemo__inline-flex">
                <View header={header} storeId="ColumnsTextOverflowEllipsis" columns={columns} />
            </Container>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
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
};

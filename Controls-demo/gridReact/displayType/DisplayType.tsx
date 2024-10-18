import * as React from 'react';
import 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { RecordSet } from 'Types/collection';

function getData() {
    return [
        {
            key: 0,
            country: 'Россия',
            population: 143420300,
            populationDensity: 8,
            date: new Date('December 17, 2021 10:00:00'),
        },
        {
            key: 1,
            country: 'Канада',
            population: 32805000,
            populationDensity: 3,
            date: new Date('December 17, 2021 10:00:00'),
        },
        {
            key: 2,
            country: 'Соединенные Штаты Америки',
            population: 295734100,
            populationDensity: 30.71,
            date: new Date('December 17, 2021 10:00:00'),
        },
        {
            key: 3,
            country: 'Китай',
            population: 1306313800,
            populationDensity: 136.12,
            date: new Date('December 17, 2021 10:00:00'),
        },
        {
            key: 4,
            country: 'Бразилия',
            population: 186112800,
            populationDensity: 21.86,
            date: new Date('December 17, 2021 10:00:00'),
        },
    ];
}

function getColumns() {
    return [
        {
            displayProperty: 'country',
            key: 'country',
        },
        {
            displayProperty: 'population',
            displayType: 'number',
            key: 'population',
            displayTypeOptions: {
                useGrouping: false,
                tooltip: 'Популяция',
            },
        },
        {
            displayProperty: 'populationDensity',
            displayType: 'money',
            key: 'populationDensity',
            displayTypeOptions: {
                showEmptyDecimals: false,
            },
        },
        {
            displayProperty: 'date',
            displayType: 'date',
            key: 'date',
            displayTypeOptions: {
                format: "DD MMM'YY HH:mm",
            },
        },
    ];
}

function getItems(): RecordSet {
    return new RecordSet({
        keyProperty: 'key',
        rawData: getData(),
    });
}

function ResultsDemo(props, ref: React.ForwardedRef<HTMLDivElement>) {
    const items = React.useMemo(() => getItems(), []);
    const columns = React.useMemo(() => getColumns(), []);

    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__cell">
                <GridItemsView items={items} columns={columns} />
            </div>
        </div>
    );
}

export default React.forwardRef(ResultsDemo);

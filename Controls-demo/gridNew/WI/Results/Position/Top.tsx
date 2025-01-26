import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IHeaderConfig, IColumnConfig, IResultConfig, View as GridView } from 'Controls/grid';
import { Number as NumberDecorator } from 'Controls/baseDecorator';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

function getData() {
    return Countries.getData().slice(0, 9);
}

const header: IHeaderConfig[] = [
    { caption: '#', key: 'header-num' },
    { caption: 'Страна', key: 'header-country' },
    { caption: 'Столица', key: 'header-capital' },
    { caption: 'Население', key: 'header-population' },
    { caption: 'Площадь км2', key: 'header-square' },
    {
        caption: 'Плотность населения чел/км2',
        key: 'header-populationDensity',
    },
];

function ResultsRender({ value }: { value: number }): React.ReactElement {
    return (
        <NumberDecorator
            value={value}
            useGrouping={true}
            fontWeight={'bold'}
            fontColorStyle={'secondary'}
            fontSize={'m'}
        />
    );
}

const results: IResultConfig[] = [
    { key: 'results-num' },
    { key: 'results-country' },
    { key: 'results-capital' },
    {
        key: 'results-population',
        render: <ResultsRender value={3956986345} />,
    },
    {
        key: 'results-square',
        render: <ResultsRender value={12423523} />,
    },
    {
        key: 'results-populationDensity',
        render: <ResultsRender value={5.8} />,
    },
];

const columns: IColumnConfig[] = [
    { displayProperty: 'number', width: '40px' },
    { displayProperty: 'country', width: '224px' },
    { displayProperty: 'capital', width: 'max-content' },
    { displayProperty: 'population', width: 'max-content' },
    { displayProperty: 'square', width: 'max-content' },
    { displayProperty: 'populationDensity', width: 'max-content' },
];

/**
 * Конфигурация таблицы с итогами сверху
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__maxWidth800">
            <GridView
                storeId="ResultsPositionTop"
                header={header}
                columns={columns}
                results={results}
                resultsPosition="top"
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
            ResultsPositionTop: {
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

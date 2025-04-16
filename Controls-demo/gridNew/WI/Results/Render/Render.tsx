import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import {
    IHeaderConfig,
    IColumnConfig,
    IResultConfig,
    useListData,
    View as GridView,
} from 'Controls/grid';
import { Money as MoneyDecorator } from 'Controls/baseDecorator';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { Model } from 'Types/entity';

function getData() {
    return Countries.getData().slice(0, 5);
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

function ResultsRender(): React.ReactElement {
    const { results: metaResults } = useListData(['results']) as { results: Model };
    return (
        <div className="controls-text-secondary controls-fontsize-l controls-fontweight-bold tw-w-full tw-flex tw-justify-end">
            Среднее:&nbsp;
            <MoneyDecorator
                value={metaResults.get('square')}
                useGrouping={true}
                fontWeight="bold"
                fontColorStyle="primary"
            />
        </div>
    );
}

const results: IResultConfig[] = [
    { key: 'results-num', render: <ResultsRender />, startColumn: 1, endColumn: 7 },
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
 * Конфигурация таблицы с объединённой строкой итогов снизу.
 * Данные итогов получаются из мета-данных ответа источника данных.
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__maxWidth800">
            <GridView
                storeId="ResultsFromMetaCustomResultsCells"
                header={header}
                columns={columns}
                results={results}
                resultsPosition="bottom"
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
            ResultsFromMetaCustomResultsCells: {
                dataFactoryName: 'Controls-demo/gridNew/WI/Results/Render/CustomFactory',
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

import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Model } from 'Types/entity';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { useSlice } from 'Controls-DataEnv/context';
import { View as TreeGridView } from 'Controls/treeGrid';
import { IColumnConfig, IHeaderConfig, IResultConfig, useListData } from 'Controls/grid';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { ExtendedSlice } from './CustomFactory';

const { getData } = Flat;

const columns: IColumnConfig[] = Flat.getColumns();
const header: IHeaderConfig[] = Flat.getHeader();

const CustomResults = React.memo(function CustomResults(): React.ReactElement {
    const { results: resultsData } = useListData(['results']) as { results: Model };
    return (
        <div
            style={{
                color: '#313E78',
                fontWeight: 'var(--font-weight-bold)',
                paddingTop: '5px',
                paddingBottom: '5px',
                backgroundColor: '#fafafa',
            }}
        >
            Результаты из метаданных. Средний рейтинг - {resultsData.get('rating')}. Средняя цена -{' '}
            {resultsData.get('price')}
        </div>
    );
});

const results: IResultConfig[] = [
    {
        key: 'results-custom',
        startColumn: 1,
        endColumn: 4,
        render: <CustomResults />,
    },
];

/**
 * Конфигурация иерархической таблицы с итогами сверху
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const slice = useSlice('ResultsFromMetaCustomResultsRow') as ExtendedSlice;
    const updateMeta = React.useCallback((): void => {
        slice.reload();
    }, []);
    const setMeta = React.useCallback((): void => {
        slice.resetMetaData();
    }, []);
    const setResultRow = React.useCallback((): void => {
        slice.resetSingleMetaResultsField();
    }, []);

    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <TreeGridView
                storeId="ResultsFromMetaCustomResultsRow"
                columns={columns}
                header={header}
                results={results}
                resultsPosition="top"
            />
            <div>
                <div>
                    <a
                        href="#"
                        className="controls-text-link controlsDemo-udateMetaData-grid-results_autotest"
                        onClick={updateMeta}
                    >
                        Перегенерировать и обновить результаты в метаданных при перезагрузке списка
                    </a>
                    <br />
                    <a
                        href="#"
                        className="controls-text-link controlsDemo-setMetaData-grid-results_autotest"
                        onClick={setMeta}
                    >
                        Перегенерировать и установить метаданные в RecordSet напрямую
                    </a>
                    <br />
                    <a
                        href="#"
                        className="controls-text-link controlsDemo-setMetaData-grid-results_autotest"
                        onClick={setResultRow}
                    >
                        Перегенерировать только одно поле в результатах
                    </a>
                </div>
            </div>
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ResultsFromMetaCustomResultsRow: {
                dataFactoryName: 'Controls-demo/treeGridNew/Wi/Results/CustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    },
});

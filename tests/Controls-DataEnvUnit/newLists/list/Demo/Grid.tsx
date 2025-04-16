import { Memory } from 'Types/source';
import { Component as GridComponent } from 'Controls-Lists/grid';
import { buildDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/buildDemo';
import { personsData, KEY_PROPERTY } from './Data/personsData';
import { Container as ScrollContainer } from 'Controls/scroll';
import { ListSlice, IListDataFactoryArguments } from 'Controls-DataEnv/list';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { adapter } from 'Types/entity';
import { _private_DecomposedPromise } from 'Controls-DataEnv/abstractList';
import * as React from 'react';
import { Input as SearchInput } from 'Controls-ListEnv/searchConnected';

export const GRID_QA = 'js-demo-grid-new';
export const SEARCH_QA = 'js-demo-grid-new-search-input';
export const FILTER_QA = 'js-demo-grid-new';

const sourceFilter = (item: adapter.IRecord, queryFilter: object) => {
    let addToData = true;
    for (const filterField in queryFilter) {
        if (queryFilter.hasOwnProperty(filterField) && item.get(filterField) && addToData) {
            const filterValue = (queryFilter as Record<string, unknown>)[filterField];
            const itemValue = item.get(filterField);
            addToData = !filterValue || filterValue === itemValue;
        }
    }
    return addToData;
};

export default buildDemo<ListSlice, IListDataFactoryArguments>({
    actions: [
        {
            name: 'Отметить Hilary Osborne (1, команда mark)',
            dataQa: 'markedKey=1',
            action: ({ slice }) => {
                slice.mark(1);
            },
        },
        {
            name: 'Отметить Benjamin Pruitt (3, команда mark)',
            dataQa: 'markedKey=3',
            action: ({ slice }) => {
                slice.mark(3);
            },
        },
        {
            name: 'Отметить Hilary Osborne (1, setState)',
            dataQa: 'markedKey=1,setState',
            action: ({ slice }) => {
                slice.setState({ markedKey: 1 });
            },
        },
        {
            name: 'Отметить Benjamin Pruitt (3, setState)',
            dataQa: 'markedKey=3,setState',
            action: ({ slice }) => {
                slice.setState({ markedKey: 3 });
            },
        },
        {
            name: 'Сбросить структуру фильтров',
            dataQa: 'resetFilterDescription',
            action: ({ slice }) => {
                slice.resetFilterDescription();
            },
        },
        {
            name: 'Установить новый фильтр (setFilter)',
            dataQa: 'setFilter Norway',
            action: ({ slice }) => {
                slice.setFilter({
                    country: 'Norway',
                });
            },
        },
        {
            name: 'Поиск: test',
            dataQa: 'searchValue=test',
            action: ({ slice }) => {
                slice.setState({
                    searchValue: 'test',
                });
            },
        },
        {
            name: 'Поменять режим отображения на табличный',
            dataQa: 'viewMode=table',
            action: ({ slice }) => {
                slice.setState({
                    viewMode: 'table',
                });
            },
        },
        {
            name: 'Добавить действие на элементы',
            dataQa: 'itemActions=Controls/actions:Remove',
            action: ({ slice }) => {
                slice.setState({
                    itemActions: [{ actionName: 'Controls/actions:Remove' }],
                });
            },
        },
    ],
    Component: ({ storeId, waitForRender }) => {
        const buildPromise = React.useMemo(
            () => _private_DecomposedPromise.getDecomposedPromise<void>(),
            []
        );

        React.useLayoutEffect(() => {
            waitForRender(buildPromise.promise);
            setTimeout(() => {
                buildPromise.resolve();
            }, 150);
        }, []);
        // Оборачиваем временно в контейнер, т.к. наш контрол не умеет строитьс я вне скролла.
        return (
            <ScrollContainer>
                <div data-qa={SEARCH_QA}>
                    <SearchInput storeId={storeId} />
                </div>
                <FilterView storeId={storeId} dataQa={FILTER_QA} />
                <GridComponent storeId={storeId} dataQa={GRID_QA} />
            </ScrollContainer>
        );
    },
    demoPath: 'Controls-DataEnvUnit/newLists/list/Demo/Grid',
    getDataFactoryArguments: () => ({
        collectionType: 'Grid',
        source: new Memory({
            keyProperty: KEY_PROPERTY,
            data: personsData.slice(0, 5),
            filter: sourceFilter,
        }),
        columns: [
            {
                key: 'name',
                displayProperty: 'name',
            },
            {
                key: 'country',
                displayProperty: 'country',
            },
        ],
        keyProperty: KEY_PROPERTY,
    }),
});

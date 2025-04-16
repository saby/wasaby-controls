import * as React from 'react';
import { Component as TreeGridComponent } from 'Controls-Lists/treeGrid';
import { buildDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/buildDemo';
import {
    getSomeSubjects,
    KEY_PROPERTY,
    PARENT_PROPERTY,
    NODE_PROPERTY,
    DISPLAY_PROPERTY,
} from './Data/RussiaSubjects';
import { Container as ScrollContainer } from 'Controls/scroll';
import { View as Panel } from 'Controls-ListEnv/operationsPanelConnected';
import { _private_DecomposedPromise } from 'Controls-DataEnv/abstractList';
import { Input as SearchInput } from 'Controls-ListEnv/searchConnected';
import { HeadingPath } from 'Controls-ListEnv/breadcrumbs';
import {
    IListState,
    ListSlice,
    IListDataFactoryArguments,
    IListDataFactoryLoadResult,
} from 'Controls-DataEnv/list';
import type { TKey } from 'Controls-DataEnv/interface';
import HierarchyMemory from './Utils/HierarchyMemory';

import { Direction } from 'Controls-DataEnv/listTypes';

import './Utils/CountSource';
import { RecordSet } from 'Types/collection';

export const PMO_QA = 'js-demo-pmo-data-qa';
export const TREE_GRID_QA = 'js-demo-tree-grid-data-qa';
export const SEARCH_QA = 'js-demo-search-input-data-qa';
export const BREADCRUMBS_QA = 'js-demo-breadcrumbs-input-data-qa';

interface TestOptions {
    /**
     * Флаг, при котором в прикладном _nodeDataLoaded ко всем загруженным записям будет добавлено "Изменен в nodeDataLoaded"
     */
    changeItemsInNodeDataLoaded?: boolean;
}

interface IUserListDataFactoryArguments extends IListDataFactoryArguments, TestOptions {}

interface IUserListState extends IListState, TestOptions {
    /**
     * Опция для сворачивания всех узлов в прикладном bas после вызова super.bas()
     */
    collapseAllItemsAfterBas?: boolean;
}

class UserSlice extends ListSlice<IUserListState> {
    protected _initState(
        loadResult: IListDataFactoryLoadResult,
        initConfig: IUserListDataFactoryArguments
    ): IListState {
        const state = super._initState(loadResult, initConfig);
        state.changeItemsInNodeDataLoaded = initConfig.changeItemsInNodeDataLoaded;
        return state;
    }

    protected _nodeDataLoaded(
        items: RecordSet,
        _key: TKey,
        _direction: Direction,
        nextState: IUserListState
    ): Partial<IUserListState> | Promise<Partial<IUserListState>> {
        if (this.state.changeItemsInNodeDataLoaded) {
            items.forEach((item) => {
                item.set(
                    DISPLAY_PROPERTY,
                    item.get(DISPLAY_PROPERTY) + ' Изменен в nodeDataLoaded'
                );
            });
        }
        return super._nodeDataLoaded(items, _key, _direction, nextState);
    }

    protected async _beforeApplyState(nextState: IUserListState): Promise<IUserListState> {
        const resultState = await super._beforeApplyState(nextState);
        if (resultState.collapseAllItemsAfterBas) {
            resultState.expandedItems = [];
            resultState.collapsedItems = [];
            delete resultState.collapseAllItemsAfterBas;
        }

        return resultState;
    }
}

export default buildDemo<UserSlice, IUserListDataFactoryArguments>({
    actions: [
        {
            name: 'Москва и Московская обл. (1, команда mark)',
            dataQa: 'markedKey=1',
            action: ({ slice }) => {
                slice.mark('1');
            },
        },
        {
            name: 'Москва (1_1, команда mark)',
            dataQa: 'markedKey=1_1',
            action: ({ slice }) => {
                slice.mark('1_1');
            },
        },
        {
            name: 'Свернуть все узлы после платформенной логики',
            dataQa: 'collapseAllItemsAfterBas',
            action: ({ slice }) => {
                slice.setState({
                    collapseAllItemsAfterBas: true,
                });
            },
        },
        {
            name: 'Выйти в корень и отметить Санкт-Петербург',
            dataQa: 'setState: root null, markedKey 2',
            action: ({ slice }) => {
                slice.setState({
                    root: null,
                    markedKey: '2',
                });
            },
        },
        {
            name: 'Раскрыть Восточный административный округ',
            dataQa: 'expand 1_1_1',
            action: ({ slice }) => {
                slice.expand('1_1_1');
            },
        },
        {
            name: 'Раскрыть Мск, СПБ и Адыгею',
            dataQa: 'expand 1, 2, 3',
            action: ({ slice }) => {
                slice.setState({
                    expandedItems: ['1', '2', '3'],
                });
            },
        },
        {
            name: 'Перезагрузить список',
            dataQa: 'reload',
            action: ({ slice }) => {
                slice.reload();
            },
        },
        {
            name: 'Удалить папку Москва и Московская обл.',
            dataQa: 'remove 1',
            action: ({ slice }) => {
                const items = slice.state.items;
                if (items) {
                    const removingItem = items.getRecordById('1');
                    if (removingItem) {
                        items.remove(removingItem);
                    }
                }
            },
        },
        {
            name: 'Осуществить SPA переход (reloadDemo)',
            dataQa: 'reloadDemo',
            action: () => {
                if (window) {
                    // Для воспроизведения только на демках в браузере
                    // @ts-ignore
                    window.reloadDemo();
                }
            },
        },
        {
            name: 'Отметить Москва',
            dataQa: 'Отметить Москва',
            action: ({ slice }) => {
                slice.mark('1_1');
            },
        },
        {
            name: 'Вернуть ошибку загрузки для следующего запроса',
            dataQa: 'rejectNextQuery',
            action: ({ slice }) => {
                (slice.state.source as HierarchyMemory).rejectNextQuery();
            },
        },
    ],
    Slice: UserSlice,
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
                <div>
                    {/* TODO: Дать возможность вешать dataQa чтобы сократить размер снапшота */}
                    <div data-qa={SEARCH_QA}>
                        <SearchInput storeId={storeId} />
                    </div>
                    <div data-qa={PMO_QA}>
                        <Panel storeId={storeId} />
                    </div>
                    <div data-qa={BREADCRUMBS_QA}>
                        <HeadingPath storeId={storeId} />
                    </div>
                    <TreeGridComponent
                        storeId={storeId}
                        data-qa={TREE_GRID_QA}
                        changeRootByItemClick={true}
                    />
                </div>
            </ScrollContainer>
        );
    },
    demoPath: 'Controls-DataEnvUnit/newLists/list/Demo/TreeGrid',
    getDataFactoryArguments: () => ({
        collectionType: 'TreeGrid',
        listActions: [{ actionName: 'Controls/actions:Remove' }],
        source: new HierarchyMemory({
            keyProperty: KEY_PROPERTY,
            data: getSomeSubjects([
                ['1', 10],
                ['1_1', 10],
                ['1_1_1', 10],
                ['2', 10],
                ['3', 10],
                ['39', 10],
                ['78', 10],
            ]),
        }),
        columns: [
            {
                key: DISPLAY_PROPERTY,
                displayProperty: DISPLAY_PROPERTY,
            },
        ],
        keyProperty: KEY_PROPERTY,
        parentProperty: PARENT_PROPERTY,
        nodeProperty: NODE_PROPERTY,
        searchParam: DISPLAY_PROPERTY,
    }),
});

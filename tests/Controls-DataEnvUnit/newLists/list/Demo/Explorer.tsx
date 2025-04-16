import * as React from 'react';
import { View as Explorer } from 'Controls/explorer';
import { buildDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/buildDemo';
import {
    getSomeSubjects,
    KEY_PROPERTY,
    PARENT_PROPERTY,
    NODE_PROPERTY,
    DISPLAY_PROPERTY,
} from './Data/RussiaSubjects';
import { View as Panel } from 'Controls-ListEnv/operationsPanelConnected';
import { Input as SearchInput } from 'Controls-ListEnv/searchConnected';
import { _private_DecomposedPromise } from 'Controls-DataEnv/abstractList';
import {
    IListState,
    IListDataFactoryArguments,
    IListDataFactoryLoadResult,
} from 'Controls-DataEnv/currentList';
import HierarchyMemory from './Utils/HierarchyMemory';
import { ListOldWrapper, ListSliceOld } from './ListOldWrapper/ListOldWrapper';

export const PMO_QA = 'js-demo-pmo-data-qa';
export const SEARCH_QA = 'js-demo-search-input-data-qa';
export const EXPLORER_QA = 'js-demo-explorer-data-qa';

const DEFAULT_COLUMNS = [
    {
        key: DISPLAY_PROPERTY,
        displayProperty: DISPLAY_PROPERTY,
    },
];

interface IUserListDataFactoryArguments extends IListDataFactoryArguments {
    _userSaveSearchBetweenRoots?: boolean;
}

interface IUserListState extends IListState {
    _userSaveSearchBetweenRoots?: boolean;
}

class UserSlice extends ListSliceOld<IUserListState> {
    protected _initState(
        loadResult: IListDataFactoryLoadResult,
        config: IUserListDataFactoryArguments
    ): IUserListState {
        const state = super._initState(loadResult, config);
        state._userSaveSearchBetweenRoots = config._userSaveSearchBetweenRoots;
        return state;
    }
    protected async _beforeApplyState(nextStateProp: IUserListState): Promise<IUserListState> {
        if (nextStateProp._userSaveSearchBetweenRoots && nextStateProp.root !== this.state.root) {
            nextStateProp.searchValue = this.state.searchValue;
            nextStateProp.searchInputValue = this.state.searchInputValue;
        }
        return super._beforeApplyState(nextStateProp);
    }
}

export default buildDemo<UserSlice, IUserListDataFactoryArguments>({
    actions: [
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
            name: 'Выйти в корень и отметить Санкт-Петербург',
            dataQa: 'setState: root null, markedKey 2',
            action: ({ slice }) => {
                slice.setState({
                    root: null,
                    markedKey: '2',
                });
            },
        },
    ],
    Slice: UserSlice,
    Component: ({ storeId, waitForRender, slice }) => {
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
            <div>
                {/* TODO: Дать возможность вешать dataQa чтобы сократить размер снапшота */}
                <div data-qa={SEARCH_QA}>
                    <SearchInput storeId={storeId} />
                </div>
                <div data-qa={PMO_QA}>
                    <Panel storeId={storeId} />
                </div>
                <ListOldWrapper slice={slice}>
                    <Explorer
                        storeId={storeId}
                        columns={slice.state.columns || DEFAULT_COLUMNS}
                        data-qa={EXPLORER_QA}
                    />
                </ListOldWrapper>
            </div>
        );
    },
    demoPath: 'Controls-DataEnvUnit/newLists/list/Demo/Explorer',
    getDataFactoryArguments: () => ({
        source: new HierarchyMemory({
            keyProperty: KEY_PROPERTY,
            data: getSomeSubjects([
                ['1', 2],
                ['2', 2],
            ]),
        }),
        columns: DEFAULT_COLUMNS,
        keyProperty: KEY_PROPERTY,
        parentProperty: PARENT_PROPERTY,
        nodeProperty: NODE_PROPERTY,
        searchParam: DISPLAY_PROPERTY,
        displayProperty: DISPLAY_PROPERTY,
    }),
});

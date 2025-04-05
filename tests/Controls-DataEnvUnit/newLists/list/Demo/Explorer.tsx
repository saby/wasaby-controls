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
import { Slice as CurrentListSlice } from 'Controls-DataEnv/currentList';
import HierarchyMemory from './Utils/HierarchyMemory';

export const PMO_QA = 'js-demo-pmo-data-qa';
export const SEARCH_QA = 'js-demo-search-input-data-qa';
export const EXPLORER_QA = 'js-demo-explorer-data-qa';
const DEFAULT_COLUMNS = [
    {
        key: DISPLAY_PROPERTY,
        displayProperty: DISPLAY_PROPERTY,
    },
];

export default buildDemo({
    Slice: CurrentListSlice,
    Component: ({ storeId, slice, waitForRender }) => {
        const buildPromise = React.useMemo(
            () => _private_DecomposedPromise.getDecomposedPromise<void>(),
            []
        );

        React.useLayoutEffect(() => {
            if (slice.state.operationsPanelVisible) {
                waitForRender(buildPromise.promise);

                setTimeout(() => {
                    buildPromise.resolve();
                }, 150);
            }
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
                <Explorer
                    storeId={storeId}
                    columns={slice.state.columns || DEFAULT_COLUMNS}
                    data-qa={EXPLORER_QA}
                />
            </div>
        );
    },
    demoPath: 'Controls-DataEnvUnit/newLists/list/Demo/Explorer',
    dataFactoryArguments: {
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
    },
});

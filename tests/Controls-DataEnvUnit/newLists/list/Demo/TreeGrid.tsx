import { Memory } from 'Types/source';
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

export const PMO_QA = 'js-demo-pmo-data-qa';
export const TREE_GRID_QA = 'js-demo-tree-grid-data-qa';

export default buildDemo({
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
    ],
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
            <ScrollContainer>
                <div>
                    {/* TODO: Дать возможность вешать dataQa чтобы сократить размер снапшота */}
                    <div data-qa={PMO_QA}>
                        <Panel storeId={storeId} />
                    </div>
                    <TreeGridComponent storeId={storeId} data-qa={TREE_GRID_QA} />
                </div>
            </ScrollContainer>
        );
    },
    demoPath: 'Controls-DataEnvUnit/newLists/list/Demo/TreeGrid',
    dataFactoryArguments: {
        collectionType: 'TreeGrid',
        listActions: [{ actionName: 'Controls/actions:Remove' }],
        source: new Memory({
            keyProperty: KEY_PROPERTY,
            data: getSomeSubjects([
                ['1', 10],
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
    },
});

import * as React from 'react';
import { Memory } from 'Types/source';
import { buildDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/buildDemo';
import { personsData, KEY_PROPERTY } from './Data/personsData';
import { Input as SearchInput } from 'Controls-ListEnv/searchConnected';
import { View as ListComponent } from 'Controls/list';
import { View as Panel } from 'Controls-ListEnv/operationsPanelConnected';
import { _private_DecomposedPromise } from 'Controls-DataEnv/abstractList';
import { ListOldWrapper, ListSliceOld } from './ListOldWrapper/ListOldWrapper';

export const LIST_QA = 'js-demo-list';
export const SEARCH_QA = 'js-demo-search-input-data-qa';
export const PMO_QA = 'js-demo-pmo-data-qa';
const DISPLAY_PROPERTY = 'name';

export default buildDemo({
    actions: [
        {
            name: 'Выключить видимость маркера (markerVisibility=hidden)',
            dataQa: 'markerVisibility=hidden',
            action: ({ slice }) => {
                slice.setState({ markerVisibility: 'hidden' });
            },
        },
        {
            name: 'Включить видимость маркера (markerVisibility=visible)',
            dataQa: 'markerVisibility=visible',
            action: ({ slice }) => {
                slice.setState({ markerVisibility: 'visible' });
            },
        },
        {
            name: 'Отметить Lumi Neva(0, команда mark)',
            dataQa: 'markedKey=0',
            action: ({ slice }) => {
                slice.mark(0);
            },
        },
    ],
    Slice: ListSliceOld,
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

        return (
            <div>
                <div data-qa={SEARCH_QA}>
                    <SearchInput storeId={storeId} />
                </div>
                <div data-qa={PMO_QA}>
                    <Panel storeId={storeId} />
                </div>
                <div data-qa={LIST_QA}>
                    <ListOldWrapper slice={slice}>
                        <ListComponent storeId={storeId} />
                    </ListOldWrapper>
                </div>
            </div>
        );
    },
    demoPath: 'Controls-DataEnvUnit/newLists/list/Demo/ListOld',
    dataFactoryArguments: {
        source: new Memory({
            keyProperty: KEY_PROPERTY,
            data: personsData.slice(0, 5),
        }),
        keyProperty: KEY_PROPERTY,
        displayProperty: DISPLAY_PROPERTY,
        searchParam: DISPLAY_PROPERTY,
    },
});

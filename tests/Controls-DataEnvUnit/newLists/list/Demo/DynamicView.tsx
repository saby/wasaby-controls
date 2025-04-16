import { Memory } from 'Types/source';
import { buildDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/buildDemo';
import { personsData, KEY_PROPERTY } from './Data/personsData';
import { Input as SearchInput } from 'Controls-ListEnv/searchConnected';
import { View as ListComponent } from 'Controls/baseList';
import { View as TileComponent } from 'Controls/tile';
import { View as SearchBreadcrumbsTile } from 'Controls/searchBreadcrumbsTile';
import { View as SearchBreadcrumbsGrid } from 'Controls/searchBreadcrumbsGrid';
import { View as Panel } from 'Controls-ListEnv/operationsPanelConnected';
import { ListOldWrapper, ListSliceOld } from './ListOldWrapper/ListOldWrapper';
import { IListDataFactoryArguments } from 'Controls-DataEnv/currentList';

export const LIST_QA = 'js-demo-list';
export const SEARCH_QA = 'js-demo-search-input-data-qa';
export const PMO_QA = 'js-demo-pmo-data-qa';
const DISPLAY_PROPERTY = 'name';

const getColumns = () => [
    {
        key: 'name',
        displayProperty: 'name',
    },
    {
        key: 'country',
        displayProperty: 'country',
    },
];

export default buildDemo<ListSliceOld, IListDataFactoryArguments>({
    actions: [
        {
            name: 'Переключить на плитку',
            dataQa: 'viewMode=tile',
            action: ({ slice }) => {
                slice.setViewMode('tile');
            },
        },
        {
            name: 'Переключить на список',
            dataQa: 'viewMode=list',
            action: ({ slice }) => {
                slice.setViewMode('list');
            },
        },
        {
            name: 'Переключить на поиск',
            dataQa: 'viewMode=search',
            action: ({ slice }) => {
                slice.setViewMode('search');
            },
        },
    ],
    Slice: ListSliceOld,
    Component: ({ storeId, slice }) => {
        const resolveComponent = () => {
            switch (slice.state.viewMode) {
                case 'tile': {
                    return <TileComponent storeId={storeId} />;
                }
                case 'search': {
                    return <SearchBreadcrumbsGrid storeId={storeId} columns={getColumns()} />;
                }
                case 'searchTile': {
                    return <SearchBreadcrumbsTile storeId={storeId} />;
                }
                default: {
                    return <ListComponent storeId={storeId} />;
                }
            }
        };

        return (
            <div>
                <div data-qa={SEARCH_QA}>
                    <SearchInput storeId={storeId} />
                </div>
                <div data-qa={PMO_QA}>
                    <Panel storeId={storeId} />
                </div>
                <div data-qa={LIST_QA}>
                    <ListOldWrapper slice={slice}>{resolveComponent()}</ListOldWrapper>
                </div>
            </div>
        );
    },
    demoPath: 'Controls-DataEnvUnit/newLists/list/Demo/DynamicView',
    getDataFactoryArguments: () => ({
        source: new Memory({
            keyProperty: KEY_PROPERTY,
            data: personsData.slice(0, 5),
        }),
        keyProperty: KEY_PROPERTY,
        displayProperty: DISPLAY_PROPERTY,
        searchParam: DISPLAY_PROPERTY,
    }),
});

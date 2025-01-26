import type { TUI_Dependencies } from '../base/types';
import type { TState } from './types';

export enum LibPaths {
    List = 'Controls/list',
    TreeTile = 'Controls/treeTile',
    NewTreeTile = 'Controls-Lists/treeTile',
    NewTreeGrid = 'Controls-Lists/treeGrid',
    Tile = 'Controls/tile',
    SearchBreadcrumbsGrid = 'Controls/searchBreadcrumbsGrid',
    SearchBreadcrumbsTile = 'Controls/searchBreadcrumbsTile',
    ExpandedCompositeTree = 'Controls/expandedCompositeTree',
    WidgetsNavigation = 'Controls-widgets/navigation',
    RadioGroup = 'Controls/RadioGroup:Control',
    ColumnsItemsView = 'Controls/columns:ItemsView',
    TreeTileItemsView = 'Controls/treeTile:ItemsView',
    Chips = 'Controls/Chips:Control',
    SliceDebug = 'Controls-DataEnv/listDebug',
    TreeGrid = 'Controls/treeGridDisplay',
    Tree = 'Controls/tree',
    Columns = 'Controls/columns',
    Grid = 'Controls/gridDisplay',
    AdaptiveTile = 'Controls/adaptiveTile',
    Marker = 'Controls/marker',
    MultiSelection = 'Controls/multiselection',
    MarkerComponent = 'Controls/markerComponent',
    Checkbox = 'Controls/checkbox',
}

export const UI_DEPENDENCIES: TUI_Dependencies<TState> = {
    [LibPaths.TreeTile]: [(state) => state.viewMode === 'tile' && !!state.nodeProperty],
    [LibPaths.NewTreeTile]: [
        (state) => state.isLatestInteractorVersion && state.viewMode === 'tile',
    ],
    [LibPaths.NewTreeGrid]: [
        (state) => state.isLatestInteractorVersion && state.viewMode === 'table',
    ],
    [LibPaths.List]: [
        (state) => {
            return !!getCatalogConfig(state.items);
        },
    ],
    [LibPaths.Tile]: [
        {
            prop: 'viewMode',
            value: ['tile'],
        },
    ],
    [LibPaths.SearchBreadcrumbsGrid]: [
        {
            prop: 'viewMode',
            value: ['search'],
        },
    ],
    [LibPaths.SearchBreadcrumbsTile]: [
        {
            prop: 'viewMode',
            value: ['searchTile'],
        },
    ],
    [LibPaths.ExpandedCompositeTree]: [
        {
            prop: 'viewMode',
            value: ['composite'],
        },
        (state) => {
            return isCatalogCompositeView(state.items, state.viewMode);
        },
    ],
    [LibPaths.WidgetsNavigation]: [
        {
            prop: 'viewMode',
            value: ['composite'],
        },
        (state) => {
            return isCatalogCompositeView(state.items, state.viewMode);
        },
    ],
    [LibPaths.Chips]: [
        (state) => {
            return isCatalogCompositeView(state.items, state.viewMode, 'Navigation');
        },
    ],
    [LibPaths.RadioGroup]: [
        (state) => {
            return isCatalogCompositeView(state.items, state.viewMode, 'Navigation');
        },
    ],
    [LibPaths.ColumnsItemsView]: [
        (state) => {
            return isCatalogCompositeView(state.items, state.viewMode, 'Columns');
        },
    ],
    [LibPaths.TreeTileItemsView]: [
        (state) => {
            return isCatalogCompositeView(state.items, state.viewMode, 'Tile');
        },
    ],
    [LibPaths.SliceDebug]: [
        {
            prop: 'isDebugging',
            value: [true],
        },
    ],
    [LibPaths.TreeGrid]: [
        {
            prop: 'collectionType',
            value: ['TreeGrid'],
        },
    ],
    [LibPaths.Tree]: [
        {
            prop: 'collectionType',
            value: ['Tree'],
        },
    ],
    [LibPaths.Columns]: [
        {
            prop: 'collectionType',
            value: ['Columns'],
        },
    ],
    [LibPaths.Grid]: [
        {
            prop: 'collectionType',
            value: ['Grid'],
        },
    ],
    [LibPaths.AdaptiveTile]: [
        {
            prop: 'collectionType',
            value: ['AdaptiveTile'],
        },
    ],
    [LibPaths.Marker]: [(state) => !!state.collectionType],
    [LibPaths.MultiSelection]: [(state) => !!state.collectionType],
    [LibPaths.MarkerComponent]: [
        (state) => {
            return (
                state.markerVisibility === 'visible' ||
                (state.markerVisibility === 'onactivated' &&
                    state.markedKey !== undefined &&
                    state.markedKey !== null)
            );
        },
    ],
    [LibPaths.Checkbox]: [
        (state) => {
            return state.multiSelectVisibility !== 'hidden';
        },
    ],
};

type TShowcaseScheme = 'Tile' | 'Columns' | 'Navigation';

function isCatalogCompositeView(
    items: TState['items'],
    viewMode: TState['viewMode'],
    scheme?: TShowcaseScheme
) {
    const navigationScheme = getCatalogNavigationScheme(items, viewMode);
    return (
        viewMode === 'tile' &&
        (scheme ? navigationScheme === `showcase${scheme}` : navigationScheme !== 'tile')
    );
}

const getCatalogConfig = (items: TState['items']) => {
    const meta = items?.getMetaData();
    return meta?.results?.get('ConfigurationTemplate');
};

const getCatalogNavigationScheme = (items: TState['items'], viewMode: TState['viewMode']) => {
    const viewTemplate = getCatalogConfig(items);
    const viewModeTemplate = viewMode && viewTemplate?.[viewMode];
    return viewModeTemplate?.navigation?.scheme;
};

export enum LibPath {
    BaseList = 'Controls/baseList',
    List = 'Controls/list',
    Grid = 'Controls/grid',
    BaseTree = 'Controls/baseTree',
    Tree = 'Controls/tree',
    TreeGrid = 'Controls/treeGrid',

    NewGrid = 'Controls-Lists/grid',
    NewTreeGrid = 'Controls-Lists/treeGrid',
    NewTreeTile = 'Controls-Lists/treeTile',
    NewExplorer = 'Controls-Lists/explorer',

    ListVisualAspects = 'Controls/listVisualAspects',
    ListsCommonLogic = 'Controls/listsCommonLogic',

    ListWebReducers = 'Controls/listWebReducers',

    GridRender = 'Controls/gridRender',
    GridReact = 'Controls/gridReact',
    TreeRender = 'Controls/treeRender',
    TreeGridRender = 'Controls/treeGridRender',

    GridDisplay = 'Controls/gridDisplay',
    BaseTreeDisplay = 'Controls/baseTreeDisplay',
    TreeGridDisplay = 'Controls/treeGridDisplay',

    MarkerComponent = 'Controls/markerComponent',
    Input = 'Controls/input',
    ColumnScrollReact = 'Controls/columnScrollReact',
    MultiSelection = 'Controls/multiselection',
    GridColumnScroll = 'Controls/gridColumnScroll',
    Checkbox = 'Controls/checkbox',
    ExtButtons = 'Controls/extButtons',
    DragScroll = 'Controls/dragScroll',
    ResizeObserver = 'Controls/resizeObserver',
}

export const OMIT = (all: LibPath[], ...excluded: LibPath[]): LibPath[] => {
    return all.filter((i) => excluded.indexOf(i) === -1);
};

export const ANY_OLD_PUBLIC_COMPONENT_LIBS = [
    LibPath.BaseList,
    LibPath.List,
    LibPath.Grid,
    LibPath.BaseTree,
    LibPath.Tree,
    LibPath.TreeGrid,
];

export const ANY_NEW_PUBLIC_COMPONENT_LIBS = [
    LibPath.NewGrid,
    LibPath.NewTreeGrid,
    LibPath.NewTreeTile,
    LibPath.NewExplorer,
];

export const ANY_RENDER_LIBS = [
    LibPath.GridReact,
    LibPath.GridRender,
    LibPath.TreeRender,
    LibPath.TreeGridRender,
];
export const ANY_DISPLAY_LIBS = [
    LibPath.GridDisplay,
    LibPath.BaseTreeDisplay,
    LibPath.TreeGridDisplay,
];

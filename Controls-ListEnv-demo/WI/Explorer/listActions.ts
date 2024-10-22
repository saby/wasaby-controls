export default [
    {
        actionName: 'Controls/actions:ViewMode',
        listId: 'ViewModeExplorer',
        items: [
            {
                id: 'table',
                title: 'Таблица',
                icon: 'icon-Table',
                viewName: 'Controls/treeGrid',
            },
            {
                id: 'list',
                title: 'Список',
                icon: 'icon-ArrangeList',
                viewName: 'Controls/list',
            },
            {
                id: 'tile',
                title: 'Плитка',
                icon: 'icon-ArrangePreview',
                viewName: 'Controls/treeTile',
            },
        ],
    },
];

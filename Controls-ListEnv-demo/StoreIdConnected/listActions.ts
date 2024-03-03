export default [
    {
        actionName: 'Controls/actions:ViewMode',
        listId: 'nomenclature',
        items: [
            {
                id: 'table',
                title: 'Список',
                icon: 'icon-ArrangeList',
                viewName: 'Controls/treeGrid',
            },
            {
                id: 'tile',
                title: 'Плитка',
                icon: 'icon-ArrangePreview',
                viewName: 'Controls/treeTile',
            },
            {
                id: 'search',
                title: 'Поиск',
                icon: 'icon-ArrangePreview',
                viewName: 'Controls/treeGrid',
            },
        ],
    },
];

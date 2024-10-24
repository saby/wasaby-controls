export default [
    {
        actionName: 'Controls/actions:Move',
        popupOptions: {
            template: 'Controls/moverDialog:Template',
            templateOptions: {
                rootVisible: true,
                rootTitle: 'Каталог',
                root: null,
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
                displayProperty: 'title',
                hasChildrenProperty: 'hasChild',
                rootLabelVisible: false,
            },
        },
    },
];

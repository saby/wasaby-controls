export const HierarchyData = [
    { id: '1', title: 'Задачи', node: true, parent: null },
    { id: '2', title: 'Ошибки', node: true, parent: null },
    {
        id: '21',
        title: 'Ошибки в разработке',
        node: null,
        parent: '2',
    },
    {
        id: '22',
        title: 'Ошибки на тестировании',
        node: null,
        parent: '2',
    },
    {
        id: '11', title: 'Задачи в разработке',
        node: null,
        parent: '1',
    },
    {
        id: '12', title: 'Задачи на тестировании',
        node: null,
        parent: '1',
    },
];

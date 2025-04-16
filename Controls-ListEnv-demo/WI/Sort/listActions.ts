export default [
    {
        actionName: 'Controls/actions:Sort',
        id: 'sort',
        storeId: 'Sort',
        headingCaption: 'Сортировать',
        items: [
            {
                id: 'title',
                title: 'По Алфавиту (FONT)',
                paramName: 'title',
                icon: 'Controls-icons/sort:icon-Alphabet',
                value: 'ASC',
            },
            {
                id: 'rating',
                title: 'По рейтингу (FONT)',
                paramName: 'rating',
                icon: 'Controls-icons/sort:icon-Rating',
                value: 'ASC',
            },
        ],
    },
];

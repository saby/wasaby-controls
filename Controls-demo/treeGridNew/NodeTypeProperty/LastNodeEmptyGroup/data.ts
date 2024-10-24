export const getColumns = () => {
    return [
        {
            displayProperty: 'title',
            width: '',
        },
        {
            displayProperty: 'rating',
            width: '',
        },
        {
            displayProperty: 'country',
            width: '',
        },
    ];
};

export const generateData = (): {
    key: number;
    title: string;
    parent: number | null;
    type: boolean | null;
}[] => {
    const result = [];
    const parents = [
        {
            key: '1',
            title: 'Запись первого уровня с key = 1. Много дочерних элементов.',
            parent: null,
            type: true,
            nodeType: 'group',
            hasChildren: true,
        },
        {
            key: '2',
            title: 'Запись первого уровня с key = 2. Много дочерних элементов.',
            parent: null,
            type: true,
            nodeType: 'group',
            hasChildren: true,
        },
        {
            key: '3',
            title: 'Пустая папка',
            parent: null,
            type: true,
            nodeType: 'group',
            hasChildren: false,
        },
    ];
    const itemsCount = (100 - parents.length) / parents.length;

    parents.forEach((parent) => {
        result.push(parent);
        if (parent.key === '3') {
            return;
        }
        for (let i = 1; i < itemsCount; i++) {
            const key = `${parent.key}${i}`;
            result.push({
                key,
                title: `Запись второго уровня с key = ${key}`,
                parent: parent.key,
                type: null,
            });
        }
    });
    return result.sort((a, b) => {
        return a.key > b.key ? 1 : -1;
    });
};

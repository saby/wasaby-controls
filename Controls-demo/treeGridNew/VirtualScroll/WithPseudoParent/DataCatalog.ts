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
    const result = [
        {
            key: 0,
            title: 'Запись первого уровня с key = 1. Есть дочерние элементы',
            parent: null,
            type: true,
        },
        {
            key: 1,
            title: 'Запись второго уровня с key = 11 ',
            parent: 0,
            type: null,
        },
        {
            key: 2,
            title: 'Запись второго уровня с key = 12 ',
            parent: 0,
            type: null,
        },
        {
            key: 3,
            title: 'Запись второго уровня с key = 13 ',
            parent: 0,
            type: null,
        },
        {
            key: 4,
            title: 'Запись второго уровня с key = 14 ',
            parent: 0,
            type: null,
        },
    ];
    const parents = [
        {
            key: 5,
            title: 'Запись первого уровня с key = 2. Много дочерних элементов.',
            parent: null,
            type: true,
        },
    ];
    const itemsCount = 100;

    parents.forEach((parent) => {
        result.push(parent);
        for (let i = 1; i < itemsCount; i++) {
            //const key = `${parent.key}${i}`;
            result.push({
                key: i + 5,
                title: `Запись второго уровня с key = ${i}`,
                parent: parent.key,
                type: null,
            });
        }
    });

    //console.log(result.map((el) => el.title));
    return result.sort((a, b) => {
        return a.key > b.key ? 1 : -1;
    });
};

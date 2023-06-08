export const getData = (count: number, columnsCount: number) => {
    const result = [];

    for (let i = 0; i < count; i++) {
        const rootItemKey = `root_${i}`;
        const rootItem = _getItem(null, rootItemKey, columnsCount);
        result.push(rootItem);

        for (let j = 0; j < Math.ceil(count / 2); j++) {
            result.push(_getItem(rootItemKey, `child_${i}_${j}`, columnsCount));
        }
    }

    return result;
};

const _getItem = (
    rootKey: string | null,
    key: string,
    columnsCount: number
) => {
    const rootItem = {
        key,
        parent: rootKey,
        type: true,
        title: `Запись в дереве #${key}`,
    };
    for (let j = 0; j < columnsCount - 1; j++) {
        rootItem[`column_${j}`] = `Данные в к.${j}`;
    }
    return rootItem;
};

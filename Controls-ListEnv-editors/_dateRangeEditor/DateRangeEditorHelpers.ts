export const ARBITRARY_VALUE = 'arbitrary';

// TODO: https://online.sbis.ru/opendoc.html?guid=4948b8e8-14da-44d7-9953-345e6020d05b&client=3
// добавляются скрытые узлы для минимального периода, не понятно как по-другому его реализовать,
// чтобы окно реагировало на изменения этого поля
export const getHiddenNodes = (nodes: object[]) => {
    return nodes.map((node) => {
        return { ...node, '@parent': false };
    });
};

export const isMinRangeItem = (item: string): boolean => {
    return item?.includes('Arbitrary');
};

export const removeMinRangeItem = (items: string[]) => {
    return items?.filter((item) => !isMinRangeItem(item));
};

export const removeAllRangeItem = (items: string[]) => {
    const resultItems = items?.filter((item) => item !== 'all');
    if (!resultItems?.length) {
        resultItems.push('month');
    }
    return resultItems;
};

export const isArbitraryValueHidden = (dateValue: string, dateRangeValue: string[]) => {
    return (
        dateValue === ARBITRARY_VALUE &&
        removeMinRangeItem(dateRangeValue).length > 1
    );
};

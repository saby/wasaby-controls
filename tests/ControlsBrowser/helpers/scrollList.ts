import ListView from '../elements/list/View';

/**
 * Скроллит список из неповторяющихся элементов.
 * @param list Список, в котором находится элемент.
 * @param itemText Префикс перед индексом элемента. Пример: "Запись #187" - передаем "Запись #".
 * @param start С какого элемента начинаем скроллить.
 * @param stop До какого элемента скроллим.
 * @param step По сколько элементов подгружать.
 * @author Зайцев А.С.
 */
export async function scrollList(
    list: ListView,
    itemText: string,
    start: number,
    stop: number,
    step: number = 1
): Promise<void> {
    await range(start, stop, step, async (i) => {
        await list
            .item({
                textContaining: itemText + i,
            })
            .scrollIntoView();
        await list
            .item({
                textContaining: itemText + i,
            })
            .waitForDisplayed();
    });
}

/**
 * Скроллит список из неповторяющихся элементов.
 * @param start С какого элемента начинаем скроллить.
 * @param stop До какого элемента скроллим.
 * @param step По сколько элементов подгружать.
 * @param callback
 */
async function range(
    start: number,
    stop: number,
    step: number,
    callback: (index: number) => Promise<void>
): Promise<void> {
    const isPositiveStep = step > 0;
    for (let i = start; isPositiveStep ? i <= stop : i >= stop; i += step) {
        await callback(i);
    }
}

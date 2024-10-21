import { IPromiseSelectableOptions, TKey, ISelectionObject } from 'Controls/interface';

/**
 * Функция возвращает объект с отметкой в списке "selection" для выполнения массовых операций над записями.
 * Функция учитывает особенности массовых операций, такие как:
 * - если в списке не установлено отметки, то операция должна применяться к записи, на которой установлен маркер
 * - если применили команду "Отобрать отмеченные" и в списке нет отмеченных записей, то операция должна применяться ко всем отобранным записям
 * @param selectedKeys
 * @param excludedKeys
 * @param markedKey
 * @param selectionBeforeShowSelectedApply
 */
export function getListCommandsSelection(
    { selectedKeys = [], excludedKeys = [] }: IPromiseSelectableOptions,
    markedKey: TKey,
    selectionBeforeShowSelectedApply?: ISelectionObject
): ISelectionObject {
    let selection = {
        selected: selectedKeys,
        excluded: excludedKeys,
    };

    if (
        !selectedKeys.length &&
        !selectionBeforeShowSelectedApply &&
        markedKey !== null &&
        markedKey !== undefined
    ) {
        selection.selected = [markedKey];
    } else if (selectionBeforeShowSelectedApply && !selectedKeys.length && !excludedKeys.length) {
        selection = {
            selected: selectionBeforeShowSelectedApply.selected,
            excluded: selectionBeforeShowSelectedApply.excluded,
        };
    }

    return selection;
}

import { IPromiseSelectableOptions, TKey, ISelectionObject } from 'Controls/interface';

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

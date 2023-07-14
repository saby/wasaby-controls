import { TKeysSelection, TKey } from 'Controls/interface';

interface ISelectionHelperOptions {
    selectedKeys: TKeysSelection;
    excludedKeys: TKeysSelection;
    isAllSelected?: boolean;
    parentProperty?: string;
    nodeProperty?: string;
    selectionViewMode?: string;
    root?: TKey;
}

function allowShowSelected(
    { selectedKeys, isAllSelected }: ISelectionHelperOptions,
    sourceController
): boolean {
    // Не показываем кнопку "Показать отмеченные", когда:
    // Отмеченные записи надо загружать (их нет в items)
    // TODO доделать кэш записей при отметке + определение по excludedKeys
    const items = sourceController.getItems();
    return items ? selectedKeys.every((key) => !!items.getRecordById(key)) : false;
}
export function getSelectionViewMode(
    currentValue: string,
    options: ISelectionHelperOptions,
    sourceController
): string {
    if (options.selectionViewMode === 'partial') {
        return options.selectionViewMode;
    }
    const isShowSelectedModeOn = currentValue === 'selected';
    const hasSelected = options.selectedKeys?.length;

    if (hasSelected) {
        const allowShow = allowShowSelected(options, sourceController);

        if (!allowShow && !isShowSelectedModeOn) {
            return 'hidden';
        } else if (allowShow) {
            return isShowSelectedModeOn ? 'selected' : 'all';
        }
    } else if (isShowSelectedModeOn) {
        return 'selected';
    }
    return 'hidden';
}

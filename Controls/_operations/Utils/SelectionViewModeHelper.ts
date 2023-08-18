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

function allowShowSelected({ selectedKeys, excludedKeys, root }: ISelectionHelperOptions): boolean {
    const isMassSelect = selectedKeys?.includes(root) || excludedKeys?.includes(root);
    return !isMassSelect;
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
        const allowShow = allowShowSelected(options);

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

import {
    TKeysSelection,
    TKey,
    ISelectionViewModeOptions,
    TSelectionViewMode,
} from 'Controls/interface';
import { NewSourceController } from 'Controls/dataSource';

interface ISelectionHelperOptions extends ISelectionViewModeOptions {
    selectedKeys: TKeysSelection;
    excludedKeys: TKeysSelection;
    isAllSelected?: boolean;
    parentProperty?: string;
    nodeProperty?: string;
    root?: TKey;
    sourceController: NewSourceController;
}

function hasLoaded({ sourceController, root = null }: ISelectionHelperOptions): boolean {
    return (
        sourceController.hasLoaded(root) &&
        !sourceController.hasMoreData('down', root) &&
        !sourceController.hasMoreData('up', root)
    );
}

function isSelectedItemsLoaded({
    selectedKeys,
    sourceController,
}: ISelectionHelperOptions): boolean {
    const items = sourceController.getItems();
    if (items) {
        return !selectedKeys.find((key) => !items.getRecordById(key as string | number));
    } else {
        return false;
    }
}

function allowShowSelected(
    currentValue: TSelectionViewMode,
    options: ISelectionHelperOptions
): boolean {
    const { root = null, selectedKeys, excludedKeys } = options;
    const isMassSelect = selectedKeys?.includes(root) || excludedKeys?.includes(root);
    return currentValue ? !isMassSelect || hasLoaded(options) : isSelectedItemsLoaded(options);
}

export function getSelectionViewMode(
    currentValue: TSelectionViewMode,
    options: ISelectionHelperOptions
): TSelectionViewMode {
    if (options.selectionViewMode === 'partial') {
        return options.selectionViewMode;
    }
    const isShowSelectedModeOn = currentValue === 'selected';
    const hasSelected = options.selectedKeys?.length;

    if (hasSelected) {
        const allowShow = allowShowSelected(currentValue, options);

        if (!allowShow && !currentValue) {
            return currentValue;
        } else if (!allowShow && !isShowSelectedModeOn) {
            return 'hidden';
        } else if (allowShow) {
            return isShowSelectedModeOn ? 'selected' : 'all';
        } else if (isShowSelectedModeOn) {
            return 'selected';
        }
    } else if (isShowSelectedModeOn) {
        return 'selected';
    }
    return 'hidden';
}

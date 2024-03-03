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

function allowShowSelected({
    selectedKeys,
    excludedKeys,
    root = null,
    sourceController,
}: ISelectionHelperOptions): boolean {
    const isMassSelect = selectedKeys?.includes(root) || excludedKeys?.includes(root);
    const hasLoaded =
        sourceController.hasLoaded(root) &&
        !sourceController.hasMoreData('down', root) &&
        !sourceController.hasMoreData('up', root);
    return !isMassSelect || hasLoaded;
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
        const allowShow = allowShowSelected(options);

        if (!allowShow && !isShowSelectedModeOn) {
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

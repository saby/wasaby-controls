import { TKeysSelection, TKey, ISelectionViewModeOptions } from 'Controls/interface';
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
    root,
    sourceController,
}: ISelectionHelperOptions): boolean {
    const isMassSelect = selectedKeys?.includes(root) || excludedKeys?.includes(root);
    return !isMassSelect || sourceController.hasLoaded(root);
}
export function getSelectionViewMode(
    currentValue: string,
    options: ISelectionHelperOptions
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

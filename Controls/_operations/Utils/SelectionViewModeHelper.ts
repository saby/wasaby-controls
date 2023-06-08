import { TKeysSelection } from 'Controls/interface';

interface ISelectionHelperOptions {
    selectedKeys: TKeysSelection;
    excludedKeys: TKeysSelection;
    parentProperty?: string;
    nodeProperty?: string;
    selectionViewMode?: string;
}

function isSelectedItemsNeedToLoad(
    selectedKeys: TKeysSelection, excludedKeys: TKeysSelection, parentProperty: string,
    nodeProperty: string, sourceController): boolean {
    let isNotLoaded = sourceController.hasMoreData('down') || sourceController.hasMoreData('up');
    if (parentProperty) {
        const selectedNodes = [];
        const items = sourceController.getItems();
        for (let index = 0; index < selectedKeys?.length; index++) {
            const itemKey = selectedKeys[index];
            const item = items.getRecordById(itemKey);
            const isNodeValue = item && item.get(nodeProperty);
            const isExcluded = excludedKeys?.includes(itemKey);
            if (isNodeValue && !isExcluded) {
                selectedNodes.push(itemKey);
            }
        }
        if (selectedNodes.length) {
            isNotLoaded = selectedNodes.every((nodeKey) => {
                const isNodeLoaded = !sourceController || sourceController.hasLoaded(nodeKey);
                const hasMoreData = sourceController &&
                    (sourceController.hasMoreData('up', nodeKey) ||
                        sourceController.hasMoreData('down', nodeKey));
                return isNodeLoaded && !hasMoreData;
            });
        }
    }
    return isNotLoaded;
}
export function getSelectionViewMode(
    currentValue: string, options: ISelectionHelperOptions, sourceController
): string {
    const {selectedKeys, excludedKeys, parentProperty, nodeProperty} = options;
    if (options.selectionViewMode === 'partial') {
        return options.selectionViewMode;
    }
    const itemsIsNotLoaded =
        isSelectedItemsNeedToLoad(selectedKeys, excludedKeys, parentProperty, nodeProperty, sourceController);
    const isShowSelectedModeOn = currentValue === 'selected';
    if (selectedKeys?.length || isShowSelectedModeOn) {
        if (itemsIsNotLoaded && excludedKeys?.length) {
            return 'hidden';
        }
        return isShowSelectedModeOn ? 'selected' : 'all';
    }
    return 'hidden';
}

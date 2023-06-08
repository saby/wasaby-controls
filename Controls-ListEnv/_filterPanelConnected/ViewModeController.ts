import { IFilterItem } from 'Controls/filter';
import { isEqual } from 'Types/object';

export type ViewModeType = 'default' | 'cloud' | 'popupCloudPanelDefault' | undefined;

export interface IViewModeController {
    getViewMode(): ViewModeType;

    setViewMode(mode: ViewModeType): void;

    getFilterPanelSource(): IFilterItem[];

    updateFilterPanelSource(
        filterItems: IFilterItem[],
        filterNames: string[],
        viewMode: ViewModeType
    ): IFilterItem[];
}

/**
 * Контролер, обеспечивающий переключение режимов отображения редакторов
 * @private
 */
export default class ViewModeController implements IViewModeController {
    private _viewMode: ViewModeType = 'default';
    private _filterPanelSource: IFilterItem[] = null;

    constructor(
        filterPanelItems: IFilterItem[],
        viewMode: ViewModeType,
        filterNames: string[],
        searchParam: string,
        isAdaptive: boolean
    ) {
        this.setFilterPanelSource(filterPanelItems, viewMode, filterNames, searchParam, isAdaptive);
    }

    getViewMode(): ViewModeType {
        return this._viewMode;
    }

    setViewMode(mode: ViewModeType): void {
        this._viewMode = mode;
    }

    getFilterPanelSource(): IFilterItem[] {
        return this._filterPanelSource;
    }

    hasFilterPopupItems(filterItems: IFilterItem[], filterNames: string[]): boolean {
        return !!filterItems.find((item) => {
            return (
                (!filterNames.includes(item.name) && item.viewMode === 'basic') ||
                item.viewMode === 'extended'
            );
        });
    }

    setFilterPanelSource(
        filterItems: IFilterItem[],
        viewMode: ViewModeType,
        filterNames: string[],
        searchParam: string,
        isAdaptive?: boolean
    ): IFilterItem[] {
        let filterPanelSource;
        const isEditorsViewModeChangeable = this._isEditorsViewModeChangeable(viewMode);
        const changedFilterItems = this._getChangedFilterItems(filterItems, searchParam);
        const isFilterPopupItemsChanged = this._isFilterPopupItemsChanged(filterItems, filterNames);

        if (isEditorsViewModeChangeable && changedFilterItems.length && isFilterPopupItemsChanged) {
            this._viewMode = 'cloud';
        } else {
            this._viewMode = viewMode || 'default';
        }

        if (isAdaptive) {
            filterPanelSource = this._getAdaptiveItems(filterItems, filterNames);
        } else if (this._viewMode === 'default' || !isEditorsViewModeChangeable) {
            filterPanelSource = this._getFilterPanelSourceByNames(filterItems, filterNames);
        } else {
            filterPanelSource = this._getFilterPanelCloudItems(filterItems, searchParam);
        }
        if (!isEqual(filterPanelSource, this._filterPanelSource)) {
            this._filterPanelSource = filterPanelSource;
        }

        return this._filterPanelSource;
    }

    updateFilterPanelSource(
        filterItems: IFilterItem[],
        filterNames: string[],
        searchParam: string,
        editorsViewMode?: string,
    ): IFilterItem[] {
        const isEditorsViewModeChangeable = this._isEditorsViewModeChangeable(editorsViewMode);

        const currentFilterPanelSource = this._getFilterPanelSourceByNames(
            this._filterPanelSource,
            filterNames
        );
        const filterPanelSource = this._getFilterPanelSourceByNames(filterItems, filterNames);
        const changedFilterItems = this._getChangedFilterItems(filterItems, searchParam);
        const isFilterSourceChanged = this._isFilterSourceChanged(
            currentFilterPanelSource,
            changedFilterItems
        );
        const isFilterPanelSourceChanged = !isEqual(filterPanelSource, currentFilterPanelSource);
        const hasChangedFilterItems = !!changedFilterItems.length;
        const filterPanelSourceChangedInCloudViewMode =
            hasChangedFilterItems && this._viewMode === 'cloud';

        let newFilterPanelSource;
        if (!hasChangedFilterItems || (!isEditorsViewModeChangeable && isFilterSourceChanged)) {
            newFilterPanelSource = this._getFilterPanelSourceByNames(filterItems, filterNames);
        } else if (
            isEditorsViewModeChangeable &&
            (isFilterSourceChanged || filterPanelSourceChangedInCloudViewMode)
        ) {
            newFilterPanelSource = this._getFilterPanelCloudItems(filterItems, searchParam);
        } else {
            newFilterPanelSource = filterPanelSource;
        }

        if (isEditorsViewModeChangeable) {
            this._viewMode = this._getEditorsViewMode(currentFilterPanelSource, changedFilterItems);
        }
        this._filterPanelSource = newFilterPanelSource;
        return this._filterPanelSource;
    }

    protected _getEditorsViewMode(
        currentSource: IFilterItem[],
        changedFilterItems: IFilterItem[]
    ): ViewModeType {
        if (!changedFilterItems.length) {
            return 'default';
        } else if (this._isFilterSourceChanged(currentSource, changedFilterItems)) {
            return 'cloud';
        }
        return this._viewMode;
    }

    private _isEditorsViewModeChangeable(editorsViewModeOption: string): boolean {
        return editorsViewModeOption === undefined;
    }

    private _getChangedFilterItems(source: IFilterItem[], searchParam: string): IFilterItem[] {
        return this._getPanelPopupSource(source).filter(({ name, value, resetValue, visibility }) => {
            return value !== undefined && !isEqual(value, resetValue) &&
                visibility !== false &&
                name !== searchParam;
        });
    }

    private _getFilterPanelCloudItems(source: IFilterItem[], searchParam: string): IFilterItem[] {
        return source.filter(({ name, value, resetValue, visibility, editorTemplateName }) => {
            return !!editorTemplateName &&
                value !== undefined && !isEqual(value, resetValue) &&
                visibility !== false &&
                name !== searchParam;
        });
    }

    private _getFilterPanelSourceByNames(
        source: IFilterItem[],
        filterNames: string[] = []
    ): IFilterItem[] {
        return source.filter(({ name }) => {
            return filterNames.includes(name);
        });
    }

    private _getAdaptiveItems(
        filterPanelSource: IFilterItem[],
        filterNames: string[]
    ): IFilterItem[] {
        return filterPanelSource.filter((item) => {
            return item.isAdaptive;
        });
    }

    private _getPanelPopupSource(filterPanelSource: IFilterItem[]): IFilterItem[] {
        return filterPanelSource.filter((item) => {
            return item.viewMode !== 'frequent' && item.editorTemplateName;
        });
    }

    private _isFilterPopupItemsChanged(
        filterPanelSource: IFilterItem[],
        filterNames: string[]
    ): boolean {
        const isChangedPopupItem = filterPanelSource.find((item) => {
            if (!filterNames || !filterNames.includes(item.name)) {
                const isPopupItem = item.viewMode === 'basic' || item.viewMode === 'extended';
                const isChangedItem = !isEqual(item.value, item.resetValue);
                return isPopupItem && isChangedItem;
            }
        });
        return !!isChangedPopupItem;
    }

    private _isFilterSourceChanged(
        currentSource: IFilterItem[],
        newSource: IFilterItem[]
    ): boolean {
        if (!currentSource) {
            return true;
        }
        return newSource.some((item) => {
            const newSourceItem = currentSource.find((currentItem) => {
                return currentItem.name === item.name;
            });
            return (
                !isEqual(newSourceItem?.value, item.value) && !isEqual(item.resetValue, item.value)
            );
        });
    }
}

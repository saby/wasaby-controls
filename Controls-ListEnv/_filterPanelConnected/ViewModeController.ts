import { IFilterItem } from 'Controls/filter';
import { isEqual } from 'Types/object';

export type ViewModeType =
    | 'default'
    | 'cloud'
    | 'popupCloudPanelDefault'
    | 'cloud|default'
    | undefined;

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
    private _filterNames: string[];
    private _filterPanelSource: IFilterItem[] = null;

    constructor(
        filterPanelItems: IFilterItem[],
        viewMode: ViewModeType,
        filterNames: string[],
        searchParam: string,
        isAdaptive?: boolean
    ) {
        this.setFilterNames(filterNames);
        this.setFilterPanelSource(filterPanelItems, viewMode, filterNames, searchParam, isAdaptive);
    }

    getViewMode(): ViewModeType {
        return this._viewMode;
    }

    setViewMode(mode: ViewModeType): void {
        this._viewMode = mode;
    }

    getFilterNames(): string[] {
        return this._filterNames;
    }

    setFilterNames(filterNames: string[]): void {
        this._filterNames = filterNames;
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
        this._initEditorsViewMode(filterItems, viewMode, filterNames, searchParam);

        let filterPanelSource;
        const isEditorsViewModeChangeable = this._isEditorsViewModeChangeable(viewMode);

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
        editorsViewMode?: string
    ): IFilterItem[] {
        const isEditorsViewModeChangeable = this._isEditorsViewModeChangeable(editorsViewMode);

        const currentFilterPanelSource = this._getFilterPanelSourceByNames(
            this._filterPanelSource,
            filterNames
        );
        const changedFilterItems = this._getChangedFilterItems(filterItems, searchParam);

        const isFilterSourceChangedExternal = this._isFilterSourceChanged(
            currentFilterPanelSource,
            changedFilterItems
        );

        if (isEditorsViewModeChangeable) {
            this._viewMode = this._getEditorsViewMode(
                changedFilterItems,
                isFilterSourceChangedExternal
            );
        }

        let newFilterPanelSource;
        if (
            isEditorsViewModeChangeable &&
            !!changedFilterItems.length &&
            (isFilterSourceChangedExternal || this._viewMode === 'cloud')
        ) {
            newFilterPanelSource = this._getFilterPanelCloudItems(filterItems, searchParam);
        } else {
            newFilterPanelSource = this._getFilterPanelSourceByNames(filterItems, filterNames);
        }

        this._filterPanelSource = newFilterPanelSource;
        return this._filterPanelSource;
    }

    protected _getEditorsViewMode(
        changedFilterItems: IFilterItem[],
        isFilterSourceChangedExternal: boolean
    ): ViewModeType {
        if (!changedFilterItems.length) {
            return 'default';
        } else if (isFilterSourceChangedExternal) {
            return 'cloud';
        }
        return this._viewMode;
    }

    private _initEditorsViewMode(
        filterItems: IFilterItem[],
        viewMode: ViewModeType,
        filterNames: string[],
        searchParam: string
    ): void {
        const isEditorsViewModeChangeable = this._isEditorsViewModeChangeable(viewMode);
        if (isEditorsViewModeChangeable) {
            const changedFilterItems = this._getChangedFilterItems(filterItems, searchParam);
            const isFilterPopupItemsChanged = this._isFilterPopupItemsChanged(
                filterItems,
                filterNames
            );
            if (changedFilterItems.length && isFilterPopupItemsChanged) {
                this._viewMode = 'cloud';
            } else {
                this._viewMode = 'default';
            }
        } else {
            this._viewMode = viewMode || 'default';
        }
    }

    private _isEditorsViewModeChangeable(editorsViewModeOption: string): boolean {
        return editorsViewModeOption === 'cloud|default';
    }

    private _isFilterPanelCloudChangedItem(
        { name, value, resetValue, visibility, editorTemplateName, appliedFrom, type }: IFilterItem,
        searchParam: string
    ): boolean {
        return (
            !!editorTemplateName &&
            visibility !== false &&
            name !== searchParam &&
            (appliedFrom !== 'filterSearch' || type === 'list') &&
            value !== undefined &&
            !isEqual(value, resetValue)
        );
    }

    private _getChangedFilterItems(source: IFilterItem[], searchParam: string): IFilterItem[] {
        return source.filter((item) => {
            return (
                item.viewMode !== 'frequent' &&
                this._isFilterPanelCloudChangedItem(item, searchParam)
            );
        });
    }

    private _getFilterPanelCloudItems(source: IFilterItem[], searchParam: string): IFilterItem[] {
        return source.filter((item) => this._isFilterPanelCloudChangedItem(item, searchParam));
    }

    private _getFilterPanelSourceByNames(
        source: IFilterItem[],
        filterNames: string[] = []
    ): IFilterItem[] {
        return source.filter(({ name }) => {
            return filterNames.includes(name);
        });
    }

    private _getAdaptiveItems(filterPanelSource: IFilterItem[]): IFilterItem[] {
        return filterPanelSource.filter((item) => {
            return item.isAdaptive;
        });
    }

    /***
     * Изменились фильтры, которые есть только в воронке.
     * @param filterPanelSource
     * @param filterNames
     * @private
     */
    private _isFilterPopupItemsChanged(
        filterPanelSource: IFilterItem[],
        filterNames: string[]
    ): boolean {
        const isChangedPopupItem = filterPanelSource.find((item) => {
            if (filterNames && filterNames.includes(item.name)) {
                return false;
            } else {
                return item.viewMode !== 'frequent' && !isEqual(item.value, item.resetValue);
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
        return newSource.some((newItem) => {
            const currentSourceItem = currentSource.find((currentItem) => {
                return currentItem.name === newItem.name;
            });
            return (
                !isEqual(currentSourceItem?.value, newItem.value) &&
                !isEqual(newItem.resetValue, newItem.value)
            );
        });
    }
}

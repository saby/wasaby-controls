/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { IFilterItem, ControllerClass as FilterController } from 'Controls/filter';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { IContextOptionsValue } from 'Controls/context';
import { ListSlice } from 'Controls/dataFactory';
import { isEqual } from 'Types/object';
import { object } from 'Types/util';
import { Logger } from 'UI/Utils';
import { ViewModeType } from '../_filterPanel/ViewModeController';

export interface IWidgetControllerOptions {
    _dataOptionsValue: IContextOptionsValue;
    storeId?: string | string[];
    filterNames?: string[];
}

type TSlices = Record<string, ListSlice>;

function validateSlices(slices: TSlices | unknown, storeId: string | string[]) {
    if (!storeId) {
        throw new Error('Controls-ListEnv/filter не указана опция storeId у контрола фильтра');
    }

    if (!slices) {
        throw new Error(`Controls-ListEnv/filter не найден слайс по storeId: ${storeId}`);
    }

    Object.values(slices).forEach((filterSlice) => {
        if (storeId && filterSlice['[ICompatibleSlice]']) {
            Logger.warn(
                'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                    " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
            );
        }
    });
}

/**
 * Контролер виджетов
 * @private
 */
export default class WidgetController {
    private _filterDescription: IFilterItem[];
    private _fullFilterDescription: IFilterItem[];
    private _context: IContextOptionsValue;
    private _filterNames: string[] | void;
    private _storeId: string[] | string;

    constructor(options: IWidgetControllerOptions) {
        this._context = options._dataOptionsValue;
        this._filterNames = options.filterNames;
        this._storeId = options.storeId;
        const slices = this._getFilterSlices();

        validateSlices(slices, this._storeId);

        const fullFilterDescription = object.clonePlain(
            WidgetController.getFilterDescriptionFromSlices(slices)
        );

        if (fullFilterDescription) {
            this._fullFilterDescription = fullFilterDescription;
        } else {
            Logger.warn(
                'На странице используется контрол фильтра,' +
                    ' но в загрузчике не передана опция filterDescription'
            );
        }
    }

    update(options: IWidgetControllerOptions): boolean {
        let updateResult = false;

        if (this._context !== options._dataOptionsValue) {
            this._context = options._dataOptionsValue;
            updateResult = true;
        }

        if (!isEqual(this._filterNames, options.filterNames)) {
            this._filterNames = options.filterNames;
            updateResult = true;
        }

        if (!isEqual(this._storeId, options.storeId)) {
            this._storeId = options.storeId;
            updateResult = true;
        }

        const fullFilterDescription = this._getFullFilterDescription();

        if (!isEqual(fullFilterDescription, this._fullFilterDescription)) {
            this._fullFilterDescription = fullFilterDescription;
            updateResult = true;
        }

        if (updateResult) {
            this._clearCachedValuesFromContext();
        }

        return updateResult;
    }

    getFilterDescription(): IFilterItem[] {
        if (!this._filterDescription) {
            this._filterDescription = this._getFilterDescription();
        }
        return this._filterDescription;
    }

    applyFilterDescription(filterDescription: IFilterItem[]): void {
        this._filterDescription = null;
        if (this._isSlicesAvailable()) {
            this._applyFilterDescription(filterDescription);
        } else {
            this._applyFilterDescriptionCompatible(filterDescription);
        }
    }

    getSearchParam(): string {
        return Object.values(this._getFilterSlices())[0].searchParam;
    }

    getHistoryId(): string | void {
        return Object.values(this._getFilterSlices())[0].historyId;
    }

    getEditorsViewMode(): ViewModeType {
        return Object.values(this._getFilterSlices())[0].editorsViewMode;
    }

    // TODO удалить, как сделаю совместимость в Browser'e 5100
    getFilterController(): FilterController {
        return Object.values(this._getFilterSlices())[0]?.filterController;
    }

    // TODO удалить при переходе на контексты
    getFullFilterDescription(): IFilterItem[] {
        return this._getFullFilterDescription();
    }

    setFullFilterDescription(fullFilterDescription: IFilterItem[]): void {
        this._clearCachedValuesFromContext();
        this._fullFilterDescription = object.clonePlain(fullFilterDescription);
    }

    getSourceController(): SourceController {
        return Object.values(this._getFilterSlices())[0].sourceController;
    }

    private _applyFilterDescriptionCompatible(filterDescription: IFilterItem[]): void {
        const filterController = this.getFilterController();
        const sourceController = this.getSourceController();
        filterController.updateFilterItems(filterDescription);

        if (sourceController) {
            if (!sourceController.isExpandAll()) {
                sourceController.setExpandedItems([]);
            }
            if (!isEqual(sourceController.getFilter(), filterController.getFilter())) {
                sourceController.setFilter(filterController.getFilter());
                sourceController.reload().catch((error) => {
                    return error;
                });
            }
        }
    }

    private _applyFilterDescription(filterDescription: IFilterItem[]): void {
        Object.values(this._getFilterSlices()).forEach((filterSlice) => {
            filterSlice.applyFilterDescription(filterDescription);
        });
    }

    private _getFilterDescription(): IFilterItem[] {
        return this._filterDescriptionByFilterNames(this._getFullFilterDescription());
    }

    private _getFullFilterDescription(): IFilterItem[] {
        if (this._isSlicesAvailable()) {
            return WidgetController.getFilterDescriptionFromSlices(this._getFilterSlices());
        } else {
            return this.getFilterController().getFilterButtonItems();
        }
    }

    private _getFilterSlices(): TSlices {
        const storeId = !Array.isArray(this._storeId) ? [this._storeId] : this._storeId;
        return this._context.getStoreData<TSlices>(storeId);
    }

    private _filterDescriptionByFilterNames(filterDescription: IFilterItem[]): IFilterItem[] {
        if (this._filterNames) {
            return filterDescription.filter(({ name }) => {
                return (this._filterNames as string[]).includes(name);
            });
        } else {
            return filterDescription;
        }
    }

    private _clearCachedValuesFromContext(): void {
        this._filterDescription = null;
    }

    private _isSlicesAvailable(): boolean {
        return (
            this._storeId !== undefined &&
            // FIXME у Сухоручкина есть виджеты, которые работают через контекст, но контекст там нечестный с
            // замоканым контроллером
            !!Object.values(this._getFilterSlices()).find((filterSlice) => {
                return filterSlice.applyFilterDescription;
            })
        );
    }

    private static getFilterDescriptionFromSlices(slices: TSlices): IFilterItem[] {
        return Object.values(slices)[0].filterDescription;
    }
}

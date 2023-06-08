import {
    IFilterItem,
    ControllerClass as FilterController,
} from 'Controls/filter';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { IContextValue, IFilterSlice } from 'Controls/context';
import { isEqual } from 'Types/object';
import { object } from 'Types/util';
import { Logger } from 'UI/Utils';

export interface IWidgetControllerOptions {
    _dataOptionsValue: IContextValue;
    storeId?: string | string[];
    filterNames?: string[];
}

type TSlices = Record<string, IFilterSlice>;

/**
 * Контролер виджетов
 * @private
 */
export default class WidgetController {
    private _filterDescription: IFilterItem[];
    private _fullFilterDescription: IFilterItem[];
    private _context: IContextValue;
    private _filterNames: string[] | void;
    private _storeId: string[] | string;

    constructor(options: IWidgetControllerOptions) {
        this._context = options._dataOptionsValue;
        this._filterNames = options.filterNames;
        this._storeId = options.storeId;
        const fullFilterDescription = object.clonePlain(
            WidgetController.getFilterDescriptionFromSlices(
                this._getFilterSlices()
            )
        );

        if (fullFilterDescription) {
            this._fullFilterDescription = fullFilterDescription;
        } else {
            Logger.warn(
                'На странице используется контрол фильтра,' +
                    ' но в загрузчике не передана опция filterDescription'
            );
        }

        Object.values(this._getFilterSlices()).forEach((filterSlice) => {
            if (options.storeId && filterSlice['[ICompatibleSlice]']) {
                Logger.warn(
                    'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                        " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
                );
            }
        });
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

    getFilterSource(): IFilterItem[] {
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

    getHistoryId(): string | void {
        return Object.values(this._getFilterSlices())[0].historyId;
    }

    getEditorsViewMode(): string {
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

    private _applyFilterDescriptionCompatible(
        filterDescription: IFilterItem[]
    ): void {
        const filterController = this.getFilterController();
        const sourceController = this.getSourceController();
        filterController.updateFilterItems(filterDescription);

        if (sourceController) {
            if (!sourceController.isExpandAll()) {
                sourceController.setExpandedItems([]);
            }
            if (
                !isEqual(
                    sourceController.getFilter(),
                    filterController.getFilter()
                )
            ) {
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
        return this._filterDescriptionByFilterNames(
            this._getFullFilterDescription()
        );
    }

    private _getFullFilterDescription(): IFilterItem[] {
        if (this._isSlicesAvailable()) {
            return WidgetController.getFilterDescriptionFromSlices(
                this._getFilterSlices()
            );
        } else {
            return this.getFilterController().getFilterButtonItems();
        }
    }

    private _getFilterSlices(): TSlices {
        let storeId;

        if (this._storeId && !Array.isArray(this._storeId)) {
            storeId = [this._storeId];
        } else if (!this._storeId) {
            // Если не задан storeId ищем результат списочного загрузчика с filterButtonSource
            Object.entries(this._context).forEach(([key, value]) => {
                if (
                    !storeId &&
                    value?.['[IListSlice]'] &&
                    (value?.filterButtonSource || value?.filterDescription)
                ) {
                    storeId = [key];
                }
            });
        } else {
            storeId = this._storeId;
        }

        return this._context.getStoreData<TSlices>(storeId);
    }

    private _filterDescriptionByFilterNames(
        filterDescription: IFilterItem[]
    ): IFilterItem[] {
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

    private static getFilterDescriptionFromSlices(
        slices: TSlices
    ): IFilterItem[] {
        return Object.values(slices)[0].filterDescription;
    }
}

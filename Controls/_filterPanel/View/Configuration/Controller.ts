/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import {
    IFilterItem,
    IFilterItemConfiguration,
    FilterLoader,
    IFilterItemLocalPropsInternal,
} from 'Controls/filter';
import { IPropStorageOptions } from 'Controls/interface';
import { USER } from 'ParametersWebAPI/Scope';

interface IControllerOptions extends IPropStorageOptions, IFilterItemLocalPropsInternal {}

/**
 * Контролер, обеспечивающий конвертацию и запись конфигурации фильтров в хранилище.
 * @private
 */
export default class FilterConfigurationController {
    private _options: IControllerOptions;

    constructor(options: IControllerOptions) {
        this._options = options;
    }

    update(options: IControllerOptions): void {
        this._options = options;
    }

    getStorageKey(): string | void {
        return this._options.propStorageId;
    }

    saveSettings(source: IFilterItem[]): void {
        this._setConfiguration(this._getConfigurationFromSource(source));
    }

    private _getConfigurationFromSource(source: IFilterItem[]): IFilterItemConfiguration[] {
        const { filterItemLocalProperty } = this._options;
        return source.map((item) => {
            const newItem: IFilterItemConfiguration = {
                name: item.name,
                viewMode: item.viewMode,
            };

            if (filterItemLocalProperty && item[filterItemLocalProperty]?.viewMode) {
                newItem[filterItemLocalProperty] = {
                    viewMode: item[filterItemLocalProperty]?.viewMode,
                };
            }

            return newItem;
        });
    }

    private _setConfiguration(configuration: IFilterItemConfiguration[]): void {
        const storageKey = this.getStorageKey();

        if (storageKey) {
            USER.set(
                storageKey + FilterLoader.FILTER_USER_PARAM_POSTFIX,
                JSON.stringify(configuration)
            );
        }
    }
}

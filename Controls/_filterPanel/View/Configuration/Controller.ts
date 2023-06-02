/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { IFilterItem, IFilterItemConfiguration } from 'Controls/filter';
import { IPropStorageOptions } from 'Controls/interface';
import { saveConfig } from 'Controls/Application/SettingsController';
import { TEditorsViewMode } from 'Controls/_filterPanel/View/ViewModel';

const STORAGE_PROP = 'filterUserConfiguration';
interface IControllerOptions extends IPropStorageOptions {
    viewMode?: 'popup' | 'default';
    editorsViewMode: TEditorsViewMode;
}

/**
 * Контролер, обеспечивающий конвертацию и запись конфигурации фильтров в хранилище.
 * @private
 */
export default class FilterConfigurationController {
    private _propStorageId: string;
    private _viewModeSupported: boolean;

    constructor(options: IControllerOptions) {
        this.update(options);
    }

    update(options: IControllerOptions): void {
        this._propStorageId = options.propStorageId;
        if (
            options.viewMode !== 'popup' &&
            options.editorsViewMode !== 'popupCloudPanelDefault'
        ) {
            this._viewModeSupported = true;
        }
    }

    getStorageKey(): string {
        return this._propStorageId;
    }

    isStorageEnabled(): boolean {
        return !!this._propStorageId;
    }

    isAvailable(): boolean {
        return !!this._propStorageId && this._viewModeSupported;
    }

    saveSettings(source: IFilterItem[]): void {
        const config = this._getConfigurationFromSource(source);
        this._setConfiguration(config);
    }

    private _getConfigurationFromSource(
        source: IFilterItem[]
    ): IFilterItemConfiguration[] {
        return source.map((item) => {
            return {
                name: item.name,
                viewMode: item.viewMode,
            } as IFilterItemConfiguration;
        });
    }

    private _setConfiguration(configuration: IFilterItemConfiguration[]): void {
        if (this.isStorageEnabled()) {
            saveConfig(this.getStorageKey(), [STORAGE_PROP], {
                [STORAGE_PROP]: configuration,
            });
        }
    }
}

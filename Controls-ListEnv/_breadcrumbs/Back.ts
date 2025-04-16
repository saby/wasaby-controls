import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_breadcrumbs/Back/Back';
import { IBackOptions } from 'Controls-ListEnv/_breadcrumbs/interface/IBackOptions';
import { descriptor, DescriptorValidator } from 'Types/entity';
import { IBrowserSlice } from 'Controls/dataFactory';
import { Logger } from 'UI/Utils';

export default class Back extends Control<IBackOptions> {
    protected _template: TemplateFunction = template;
    protected _slice: IBrowserSlice;

    protected _beforeMount(options: IBackOptions): void {
        this._slice = options._dataOptionsValue[options.storeId];
        if (options.storeId && this._slice['[ICompatibleSlice]']) {
            Logger.warn(
                'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                    " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
            );
        }
    }

    protected _beforeUpdate(options: IBackOptions): void {
        this._slice = options._dataOptionsValue[options.storeId];
    }

    protected _onBackButtonClick(e: Event): void {
        let result;
        const breadCrumbsItems = this._slice.breadCrumbsItems;
        const rootKey =
            breadCrumbsItems.length > 1
                ? breadCrumbsItems[breadCrumbsItems.length - 2].getKey()
                : breadCrumbsItems[0].get(this._slice.parentProperty);
        if (this._options.clickCallback) {
            result = this._options.clickCallback(e, rootKey);
        }
        if (result !== false) {
            this._slice.changeRoot(rootKey);
        }
    }

    static getOptionTypes(): Partial<Record<keyof IBackOptions, DescriptorValidator>> {
        return {
            storeId: descriptor(String).required(),
            _dataOptionsValue: descriptor(Object).required(),
        };
    }
}

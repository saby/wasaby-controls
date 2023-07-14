import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_breadcrumbs/HeadingPath/View';
import { IBreadcrumbsViewOptions } from 'Controls-ListEnv/_breadcrumbs/interface/IBreadcrumbsViewOptions';
import { descriptor, DescriptorValidator } from 'Types/entity';
import { ListSlice } from 'Controls/dataFactory';
import { SyntheticEvent } from 'UI/Events';
import { Model } from 'Types/entity';
import { Logger } from 'UI/Utils';

/**
 * Хлебные крошки с кнопкой "Назад".
 * @class Controls-ListEnv/breadcrumbs:HeadingPath
 * @public
 */

export default class BreadCrumbsWrappedView extends Control<IBreadcrumbsViewOptions> {
    protected _template: TemplateFunction = template;
    protected _slice: ListSlice;

    protected _beforeMount(options: IBreadcrumbsViewOptions): void {
        this._slice = options._dataOptionsValue[options.storeId];
        if (options.storeId && this._slice['[ICompatibleSlice]']) {
            Logger.warn(
                'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                    " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
            );
        }
    }

    protected _beforeUpdate(options: IBreadcrumbsViewOptions): void {
        this._slice = options._dataOptionsValue[options.storeId];
    }

    protected _itemClick(e: SyntheticEvent, item: Model): void {
        let result;
        if (this._options.itemClickCallback) {
            result = this._options.itemClickCallback(e, item.getKey(), item);
        }
        if (result !== false) {
            this._slice.setRoot(item.getKey());
        }
    }

    protected _arrowClick(): void {
        this._options.arrowClickCallback?.();
    }

    static getOptionTypes(): Partial<Record<keyof IBreadcrumbsViewOptions, DescriptorValidator>> {
        return {
            storeId: descriptor(String).required(),
            _dataOptionsValue: descriptor(Object).required(),
        };
    }
}

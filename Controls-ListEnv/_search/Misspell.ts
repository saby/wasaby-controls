import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import * as template from 'wml!Controls-ListEnv/_search/Misspell';
import { IBrowserSlice } from 'Controls/context';
import { Logger } from 'UI/Utils';

interface IMisspellOptions extends IControlOptions {
    _dataOptionsValue: Record<string, IBrowserSlice>;
    storeId: string;
}

/**
 * Внутренний компонент виджета, отображающего подсказку при неверном вводе во время поиска.
 * @private
 */

export default class Misspell extends Control<IMisspellOptions> {
    protected _template: TemplateFunction = template;
    protected _caption: string = '';

    protected _beforeMount(options: IMisspellOptions): void {
        this._caption = this._getMisspellOptionValue(options);

        const slice = options._dataOptionsValue[options.storeId];
        if (options.storeId && slice['[ICompatibleSlice]']) {
            Logger.warn(
                'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                    " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
            );
        }
    }

    protected _beforeUpdate(newOptions: IMisspellOptions): void {
        const newCaptionValue = this._getMisspellOptionValue(newOptions);
        if (newCaptionValue !== this._caption) {
            this._caption = newCaptionValue;
        }
    }

    protected _onMisspellClicked(event: SyntheticEvent): void {
        const storeId = this._options.storeId;
        const slice = this._options._dataOptionsValue[storeId];
        slice.setState({
            searchValue: this._caption,
            searchInputValue: this._caption,
        });
    }

    private _getMisspellOptionValue(options: IMisspellOptions): string {
        const slice = options._dataOptionsValue[options.storeId];
        return (
            slice.searchMisspellValue ||
            options._dataOptionsValue.searchMisspellValue
        );
    }
}

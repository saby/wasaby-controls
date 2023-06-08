import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import * as template from 'wml!Controls-ListEnv/_search/Misspell';
import { connectToDataContext } from 'Controls/context';
import { ListSlice } from 'Controls/dataFactory';
import { Logger } from 'UI/Utils';

interface IMisspellOptions extends IControlOptions {
    _dataOptionsValue: Record<string, ListSlice>;
    storeId: string;
}


/**
 * Виджет, отображающий подсказку при неверном вводе во время поиска.
 * В основе виджета лежит интерфейсный контрол {@link Controls/search:Misspell}.
 *
 * @class Controls-ListEnv/search:Misspell
 * @extends Controls/search:Misspell
 * @mixes Controls/interface:IStoreId
 *
 * @public
 *
 * @demo Controls-ListEnv-demo/Search/Misspell/Index
 */

class Misspell extends Control<IMisspellOptions> {
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
        return slice.searchMisspellValue || options._dataOptionsValue.searchMisspellValue;
    }
}

export default connectToDataContext(Misspell);

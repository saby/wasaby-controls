import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_search/MisspellWrapper';
import { ISearchInputOptions } from 'Controls-ListEnv/_search/Input/interfaces';

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
 * @demo Engine-demo/Controls-widgets/Search/Misspell/Index
 */

export default class MisspellWrapper extends Control<ISearchInputOptions> {
    protected _template: TemplateFunction = template;
}

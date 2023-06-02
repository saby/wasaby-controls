import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_search/InputWrapper';
import { ISearchInputOptions } from 'Controls-ListEnv/_search/Input/interfaces';
import { default as SearchInput } from 'Controls-ListEnv/_search/Input';

/**
 * Виджет строки поиска.
 *
 * @class Controls-ListEnv/search:Input
 * @implements Controls/interface:IContrastBackground
 * @implements Controls/input:IFieldTemplate
 * @implements Controls/input:IPadding
 * @implements Controls/input:IText
 * @implements Controls/input:IValue
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IFontWeight
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:IInputPlaceholder
 * @mixes Controls/interface:IStoreId
 * @demo Engine-demo/Controls-widgets/Search/Input/Base/Index
 *
 * @public
 */
export default class InputWrapper extends Control<ISearchInputOptions> {
    protected _template: TemplateFunction = template;
    protected _children: {
        input: SearchInput;
    };

    reset(collapse?: boolean): void {
        this._children.input.reset(collapse);
    }

    static defaultProps: Partial<ISearchInputOptions> = {
        storeId: 0,
    };
}

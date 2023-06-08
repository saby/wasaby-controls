import { Control, TemplateFunction } from 'UI/Base';
import { ISearchInputOptions } from 'Controls-ListEnv/_search/Input/interfaces';
import * as template from 'wml!Controls-ListEnv/_search/Input';
import { Input as SearchInput } from 'Controls/search';
import { connectToDataContext } from 'Controls/context';


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
 * @demo Controls-ListEnv-demo/Search/Input/Base/Index
 *
 * @public
 */
class Input extends Control<ISearchInputOptions> {
    protected _template: TemplateFunction = template;
    protected _children: {
        input: SearchInput;
    };

    reset(): void {
        this._children.input.reset();
    }

    static defaultProps: Partial<ISearchInputOptions> = {
        storeId: 0,
    };
}

export default connectToDataContext(Input);

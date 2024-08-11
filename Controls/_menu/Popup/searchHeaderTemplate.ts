/**
 * @kaizen_zone f90b65ee-d3e2-41d5-9722-a2ea4200bc7e
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import template = require('wml!Controls/_menu/Popup/searchHeaderTemplate');
import 'css!Controls/menu';

/**
 * Шапка меню со строкой поиска.
 * @extends UICore/Base:Control
 * @public
 * @demo Controls-demo/dropdown_new/Search/SearchWidth/Index
 *
 */
class SearchHeaderTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _hasValue: boolean;
    protected _inputSearchValue: string = '';
    protected _backButtonCaption: string = '';
    protected _expanded: boolean = false;

    protected _beforeMount(options: IControlOptions): void {
        this._backButtonCaption = this._getBreadcrumbsCaption(options);
    }

    protected _beforeUpdate(newOptions: IControlOptions) {
        const inputSearchValueChanged =
            this._options.inputSearchValue !== newOptions.inputSearchValue;
        if (inputSearchValueChanged && this._inputSearchValue !== newOptions.inputSearchValue) {
            this._inputSearchValue = newOptions.inputSearchValue;
        }
        if (this._options.breadCrumbsItems !== newOptions.breadCrumbsItems) {
            this._backButtonCaption = this._getBreadcrumbsCaption(newOptions);
            this._expanded = false;
        }
    }

    protected _afterMount(): void {
        this._children.menuSearch?.activate();
    }

    protected _valueChanged(event: SyntheticEvent, value: string): void {
        this._hasValue = !!value;
    }

    private _search() {
        this._notify('search', [this._inputSearchValue], { bubbling: true });
    }

    private _searchReset() {
        this._notify('searchReset', [''], { bubbling: true });
    }

    private _breadcrumbsClick() {
        this._notify('breadcrumbsClick', [], { bubbling: true });
    }

    private _getBreadcrumbsCaption(options: IControlOptions): string {
        return (
            options.breadCrumbsItems?.[options.breadCrumbsItems?.length - 1].get(
                options.displayProperty
            ) || ''
        );
    }
}

/**
 * @name Controls/menu:SearchHeaderTemplate#icon
 * @cfg {String} Иконка, которая будет отображаться слева от строки поиска.
 */

/**
 * @name Controls/menu:SearchHeaderTemplate#searchWidth
 * @cfg {String} Ширина строки поиска. Варианты значений:
 * s - маленькая строка поиска;
 * l - большая строка поиска.
 * @default s
 * @demo Controls-demo/dropdown_new/Search/SearchWidth/Index
 */

export default SearchHeaderTemplate;

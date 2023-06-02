import { Control, TemplateFunction } from 'UI/Base';
import { ISearchInputOptions } from 'Controls-ListEnv/_search/Input/interfaces';
import * as template from 'wml!Controls-ListEnv/_search/Input';

/**
 * Внутренний компонент виджета строки поиска, который делает всю работу связанную с запуском процедуры поиска.
 * @private
 */
export default class Input extends Control<ISearchInputOptions> {
    protected _template: TemplateFunction = template;
}

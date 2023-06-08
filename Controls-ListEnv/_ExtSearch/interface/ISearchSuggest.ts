/**
 * @kaizen_zone 772ff1d9-b53b-4f9c-86eb-a788c4cdfc36
 */
import { ILookupInputOptions } from 'Controls/lookup';
import { IFilterItem } from 'Controls/filter';

/**
 * Интерфейс расширенного поиска
 * @interface Controls-ListEnv/_ExtSearch/interface/ISearchSuggest
 * @public
 */
export interface ISearchSuggestOptions extends ILookupInputOptions {
    filterDescription: IFilterItem[];
    suggestWidth?: string;
}

/**
 * @name Controls-ListEnv/_ExtSearch/interface/ISearchSuggest#filterDescription
 * @cfg {Array<Controls/filter:IFilterItem>} Массив объектов фильтров, по которым будут рассчитаны данные для построения
 * настроек и автодополнения расширенного поиска
 * @remark
 * В автодополнение уйдут элементы, у которых задано свойство type равное 'list', в настройки - все остальные.
 * Для множественного выбора настроек рекомендуется использовать редактор 'Controls-ListEnv/filterPanelExtEditors:CheckboxGroupEditor',
 * для единичного - 'Controls-ListEnv/filterPanelExtEditors:RadioGroupEditor'.
 * @demo Engine-demo/ExtSearch/Suggest/Index
 */

/**
 * @name Controls-ListEnv/_ExtSearch/interface/ISearchSuggest#suggestWidth
 * @cfg {String} Ширина автодополнения в px
 */

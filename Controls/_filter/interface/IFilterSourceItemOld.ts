/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import type {
    IFilterItemBase,
    default as IFilterDescriptionItem,
} from 'Controls/_filter/interface/IFilterDescriptionItem';
import { ICrud, ICrudPlus, QueryWhereExpression } from 'Types/source';
import { Source as HistorySource } from 'Controls/history';
import { IPopupOptions } from 'Controls/_popup/interface/IPopup';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { RecordSet } from 'Types/collection';
import { INavigationOptionValue, INavigationSourceConfig } from 'Controls/interface';

type TNavigation = INavigationOptionValue<INavigationSourceConfig>;
type TKey = boolean | string | number;

/**
 * Интерфейс опций для конфигурации быстрого фильтра.
 * @remark
 * См. {@link Controls/filter:IFilterItem#editorOptions}
 * @interface Controls/filter:IEditorOptions
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IFilter
 * @implements Controls/interface:INavigation
 * @public
 */
export interface IEditorOptions {
    source?: ICrudPlus | (ICrud & ICrudPlus) | HistorySource;
    keyProperty?: string;
    /**
     * Имя свойства элемента, содержимое которого будет отображаться. Влияет только на значение при выборе.
     * @see nodeProperty
     * @see parentProperty
     */
    displayProperty?: string;
    parentProperty?: string;
    /**
     * Имя свойства, содержащего информацию о типе элемента (лист, узел, скрытый узел).
     * Если тип элемента указан как скрытый узел, дочерние элементы будут отображаться в виде подпунктов.
     * Текст при выборе таких пунктов склеивается из родительского значения и дочернего значения.
     * @demo Controls-ListEnv-demo/Filter/NotConnectedView/Source/ViewMode/Frequent/Hierarchy/Index
     * @see parentProperty
     */
    nodeProperty?: string;
    /**
     * Минимальное количество элементов для отображения фильтра. По умолчанию фильтр с одним элементом будет скрыт.
     */
    minVisibleItems?: number;
    /**
     * Определяет, установлен ли множественный выбор.
     */
    multiSelect?: boolean;
    /**
     * Шаблон панели выбора элементов.
     */
    selectorTemplate?: {
        templateName: string;
        templateOptions?: Record<string, any>;
        popupOptions?: IPopupOptions;
    };
    /**
     * Шаблон отображения элементов.
     * @remark
     * Подробнее о настройке itemTemplate читайте {@link Controls/menu:IMenuBase#itemTemplate здесь}.
     * Для задания элемента в качестве заголовка используйте шаблон {@link Controls/filterPopup:SimplePanelEmptyItemTemplate}.
     * @see itemTemplateProperty
     */
    itemTemplate?: string;
    /**
     * Режим отображения редактора выбора периода, который отображается в быстрых фильтрах.
     * @variant Lite В качестве редактора используется {@link Controls/dateRange:Selector} с опцией datePopupType="shortDatePicker".
     * @variant Selector В качестве редактора используется {@link Controls/dateRange:Selector}.
     */
    editorMode?: string;
    filter?: QueryWhereExpression<unknown>;
    navigation?: TNavigation;
    /**
     * Имя свойства, содержащего шаблон для рендеринга элементов.
     * @remark
     * Подробнее о настройке itemTemplateProperty читайте {@link Controls/menu:IMenuBase#itemTemplateProperty здесь}.
     * Для задания элемента в качестве заголовка используйте шаблон {@link Controls/filterPopup:SimplePanelEmptyItemTemplate}.
     * @see itemTemplate
     */
    itemTemplateProperty?: string;
    sourceController?: SourceController;
    dataLoadCallback?: (items: RecordSet, direction: 'up' | 'down') => void;
    /**
     * Шаблон отображения элемента в списке автодополнения строки поиска {@link ExtSearch/input:Suggest}
     */
    suggestItemTemplate?: string;
    [key: string]: unknown;
    /**
     * Заголовок в быстром фильтре.
     * @demo Controls-ListEnv-demo/Filter/View/ViewMode/Frequent/HeadingCaption/Index
     */
    headingCaption?: string;
    /**
     * Имя свойства, содержащего текст подсказки, которая отображается при наведении на элемент фильтра.
     */
    tooltip?: string;
    /**
     * Массив функций валидации значений фильтра.
     */
    validators?: Function[];
}

/**
 * Интерфейс для поддержки просмотра и редактирования полей фильтра.
 * @public
 * @deprecated Используйте {@link Controls/filter:IFilterDescriptionItem}
 */
export default interface IFilterSourceItem extends IFilterItemBase, IFilterDescriptionItem {
    /**
     * Определяет, нужно ли отображать {@link textValue текстовое представление фильтра}
     * @remark Независимо от значения опции, текстовое представление фильтра используется для отображения истории фильтров (см. опцию {@link Controls-ListEnv/filterConnected:View#historyId}).
     * @default true
     */
    textValueVisible?: boolean;
    /**
     * Текст пункта меню быстрого фильтра, при выборе которого фильтр будет сброшен.
     * Пункт будет добавлен в начало списка с заданным текстом.
     * @remark Опция актуальна только при {@link viewMode} установленном в значение "frequent"
     * @see emptyKey
     * @see viewMode
     */
    emptyText?: string;
    /**
     * Первичный ключ для пункта меню быстрого фильтра, который создаётся при установке опции {@link emptyText}.
     * @remark Опция актуальна только при {@link viewMode} установленном в значение "frequent"
     * @see emptyText
     * @see viewMode
     */
    emptyKey?: TKey;
    /**
     * Опции для быстрого фильтра.
     * @example
     * <pre class="brush: js; highlight: [6-23]">
     *    import {Memory} from 'Types/source'
     *    this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        viewMode: 'frequent'
     *        editorOptions: {
     *           source: new Memory({
     *              data: [
     *                  {
     *                      id: 'Yaroslavl',
     *                      title: 'Ярославль'
     *                  },
     *                  {
     *                      id: 'Moscow',
     *                      title: 'Москва'
     *                  },
     *                  {
     *                      id: 'Rostow',
     *                      title: 'Ростов'
     *                  }
     *              ],
     *              keyProperty: 'id'
     *           }),
     *           displayProperty: 'title',
     *           keyProperty: 'id'
     *        }
     *        ...
     *   }]
     * </pre>
     */
    editorOptions?: IEditorOptions;
}

/*
 * @typedef {Object} Controls/filter:EditorOptions
 * @property {String} keyProperty Name of the item property that uniquely identifies collection item.
 * @property {String} displayProperty Name of the item property that content will be displayed. Only affects the value when selecting.
 * @property {Types/source:Base} source Object that implements ICrud interface for data access. If 'items' is specified, 'source' will be ignored.
 * @property {Boolean} multiSelect Determines whether multiple selection is set.
 * @property {Controls/interface:ISelectorDialog} selectorTemplate Items selection panel template.
 * @property {Function} itemTemplate Template for item render. For more information, see {@link Controls/_menu/interface/IMenuBase#itemTemplate}
 * @property {String} itemTemplateProperty Name of the item property that contains template for item render. For more information, see {@link Controls/_menu/interface/IMenuBase#itemTemplateProperty}
 * @property {Object} filter Filter configuration - object with field names and their values. {@link Controls/_interface/IFilter}
 * @property {Object} navigation List navigation configuration. Configures data source navigation (pages, offset, position) and navigation view (pages, infinite scroll, etc.) {@link Controls/_interface/INavigation}
 * @property {Types/collection:IList} items Special structure for the visual representation of the filter. {@link Types/collection:IList}.
 */

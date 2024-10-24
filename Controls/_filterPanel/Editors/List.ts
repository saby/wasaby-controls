/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, TemplateFunction } from 'UI/Base';
import { isEqual } from 'Types/object';
import { constants } from 'Env/Env';
import { IListEditorOptions } from 'Controls/_filterPanel/Editors/_List';
import * as ListTemplate from 'wml!Controls/_filterPanel/Editors/List';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { Logger } from 'UI/Utils';
import 'css!Controls/filterPanel';

/**
 * Контрол используют в качестве редактора для выбора значений из списка на {@link Controls/filterPanel:View панели фильтров}.
 * @remark
 * В основе редактора лежит интерфейсный контрол {@link Control/grid:View} или {@link Controls/treeGrid:View} (в зависимости от опции {@link parentProperty}.
 * Перезагрузить данные для редактора можно с помощью метода {@link Controls/dataFactory:ListSlice#reloadFilterItem} списочного слайса
 *
 * Полезные ссылки:
 * - {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-panel/ руководство разработчика по настройке Controls-ListEnv/filterPanelConnected:View}
 * - {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-view/base/ руководство разработчика по настройке Controls-ListEnv/filterConnected:View}
 *
 * @class Controls/_filterPanel/Editors/List
 * @extends Core/Control
 * @implements Controls/grid:IGridControl
 * @implements Controls/interface:INavigation
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/interface:IItemTemplateListProps
 * @implements Controls/tree:ITree
 * @ignoreOptions sourceController
 * @demo Controls-ListEnv-demo/FilterPanel/View/Base/Index
 * @public
 */

class ListEditor extends Control<IListEditorOptions> {
    protected _template: TemplateFunction = ListTemplate;

    protected _beforeMount(options: IListEditorOptions): void {
        const { sourceController, editorsViewMode, viewMode, resetValue, propertyValue } = options;
        this._validateOptions(options);
        if (
            (editorsViewMode === 'default' ||
                (editorsViewMode === 'popupCloudPanelDefault' && viewMode === 'basic')) &&
            isEqual(propertyValue, resetValue) &&
            !sourceController?.getItems()
        ) {
            if (constants.isServerSide) {
                Logger.error(
                    'Controls/filterPanel:ListEditor: вызвана перезагрузка данных на сервере, у sourceController отстутствуют items',
                    this
                );
            } else {
                sourceController?.reload();
            }
        }
    }

    protected _beforeUpdate(newOptions: IListEditorOptions): void {
        const sourceController = newOptions.sourceController;
        if (
            newOptions.editorsViewMode !== this._options.editorsViewMode &&
            isEqual(newOptions.propertyValue, newOptions.resetValue) &&
            !sourceController.isLoading()
        ) {
            sourceController?.reload();
        }
    }

    protected _extendedCaptionClickHandler(): void {
        const needToResetValue =
            this._options.editorsViewMode !== 'default' || !this._options.expanderVisible;
        const notifyPropertyValueChanged = () => {
            const extendedValue = {
                value: needToResetValue ? this._options.resetValue : this._options.propertyValue,
                textValue: needToResetValue ? '' : this._options.textValue,
                viewMode: 'basic',
            };
            this._notify('propertyValueChanged', [extendedValue], {
                bubbling: true,
            });
        };

        if (
            this._options.editorsViewMode === 'popupCloudPanelDefault' &&
            this._options.sourceController
        ) {
            const promises = [];
            promises.push(this._options.sourceController.reload());
            if (this._options.imageTemplateName) {
                promises.push(loadAsync(this._options.imageTemplateName));
            }
            Promise.all(promises).then(() => {
                notifyPropertyValueChanged();
            });
        } else {
            notifyPropertyValueChanged();
        }
    }

    private _validateOptions(options: IListEditorOptions): void {
        if (!options.multiSelect && options.resetValue instanceof Array) {
            Logger.error(
                `Controls/filterPanel:ListEditor для фильтра с единичным выбором
             в resetValue задан массив`,
                this
            );
        }
    }
}

export default ListEditor;

/**
 * @name Controls/_filterPanel/Editors/List#additionalTextProperty
 * @cfg {String} Имя свойства, содержащего информацию об идентификаторе дополнительного столбца в списке.
 * @demo Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/AdditionalTextProperty/Index
 * @remark Для задания цвета текста дополнительного столбца добавьте в записи поле additionalTextStyleProperty
 * @see Controls/interface:IFontColorStyle#fontColorStyle
 */

/**
 * @name Controls/_filterPanel/Editors/List#mainCounterProperty
 * @cfg {String} Имя свойства, содержащее значение счётчика для элемента списка.
 * @remark Данная опция не работает без указания этой: {@link /docs/js/Controls/filterPanel/ListEditor/options/additionalTextProperty/ additionalTextProperty}.
 */

/**
 * @name Controls/_filterPanel/Editors/List#mainCounterStyleProperty
 * @cfg {String} Поле записи, содержащее цвет счётчика для элемента списка.
 * @see Controls/interface:IFontColorStyle#fontColorStyle
 */

/**
 * @name Controls/_filterPanel/Editors/List#emptyTextAdditionalCounterProperty
 * @cfg {String} Имя свойства, содержащего значение счётчика для пункта в начале списка
 * @remark Для отображения пункта в начале списка необходимо использовать опции
 * {@link /docs/js/Controls/filterPanel/ListEditor/options/emptyKey/ emptyKey} и {@link /docs/js/Controls/filterPanel/ListEditor/options/emptyText/ emptyText}.
 * @demo Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/EmptyKey/Index
 */

/**
 * @name Controls/_filterPanel/Editors/List#emptyTextMainCounterProperty
 * @cfg {String} Имя свойства, содержащего значение дополнительного счётчика для пункта в начале списка
 * @remark Для отображения пункта в начале списка необходимо использовать опции
 * {@link /docs/js/Controls/filterPanel/ListEditor/options/emptyKey/ emptyKey} и {@link /docs/js/Controls/filterPanel/ListEditor/options/emptyText/ emptyText}.
 * @demo Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/EmptyKey/Index
 */

/**
 * @name Controls/_filterPanel/Editors/List#mainCounterTooltipProperty
 * @cfg {String} Имя свойства, содержащего значение подсказки, которая появляется при наведении на счётчик элемента списка.
 */

/**
 * @name Controls/_filterPanel/Editors/List#additionalTextTooltipProperty
 * @cfg {String} Имя свойства, содержащего значение подсказки, которая появляется при наведении на дополнительный счетчик элемента списка.
 */

/**
 * @name Controls/_filterPanel/Editors/List#mainCounterTooltip
 * @cfg {String} Подсказка, появляющаяся при наведении на счётчик элемента списка.
 * @see mainCounterTooltipProperty
 */

/**
 * @name Controls/_filterPanel/Editors/List#additionalCounterTooltip
 * @cfg {String} Подсказка, появляющаяся при наведении на дополнительный счетчик элемента списка.
 * @see additionalTextTooltipProperty
 */

/**
 * @name Controls/_filterPanel/Editors/List#additionalTextStyleProperty
 * @cfg {String} Поле записи, содержащее цвет текста дополнительного столбца записи.
 * @see Controls/interface:IFontColorStyle#fontColorStyle
 */

/**
 * @name Controls/_filterPanel/Editors/List#imageProperty
 * @cfg {String} Имя свойства, содержащего ссылку на изображение для элемента списка.
 * @demo Controls-ListEnv-demo/FilterPanel/View/Index
 */

/**
 * @name Controls/_filterPanel/Editors/List#markerStyle
 * @cfg {String} Стиль отображения маркера в списке.
 * @variant default - маркер в виде радиокнопки;
 * @variant primary - обычный маркер.
 * @default default
 * @remark Если редактор с опцией markerStyle: primary отображается первым, то группировка у него будет скрыта.
 */

/**
 * @name Controls/_filterPanel/Editors/List#style
 * @cfg {String} Стиль отображения чекбокса в списке.
 * @variant default
 * @variant master
 * @default default
 */

/**
 * @name Controls/_filterPanel/Editors/List#multiSelect
 * @cfg {boolean} Определяет, установлен ли множественный выбор.
 * @demo Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MultiSelect/Index
 * @default false
 */

/**
 * @name Controls/_filterPanel/Editors/List#emptyKey
 * @cfg {string} Ключ для пункта списка, который используется для сброса параметра фильтрации.
 * @see emptyText
 * @demo Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/EmptyKey/Index
 */

/**
 * @name Controls/_filterPanel/Editors/List#emptyText
 * @cfg {string} Добавляет в начало списка элемент с заданным текстом.
 * Используется для сброса параметра фильтрации, когда в панели фильтров отключено отображение кнопки "Сбросить".
 * @remark При активации снимает отметку чекбоксами со всех записей в списке
 * @demo Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/EmptyKey/Index
 */

/**
 * @name Controls/_filterPanel/Editors/List#selectedAllKey
 * @cfg {string} Ключ для пункта списка, который используется для установки фильтрации по всем доступным значениям для данного параметра.
 * @see selectedAllText
 */

/**
 * @name Controls/_filterPanel/Editors/List#counterTemplate
 * @cfg {string} Задаёт шаблон счётчика для элемента списка.
 * @example
 * <pre class="brush: html; highlight: [9]">
 * this._filterButtonData = [{
 *    caption: 'Ответственный',
 *    name: 'owner',
 *    resetValue: [],
 *    value: [],
 *    textValue: '',
 *    editorTemplateName: 'Controls/filterPanel:ListEditor',
 *    editorOptions: {
 *        counterTemplate: 'Controls-demo/filterPanel/CompositeFilter/resources/CheckboxEditor',
 *        source: new Memory({...})
 *    }
 * }]
 * </pre>
 * @see additionalTextProperty
 */

/**
 * @name Controls/_filterPanel/Editors/List#imageTemplateName
 * @cfg {String|Function} Задаёт путь до шаблона изображения для элемента списка.
 * @example
 * <pre class="brush: html; highlight: [9]">
 * this._filterButtonData = [{
 *    caption: 'Ответственный',
 *    name: 'owner',
 *    resetValue: [],
 *    value: [],
 *    textValue: '',
 *    editorTemplateName: 'Controls/filterPanel:ListEditor',
 *    editorOptions: {
 *        imageTemplateName: 'Controls-demo/filterPanel/ImageTemplate',
 *        source: new Memory({...})
 *    }
 * }]
 * </pre>
 * @remark Рекомендуется использовать опцию imageProperty
 * @see imageProperty
 */

/**
 * @name Controls/_filterPanel/Editors/List#imageTemplate
 * @cfg {String|Function} Задаёт шаблон изображения для элемента списка.
 * @example
 * <pre class="brush: html; highlight: [9]">
 * this._filterButtonData = [{
 *    caption: 'Ответственный',
 *    name: 'owner',
 *    resetValue: [],
 *    value: [],
 *    textValue: '',
 *    editorTemplateName: 'Controls/filterPanel:ListEditor',
 *    editorOptions: {
 *        imageTemplate: 'Controls-demo/filterPanel/ImageTemplate',
 *        source: new Memory({...})
 *    }
 * }]
 * </pre>
 * @remark Рекомендуется использовать опцию imageProperty
 * @see imageProperty
 */

/**
 * @name Controls/_filterPanel/Editors/List#selectedAllText
 * @cfg {string} Добавляет в начало списка элемент с заданным текстом.
 * Используется для установки фильтрации по всем доступным значениям для данного параметра.
 * @remark При активации снимает отметку чекбоксами со всех записей в списке
 */

/**
 * @name Controls/_filterPanel/Editors/List#selectedAllText
 * @cfg {string} Добавляет в начало списка элемент с заданным текстом.
 * Используется для установки фильтрации по всем доступным значениям для данного параметра.
 * @remark При активации снимает отметку чекбоксами со всех записей в списке
 */

/**
 * @name Controls/_filterPanel/Editors/List#editArrowClickCallback
 * @cfg {Function} Функция обратного вызова, вызывается при клике на "шеврон" элемента.
 */

/**
 * @name Controls/_filterPanel/Editors/List#onCounterClick
 * @cfg {Function} Обработчик клика по счетчику.
 */

/**
 * @name Controls/_filterPanel/Editors/List#onMainCounterClick
 * @cfg {Function} Обработчик клика по значению счетчика, переданного в mainCounterProperty.
 */

/**
 * @name Controls/_filterPanel/Editors/List#onAdditionalCounterClick
 * @cfg {Function} Обработчик клика по значению счетчика, переданного в additionalTextProperty.
 */

/**
 * @name Controls/_filterPanel/Editors/List#dragNDropProviderName
 * @cfg {String} Имя класса, реализующего перемещение с помощью драг-н-дропа.
 * Платформенный класс для перемещения: {@link Controls/filterPanel:DragNDropProviderBase}
 */

/**
 * @name Controls/_filterPanel/Editors/List#multiSelectVerticalAlign
 * @cfg {String} Задает выравнивание для маркера.
 * @variant top
 * @variant center
 * @default top
 */

/**
 * @name Controls/_filterPanel/Editors/List#itemActions
 * @cfg {Array.<Controls/_filterPanel/_interface/IAction>} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи}.
 * @demo Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/ItemActions/Index
 */

/**
 * @name Controls/_filterPanel/Editors/List#titleTemplateName
 * @cfg {String} Шаблон отображения текста в элементе списка.
 * @example
 * <pre class="brush: html; highlight: [9]">
 * const filterDescription = [{
 *    name: 'owner'
 *    caption: 'Ответственный',
 *    resetValue: [],
 *    value: [],
 *    textValue: '',
 *    editorTemplateName: 'Controls/filterPanel:ListEditor',
 *    editorOptions: {
 *        titleTemplateName: 'MyModule/myLib:TitleTemplate',
 *        ...
 *    }
 * }]
 * </pre>
 *
 * // MyModule/myLib:TitleTemplate
 * <pre>
 *      import { IColumnTemplateProps } from 'Controls/grid';
 *
 *      export default function TitleTemplate(props: IColumnTemplateProps): React.ReactElement {
 *          return (
 *              <span class='controls-fontsize-xl'>{props.item.contents.get('title')}</span>
 *          )
 *     }
 * </pre>
 * @remark
 * Про параметры, доступные в шаблоне, можно прочитать {@link /doc/platform/developmentapl/interface-development/controls/list/grid/columns/template/#_2 здесь}.
 */

/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, TemplateFunction } from 'UI/Base';
import { isEqual } from 'Types/object';
import { IListEditorOptions } from 'Controls/_filterPanel/Editors/_List';
import * as ListTemplate from 'wml!Controls/_filterPanel/Editors/List';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { Logger } from 'UI/Utils';
import 'css!Controls/filterPanel';

/**
 * Контрол используют в качестве редактора для выбора значений из списка на {@link Controls/filterPanel:View панели фильтров}.
 * @class Controls/_filterPanel/Editors/List
 * @extends Core/Control
 * @implements Controls/grid:IGridControl
 * @implements Controls/interface:INavigation
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/interface/IItemTemplate
 * @demo Controls-ListEnv-demo/FilterPanel/View/Base/Index
 * @public
 */

class ListEditor extends Control<IListEditorOptions> {
    protected _template: TemplateFunction = ListTemplate;

    protected _beforeMount(options: IListEditorOptions): void {
        const {
            sourceController,
            editorsViewMode,
            viewMode,
            resetValue,
            propertyValue,
        } = options;
        this._validateOptions(options);
        if (
            (editorsViewMode === 'default' ||
                (editorsViewMode === 'popupCloudPanelDefault' &&
                    viewMode === 'basic')) &&
            isEqual(propertyValue, resetValue) &&
            !sourceController?.getItems()
        ) {
            sourceController?.reload();
        }
    }

    protected _beforeUpdate(newOptions: IListEditorOptions): void {
        if (
            newOptions.editorsViewMode !== this._options.editorsViewMode &&
            isEqual(newOptions.propertyValue, newOptions.resetValue)
        ) {
            newOptions.sourceController?.reload();
        }
    }

    protected _extendedCaptionClickHandler(): void {
        const notifyPropertyValueChanged = () => {
            const extendedValue = {
                value: this._options.resetValue,
                textValue: '',
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
 * @name Controls/_filterPanel/Editors/List#mainCounterTooltip
 * @cfg {String} Подсказка, появляющаяся при наведении на счётчик элемента списка.
 */

/**
 * @name Controls/_filterPanel/Editors/List#additionalCounterTooltip
 * @cfg {String} Подсказка, появляющаяся при наведении на дополнительный счетчик элемента списка.
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

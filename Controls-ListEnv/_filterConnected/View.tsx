/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import * as React from 'react';
import _View, { IFilterViewWidgetOptions } from './View/_View';

/**
 * Контрол "Объединённый фильтр".
 * Реализует UI для отображения и редактирования фильтра.
 * Представляет собой кнопку, при клике по которой выводится список возможных параметров фильтрации.
 * @remark Строится по настройкам фильтрации, которые указаны в аргументах списочной фабрики. Подробнее можно прочитать в {@link /doc/platform/developmentapl/interface-development/controls/new-data-store/ статье}.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-view/ руководство разработчика по настройке контрола}
 * * {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/filter-config/ руководство разработчика по настройке фильтра на странице}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 *
 * @public
 *
 * @class Controls-ListEnv/filterConnected:View
 * @extends UI/Base:Control
 * @mixes Controls/interface:IStoreId
 * @mixes Controls-ListEnv/filterConnected:IFilterNames
 *
 * @demo Controls-ListEnv-demo/Filter/View/Index
 * @see Controls/filter:View
 * @see Controls-ListEnv/filterPanelConnected:Widget
 */
function FilterConnectedView(props: IFilterViewWidgetOptions, ref) {
    return <_View ref={ref} {...props}></_View>;
}

export default React.forwardRef(FilterConnectedView);
/**
 * @name Controls-ListEnv/filterConnected:View#detailPanelOrientation
 * @cfg {String} Определяет ориентацию окна фильтров.
 * @variant vertical Вертикальная ориентация панели. Блок истории отображается внизу.
 * @variant horizontal Горизонтальная ориентация панели. Блок истории отображается справа.
 * @default vertical
 * @remark
 * Если указано значение "horizontal", но на панели нет истории фильтрации, контрол будет отображаться в одном столбце.
 * @example
 * В данном примере панель будет отображаться в две колонки.
 * <pre class="brush: html; highlight: [3]">
 * <Controls-ListEnv.filterConnected:View
 *    storeId="reports"
 *    detailPanelOrientation="horizontal"/>
 * </pre>
 */

/**
 * @typedef {PanelWidth} Controls-ListEnv/filterConnected:View/PanelWidth
 * @description Стандартная линейка размеров для ширин окна.
 * Подробнее о значениях переменных для темы {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-22.5100/Controls-default-theme/variables/_popupTemplate.less#L112 online'а}
 * @property {String} a
 * @property {String} b
 * @property {String} c
 * @property {String} d
 * @property {String} e
 * @property {String} f
 * @property {String} g
 * @property {String} h
 * @property {String} i
 * @property {String} j
 * @property {String} k
 * @property {String} l
 * @property {String} m
 */

/**
 * @name Controls-ListEnv/filterConnected:View#detailPanelWidth
 * @cfg {Controls-ListEnv/filterConnected:View/PanelWidth.typedef} Определяет ширину окна фильтров
 * @remark Поддерживается стандартная линейка размеров диалоговых окон.
 * Подробнее о значениях переменных для темы {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-23.7100/Controls-default-theme/variables/_popupTemplate.less#L116 online'а}
 * @example
 * <pre class="brush: html; highlight: [3]">
 *    <Controls-ListEnv.filterConnected:View
 *       storeId="reports"
 *       detailPanelWidth="e"/>
 * </pre>
 */

/**
 * @name Controls-ListEnv/filterConnected:View#detailPanelExtendedItemsViewMode
 * @cfg {string} Определяет компоновку фильтров в области "Можно отобрать".
 * @variant row Все фильтры размещаются в строку. При недостатке места, фильтр будет перенесён на следующую строку.
 * @variant column Все фильтры размещаются в двух колонках. При недостатке места, фильтр обрезается троеточием.
 * @default column
 * @remark Вариант компоновки <b>row</b> рекомендуется использовать, когда набор фильтров в области "Можно отобрать" определяется динамически (например набор фильтров определяет пользователь).
 * @demo Controls-ListEnv-demo/Filter/View/DetailPanelExtendedItemsViewMode/Index
 * @demo Controls-ListEnv-demo/Filter/View/ViewMode/Extended/Index
 */

/**
 * @name Controls-ListEnv/filterConnected:View#detailPanelTopTemplateName
 * @cfg {string} Путь до шаблона, в котором выводится пользовательский контент, выводящийся справа от заголовка
 */

/**
 * @name Controls-ListEnv/filterConnected:View#detailPanelHistorySaveMode
 * @cfg {string} Режим работы с историей фильтров
 * @variant pinned По ховеру на элемент появляется команда закрепления записи.
 * @variant favorite По ховеру на элемент появляется команда добавления записи в избранное.
 */

/**
 * @name Controls-ListEnv/filterConnected:View#detailPanelTopTemplateOptions
 * @cfg {Object} Опции для контрола, который передан в {@link detailPanelTopTemplateName}.
 */

/**
 * @name Controls-ListEnv/filterConnected:View#detailPanelExtendedTemplateName
 * @cfg {Object} Путь до шаблона для области "Можно отобрать", подробнее {@link Controls/filterPanel:View#extendedTemplateName}.
 * @remark Контрол, который лежит в области "Можно отобрать" должен поддерживать следующий контракт:
 * - принимать опцию typeDescription, в которой передаётся структура фильтров
 * - принимать опцию editingObject, в которой передаётся объект фильтра
 * - при изменении фильтров стрелять событием editingObjectChanged
 *
 * Для реализации блока "Можно отобрать" рекомендуется использовать {@link Controls/filterPanel:DefaultExtendedTemplate раскладку},
 * которая реализует отображение заголовка блока и правильные отступы.
 * @example
 * <pre class="brush: html">
 *     <Controls-ListEnv.filterConnected:View
 *                 storeId="0"
 *                 detailPanelExtendedTemplateName="MyModule/CustomExtendedTemplate"/>
 * </pre>
 *
 * MyModule/CustomExtendedTemplate.wml
 * <pre class="brush: html">
 *     <Controls.filterPanel:DefaultExtendedTemplate headingCaption="{{_options.headingCaption}}">
 *         <ws:bodyContentTemplate>
 *            <ws:for data="item in _options.typeDescription">
 *                <ws:if data="{{_isExtendedItem(item)}}">
 *                    <ws:partial template="{{item.extendedTemplateName}}"
 *                                on:click="_notifyChanges(item.name)"
 *                    />
 *                </ws:if>
 *            </for>
 *         </ws:bodyContentTemplate>
 *     </Controls.filterPanel:DefaultExtendedTemplate>
 * </pre>
 *
 * MyModule/CustomExtendedTemplate.ts
 * <pre class="brush: js">
 *      private _notifyChanges(event, filterName: string, filterValue: IExtendedPropertyValue): void {
 *           const newEditingObject = {...this._options.editingObject};
 *           newEditingObject[filterName] = {
 *               value: filterValue,
 *               viewMode: 'basic',
 *               textValue: this._getTextValue(filterValue)
 *           };
 *           this._notify('editingObjectChanged', [newEditingObject]);
 *      }
 * </pre>
 * @demo Controls-ListEnv-demo/Filter/View/DetailPanelExtendedTemplateName/Index
 * @see Controls/filterPanel:DefaultExtendedTemplate
 */

/**
 * @name Controls-ListEnv/filterConnected:View#emptyText
 * @default Все
 * @cfg {String} Текстовое значение, которое будет использовано для отображения рядом с кнопкой, когда во всех фильтрах установлено значение "по-умолчанию" (value === resetValue)
 * @remark
 * Текст отображается только в случае, если настроены быстрые фильтры.
 * @example
 * <pre class="brush: html">
 *         <Controls-ListEnv.filterConnected:View
 *                 storeId="myStoreId"
 *                 emptyText="Все сотрудники"/>
 * </pre>
 */

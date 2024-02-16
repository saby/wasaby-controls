/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_listDataOld/WrappedContainer';

/**
 * Контрол-контейнер для списка. Передает опции из контекста в список.
 *
 * @remark
 * Контейнер ожидает поле контекста "dataOptions", которое поставляет Controls/listDataOld:DataContainer.
 * Из поля контекста "dataOptions" контейнер передает в список следующие опции: <a href="/docs/js/Controls/list/View/options/filter/">filter</a>, <a href="/docs/js/Controls/list/View/options/navigation/">navigation</a>, <a href="/docs/js/Controls/list/View/options/sorting/">sorting</a>, <a href="/docs/js/Controls/list/View/options/keyProperty/">keyProperty</a>, <a href="/docs/js/Controls/list/View/options/source/">source</a>, sourceController.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_list.less переменные тем оформления}
 * * {@link Controls/listDataOld:DataContainer}
 *
 * @class Controls/_listDataOld/ListContainer
 * @extends UI/Base:Control
 * @public
 */

export default class WrappedContainer extends Control {
    _template: TemplateFunction = template;
}

/**
 * @name Controls/_listDataOld/ListContainer#id
 * @cfg {String} Уникальный идентификатор для привязки данных
 * @remark Опция актуальна, если Browser конфигурируется с помощью опции listsOptions.
 * Значение опции должно совпадать с соответствующим значением опции id в listsOptions.
 * @example
 * <pre class="brush: js;">
 *     _beforeMount(): void {
 *         this._listsOptions = [
 *         {
 *             id: 'list',
 *             source: new SbisService(...)
 *         },
 *         {
 *             id: 'list2',
 *             source: new SbisService(...)
 *         },
 *     ]
 *     }
 * </pre>
 *
 * <pre class="brush: html;">
 *     <Controls.browser:Browser listsOptions="{{_listsOptions}}">
 *         <Controls.listDataOld:ListContainer id="list">
 *             <Controls.list:View/>
 *         </Controls.listDataOld:ListContainer>
 *         <Controls.listDataOld:ListContainer id="list2">
 *             <Controls.list:View/>
 *         </Controls.listDataOld:ListContainer>
 *     </Controls.browser:Browser>
 * <pre>
 */

/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_baseList/Data';
import { CompatibleContainer } from 'Controls/_baseList/Data/CompatibleContainerConnected';
import { RecordSet } from 'Types/collection';
import { INavigationSourceConfig } from 'Controls/interface';
import { IDataOptions } from './interface/IDataOptions';

/**
 * Контрол-контейнер, предоставляющий контекстное поле "dataOptions" с необходимыми данными для дочерних контейнеров.
 *
 * @remark
 * Поле контекста "dataOptions" ожидает Controls/list:Container, который лежит внутри.
 *
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FFilterSearch%2FFilterSearch демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/editing-dialog/sync/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_list.less переменные тем оформления}
 * * {@link Controls/list:Container}
 *
 * @class Controls/_list/Data
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:ISource
 * @implements Controls/interface:ISelectFields
 * @extends UI/Base:Control
 *
 * @public
 */

/**
 * @name Controls/_list/Data#dataLoadCallback
 * @cfg {Function} Функция, которая вызывается каждый раз после загрузки данных из источника контрола.
 * Функцию можно использовать для изменения данных еще до того, как они будут отображены в контроле.
 * @remark
 * Функцию вызывается с двумя аргументами:
 * - items коллекция, загруженная из источника данных с типом {@link Types/collection:RecordSet}.
 * - direction направление загрузки данных (up/down), данный аргумент передаётся при подгрузке данных по скролу.
 * @example
 * <pre class="brush:html">
 *    <Controls.list:DataContainer dataLoadCallback="{{_myDataLoadCallback}}" />
 * </pre>
 * <pre class="brush:js">
 *    _myDataLoadCallback = function(items) {
 *       items.each(function(item) {
 *          item.set(field, value);
 *       });
 *    }
 * </pre>
 */

/*
 * Container component that provides a context field "dataOptions" with necessary data for child containers.
 *
 * Here you can see a <a href="/materials/DemoStand/app/Controls-demo%2FFilterSearch%2FFilterSearch">demo</a>.
 *
 * @class Controls/_list/Data
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:ISource
 * @extends UI/Base:Control
 *
 * @public
 * @author Герасимов А.М.
 */

class Data extends Control<IDataOptions> /** @lends Controls/_list/Data.prototype */ {
    protected _template: TemplateFunction = template;
    protected _children: {
        data: CompatibleContainer;
    };

    reload(config?: INavigationSourceConfig): Promise<RecordSet | Error> {
        return this._children.data.reload(config);
    }
}

/**
 * @name Controls/_list/Data#root
 * @cfg {Number|String} Идентификатор корневого узла.
 * Значение опции root добавляется в фильтре в поле {@link Controls/_interface/IHierarchy#parentProperty parentProperty}.
 * @example
 * <pre class="brush: js; highlight: [5]">
 * <Controls.list:DataContainer
 *     keyProperty="id"
 *     filter="{{_filter}}"
 *     source="{{_source}}"
 *     root="Сотрудники"/>
 * </pre>
 */

/**
 * @event rootChanged Происходит при изменении корня иерархии.
 * @name Controls/_list/Data#rootChanged
 * @param {eventObject} event Дескриптор события.
 * @param {String|Number} root Идентификатор корневой записи.
 */

export default Data;

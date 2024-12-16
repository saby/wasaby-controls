/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
import { ICrud, ICrudPlus, IData } from 'Types/source';
export type TSourceOption = (ICrudPlus & ICrud) | (ICrud & ICrudPlus & IData);
export interface ISourceOptions {
    source?: TSourceOption;
    keyProperty?: string;
}

/**
 * Интерфейс для доступа к источнику данных.
 * @public
 */

/*
 * Interface for components that use data source.
 * @public
 * @author Крайнов Д.О.
 */
export default interface ISource {
    readonly '[Controls/_interface/ISource]': boolean;
}
/**
 * @name Controls/_interface/ISource#source
 * @cfg {Types/source:ICrud|Types/source:ICrudPlus} Объект реализующий интерфейс {@link Types/source:ICrud}, необходимый для работы с источником данных.
 * @remark
 * Более подробно об источниках данных вы можете почитать {@link /doc/platform/developmentapl/interface-development/data-sources/ здесь}.
 * @example
 * В приведённом примере для контрола {@link Controls/list:View} в опцию source передаётся {@link Types/source:HierarchicalMemory} источник.
 * Контрол получит данные из источника и выведет их.
 *
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.list:View source="{{_source}}" keyProperty="key">
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/list:ItemTemplate" scope="{{itemTemplate}}">
 *          <ws:contentTemplate>
 *             <span>{{contentTemplate.item.contents.title}}</span>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.list:View>
 * </pre>
 *
 * <pre class="brush: js">
 * import {Memory} from "Types/source";
 *
 * _source: null,
 * _beforeMount: function() {
 *     this._source = new Memory({
 *         keyProperty: 'key',
 *         data: [
 *             {
 *                 key: '1',
 *                 title: 'Ярославль',
 *                 icon: 'icon-small icon-Yar icon-done'
 *             },
 *             {
 *                 key: '2',
 *                 title: 'Рыбинск',
 *                 icon: 'icon-small icon-Ryb icon-done'
 *             },
 *             {
 *                 key: '3',
 *                 title: 'St-Petersburg',
 *                 icon: 'icon-small icon-SPB icon-done'
 *             }
 *         ]
 *     })
 * }
 * </pre>
 * @see Types/source:ICrud
 */
/*
 * @name Controls/_interface/ISource#source
 * @cfg {Types/source:ICrud} Object that implements {@link Types/source:ICrud} interface for working with data.
 * More information about sources you can read <a href='doc/platform/developmentapl/interface-development/data-sources/'>here</a>.
 * @see Types/source:ICrudPlus
 * @see Types/source:ICrud
 */

/**
 * @name Controls/_interface/ISource#keyProperty
 * @cfg {String} Имя поля записи, в котором хранится {@link /docs/js/Types/entity/applied/PrimaryKey/ первичный ключ}.
 * @remark Например, идентификатор может быть первичным ключом записи в базе данных.
 * Если keyProperty не задан, то значение будет взято из source.
 * @demo Controls-demo/list_new/KeyProperty/Source/Index
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.list:View
 *    source="{{_source}}"
 *    keyProperty="key" />
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * _source: null,
 * _beforeMount: function(){
 *    this._source = new source.Memory({
 *       keyProperty: 'key',
 *       data: [
 *          {
 *             key: '1',
 *             title: 'Yaroslavl'
 *          },
 *          {
 *             key: '2',
 *             title: 'Moscow'
 *          },
 *          {
 *             key: '3',
 *             title: 'St-Petersburg'
 *          }
 *       ]
 *    })
 * }
 * </pre>
 */

/*
 * @name Controls/_interface/ISource#keyProperty
 * @cfg {String} Name of the item property that uniquely identifies collection item.
 * @remark For example, the identifier may be the primary key of the record in the database.
 */

/**
 * @name Controls/_interface/ISource#dataLoadCallback
 * @cfg {Function} Функция, которая вызывается каждый раз непосредственно после загрузки данных из источника контрола.
 * Функцию можно использовать для изменения данных еще до того, как они будут отображены в контроле.
 * @markdown
 * @remark
 * Первым аргументом в функцию приходит **items** с типом данных {@link Types/collection:RecordSet}, где содержатся загруженные данные. Вторым аргументом - направление подгрузки (up/down, если подгрузка выполнялась вверх/вниз; null, если выполнялась первая загрузка или перезагрузка). Обновление колонок после загрузки или изменения данных производится через dataLoadcallback, в beforeUpdate опцию columns обновлять нельзя.
 * @see itemsReadyCallback
 * @see dataLoadErrback
 */

/**
 * @name Controls/_interface/ISource#dataLoadErrback
 * @cfg {Function} Функция обратного вызова для определения сбоя загрузки данных из источника.
 * @remark
 * Первым аргументом в функцию приходит **event** с типом данных {@link UI/Events:SyntheticEvent}.
 * Вторым аргументом - **error** - стандартный объект ошибки в js.
 * Третьм аргументом - **key** - ключ элемента, при загрузке которого произошла ошибка.
 * Третьм аргументом - **direction** - направление подгрузки.
 * @see itemsReadyCallback
 * @see dataLoadCallback
 */

/* ENG
 * @name Controls/_interface/ISource#dataLoadErrback
 * @cfg {Function} Callback function that will be called when data loading fail
 */

import { ICrud, ICrudPlus, IData } from 'Types/source';

/**
 * @public
 */
export type TSourceOption = ICrudPlus | (ICrud & ICrudPlus & IData);

/**
 * @public
 */
export interface ISourceOptions {
    /**
     * Объект реализующий интерфейс {@link Types/source:ICrud}, необходимый для работы с источником данных.
     * @remark
     * Более подробно об источниках данных вы можете почитать {@link /doc/platform/developmentapl/interface-development/data-sources/ здесь}.
     * @example
     * В приведённом примере для контрола Controls/list:View в опцию source передаётся {@link Types/source:HierarchicalMemory} источник.
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
    source?: TSourceOption;
    /**
     * Имя поля записи, в котором хранится {@link /docs/js/Types/entity/applied/PrimaryKey/ первичный ключ}.
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
    keyProperty?: string;
}

/**
 * Интерфейс для доступа к источнику данных.
 * @public
 */
export default interface ISource {
    readonly '[Controls-DataEnv/_interface/ISource]': boolean;
}

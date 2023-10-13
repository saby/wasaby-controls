/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { IColumn } from 'Controls/grid';
import { IBaseGroupTemplate } from 'Controls/baseList';
/**
 * Интерфейс колонки списка с иерархической группировкой.
 * @public
 */
export interface IGroupNodeColumn extends IColumn {
    /**
     * @cfg {Controls/list:IBaseGroupTemplate} Конфигурация шаблона группы для текущей колонки
     * В конфигурации поддерживаются все свойства шаблона группы.
     * @example
     *
     * В следующем примере показана конфигурация, которая позволит отобразить узел в виде группы.
     *
     * <pre class="brush: js">
     * class MyControl extends Control<IControlOptions> {
     *
     *     protected _source = new Memory({
     *         keyProperty: 'id',
     *         data: [{
     *             id: 1,
     *             parent: null,
     *             type: true,
     *             nodeType: 'group',
     *             title: 'I am group'
     *         },
     *         {
     *             id: 10,
     *             parent: 1,
     *             type: null,
     *             nodeType: null,
     *             title: 'I am leaf'
     *         }]
     *     })
     *
     *     protected _columns: IGroupNodeColumn[] = [
     *         {
     *             displayProperty: 'title',
     *             groupNodeConfig: {
     *                 textAlign: 'center'
     *             }
     *         }
     *     ]
     * }
     * </pre>
     */
    groupNodeConfig?: IBaseGroupTemplate;

    /**
     * @name Controls/_treeGrid/interface/IGroupNodeColumn#template
     * @cfg {UI/Base:TemplateFunction|string} Шаблон отображения ячейки. Не влияет на отображение группы.
     * @see Controls/grid:IColumn
     */
}

/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { IColumn } from 'Controls/grid';
import type { IVerticalRowPadding } from 'Controls/gridReact';
import { IBaseGroupTemplate } from 'Controls/baseList';

export interface IGroupNodeConfig extends IBaseGroupTemplate {
    /**
     * @cfg {Controls/gridReact/IVerticalRowPadding} Вертикальные отступы группы
     * @demo Controls-demo/treeGridNew/NodeTypeProperty/Padding/Index
     */
    padding?: IVerticalRowPadding;
}

/**
 * Интерфейс колонки списка с иерархической группировкой.
 * @public
 */
export interface IGroupNodeColumn extends IColumn {
    /**
     * @cfg {Controls/_treeGrid/interface/IGroupNodeColumn} Конфигурация шаблона группы для текущей колонки
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
    groupNodeConfig?: IGroupNodeConfig;

    /**
     * @name Controls/_treeGrid/interface/IGroupNodeColumn#template
     * @cfg {UI/Base:TemplateFunction|string} Шаблон отображения ячейки. Не влияет на отображение группы.
     * @see Controls/grid:IColumn
     */
}

/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { IVerticalRowPadding, IColumnConfig } from 'Controls/gridRender';
import type { ICompatibleColumnConfig } from 'Controls/gridDisplay';
import { IBaseGroupTemplate } from 'Controls/baseList';
import { TemplateFunction } from 'UI/Base';
import { TFontColorStyle, TFontSize, TFontWeight } from 'Controls/interface';

/**
 * Интерфейс настроек для узла, отображаемого в виде группы
 * @public
 */
export interface IGroupNodeConfig extends IBaseGroupTemplate {
    /**
     * Вертикальные отступы группы
     * @cfg
     * @demo Controls-demo/treeGridNew/NodeTypeProperty/Padding/Index
     */
    padding?: IVerticalRowPadding;
}

/**
 * Интерфейс колонки списка с иерархической группировкой.
 * @public
 */
export interface ITreeGridColumnConfig extends IColumnConfig {
    /**
     * Конфигурация шаблона группы для текущей колонки.
     * @cfg
     * @example
     * В следующем примере показана конфигурация, которая позволит отобразить узел в виде группы.
     * <pre class="brush: js">
     * import { IGroupNodeColumnConfig } from 'Controls/treeGridRender';
     * const columns: IGroupNodeColumnConfig[] = [
     *     {
     *         displayProperty: 'title',
     *         groupNodeConfig: {
     *             textAlign: 'center',
     *         },
     *     },
     * ];
     * </pre>
     */
    groupNodeConfig?: IGroupNodeConfig;
}

/**
 * Интерфейс для конфигурации колонки в {@link Controls/treeGrid:View дереве с колонками} в режиме совместимости со старыми настройками.
 * @public
 */
export interface ICompatibleTreeGridColumnConfig
    extends ITreeGridColumnConfig,
        ICompatibleColumnConfig {
    /**
     * Шаблон ячейки заголовка узла.
     * @cfg
     * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
     */
    nodeHeaderTemplate?: TemplateFunction | string;
    /**
     * Шаблон ячейки подвала узла.
     * @cfg
     * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
     */
    nodeFooterTemplate?: TemplateFunction | string;
    /**
     * Размер шрифта.
     * @cfg
     * @default "l". Для контрола {@link Controls/treeGrid:View}: "m" (для листа), "xl" (для скрытого узла) и "2xl" (для узла).
     * @remark
     * Размер шрифта ячейки имеет больший приоритет, чем {@link Controls/_treeGridRender/interface/ItemTemplate#fontSize размер шрифта записи}.
     * Размер шрифта применяется ко всем записям дерева с колонками, включая {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/node/group/ узлы, отображаемые в виде групп}, но на базовую линию не влияет.
     * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
     */
    fontSize?: TFontSize;
    /**
     * Стиль цвета текста ячейки.
     * @cfg
     * @remark
     * Стиль цвета текста ячейки имеет больший приоритет, чем {@link Controls/_treeGridRender/interface/ItemTemplate#fontColorStyle стиль цвета текста записи}.
     * Стиль цвета текста применяется ко всем записям дерева с колонками, включая {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/node/group/ узлы, отображаемые в виде групп}.
     * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
     */
    fontColorStyle?: TFontColorStyle;
    /**
     * Насыщенность шрифта.
     * @default "default".
     * @remark
     * Насыщенность шрифта ячейки имеет больший приоритет, чем {@link Controls/_treeGridRender/interface/ItemTemplate#fontWeight Насыщенность шрифта записи}.
     * Насыщенность шрифта применяется ко всем записям дерева с колонками, включая {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/node/group/ узлы, отображаемые в виде групп}.
     * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
     */
    fontWeight?: TFontWeight;
}

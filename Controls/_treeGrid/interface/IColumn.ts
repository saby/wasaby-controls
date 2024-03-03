/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { IColumn as IGridColumn } from 'Controls/grid';
import { IGroupNodeColumn } from 'Controls/_treeGrid/interface/IGroupNodeColumn';
import { TemplateFunction } from 'UI/Base';

/**
 * Интерфейс для конфигурации колонки в {@link Controls/treeGrid:View дереве с колонками}.
 * @implements Controls/grid:IColumn
 * @public
 */
export interface IColumn extends IGridColumn, IGroupNodeColumn {
    /**
     * @cfg {TemplateFunction|String} Шаблон ячейки заголовка узла.
     */
    nodeHeaderTemplate?: TemplateFunction | string;
    /**
     * @cfg {TemplateFunction|String} Шаблон ячейки подвала узла.
     */
    nodeFooterTemplate?: TemplateFunction | string;
}

/**
 * @name Controls/_treeGrid/interface/IColumn#fontSize
 * @cfg {TFontSize} Размер шрифта.
 * @default "l". Для контрола {@link Controls/treeGrid:View}: "m" (для листа), "xl" (для скрытого узла) и "2xl" (для узла).
 * @remark
 * Размер шрифта ячейки имеет больший приоритет, чем {@link Controls/_treeGrid/interface/ItemTemplate#fontSize размер шрифта записи}.
 * Размер шрифта применяется ко всем записям дерева с колонками, включая {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tree-column/node/group/ узлы, отображаемые в виде групп}, но на базовую линию не влияет.
 */
/**
 * @name Controls/_treeGrid/interface/IColumn#fontColorStyle
 * @cfg {TFontColorStyle} Стиль цвета текста ячейки.
 * @remark
 * Стиль цвета текста ячейки имеет больший приоритет, чем {@link Controls/_treeGrid/interface/ItemTemplate#fontColorStyle стиль цвета текста записи}.
 * Стиль цвета текста применяется ко всем записям дерева с колонками, включая {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tree-column/node/group/ узлы, отображаемые в виде групп}.
 */
/**
 * @name Controls/_treeGrid/interface/IColumn#fontWeight
 * @cfg {TFontWeight} Насыщенность шрифта.
 * @default "default".
 * @remark
 * Насыщенность шрифта ячейки имеет больший приоритет, чем {@link Controls/_treeGrid/interface/ItemTemplate#fontWeight Насыщенность шрифта записи}.
 * Насыщенность шрифта применяется ко всем записям дерева с колонками, включая {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tree-column/node/group/ узлы, отображаемые в виде групп}.
 */

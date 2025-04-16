/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { TemplateFunction } from 'UI/Base';
import { ITree, ITreeControlOptions } from 'Controls/tree';
import {
    IGridControl,
    INodeFooterConfig,
    INodeHeaderConfig,
    TColspanCallback,
} from 'Controls/grid';
import { ICompatibleTreeGridColumnConfig } from 'Controls/_treeGridRender/interface/ITreeGridColumnConfig';

/**
 * Режим отображения иерархической группировки
 * @typedef TGroupNodeViewMode
 * @variant default Стандартный режим
 * @variant headerless Режим, при котором скрывается заголовок первой непустой группы
 */
export type TGroupNodeViewMode = 'default' | 'headerless';

/**
 * @typedef TGroupNodeVisibility
 * @variant visible Всегда показывать полученные из источника данных группы в иерархической группировке.
 * @variant hasdata Показывать полученные из источника данных группы в иерархической группировке только если в метаданных передан параметр singleGroupNode со значением, отличным от true.
 */
export type TGroupNodeVisibility = 'visible' | 'hasdata';

/**
 * Интерфейс описывающий опции доп. элементов в узлах дерева с колонками.
 * @private
 */
export interface ITreeGridExtraItemsProps {
    /**
     * Конфигурация {@link https://test-wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tree-column/node/node-footer-template/ подвала узла}
     * @cfg
     * @demo Controls-demo/treeGridNew/Wi/NodeFooter
     * @see nodeFooterColspanCallback
     * @see nodeHeader
     */
    nodeFooter?: INodeFooterConfig[];
    /**
     * Функция обратного вызова для расчёта объединения колонок подвала узла (колспана).
     * @cfg
     * @demo Controls-demo/treeGridNew/Wi/NodeFooter
     * @remark
     * Функция возвращает количество объединяемых колонок, учитывая текущую. Для объединения всех колонок, начиная с текущей, из функции нужно вернуть специальное значение "end".
     * @markdown
     * @see nodeFooter
     * @see nodeHeader
     */
    nodeFooterColspanCallback?: TColspanCallback;
    /**
     * Конфигурация {@link https://test-wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tree-column/node/node-footer-template/ шапки узла}
     * @cfg
     * @demo Controls-demo/treeGridNew/Wi/NodeHeader
     * @see nodeHeaderColspanCallback
     * @see nodeFooter
     */
    nodeHeader?: INodeHeaderConfig[];
    /**
     * Функция обратного вызова для расчёта объединения колонок шапки узла (колспана).
     * @cfg
     * @demo Controls-demo/treeGridNew/Wi/NodeHeader
     * @remark
     * Функция возвращает количество объединяемых колонок, учитывая текущую. Для объединения всех колонок, начиная с текущей, из функции нужно вернуть специальное значение "end".
     * @markdown
     * @see nodeFooter
     * @see nodeHeader
     */
    nodeHeaderColspanCallback?: TColspanCallback;
}

/**
 * Интерфейс опций, которые принимает TreeGrid
 * @public
 */
export interface IOptions
    extends Partial<ITreeControlOptions>,
        Partial<IGridControl>,
        ITreeGridExtraItemsProps {
    columns: ICompatibleTreeGridColumnConfig[];
    groupNodeViewMode?: TGroupNodeViewMode;
    deepScrollLoad?: boolean;
}

/**
 * Интерфейс дерева с колонками, поддерживающего опции в старом wasaby-стиле
 * @public
 */
export interface ITreeGridCompatibleProps {
    /**
     * Пользовательский шаблон отображения {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/ строки итогов}.
     * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
     * @cfg
     * @default undefined
     * @demo Controls-demo/gridNew/Results/ResultsTemplate/Index
     * @markdown
     * @remark
     * По умолчанию при видимой {@link Controls/_treeGrid/TreeGrid#expanderVisibility кнопке разворота узла} в первую ячейку итогов таблицы добавляется отступ, позволяющий отобразить содержимое на одоной вертикаоьной линии.
     * Для того, чтобы убрать этот отступ, необходимо в {@link resultsTemplateOptions опциях шаблона строки итогов} или в {@link Controls/_gridRender/display/interface/IColumn#resultTemplateOptions опциях ячейки строки итогов} в передать параметр withoutExpanderPadding и присвоить ему значение true.
     *
     * Позволяет установить пользовательский шаблон отображения строки итогов (именно шаблон, а не контрол!). При установке шаблона **ОБЯЗАТЕЛЕН** вызов базового шаблона Controls/grid:ResultsTemplate.
     *
     * В разделе "Примеры" показано как с помощью директивы {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial} задать пользовательский шаблон. Также в опцию resultsTemplate можно передавать и более сложные шаблоны, которые содержат иные директивы, например {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-if ws:if}. В этом случае каждая ветка вычисления шаблона должна заканчиваться директивой ws:partial, которая встраивает Controls/grid:ResultTemplate.
     *
     * Дополнительно о работе с шаблоном вы можете прочитать в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/template/ руководстве разработчика}.
     *
     * Для отображения строки итогов необходимо задать значение в опции {@link resultsPosition}.
     * @see resultsPosition
     * @see resultsVisibility
     */
    resultsTemplate?: TemplateFunction | string;
    /**
     * Объект с параметрами, которые будут установлены в {@link Controls/_treeGridRender/interface/ITreeGrid#resultsTemplate шаблон строки итогов}.
     * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
     * @cfg {Object}
     * @remark
     * По умолчанию при видимой {@link Controls/_treeGrid/TreeGrid#expanderVisibility кнопке разворота узла} в первую ячейку итогов таблицы добавляется отступ, позволяющий отобразить содержимое на одоной вертикаоьной линии.
     * Для того, чтобы убрать этот отступ, необходимо передать параметр withoutExpanderPadding и присвоить ему значение true.
     * Аналогичную настройку при необходимости можно сделать в {@link Controls/_gridRender/display/interface/IColumn#resultTemplateOptions опциях ячейки строки итогов}.
     * @default undefined
     * @see resultsTemplate
     */
    resultsTemplateOptions?: Record<string, unknown>;
}

/**
 * Интерфейс конфигурации дерева-таблицы
 * @implements Controls/interface/IGroupedGrid
 *
 * @ignoreOptions resultsTemplate resultsTemplateOptions
 * @public
 */
export default interface ITreeGrid
    extends ITree,
        IGridControl,
        ITreeGridCompatibleProps,
        ITreeGridExtraItemsProps {
    readonly '[Controls/_treeGridRender/interface/ITreeGrid]': true;
    /**
     * Имя свойства, содержащего информацию о типе узла.
     * @cfg
     * @remark
     * Используется для отображения узлов в виде групп. (См. {@link Controls/treeGrid:IGroupNodeColumn Колонка списка с иерархической группировкой.})
     * Если в RecordSet в указанном свойстве с БЛ приходит значение 'group', то такой узел должен будет отобразиться как группа.
     * При любом другом значении узел отображается как обычно с учётом nodeProperty
     */
    nodeTypeProperty?: string;
    /**
     * Видимость групп в иерархической группировке
     * @cfg
     * @default visible
     */
    groupNodeVisibility?: TGroupNodeVisibility;
    /**
     * Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/grid/columns/ колонок} дерева с колонками.
     * @cfg
     * @remark
     * Если при отрисовске контрола данные не отображаются или выводится только их часть, то следует проверить {@link Controls/collection:RecordSet}, полученный от {@link /doc/platform/developmentapl/interface-development/controls/list/source/ источника данных}.
     * Такой RecordSet должен содержать набор полей, которые заданы в конфигурации контрола в опции columns, а также сами данные для каждого поля.
     */
    columns: ICompatibleTreeGridColumnConfig[];
}

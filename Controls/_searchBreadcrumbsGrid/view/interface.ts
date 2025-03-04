import * as React from 'react';
import { IGridViewProps } from 'Controls/grid';

/**
 * Варианты режимов вывода строки с хлебными крошками в результатах поиска.
 * @typedef TBreadcrumbsMode
 * @variant row все ячейки строки с хлебными крошками объединяются в одну ячейку в которой выводятся хлебные крошки.
 * @variant cell ячейки строки с хлебными крошками не объединяются, выводятся в соответствии с заданной конфигурацией колонок. При таком режиме прикладной разработчик может задать кастомное содержимое для ячеек строки с хлебными крошками.
 */
export type TBreadcrumbsMode = 'row' | 'cell';

/**
 * Интерфейс описывающий опции рендера результатов поиска.
 * @private
 */
export interface ISearchBreadcrumbsTreeGridViewProps extends IGridViewProps {
    /**
     * Пользовательский шаблон отображения элемента с хлебными крошками в {@link Controls/treeGrid:View дереве с колонками} при {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/view-mode/#search режиме поиска}.
     * Внимание! Данная опция работает только в режиме совместимости и в будущем будет удалена. {@link https://n.sbis.ru/article/3a0ccfd3-35e0-49e6-952a-ccb128d2f21e Спецификация по внешнему виду результатов поиска} предполагает только стандартный платформенный вид крошек.
     * Если вам необходимо выводить крошки как-то иначе, это необходимо согласовать со стандартами.
     * @cfg {TemplateFunction|String}
     * @default undefined
     * @remark
     * По умолчанию используется базовый шаблон "Controls/searchBreadcrumbsGrid:SearchBreadcrumbsItemTemplate"
     */
    searchBreadCrumbsItemTemplate?: React.ReactElement;

    /**
     * Отображение хлебных крошек в таблице в режиме поиска - в объединённой ячейке или в несколько ячеек.
     * @cfg {TBreadcrumbsMode}
     * @default row
     */
    breadCrumbsMode?: TBreadcrumbsMode;

    // Костыль для explorer
    _initBreadCrumbsMode?: TBreadcrumbsMode;
}

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

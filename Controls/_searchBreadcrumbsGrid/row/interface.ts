import * as React from 'react';
import { IGridViewProps } from 'Controls/grid';

/**
 * Интерфейс описывающий опции рендера результатов поиска.
 * @private
 */
export interface ISearchBreadcrumbsTreeGridRowComponentProps extends IGridViewProps {
    /**
     * Пользовательский шаблон отображения элемента с хлебными крошками в {@link Controls/treeGrid:View дереве с колонками} при {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/view-mode/#search режиме поиска}.
     * @cfg {TemplateFunction|String}
     * @default undefined
     * @remark
     * По умолчанию используется базовый шаблон "Controls/searchBreadcrumbsGrid:SearchBreadcrumbsItemTemplate"
     */
    searchBreadCrumbsItemTemplate: React.ReactElement;
}

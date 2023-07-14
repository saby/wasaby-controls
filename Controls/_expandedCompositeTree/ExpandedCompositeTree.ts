/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { TemplateFunction } from 'UI/Base';

import { View as BaseView } from 'Controls/tree';
import ExpandedCompositeTreeView from './ExpandedCompositeTreeView';
import ExpandedCompositeTreeControl from './ExpandedCompositeTreeControl';

import 'css!Controls/expandedCompositeTree';

/**
 * Контрол "Развернутое составное дерево" для отображения иерархии в развернутом виде и установке режима отображения элементов на каждом уровне вложенности
 *
 * @public
 */
export class View extends BaseView {
    protected _viewName: TemplateFunction = ExpandedCompositeTreeView;
    protected _viewTemplate: TemplateFunction = ExpandedCompositeTreeControl;

    protected _getModelConstructor(): string {
        return 'Controls/expandedCompositeTree:Collection';
    }

    static getDefaultOptions(): object {
        return {
            compositeNodesLevel: 3,
            loadNodeOnScroll: false,
            expandedItems: [null],
        };
    }
}

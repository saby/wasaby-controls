/**
 * @kaizen_zone 85fa96d3-2240-448c-8ebb-e69dbcb05d63
 */
import { TemplateFunction } from 'UI/Base';

import { View as BaseView } from 'Controls/tree';
import ExpandedCompositeTreeView from './ExpandedCompositeTreeView';
import ExpandedCompositeTreeControl from './ExpandedCompositeTreeControl';
import NodeItemTemplate from './render/CompositeItem';

import 'css!Controls/expandedCompositeTree';
import { IExpandedCompositeTree } from 'Controls/_expandedCompositeTree/interface/IExpandedCompositeTree';

/**
 * Контрол "Развернутое составное дерево" для отображения иерархии в развернутом виде и установке режима отображения элементов на каждом уровне вложенности
 * @implements Controls/expandedCompositeTree:IExpandedCompositeTree
 * @public
 */
export class View extends BaseView<IExpandedCompositeTree> {
    protected _viewName: TemplateFunction = ExpandedCompositeTreeView;
    protected _viewTemplate: TemplateFunction = ExpandedCompositeTreeControl;

    protected _getModelConstructor(): string {
        return 'Controls/expandedCompositeTree:Collection';
    }

    static getDefaultOptions(): object {
        return {
            compositeNodesLevel: 3,
            loadNodeOnScroll: false,
            itemTemplate: NodeItemTemplate,
        };
    }
}

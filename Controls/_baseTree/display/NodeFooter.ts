/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { Model } from 'Types/entity';
import TreeItem from './TreeItem';

export default class NodeFooter extends TreeItem {
    get Markable(): boolean {
        return false;
    }
    readonly Fadable: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly SupportItemActions: boolean = false;

    get node(): TreeItem<Model> {
        return this.getNode();
    }

    getNode(): TreeItem<Model> {
        return this.getParent();
    }
}

Object.assign(NodeFooter.prototype, {
    '[Controls/display:NodeFooter]': true,
    _moduleName: 'Controls/display:NodeFooter',
    _instancePrefix: 'tree-node-footer-',
});

/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { Model } from 'Types/entity';
import TreeItem from './TreeItem';

/**
 * Запись подвала узла в коллекции.
 * @private
 */
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

    /**
     * Возвращает родительский узел
     */
    getNode(): TreeItem<Model> {
        return this.getParent();
    }
}

Object.assign(NodeFooter.prototype, {
    '[Controls/display:NodeFooter]': true,
    _moduleName: 'Controls/display:NodeFooter',
    _instancePrefix: 'tree-node-footer-',
});

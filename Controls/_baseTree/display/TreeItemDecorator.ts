/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import TreeItem from './TreeItem';
import BreadcrumbsItem from './BreadcrumbsItem';
import Tree from './Tree';
import { IGroupNode } from 'Controls/display';

export interface IOptions<T> {
    source: TreeItem<T>;
    parent?: TreeItem<T> | BreadcrumbsItem<T>;
    multiSelectVisibility: string;
    multiSelectAccessibilityProperty: string;
}

/**
 * Tree item which is just a decorator for another one
 * @class Controls/_baseTree/TreeItemDecorator
 * @extends Controls/_display/TreeItem
 * @private
 */
export default class TreeItemDecorator<T> extends TreeItem<T> implements IGroupNode {
    protected _$source: TreeItem<T>;

    constructor(options?: IOptions<T>) {
        super({
            contents: options?.source?.contents,
            multiSelectVisibility: options?.multiSelectVisibility,
            multiSelectAccessibilityProperty: options?.multiSelectAccessibilityProperty,
        });
        this._$source = options?.source;
        this._$parent = options?.parent;
    }

    getSource(): TreeItem<T> {
        return this._$source;
    }

    // region CollectionItem

    getOwner(): Tree<T> {
        return this._$source && this._$source.getOwner();
    }

    setOwner(owner: Tree<T>): void {
        return this._$source && this._$source.setOwner(owner);
    }

    getContents(): T {
        return this._$source && this._$source.getContents();
    }

    setContents(contents: T, silent?: boolean): void {
        return this._$source && this._$source.setContents(contents, silent);
    }

    getUid(): string {
        return this._$source && this._$source.getUid();
    }

    isSelected(): boolean {
        return this._$source && this._$source.isSelected();
    }

    setSelected(selected: boolean, silent?: boolean): void {
        return this._$source && this._$source.setSelected(selected, silent);
    }

    isEditing(): boolean {
        return this._$source && this._$source.isEditing();
    }

    setEditing(editing: boolean, editingContents?: T, silent?: boolean): void {
        if (this._$source) {
            this._$source.setEditing(editing, editingContents, silent);
        }
    }

    acceptChanges(): void {
        if (this._$source) {
            this._$source.acceptChanges();
        }
    }

    // endregion

    // region TreeItem

    getRoot(): TreeItem<T> {
        return this._$source && this._$source.getRoot();
    }

    isRoot(): boolean {
        return this._$source && this._$source.isRoot();
    }

    isNode(): boolean {
        return this._$source && this._$source.isNode();
    }

    isExpanded(): boolean {
        return this._$source && this._$source.isExpanded();
    }

    setExpanded(expanded: boolean, silent?: boolean): void {
        return this._$source && this._$source.setExpanded(expanded, silent);
    }

    toggleExpanded(): void {
        return this._$source && this._$source.toggleExpanded();
    }

    hasChildren(): boolean {
        return this._$source && this._$source.hasChildren();
    }

    getChildrenProperty(): string {
        return this._$source && this._$source.getChildrenProperty();
    }

    isGroupNode(): boolean {
        return this._$source && this._$source.isGroupNode();
    }

    // endregion
}

Object.assign(TreeItemDecorator.prototype, {
    '[Controls/_baseTree/TreeItemDecorator]': true,
    _moduleName: 'Controls/display:TreeItemDecorator',
    _$source: undefined,
});

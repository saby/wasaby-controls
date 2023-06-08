/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import {
    CollectionItem,
    ICollectionItemOptions,
    ICollectionSerializableState as ICollectionItemSerializableState,
    IGroupNode,
    ExpandableMixin,
    IExpandableMixinOptions,
} from 'Controls/display';
import Tree from './Tree';
import TreeChildren from './TreeChildren';
import {
    TExpanderIconSize,
    TExpanderIconStyle,
    TExpanderPaddingVisibility,
} from './interface/ITree';
import { TBackgroundStyle, TSize } from 'Controls/interface';
import { mixin, object } from 'Types/util';
import { TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { TExpanderPosition, TExpanderVisibility } from '../interface/ITree';

export interface IOptions<T extends Model>
    extends ICollectionItemOptions<T>,
        IExpandableMixinOptions {
    owner?: Tree<T>;
    nodeProperty?: string;
    childrenProperty?: string;
    hasChildrenProperty?: string;
    hasChildren?: boolean;
    loaded?: boolean;
    parent?: TreeItem<T>;
}

export interface IHasMore {
    forward: boolean;
    backward: boolean;
}

interface ISerializableState<T> extends ICollectionItemSerializableState<T> {
    $options: IOptions<T>;
}

/**
 * Элемент древовидной коллеции
 * @extends Controls/_display/CollectionItem
 * @mixes Controls/display:ExpandableMixin
 * @public
 */
export default class TreeItem<T extends Model = Model>
    extends mixin<CollectionItem<any>, ExpandableMixin>(
        CollectionItem,
        ExpandableMixin
    )
    implements IGroupNode
{
    readonly GroupNodeItem: boolean = false;

    protected _$owner: Tree<T>;

    /**
     * Родительский узел
     */
    protected _$parent: TreeItem<T>;

    protected _$nodeProperty: string;

    /**
     * Есть ли дети у узла исходя из рекордсета.
     */
    protected _$hasChildrenByRecordSet: boolean;

    /**
     * Название свойства, содержащего дочерние элементы узла. Используется для анализа на наличие дочерних элементов.
     */
    protected _$childrenProperty: string;

    protected _$hasChildrenProperty: string;

    /**
     * Признак, означающий что нужно отрисовать отступ под экспандер
     * @private
     */
    private _$displayExpanderPadding: boolean;

    private _$expanderPosition: TExpanderPosition;

    /**
     * Размер иконки разворота узла
     */
    protected _$expanderIconSize: TExpanderIconSize;

    /**
     * Стиль цвета иконки разворота узла
     */
    protected _$expanderIconStyle: TExpanderIconStyle;

    protected _$withoutLevelPadding: boolean;

    /**
     * Признак, означающий что в узле можно еще подгрузить данные
     * @protected
     */
    protected _$hasMore: IHasMore;
    // TODO должен быть указан парвильный тип, но сейчас футеры есть только в триГриде
    //  и если указать типом TreeGridNodeFooterRow, то будет неправильная зависимость

    private _nodeFooter: TreeItem;

    private _nodeHeader: TreeItem;
    /**
     * Признак, что узел является целью при перетаскивании
     * @private
     */
    private _isDragTargetNode: boolean = false;

    constructor(options: IOptions<T>) {
        super(options);
        ExpandableMixin.call(this);
    }

    // region Public methods

    getOwner(): Tree<T> {
        return super.getOwner() as Tree<T>;
    }

    setOwner(owner: Tree<T>): void {
        super.setOwner(owner);
    }

    /**
     * Возвращает родительский узел
     */
    getParent(): TreeItem<T> {
        return this._$parent as TreeItem<T>;
    }

    /**
     * Устанавливает родительский узел
     * @param parent Новый родительский узел
     */
    setParent(parent: TreeItem<T>): void {
        if (this._$parent !== parent) {
            this._$parent = parent;
            this._nextVersion();
        }
    }

    /**
     * Возвращает корневой элемент дерева
     */
    getRoot(): TreeItem<T> {
        const parent = this.getParent();
        if (parent === this) {
            return;
        }
        return parent ? parent.getRoot() : this;
    }

    /**
     * Является ли корнем дерева
     */
    isRoot(): boolean {
        return !this.getParent();
    }

    /**
     * Возвращает уровень вложенности относительно корня
     */
    getLevel(): number {
        // If this is not a root then increase parent's level
        const parent = this._$parent;
        if (parent) {
            let parentLevel = 0;
            if (parent instanceof TreeItem) {
                parentLevel = parent.getLevel();
            } else if (parent['[Controls/_baseTree/BreadcrumbsItem]']) {
                parentLevel = parent.getLevel();
            }
            return parentLevel + 1;
        }

        // If this is a root then get its level from owner
        const owner = this.getOwner();
        return owner ? owner.getRootLevel() : 0;
    }

    /**
     *
     * Возвращает признак, является ли элемент узлом
     * TODO нужен параметр или метод, который будет возвращать для узлов и скрытых узлов true, а для листьев false. Сейчас листья это null
     * @remark true - узел, false - 'скрытый' узел, null - лист
     */
    isNode(): boolean | null {
        if (this.isRoot()) {
            return true;
        }
        if (!this.contents) {
            return null;
        }
        const isNode = this.contents.get
            ? this.contents.get(this.getNodeProperty())
            : this.contents[this.getNodeProperty()];
        return isNode === undefined ? null : isNode;
    }

    getNodeProperty(): string {
        return this._$nodeProperty;
    }

    /**
     * Возвращает признак, является ли элемент узлом-группой
     */
    isGroupNode(): boolean {
        return false;
    }

    /**
     * Устанавливаем признак, что узел является целью при перетаскивании
     * @param isTarget Является ли узел целью при перетаскивании
     */
    setDragTargetNode(isTarget: boolean): void {
        if (this._isDragTargetNode !== isTarget) {
            this._isDragTargetNode = isTarget;
            this._nextVersion();
        }
    }

    /**
     * Возвращает признак, что узел является целью при перетаскивании
     */
    isDragTargetNode(): boolean {
        return this._isDragTargetNode;
    }

    /**
     * Возвращает признак наличия детей у узла
     */
    hasChildren(): boolean {
        // hasChildren могут менять динамически, поэтому нужно брать его всегда из рекорда,
        // т.к. это дешевле, чем отслеживать изменение и изменять состояние итема

        let hasChildren = object.getPropertyValue<boolean>(
            this.getContents(),
            this.getHasChildrenProperty()
        );

        // Если hasChildren не задали, то для свернутого узла по дефолту есть дети
        // Для развернутого узла смотрим по кол-во детей
        if (hasChildren === undefined) {
            hasChildren = this.isExpanded()
                ? !!this.getChildren().getCount()
                : this.isNode() !== null;
        }

        return hasChildren;
    }

    getHasChildrenProperty(): string {
        return this._$hasChildrenProperty;
    }

    setHasChildrenProperty(hasChildrenProperty: string): void {
        if (this._$hasChildrenProperty !== hasChildrenProperty) {
            this._$hasChildrenProperty = hasChildrenProperty;
            this._nextVersion();
        }
    }

    hasChildrenByRecordSet(): boolean {
        return this._$hasChildrenByRecordSet;
    }

    /**
     * Устанавливает признак наличия детей у узла, посчитанный по рекордсету
     */
    setHasChildrenByRecordSet(value: boolean): boolean {
        const changed = this._$hasChildrenByRecordSet !== value;
        if (changed) {
            this._$hasChildrenByRecordSet = value;
            this._nextVersion();
        }
        return changed;
    }

    /**
     * Возвращает название свойства, содержащего дочерние элементы узла
     */
    getChildrenProperty(): string {
        return this._$childrenProperty;
    }

    /**
     * Возвращает коллекцию потомков элемента коллекции
     * @param [withFilter=true] Учитывать {@link Controls/display:Collection#setFilter фильтр}
     */
    getChildren(withFilter: boolean = true): TreeChildren<T> {
        return this.getOwner().getChildren(this, withFilter);
    }

    /**
     * Возвращает последний дочерний элемент для текущего
     */
    getLastChildItem(): TreeItem<T> {
        const children = this.getChildren();
        return children.at(children.getCount() - 1);
    }

    getHasMoreStorage(): IHasMore {
        return this._$hasMore;
    }

    hasMoreStorage(direction: string): boolean {
        return this._$hasMore[direction];
    }

    setHasMoreStorage(hasMore: IHasMore): void {
        const hasChanges =
            this._$hasMore.forward !== hasMore.forward ||
            this._$hasMore.backward !== hasMore.backward;
        if (hasChanges) {
            if (this._$hasMore.forward !== hasMore.forward) {
                const nodeFooter = this.getNodeFooter();
                if (nodeFooter) {
                    nodeFooter.setHasMoreStorage(hasMore);
                }
            }

            if (this._$hasMore.backward !== hasMore.backward) {
                const nodeHeader = this.getNodeHeader();
                if (nodeHeader) {
                    nodeHeader.setHasMoreStorage(hasMore);
                }
            }

            this._$hasMore = hasMore;
            this._nextVersion();
        }
    }

    setNodeFooter(nodeFooter: TreeItem): void {
        this._nodeFooter = nodeFooter;
    }

    getNodeFooter(): TreeItem {
        return this._nodeFooter;
    }

    setNodeHeader(nodeHeader: TreeItem): void {
        this._nodeHeader = nodeHeader;
    }

    getNodeHeader(): TreeItem {
        return this._nodeHeader;
    }

    getNodeFooterTemplate(): TemplateFunction {
        return this.getOwner().getNodeFooterTemplate();
    }

    // region Expandable

    shouldDisplayExpanderBlock(
        expanderPaddingVisibility: TExpanderPaddingVisibility
    ): boolean {
        // В этом случае нужно expanderBlock показывать тоже всегда, чтобы внутри него нарисовать паддинг
        if (expanderPaddingVisibility === 'visible') {
            return true;
        }

        return this.getExpanderVisibility() === 'hasChildren'
            ? this._$owner.hasNodeWithChildren()
            : this._$owner.hasNode();
    }

    getExpanderPosition(): TExpanderPosition {
        return this._$expanderPosition;
    }

    setExpanderPosition(position: TExpanderPosition) {
        this._$expanderPosition = position;
        this._nextVersion();
    }

    getExpanderVisibility(): TExpanderVisibility {
        return this._$owner.getExpanderVisibility();
    }

    getExpanderIcon(expanderIcon?: string): string {
        return expanderIcon || this._$owner.getExpanderIcon();
    }

    getExpanderSize(expanderSize?: TSize): TSize {
        return expanderSize || this._$owner.getExpanderSize();
    }

    setExpanderIconSize(expanderIconSize: TExpanderIconSize): void {
        if (this._$expanderIconSize !== expanderIconSize) {
            this._$expanderIconSize = expanderIconSize;
            this._nextVersion();
        }
    }

    setWithoutLevelPadding(withoutLevelPadding: boolean): void {
        if (this._$withoutLevelPadding !== withoutLevelPadding) {
            this._$withoutLevelPadding = withoutLevelPadding;
            this._nextVersion();
        }
    }

    getWithoutLevelPadding(withoutLevelPadding: boolean): boolean {
        return withoutLevelPadding || this._$withoutLevelPadding;
    }

    getWithoutExpanderPadding(withoutExpanderPadding: boolean): boolean {
        return withoutExpanderPadding;
    }

    setExpanderIconStyle(expanderIconStyle: TExpanderIconStyle): void {
        if (this._$expanderIconStyle !== expanderIconStyle) {
            this._$expanderIconStyle = expanderIconStyle;
            this._nextVersion();
        }
    }

    getExpanderIconSize(
        expanderIconSize?: TExpanderIconSize
    ): TExpanderIconSize {
        return expanderIconSize || this._$expanderIconSize;
    }

    getExpanderIconStyle(
        expanderIconStyle?: TExpanderIconStyle
    ): TExpanderIconStyle {
        return expanderIconStyle || this._$expanderIconStyle;
    }

    setDisplayExpanderPadding(displayExpanderPadding: boolean): void {
        if (this._$displayExpanderPadding !== displayExpanderPadding) {
            this._$displayExpanderPadding = displayExpanderPadding;
            this._nextVersion();
        }
    }

    // endregion Expandable

    getWrapperClasses(
        templateHighlightOnHover: boolean = true,
        cursor: string = 'pointer',
        backgroundColorStyle?: TBackgroundStyle,
        templateHoverBackgroundStyle?: TBackgroundStyle,
        showItemActionsOnHover: boolean = true
    ): string {
        let classes = super.getWrapperClasses(
            templateHighlightOnHover,
            cursor,
            backgroundColorStyle,
            templateHoverBackgroundStyle,
            showItemActionsOnHover
        );

        // explorer может отображать иерархию используя ListView
        if (this.isDragTargetNode()) {
            classes += ' controls-TreeGridView__dragTargetNode';
            classes += ' controls-TreeGridView__dragTargetNode_first';
            classes += ' controls-TreeGridView__dragTargetNode_last';
        }

        return classes;
    }

    // region SerializableMixin

    _getSerializableState(
        state: ICollectionItemSerializableState<T>
    ): ISerializableState<T> {
        const resultState = super._getSerializableState(
            state
        ) as ISerializableState<T>;

        // It's too hard to serialize context related method. It should be restored at class that injects this function.
        if (typeof resultState.$options.parent === 'function') {
            delete resultState.$options.parent;
        }

        return resultState;
    }

    _setSerializableState(state: ISerializableState<T>): Function {
        const fromSuper = super._setSerializableState(state);
        return function (): void {
            fromSuper.call(this);
        };
    }

    // endregion

    // region Protected methods

    /**
     * Генерирует событие у владельца об изменении свойства элемента.
     * Помимо родительской коллекции уведомляет также и корневой узел дерева.
     * @param property Измененное свойство
     * @protected
     */
    protected _notifyItemChangeToOwner(property: string): void {
        super._notifyItemChangeToOwner(property);

        const root = this.getRoot();
        const rootOwner = root ? root.getOwner() : undefined;
        if (rootOwner && rootOwner !== this._$owner) {
            rootOwner.notifyItemChange(this, property);
        }
    }

    // endregion
}

Object.assign(TreeItem.prototype, {
    '[Controls/_display/TreeItem]': true,
    _moduleName: 'Controls/display:TreeItem',
    _$parent: undefined,
    _$nodeProperty: null,
    _$hasChildrenByRecordSet: false,
    _$childrenProperty: '',
    _$hasChildrenProperty: '',
    _$hasMore: {
        forward: false,
        backward: false,
    },
    _$displayExpanderPadding: false,
    _$expanderPosition: 'default',
    _$expanderIconSize: 'default',
    _$expanderIconStyle: 'default',
    _$withoutLevelPadding: false,
    _instancePrefix: 'tree-item-',
});

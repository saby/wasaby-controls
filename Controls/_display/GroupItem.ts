/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import CollectionItem, { IOptions as ICollectionItemOptions } from './CollectionItem';
import ExpandableMixin, { IOptions as IExpandableMixinOptions } from './ExpandableMixin';
import { mixin } from 'Types/util';
import { TemplateFunction } from 'UI/Base';
import GroupMixin from './GroupMixin';
import { groupConstants } from './itemsStrategy/Group';
import { TBackgroundStyle } from 'Controls/interface';

interface IOptions<T> extends ICollectionItemOptions<T>, IExpandableMixinOptions {}

/**
 * Элемент коллекции "Группа"
 * @extends Controls/_display/CollectionItem
 * @mixes Controls/display:ExpandableMixin
 * @public
 */
export default class GroupItem<T = string> extends mixin<
    CollectionItem<any>,
    ExpandableMixin,
    GroupMixin
>(CollectionItem, ExpandableMixin, GroupMixin) {
    readonly EditableItem: boolean = false;
    readonly '[Controls/_display/GroupItem]': true;

    get Markable(): boolean {
        return false;
    }

    readonly VirtualEdgeItem: boolean = false;
    readonly Fadable: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = true;
    readonly DraggableItem: boolean = false;
    readonly SupportItemActions: boolean = false;
    readonly ActivatableItem: boolean = !this.isHiddenGroup();

    protected _$multiSelectVisibility: string;

    readonly listElementName: string = 'group';

    constructor(options?: IOptions<T>) {
        super(options);
        ExpandableMixin.initMixin(this);
    }

    get key(): T {
        return this._$contents;
    }

    isHiddenGroup(): boolean {
        return this._$contents === groupConstants.hiddenGroup;
    }

    setMultiSelectVisibility(multiSelectVisibility: string): boolean {
        const multiSelectVisibilityUpdated = this._$multiSelectVisibility !== multiSelectVisibility;
        if (multiSelectVisibilityUpdated) {
            this._$multiSelectVisibility = multiSelectVisibility;
            this._nextVersion();
            return true;
        }
        return false;
    }

    getGroupPaddingClasses(side: 'left' | 'right'): string {
        if (side === 'left') {
            const spacing = this.getOwner().getLeftPadding().toLowerCase();
            const hasMultiSelect = this._isDefaultRenderMultiSelect();
            return `controls-ListView__groupContent__leftPadding_${
                hasMultiSelect ? 'withCheckboxes' : spacing
            }`;
        } else {
            const spacing = this.getOwner().getRightPadding().toLowerCase();
            return `controls-ListView__groupContent__rightPadding_${spacing}`;
        }
    }

    getTemplate(
        itemTemplateProperty: string,
        userItemTemplate: TemplateFunction | string,
        userGroupTemplate?: TemplateFunction | string
    ): TemplateFunction | string {
        return userGroupTemplate || 'Controls/listRender:groupTemplate';
    }

    setExpanded(expanded: boolean, silent?: boolean): void {
        super.setExpanded(expanded, silent);
        this._nextVersion();
    }

    isSticked(): boolean {
        return this._$owner.isStickyGroup() && !this.isHiddenGroup();
    }

    // TODO Убрать после https://online.sbis.ru/opendoc.html?guid=b8c7818f-adc8-4e9e-8edc-ec1680f286bb
    isIosZIndexOptimized(): boolean {
        return false;
    }

    getItemTemplateOptions(): object {
        const itemTemplateOptions = { ...super.getItemTemplateOptions() };
        if (itemTemplateOptions && this.getGroupViewMode() !== 'titledBlocks') {
            delete itemTemplateOptions.backgroundColorStyle;
        }
        return itemTemplateOptions;
    }

    getBackgroundStyle(): TBackgroundStyle {
        // В случае titledBlocks забираем цвет от items
        if (this._$owner.getGroupViewMode() === 'titledBlocks') {
            const options = this.getItemTemplateOptions();
            if (options?.backgroundColorStyle) {
                return options.backgroundColorStyle;
            }
        }
        return super.getBackgroundStyle();
    }
}

Object.assign(GroupItem.prototype, {
    '[Controls/_display/GroupItem]': true,
    _moduleName: 'Controls/display:GroupItem',
    _instancePrefix: 'group-item-',
    _$multiSelectVisibility: null,
});

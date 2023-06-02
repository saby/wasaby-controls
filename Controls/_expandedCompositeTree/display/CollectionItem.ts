/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { TreeItem } from 'Controls/baseTree';
import { Model } from 'Types/entity';

export const MODULE_NAME = 'Controls/expandedCompositeTree:CollectionItem';

export default class CollectionItem<
    T extends Model = Model
> extends TreeItem<T> {
    readonly EditableItem: boolean = true;
    readonly DisplayItemActions: boolean = true;
    readonly DisplaySearchValue: boolean = false;
    get Markable(): boolean {
        return false;
    }
    readonly SelectableItem: boolean = true;
    readonly EnumerableItem: boolean = true;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly DraggableItem: boolean = false;

    readonly listInstanceName: string = 'controls-ExpandedCompositeTree';
    readonly listElementName: string = 'item';

    protected _getSpacingClasses(): string {
        let classes = '';
        const topSpacing = this.getOwner().getTopPadding().toLowerCase();
        const bottomSpacing = this.getOwner().getBottomPadding().toLowerCase();
        const rightSpacing = this.getOwner().getRightPadding().toLowerCase();
        const leftSpacing = this.getOwner().getLeftPadding().toLowerCase();
        if (topSpacing === 'default') {
            classes += ` controls-ListView__item_${this.getStyle()}-topPadding_${topSpacing}`;
        } else {
            classes += ` controls-padding_top-${topSpacing}`;
        }
        if (bottomSpacing === 'default') {
            classes += ` controls-ListView__item_${this.getStyle()}-bottomPadding_${bottomSpacing}`;
        } else {
            classes += ` controls-padding_bottom-${bottomSpacing}`;
        }
        if (rightSpacing === 'default') {
            classes += ` controls-ListView__item_${this.getStyle()}-rightPadding_${rightSpacing}`;
        } else {
            classes += ` controls-padding_right-${rightSpacing}`;
        }
        if (leftSpacing === 'default') {
            classes += ` controls-ListView__item_${this.getStyle()}-leftPadding_${leftSpacing}`;
        } else {
            classes += ` controls-padding_left-${leftSpacing}`;
        }
        return classes;
    }
}

Object.assign(CollectionItem.prototype, {
    '[Controls/expandedCompositeTree:CollectionItem]': true,
    '[Controls/_display/TreeItem]': true,
    _moduleName: MODULE_NAME,
    _$searchValue: '',
    _instancePrefix: 'ect-item-',
    _$hasStickyGroup: false,
});

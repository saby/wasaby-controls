/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { TreeItem } from 'Controls/baseTree';
import { Model } from 'Types/entity';

export const MODULE_NAME = 'Controls/expandedCompositeTree:PseudoParentCollectionItem';

export default class CollectionItem<T extends Model = Model> extends TreeItem<T> {
    readonly EditableItem: boolean = false;
    readonly DisplayItemActions: boolean = false;
    readonly SupportItemActions: boolean = false;
    readonly DisplaySearchValue: boolean = false;
    readonly VirtualEdgeItem: boolean = false;
    get Markable(): boolean {
        return false;
    }
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly ActivatableItem: boolean = false;

    readonly listInstanceName: string = 'controls-ExpandedCompositeTree';
    readonly listElementName: string = 'pseudo-parent-item';

    getWrapperClasses(): string {
        return 'controls-ListView__itemV ws-hidden';
    }
}

Object.assign(CollectionItem.prototype, {
    '[Controls/expandedCompositeTree:PseudoParentCollectionItem]': true,
    '[Controls/_display/TreeItem]': true,
    _moduleName: MODULE_NAME,
    _$searchValue: '',
    _instancePrefix: 'ect-pseudo-parent-item-',
    _$hasStickyGroup: false,
});

/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { TemplateFunction } from 'UI/Base';
import TreeItem from './TreeItem';
import { IOptions } from './Tree';
import { register } from 'Types/di';
import { IGroupNode, IItemPadding } from 'Controls/display';

import { Model } from 'Types/entity';

export default class RootSeparatorItem<T extends Model = Model>
    extends TreeItem<T>
    implements IGroupNode
{
    readonly '[Controls/_display/SearchSeparator]': boolean = true;
    readonly '[Controls/_baseTree/display/RootSeparatorItem]': boolean = true;

    readonly EditableItem: boolean = false;
    readonly Markable: boolean = false;
    readonly Fadable: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly SupportItemActions: boolean = false;
    readonly GroupNodeItem: boolean = false;

    protected _$template: TemplateFunction | string;

    protected _$height: 'default' | 'auto';

    protected _$itemPadding: IItemPadding;

    protected _instancePrefix: 'root-separator-item-';

    constructor(options?: IOptions<T>) {
        super(options);
    }

    getTemplate(
        itemTemplateProperty: string,
        userTemplate: TemplateFunction | string
    ): TemplateFunction | string {
        return this._$template || userTemplate;
    }

    // region TreeItem

    getContents(): string {
        return 'root-separator';
    }

    getUid(): string {
        return 'searchSeparator';
    }

    isEditing(): boolean {
        return false;
    }

    isActive(): boolean {
        return false;
    }

    isMarked(): boolean {
        return false;
    }

    isSelected(): boolean {
        return false;
    }

    isSwiped(): boolean {
        return false;
    }

    getLevel(): number {
        return 0;
    }

    isGroupNode(): boolean {
        return false;
    }

    isVisibleCheckbox(): boolean {
        return false;
    }

    isLastItem(): boolean {
        return false;
    }

    // endregion

    getWrapperClasses(): string {
        let className =
            'controls-ListView__itemV controls-TileView__searchSeparator_wrapper';
        if (this._$height !== 'auto') {
            className +=
                ' controls-TileView__searchSeparator_wrapper_height-default';
        }
        if (this._$itemPadding?.bottom) {
            className += ` controls-padding_bottom-${this._$itemPadding.bottom}`;
        }
        return className;
    }
}

Object.assign(RootSeparatorItem.prototype, {
    '[Controls/_display/SearchSeparator]': true,
    '[Controls/_baseTree/display/RootSeparatorItem]': true,
    _moduleName: 'Controls/baseTree:RootSeparatorItem',
    _$source: undefined,
    _$template: null,
    _$height: 'default',
    _$itemPadding: null,
});

register('Controls/baseTree:RootSeparatorItem', RootSeparatorItem, {
    instantiate: false,
});

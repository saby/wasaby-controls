/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
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
    get Markable(): boolean {
        return false;
    }
    readonly Fadable: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly SupportItemActions: boolean = false;
    readonly GroupNodeItem: boolean = false;
    readonly ActivatableItem: boolean = false;

    protected _$template: TemplateFunction | string;

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

    getUid(): string {
        return `searchSeparator-${this.getContents()}`;
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
            'controls-ListView__itemV controls-TileView__searchSeparator_wrapper' +
            ' controls-TileView__searchSeparator_wrapper_height-default';
        if (this._$leftPadding) {
            className += ` controls-padding_left-${this._$leftPadding}`;
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
});

register('Controls/baseTree:RootSeparatorItem', RootSeparatorItem, {
    instantiate: false,
});

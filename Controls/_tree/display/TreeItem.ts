/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { mixin } from 'Types/util';
import { TMarkerSize } from 'Controls/display';
import { TreeItem as DisplayTreeItem, ITreeItemOptions } from 'Controls/baseTree';
import TreeCollection from './TreeCollection';
import { Model } from 'Types/entity';
import { TBackgroundStyle } from 'Controls/interface';

export interface IOptions<T extends Model> extends ITreeItemOptions<T> {
    owner: TreeCollection<T>;
}

export default class TreeItem<T extends Model = Model> extends mixin<DisplayTreeItem<any>>(
    DisplayTreeItem
) {
    readonly EditableItem: boolean = true;
    readonly DisplayItemActions: boolean = true;
    readonly DisplaySearchValue: boolean = true;
    get Markable(): boolean {
        return true;
    }
    readonly Fadable: boolean = true;
    readonly SelectableItem: boolean = true;
    readonly EnumerableItem: boolean = true;
    readonly EdgeRowSeparatorItem: boolean = true;
    readonly DraggableItem: boolean = true;

    readonly listInstanceName: string = 'controls-Tree';

    readonly listElementName: string = 'item';

    // region Classes
    getWrapperClasses(
        templateHighlightOnHover: boolean = true,
        cursor: string = 'pointer',
        backgroundColorStyle?: TBackgroundStyle,
        templateHoverBackgroundStyle?: TBackgroundStyle,
        showItemActionsOnHover: boolean = true,
        isAdaptive?: boolean
    ): string {
        let className = super.getWrapperClasses(
            templateHighlightOnHover,
            cursor,
            backgroundColorStyle,
            templateHoverBackgroundStyle,
            showItemActionsOnHover,
            isAdaptive
        );
        className += ' controls-Tree__item';
        return className;
    }

    getContentClasses(): string {
        let classes = super.getContentClasses();
        classes += ' controls-Tree__itemContent';
        return classes;
    }

    getMarkerClasses(markerSize: TMarkerSize = 'content-xs'): string {
        const classes = `controls-ListView__itemV_marker controls-ListView__itemV_marker_size_${markerSize}`;
        return classes + super.getMarkerClasses(markerSize);
    }

    getLeftSpaceClassName(): string {
        return super._getLeftSpacingContentClasses();
    }

    protected _getLeftSpacingContentClasses(): string {
        return '';
    }
    // endregion Classes
}

Object.assign(TreeItem.prototype, {
    '[Controls/tree:TreeItem]': true,
    '[Controls/_display/TreeItem]': true,
    _moduleName: 'Controls/tree:TreeItem',
    _$searchValue: '',
    _instancePrefix: 'tree-item-',
    _$hasStickyGroup: false,
});

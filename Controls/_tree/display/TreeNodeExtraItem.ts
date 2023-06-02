/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import TreeItem from './TreeItem';

export default abstract class TreeNodeExtraItem extends TreeItem<null> {
    readonly listElementName: string = 'item';

    get Markable(): boolean {
        return false;
    }
    readonly Fadable: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly SupportItemActions: boolean = false;

    protected _$moreFontColorStyle: string;
    protected _$moreCaption: string;

    get node(): TreeItem<Model> {
        return this.getNode();
    }

    getNode(): TreeItem<Model> {
        return this.getParent();
    }

    getTemplate(): TemplateFunction | string {
        return 'Controls/tree:NodeExtraItemTemplate';
    }

    getItemClasses(): string {
        return 'controls-ListView__itemV';
    }

    getContentClasses(): string {
        return (
            super.getContentClasses() + ' controls-Tree__itemContentTreeWrapper'
        );
    }

    getMoreFontColorStyle(): string {
        return this._$moreFontColorStyle;
    }

    getMoreCaption(): string {
        return this._$moreCaption;
    }

    setMoreFontColorStyle(moreFontColorStyle: string): void {
        if (this._$moreFontColorStyle !== moreFontColorStyle) {
            this._$moreFontColorStyle = moreFontColorStyle;
            this._nextVersion();
        }
    }

    protected _getLeftSpacingContentClasses(): string {
        if (this._isDefaultRenderMultiSelect()) {
            return ' controls-ListView__itemContent_withCheckboxes';
        } else {
            return ` controls-ListView__item-leftPadding_${this.getOwner()
                .getLeftPadding()
                .toLowerCase()}`;
        }
    }

    abstract getMoreClasses(): string;
}

Object.assign(TreeNodeExtraItem.prototype, {
    _$moreFontColorStyle: null,
    _$moreCaption: null,
});

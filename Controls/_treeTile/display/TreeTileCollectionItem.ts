/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import { Model } from 'Types/entity';
import { mixin } from 'Types/util';
import {
    TileItemMixin,
    TTileItem,
    TActionMode,
    TImagePosition,
    TImageViewMode,
    ITileItemProps,
    ImageComponent,
} from 'Controls/tile';
import { ITreeItemOptions, TreeItem } from 'Controls/baseTree';
import { TemplateFunction } from 'UI/Base';
import FolderIcon from 'Controls/_treeTile/render/FolderIcon';
import { ITreeTileAspectOptions } from './TreeTileCollection';
import * as React from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Executor';

const DEFAULT_FOLDER_WIDTH = 250;

export interface ITreeTileCollectionItemOptions<S extends Model = Model>
    extends ITreeItemOptions<S>,
        ITreeTileAspectOptions {}

/**
 * Элемент коллекции, который отображается в виде иерархической плитки.
 * @private
 */
export default class TreeTileCollectionItem<
    T extends Model = Model
> extends mixin<TreeItem, TileItemMixin>(TreeItem, TileItemMixin) {
    readonly listInstanceName: string = 'controls-TreeTile';

    readonly listElementName: string = 'item';

    protected _$nodesHeight: number;

    protected _$folderWidth: number;

    getContentTemplate(
        itemType: TTileItem = 'default',
        contentTemplate?: TemplateFunction,
        nodeContentTemplate?: TemplateFunction
    ): TemplateFunction {
        if (this.isNode() && nodeContentTemplate) {
            return nodeContentTemplate;
        }
        return super.getContentTemplate(itemType, contentTemplate);
    }

    getNodesHeight(): number {
        return this._$nodesHeight;
    }

    getTileHeight(): number {
        return (
            (this.isNode() && this.getNodesHeight()) || super.getTileHeight()
        );
    }

    setNodesHeight(nodesHeight: number): void {
        if (this._$nodesHeight !== nodesHeight) {
            this._$nodesHeight = nodesHeight;
            this._nextVersion();
        }
    }

    getFolderWidth(): number {
        return this._$folderWidth;
    }

    setFolderWidth(folderWidth: number): void {
        if (this._$folderWidth !== folderWidth) {
            this._$folderWidth = folderWidth;
            this._nextVersion();
        }
    }

    getTileWidth(
        widthTpl?: number,
        imagePosition: TImagePosition = 'top',
        imageViewMode: TImageViewMode = 'rectangle'
    ): number {
        if (this.isNode() && !this.getTileSize()) {
            return widthTpl || this.getFolderWidth() || DEFAULT_FOLDER_WIDTH;
        } else {
            return super.getTileWidth(widthTpl, imagePosition, imageViewMode);
        }
    }

    getItemType(
        itemTypeTpl: TTileItem = 'default',
        nodeContentTemplate?: TemplateFunction
    ): TTileItem {
        let itemType = super.getItemType(itemTypeTpl, nodeContentTemplate);

        // Если nodeContentTemplate задан значит, что для узла используется определенный itemType
        if (itemType === 'default' && this.isNode() && !nodeContentTemplate) {
            itemType = 'small';
        }

        return itemType;
    }

    getImageTemplate(itemType: TTileItem = 'default'): ImageComponent {
        if (this.isNode() && (itemType === 'small' || itemType === 'default')) {
            return FolderIcon;
        } else {
            return super.getImageTemplate(itemType);
        }
    }

    getItemActionsClasses(
        itemType: TTileItem = 'default',
        itemActionsClass: string = ''
    ): string {
        let classes = super.getItemActionsClasses(itemType, itemActionsClass);

        if (itemType === 'preview' && this.isNode()) {
            classes += ' controls-TileView__previewTemplate_itemActions_node';
        }

        return classes;
    }

    getItemActionsControl(itemType: TTileItem = 'default'): string | undefined {
        let control = super.getItemActionsControl(itemType);
        if (itemType === 'preview') {
            control = 'Controls/treeTile:TreeTileItemActions';
        }
        return control;
    }

    getActionMode(itemType: TTileItem = 'default'): TActionMode | void {
        if (itemType === 'preview' && this.isNode()) {
            return 'strict';
        } else {
            return super.getActionMode(itemType);
        }
    }

    getActionPadding(itemType: TTileItem = 'default'): string {
        if (itemType === 'preview' && this.isNode()) {
            return '';
        } else {
            return super.getActionPadding(itemType);
        }
    }

    getItemClasses({
        itemType = 'default',
        clickable,
        hasTitle,
        cursor = 'pointer',
        shadowVisibility,
        highlightOnHover = true,
        border,
        borderStyle,
    }: ITileItemProps): string {
        let classes = super.getItemClasses.apply(this, arguments);

        if (this.isNode()) {
            classes += ' controls-TreeTileView__node';
            if (this.isDragTargetNode()) {
                classes += ' controls-TreeTileView__dragTargetNode';
            }
        }

        switch (itemType) {
            case 'default':
            case 'medium':
                break;
            case 'rich':
                break;
            case 'preview':
                if (this.isNode()) {
                    classes +=
                        ' js-controls-TileView__withoutZoom controls-TileView__previewTemplate_node';
                }
                break;
            case 'small':
                if (this.isNode()) {
                    classes = classes.replace(
                        'controls-TileView__smallTemplate_listItem',
                        'controls-TileView__smallTemplate_nodeItem'
                    );
                }
                break;
        }

        return classes;
    }

    getItemStyles({
        itemType = 'default',
        width,
        staticHeight,
        imagePosition = 'top',
        imageViewMode = 'rectangle',
        attrs = {},
    }: ITileItemProps): React.CSSProperties {
        if (this.isNode() && (itemType === 'default' || itemType === 'small')) {
            const styleProp = wasabyAttrsToReactDom(attrs).style as object;
            const widthCalculated = this.getTileWidth(
                width,
                imagePosition,
                imageViewMode
            );
            return {
                flexBasis: `${widthCalculated}px`,
                minWidth: `${widthCalculated}px`,
                height: staticHeight ? `${this.getNodesHeight()}px` : undefined,
                ...styleProp,
            };
        } else {
            return super.getItemStyles.apply(this, arguments);
        }
    }

    shouldDisplayTitle(itemType: TTileItem = 'default'): boolean {
        switch (itemType) {
            case 'default':
            case 'small':
            case 'medium':
            case 'rich':
                return super.shouldDisplayTitle(itemType);
            case 'preview':
                return super.shouldDisplayTitle(itemType) || this.isNode();
        }
    }

    getTitleClasses({
        itemType = 'default',
        titleStyle,
        hasTitle,
        titleLines = 1,
        titleColorStyle = 'default',
        titlePosition = 'underImage',
        imageViewMode = 'rectangle',
        contentPosition = 'underImage',
    }: Partial<ITileItemProps>): string {
        let classes = super.getTitleClasses({
            itemType,
            titleStyle,
            hasTitle,
            titleLines,
            titleColorStyle,
            titlePosition,
            imageViewMode,
        });

        switch (itemType) {
            case 'default':
            case 'medium':
                break;
            case 'preview':
                if (this.isNode()) {
                    classes += ' controls-fontweight-bold';
                    classes = classes.replace(
                        'controls-fontsize-m',
                        'controls-fontsize-l'
                    );
                }
                break;
            case 'small':
                break;
            case 'rich':
                if (this.isNode()) {
                    classes = classes.replace(
                        'controls-TileView__richTemplate_title_font-size',
                        'controls-TileView__richTemplate_node_title_font-size'
                    );
                }
                break;
        }

        return classes;
    }

    getTitleWrapperClasses({
        itemType = 'default',
        titleLines = 1,
        gradientType = 'dark',
        titleStyle = 'light',
        imagePosition = 'top',
        imageViewMode = 'none',
        contentPadding = 'default',
        footerTemplate = null,
        description = '',
        descriptionLines = 0,
        titlePosition = 'underImage',
        contentPosition = 'underImage',
        justifyContent = 'start',
    }: Partial<ITileItemProps>): string {
        let classes = super.getTitleWrapperClasses({
            itemType,
            titleLines,
            gradientType,
            titleStyle,
            imagePosition,
            imageViewMode,
            contentPadding,
            footerTemplate,
            description,
            descriptionLines,
            titlePosition,
            contentPosition,
            justifyContent,
        });
        switch (itemType) {
            case 'default':
            case 'medium':
                break;
            case 'preview':
                if (this.isNode()) {
                    classes += ' controls-fontweight-bold';
                    classes = classes.replace(
                        'controls-fontsize-m',
                        'controls-fontsize-l'
                    );
                }
                break;
            case 'small':
                if (this.isNode()) {
                    classes += ' controls-TileView__smallTemplate_title_node';
                }
                break;
            case 'rich':
                break;
        }

        return classes;
    }

    // region Duplicate TODO роблема с миксинами

    setActive(active: boolean, silent?: boolean): void {
        // TODO This is copied from TileViewModel, but there must be a better
        // place for it. For example, somewhere in ItemActions container
        if (!active && this.isActive() && this.isHovered()) {
            this.getOwner().setHoveredItem(null);
        }
        super.setActive(active, silent);
    }

    setHovered(hovered: boolean, silent?: boolean): void {
        if (!hovered && this.isHovered() && this.SupportItemActions) {
            this.setCanShowActions(false);
        }
        super.setHovered(hovered, silent);
    }

    getMultiSelectClasses(): string {
        let classes = this._getMultiSelectBaseClasses();
        classes +=
            ' controls-TileView__checkbox controls-TileView__checkbox_top js-controls-TileView__withoutZoom';

        return classes;
    }

    // endregion Duplicate
}

Object.assign(TreeTileCollectionItem.prototype, {
    '[Controls/_treeTile/TreeTileCollectionItem]': true,
    _moduleName: 'Controls/treeTile:TreeTileCollectionItem',
    _instancePrefix: 'tree-tile-item-',
    _$nodesHeight: null,
    _$folderWidth: null,
});

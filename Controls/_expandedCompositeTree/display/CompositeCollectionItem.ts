/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { mixin } from 'Types/util';
import { TreeItem } from 'Controls/baseTree';
import { TreeTileCollection as Collection } from 'Controls/treeTile';
import { Model } from 'Types/entity';
import { TreeTileCollection } from 'Controls/treeTile';
import * as CompositeItemTemplate from 'wml!Controls/_expandedCompositeTree/render/CompositeItemTemplate';
import * as CompositeFooter from 'wml!Controls/_expandedCompositeTree/render/CompositeFooter';

import { TreeTileView } from 'Controls/treeTile';
import { ITreeItemOptions } from 'Controls/tree';
import { TemplateFunction } from 'UI/Base';
import { ObservableList } from 'Types/collection';
import type { ICompositeViewConfig } from './Collection';
import { isEqual } from 'Types/object';
import { detection } from 'Env/Env';
import { CrudEntityKey } from 'Types/source';
import { IRenderScopeProps } from '../interface/IRenderScopeProps';

export const MODULE_NAME =
    'Controls/expandedCompositeTree:CompositeCollectionItem';

interface ICompositeCollectionItemOptions extends ITreeItemOptions<Model> {
    compositeViewConfig: ICompositeViewConfig;
    list: ObservableList<Model>;
}

export default class CompositeCollectionItem<
    T extends Model = Model
> extends mixin<TreeItem<Model>>(TreeItem) {
    readonly EditableItem: boolean = true;
    readonly DisplayItemActions: boolean = true;
    readonly DisplaySearchValue: boolean = false;
    readonly Markable: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = true;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly ActivatableItem: boolean = false;
    readonly SupportItemActions: boolean = false;

    readonly listInstanceName: string = 'controls-ExpandedCompositeTree';
    readonly listElementName: string = 'composite-item';

    protected _renderCollection: Collection;
    protected _$compositeViewConfig: ICompositeViewConfig;
    protected _$type: string;
    // Определяет, можно ли показать кнопку "Ещё" в композитном элементе.
    // Кнопка показывается в последнем композитном элементе.
    // Расчет производится в стратегии CompositeItem.
    protected _$canShowFooter: boolean;

    constructor(options: ICompositeCollectionItemOptions) {
        super(options);

        this._initializeCollection(options.list);
    }

    getList(): ObservableList<Model> {
        return this._renderCollection.getSourceCollection() as ObservableList<Model>;
    }

    getType(): string {
        return this._$type;
    }

    isVisibleChildrenItem(key: CrudEntityKey): boolean {
        return this._renderCollection.isVisibleItem(key);
    }

    private _initializeCollection(list: ObservableList<Model>): void {
        const itemPadding = {
            ...this._$compositeViewConfig?.itemPadding,
        };
        if (this._$type === 'nodes') {
            itemPadding.top = 'null';
            itemPadding.bottom = 'null';
        }
        this._renderCollection = new TreeTileCollection({
            ...this._$compositeViewConfig,
            itemPadding,
            collection: list,
            root: this.getParent().key,
            orientation: this._$type === 'nodes' ? 'horizontal' : 'vertical',
        });
    }

    private _updateRenderCollection(
        oldConfig: ICompositeViewConfig,
        newConfig: ICompositeViewConfig
    ): void {
        if (!this._renderCollection) {
            return;
        }
        if (
            oldConfig?.tileSize !== newConfig.tileSize
        ) {
            this._renderCollection.setTileSize(newConfig.tileSize);
        }
        if (
            oldConfig?.tileWidth !== newConfig.tileWidth
        ) {
            this._renderCollection.setTileWidth(newConfig.tileWidth);
        }
        if (
            oldConfig?.folderWidth !== newConfig.folderWidth
        ) {
            this._renderCollection?.setFolderWidth(
                newConfig.folderWidth
            );
        }
    }

    setCompositeViewConfig(compositeViewConfig: ICompositeViewConfig): void {
        if (!isEqual(this._$compositeViewConfig, compositeViewConfig)) {
            this._updateRenderCollection(
                this._$compositeViewConfig,
                compositeViewConfig
            );
            this._$compositeViewConfig = compositeViewConfig;
            this._nextVersion();
        }
    }

    getPaddingClasses(): string {
        let classes = 'controls-ExpandedCompositeTree-item';

        // На мобильных устройствах контейнер горизонтальной плитки должен быть без отступов, вплотную к границам экрана
        if (!(detection.isMobilePlatform && this._$type === 'nodes')) {
            const rightPadding = this.getOwner()
                .getRightPadding()
                .toLowerCase();
            const leftPadding = this.getOwner().getLeftPadding().toLowerCase();
            classes += ` controls-padding_right-${rightPadding}`;
            classes += ` controls-padding_left-${leftPadding}`;
        }
        const topPadding = this._$compositeViewConfig?.itemPadding.top;
        const bottomPadding = this._$compositeViewConfig?.itemPadding.bottom;
        classes += ` controls-padding_top-${topPadding}`;
        classes += ` controls-padding_bottom-${bottomPadding}`;

        return classes;
    }

    getTemplate(): TemplateFunction | string {
        return CompositeItemTemplate;
    }

    getRenderTemplate(): Function {
        return TreeTileView;
    }

    getRenderParams(): IRenderScopeProps {
        const rightPadding = this.getOwner().getRightPadding().toLowerCase();
        const leftPadding = this.getOwner().getLeftPadding().toLowerCase();
        const itemsContainerPadding = {
            top: 'null',
            left: 'null',
            right: 'null',
            bottom: 'null',
        };

        if (detection.isMobilePlatform && this._$type === 'nodes') {
            itemsContainerPadding.left = leftPadding;
            itemsContainerPadding.right = rightPadding;
        }

        // Вообще неочевидная тема. При загрузке вверх и курсорной навигации - с БЛ должны прилетать именно первые
        // записи текущего узла. Если записей больше, чем pageSize, то флаг наличия незагруженных данных прилетает в
        // boolean-формате и записывается в направление загрузки. В данном кейсе - в backward.
        // А рендерить кнопку "ещё" всё равно нужно. Из-за этого пришлось смотреть и на backward, хотя в целом это
        // неправильно. Оформил подзадачу на выправление логики загрузки.
        // https://online.sbis.ru/opendoc.html?guid=370b3afe-3fbc-40f3-ac11-984c2a87967e&client=3
        const isRenderFooter =
            (this.getParent().getHasMoreStorage().forward ||
                this.getParent().getHasMoreStorage().backward) &&
            this._$canShowFooter;

        const itemPadding = {
            ...this._$compositeViewConfig?.itemPadding,
        };
        if (this._$type === 'nodes') {
            itemPadding.top = 'null';
            itemPadding.bottom = 'null';
        }

        return {
            itemPadding,
            itemsContainerPadding,
            footerTemplate: isRenderFooter ? CompositeFooter : undefined,
            footerTemplateOptions: {
                itemPadding,
            },
            itemTemplate: this._$compositeViewConfig?.itemTemplate,
            itemTemplateOptions:
                this._$compositeViewConfig?.itemTemplateOptions,
            listModel: this._renderCollection,
            orientation: this._$type === 'nodes' ? 'horizontal' : 'vertical',
            itemActions: this._$compositeViewConfig?.itemActions,
            contextMenuConfig: this._$compositeViewConfig?.contextMenuConfig,
            itemActionsClass: this._$compositeViewConfig?.itemActionsClass,
            itemActionsPosition:
                this._$compositeViewConfig?.itemActionsPosition,
            itemActionsProperty:
                this._$compositeViewConfig?.itemActionsProperty,
            contextMenuVisibility:
                this._$compositeViewConfig?.contextMenuVisibility,
            itemActionVisibilityCallback:
                this._$compositeViewConfig?.itemActionVisibilityCallback,
        };
    }
}

Object.assign(CompositeCollectionItem.prototype, {
    '[Controls/expandedCompositeTree:CompositeCollectionItem]': true,
    '[Controls/_display/TreeItem]': true,
    _moduleName: MODULE_NAME,
    _$searchValue: '',
    _instancePrefix: 'ect-composite-item-',
    _$hasStickyGroup: false,
    _$compositeViewConfig: null,
    _$type: '',
    _$canShowFooter: false,
});

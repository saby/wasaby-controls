/**
 * @kaizen_zone 0905a500-8f7f-40a7-b7ab-79828ca54b5f
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Logger } from 'UI/Utils';
import { IObservable, RecordSet } from 'Types/collection';
import { isEqual } from 'Types/object';
import type { IListState } from 'Controls/dataFactory';

import { TColumns } from 'Controls/grid';
import { NewSourceController as SourceController } from 'Controls/dataSource';

import * as Template from 'wml!Controls/_listTemplates/ImageDisplay/ImageDisplayContainer';
import { object } from 'Types/util';
import { Object as EventObject } from 'Env/Event';
import { Model } from 'Types/entity';
import { TMarkerSize } from 'Controls/display';
import { TreeItem } from 'Controls/baseTree';

export type TImageCheckMode = 'all' | 'leaf';

export interface IImageDisplayContainerOptions extends IControlOptions {
    imageProperty: string;
    imagePosition: string;
    imageViewMode: string;
    imageCheckMode?: TImageCheckMode;
    nodeProperty: string;
    nodeImageViewMode: string;
    itemTemplate: TemplateFunction;
    tileItemTemplate: TemplateFunction;
    sourceController: SourceController;
    slice?: IListState;
}

/**
 * Класс используется для управления в списочных шаблонах выводом контейнера, предназначенного под изображение и
 * позволяет в случае отсутствия изображений среди загруженных записей - при выводе шаблона скрывать данный контейнер.
 * @remark
 * При использовании ImageDisplayContainer необходимо оборачивать в Controls.list:DataContainer.
 * Опции {@link Controls/tile:RichTemplate#imageViewMode imageViewMode}, {@link Controls/tile:RichTemplate#imagePosition imagePosition} и {@link Controls/tile:ITile#imageProperty imageProperty} необходимо задавать непосредственно на ImageDisplayContainer.
 * @example
 * <pre class="brush:html">
 *    <Controls.list:DataContainer
 *            displayProperty="title"
 *            navigation="{{_navigation}}"
 *            source="{{_viewSource}}">
 *        <Controls.listTemplates:ImageDisplayContainer
 *                imageProperty="image"
 *                imageViewMode="rectangle"
 *                imagePosition="left">
 *            <ws:content>
 *                <Controls.tile:View
 *                        tileMode="static"
 *                        tileWidth="350"
 *                        keyProperty="key"/>
 *            </ws:content>
 *        </Controls.listTemplates:ImageDisplayContainer>
 *    </Controls.list:DataContainer>
 * </pre>
 * @extends UI/Base:Control
 *
 * @public
 * @demo Controls-demo/tileNew/DifferentItemTemplates/ToggleImageVisible/ScrollToDown/Index
 */
export default class ImageDisplayContainer extends Control<IImageDisplayContainerOptions> {
    protected _template: TemplateFunction = Template;

    private _columns: TColumns;
    private _patchedColumns: TColumns;

    /**
     * @cfg {UI/Base:TemplateFunction} Шаблон записи, для которого будет рассчитан imageViewMode и imagePosition.
     */
    private _itemTemplate: TemplateFunction;
    private _tileItemTemplate: TemplateFunction;

    /**
     * @cfg {String} Режим отображения изображения.
     */
    protected _imageViewMode: string;

    /**
     * @cfg {String} Режим отображения изображения для узла, если контейнер оборачивает дерево.
     */
    protected _nodeImageViewMode: string;
    protected _imageProperty: string;
    protected _hasItemWithImage: boolean = false;
    private _items: RecordSet;
    private _nodeProperty: string;

    constructor(options: IImageDisplayContainerOptions, context?: object) {
        super(options, context);
        this._onCollectionChange = this._onCollectionChange.bind(this);
        this._onCollectionItemChange = this._onCollectionItemChange.bind(this);
    }

    protected _beforeMount(
        options?: IImageDisplayContainerOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        const sourceController = options.sourceController || options.slice?.sourceController;
        if (!sourceController) {
            Logger.error('ImageDisplayContainer should be child of Browser or DataContainer', this);
        }
        this._imageViewMode = options.imageViewMode;
        this._nodeImageViewMode = options.nodeImageViewMode;
        this._itemTemplate = options.itemTemplate;
        this._tileItemTemplate = options.tileItemTemplate;
        this._imageProperty = options.imageProperty;
        this._columns = options.columns;
        this._nodeProperty = options.nodeProperty || options.slice?.nodeProperty;

        const items = sourceController.getItems();
        this._updateListenOnCollectionChange(this._items, items);
        this._items = items;

        this._updateHasImage(
            this._items,
            options.imageProperty,
            options.imageCheckMode,
            this._nodeProperty
        );
    }

    protected _beforeUpdate(options?: IImageDisplayContainerOptions, contexts?: any): void {
        let needUpdateHasImage = false;

        if (this._options.imageViewMode !== options.imageViewMode) {
            this._imageViewMode = options.imageViewMode;
        }
        if (this._options.nodeImageViewMode !== options.nodeImageViewMode) {
            this._nodeImageViewMode = options.nodeImageViewMode;
        }
        if (this._options.itemTemplate !== options.itemTemplate) {
            this._itemTemplate = options.itemTemplate;
        }
        if (this._options.tileItemTemplate !== options.tileItemTemplate) {
            this._tileItemTemplate = options.tileItemTemplate;
        }

        if (!isEqual(options.columns, this._options.columns)) {
            this._columns = options.columns;
            this._patchedColumns = null;
        }

        this._nodeProperty = options.nodeProperty || options.slice?.nodeProperty;

        const sourceController = options.sourceController || options.slice?.sourceController;
        const items = sourceController.getItems();
        if (this._items !== items) {
            this._updateListenOnCollectionChange(this._items, items);
            this._items = items;
            needUpdateHasImage = true;
        }

        if (options.imageProperty !== this._options.imageProperty) {
            this._imageProperty = options.imageProperty;
            needUpdateHasImage = true;
            if (!options.imageProperty) {
                this._unsubscribeToCollectionChange(
                    this._items,
                    this._onCollectionItemChange,
                    this._onCollectionChange
                );
            }
        }

        if (options.imageCheckMode !== this._options.imageCheckMode) {
            needUpdateHasImage = true;
        }

        if (needUpdateHasImage) {
            this._updateHasImage(
                this._items,
                this._imageProperty,
                options.imageCheckMode,
                this._nodeProperty
            );
        }
    }

    protected _beforeUnmount(): void {
        this._unsubscribeToCollectionChange(
            this._items,
            this._onCollectionItemChange,
            this._onCollectionChange
        );
    }

    protected _updateHasImage(
        items: RecordSet,
        imageProperty: string,
        imageCheckMode: TImageCheckMode,
        nodeProperty: string
    ): void {
        this._resetHasItemWithImage();
        if (items) {
            this._updateDisplayImage(this._items, imageProperty, imageCheckMode, nodeProperty);
        }
    }

    /**
     * Обновляем состояние hasItemWithImage.
     * Если текущее значение false, но в новых загруженных элементах вдруг стало true, нужно актуализировать.
     * @param items RecordSet, в котором мы ищем картинку.
     * @param imageProperty Свойство записи, в котором содержится картинка.
     * @param imageCheckMode Режим проверки наличия изображений.
     * @param nodeProperty Имя поля записи, в котором хранится информация о типе элемента (лист, узел, скрытый узел).
     * @private
     */
    private _updateDisplayImage(
        items: RecordSet,
        imageProperty: string,
        imageCheckMode: TImageCheckMode,
        nodeProperty: string
    ): void {
        if (imageProperty && !this._hasItemWithImage) {
            const oldHasItemWithImage = this._hasItemWithImage;
            this._hasItemWithImage = ImageDisplayContainer._hasImage(
                items,
                imageProperty,
                imageCheckMode,
                nodeProperty
            );
            if (oldHasItemWithImage !== this._hasItemWithImage) {
                this._resetPatchedParams();
            }
        }
    }

    /**
     * Сбрасывает пропатченные колонки таблицы.
     * @protected
     */
    protected _resetPatchedParams(): void {
        this._patchedColumns = null;
    }

    private _updateListenOnCollectionChange(curItems: RecordSet, newItems: RecordSet): boolean {
        if (curItems === newItems) {
            return;
        }

        if (curItems) {
            this._unsubscribeToCollectionChange(
                curItems,
                this._onCollectionItemChange,
                this._onCollectionChange
            );
        }

        if (newItems) {
            this._subscribeToCollectionChange(
                newItems,
                this._onCollectionItemChange,
                this._onCollectionChange
            );
        }
    }

    private _subscribeToCollectionChange(items, onCollectionItemChange, onCollectionChange) {
        items.subscribe('onCollectionItemChange', onCollectionItemChange);
        items.subscribe('onCollectionChange', onCollectionChange);
    }

    private _unsubscribeToCollectionChange(items, onCollectionItemChange, onCollectionChange) {
        if (items) {
            items.unsubscribe('onCollectionItemChange', onCollectionItemChange);
            items.unsubscribe('onCollectionChange', onCollectionChange);
        }
    }

    private _resetHasItemWithImage(): void {
        this._hasItemWithImage = false;
        this._patchedColumns = null;
    }

    private _onCollectionItemChange(
        event: EventObject,
        item: Model,
        index: number,
        properties?: object
    ): void {
        // Изменение элемента, поменяли _imageProperty в записи в RecordSet.
        if (
            this._options.imageProperty &&
            typeof properties === 'object' &&
            this._options.imageProperty in properties
        ) {
            this._resetHasItemWithImage();
            this._updateDisplayImage(
                this._items,
                this._imageProperty,
                this._options.imageCheckMode,
                this._nodeProperty
            );
        }
    }

    private _onCollectionChange(event: EventObject, action: string): void {
        switch (action) {
            case IObservable.ACTION_REPLACE:
            case IObservable.ACTION_RESET:
            case IObservable.ACTION_REMOVE:
                this._resetHasItemWithImage();
                this._updateDisplayImage(
                    this._items,
                    this._imageProperty,
                    this._options.imageCheckMode,
                    this._nodeProperty
                );
                break;
            case IObservable.ACTION_ADD:
                this._updateDisplayImage(
                    this._items,
                    this._imageProperty,
                    this._options.imageCheckMode,
                    this._nodeProperty
                );
        }
    }

    /**
     * Возвращает отображение картинки для текущего элемента
     * @param item
     * @param imageCheckMode
     * @private
     */
    protected _getImageViewMode(item: TreeItem, imageCheckMode: TImageCheckMode): string {
        const imageViewMode =
            item.isNode && item.isNode() ? this._nodeImageViewMode : this._imageViewMode;
        // return (item.isNode && item.isNode()) || this._hasItemWithImage ? imageViewMode : 'none';
        return (imageCheckMode === 'leaf' && item.isNode && item.isNode()) || this._hasItemWithImage
            ? imageViewMode
            : 'none';
    }

    protected _getMarkerSize(
        item: TreeItem,
        markerSize: TMarkerSize,
        imageCheckMode: TImageCheckMode
    ): TMarkerSize {
        // Если прикладники сами передали размер, то просто отдаем его дальше
        if (!!markerSize) {
            return markerSize;
        }
        if (!item.Markable) {
            return;
        }
        const isLeaf = !item.isNode || item.isNode() === null;
        const hasImage = item.contents.get(this._imageProperty);
        const imageViewMode = this._getImageViewMode(item, imageCheckMode);
        return isLeaf && hasImage && imageViewMode !== 'none' ? 'image-l' : undefined;
    }

    private _getPatchedColumns(): TColumns {
        if (!this._columns) {
            return undefined;
        }
        if (!this._imageProperty) {
            return this._columns;
        }
        if (!this._patchedColumns) {
            this._patchedColumns = object.clonePlain(this._columns);
            this._patchedColumns.forEach((column) => {
                const templateOptions: { imageViewMode?: string } = column.templateOptions || {};
                templateOptions.imageViewMode = this._hasItemWithImage
                    ? templateOptions.imageViewMode
                    : 'none';
                column.templateOptions = templateOptions;
            });
        }
        return this._patchedColumns;
    }

    static defaultProps: Partial<IImageDisplayContainerOptions> = {
        imageCheckMode: 'all',
    };

    private static _hasImage(
        items: RecordSet,
        imageProperty: string,
        imageCheckMode: TImageCheckMode,
        nodeProperty: string
    ): boolean {
        let has = false;
        if (imageProperty) {
            const length = items.getCount();
            for (let i = 0; i < length; i++) {
                const item = items.at(i);
                // Если включен режим проверки наличия изображений только у листьев - пропускаем остальные виды записей
                if (imageCheckMode === 'leaf' && nodeProperty && item.get(nodeProperty) !== null) {
                    continue;
                }
                if (item.get(imageProperty)) {
                    has = true;
                    break;
                }
            }
        }
        return has;
    }
}

/**
 * @name Controls/listTemplates:ImageDisplayContainer#imageProperty
 * @cfg {String} Название поля записи в котором лежит ссылка на изображение.
 * @see imageCheckMode
 */

/**
 * @name Controls/listTemplates:ImageDisplayContainer#imageCheckMode
 * @cfg {String} Режим проверки наличия изображений.
 * @variant all Наличие изображений проверяется у типов записей (узел, скрытый узел, лист)
 * @variant leaf Наличие изображений проверяется только у листьев
 * @default all
 * @see imageProperty
 */

/**
 * @kaizen_zone daa99442-dd54-4dbe-a76b-215360cfb509
 */
import { IControlOptions, TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { Logger } from 'UI/Utils';
import { IObservable, RecordSet } from 'Types/collection';
import { isEqual } from 'Types/object';
import type { IListState } from 'Controls/dataFactory';

import { TColumns } from 'Controls/grid';
import { NewSourceController as SourceController } from 'Controls/dataSource';

import { object } from 'Types/util';
import { Object as EventObject } from 'Env/Event';
import { Model } from 'Types/entity';
import { TMarkerSize } from 'Controls/display';
import { TreeItem } from 'Controls/baseTree';
import { ModulesManager } from 'RequireJsLoader/conduct';
import { isLoaded as isModuleLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

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
 * При использовании ImageDisplayContainer необходимо оборачивать в Controls.listDataOld:DataContainer.
 * Опции {@link Controls/tile:RichTemplate#imageViewMode imageViewMode}, {@link Controls/tile:RichTemplate#imagePosition imagePosition} и {@link Controls/tile:ITile#imageProperty imageProperty} необходимо задавать непосредственно на ImageDisplayContainer.
 * @example
 * <pre class="brush:html">
 *    <Controls.listDataOld:DataContainer
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
 *    </Controls.listDataOld:DataContainer>
 * </pre>
 * @extends UI/Base:Control
 *
 * @public
 * @demo Controls-demo/tileNew/DifferentItemTemplates/ToggleImageVisible/ScrollToDown/Index
 */

function templateLoader(template: React.ReactElement | TemplateFunction | string) {
    return typeof template === 'string' &&
        ModulesManager.isModule(template) &&
        isModuleLoaded(template)
        ? loadSync(template)
        : template;
}

// TODO отрефакторить
export default class ImageDisplayContainer extends React.Component<IImageDisplayContainerOptions> {
    private _columns: TColumns;
    private _patchedColumns: TColumns;
    protected _imageProperty: string;
    protected _hasItemWithImage: boolean = false;
    private _items: RecordSet;
    private _nodeProperty: string;

    constructor(props: IImageDisplayContainerOptions) {
        super(props);
        this._onCollectionChange = this._onCollectionChange.bind(this);
        this._onCollectionItemChange = this._onCollectionItemChange.bind(this);
        const sourceController = props.sourceController || props.slice?.sourceController;
        if (!sourceController) {
            Logger.error('ImageDisplayContainer should be child of Browser or DataContainer', this);
        }
        this._columns = props.columns;
        this._nodeProperty = props.nodeProperty || props.slice?.nodeProperty;
        this._imageProperty = props.imageProperty;

        const items = sourceController.getItems();
        this._updateListenOnCollectionChange(this._items, items);
        this._items = items;

        if (items) {
            this._hasItemWithImage = ImageDisplayContainer._hasImage(
                items,
                props.imageProperty,
                props.imageCheckMode,
                this._nodeProperty
            );
        }
        this._patchColumns();
        this._itemTemplate = this.getItemTemplate(props);
        this._tileItemTemplate = this.getTileItemTemplate(props);
        this.state = {
            hasItemWithImage: this._hasItemWithImage,
        };
    }

    protected UNSAFE_componentWillUpdate(props: IImageDisplayContainerOptions): void {
        let needUpdateHasImage = false;

        if (!isEqual(props.columns, this.props.columns)) {
            this._columns = props.columns;
            this._patchColumns();
        }

        this._nodeProperty = props.nodeProperty || props.slice?.nodeProperty;

        const sourceController = props.sourceController || props.slice?.sourceController;
        const items = sourceController.getItems();
        if (this._items !== items) {
            this._updateListenOnCollectionChange(this._items, items);
            this._items = items;
            needUpdateHasImage = true;
        }

        if (props.imageProperty !== this.props.imageProperty) {
            this._imageProperty = props.imageProperty;
            needUpdateHasImage = true;
            if (!props.imageProperty) {
                this._unsubscribeToCollectionChange(
                    this._items,
                    this._onCollectionItemChange,
                    this._onCollectionChange
                );
            }
        }

        if (props.imageCheckMode !== this.props.imageCheckMode) {
            needUpdateHasImage = true;
        }

        if (needUpdateHasImage) {
            this._updateHasImage(
                this._items,
                this._imageProperty,
                props.imageCheckMode,
                this._nodeProperty,
                props
            );
        }
        if (this.props.itemTemplate !== props.itemTemplate) {
            this._itemTemplate = this.getItemTemplate(props);
        }
        if (this.props.tileItemTemplate !== props.tileItemTemplate) {
            this._tileItemTemplate = this.getTileItemTemplate(props);
        }
    }

    protected componentWillUnmount(): void {
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
        nodeProperty: string,
        props: IImageDisplayContainerOptions
    ): void {
        this._resetHasItemWithImage();
        if (items) {
            this._updateDisplayImage(
                this._items,
                imageProperty,
                imageCheckMode,
                nodeProperty,
                props
            );
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
    protected _updateDisplayImage(
        items: RecordSet,
        imageProperty: string,
        imageCheckMode: TImageCheckMode,
        nodeProperty: string,
        props: IImageDisplayContainerOptions
    ): void {
        if (imageProperty && !this._hasItemWithImage) {
            const oldHasItemWithImage = this._hasItemWithImage;
            this._hasItemWithImage = ImageDisplayContainer._hasImage(
                items,
                imageProperty,
                imageCheckMode,
                nodeProperty
            );
            const hasItemsImageChanged = oldHasItemWithImage !== this._hasItemWithImage;
            this._resetPatchedParams(hasItemsImageChanged);
            if (hasItemsImageChanged) {
                this._itemTemplate = this.getItemTemplate(props);
                this._tileItemTemplate = this.getTileItemTemplate(props);
                this.setState({ hasItemWithImage: this._hasItemWithImage });
            }
        }
    }

    /**
     * Сбрасывает пропатченные колонки таблицы.
     * @param hasItemsImageChanged
     * @protected
     */
    protected _resetPatchedParams(hasItemsImageChanged: boolean): void {
        if (hasItemsImageChanged || !this._patchedColumns) {
            this._patchColumns();
        }
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
        const oldHasItemWithImage = this._hasItemWithImage;
        this._hasItemWithImage = false;
        this._patchedColumns = null;
        const hasItemsImageChanged = oldHasItemWithImage !== this._hasItemWithImage;
        this._resetPatchedParams(hasItemsImageChanged);
        if (hasItemsImageChanged) {
            this._itemTemplate = this.getItemTemplate(this.props);
            this._tileItemTemplate = this.getTileItemTemplate(this.props);
            this.setState({ hasItemWithImage: this._hasItemWithImage });
        }
    }

    private _onCollectionItemChange(
        event: EventObject,
        item: Model,
        index: number,
        properties?: object
    ): void {
        // Изменение элемента, поменяли _imageProperty в записи в RecordSet.
        if (
            this.props.imageProperty &&
            typeof properties === 'object' &&
            this.props.imageProperty in properties
        ) {
            this._resetHasItemWithImage();
            this._updateDisplayImage(
                this._items,
                this._imageProperty,
                this.props.imageCheckMode,
                this._nodeProperty,
                this.props
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
                    this.props.imageCheckMode,
                    this._nodeProperty,
                    this.props
                );
                break;
            case IObservable.ACTION_ADD:
                this._updateDisplayImage(
                    this._items,
                    this._imageProperty,
                    this.props.imageCheckMode,
                    this._nodeProperty,
                    this.props
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
            item.isNode && item.isNode() ? this.props.nodeImageViewMode : this.props.imageViewMode;
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

    private _patchColumns(): TColumns {
        if (!this._columns) {
            return undefined;
        }
        if (!this._imageProperty) {
            this._patchedColumns = this._columns;
            return this._columns;
        }
        this._patchedColumns = object.clonePlain(this._columns);
        this._patchedColumns.forEach((column) => {
            const templateOptions: { imageViewMode?: string } = column.templateOptions || {};
            templateOptions.imageViewMode = this._hasItemWithImage
                ? templateOptions.imageViewMode
                : 'none';
            column.templateOptions = templateOptions;
        });
        return this._patchedColumns;
    }

    getItemTemplate(props) {
        const ItemTemplate = templateLoader(props.itemTemplate);
        // eslint-disable-next-line react/no-unstable-nested-components, react/function-component-definition
        return (itemTemplateProps) => (
            <ItemTemplate
                {...itemTemplateProps}
                hasItemWithImage={this._hasItemWithImage}
                imageViewMode={this._getImageViewMode(
                    itemTemplateProps.item,
                    this.props.imageCheckMode
                )}
                imagePosition={this.props.imagePosition}
                markerSize={this._getMarkerSize(
                    itemTemplateProps.item,
                    itemTemplateProps.markerSize,
                    this.props.imageCheckMode
                )}
                expanderSize={this._hasItemWithImage ? itemTemplateProps.expanderSize : null}
            />
        );
    }

    getTileItemTemplate(props) {
        const ItemTemplate = templateLoader(props.tileItemTemplate);
        // eslint-disable-next-line react/no-unstable-nested-components, react/function-component-definition
        return (itemTemplateProps) => (
            <ItemTemplate
                {...itemTemplateProps}
                hasItemWithImage={this._hasItemWithImage}
                imageViewMode={this._getImageViewMode(
                    itemTemplateProps.item,
                    this.props.imageCheckMode
                )}
                imagePosition={this.props.imagePosition}
            />
        );
    }

    render() {
        const { content: Content, ...otherProps } = this.props;
        return (
            <Content
                {...otherProps}
                hasItemWithImage={this._hasItemWithImage}
                columns={this._patchedColumns}
                nodeProperty={this.props.useCleanStore ? undefined : this._nodeProperty}
                sourceController={
                    this.props.useCleanStore ? undefined : this.props.sourceController
                }
                itemTemplate={this._itemTemplate}
                tileItemTemplate={this._tileItemTemplate}
            />
        );
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

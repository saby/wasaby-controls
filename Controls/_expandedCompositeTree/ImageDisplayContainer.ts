/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { TemplateFunction } from 'UI/Base';

import {
    ImageDisplayContainer as BaseImageDisplayContainer,
    IImageDisplayContainerOptions as IBaseImageDisplayContainerOptions,
} from 'Controls/listTemplates';

import * as Template from 'wml!Controls/_expandedCompositeTree/ImageDisplayContainer';

export interface IImageDisplayContainerOptions
    extends IBaseImageDisplayContainerOptions {
    compositeViewConfig: object;
}

export default class ImageDisplayContainer extends BaseImageDisplayContainer {
    protected _template: TemplateFunction = Template;
    protected _options: IImageDisplayContainerOptions;

    private _compositeViewConfig: object = null;

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
        super._beforeMount.apply(this, arguments);
        this._patchImageViewModeOptions(options);
    }

    protected _beforeUpdate(
        options?: IImageDisplayContainerOptions,
        contexts?: any
    ): void {
        super._beforeUpdate.apply(this, arguments);
        let needUpdateHasImage = false;

        if (options.imageProperty !== this._options.imageProperty) {
            needUpdateHasImage = true;
        }
        if (options.imageCheckMode !== this._options.imageCheckMode) {
            needUpdateHasImage = true;
        }

        if (
            needUpdateHasImage ||
            this._options.compositeViewConfig !== options.compositeViewConfig
        ) {
            this._patchImageViewModeOptions(options);
        }
    }

    private _getImageViewModeByItemType(itemType: string): string {
        const imageViewMode =
            itemType === 'node' ? this._nodeImageViewMode : this._imageViewMode;
        return this._hasItemWithImage ? imageViewMode : 'none';
    }

    private _patchImageViewModeOptions(
        options: IImageDisplayContainerOptions
    ): void {
        if (options.compositeViewConfig) {
            this._compositeViewConfig = {
                ...options.compositeViewConfig,
                itemTemplateOptions: {
                    ...(options.compositeViewConfig.itemTemplateOptions || {}),
                    leafImageViewMode: this._getImageViewModeByItemType('item'),
                    nodeImageViewMode: this._getImageViewModeByItemType('node'),
                    leaf: {
                        ...(options.compositeViewConfig.itemTemplateOptions
                            .leaf || {}),
                        imageViewMode: this._getImageViewModeByItemType('item'),
                    },
                    node: {
                        ...(options.compositeViewConfig.itemTemplateOptions
                            .node || {}),
                        imageViewMode: this._getImageViewModeByItemType('node'),
                    },
                    patched: true,
                },
            };
        }
    }
}

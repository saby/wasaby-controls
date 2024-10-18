/**
 * @kaizen_zone 85fa96d3-2240-448c-8ebb-e69dbcb05d63
 */
import {
    ImageDisplayContainer as BaseImageDisplayContainer,
    IImageDisplayContainerOptions as IBaseImageDisplayContainerOptions,
} from 'Controls/listTemplates';
import * as React from 'react';
import { RecordSet } from 'Types/collection';

export interface IImageDisplayContainerOptions extends IBaseImageDisplayContainerOptions {
    compositeViewConfig: object;
}

export default class ImageDisplayContainer extends BaseImageDisplayContainer {
    protected props: IImageDisplayContainerOptions;

    private _compositeViewConfig: object = null;

    constructor(props: IImageDisplayContainerOptions) {
        super(props);
        this._onCollectionChange = this._onCollectionChange.bind(this);
        this._onCollectionItemChange = this._onCollectionItemChange.bind(this);
        this._patchImageViewModeOptions(props);
    }

    protected UNSAFE_componentWillUpdate(props?: IImageDisplayContainerOptions): void {
        super.UNSAFE_componentWillUpdate.apply(this, arguments);

        if (
            props.imageProperty !== this.props.imageProperty ||
            props.imageCheckMode !== this.props.imageCheckMode ||
            (props.compositeViewConfig && this._compositeViewConfig === null) ||
            this.props.compositeViewConfig !== props.compositeViewConfig
        ) {
            this._patchImageViewModeOptions(props);
        }
    }

    protected _updateDisplayImage(
        items: RecordSet,
        imageProperty: string,
        imageCheckMode: string,
        nodeProperty: string,
        props: IImageDisplayContainerOptions
    ) {
        const oldHasItemWithImage = this._hasItemWithImage;
        super._updateDisplayImage.apply(this, arguments);

        const hasItemsImageChanged = oldHasItemWithImage !== this._hasItemWithImage;
        if (hasItemsImageChanged) {
            this._patchImageViewModeOptions(props);
        }
    }

    /**
     * Сбрасывает пропатченные опции композитного списка.
     * @param hasItemsImageChanged
     * @protected
     */
    protected _resetPatchedParams(hasItemsImageChanged: boolean): void {
        if (hasItemsImageChanged) {
            this._compositeViewConfig = null;
        }
    }

    private _getImageViewModeByItemType(itemType: string, props): string {
        const imageViewMode = itemType === 'node' ? props.nodeImageViewMode : props.imageViewMode;
        return this._hasItemWithImage ? imageViewMode : 'none';
    }

    private _patchImageViewModeOptions(props: IImageDisplayContainerOptions): void {
        if (props.compositeViewConfig) {
            this._compositeViewConfig = {
                ...props.compositeViewConfig,
                itemTemplateOptions: {
                    ...(props.compositeViewConfig.itemTemplateOptions || {}),
                    leafImageViewMode: this._getImageViewModeByItemType('item', props),
                    nodeImageViewMode: this._getImageViewModeByItemType('node', props),
                    leaf: {
                        ...(props.compositeViewConfig.itemTemplateOptions.leaf || {}),
                        imageViewMode: this._getImageViewModeByItemType('item', props),
                    },
                    node: {
                        ...(props.compositeViewConfig.itemTemplateOptions.node || {}),
                        imageViewMode: this._getImageViewModeByItemType('node', props),
                    },
                    patched: true,
                },
            };
        }
    }
    render() {
        const { content: Content, ...otherProps } = this.props;
        return (
            <Content
                {...otherProps}
                hasItemWithImage={this._hasItemWithImage}
                compositeViewConfig={this._compositeViewConfig}
                nodeProperty={this.props.useCleanStore ? undefined : this._nodeProperty}
                sourceController={
                    this.props.useCleanStore ? undefined : this.props.sourceController
                }
            />
        );
    }
}

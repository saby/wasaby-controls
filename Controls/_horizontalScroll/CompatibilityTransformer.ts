/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls/_horizontalScroll/CompatibilityTransformer/CompatibilityTransformer';

export interface ICompatibilityTransformerOptions extends IControlOptions {
    isFullGridSupport: boolean;
    selector: string;
}

export interface ITransformParams {
    scrollContainerWidth: number;
    contentContainerWidth: number;
    fixedPartWidth: number;
    scrollPosition: number;
}

export class CompatibilityTransformer extends Control<ICompatibilityTransformerOptions> {
    protected _template: TemplateFunction = Template;
    private _isActive: boolean = false;
    private _params?: ITransformParams;

    protected _children: {
        styleContainer: HTMLStyleElement;
    };

    activateTransformer(params: ITransformParams): void {
        this._isActive = true;
        this._params = params;
        this._updateStyles(params);
    }

    updateTransformer(params: Partial<ITransformParams>): boolean {
        if (!this._params) {
            this._params = {
                scrollPosition: 0,
                scrollContainerWidth: 0,
                contentContainerWidth: 0,
                fixedPartWidth: 0,
            };
        }
        if (
            this._params.contentContainerWidth !==
                params.contentContainerWidth ||
            this._params.scrollContainerWidth !== params.scrollContainerWidth ||
            this._params.scrollPosition !== params.scrollPosition ||
            this._params.fixedPartWidth !== params.fixedPartWidth
        ) {
            this._params = {
                ...this._params,
                ...params,
            };
            if (
                this._params.contentContainerWidth <=
                this._params.scrollContainerWidth
            ) {
                this._params.fixedPartWidth = 0;
            }

            if (this._isActive) {
                this._updateStyles(this._params);
            }
            return true;
        }
        return false;
    }

    deactivateTransformer(): void {
        this._params = null;
        this._updateStyles();
    }

    private _updateStyles(params?: ITransformParams): void {
        if (!params) {
            if (this._children.styleContainer.innerHTML) {
                this._children.styleContainer.innerHTML = '';
            }
            return;
        }

        const stylesArray = [
            `.controls-Grid__loadingIndicator-content {
                width: ${params.scrollContainerWidth}px;
                transform: translateX(${params.scrollPosition}px);
            }`,
        ];

        if (params.contentContainerWidth > params.scrollContainerWidth) {
            stylesArray.push(
                '.controls-Grid__header-cell_withColumnScrollArrows { padding-bottom: var(--offset_xl); }'
            );
        }

        if (!this._options.isFullGridSupport) {
            stylesArray.push(
                `.js-controls-ColumnScroll__thumb {
                    width: ${params.scrollContainerWidth}px;
                    transform: translateX(${params.scrollPosition}px);
                }`,
                `.controls-ColumnScroll__fixedElement {
                    transform: translateX(${params.scrollPosition}px);
                    z-index: 3;
                }`,
                `>.js-controls-ColumnScroll__shadows .js-controls-ColumnScroll__shadow_position-start {
                    ${params.scrollPosition > 0 ? 'visibility: visible;' : ''}
                    left: ${params.fixedPartWidth + params.scrollPosition}px;
                }`,
                `>.js-controls-ColumnScroll__shadows .js-controls-ColumnScroll__shadow_position-end {
                    ${
                        params.scrollPosition <
                        params.contentContainerWidth -
                            params.scrollContainerWidth
                            ? 'visibility: visible;'
                            : ''
                    }
                    left: calc(${
                        params.scrollContainerWidth + params.scrollPosition
                    }px - var(--shadow_l_thickness_scroll));
                }`
            );
        }

        const newStyles = this._buildStringWithSelector(
            this._options.selector,
            stylesArray
        );

        if (this._children.styleContainer.innerHTML !== newStyles) {
            this._children.styleContainer.innerHTML = newStyles;
        }
    }

    private _buildStringWithSelector(
        selector: string,
        styles: string[]
    ): string {
        return styles.reduce((fullString, currentStyle) => {
            return fullString + `.${selector} ` + currentStyle + '\n';
        }, '');
    }
}

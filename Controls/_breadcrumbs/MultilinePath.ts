/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import BreadCrumbsUtil from './Utils';
import { IFontColorStyle, IFontSize } from 'Controls/interface';
// @ts-ignore
import * as template from 'wml!Controls/_breadcrumbs/MultilinePath/MultilinePath';
import { IBreadCrumbsOptions } from './interface/IBreadCrumbs';
import { Record, Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { getFontWidth } from 'Controls/Utils/getFontWidthSync';
import { dataConversion } from './resources/dataConversion';
import { Logger } from 'UI/Utils';
import 'css!Controls/breadcrumbs';

// TODO удалить, когда появится возможность находить значение ширины иконок и отступов.
const ARROW_WIDTH = 16;
const PADDING_RIGHT = 2;

export interface IMultilinePathOptions extends IBreadCrumbsOptions {
    containerWidth: number;
}
interface IReceivedState {
    items: Record[];
}

/**
 * Контрол "Хлебные крошки", отображающиеся в две строки.
 * @extends UI/Base:Control
 * @mixes Controls/breadcrumbs:IBreadCrumbs
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @public
 * @demo Controls-demo/BreadCrumbs/Multiline/Index
 * @remark
 * {@link Controls/breadcrumbs:Path} — хлебные крошки, отображающиеся в одну строку.
 * @see Controls/breadcrumbs:Path
 */
class MultilinePath extends Control<IMultilinePathOptions, IReceivedState> implements IFontSize {
    readonly '[Controls/_interface/IFontSize]': boolean;
    protected _template: TemplateFunction = template;
    protected _visibleItemsFirst: Record[] = [];
    protected _visibleItemsSecond: Record[] = [];
    protected _width: number = 0;
    protected _dotsWidth: number = 0;
    protected _indexEdge: number = 0;
    protected _items: Record[];
    private _isFontsLoaded: boolean = false;
    private _isPathMounted: boolean = false;

    protected _beforeMount(
        options?: IMultilinePathOptions,
        contexts?: object,
        receivedState?: IReceivedState
    ): Promise<IReceivedState> | void {
        this._items = dataConversion(options.items, this._moduleName);
        if (!options.containerWidth) {
            Logger.warn('Опция containerWidth не задана. Контрол может работать некорректно', this);
            // Нужно дождаться маунта и загрузки шрифтов, в случае, если containerWidth не задан
            this._isFontsLoaded = true;
            if (this._isPathMounted && this._isFontsLoaded) {
                this._loadFontsCallback(options, this._container.clientWidth, getFontWidth);
            }
        } else if (receivedState) {
            this._isFontsLoaded = true;
            this._dotsWidth = this._getDotsWidth(options.fontSize);
            this._prepareData(options, options.containerWidth);
        } else {
            return new Promise((resolve) => {
                this._isFontsLoaded = true;
                this._loadFontsCallback(options, options.containerWidth, getFontWidth);
                resolve({
                    items: this._items,
                });
            });
        }
    }

    protected _afterMount(options?: IMultilinePathOptions, contexts?: any): void {
        // Нужно дождаться маунта и загрузки шрифтов, в случае, если containerWidth не задан
        this._isPathMounted = true;
        if (!options.containerWidth && this._isPathMounted && this._isFontsLoaded) {
            this._loadFontsCallback(options, this._container.clientWidth);
        }
    }

    protected _beforeUpdate(newOptions: IMultilinePathOptions): void {
        const isItemsChanged = newOptions.items && newOptions.items !== this._options.items;
        const isContainerWidthChanged = newOptions.containerWidth !== this._options.containerWidth;
        const isFontSizeChanged = newOptions.fontSize !== this._options.fontSize;
        if (isItemsChanged) {
            this._items = dataConversion(newOptions.items, this._moduleName);
        }
        if (isContainerWidthChanged) {
            this._width = newOptions.containerWidth;
        }
        if (isFontSizeChanged) {
            this._dotsWidth = this._getDotsWidth(newOptions.fontSize);
        }
        if (isItemsChanged || isContainerWidthChanged || isFontSizeChanged) {
            if (this._isPathMounted && this._isFontsLoaded) {
                this._calculateBreadCrumbsToDraw(this._items, newOptions);
            }
        }
    }

    private _loadFontsCallback(
        options: IMultilinePathOptions,
        width: number,
        getTextWidth: Function = this._getTextWidth
    ): void {
        if (this._items && this._items.length > 0) {
            this._dotsWidth = this._getDotsWidth(options.fontSize, getTextWidth);
            this._prepareData(options, width, getTextWidth);
        }
    }

    // eslint-disable-next-line max-len
    private _prepareData(
        options: IMultilinePathOptions,
        width: number,
        getTextWidth: Function = this._getTextWidth
    ): void {
        if (this._items && this._items.length > 0) {
            this._width = width;
            this._calculateBreadCrumbsToDraw(this._items, options, getTextWidth);
        }
    }

    private _getDotsWidth(fontSize: string, getTextWidth: Function = this._getTextWidth): number {
        const dotsWidth = getTextWidth('...', fontSize) + PADDING_RIGHT;
        return ARROW_WIDTH + dotsWidth;
    }

    private _calculateBreadCrumbsToDraw(
        items: Record[],
        options: IMultilinePathOptions,
        getTextWidth: Function = this._getTextWidth
    ): void {
        const firstContainerData = BreadCrumbsUtil.calculateItemsWithShrinkingLast(
            items,
            options,
            this._width,
            getTextWidth
        );
        this._indexEdge = firstContainerData.indexEdge;
        this._visibleItemsFirst = firstContainerData.visibleItems;
        this._visibleItemsSecond = BreadCrumbsUtil.calculateItemsWithDots(
            items,
            options,
            this._indexEdge,
            this._width,
            this._dotsWidth,
            getTextWidth
        );
    }

    private _getTextWidth(text: string, size: string = 'xs'): number {
        return getFontWidth(text, size);
    }

    private _itemClickHandler(e: SyntheticEvent<MouseEvent>, item: Model): void {
        e.stopPropagation();
        this._notify('itemClick', [item]);
    }

    static _styles: string[] = ['Controls/_breadcrumbs/resources/FontLoadUtil'];

    static getDefaultOptions() {
        return {
            displayProperty: 'title',
            fontSize: 'xs',
        };
    }
}

export default MultilinePath;

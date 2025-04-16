/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { Control, TemplateFunction } from 'UI/Base';
import PrepareDataUtil from './PrepareDataUtil';
import { EventUtils } from 'UI/Events';
import template = require('wml!Controls/_breadcrumbs/Path/Path');
import { IBreadCrumbsOptions } from './interface/IBreadCrumbs';
import { getFontWidth } from 'Controls/Utils/getFontWidthSync';
import calculateBreadcrumbsUtil, { ARROW_WIDTH, PADDING_RIGHT } from 'Controls/_breadcrumbs/Utils';
import { dataConversion } from './resources/dataConversion';
import { Record } from 'Types/entity';
import 'css!Controls/breadcrumbs';

interface IReceivedState {
    items: Record[];
}
/**
 * Контрол "Хлебные крошки".
 * Используется в устаревшей схеме связывания через {@link Controls/browser:Browser} (например, в {@link /doc/platform/developmentapl/interface-development/controls/input-elements/directory/layout-selector-stack/ окнах выбора}).
 * В остальных случаях, чтобы связать хлебные крошки со списком, используйте {@link Controls-ListEnv/breadcrumbs:View}.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/navigation/bread-crumbs/ руководство разработчика}
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_breadcrumbs.less переменные тем оформления}
 * @class Controls/_breadcrumbs/Path
 * @extends UI/Base:Control
 * @mixes Controls/breadcrumbs:IBreadCrumbs
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @public
 * @demo Controls-demo/breadCrumbs_new/ClickHandler/Index
 * @see Controls/_breadcrumbs/HeadingPath
 */

/*
 * Breadcrumbs.
 * <a href="/materials/DemoStand/app/Controls-demo%2FBreadCrumbs%2FScenarios">Demo</a>.
 *
 * @class Controls/_breadcrumbs/Path
 * @extends UI/Base:Control
 * @mixes Controls/breadcrumbs:IBreadCrumbs
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @private
 * @demo Controls-demo/breadCrumbs_new/ClickHandler/Index
 */

class BreadCrumbs extends Control<IBreadCrumbsOptions, IReceivedState> {
    protected _template: TemplateFunction = template;
    protected _visibleItems: any[] = [];
    protected _notifyHandler: Function = EventUtils.tmplNotify;
    protected _width: number = 0;
    protected _dotsWidth: number = 0;
    protected _items: Record[];

    protected _beforeMount(
        options?: IBreadCrumbsOptions,
        contexts?: object,
        receivedState?: IReceivedState
    ): IReceivedState | void {
        this._items = dataConversion(options.items, this._moduleName);
        const hasItems: boolean = this._items && this._items.length > 0;
        if (!options.containerWidth && hasItems) {
            this._visibleItems = PrepareDataUtil.drawBreadCrumbsItems(this._items);
            return;
        }
        if (receivedState) {
            this._dotsWidth = this._getDotsWidth(options.fontSize);
            this._prepareData(options, options.containerWidth);
            return;
        }
        this._dotsWidth = this._getDotsWidth(options.fontSize);
        this._prepareData(options, options.containerWidth);
        return {
            items: this._items,
        };
    }

    protected _beforeUpdate(newOptions: IBreadCrumbsOptions): void {
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
        const isDataChange = isItemsChanged || isContainerWidthChanged || isFontSizeChanged;
        if (isDataChange && newOptions.items) {
            if (this._width) {
                this._calculateBreadCrumbsToDraw(this._items, newOptions);
            } else {
                this._visibleItems = PrepareDataUtil.drawBreadCrumbsItems(this._items);
            }
        }
    }
    private _getDotsWidth(fontSize: string, getTextWidth: Function = this._getTextWidth): number {
        const dotsWidth = getTextWidth('...', fontSize) + PADDING_RIGHT;
        return ARROW_WIDTH + dotsWidth;
    }

    private _prepareData(
        options: IBreadCrumbsOptions,
        width: number,
        getTextWidth: Function = this._getTextWidth
    ): void {
        if (this._items && this._items.length > 0) {
            this._width = width;
            this._calculateBreadCrumbsToDraw(this._items, options, getTextWidth);
        }
    }

    private _getTextWidth(text: string, size: string = 'xs'): number {
        return getFontWidth(text, size);
    }

    private _calculateBreadCrumbsToDraw(
        items: Record[],
        options: IBreadCrumbsOptions,
        getTextWidth: Function = this._getTextWidth
    ): void {
        if (items?.length) {
            this._visibleItems = calculateBreadcrumbsUtil.calculateItemsWithDots(
                items,
                options,
                0,
                this._width,
                this._dotsWidth,
                getTextWidth
            );
            this._visibleItems[0].hasArrow = false;
        } else {
            this._visibleItems = [];
        }
    }

    protected _itemClickHandler(event: Event, item: Record): void {
        event.stopPropagation();
        this._notify('itemClick', [item]);
        if (this._options.breadCrumbsItemClickCallback) {
            this._options.breadCrumbsItemClickCallback(event, item);
        }
    }

    static defaultProps: Partial<IBreadCrumbsOptions> = {
        displayProperty: 'title',
        fontSize: 'xs',
    };
}

/**
 * @name Controls/_breadcrumbs/Path#fontSize
 * @cfg {String} Размер шрифта
 * @demo Controls-demo/breadCrumbs_new/FontSize/Index
 */
export default BreadCrumbs;

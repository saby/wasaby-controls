/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { Control, TemplateFunction } from 'UI/Base';
import PrepareDataUtil, { IVisibleItem } from './PrepareDataUtil';
import { EventUtils } from 'UI/Events';
import { applyHighlighter } from 'Controls/_breadcrumbs/resources/applyHighlighter';
import template = require('wml!Controls/_breadcrumbs/HeadingPath/HeadingPath');
import Common from './HeadingPath/Common';
import 'Controls/heading';
import 'css!Controls/heading';
import 'css!Controls/breadcrumbs';
import 'wml!Controls/_breadcrumbs/HeadingPath/Back';
import { getFontWidth } from 'Controls/Utils/getFontWidthSync';
import { dataConversion } from './resources/dataConversion';
import { Model, Record } from 'Types/entity';
import { Logger } from 'UI/Utils';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Path } from 'Controls/dataSource';
import { IHeadingPath } from './interface/IHeadingPath';
import calculateBreadcrumbsUtil, { ARROW_WIDTH, PADDING_RIGHT } from 'Controls/_breadcrumbs/Utils';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';
import { TFontSize } from 'Controls/interface';

interface IReceivedState {
    items?: Record[];
    breadCrumbsWidth?: number;
    backButtonWidth?: number;
}

const SIZES = {
    ARROW_WIDTH: 12,
    HOME_BUTTON_WIDTH: 24,
};

/**
 * Хлебные крошки с кнопкой "Назад".
 * Используется в устаревшей схеме связывания через {@link Controls/browser:Browser} (например, в {@link /doc/platform/developmentapl/interface-development/controls/input-elements/directory/layout-selector-stack/ окнах выбора}).
 * В остальных случаях, чтобы связать хлебные крошки со списком, используйте {@link Controls-ListEnv/breadcrumbs:HeadingPath}.
 *
 * @remark
 * Чтобы вывести значение счетчика справа от кнопки "Назад", нужно на item'e указать поле counterCaption c его значением.
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/navigation/bread-crumbs/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_breadcrumbs.less переменные тем оформления}
 *
 * @class Controls/_breadcrumbs/HeadingPath
 * @extends UI/Base:Control
 * @mixes Controls/breadcrumbs:IBreadCrumbs
 * @implements Controls/_breadcrumbs/interface/IHeadingPath
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @public
 * @demo Controls-demo/BreadCrumbs/backButtonFontSize/Index
 * @demo Controls-demo/BreadCrumbs/DisplayMode/Index
 * @see Controls/_breadcrumbs/Path
 */

/*
 * Breadcrumbs with back button.
 *
 * @class Controls/_breadcrumbs/HeadingPath
 * @extends UI/Base:Control
 * @mixes Controls/breadcrumbs:IBreadCrumbs
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @public
 * @author Кондратьев И.Н.
 *
 * @demo Controls-demo/BreadCrumbs/ScenarioFirst/Index
 */
class BreadCrumbsPath extends Control<IHeadingPath, IReceivedState> {
    protected _template: TemplateFunction = template;
    protected _backButtonCaption: string = '';
    protected _backButtonBeforeCaptionOptions: object = null;
    protected _visibleItems: IVisibleItem[] = null;
    protected _breadCrumbsItems: Record[] = null;
    protected _items: Record[] = null;
    protected _backButtonClass: string = '';
    protected _breadCrumbsWrapperClass: string = '';
    protected _breadCrumbsClass: string = '';
    private _crumbsWidth: number;
    private _backButtonWidth: number;
    protected _notifyHandler: Function = EventUtils.tmplNotify;
    protected _getRootModel: Function = Common.getRootModel;
    protected _dotsWidth: number = 0;
    protected _indexEdge: number = 0;
    protected _isHomeVisible: boolean = false;
    private _initializingWidth: number;
    protected _isPhone: boolean = unsafe_getRootAdaptiveMode().device.isPhone();
    protected _breadcrumbsSize: TFontSize;
    protected _homeHighlightClass: string;

    protected _beforeMount(
        options?: IHeadingPath,
        contexts?: object,
        receivedState?: IReceivedState
    ): Promise<IReceivedState> | IReceivedState {
        if (receivedState) {
            this._initStatesBeforeMount(options, receivedState);
            return;
        }

        this._initStatesBeforeMount(options, undefined, this._getTextWidth);
        if (this._breadCrumbsItems) {
            return {
                items: this._breadCrumbsItems,
                breadCrumbsWidth: this._crumbsWidth,
                backButtonWidth: this._backButtonWidth,
            };
        }
    }

    protected _initStatesBeforeMount(
        options?: IHeadingPath,
        receivedState?: IReceivedState,
        getTextWidth: Function = this._getTextWidth
    ): void {
        this._items = dataConversion(options.items, this._moduleName);
        this._prepareItems(options, receivedState, getTextWidth);

        this._breadcrumbsSize = calculateBreadcrumbsUtil.updateBreadcrumbsSize(
            options.backButtonFontSize,
            options.fontSize
        );

        // Ветка, где построение идет на css
        if (this._breadCrumbsItems && !options.containerWidth) {
            this._visibleItems = PrepareDataUtil.drawBreadCrumbsItems(this._breadCrumbsItems);
            return;
        }

        if (options.containerWidth) {
            this._initializingWidth = options.containerWidth;
            this._dotsWidth = this._getDotsWidth(options.fontSize, getTextWidth);
            this._prepareData(options, getTextWidth);
        }
    }

    protected _beforeUpdate(newOptions: IHeadingPath): void {
        const isItemsChanged = newOptions.items !== this._options.items;
        const isContainerWidthChanged = newOptions.containerWidth !== this._options.containerWidth;
        const isFontSizeChanged = newOptions.fontSize !== this._options.fontSize;
        if (isItemsChanged) {
            this._items = dataConversion(newOptions.items, this._moduleName);
        }
        if (isFontSizeChanged) {
            this._dotsWidth = this._getDotsWidth(newOptions.fontSize);
        }
        const isDataChange = isItemsChanged || isContainerWidthChanged || isFontSizeChanged;

        this._breadcrumbsSize = calculateBreadcrumbsUtil.updateBreadcrumbsSize(
            newOptions.backButtonFontSize,
            newOptions.fontSize
        );

        if (!this._initializingWidth && newOptions.containerWidth) {
            const parentModuleName = this._logicParent?._moduleName;
            const text = `Опция containerWidth должна быть установлена сразу, на момент построения контрола.
                          Задание значения в цикле обновления некорректно, контрол может работать неправильно.
                          Контрол, устанавливающий опции: ${parentModuleName}`;
            Logger.error(text, this);
        } else {
            if (isDataChange) {
                this._prepareItems(newOptions);
                if (this._breadCrumbsItems) {
                    if (newOptions.containerWidth) {
                        this._calculateBreadCrumbsToDraw(this._breadCrumbsItems, newOptions);
                    } else {
                        this._visibleItems = PrepareDataUtil.drawBreadCrumbsItems(
                            this._breadCrumbsItems
                        );
                    }
                }
            }
        }
    }
    private _getDotsWidth(fontSize: string, getTextWidth: Function = this._getTextWidth): number {
        const dotsWidth = getTextWidth('...', fontSize) + PADDING_RIGHT;
        return ARROW_WIDTH + dotsWidth;
    }
    private _prepareData(options: IHeadingPath, getTextWidth: Function = this._getTextWidth): void {
        if (this._items && this._items.length > 1) {
            this._calculateBreadCrumbsToDraw(this._breadCrumbsItems, options, getTextWidth);
        }
    }
    private _getTextWidth(text: string, size: string = 'xs'): number {
        return getFontWidth(text, size);
    }

    private _calculateBreadCrumbsToDraw(
        items: Record[],
        options: IHeadingPath,
        getTextWidth: Function = this._getTextWidth
    ): void {
        if (!items || items.length === 0) {
            return;
        }

        const textWidth = getTextWidth(
            this._backButtonCaption,
            options.backButtonFontSize || '3xl'
        );
        const width =
            options.containerWidth - textWidth - SIZES.ARROW_WIDTH - SIZES.HOME_BUTTON_WIDTH;

        this._visibleItems = calculateBreadcrumbsUtil.calculateItemsWithDots(
            items,
            { ...options, fontSize: this._breadcrumbsSize },
            0,
            width,
            this._dotsWidth,
            getTextWidth
        );
        this._visibleItems[0].hasArrow = false;
        this._indexEdge = 0;
    }

    protected _onBackButtonClick(e: Event): void {
        Common.onBackButtonClick.call(this, e);
    }

    protected _onHomeClick(): void {
        this._notify('itemClick', [this._buildRootModel()]);
    }

    protected _onHomeMouseEnter(): void {
        const rootModel = this._buildRootModel();

        // 1. Сначала событие шлем
        this._notify('hoveredItemChanged', [rootModel]);
        // 2. Потом обработчики запускаем
        this._homeHighlightClass = applyHighlighter(this._options.highlighter, rootModel.getKey());
    }

    protected _onHomeMouseLeave(): void {
        this._homeHighlightClass = '';
        this._notify('hoveredItemChanged');
    }

    /**
     * Обработчик изменения пути через компонент Controls._breadcrumbs.PathButton
     */
    protected _onPathChanged(event: SyntheticEvent, path: Path): void {
        const newRoot = path.length ? path[path.length - 1] : this._buildRootModel();
        this._notify('itemClick', [newRoot]);
    }

    protected _getCounterCaption(items: Record[] = []): void {
        if (items === null) {
            items = [];
        }

        const lastItem = items[items.length - 1];
        return lastItem?.get('counterCaption');
    }

    /**
     * На основании размера шрифта кнопки "Назад" возвращает необходимый размер для кнопки меню.
     */
    protected _getPathButtonHeight(): string {
        switch (this._options.backButtonFontSize) {
            case 's':
            case 'm':
                return 'xs';
            case 'l':
            case 'xl':
            case '2xl':
            case '3xl':
            case '4xl':
                return 'm';
            case '5xl':
            case '6xl':
            case '7xl':
                return 'xl';
            default:
                return 'm';
        }
    }

    /**
     * Вернет true, если иконка действия (шеврон) в кнопке "Назад" должна показываться дез наезда на её заголовок.
     * Шеврон показыватется без наезда только если полсе кнопки нет никакого содерхимого (иконка "домик",
     * хлебные крошки или кнопка меню).
     */
    protected _isActionButtonOutside(): boolean {
        return (
            !this._breadCrumbsItems &&
            !this._options.rootVisible &&
            !this._options.pathButtonVisible
        );
    }

    private _getCrumbsWidth(
        options: IHeadingPath,
        getTextWidth: Function = this._getTextWidth
    ): { backButtonWidth: number; breadCrumbsWidth: number } {
        const crumbsWidthArr = calculateBreadcrumbsUtil.getItemsWidth(
            this._breadCrumbsItems,
            options,
            getTextWidth
        );
        return {
            backButtonWidth:
                this._backButtonCaption && !options.withoutBackButton
                    ? getTextWidth(this._backButtonCaption, '3xl')
                    : 0,
            breadCrumbsWidth: crumbsWidthArr.reduce((accumulator, current) => {
                return accumulator + current;
            }, 0),
        };
    }

    /**
     * Обновляет ограничивающие ширину крошек и кнопки "Назад" классы.
     * Ширины вычисляются на основании текста, содержащегося в них.
     */
    private _updateBreadCrumbsClasses(
        options: IHeadingPath,
        receivedState?: IReceivedState,
        getTextWidth: Function = this._getTextWidth
    ): void {
        if (receivedState) {
            this._crumbsWidth = receivedState.breadCrumbsWidth;
            this._backButtonWidth = receivedState.backButtonWidth;
        } else {
            const crumbsWidthObj = this._getCrumbsWidth(options, getTextWidth);
            this._crumbsWidth = crumbsWidthObj.breadCrumbsWidth;
            this._backButtonWidth = crumbsWidthObj.backButtonWidth;
        }

        // Если крошки шире чем кнопка "Назад", то ограничиваем ширину кнопки "Назад".
        // В противном случае ограничиваем ширину хлебных крошек

        if (options.withoutBreadcrumbs) {
            this._backButtonClass = 'controls-BreadCrumbsPath__unrestrictedWidth';
            return;
        }

        if (options.withoutBackButton) {
            this._breadCrumbsWrapperClass = 'controls-BreadCrumbsPath__unrestrictedWidth';
            return;
        }

        if (this._crumbsWidth > this._backButtonWidth) {
            this._breadCrumbsWrapperClass = 'controls-BreadCrumbsPath__unrestrictedWidth';
            this._backButtonClass = 'controls-BreadCrumbsPath__widthRestriction';
        } else {
            this._breadCrumbsWrapperClass = 'controls-BreadCrumbsPath__widthRestriction';
            this._backButtonClass = 'controls-BreadCrumbsPath__unrestrictedWidth';
        }
    }

    /**
     * На основании текущий опций собирает модель корневого каталога
     */
    private _buildRootModel(): Model {
        const root = this._items
            ? this._items[0].get(this._options.parentProperty)
            : this._options.root;
        return this._getRootModel(root, this._options.keyProperty);
    }

    private _prepareItems(
        options: IHeadingPath,
        receivedState?: IReceivedState,
        getTextWidth: Function = this._getTextWidth
    ): void {
        const clearCrumbsView = () => {
            this._visibleItems = null;
            this._breadCrumbsItems = null;
            this._backButtonClass = '';
            this._breadCrumbsClass = '';
            this._breadCrumbsWrapperClass = '';
            this._isHomeVisible = false;
        };

        if (this._items?.length > 0) {
            const lastItem = this._items[this._items.length - 1];

            this._backButtonBeforeCaptionOptions = { item: lastItem };
            this._backButtonCaption = lastItem.get(options.displayProperty);

            // containerWidth is equal to 0, if path is inside hidden node. (for example switchableArea)
            if (this._items?.length > 1) {
                this._breadCrumbsItems = this._items.slice(0, this._items.length - 1);
                this._breadCrumbsClass = 'controls-BreadCrumbsPath__breadCrumbs_short';
                this._isHomeVisible = true;

                // Ограничиваем ширину только в случае отображения на одной линии кнопки назад и крошек
                if (options.displayMode === 'default') {
                    this._updateBreadCrumbsClasses(options, receivedState, getTextWidth);
                }
            } else {
                clearCrumbsView();
            }
        } else {
            this._backButtonBeforeCaptionOptions = null;
            this._backButtonCaption = '';

            clearCrumbsView();
        }
    }

    static _styles: string[] = ['Controls/_breadcrumbs/resources/FontLoadUtil'];

    static defaultProps: Partial<IHeadingPath> = {
        displayProperty: 'title',
        root: null,
        backButtonIconStyle: 'primary',
        backButtonFontColorStyle: 'default',
        backButtonTextTransform: 'none',
        showActionButton: true,
        displayMode: 'default',
        fontSize: 'xs',
    };
}

/**
 * @name Controls/_breadcrumbs/HeadingPath#backButtonFontSize
 * @cfg {String} Размер шрифта кнопки "Назад".
 * @demo Controls-demo/BreadCrumbs/backButtonFontSize/Index
 */

/**
 * @name Controls/_breadcrumbs/HeadingPath#backButtonIconStyle
 * @cfg {String} Стиль отображения иконки кнопки "Назад".
 * @see Controls/_heading/Back#iconStyle
 */

/**
 * @name Controls/_breadcrumbs/HeadingPath#fontColorStyle
 * @cfg {Controls/_interface/IFontColorStyle/TFontColorStyle.typedef} Стиль цвета пути хлебных крошек.
 * @demo Controls-demo/breadCrumbs_new/FontColorStyle/Index
 * @remark
 * Стиль цвета задается константой из стандартного набора цветов, который определен для текущей темы оформления.
 * Опция влияет только на правую часть контрола - путь хлебных крошек.
 * Стиль цвета кнопки назад задается опцией {@link backButtonFontColorStyle}.
 * @see Controls/_breadcrumbs/HeadingPath#backButtonFontColorStyle
 * @see Controls/_interface/IFontColorStyle
 */

/**
 * @name Controls/_breadcrumbs/HeadingPath#backButtonFontColorStyle
 * @cfg {String} Стиль цвета кнопки "Назад".
 * @see Controls/_heading/Back#fontColorStyle
 * @demo Controls-demo/BreadCrumbs/backButtonFontColorStyle/Index
 */

/**
 * @name Controls/_breadcrumbs/HeadingPath#displayMode
 * @cfg {String} Отображение крошек в несколько строк
 * @variant default
 * @variant multiline
 * @default default
 * @demo Controls-demo/BreadCrumbs/DisplayMode/Index
 */

/**
 * @name Controls/_breadcrumbs/HeadingPath#fontSize
 * @cfg {String} Размер шрифта
 * @demo Controls-demo/BreadCrumbs/FontSize/Index
 */

/**
 * @name Controls/_breadcrumbs/HeadingPath#showActionButton
 * @cfg {Boolean} Определяет, должна ли отображаться стрелка рядом с кнопкой "Назад".
 * @default
 * true
 * @demo Controls-demo/BreadCrumbs/ShowActionButton/Index
 */

/*
 * @name Controls/_breadcrumbs/HeadingPath#showActionButton
 * @cfg {Boolean} Determines whether the arrow near "back" button should be shown.
 * @default
 * true
 */

/**
 * @name Controls/_breadcrumbs/HeadingPath#afterBackButtonTemplate
 * @cfg {Function|string} Шаблон, который расположен между кнопкой назад и хлебными крошками
 * @demo Controls-demo/BreadCrumbs/BreadCrumbs
 * @example
 * <pre>
 *    <Controls.breadcrumbs:HeadingPath
 *          items="{{_items}}"
 *          parentProperty="parent"
 *          keyProperty="id"
 *          on:itemClick="_onItemClick()">
 *       <ws:afterBackButtonTemplate>
 *          <h3>Custom content</h3>
 *       </ws:afterBackButtonTemplate>
 *    </Controls.breadcrumbs:HeadingPath>
 * </pre>
 */
export default BreadCrumbsPath;

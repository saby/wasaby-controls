/**
 * @kaizen_zone f43717a4-ecb5-4bdd-a32c-4ebbcb125017
 */
import { Control, TemplateFunction } from 'UI/Base';
// @ts-ignore
import * as template from 'wml!Controls/_tabs/AdaptiveButtons/AdaptiveButtons';
import { RecordSet } from 'Types/collection';
import { getFontWidth } from 'Controls/Utils/getFontWidthSync';
import { SbisService, Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { CrudWrapper } from 'Controls/dataSource';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Logger } from 'UI/Utils';
import { ITabButtonItem, ITabsButtonsOptions } from './interface/ITabsButtons';
import { TSelectedKey } from 'Controls/interface';
import * as rk from 'i18n!Controls';

const MARGIN = 13;
const MIN_WIDTH = 20;
const MIN_ITEM_WIDTH = 26;
const PADDING_OF_MORE_BUTTON = 12;
const COUNT_OF_MARGIN = 2;
const MORE_BUTTON_TEXT = rk('Ещё...');
const SHOW_MORE_BUTTON_WIDTH = 38;
const MARGIN_BETWEEN_ICON_COUNTER = 4;
const MARGIN_BETWEEN_TEXT_COUNTER = 6;
const MARGIN_BETWEEN_TEXT_ICON = MARGIN_BETWEEN_TEXT_COUNTER;
const ICON_WIDTHS = {
    s: 16,
    m: 24,
    l: 32,
};

interface IReceivedState {
    items: RecordSet<object>;
    containerWidth: number;
}

interface IIcon {
    icon?: string;
    iconStyle?: string;
    iconTooltip?: string;
}

/**
 * @typedef {Object} Controls/_tabs/ITabsAdaptiveButtonsItemIcon
 * @property {String} [item.icon] Название иконки.
 * @property {String} [item.iconStyle] Стиль отображения иконки.
 * @property {String} [item.iconTooltip] Отдельная всплывающая подсказка для иконки.
 */

/**
 * @typedef {Object} Controls/_tabs/ITabsAdaptiveButtonsItem
 * @property {Controls/_tabs/interface/ITabsButtons/Align.typedef} [item.align] Определяет с какой стороны отображается вкладка.
 * @property {Number|String} [item.maxWidth] Максимальная ширина вкладки. Может принимать числовое значение(в пикселях) или в процентах(Например: '20%')
 * @property {Number|String} [item.minWidth] Минимальная ширина вкладки. Может принимать числовое значение(в пикселях) или в процентах(Например: '20%')
 * @property {Number|String} [item.width] Фиксированная ширина вкладки.
 * @property {String} [item.tooltip] Текст всплывающей подсказки, отображаемой при наведении указателя мыши на вкладку.
 * Может принимать числовое значение(в пикселях) или в процентах(Например: '20%')
 * При задании фиксированной ширины задание minWidth и maxWidth не имеет смысла, т.к. ширина зафиксируется.
 * @property {Boolean} [item.isMainTab] Определяет, является ли вкладка главной. Главная вкладка визуально выделяется относительно других вкладок. Поддерживается визуальное оформление только для первой вкладки слева.
 * @property {String} [item.icon] Название иконки. {@link Controls/_tabs/ITabsTemplate#itemTemplate Для настройки смотри пример}
 * @property {String} [item.iconStyle] Стиль отображения иконки. {@link Controls/_tabs/ITabsTemplate#itemTemplate Для настройки смотри пример}
 * @property {String} [item.iconTooltip] Отдельная всплывающая подсказка для иконки. {@link Controls/_tabs/ITabsTemplate#itemTemplate}
 * @property {Array<Controls/_tabs/ITabsAdaptiveButtonsItemIcon.typedef>} [item.icons] Массив с иконками которые нужно отобразить.
 * @property {Number} [item.mainCounter] Значение счетчика. {@link Controls/_tabs/ITabsTemplate#itemTemplate Для настройки смотри пример}
 * @property {Number} [item.mainCounterStyle] Стиль отображения счетчика. {@link Controls/_tabs/ITabsTemplate#itemTemplate Для настройки смотри пример}
 * @property {String} [item.caption] Подпись вкладки. {@link Controls/_tabs/ITabsTemplate#itemTemplate Для настройки смотри пример}
 * @property {Controls/_tabs/interface/ITabsButtons/image.typedef} [item.image] Конфигурация для отображения картинки. {@link Controls/_tabs/ITabsTemplate#itemTemplate Для настройки смотри пример}
 */
export interface ITabAdaptiveButtonItem extends ITabButtonItem {
    icons: IIcon[];
}

export type TMoreButtonAlign = 'start' | 'end';

export type TAdaptiveButtonsTemplate = 'TextAndIcon' | 'Icon' | 'IconAndCounter' | 'TextAndCounter';

export interface ITabsAdaptiveButtonsOptions extends ITabsButtonsOptions {
    /**
     * @name Controls/_tabs/ITabsAdaptiveButtons#align
     * @cfg {String} Выравнивание вкладок по правому или левому краю.
     * @variant left Вкладки выравниваются по левому краю.
     * @variant right Вкладки выравниваются по правому краю.
     * @default right
     */
    align?: string;
    /**
     * @name Controls/_tabs/ITabsAdaptiveButtons#moreButtonAlign
     * @cfg {String} Определяет расположение кнопки "Еще".
     * @variant start Кнопка прижата к левому краю.
     * @variant end Кнопка прижата к правому краю.
     * @demo Controls-demo/Tabs/AdaptiveButtons/MoreButtonAlign/Index
     */
    moreButtonAlign?: TMoreButtonAlign;
    /**
     * @name Controls/_tabs/ITabsAdaptiveButtons#templateType
     * @cfg {String} Определяет тип шаблона отображающего вкладку.
     * @variant TextAndIcon Отображется текст и иконка.
     * @variant Icon Отображется только иконка.
     * @variant IconAndCounter Отображется иконка и счётчик.
     * @variant TextAndCounter Отображется текст и счётчик.
     * @demo Controls-demo/Tabs/AdaptiveButtons/TemplateType/Index
     * @default TextAndIcon
     */
    templateType?: TAdaptiveButtonsTemplate;
    /**
     * @name Controls/_tabs/ITabsAdaptiveButtons#containerWidth
     * @cfg {Number} Ширина контейнера вкладок. Необходимо указывать для правильного расчета ширины вкладок.
     */
    containerWidth: number;
    /**
     * @name Controls/_tabs/ITabsAdaptiveButtons#menuFooterTemplate
     * @cfg {String|TemplateFunction} Шаблон подвала для выпадающего меню кнопки 'Еще'.
     */
    menuFooterTemplate?: string | TemplateFunction;

    /**
     * @name Controls/_tabs/ITabsAdaptiveButtons#items
     * @cfg {RecordSet.<Controls/_tabs/interface/ITabsButtons/ITabAdaptiveButtonItem.typedef>} Рекордсет с конфигурацией вкладок.
     */
    items?: RecordSet<ITabAdaptiveButtonItem>;

    /**
     * @name Controls/_tabs/ITabsAdaptiveButtons#moreButtonView
     * @cfg {String} Режим отображение кнопки "Еще".
     * @variant 'separator' кнопка в виде {@link Controls/ShowMoreButton разделителя с тремя точками}
     * @variant 'link' кнопка в виде текстовой ссылки
     * @default 'link'
     * @demo Controls-demo/Tabs/AdaptiveButtons/MoreButtonView/Index
     */
    moreButtonView?: 'separator' | 'link';
}

/**
 * Интерфейс для опций контрола адаптивных вкладок.
 * @interface Controls/_tabs/ITabsAdaptiveButtons
 * @public
 */

/**
 * Контрол предоставляет пользователю возможность выбрать между двумя или более адаптивными под ширину вкладками.
 *
 * @extends UI/Base:Control
 * @mixes Controls/tabs:ITabsButtons
 * @mixes Controls/tabs:ITabsAdaptiveButtons
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IItems
 *
 * @public
 * @demo Controls-demo/Tabs/AdaptiveButtons/Index
 */

class AdaptiveButtons extends Control<ITabsAdaptiveButtonsOptions, IReceivedState> {
    readonly '[Controls/_tabs/interface/ITabsButtons]': boolean = true;
    protected _template: TemplateFunction = template;
    protected _lastIndex: number = 0;
    protected _items: RecordSet<object>;
    protected _moreButtonWidth: number;
    protected _moreButtonAlign: TMoreButtonAlign = null;
    protected _visibleItems: RecordSet<object>;
    protected _crudWrapper: CrudWrapper;
    protected _menuSource: Memory;
    protected _filter: object;
    protected _itemTemplate: string = 'Controls/tabs:buttonsItemTemplate';
    protected _position: number;
    protected _keyProperty: string;

    protected _beforeMount(
        options?: ITabsAdaptiveButtonsOptions,
        contexts?: object,
        receivedState?: IReceivedState
    ): Promise<IReceivedState> | IReceivedState | void {
        this._keyProperty = options.keyProperty || options.items.getKeyProperty();
        this._moreButtonAlign = this._getMoreButtonAlign(options);
        if (options.containerWidth === undefined || isNaN(options.containerWidth)) {
            Logger.error(
                'Не задана обязательная опция containerWidth. Вкладки не будут построены.',
                this
            );
        }
        this._moreButtonWidth =
            options.moreButtonView === 'separator'
                ? SHOW_MORE_BUTTON_WIDTH
                : this._getTextWidth(MORE_BUTTON_TEXT, 'm');

        if (receivedState) {
            if (options.containerWidth !== receivedState.containerWidth) {
                Logger.warn(
                    'Опция containerWidth на клиенте и сервере имеет разные значения,' +
                        'вкладки могут прыгать при построении',
                    this
                );
            }
            this._setItems(receivedState.items);
            this._checkSelectedKeyOnError(options);
            this._prepareItems(options);
        } else {
            const getReceivedData = (opts: ITabsAdaptiveButtonsOptions) => {
                this._prepareItems(opts);
                return {
                    items: this._items,
                    containerWidth: options.containerWidth,
                };
            };

            if (options.items) {
                this._setItems(options.items);
                return getReceivedData(options);
            } else if (options.source) {
                return new Promise((resolve) => {
                    this._loadItems(options.source).then(() => {
                        resolve(getReceivedData(options));
                    });
                });
            }
        }
    }

    protected _beforeUpdate(newOptions?: ITabsAdaptiveButtonsOptions): void {
        this._checkSelectedKeyOnError(newOptions);
        if (newOptions.source && newOptions.source !== this._options.source) {
            this._loadItems(newOptions.source).then(() => {
                this._prepareItems(newOptions);
            });
        }

        const isItemsChanged = newOptions.items && newOptions.items !== this._options.items;
        const isContainerWidthChanged = newOptions.containerWidth !== this._options.containerWidth;

        if (isItemsChanged) {
            this._setItems(newOptions.items);
        }

        if (isItemsChanged || isContainerWidthChanged) {
            this._prepareItems(newOptions);
        }
    }

    protected _checkSelectedKeyOnError(options) {
        if (this._items && !this._items.getRecordById(options.selectedKey)) {
            Logger.error(
                `В ${
                    options.items ? 'RecordSet' : 'источнике данных'
                } нет элемента с идентификатором,` +
                    ` переданным в опцию selectedKey='${options.selectedKey}'`
            );
        }
    }

    protected _selectedKeyHandler(event: SyntheticEvent<Event>, key: string): void {
        this._notify('selectedKeyChanged', [key]);
    }

    private _setItems(items: RecordSet): void {
        this._items = items;
    }

    private _loadItems(source: SbisService): Promise<void> {
        this._crudWrapper = new CrudWrapper({
            source,
        });
        return this._crudWrapper.query({}).then((items: RecordSet<object>) => {
            this._setItems(items);
        });
    }

    private _menuItemClickHandler(event: SyntheticEvent<Event>, keys: number[] | string[]): void {
        const item: Model<object> = this._items.getRecordById(keys[0]);
        this._selectedKeyHandler(event, item.get(this._keyProperty));
        this._calcVisibleItems(this._items, this._options, keys[0], true);
        this._updateFilter(this._options, keys[0]);
    }

    // при нажатии на кнопку еще останавливаем событие для того, чтобы вкладка не выбралась.
    private _onMouseDownHandler(event: SyntheticEvent<Event>): void {
        event.stopPropagation();
    }

    private _prepareItems(options: ITabsAdaptiveButtonsOptions): void {
        this._items.forEach((item: Model<object>) => {
            item.set('align', options.align);
        });
        this._calcVisibleItems(this._items, options, options.selectedKey);
        if (this._lastIndex < 0) {
            return;
        }
        this._menuSource = this._createMemoryForMenu(this._keyProperty);
        this._updateFilter(options);
    }

    private _createMemoryForMenu(keyProperty: string): Memory {
        return new Memory({
            keyProperty,
            data: this._items.getRawData(),
        });
    }

    private _updateFilter(options: ITabsAdaptiveButtonsOptions, key?: TSelectedKey): void {
        const arrIdOfInvisibleItems = [];
        const filter = {};
        const selectedKey = key || options.selectedKey;
        const keyPropertyOfLastItem = this._visibleItems.at(this._position).get(this._keyProperty);
        // Фильтруем названия не уместившихся вкладок, а так же ту которая в данный момент размещена на экране
        // последней, при условии, что она выбрана.
        this._items.each((item) => {
            if (
                this._visibleItems.getIndexByValue(
                    this._keyProperty,
                    item.get(this._keyProperty)
                ) === -1 ||
                (item.get(this._keyProperty) === keyPropertyOfLastItem &&
                    item.get(this._keyProperty) === selectedKey)
            ) {
                arrIdOfInvisibleItems.push(item.get(this._keyProperty));
            }
        });
        filter[this._keyProperty] = arrIdOfInvisibleItems;
        this._filter = filter;
    }

    private _calcVisibleItems(
        items: RecordSet<object>,
        options: ITabsAdaptiveButtonsOptions,
        key: TSelectedKey,
        afterMenuSelection: boolean = false
    ): void {
        const arrWidth = this._getItemsWidth(items, options.displayProperty, options);
        const containerWidth = options.containerWidth;
        const clonedItems = items.clone().getRawData();
        if (options.align === 'right') {
            arrWidth.reverse();
            clonedItems.reverse();
        }
        const currentItemIndex = clonedItems.findIndex((item) => {
            return item[this._keyProperty] === key;
        });
        let currentContainerWidth =
            this._moreButtonWidth + PADDING_OF_MORE_BUTTON + arrWidth[currentItemIndex];
        const rawData = [];
        const aboutSelection = [];
        rawData.push(clonedItems[currentItemIndex]);
        const minWidth = MIN_WIDTH + MARGIN * COUNT_OF_MARGIN;
        for (let i = 0; i <= arrWidth.length - 1; i++) {
            if (containerWidth - currentContainerWidth > minWidth) {
                if (i !== currentItemIndex) {
                    const add = currentContainerWidth + arrWidth[i] - containerWidth < minWidth;
                    const leftPosition = afterMenuSelection || i < currentItemIndex;
                    if (add) {
                        currentContainerWidth += arrWidth[i];
                        if (leftPosition) {
                            aboutSelection.push(clonedItems[i]);
                        } else {
                            if (options.align === 'right') {
                                rawData.unshift(clonedItems[i]);
                            } else {
                                rawData.push(clonedItems[i]);
                            }
                        }
                    }
                }
            } else {
                break;
            }
        }
        let concatPosition = 0;
        if (
            options.moreButtonAlign === 'start' ||
            (options.align === 'right' && options.moreButtonAlign !== 'end')
        ) {
            aboutSelection.reverse();
            concatPosition = rawData.length;
        }
        rawData.splice(concatPosition, 0, ...aboutSelection);
        rawData.forEach((item) => {
            return (item.canShrink = false);
        });
        this._lastIndex = rawData.length - 1;
        // Чтобы ужималась последняя вкладка.
        const indexCanShrinkElement =
            this._getMoreButtonAlign(options) === 'start' ? 0 : rawData.length - 1;
        rawData[indexCanShrinkElement].canShrink = true;
        this._visibleItems = new RecordSet();
        this._visibleItems.setRawData(rawData);
        this._position =
            this._getMoreButtonAlign(options) === 'start' ? 0 : this._visibleItems.getCount() - 1;
    }

    private _getMoreButtonAlign(options: ITabsAdaptiveButtonsOptions): TMoreButtonAlign {
        if (options.moreButtonAlign) {
            return options.moreButtonAlign;
        } else {
            return options.align === 'right' ? 'start' : 'end';
        }
    }

    private _calcItemWidth(
        item: Model<ITabButtonItem>,
        displayProperty: string,
        templateType: TAdaptiveButtonsTemplate
    ): number {
        let tabTextWidth = 0;
        if (templateType === 'TextAndIcon') {
            tabTextWidth += this._getTextWidth(item.get(displayProperty), 'l');
        } else if (templateType === 'TextAndCounter') {
            tabTextWidth +=
                this._getTextWidth(item.get(displayProperty), 'l') +
                getFontWidth(item.get('mainCounter')?.toString() || '', 'l') +
                MARGIN_BETWEEN_TEXT_COUNTER;
        } else if (templateType === 'IconAndCounter') {
            tabTextWidth +=
                this._getTextWidth(item.get(displayProperty), 'l') + MARGIN_BETWEEN_ICON_COUNTER;
        }
        let tabIconWidth = 0;
        if (templateType === 'IconAndCounter') {
            const iconSize = (item.get('iconSize') || 's') as keyof typeof ICON_WIDTHS;
            tabIconWidth += ICON_WIDTHS[iconSize];
        } else if (templateType === 'Icon') {
            tabIconWidth += ICON_WIDTHS.m;
        } else if (templateType === 'TextAndIcon' && item.get('icon')) {
            tabIconWidth += ICON_WIDTHS.s + MARGIN_BETWEEN_TEXT_ICON;
        }
        if (item.get('icons')) {
            item.get('icons').forEach(() => {
                tabIconWidth += ICON_WIDTHS.s + PADDING_OF_MORE_BUTTON;
            });
        }
        return COUNT_OF_MARGIN * MARGIN + tabTextWidth + tabIconWidth;
    }

    private _getItemsWidth(
        items: RecordSet<object>,
        displayProperty: string,
        options: ITabsAdaptiveButtonsOptions
    ): number[] {
        const widthArray = [];
        for (let i = 0; i < items.getCount(); i++) {
            widthArray.push(
                this._calcItemWidth(
                    items.at(i),
                    displayProperty,
                    options.templateType || 'TextAndIcon'
                )
            );
        }
        return widthArray;
    }

    private _getTextWidth(text: string, size: string = 'l'): number {
        return Math.max(Math.ceil(getFontWidth(text, size)), MIN_ITEM_WIDTH);
    }

    static getDefaultOptions(): Partial<ITabsAdaptiveButtonsOptions> {
        return {
            align: 'right',
            templateType: 'TextAndIcon',
            displayProperty: 'title',
            moreButtonView: 'link',
        };
    }
}

export default AdaptiveButtons;

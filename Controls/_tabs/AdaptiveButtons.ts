/**
 * @kaizen_zone f43717a4-ecb5-4bdd-a32c-4ebbcb125017
 */
import { Control, TemplateFunction } from 'UI/Base';
// @ts-ignore
import * as template from 'wml!Controls/_tabs/AdaptiveButtons/AdaptiveButtons';
import { RecordSet } from 'Types/collection';
import { Memory, SbisService } from 'Types/source';
import { Model } from 'Types/entity';
import { CrudWrapper } from 'Controls/dataSource';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Logger } from 'UI/Utils';
import { ITabButtonItem, ITabsButtonsOptions } from './interface/ITabsButtons';
import { Container as ScrollContainer, IScrollState } from 'Controls/scroll';
import { IItemTemplateOptions } from 'Controls/interface';

interface IReceivedState {
    items: RecordSet<ITabAdaptiveButtonItem>;
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

export interface ITabsAdaptiveButtonsOptions extends ITabsButtonsOptions, IItemTemplateOptions {
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
 * Контрол обладает тем же функционалом, что Controls/tabs:Button, а также позволяет проскролить вкладки, отображая кнопку "Ещё" по необходимости.
 *
 * @extends UI/Base:Control
 * @mixes Controls/tabs:ITabsButtons
 * @mixes Controls/tabs:ITabsAdaptiveButtons
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IItems
 * @mixes Controls/tabs:ITabsTemplate
 *
 * @public
 * @demo Controls-demo/Tabs/AdaptiveButtons/Index
 */

class AdaptiveButtons extends Control<ITabsAdaptiveButtonsOptions, IReceivedState> {
    readonly '[Controls/_tabs/interface/ITabsButtons]': boolean = true;
    protected _template: TemplateFunction = template;
    protected _items: RecordSet<ITabAdaptiveButtonItem>;
    protected _moreButtonAlign: TMoreButtonAlign = null;
    protected _crudWrapper: CrudWrapper;
    protected _menuSource: Memory;
    protected _itemTemplate: string = 'Controls/tabs:buttonsItemTemplate';
    protected _position: number;
    protected _keyProperty: string;
    protected _hasPadding: boolean = false;
    protected _children: {
        ScrollContainer: ScrollContainer;
    };
    protected _scrollLeft: number = 0;

    protected _beforeMount(
        options: ITabsAdaptiveButtonsOptions,
        _?: object,
        receivedState?: IReceivedState
    ): Promise<IReceivedState> | IReceivedState | void {
        this._keyProperty = options.keyProperty || options.items.getKeyProperty();
        this._moreButtonAlign = this._getMoreButtonAlign(options);

        if (receivedState) {
            this._items = receivedState.items;
            this._checkSelectedKeyOnError(options);
            this._prepareItems(options);
        } else {
            const getReceivedData = (opts: ITabsAdaptiveButtonsOptions) => {
                this._prepareItems(opts);
                return {
                    items: this._items,
                };
            };

            if (options.items) {
                this._items = options.items;
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

    protected _setHasPadding() {
        if (this._children.ScrollContainer) {
            this._hasPadding = this._children.ScrollContainer._scrollModel.canHorizontalScroll;
        }
    }

    protected _afterMount() {
        this._setHasPadding();
        if (this._hasPadding && this._container) {
            // После построения сразу смотрим нужен ли отступ.
            // Если не проставить нужные классы сразу, то подскролл к активному элементу отработает не корректно
            this._container.classList.remove('controls-AdaptiveButtons_align-more_empty');
            this._container.classList.add(
                'controls-AdaptiveButtons_align-more_' + this._moreButtonAlign
            );
        }
        // Активная вкладка при построении может находиться неизвестно где, поэтому сами проскролим к активной.
        this._scrollToItem();
    }

    protected _beforeUpdate(newOptions: ITabsAdaptiveButtonsOptions): void {
        this._checkSelectedKeyOnError(newOptions);
        if (newOptions.source && newOptions.source !== this._options.source) {
            this._loadItems(newOptions.source).then(() => {
                this._prepareItems(newOptions);
            });
        }

        const isItemsChanged = newOptions.items && newOptions.items !== this._options.items;

        if (isItemsChanged) {
            this._items = newOptions.items as RecordSet<ITabAdaptiveButtonItem>;
            this._prepareItems(newOptions);
        }
    }

    protected _afterUpdate(oldOptions: ITabsAdaptiveButtonsOptions, oldContext?: unknown): void {
        if (oldOptions.selectedKey !== this._options.selectedKey) {
            this._scrollToItem();
        }
    }

    protected _onWheelHandler(e: SyntheticEvent) {
        if (e.nativeEvent?.deltaY) {
            e.preventDefault();
            this._children.ScrollContainer.scrollTo(
                this._scrollLeft + e.nativeEvent?.deltaY,
                'horizontal',
                true
            );
        }
    }

    protected _getTemplate(
        template: TemplateFunction,
        item: ITabButtonItem,
        itemTemplateProperty: string
    ): TemplateFunction {
        if (itemTemplateProperty) {
            const templatePropertyByItem = item[itemTemplateProperty];
            if (templatePropertyByItem) {
                return templatePropertyByItem;
            }
        }
        return template;
    }

    protected _scrollToItem() {
        const activeContainer = this._container.querySelector(
            `[name=tab${this._options.selectedKey}]`
        ) as HTMLElement;
        if (activeContainer) {
            // В расчётах необходимо также учитывать правый margin, иначе при подскролле к последнему элементу
            // отступ между элементом и навигационным меню будет отсутствовать (вернее он будет скрыт скролом)
            // https://online.sbis.ru/opendoc.html?guid=6e8388ae-d737-4826-8172-0f2e20fff98a
            const activeContainerMarginRight = parseFloat(
                getComputedStyle(activeContainer).marginRight
            );
            const parentContainer = this._container.children[0] as HTMLElement;
            if (
                activeContainer.offsetLeft +
                    activeContainer.offsetWidth +
                    activeContainerMarginRight >
                    this._scrollLeft + parentContainer.offsetWidth ||
                activeContainer.offsetLeft < this._scrollLeft
            ) {
                const endScrollPosition =
                    activeContainer.offsetLeft -
                    (parentContainer.offsetWidth -
                        (activeContainer.offsetWidth + activeContainerMarginRight));
                const startScrollPosition = activeContainer.offsetLeft - activeContainerMarginRight;
                const newScrollPosition =
                    this._scrollLeft < startScrollPosition
                        ? endScrollPosition
                        : startScrollPosition;

                this._children.ScrollContainer.horizontalScrollTo(newScrollPosition);
            }
        }
    }

    protected _scrollStateChangedHandler(_: SyntheticEvent, state: IScrollState): void {
        this._scrollLeft = state.scrollLeft as number;
    }

    protected _checkSelectedKeyOnError(options: ITabsAdaptiveButtonsOptions) {
        if (this._items && !this._items.getRecordById(options.selectedKey)) {
            Logger.error(
                `В ${
                    options.items ? 'RecordSet' : 'источнике данных'
                } нет элемента с идентификатором,` +
                    ` переданным в опцию selectedKey='${options.selectedKey}'`
            );
        }
    }

    protected _selectedKeyHandler(_: SyntheticEvent<Event>, key: string): void {
        this._notify('selectedKeyChanged', [key]);
    }

    protected _getTemplateType(): TAdaptiveButtonsTemplate | string {
        if (this._options.itemTemplate) {
            return 'custom';
        }
        return this._options.templateType as TAdaptiveButtonsTemplate;
    }

    private _loadItems(source: SbisService): Promise<void> {
        this._crudWrapper = new CrudWrapper({
            source,
        });
        return this._crudWrapper.query({}).then((items: RecordSet<ITabAdaptiveButtonItem>) => {
            this._items = items;
        });
    }

    private _menuItemClickHandler(event: SyntheticEvent<Event>, keys: number[] | string[]): void {
        const item: Model<object> = this._items.getRecordById(keys[0]);
        this._selectedKeyHandler(event, item.get(this._keyProperty));
    }

    // при нажатии на кнопку еще останавливаем событие для того, чтобы вкладка не выбралась.
    private _onMouseDownHandler(event: SyntheticEvent<Event>): void {
        event.stopPropagation();
    }

    private _prepareItems(options: ITabsAdaptiveButtonsOptions): void {
        this._items.forEach((item: Model<object>) => {
            item.set('align', options.align);
        });
        this._position =
            this._getMoreButtonAlign(options) === 'start' ? 0 : this._items.getCount() - 1;
        this._menuSource = this._createMemoryForMenu(this._keyProperty);
    }

    private _createMemoryForMenu(keyProperty: string): Memory {
        return new Memory({
            keyProperty,
            data: this._items.getRawData(),
        });
    }

    private _getMoreButtonAlign(options: ITabsAdaptiveButtonsOptions): TMoreButtonAlign {
        if (options.moreButtonAlign) {
            return options.moreButtonAlign;
        } else {
            return options.align === 'right' ? 'start' : 'end';
        }
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

import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-TabsLayout/_tabs/Buttons';
import 'css!Controls-TabsLayout/_tabs/Buttons';
import { IVerticalTabsItem } from 'Controls-TabsLayout/verticalTabs';
import { UnregisterUtil as unregisterUtil, RegisterUtil as registerUtil } from 'Controls/event';
import { Model } from 'Types/entity';
import {
    MIN_TAB_WIDTH,
    MINIMAL_PANEL_DISTANCE,
    ANIMATION_FIX_DELAY,
    MAX_ITEM_CAPTION_LENGTH,
} from './resource/constants';

export interface IFloatingButtonsItem extends IVerticalTabsItem {
    template: string;
    minWidth: number;
    maxWidth: number;
    templateOptions?: object;
    propStorageId?: string;
}

export interface IFloatingButtons extends IControlOptions {
    items?: IFloatingButtonsItem[];
    displayProperty?: string;
}

/**
 * Контрол предоставляет пользователю возможность выбрать между двумя или более вертикальными вкладками,
 * при выборе которых показывается всплывающая панель.
 * @extends UI/Base:Control
 *
 * @public
 * @demo Controls-TabsLayout-demo/Floating/Panel
 */

export default class Buttons extends Control<IFloatingButtons> {
    protected _template: TemplateFunction = template;
    protected _initializedItems: Model<IFloatingButtonsItem>[] = [];
    protected _activeItem: Model<IFloatingButtonsItem>;
    protected _closingItem: Model<IFloatingButtonsItem>;
    protected _openingItem: Model<IFloatingButtonsItem>;
    private _maxWidth: number;
    protected _children: {
        itemsContainer: HTMLElement;
    };
    protected _autoWidth: boolean = false;
    private _delayedActiveItem: Model<IFloatingButtonsItem>;
    protected _itemMaxWidth: number;

    protected _afterRender(): void {
        if (this._delayedActiveItem) {
            this._activeItem = this._delayedActiveItem;
            this._delayedActiveItem = null;
        }
    }

    protected _itemsMouseEnterHandler(): void {
        this._calcMaxWidth();
    }

    protected _hideTabHandler(): void {
        this._closingItem = this._activeItem;
        this._activeItem = null;
        this._fixTransitionBug();
    }

    protected _transitionendHandler(): void {
        if (!this._activeItem) {
            this._autoWidth = false;
            this._closingItem = null;
        } else {
            this._openingItem = null;
        }
    }

    protected _afterMount(): void {
        registerUtil(this, 'controlResize', this._resizeHandler);
    }

    protected _beforeUnmount(): void {
        unregisterUtil(this, 'controlResize');
    }

    private _calcMaxWidth(): void {
        this._maxWidth =
            this._children.itemsContainer._container.getBoundingClientRect().right -
            MINIMAL_PANEL_DISTANCE;
    }

    private _resizeHandler(): void {
        if (this._activeItem) {
            this._calcMaxWidth();
            const prevItemMaxWidth = this._itemMaxWidth;
            this._itemMaxWidth = this._getItemMaxWidth(this._activeItem);

            if (prevItemMaxWidth !== this._itemMaxWidth) {
                // ResizeHandler вызывается после изменения размеров. Пересчет состояния itemMaxWidth применится только
                // в след. синхронизации и пользователь увидит небольшой скачек. чтобы этого не было, меняю maxWidth сам
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this._children[this._activeItem.getId()]._container.style.maxWidth =
                    Math.max(this._itemMaxWidth, MIN_TAB_WIDTH) + 'px';
            }
        }
    }

    private _getItemMaxWidth(item: Model<IFloatingButtonsItem>): number {
        return item.get('maxWidth')
            ? Math.min(this._maxWidth, item.get('maxWidth'))
            : this._maxWidth;
    }

    protected _initTabHandler(event: Event, item: Model<IFloatingButtonsItem>): void {
        if (this._activeItem === item) {
            this._autoWidth = true;
            this._fixTransitionBug();
        }
    }

    protected _itemClickHandler(event: Event, itemKey: number): void {
        this._openPopup(itemKey);
    }

    private _openPopup(itemKey: number): void {
        const item = this._options.items.getRecordById(itemKey);
        if (!this._initializedItems.includes(item)) {
            this._initializedItems.push(item);
        } else {
            this._autoWidth = true;
            this._fixTransitionBug();
        }
        this._delayedActiveItem = item;
        this._itemMaxWidth = this._getItemMaxWidth(item);
        this._openingItem = item;
    }

    private _fixTransitionBug(): void {
        setTimeout(() => {
            this._transitionendHandler();
        }, ANIMATION_FIX_DELAY);
    }

    openPopup(itemKey: number): void {
        this._openPopup(itemKey);
    }

    static getDefaultOptions(): IFloatingButtons {
        return {
            displayProperty: 'title',
        };
    }
}

/**
 * @name Controls-TabsLayout/_tabs/Buttons#displayProperty
 * @cfg {String} Имя поля элемента, значение которого будет отображаться в названии вкладок.
 * @default title
 */

/**
 * @typedef {Object} Controls-TabsLayout/_tabs/Buttons/Item
 * @property {String} [item.caption] Текст внутри вкладки
 * @property {String} [item.mainCounter] Текст счетчика внутри вкладки
 * @property {String} [item.backgroundStyle] Определяет префикс стиля для настройки фона вкладки.
 * @property {String} [item.backgroundImage] Определяет сслыку на изображение для задания фона вкладки.
 * @property {String} [item.template] Определяет имя шаблона, который будет открыт при клике по вкладке.
 * @property {Object} [item.templateOptions] Определяет опции, которые будут переданы в template.
 * @property {Number} [item.minWidth] Определяет минимальный размер шаблона, до которого он может уменьшиться.
 * При задании опции minWidth, maxWidth, propStorageId включается функционал движения границ.
 * @property {Number} [item.maxWidth] Определяет максимальный размер шаблона, до которого он может увеличиться.
 * При задании опции minWidth, maxWidth, propStorageId включается функционал движения границ.
 * @property {String} [item.propStorageId] Уникальный идентификатор контрола, по которому будет сохраняться конфигурация
 * в хранилище данных. При задании опции minWidth, maxWidth, propStorageId включается функционал движения границ.
 */

/**
 * @name Controls-TabsLayout/_tabs/Buttons#items
 * @cfg {RecordSet.<Controls-TabsLayout/_tabs/Buttons/Item.typedef>} Рекордсет с конфигурацией вкладок.
 * @demo Controls-TabsLayout-demo/Floating/Panel
 */

/**
 * Открывает окно
 * @function Controls-TabsLayout/_tabs/Buttons#openPopup
 * @param {Number} itemKey Индификатор элемента
 */

/**
 * @kaizen_zone 26dca2da-6261-4215-a9df-c822621bceb3
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import * as ItemTemplate from 'wml!Controls/_Tumbler/itemTemplate';
import * as Template from 'wml!Controls/_Tumbler/Tumbler';
import * as tumblerItemCounterTemplate from 'wml!Controls/_Tumbler/itemCounterTemplate';
import * as tumblerItemIconTemplate from 'wml!Controls/_Tumbler/itemIconTemplate';
import { ITumblerItemIconTemplate } from './_Tumbler/Interfaces/ITumblerItemIconTemplate';
import { ITumblerItemCounterTemplate } from './_Tumbler/Interfaces/ITumblerItemCounterTemplate';
import {
    IItemTemplateOptions,
    IContrastBackgroundOptions,
    ISingleSelectableOptions,
    IItemsOptions,
    IHeightOptions,
    IFontSizeOptions,
    IBackgroundStyleOptions,
    TSelectedKey,
} from 'Controls/interface';
import { Record } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { constants } from 'Env/Env';
import { ITumblerItem } from './_Tumbler/Interfaces/ITumblerItem';
import 'css!Controls/Tumbler';

interface IBackgroundPosition {
    [key: number]: IBackgroundPositionData;

    isEmpty: boolean;
}

interface IBackgroundPositionData {
    width: number;
    height: number;
    left: number;
    top: number;
}

export interface ITumblerOptions
    extends IItemTemplateOptions,
        IContrastBackgroundOptions,
        IBackgroundStyleOptions,
        ISingleSelectableOptions,
        IControlOptions,
        IItemsOptions<ITumblerItem>,
        IItemTemplateOptions,
        IHeightOptions,
        IFontSizeOptions {
    workspaceWidth?: number;
    allowEmptySelection?: boolean;
    direction?: string;
    disableAnimation?: boolean;
}

/**
 * Контрол представляет собой кнопочный переключатель. Используется, когда на странице необходимо разместить
 * неакцентный выбор из одного или нескольких параметров.
 * @class Controls/Tumbler:Control
 * @implements Controls/interface:IContrastBackground
 * @implements Controls/interface:IBackgroundStyle
 * @implements Controls/interface:ISingleSelectable
 * @implements Controls/interface:IItems
 * @implements Controls/interface:IHeight
 * @public
 * @demo Controls-demo/toggle/Tumbler/Base/Index
 */
class Tumbler extends Control<ITumblerOptions> {
    protected _template: TemplateFunction = Template;
    protected _backgroundPosition: IBackgroundPosition = {isEmpty: true};
    protected _selectedKey: TSelectedKey;
    protected _highlightedOnFocus: boolean;

    protected _beforeMount(options: ITumblerOptions): void {
        this._selectedKey = options.selectedKey;
        this._highlightedOnFocus = this.context?.workByKeyboard && !options.readOnly;
    }

    protected _beforeUpdate(newOptions: ITumblerOptions): void {
        if (this._options.items !== newOptions.items) {
            this._backgroundPosition = {isEmpty: true};
        }
        if (newOptions.selectedKey !== this._options.selectedKey) {
            this._selectedKey = newOptions.selectedKey;
        }
        this._highlightedOnFocus = this.context?.workByKeyboard && !newOptions.readOnly;
    }

    protected _getBackgroundStyle() {
        if (this._options.backgroundStyle && this._options.backgroundStyle !== 'default') {
            return '_' + this._options.backgroundStyle;
        }
        return '';
    }

    protected _onItemClick(event: SyntheticEvent<Event>, item: Model): void {
        const keyProperty = this._options.keyProperty;
        const currentItemClick = item.get(keyProperty);
        const isNewItemSelected = currentItemClick !== this._selectedKey;
        if (!this._options.readOnly && isNewItemSelected) {
            this._selectedKey = this._selectedKey =
                typeof this._options.selectedKey === 'undefined'
                    ? currentItemClick
                    : this._options.selectedKey;
            this._notify('selectedKeyChanged', [currentItemClick]);
        } else if (!isNewItemSelected && this._options.allowEmptySelection) {
            this._notify('selectedKeyChanged', [null]);
        }
    }

    protected _keyUpHandler(e: SyntheticEvent<KeyboardEvent>): void {
        if (e.nativeEvent.keyCode === constants.key.space && !this._options.readOnly) {
            e.preventDefault();
            const newActiveItem = this._getNextActiveItem();
            if (newActiveItem) {
                this._onItemClick(e, newActiveItem);
            }
        }
    }

    private _getNextActiveItem(): Model {
        let firstItem = null;
        let isNextActiveItem: boolean = false;
        let nextActiveItem: Model = null;
        const thisActiveItem = this._options.items.getRecordById(this._selectedKey);
        this._options.items.forEach((item) => {
            if (!firstItem) {
                firstItem = item;
            }
            if (item === thisActiveItem) {
                isNextActiveItem = true;
            } else if (isNextActiveItem) {
                nextActiveItem = item;
                isNextActiveItem = false;
            }
        });
        if (!nextActiveItem) {
            nextActiveItem = firstItem;
        }
        return nextActiveItem;
    }

    protected _mouseEnterHandler(): void {
        this._setBackgroundPosition();
    }

    protected _touchStartHandler(): void {
        this._setBackgroundPosition();
    }

    protected _getShadowClass(): string {
        if (this._options.readOnly) {
            return '';
        }
        if (this._options.contrastBackground) {
            const prefix = this._getPrefixSizesShadow();
            return `controls-Tumbler__shadow_${prefix}`;
        }
        return '';
    }

    protected _getPrefixSizesShadow(): string {
        const arrSmallSize = ['default', 'xs', 's', 'm', 'mt', 'l', 'xl'];
        const result = arrSmallSize.indexOf(this._options.inlineHeight);
        return result !== -1 ? 'small' : 'big';
    }

    protected _getTemplate(
        template: TemplateFunction,
        item: Record,
        itemTemplateProperty: string
    ): TemplateFunction {
        if (itemTemplateProperty) {
            const templatePropertyByItem = item.get(itemTemplateProperty);
            if (templatePropertyByItem) {
                return templatePropertyByItem;
            }
        }
        return template;
    }

    protected _getButtonBackgroundStyle(): string {
        let style = `width:${this._backgroundPosition[this._selectedKey]?.width}px;`;
        if (this._options.direction !== 'vertical') {
            style += ` left:${this._backgroundPosition[this._selectedKey]?.left}px;`;
        } else {
            style += ` height:${this._backgroundPosition[this._selectedKey]?.height}px;`;
            style += ` top:${this._backgroundPosition[this._selectedKey]?.top}px;`;
        }
        return style;
    }

    private _setBackgroundPosition(): void {
        if (this._backgroundPosition.isEmpty) {
            const tumblerClientRect = this._container.getBoundingClientRect();
            this._backgroundPosition = {isEmpty: false};
            this._options.items.forEach((item: Model, index: number) => {
                const key = item.get(this._options.keyProperty);
                const clientRect = (
                    this._children['TumblerButton' + index] as HTMLDivElement
                ).getBoundingClientRect();
                this._backgroundPosition[key] = {
                    width: clientRect.width,
                    height: clientRect.height,
                    left: clientRect.left - tumblerClientRect.left,
                    top: clientRect.top - tumblerClientRect.top,
                };
            });
        }
    }

    static defaultProps: Partial<ITumblerOptions> = {
        keyProperty: 'id',
        inlineHeight: 'default',
        itemTemplate: ItemTemplate,
        direction: 'horizontal',
        contrastBackground: false,
        allowEmptySelection: false,
    };
}

export {
    Tumbler as Control,
    ITumblerItem,
    ITumblerItemIconTemplate,
    ITumblerItemCounterTemplate,
    ItemTemplate,
    tumblerItemCounterTemplate,
    tumblerItemIconTemplate,
};

/**
 * @name Controls/Tumbler:Control#disableAnimation
 * @cfg {Boolean} Определяет отсутствие анимации при переключении.
 * @default false
 */

/**
 * @name Controls/Tumbler:Control#items
 * @cfg {RecordSet.<Controls/_Tumbler/Interfaces/ITumblerItem>} Определяет набор записей по которым строится контрол.
 * @demo Controls-demo/toggle/Tumbler/SelectedKeys/Index
 */

/**
 * @name Controls/Tumbler:Control#workspaceWidth
 * @cfg {Number} Текущая ширина тумблера
 * @remark
 * Если опция задана, то минимальная ширина элементов будут распределена равномерно в зависимости от переданного значения.
 * @demo Controls-demo/toggle/Tumbler/WorkspaceWidth/Index
 */

/**
 * @name Controls/Tumbler:Control#direction
 * @cfg {string} Определяет направление расположения тумблера.
 * @variant horizontal Горизонтальный тумблер.
 * @variant vertical Вертикальный тумблер.
 * @demo Controls-demo/toggle/Tumbler/Direction/Index
 */

/**
 * @name Controls/Tumbler:Control#keyProperty
 * @cfg {string} Имя свойства, содержащего информацию об идентификаторе текущего элемента.
 * @example
 * <pre class="brush: html">
 *      <!-- WML -->
 *      <Controls.Tumbler:Control items="{{_items}}" keyProperty="id"/>
 * </pre>
 * <pre class="brush: js">
 *     // TypeScript
 *     new RecordSet({
 *           rawData: [
 *               {
 *                  id: '1',
 *                  caption: 'Название 1'
 *               },
 *               {
 *                   id: '2',
 *                   caption: 'Название 2'
 *               }
 *           ],
 *           keyProperty: 'id'
 *       });
 * </pre>
 */

/**
 * По умолчанию используется шаблон "Controls/Tumbler:ItemTemplate".
 * Также есть базовый шаблон для отображения записей со счетчиком Controls/Tumbler:tumblerItemCounterTemplate
 * Шаблон tumblerItemCounterTemplate поддерживает следующие параметры:
 * - item {Types/entity:Record} — Отображаемый элемент;
 *    - item.mainCounter {Number} Значение счетчика
 *    - item.mainCounterStyle {String} Стиль отображения счетчика
 * @name Controls/Tumbler:Control#itemTemplate
 * @cfg {TemplateFunction|String}
 * @demo Controls-demo/toggle/Tumbler/ItemTemplate/Index
 * @demo Controls-demo/toggle/Tumbler/MainCounterStyle/Index
 * @example
 * Отображение записей со счетчиками
 * JS:
 * <pre>
 * this._items = new Memory({
 *    keyProperty: 'key',
 *    data: [
 *       {key: 1, caption: 'Element 1', mainCounter: 5},
 *       {key: 2, caption: 'Element 2', mainCounter: 3},
 *       {key: 3, caption: 'Element 3', mainCounter: 7}
 *    ]
 * });
 * </pre>
 *
 * WML
 * <pre>
 *    <Controls.Tumbler:Control items="{{_items}}" >
 *       <ws:itemTemplate>
 *          <ws:partial template="Controls/Tumbler:tumblerItemCounterTemplate" scope="{{itemTemplate}}" />
 *       </ws:itemTemplate>
 *    </Controls.Tumbler:Control>
 * </pre>
 *
 * Отображение записей со счетчиками разных цветов
 * JS:
 * <pre>
 * this._items = new Memory({
 *    keyProperty: 'key',
 *    data: [
 *       {key: 1, caption: 'Element 1', mainCounter: 5, mainCounterStyle: 'secondary'},
 *       {key: 2, caption: 'Element 2', mainCounter: 3, mainCounterStyle: 'warning'},
 *       {key: 3, caption: 'Element 3', counter: 7}
 *    ]
 * });
 * </pre>
 *
 * WML
 * <pre>
 *    <Controls.Tumbler:Control items="{{_items}}" >
 *       <ws:itemTemplate>
 *          <ws:partial template="Controls/Tumbler:tumblerItemCounterTemplate" scope="{{itemTemplate}}" />
 *       </ws:itemTemplate>
 *    </Controls.Tumbler:Control>
 * </pre>
 * @see itemTemplateProperty
 */

/**
 * @name Controls/Tumbler:Control#itemTemplateProperty
 * @cfg {String} Имя свойства, содержащего ссылку на шаблон элемента. Если значение свойства не передано, то для отрисовки используется itemTemplate.
 * @remark
 * Чтобы определить шаблон, вы должны вызвать базовый шаблон.
 * Шаблон размещается в компоненте с использованием тега <ws:partial> с атрибутом "template".
 *
 * @example
 * Пример описания.
 * <pre>
 *    <Controls.Tumbler:Control itemTemplateProperty="myTemplate" source="{{_source}}...>
 *    </Controls.Tumbler:Control>
 * </pre>
 * myTemplate
 * <pre>
 *    <ws:partial template="Controls/Tumbler:ItemTemplate"/>
 * </pre>
 * <pre>
 *    _source: new Memory({
 *       keyProperty: 'id',
 *       data: [
 *          {id: 1, title: 'I agree'},
 *          {id: 2, title: 'I not decide'},
 *          {id: 4, title: 'Will not seem', caption: 'I not agree',  myTemplate: 'wml!.../myTemplate'}
 *       ]
 *    })
 * </pre>
 * @see itemTemplate
 */

/**
 * @name Controls/Tumbler:Control#inlineHeight
 * @cfg {String} Высота контрола.
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @variant 2xl
 * @variant 3xl
 * @variant 4xl
 * @variant 5xl
 * @variant default
 * @default default
 *
 * @example
 * Пример описания.
 * <pre>
 *    <Controls.Tumbler:Control inlineHeight="xl" items="{{_items1}}" bind:selectedKey="_selectedKey1"/>
 * </pre>
 *
 * @demo Controls-demo/toggle/Tumbler/inlineHeight/Index
 */

/**
 * @name Controls/Tumbler:Control#displayProperty
 * @cfg {String} Имя поля элемента, значение которого будет отображаться в названии кнопок тумблера.
 *
 * @example
 * Пример описания.
 * <pre>
 *    <Controls.Tumbler:Control displayProperty="caption" items="{{_items1}}" bind:selectedKey="_selectedKey1"/>
 * </pre>
 *
 * <pre>
 *   new RecordSet({
 *           rawData: [
 *               {
 *                   id: '1',
 *                   caption: 'caption 1',
 *                   title: 'title 1'
 *               },
 *               {
 *                   id: '2',
 *                   caption: 'Caption 2',
 *                   title: 'title 2'
 *               }
 *           ],
 *           keyProperty: 'id'
 *       });
 * </pre>
 *
 * @demo Controls-demo/toggle/Tumbler/displayProperty/Index
 */

/**
 * @name Controls/Tumbler:Control#readOnly
 * @cfg {Boolean}
 * @demo Controls-demo/toggle/Tumbler/ReadOnly/Index
 */

/**
 * @name Controls/Tumbler:Control#backgroundStyle
 * @cfg {string} Допустимые значения для настройки фона контрола.
 * @variant danger
 * @variant success
 * @variant warning
 * @variant primary
 * @variant secondary
 * @variant unaccented
 * @variant info
 * @demo Controls-demo/toggle/Tumbler/BackgroundStyle/Index
 */

/**
 * @name Controls/Tumbler:Control#contrastBackground
 * @cfg {Boolean}
 * @demo Controls-demo/toggle/Tumbler/ContrastBackground/Index
 */

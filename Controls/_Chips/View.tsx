/**
 * @kaizen_zone 2ef52292-ab33-4291-af7c-c7368f992ce2
 */
import * as React from 'react';
import {
    IContrastBackgroundOptions,
    IControlProps,
    IFontSizeOptions,
    IHeightOptions,
    IItemsOptions,
    IItemTemplateOptions,
    IMultiSelectableOptions,
} from 'Controls/interface';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import { TInternalProps } from 'UICore/Executor';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UI/Events';
import { FocusRoot } from 'UI/Focus';
import { default as chipsItemTemplate } from 'Controls/_Chips/itemTemplate';
import { default as ChipsButton } from './ChipsButton';
import { IChipsItem } from './Interfaces/IChipsItem';
import { useReadonly, wasabyAttrsToReactDom } from 'UICore/Jsx';
import { getTextWidth } from 'Controls/sizeUtils';
import { isEqual } from 'Types/object';
import { default as Async } from 'Controls/Container/Async';

export interface IChipsOptions
    extends IMultiSelectableOptions,
        IControlProps,
        IItemsOptions<IChipsItem>,
        IItemTemplateOptions,
        IHeightOptions,
        IFontSizeOptions,
        IContrastBackgroundOptions,
        TInternalProps {
    direction?: string;
    keyProperty?: string;
    multiline?: boolean;
    allowEmptySelection?: boolean;
    displayProperty?: string;
    selectedStyle?: string;
    itemClassName?: string;
    viewMode?: 'filled' | 'ghost';
    onItemClick?: Function;
}

/**
 * Контрол представляет собой набор из нескольких взаимосвязанных между собой кнопок. Используется, когда необходимо выбрать несколько параметров.
 * @class Controls/Chips:Control
 * @extends UI/Base:Control
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/interface:IItems
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IContrastBackground
 * @public
 * @demo Controls-demo/toggle/Chips/Base/Index
 * @demo Controls-demo/toggle/Chips/Icon/Index
 * @demo Controls-demo/toggle/Chips/MultiSelect/Index
 * @demo Controls-demo/toggle/Chips/RoundChips/Index
 */
export default React.forwardRef(function Chips(props: IChipsOptions, ref) {
    const {
        keyProperty = 'id',
        fontSize = 'm',
        itemTemplate = chipsItemTemplate,
        contrastBackground = true,
        inlineHeight = 'm',
        direction = 'horizontal',
        multiline = true,
        allowEmptySelection = true,
        viewMode = 'filled',
        items = [],
    } = props;
    const readOnly = useReadonly(props);
    const [selectedKeys, setSelectedKeys] = React.useState(props.selectedKeys || []);

    React.useLayoutEffect(() => {
        if (props.selectedKeys && !isEqual(selectedKeys, props.selectedKeys)) {
            setSelectedKeys(props.selectedKeys);
        }
    }, [props.selectedKeys]);

    const isSelectedItem = (item: Model): boolean => {
        return selectedKeys.includes(item.get(keyProperty));
    };

    const notifyItemClick = (event: SyntheticEvent<Event>, item: Model): void => {
        props.onItemClick?.(event, item);
    };

    const onItemClick = (event: SyntheticEvent<Event>, item: Model): void => {
        if (!readOnly && !item.get('readOnly')) {
            notifyItemClick(event, item);
            const selectedKeysClone = [...selectedKeys];
            const added = [];
            const deleted = [];
            const itemKeyProperty = item.get(keyProperty);
            const isClickOnSelectedItem = selectedKeysClone.indexOf(itemKeyProperty);
            if (
                !allowEmptySelection &&
                isClickOnSelectedItem !== -1 &&
                selectedKeysClone.length === 1
            ) {
                return;
            }
            const itemIndex = selectedKeysClone.indexOf(itemKeyProperty);
            if (itemIndex === -1) {
                added.push(itemKeyProperty);
                selectedKeysClone.unshift(itemKeyProperty);
            } else {
                deleted.push(itemKeyProperty);
                selectedKeysClone.splice(itemIndex, 1);
            }
            if (!props.selectedKeys) {
                setSelectedKeys(selectedKeysClone);
            }
            props.onSelectedkeyschanged?.(event, selectedKeysClone, added, deleted);
            props.onSelectedKeysChanged?.(event, selectedKeysClone, added, deleted);
        }
    };

    const onMouseEnterHandler = (
        e: React.MouseEventHandler<HTMLSpanElement>,
        item: Model
    ): void => {
        if ((!readOnly || !item.get('readOnly')) && !TouchDetect.getInstance().isTouch()) {
            if (!item.get('tooltip')) {
                if (item.getOwner().getFormat().getFieldIndex('tooltip') === -1) {
                    item.getOwner().addField({
                        name: 'tooltip',
                        type: 'string',
                    });
                }
                const caption = item.get(props.displayProperty || 'title') || item.get('caption');
                const captionWidth = getTextWidth(caption, undefined, true);
                if (captionWidth > e.currentTarget?.clientWidth) {
                    item.set('tooltip', caption);
                }
            }
        }
    };

    const getFontColorStyle = (
        itemData: Model,
        contrastBg: boolean,
        selectedStyle: string
    ): string => {
        const isSelected = isSelectedItem(itemData);
        if (readOnly || itemData.get('readOnly')) {
            return 'readonly' + isSelected ? '-selected' : '';
        }
        const selectedPrefix = 'buttonGroupSelected-';
        const unSelectedPrefix = 'buttonGroupUnselected-';
        if (isSelected) {
            const colorSuffix = selectedStyle === 'primary' ? '_onprimary' : ''; // TODO сделать для остальных цветов
            return (
                selectedPrefix +
                (contrastBg
                    ? 'contrast' + colorSuffix
                    : 'same' + (props.selectedStyle === 'contrast' ? '-contrast' : ''))
            );
        }
        return contrastBg ? 'default' : unSelectedPrefix + 'same';
    };

    const buttonsChips = [];
    items.forEach((item, index) => {
        const value: boolean = isSelectedItem(item);
        const ItemTemplate = props.itemTemplate || itemTemplate;

        const captionTemplate =
            props.itemTemplate ||
            item.get(props.displayProperty || 'title') ||
            item.get('caption') ||
            item.get('counter')
                ? () => {
                      if (typeof ItemTemplate === 'string' || ItemTemplate instanceof String) {
                          return (
                              <Async
                                  templateName={ItemTemplate as string}
                                  templateOptions={{
                                      item,
                                      fontSize,
                                      displayProperty: props.displayProperty,
                                      selected: value,
                                      isCustomCaptionTemplate: true,
                                      ...props.itemTemplateOptions,
                                  }}
                              />
                          );
                      }
                      return (
                          <ItemTemplate
                              item={item}
                              fontSize={fontSize}
                              displayProperty={props.displayProperty}
                              selected={value}
                              isCustomCaptionTemplate={ItemTemplate !== chipsItemTemplate}
                              {...props.itemTemplateOptions}
                          />
                      );
                  }
                : null;
        buttonsChips.push(
            <div
                className={
                    `controls-ButtonGroup__button ${props.itemClassName}` +
                    ` controls-ButtonGroup__button-${
                        isSelectedItem(item) ? 'selected' : 'unselected'
                    }` +
                    ' controls-ButtonGroup__button_withMargin'
                }
                data-qa="controls-ButtonGroup_button"
                key={item.getKey()}
            >
                <ChipsButton
                    key={item.getKey()}
                    inlineHeight={inlineHeight}
                    icon={item.get('icon')}
                    iconStyle={item.get('iconStyle')}
                    iconSize={item.get('iconSize')}
                    iconOptions={item.get('iconOptions')}
                    iconTemplate={item.get('iconTemplate')}
                    caption={item.get(props.displayProperty || 'title') || item.get('caption')}
                    captionPosition={item.get('captionPosition')}
                    counter={item.get('counter')}
                    tooltip={item.get('tooltip')}
                    viewMode={viewMode}
                    value={value}
                    fontColorStyle={getFontColorStyle(
                        item,
                        contrastBackground,
                        props.selectedStyle
                    )}
                    fontSize={fontSize}
                    contrastBackground={contrastBackground}
                    selectedStyle={props.selectedStyle}
                    captionTemplate={captionTemplate}
                    readOnly={readOnly || item.get('readOnly')}
                    dataQa={`controls-ButtonGroup_button-${index}`}
                    onClick={(event: SyntheticEvent<Event>) => {
                        return onItemClick(event, item);
                    }}
                    onMouseEnter={(event: React.MouseEventHandler) => {
                        onMouseEnterHandler(event, item);
                    }}
                />
            </div>
        );
    });

    let className = `controls_toggle_theme-${props.theme} controls-ButtonGroup`;
    if (props.className) {
        className += ' ' + props.className;
    } else if (props.attrs?.className) {
        className += ' ' + props.attrs.className;
    }

    const attrs = wasabyAttrsToReactDom(props.attrs) || {};
    return (
        <FocusRoot
            {...attrs}
            data-qa={props['data-qa'] || attrs['data-qa']}
            as="div"
            className={className}
            ref={ref}
        >
            <div
                className={
                    `controls-ButtonGroup__wrapper controls-ButtonGroup__wrapper-${direction}` +
                    ` controls-ButtonGroup__wrapper-${direction}_${multiline ? 'milti' : ''}line`
                }
            >
                {buttonsChips}
            </div>
        </FocusRoot>
    );
});

/**
 * @name Controls/Chips:Control#selectedStyle
 * @cfg {String} Стиль отображения кнопок в выбранном состоянии.
 * @variant primary
 * @variant secondary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant info
 * @variant contrast
 * @demo Controls-demo/toggle/Chips/SelectedStyle/Index
 */

/**
 * @name Controls/Chips:Control#contrastBackground
 * @cfg {boolean}
 * @default true
 * @demo Controls-demo/toggle/Chips/ContrastBackground/Index
 */

/**
 * @name Controls/Chips:Control#direction
 * @cfg {string} Расположение элементов в контейнере.
 * @variant horizontal Элементы расположены один за другим (горизонтально).
 * @variant vertical Элементы расположены один под другим (вертикально).
 * @default horizontal
 * @demo Controls-demo/toggle/Chips/Direction/Index
 * @example
 * Вертикальная ориентация.
 * <pre>
 *    <Controls.Chips:Control direction="vertical"/>
 * </pre>
 */

/**
 * @name Controls/Chips:Control#multiline
 * @cfg {boolean} Поведение кнопок, если они не умещаются.
 * @variant false Кнопки не переносятся на новую строку.
 * @variant true Кнопки переносятся на новую строку.
 * @default true
 * @demo Controls-demo/toggle/Chips/Multiline/Index
 */

/**
 * @name Controls/Chips:Control#inlineHeight
 * @cfg {String}
 * @demo Controls-demo/toggle/Chips/inlineHeight/Index
 */

/**
 * @name Controls/Chips:Control#fontSize
 * @cfg {String}
 * @demo Controls-demo/toggle/Chips/inlineHeight/Index
 */

/**
 * @name Controls/Chips:Control#displayProperty
 * @cfg {String} Имя поля элемента, значение которого будет отображаться в названии кнопок тумблера.
 *
 * @example
 * Пример описания.
 * <pre>
 *    <Controls.Chips:Control displayProperty="caption" items="{{_items1}}" bind:selectedKey="_selectedKey1"/>
 * </pre>
 *
 * <pre>
 *   new RecordSet({
 *          rawData: [
 *              {
 *                  id: '1',
 *                  caption: 'caption 1',
 *                  title: 'title 1'
 *},
 *              {
 *                  id: '2',
 *                  caption: 'Caption 2',
 *                  title: 'title 2'
 *}
 *          ],
 *          keyProperty: 'id'
 *});
 * </pre>
 *
 * @demo Controls-demo/toggle/Chips/displayProperty/Index
 */

/**
 * По умолчанию используется шаблон "Controls/Chips:chipsItemTemplate".
 * Также есть базовый шаблон для отображения записей со счетчиком Controls/Chips:chipsItemCounterTemplate
 * Шаблон chipsItemCounterTemplate поддерживает следующие параметры:
 * - item {Types / entity:Record} — Отображаемый элемент;
 * - counterProperty {string} — Имя свойства элемента, содержимое которого будет
 * отображаться в счетчике. По умолчанию counter;
 * - counterStyle {string} - Стиль цвета текста счетчика;
 * @name Controls/Chips:Control#itemTemplate
 * @cfg {TemplateFunction | String}
 * @demo Controls-demo/toggle/Chips/ItemTemplate/Index
 * @example
 * Отображение записей со счетчиками
 * JS:
 * <pre>
 * this._items = new RecordSet({
 *    keyProperty: 'key',
 *    rawData: [
 *       {key: 1, caption: 'Element 1', counter: 5},
 *       {key: 2, caption: 'Element 2', counter: 3},
 *       {key: 3, caption: 'Element 3', counter: 7}
 *    ]
 *});
 * </pre>
 *
 * WML
 * <pre>
 *    <Controls.Chips:Control items="{{_items}}">
 *       <ws:itemTemplate>
 *          <ws:partial template="Controls/Chips:chipsItemCounterTemplate" scope="{{itemTemplate}}"/>
 *       </ws:itemTemplate>
 *    </Controls.Chips>
 * </pre>
 */

/**
 * @name Controls/Chips:Control#readOnly
 * @cfg {Boolean}
 * @demo Controls-demo/toggle/Chips/ReadOnly/Index
 */

/**
 * @name Controls/Chips:Control#allowEmptySelection
 * @cfg {Boolean} Использование единичного выбора с возможностью сбросить значение.
 * @demo Controls-demo/toggle/Chips/AllowEmptySelection/Index
 * @default true
 */

/**
 * @name Controls/Chips:Control#items
 * @cfg {RecordSet.<Controls/Chips:IChipsItem>} Определяет набор записей по которым строится контрол.
 */

/**
 * @name Controls/Chips:Control#className
 * @cfg {string} Имя класса, которое навесится на кнопки компонента
 */

/**
 * @name Controls/Chips:Control#keyProperty
 * @cfg {String} Имя поля записи, в котором хранится {@link /docs/js/Types/entity/applied/PrimaryKey/ первичный ключ}.
 * @default id
 */

/**
 * @event itemClick Происходит при клике по элементу.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Record} item Элемент, по которому производим клик.
 */

/**
 * @name Controls/Chips:Control#viewMode
 * @cfg {String} Определяет внешний вид кнопок.
 * @variant filled Залитые кнопки
 * @variant ghost Фон у кнопки появляется при наведении
 * @default filled
 * @demo Controls-demo/toggle/Chips/ViewMode/Index
 */

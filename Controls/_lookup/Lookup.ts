/**
 * @kaizen_zone 20163b44-891b-4f14-8612-0fe88ae5e125
 */
import { default as BaseLookupInput, ILookupInputOptions } from 'Controls/_lookup/BaseLookupInput';
import { SelectedItems } from './BaseControllerClass';
import { getWidth } from 'Controls/sizeUtils';
import { Model } from 'Types/entity';
import * as selectedCollectionUtils from 'Controls/_lookup/SelectedCollection/Utils';
import { default as Collection } from './SelectedCollection';
import { Logger } from 'UI/Utils';
import { SelectedCollectionRenderWithoutHooks } from 'Controls/_lookup/SelectedCollection/SelectedCollectionRender';
import { render, unmountComponentAtNode } from 'react-dom';
import { default as ContentTemplate } from './SelectedCollection/_ContentTemplate';
import { default as CounterTemplate } from './SelectedCollection/CounterTemplate';

const MAX_VISIBLE_ITEMS = 20;
let SHOW_SELECTOR_WIDTH = 0;
let CLEAR_RECORDS_WIDTH = 0;
const MAX_VISIBLE_ITEMS_SINGLE_LINE = 15;

type LookupReceivedState = SelectedItems | null;
export interface ILookupOptions extends ILookupInputOptions {
    multiLine?: boolean;
}
/**
 * Поле ввода с автодополнением и возможностью выбора значений из справочника.
 * Выбранные значения отображаются в виде текста с кнопкой удаления внутри поля ввода.
 *
 * @remark
 * Поддерживает автовысоту в зависимости от выбранных значений {@link multiLine}, а также одиночный и множественный выбор (см. {@link multiSelect}).
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/directory/lookup/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_lookup.less переменные тем оформления}
 *
 *
 * @class Controls/_lookup/Lookup
 * @extends UI/Base:Control
 * @implements Controls/interface:ILookup
 * @implements Controls/interface/ISelectedCollection
 * @implements Controls/interface:ISelectorDialog
 * @implements Controls/interface:ISuggest
 * @implements Controls/interface:ISearch
 * @implements Controls/interface:ISource
 * @implements Controls/interface:ISelectFields
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/interface:ITextValue
 * @implements Controls/interface:ISorting
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:ISelectionType
 * @implements Controls/input:IBase
 * @implements Controls/interface:IInputPlaceholder
 * @implements Controls/input:IText
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IInputTag
 * @implements Controls/input:IValue
 * @implements Controls/interface:IValidationStatus
 * @implements  Controls/input:IBorderVisibility
 * @implements Controls/input:IPadding
 * @implements Controls/interface:IFontWeight
 * @implements Controls/interface:IBackgroundStyle
 * @implements Controls/input:IFieldTemplate
 *
 * @demo Controls-demo/LookupNew/Input/AddButton/Index
 *
 * @public
 */

/**
 * @name Controls/_lookup/Lookup#suggestDataLoadCallback
 * @cfg {Function} Функция, которая вызывается каждый раз  для контрола автодоплнения непосредственно после загрузки данных из источника.
 */

/**
 * @name Controls/_lookup/Lookup#addButtonClickCallback
 * @cfg {Function} Обрабочик клика по кнопке добавления.
 * @remark Данную опцию необходимо задать для отображения кнопки добавления.
 */

/**
 * @name Controls/_lookup/Lookup#closeButtonVisible
 * @cfg {Boolean} Флаг, отвечающий за отображение кнопки закрытия автодополнения.
 */

/**
 * Открывает окно автодополнения.
 * @function Controls/_interface/ILookup#openSuggest
 */

/*
 * “Lookup:Input” is an input field with auto-completion and the ability to select a value from the directory.
 * Сan be displayed in single-line and multi-line mode.
 * Supports single and multiple selection.
 * Here you can see <a href="/materials/DemoStand/app/Controls-demo%2FLookup%2FIndex">demo-example</a>.
 * If you use the link to open the directory inside the tooltip of the input field, you will need {@link Controls/lookup:Link}.
 * If you want to make a dynamic placeholder of the input field, which will vary depending on the selected collection, use {@link Controls/multipleLookup:PlaceholderChooser}.
 * If you need a choice of several directories, one value from each, then {@link Controls / lookup: MultipleInput} is suitable for you.
 *
 * @class Controls/_lookup/Lookup
 * @extends UI/Base:Control
 * @implements Controls/interface:ILookup
 * @implements Controls/interface/ISelectedCollection
 * @implements Controls/interface:ISelectorDialog
 * @implements Controls/interface:ISuggest
 * @implements Controls/interface:ISearch
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/interface:ITextValue
 * @implements Controls/interface:ISorting
 * @mixes Controls/input:IBase
 * @mixes Controls/input:IText
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IInputTag
 * @mixes Controls/input:IValue
 *
 * @public
 * @author Герасимов А.М.
 */
export default class Lookup extends BaseLookupInput {
    protected _listOfDependentOptions: string[] = [
        'multiSelect',
        'multiLine',
        'displayProperty',
        'maxVisibleItems',
        'readOnly',
        'comment',
    ];
    protected _rootContainerClasses: string = 'controls-Lookup';
    protected _multiLineState: boolean = false;
    protected _inputWidth: number;
    protected _availableWidthCollection: number = null;
    protected _counterWidth: number;
    protected _fieldWrapperMinHeight: number = null;

    protected _beforeMount(
        options: ILookupOptions,
        context,
        receivedState: LookupReceivedState
    ): Promise<unknown> | void {
        const beforeMountResult = super._beforeMount(options, context, receivedState);
        if (beforeMountResult instanceof Promise) {
            return beforeMountResult.then(() => {
                this._setMultiLineState(options);
            });
        } else {
            this._setMultiLineState(options);
        }
    }

    private _setMultiLineState(options: ILookupOptions): void {
        const itemsCount = options.items?.getCount();
        if (!options.needCalculateMultiLine) {
            this._multiLineState = options.multiLine && itemsCount;
        }
    }

    _calculateSizes(options: ILookupOptions): void {
        const itemsCount = this._getSelectedItemsCount(options);
        let counterWidth;
        let fieldWrapperWidth;
        let allItemsInOneRow = false;
        let maxVisibleItems = options.maxVisibleItems;
        let rightFieldWrapperWidth = 0;
        let availableWidth = null;
        let inputWidth;
        let lastRowCollectionWidth;
        let lastSelectedItems;
        let multiLineState = !!(options.multiLine && itemsCount);
        const isShowCounter = this._isShowCounter(multiLineState, itemsCount, maxVisibleItems);

        const setSizesState = (): void => {
            this._multiLineState = multiLineState;
            this._inputWidth = inputWidth;
            this._maxVisibleItems = maxVisibleItems;
            this._availableWidthCollection = availableWidth;
            this._counterWidth = counterWidth;
        };

        if (this._isNeedCalculatingSizes(options)) {
            this._initializeConstants();
            // in mode read only and single line, counter does not affect the collection
            if (isShowCounter && (!options.readOnly || options.multiLine)) {
                counterWidth = this._getCounterWidth(
                    itemsCount,
                    options.theme,
                    options.fontSize,
                    options.multiLine
                );
            }

            fieldWrapperWidth = this._getFieldWrapperWidth();
            lastSelectedItems = this._getLastSelectedItems(this._items, MAX_VISIBLE_ITEMS);
            this._getItemsSizesLastRow(
                fieldWrapperWidth,
                lastSelectedItems,
                options,
                counterWidth,
                (itemsSizesLastRow) => {
                    allItemsInOneRow =
                        !options.multiLine ||
                        itemsSizesLastRow.length ===
                            Math.min(lastSelectedItems.length, maxVisibleItems);
                    rightFieldWrapperWidth = this._getRightFieldWrapperWidth(
                        itemsCount,
                        !allItemsInOneRow,
                        options.readOnly
                    );

                    // For multi line define - inputWidth, for single line - maxVisibleItems
                    if (options.multiLine) {
                        availableWidth = this._getAvailableCollectionWidth(
                            rightFieldWrapperWidth,
                            options.readOnly,
                            options.multiSelect,
                            options.comment
                        );
                        lastRowCollectionWidth = this._getCollectionWidth(itemsSizesLastRow);
                        if (options.needCalculateMultiLine) {
                            multiLineState = this._getMultiLineState(
                                lastRowCollectionWidth,
                                availableWidth,
                                allItemsInOneRow
                            );
                        }
                        inputWidth = this._getInputWidth(
                            fieldWrapperWidth,
                            lastRowCollectionWidth,
                            availableWidth,
                            rightFieldWrapperWidth,
                            multiLineState,
                            counterWidth,
                            options.needCalculateMultiLine
                        );
                    } else {
                        maxVisibleItems = MAX_VISIBLE_ITEMS_SINGLE_LINE;
                    }
                    setSizesState();
                }
            );
        } else {
            multiLineState = false;
            maxVisibleItems = itemsCount;
            setSizesState();
        }
    }

    private _getInputWidth(
        fieldWrapperWidth: number,
        lastRowCollectionWidth: number,
        availableWidth: number,
        rightFieldWrapperWidth: number,
        multiLineState: boolean,
        counterWidth: number,
        needCalculateMultiLine: boolean
    ): number {
        if (lastRowCollectionWidth <= availableWidth && needCalculateMultiLine) {
            const rowWidth =
                counterWidth && !multiLineState
                    ? lastRowCollectionWidth + counterWidth
                    : lastRowCollectionWidth;
            return fieldWrapperWidth - rowWidth - rightFieldWrapperWidth;
        }
    }

    private _getMultiLineState(
        lastRowCollectionWidth: number,
        availableWidth: number,
        allItemsInOneRow: boolean
    ): boolean {
        return lastRowCollectionWidth > availableWidth || !allItemsInOneRow;
    }

    private _getCollectionWidth(itemsSizes: number[]): number {
        return itemsSizes.reduce((currentWidth, itemWidth) => {
            return currentWidth + itemWidth;
        }, 0);
    }

    private _isShowCounter(
        multiLine: boolean,
        itemsCount: number,
        maxVisibleItems: number
    ): boolean {
        return (multiLine && itemsCount > maxVisibleItems) || (!multiLine && itemsCount > 1);
    }

    private _getCounterWidth(
        itemsCount: number,
        theme: string,
        fontSize: string,
        multiLine: boolean
    ): number {
        const counterAlignment = multiLine ? 'left' : 'right';
        return selectedCollectionUtils.getCounterWidth(
            itemsCount,
            theme,
            fontSize,
            counterAlignment
        );
    }

    private _getLastSelectedItems(items: SelectedItems, maxVisibleItems: number): Model[] {
        const selectedItems = [];
        const count = items.getCount();
        const startIndex = count - maxVisibleItems < 0 ? 0 : count - maxVisibleItems;

        for (let i = startIndex; i < count; i++) {
            selectedItems.push(items.at(i));
        }

        return selectedItems;
    }

    private _getItemsSizesLastRow(
        fieldWrapperWidth: number,
        items: Model[],
        newOptions: ILookupInputOptions,
        counterWidth: number,
        callback
    ): number[] {
        const measurer = document.createElement('div');
        const maxVisibleItems = newOptions.multiLine ? newOptions.maxVisibleItems : items.length;
        const itemsSizes = [];

        let itemsTemplateResult = SelectedCollectionRenderWithoutHooks({
            ...Collection.getDefaultOptions(),
            ...this._getCollectionOptions(newOptions, maxVisibleItems, counterWidth),
            visibleItems: this._getLastSelectedItems(this._items, maxVisibleItems),
            getItemMaxWidth: selectedCollectionUtils.getItemMaxWidth,
            getItemOrder: selectedCollectionUtils.getItemOrder,
            getItemGridStyles: selectedCollectionUtils.getItemGridStyles,
            contentTemplate: ContentTemplate,
            counterTemplate: CounterTemplate,
        });

        if (itemsTemplateResult instanceof Promise) {
            Logger.error(
                'Lookup: шаблон элемента (itemTemplate) вернул некорректный результат. ' +
                    'Для построения itemTemplate необходимо, чтобы все шаблоны и контролы, ' +
                    'используемые в шаблоне, были загружены',
                this
            );
            itemsTemplateResult = '';
        }

        if (newOptions.multiLine) {
            measurer.style.width = fieldWrapperWidth - SHOW_SELECTOR_WIDTH + 'px';
        }

        measurer.classList.add('controls-Lookup-collection__measurer');
        document.body.appendChild(measurer);
        render(itemsTemplateResult, measurer, () => {
            const collectionItems = measurer.getElementsByClassName(
                'js-controls-SelectedCollection__item'
            );
            const itemsCount = collectionItems.length;

            // items only from the last line
            for (
                let index = itemsCount - 1;
                index >= 0 &&
                collectionItems[index].offsetTop === collectionItems[itemsCount - 1].offsetTop;
                index--
            ) {
                itemsSizes.unshift(Math.ceil(collectionItems[index].getBoundingClientRect().width));
            }

            unmountComponentAtNode(measurer);
            measurer.remove();

            callback(itemsSizes);
        });
    }

    private _getCollectionOptions(
        options: ILookupInputOptions,
        maxVisibleItems: number,
        counterWidth: number
    ): object {
        const collectionConfig = {
            itemsLayout: options.multiLine ? 'default' : 'oneRow',
            maxVisibleItems,
            _counterWidth: counterWidth,
            theme: options.theme,
            items: this._items,
        };
        const depOptions = ['itemTemplate', 'readOnly', 'displayProperty'];

        depOptions.forEach((optName) => {
            if (options.hasOwnProperty(optName)) {
                collectionConfig[optName] = options[optName];
            }
        });

        return collectionConfig;
    }

    private _getRightFieldWrapperWidth(
        itemsCount: number,
        multiLine: boolean,
        readOnly: boolean
    ): number {
        let rightFieldWrapperWidth = 0;

        if (!readOnly) {
            rightFieldWrapperWidth += SHOW_SELECTOR_WIDTH;
        }

        if (!multiLine && itemsCount > 1) {
            rightFieldWrapperWidth += CLEAR_RECORDS_WIDTH;
        }

        return rightFieldWrapperWidth;
    }

    private _getAvailableCollectionWidth(
        rightFieldWrapperWidth: number,
        readOnly: boolean,
        multiSelect: boolean,
        comment: string
    ): number {
        // we get the height of a single-line Lookup control, which would then calculate the minimum width of the input
        const fieldWrapperMinHeight = this._getFieldWrapperMinHeight();
        const fieldWrapperWidth = this._getFieldWrapperWidth();
        const fieldWrapperStyles = this._getFieldWrapperComputedStyle();
        const fieldWrapperWidthWithPaddings =
            fieldWrapperWidth +
            parseInt(fieldWrapperStyles.paddingLeft, 10) +
            parseInt(fieldWrapperStyles.paddingRight, 10) +
            parseInt(fieldWrapperStyles.borderLeftWidth, 10) +
            parseInt(fieldWrapperStyles.borderRightWidth, 10);
        let additionalWidth = rightFieldWrapperWidth;

        if (!readOnly && (multiSelect || comment)) {
            additionalWidth += this._getInputMinWidth(
                fieldWrapperWidthWithPaddings,
                rightFieldWrapperWidth,
                fieldWrapperMinHeight
            );
        }

        return fieldWrapperWidth - additionalWidth;
    }

    private _getFieldWrapperComputedStyle(): CSSStyleDeclaration {
        return getComputedStyle(this._getFieldWrapper());
    }

    private _getInputMinWidth(
        fieldWrapperWidth: number,
        rightFieldWrapperWidth: number,
        fieldWrapperMinHeight: number
    ): number {
        /* By the standard, the minimum input field width is 33%, but not more than 4 field wrapper min height */
        const minWidthFieldWrapper = (fieldWrapperWidth - rightFieldWrapperWidth) / 3;
        return Math.min(minWidthFieldWrapper, 4 * fieldWrapperMinHeight);
    }

    private _getFieldWrapperMinHeight(): number {
        if (this._fieldWrapperMinHeight === null) {
            const fieldWrapperStyles = getComputedStyle(this._getFieldWrapper());
            this._fieldWrapperMinHeight =
                parseInt(fieldWrapperStyles['min-height'], 10) ||
                parseInt(fieldWrapperStyles.height, 10);
        }

        return this._fieldWrapperMinHeight;
    }

    private _initializeConstants(): void {
        if (!SHOW_SELECTOR_WIDTH) {
            const props = {
                theme: this._options.theme,
            };
            const showSelectorTemplate = [
                this._showSelectorTemplate.render(props),
            ] as unknown as HTMLElement;
            SHOW_SELECTOR_WIDTH = getWidth(showSelectorTemplate);
            const clearRecordsTemplate = [
                this._clearRecordsTemplate.render(props),
            ] as unknown as HTMLElement;
            CLEAR_RECORDS_WIDTH = getWidth(clearRecordsTemplate);
        }
    }

    _isInputVisible(options: ILookupOptions): boolean {
        const isEmpty = this._isEmpty();
        const readOnly = options.readOnly;
        const inputValue = !!this._getInputValue(options);
        return (
            (!(
                options.multiLine &&
                !options.multiSelect &&
                this._getSelectedItemsCount(options) > 0
            ) &&
                (!readOnly || (inputValue && !options.multiSelect)) &&
                !!(isEmpty || options.multiSelect || options.comment)) ||
            (readOnly &&
                ((isEmpty && options.placeholder && options.placeholderVisibility === 'empty') ||
                    (inputValue && options.commentVisibility === 'always')))
        );
    }

    _isNeedCalculatingSizes(options: ILookupOptions): boolean {
        return (
            !this._isEmpty() &&
            ((options.multiSelect && options.multiLine) || options.comment) &&
            (!options.readOnly || this._items?.getCount() > 1)
        );
    }
}
/**
 * @name Controls/_lookup/Lookup#multiLine
 * @cfg {Boolean} Определяет, включать ли режим автовысоты при выборе записей,
 * когда включён этот режим, поле связи может отображаться в несколько строк.
 * @default false
 * @remark
 * Когда поле связи находится в многострочном режиме, то высота определяется автоматически по выбранным записям. Количество отображаемых записей устанавливается опцией {@link Controls/interface/ISelectedCollection#maxVisibleItems}.
 * Актуально только при multiSelect: true.
 *
 * @example
 * WML:
 * <pre>
 *    <Controls.lookup:Input
 *       source="{{_source}}"
 *       keyProperty="id"
 *       searchParam="title"
 *       multiSelect="{{true}}"
 *       multiLine="{{true}}">
 *    </Controls.lookup:Input>
 * </pre>
 *
 * @see Controls/interface/ISelectedCollection#maxVisibleItems
 * @see Controls/interface/ISelectedCollection#multiSelect
 */
/*
 * @name Controls/_lookup/Lookup#multiLine
 * @cfg {Boolean} Determines then Lookup can be displayed in multi line mode.
 * @default false
 * @remark
 * When the communication field is in multi-line mode, the height is automatically determined by the selected records. The number of records displayed is set by the {@link Controls/interface/ISelectedCollection#maxVisibleItems} option.
 * Only relevant with multiSelect: true.
 *
 * @example
 * WML:
 * <pre>
 *    <Controls.lookup:Input
 *       source="{{_source}}"
 *       keyProperty="id"
 *       searchParam="title"
 *       multiSelect="{{true}}"
 *       multiLine="{{true}}">
 *    </Controls.lookup:Input>
 * </pre>
 *
 * @see Controls/interface/ISelectedCollection#maxVisibleItems
 * @see Controls/interface/ISelectedCollection#multiSelect
 */

/**
 * @name Controls/_lookup/Lookup#comment
 * @cfg {String} Текст, который отображается в {@link placeholder подсказке} поля ввода, если в поле связи выбрано значение.
 * @remark
 * Если указана опция comment, то для поля связи будет включён режим,
 * в котором после выбора записи, поле ввода будет продолжать отображаться.
 * Актуально только в режиме единичного выбора.
 * Введённый комментарий можно получить из опции value поля связи.
 * @example
 * WML:
 * <pre>
 *     <Controls.lookup:Input
 *             comment='Введите комментарий'
 *             displayProperty='name'
 *             keyProperty='id'
 *             multiSelect='{{false}}'
 *             source='{{_source}}'
 *             bind:value='_value'
 *             bind:selectedKeys='_selectedKeys'/>
 * </pre>
 *
 * JS:
 * <pre>
 *     import {Memory} from 'Types/source';
 *
 *     protected _beforeMount() {
 *        this._source = new Memory({
 *            keyProperty: 'id'
 *            data: [
 *               { id: 1, name: 'Sasha' },
 *               { id: 2, name: 'Mark' },
 *               { id: 3, name: 'Jasmin' },
 *               { id: 4, name: 'Doggy' }
 *            ]
 *        });
 *        this._selectedKeys = [];
 *     }
 * </pre>
 * @see placeholder
 */
/*
 * @name Controls/_lookup/Lookup#comment
 * @cfg {String} The text that is displayed in the empty comment box.
 * @remark
 * Actual only in the mode of single choice.
 * If the value is not specified, the comment field will not be displayed.
 */

/**
 * @name Controls/_lookup/Lookup#suggestSource
 * @cfg {Types/source:ICrudPlus} Устанавливает источник для автодополнения.
 * @remark
 * Если опция не указана, то вместо нее автоматически передается значение опции {@link Controls/_lookup/Lookup#source}.
 *
 * @example
 * WML:
 * <pre>
 *    <Controls.lookup:Input
 *       suggestSource="{{_source}}"
 *       keyProperty="id"
 *       searchParam="title"
 *       multiSelect="{{true}}">
 *    </Controls.lookup:Input>
 * </pre>
 * @see suggestKeyProperty
 */

/**
 * @name Controls/_lookup/Lookup#suggestKeyProperty
 * @cfg {String} Устанавливает поле с первичным ключем для автодополнения.
 * @remark
 * Если опция не указана, то вместо нее автоматически передается значение опции {@link Controls/_lookup/Lookup#keyProperty}.
 *
 * @example
 * WML:
 * <pre>
 *    <Controls.lookup:Input
 *       suggestSource="{{_source}}"
 *       suggestKeyProperty="id"
 *       searchParam="title"
 *       multiSelect="{{true}}">
 *    </Controls.lookup:Input>
 * </pre>
 * @see suggestSource
 */

/**
 * @name Controls/_lookup/Lookup#items
 * @cfg {Types/collection:RecordSet} Устанавливает значения без использования источника.
 *
 * @example
 * WML:
 * <pre>
 *    <Controls.lookup:Input
 *       items="{{_items}}"
 *       keyProperty="id"
 *       searchParam="title"
 *       multiSelect="{{true}}">
 *    </Controls.lookup:Input>
 * </pre>
 */

/**
 * @name Controls/_lookup/Lookup#fontSize
 * @cfg {String}
 * @demo Controls-demo/LookupNew/Input/FontSize/Index
 */

/**
 * @name Controls/_lookup/Lookup#toolbarItems
 * @cfg {Controls/toolbars:IToolbarSource/Item.typedef} Набор записей для дополнительных команд в правой части поля ввода.
 * @demo Controls-demo/LookupNew/Input/ToolbarItems/Index
 */

/**
 * @name Controls/_lookup/Lookup#rightFieldTemplate
 * @cfg {String|TemplateFunction} Строка или шаблон, содержащие прикладной контент, который будет отображаться справа от текста в поле ввода.
 * @demo Controls-demo/LookupNew/Input/RightFieldTemplate/Index
 */

/**
 * @name Controls/_lookup/Lookup#showSelectButton
 * @cfg {Boolean} Управляет отображением кнопки выбора из справочника.
 * @default true
 */

/**
 * @typedef {String} TCommentVisibility
 * @description Режим отображения комментария.
 * @variant always Комментарий отображается всегда и не зависит от выбранных значений.
 * @variant relatedToSelectedItem Комментарий связан с выбранным значнием. При сборсе выбранного значения, комментарий будет сброшен.
 */

/**
 * @name Controls/_lookup/Lookup#commentVisibility
 * @cfg {TCommentVisibility} Управляет отображением комментария.
 * @default relatedToSelectedItem
 * @remark Актуально при установленной опции {@link comment}
 * @see comment
 */

/**
 * @name Controls/_lookup/Lookup#showClearButton
 * @cfg {Boolean} Определяет, отображается ли кнопка очистки выбранных записей
 * @remark Опция актуальна для множественного выбора
 * @default true
 * @demo Controls-demo/LookupNew/SelectorButton/ShowClearButton/Index
 */

/**
 * @name Controls/_lookup/Lookup#toolbarItemClick
 * @event Происходит при клике по дополнительной команде в правой части поля ввода.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Record} item Элемент, по которому производим клик.
 * @param {Object} nativeEvent Объект нативного события браузера.
 */

/**
 * @name Controls/_lookup/Lookup#choose
 * @event Происходит при выборе элемента из автодополнения. Прикладной разработчик может вернуть false в обработчике события, в таком случае установки выбранной записи в поле выбора не производится.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Выбранный элемент.
 * @param {string} tabsSelectedKey Ключ выбранного таба.
 */

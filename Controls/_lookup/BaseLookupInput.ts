/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import { TemplateFunction } from 'UI/Base';
import { default as BaseLookup, ILookupOptions } from 'Controls/_lookup/BaseLookup';
import * as template from 'wml!Controls/_lookup/BaseLookupInput/BaseLookupInput';
import { default as clearRecordsTemplate } from './BaseLookupView/resources/clearRecordsTemplate';
import { default as showSelectorTemplate } from './BaseLookupView/resources/showSelectorTemplate';
import { RegisterUtil, UnregisterUtil } from 'Controls/event';
import { DOMUtil } from 'Controls/sizeUtils';
import { SyntheticEvent } from 'Vdom/Vdom';
import { List, RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { constants, detection } from 'Env/Env';
import {
    IBaseOptions,
    IFieldTemplate,
    IPaddingOptions,
    ITextOptions,
    IValueOptions,
} from 'Controls/input';
import {
    IBackgroundStyleOptions,
    IContrastBackgroundOptions,
    ISelectorDialogOptions,
    ISuggest,
} from 'Controls/interface';
import { isEqual } from 'Types/object';
import { EventUtils } from 'UI/Events';
import { ICrudPlus } from 'Types/source';
import InputRenderLookup from './BaseLookupView/InputRender';
import { DependencyTimer, IStackPopupOptions, StackOpener } from 'Controls/popup';
import { _InputController as LayoutInputContainer } from 'Controls/suggest';
import { load } from 'WasabyLoader/Library';
import { default as itemTemplate } from './SelectedCollection/ItemTemplate';
import showSelector from 'Controls/_lookup/showSelector';

type TSuggestDirection = 'up' | 'down';

export interface ILookupInputOptions
    extends ILookupOptions,
        ITextOptions,
        IValueOptions<string>,
        IBaseOptions,
        ISelectorDialogOptions,
        IPaddingOptions,
        IContrastBackgroundOptions,
        IBackgroundStyleOptions,
        IFieldTemplate,
        ISuggest {
    suggestSource?: ICrudPlus;
    multiLine?: boolean;
    autoDropDown?: boolean;
    comment?: string;
    toolbarItems?: RecordSet;
    toolbarKeyProperty?: string;
    toolbarParentProperty?: string;
    toolbarNodeProperty?: string;
    minSearchLength?: number;
    addButtonClickCallback?: Function;
    closeButtonVisible?: boolean;
    commentVisibility?: 'always' | 'relatedToSelectedItem';
}

export default abstract class BaseLookupInput extends BaseLookup<ILookupInputOptions> {
    protected _template: TemplateFunction = template;
    protected _clearRecordsTemplate: TemplateFunction = clearRecordsTemplate;
    protected _showSelectorTemplate: TemplateFunction = showSelectorTemplate;
    protected _notifyHandler: Function = EventUtils.tmplNotify;
    protected _itemTemplateClasses: string;
    private _fieldWrapper: HTMLElement;
    private _fieldWrapperWidth: number = null;
    private _inputValue: string;
    private _active: boolean = false;
    private _infoboxOpened: boolean = false;
    private _toolbarMenuOpened: boolean = false;
    private _needSetFocusInInput: boolean = false;
    private _suggestState: boolean = false;
    private _subscribedOnResizeEvent: boolean = false;
    protected _horizontalPadding: string;
    protected _maxVisibleItems: number = 0;
    protected _listOfDependentOptions: string[] = [];
    protected _opener: StackOpener = null;
    protected _suggestDirection: TSuggestDirection;
    protected _multiLineState?: boolean;

    private _loadSelectorTemplatePromise: Promise<unknown> = null;
    private _dependenciesTimer: DependencyTimer = null;

    protected _children: {
        inputRender: typeof InputRenderLookup;
        layout: LayoutInputContainer;
    };

    protected _inheritorBeforeMount(options: ILookupInputOptions): void {
        const itemsCount = this._items.getCount();

        if (!options.multiSelect) {
            this._maxVisibleItems = 1;
        } else {
            this._maxVisibleItems = options.maxVisibleItems || itemsCount;
        }
        this._updateHorizontalPadding(options);
    }

    private _updateHorizontalPadding(options: ILookupInputOptions): void {
        let padding;
        if (options.horizontalPadding) {
            padding = options.horizontalPadding;
        } else if (options.contrastBackground !== false) {
            padding = 'xs';
        } else {
            padding = 'null';
        }
        this._horizontalPadding = padding;
    }

    protected _inheritorBeforeUpdate(newOptions: ILookupInputOptions): void {
        let isNeedUpdate = !isEqual(newOptions.selectedKeys, this._options.selectedKeys);
        this._updateInputValue(newOptions, isNeedUpdate);

        if (!isNeedUpdate) {
            this._listOfDependentOptions.forEach((optName) => {
                if (newOptions[optName] !== this._options[optName]) {
                    isNeedUpdate = true;
                }
            });
        }

        if (isNeedUpdate) {
            this._calculateSizes(newOptions);
        }

        if (!this._isInputActive(newOptions) || !this._isSuggestCanBeShown()) {
            this.closeSuggest();
        }

        this._subscribeOnResizeEvent(newOptions);
    }

    protected _updateInputValue(options: ILookupInputOptions, selectedKeysChanged: boolean): void {
        if (this._options.value !== options.value) {
            this._setInputValue(options, options.value);
        } else if (selectedKeysChanged && !options.comment) {
            this._resetInputValue();
        }
    }

    protected _getViewMode() {
        return this._multiLineState
            ? this._options.multiLine && !this._options.multiSelect
                ? 'single-multiLine'
                : 'multiLine'
            : 'singleLine';
    }

    protected _afterMount(options: ILookupInputOptions): void {
        super._afterMount(options);
        if (!this._isEmpty()) {
            this._calculateSizes(options);
        }

        this._subscribeOnResizeEvent(options);
    }

    protected _beforeUnmount(): void {
        super._beforeUnmount();
        UnregisterUtil(this, 'controlResize');
        this._opener?.destroy();
    }

    protected _afterUpdate(): void {
        if (this._needSetFocusInInput) {
            this._needSetFocusInInput = false;

            /* focus can be moved in choose event */
            if (this._active) {
                this.activate();

                if (this._determineAutoDropDown()) {
                    this._suggestState = true;
                }
            }
        }
    }

    protected _toolbarItemClickHandler(
        event: SyntheticEvent<null>,
        item: Record,
        nativeEvent: MouseEvent
    ): void {
        this.closeSuggest();
        this._notify('toolbarItemClick', [item, nativeEvent]);
    }

    protected _toolbarMenuOpenedHandler(): void {
        this._toolbarMenuOpened = true;
    }

    protected _toolbarMenuClosedHandler(): void {
        this._toolbarMenuOpened = false;
    }

    protected _getFieldWrapper(): HTMLElement {
        if (!this._fieldWrapper) {
            // @ts-ignore
            const inputRenderContainer = this._children.inputRender._container;
            this._fieldWrapper = inputRenderContainer[0] || inputRenderContainer;
        }
        return this._fieldWrapper;
    }

    protected _isEmpty(): boolean {
        return !this._items?.getCount();
    }

    protected _getInputValue(options: ILookupInputOptions): string {
        let result;

        if (options.hasOwnProperty('value')) {
            result = options.value;
        } else {
            result = this._inputValue;
        }

        return result;
    }

    protected _setInputValue(options: ILookupInputOptions, value: string): void {
        if (!options.hasOwnProperty('value')) {
            this._inputValue = value;

            // _inputValue - состояние, которое используется, если не задают опцию value
            // Т.к. _inputValue не реактивное св-во, и в шаблоне оно получается через getter (_getInputValue),
            // то необходимо звать forceUpdate
            this._forceUpdate();
        }
    }

    protected _itemsChanged(): void {
        this._calculateSizes(this._options);
    }

    protected _activated(): void {
        this._active = true;
    }

    protected _deactivated(): void {
        this._active = false;
        this.closeSuggest();
    }

    protected _suggestStateChanged(event: SyntheticEvent, state: boolean): void {
        if (
            (this._infoboxOpened ||
                !this._isInputActive(this._options) ||
                !state ||
                this._toolbarMenuOpened) &&
            this._suggestState
        ) {
            this.closeSuggest();
        }
        this._notify('suggestStateChanged', [state]);
    }

    private _determineAutoDropDown(): boolean {
        return (
            this._options.autoDropDown &&
            this._isInputActive(this._options) &&
            this._isSuggestCanBeShown()
        );
    }

    private _isSuggestCanBeShown(): boolean {
        return this._options.multiSelect || this._isEmpty();
    }

    private _resize(): void {
        if (this._isNeedCalculatingSizes(this._options)) {
            const oldFieldWrapperWidth = this._fieldWrapperWidth;
            const newFieldWrapperWidth = this._getFieldWrapperWidth(true);

            // if hidden, then there is no reason to recalc the sizes
            if (newFieldWrapperWidth > 0 && newFieldWrapperWidth !== oldFieldWrapperWidth) {
                this._calculateSizes(this._options);
            }
        }
    }

    protected _getFieldWrapperWidth(recount?: boolean): number {
        let resultWidth = this._fieldWrapperWidth;

        if (this._fieldWrapperWidth === null || recount) {
            // we cache width, since used in several places in the calculations and need to compare when resize
            resultWidth = DOMUtil.width(this._getFieldWrapper());

            if (resultWidth > 0) {
                this._fieldWrapperWidth = resultWidth;
            } else {
                this._fieldWrapperWidth = null;
            }
        }

        return resultWidth;
    }

    private _isInputActive(options: ILookupInputOptions): boolean {
        return !options.readOnly && this._isInputVisible(options);
    }

    protected _openInfoBox(): Promise<void> {
        this.closeSuggest();
        this._infoboxOpened = true;
        return super._openInfoBox();
    }

    private _getOffsetForInfobox(): number {
        const fieldWrapperStyles = getComputedStyle(this._getFieldWrapper());
        return (
            parseInt(fieldWrapperStyles.paddingLeft, 10) +
            parseInt(fieldWrapperStyles.borderLeftWidth, 10)
        );
    }

    private _closeInfoBox(): void {
        this._infoboxOpened = false;
        this._notify('closeInfoBox');
    }

    private _onMouseDownShowSelector(event: SyntheticEvent<MouseEvent>): void {
        this.closeSuggest();
        this._showSelector(event);
    }

    private _loadDependencies(): Promise<unknown> {
        const selectorTemplate = this._options.selectorTemplate;

        if (!this._loadSelectorTemplatePromise && selectorTemplate) {
            this._loadSelectorTemplatePromise =
                typeof selectorTemplate.templateName === 'string'
                    ? load(selectorTemplate.templateName)
                    : null;
        }
        return this._loadSelectorTemplatePromise;
    }

    protected _linkMouseEnterHandler(event: SyntheticEvent<MouseEvent>): void {
        if (!this._options.readOnly) {
            if (!this._dependenciesTimer) {
                this._dependenciesTimer = new DependencyTimer();
            }
            this._dependenciesTimer.start(this._loadDependencies.bind(this));
        }
    }

    protected _linkMouseLeaveHandler(): void {
        this._dependenciesTimer?.stop();
    }

    private _onClickClearRecords(): void {
        this._updateItems(new List());

        // When click on the button, it disappears from the layout and the focus is lost,
        // we return the focus to the input field.
        this.activate();
    }

    private _itemClick(event: SyntheticEvent, item: Model, nativeEvent: Event): void {
        this.closeSuggest();
        this._notify('itemClick', [item, nativeEvent]);
    }

    private _keyDown(event: SyntheticEvent): void {
        if (this._options.readOnly) {
            return;
        }

        const items = this._items;
        const hasValueInInput = this._getInputValue(this._options);

        if (
            event.nativeEvent.keyCode === constants.key.backspace &&
            !hasValueInInput &&
            !this._isEmpty()
        ) {
            if (detection.isIE) {
                event.preventDefault();
            }
            // if press backspace, the input field is empty and there are selected entries -  remove last item
            this._removeItem(items.at(items.getCount() - 1));
            this._activateLookup(false);
        } else {
            super._keyDown(event);
        }
    }

    private _activateLookup(enableScreenKeyboard: boolean = true): void {
        this.activate({ enableScreenKeyboard });
        this._needSetFocusInInput = true;
    }

    private _notifyValueChanged(value: string): void {
        this._notify('valueChanged', [value]);
    }

    private _resetInputValue(): void {
        if (this._getInputValue(this._options) !== '') {
            this._setInputValue(this._options, '');
            this._notifyValueChanged('');
        }
    }

    private _resetInputValueWithCommentChecking(): void {
        const needShowComment = this._options.commentVisibility === 'always';
        if (!needShowComment) {
            this._resetInputValue();
        }
    }

    protected _changeValueHandler(event: SyntheticEvent, value: string): void {
        this._setInputValue(this._options, value);
        this._notifyValueChanged(value);
    }

    protected _choose(event: SyntheticEvent, item: Model, tabsSelectedKey?: string): void {
        // move focus to input after select, because focus will be lost after closing popup
        this._activateLookup();

        // Если в поле связи множественный выбор, то поле ввода после выбора из саггеста не скрывается.
        // В него можно синхронно перевести фокус, а на _afterUpdate не переводить
        // иначе это вызовет повторное отображение саггеста
        if (this._options.multiSelect) {
            this._needSetFocusInInput = false;
        }

        // Сначало сбросим значение поля ввода,
        // необходимо что бы событие selectedKeysChanged сработало после valueChanged
        // дабы в propertyGrid панели фильтра выставилось значение из выбранных ключей а не из поля ввода
        this._resetInputValueWithCommentChecking();

        if (this._notify('choose', [item, tabsSelectedKey]) !== false) {
            this._addItem(item, tabsSelectedKey);
        }
    }

    protected _crossClick(event: SyntheticEvent, item: Model): void {
        /* move focus to input, because focus will be lost after removing dom element */
        if (!this._infoboxOpened) {
            this._activateLookup(false);
        }
        this._resetInputValueWithCommentChecking();
        this._removeItem(item);
    }

    private _getContainer(): HTMLElement {
        return this._container[0] || this._container;
    }

    private _getPlaceholder(options: ILookupInputOptions): string | TemplateFunction {
        let placeholder;

        if (!options.multiSelect && !this._isEmpty()) {
            placeholder = options.comment;
        } else {
            placeholder = options.placeholder;
        }

        return placeholder;
    }

    protected _suggestDirectionChanged(event: SyntheticEvent, direction: TSuggestDirection): void {
        this._suggestDirection = direction;
    }

    protected _isShowCollection(): boolean {
        return !this._isEmpty() && !!(this._maxVisibleItems || this._options.readOnly);
    }

    private _subscribeOnResizeEvent(options: ILookupInputOptions): void {
        if (!this._subscribedOnResizeEvent && this._isNeedCalculatingSizes(options)) {
            RegisterUtil(this, 'controlResize', this._resize, {
                listenAll: true,
            });
            this._subscribedOnResizeEvent = true;
        }
    }

    closeSuggest(): void {
        this._suggestState = false;
        this._children.layout.closeSuggest();
    }

    openSuggest(): void {
        this._suggestState = true;
    }

    paste(value: string): void {
        this._children.inputRender.paste(value);
    }

    showSelector(popupOptions?: IStackPopupOptions): boolean {
        this.closeSuggest();
        // Если lookup лежит на stack панели, и окно выборе окажется шире этой stack панели,
        // то по особой логике в мехнизме окон, stack панель будет скрыта через display: none,
        // из-за этого возникает проблема при выборе, поле связи не может посчитать размеры,
        // т.к. лежит в скрытом блоке, чтобы решить эту пробелму,
        // кэшируем размеры перед открытием окна выбора
        const inputValue = this._getInputValue(this._options);
        const searchStarted =
            (this._options.multiSelect || this._isEmpty()) &&
            inputValue?.length >= this._options.minSearchLength;
        return showSelector(
            this,
            popupOptions,
            this._options.multiSelect,
            searchStarted ? inputValue : ''
        );
    }

    getLookupContainer(): HTMLElement {
        return this._container;
    }

    protected _isNeedCalculatingSizes(options: ILookupInputOptions): boolean {
        return false;
    }

    protected _calculateSizes(options: ILookupInputOptions): void {
        /* For override */
    }

    protected _isInputVisible(options: ILookupInputOptions): boolean {
        return (
            (!options.readOnly || this._getInputValue(options)) &&
            !!(this._isEmpty() || options.multiSelect)
        );
    }

    static getDefaultOptions(): object {
        return {
            ...BaseLookup.getDefaultOptions(),
            ...{
                displayProperty: 'title',
                multiSelect: false,
                maxVisibleItems: 7,
                itemTemplate,
                minSearchLength: 3,
                needCalculateMultiLine: true,
                selectionType: 'leaf',
            },
        };
    }
}

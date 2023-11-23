/**
 * @kaizen_zone 2a31278f-f868-4f4f-9ef4-3e21a7f9f586
 */
import { TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Logger } from 'UI/Utils';
import { constants, detection } from 'Env/Env';
import { descriptor } from 'Types/entity';
import { delay as runDelayed } from 'Types/function';

import { IAreaOptions } from 'Controls/_input/interface/IArea';
import { BaseText } from 'Controls/_input/BaseText';
import { processKeydownEvent } from 'Controls/_input/resources/Util';
import { ResizeObserverUtil } from 'Controls/sizeUtils';
import LINE_HEIGHT_FOR_IE from 'Controls/_input/Area/IECompatibleLineHeights';
import {
    getOptionBorderVisibilityAreaTypes,
    TBorderVisibilityArea,
} from 'Controls/_input/interface/IBorderVisibilityArea';
import template = require('wml!Controls/_input/Area/Area');
import fieldTemplate = require('wml!Controls/_input/Area/Field');
import readOnlyFieldTemplate = require('wml!Controls/_input/Area/ReadOnly');
import 'Controls/baseDecorator';
import 'css!Controls/input';

/**
 * Многострочное поле ввода текста.
 * @remark
 * Вы можете настроить {@link minLines минимальное} и {@link maxLines максимальное} количество строк.
 * Когда вводимый текст превысит ограничение {@link maxLines}, в поле появится скролл и оно перестанет увеличиваться по высоте.
 * Вы можете переместить текст в следующую строку с помощью {@link newLineKey горячих клавиш}.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/#area руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_input.less переменные тем оформления}
 *
 * @mixin Controls/input:IAreaOptions
 * @extends Controls/input:BaseText
 * @implements Controls/input:ICounterVisibility
 * @implements Controls/input:IBase
 * @implements Controls/input:INewLineKey
 * @implements Controls/input:IArea
 * @implements Controls/interface:IFontSize
 * @implements Controls/input:IValue
 * @implements Controls/interface:IInputPlaceholder
 * @implements Controls/input:IBorderVisibilityArea
 * @implements Controls/input:IText
 * @implements Controls/interface:IValidationStatus
 * @implements Controls/interface:IContrastBackground
 * @ignoreOptions leftFieldTemplate rightFieldTemplate inlineHeight
 * @public
 *
 * @demo Controls-demo/Input/Area/Base/Index
 *
 */
export default class Area extends BaseText<IAreaOptions> {
    protected _template: TemplateFunction = template;

    protected _multiline: boolean = true;
    protected _resizeObserver: ResizeObserverUtil;
    protected _minLines: number;
    protected _maxLines: number;
    protected _controlName: string = 'Area';
    protected _lineHeightForIE: Record<string, number> = LINE_HEIGHT_FOR_IE;
    protected _isIE: boolean = detection.isIE11;
    protected _scrollClientHeight: number = 0;

    protected _syncBeforeMount(options: IAreaOptions, context: object): void {
        super._syncBeforeMount(options, context);
        this._validateLines(options.minLines, options.maxLines);
    }

    protected _afterMount(): void {
        this._resizeObserver = new ResizeObserverUtil(
            this,
            this._resizeObserverCallback.bind(this)
        );
        this._resizeObserver.observe(this._container);
    }

    protected _beforeUpdate(newOptions: IAreaOptions): void {
        super._beforeUpdate.apply(this, arguments);

        if (
            this._options.minLines !== newOptions.minLines ||
            this._options.maxLines !== newOptions.maxLines
        ) {
            this._validateLines(newOptions.minLines, newOptions.maxLines);
        }
        if (this._options.value !== newOptions.value) {
            this._fixSyncFakeArea();
        }
    }

    protected _beforeUnmount(): void {
        super._beforeUnmount.apply(this, arguments);
        this._resizeObserver.terminate();
    }

    protected _scrollStateChanged(e: Event, scrollState, oldScrollState): void {
        this._scrollClientHeight = scrollState.clientHeight;
        this._notify('scrollStateChanged', [scrollState, oldScrollState]);
    }

    protected _getBorderVisibility(): TBorderVisibilityArea {
        if (
            this._options.borderVisibility === 'hidden' &&
            this._options.validationStatus &&
            this._options.validationStatus !== 'valid'
        ) {
            return 'bottom';
        }
        return this._options.borderVisibility;
    }

    protected _inputHandler(): void {
        super._inputHandler.apply(this, arguments);

        this._fixSyncFakeArea();

        this._recalculateLocationVisibleArea(
            null,
            this._viewModel.displayValue,
            this._viewModel.selection
        );
    }

    private _updateFieldInTemplate(): void {
        super._updateFieldInTemplate.apply(this, arguments);
        this._fixSyncFakeArea();
    }

    private _resizeObserverCallback(): void {
        this._notify('controlResize', [], { bubbling: true });
    }

    private _isTextSelected(): boolean {
        return this._viewModel.selection.start !== this._viewModel.selection.end;
    }

    protected _keyDownHandler(event: SyntheticEvent<KeyboardEvent>): void {
        const additionalProcessedKeys = ['Up', 'Down'];

        // Не будем стопать событие keyDown, если текст не выделен и:
        // 1. Каретка стоит в конце и нажали стрелку вниз.
        // 2. Каретка стоит в начале и нажали стрелку вверх.
        const isCursorAtTheEnd =
            this._viewModel.selection.end === this._viewModel.displayValue.length;
        const isCursorAtTheStart = this._viewModel.selection.start === 0;
        const isHandleUp = this._isTextSelected() || !isCursorAtTheStart;
        const isHandleDown = this._isTextSelected() || !isCursorAtTheEnd;
        if (isHandleUp) {
            additionalProcessedKeys.push('ArrowUp');
        }
        if (isHandleDown) {
            additionalProcessedKeys.push('ArrowDown');
        }

        processKeydownEvent(event, additionalProcessedKeys);
        this._newLineHandler(event, true);
    }

    protected _keyPressHandler(event: SyntheticEvent<KeyboardEvent>): void {
        this._newLineHandler(event, false);
    }

    protected _keyUpHandler(event: SyntheticEvent<KeyboardEvent>): void {
        this._newLineHandler(event, false);

        /*
         * После нажатия на стрелки клавиатуры, происходит перемещение курсора в поле.
         * В результате перемещения, курсор может выйти за пределы видимой области, тогда произойдет
         * прокрутка в scroll:Container. Отступы не учитываются при прокрутке. Поэтому, когда курсор
         * находится в начале или в конце, тогда scroll:Container не докручивается, остается тень.
         * В такой ситуации будем докручивать самостоятельно.
         */
        const keyCode = event.nativeEvent.keyCode;
        if (keyCode >= constants.key.end && keyCode <= constants.key.down) {
            const container: HTMLElement = this._children.fakeField;
            const textBeforeCursor: string = this._viewModel.displayValue.substring(
                0,
                this._viewModel.selection.end
            );
            const cursorPosition: number = this._calcPositionCursor(container, textBeforeCursor);
            const firstLinePosition: number = this._calcPositionCursor(container, '');
            const lastLinePosition: number = container.offsetHeight;

            if (cursorPosition === firstLinePosition) {
                this._children.scroll.scrollTo(0);
            } else if (cursorPosition === lastLinePosition) {
                this._children.scroll.scrollTo(this._getField().getFieldData('offsetHeight'));
            }
        }
    }

    /**
     * Изменение расположения видимой области поля так, чтобы отобразился курсор.
     * Если курсор виден, расположение не изменяется. В противном случае новое местоположение будет таким, что курсор отобразится в середине области.
     */
    private _recalculateLocationVisibleArea(
        field: HTMLElement,
        value: string,
        selection: object
    ): void {
        const scroll = this._children.scroll;
        const textBeforeCursor = value.substring(0, selection.end);

        const positionCursor = this._calcPositionCursor(
            this._children.fieldWrapper,
            textBeforeCursor
        );

        // По другому до scrollTop не достучаться.
        // https://online.sbis.ru/opendoc.html?guid=e1770341-9126-4480-8798-45b5c339a294
        const beginningVisibleArea = scroll.getScrollTop();

        const endingVisibleArea = beginningVisibleArea + this._scrollClientHeight;

        /*
         * The cursor is visible if its position is between the beginning and the end of the visible area.
         */
        const hasVisibilityCursor =
            beginningVisibleArea < positionCursor && positionCursor < endingVisibleArea;

        if (!hasVisibilityCursor) {
            /*
             * At the time of the scroll position change, the DOM must be updated.
             * So wait until the control redraws.
             */
            runDelayed(() => {
                this._getField().scrollTo(0);
                scroll.scrollTo(positionCursor - this._scrollClientHeight / 2);
            });
        }
    }

    private _initProperties(options: IAreaOptions): void {
        super._initProperties.apply(this, arguments);

        this._field.template = fieldTemplate;
        this._readOnlyField.template = readOnlyFieldTemplate;

        /*
         * https://stackoverflow.com/questions/6890149/remove-3-pixels-in-ios-webkit-textarea
         */
        const verWithFixedBug: number = 13;
        this._field.scope.fixTextPosition =
            detection.isMobileIOS && detection.IOSVersion < verWithFixedBug;
    }

    private _calcPositionCursor(container: HTMLElement, textBeforeCursor: string): number {
        const measuredBlock: HTMLElement = document.createElement('div');

        /*
         * In order for the block to have the correct height, you need to add an empty character to the end.
         * Without it, the height, in the case of an empty value, will be zero.
         * In the case when at the end of the transition to a new line height will be one line less.
         */
        measuredBlock.innerText = textBeforeCursor + '&#65279;';
        container.appendChild(measuredBlock);
        const position: number = measuredBlock.clientHeight;
        container.removeChild(measuredBlock);

        return position;
    }

    /**
     * @param event
     * @param {String} [key]
     * @variant altKey
     * @variant ctrlKey
     * @variant shiftKey
     * @return {Boolean}
     */
    private _isPressAdditionalKey(event: KeyboardEvent, key: string): boolean {
        const additionalKeys: string[] = ['shiftKey', 'altKey', 'ctrlKey', 'metaKey'];

        return additionalKeys.every((additionalKey) => {
            if (additionalKey === key) {
                return event[additionalKey];
            }

            return !event[additionalKey];
        });
    }

    private _isPressEnter(event: KeyboardEvent): boolean {
        return event.keyCode === constants.key.enter;
    }

    private _isPressCtrl(event: KeyboardEvent): boolean {
        return (
            this._isPressAdditionalKey(event, 'ctrlKey') ||
            this._isPressAdditionalKey(event, 'metaKey')
        );
    }

    private _isPressAdditionalKeys(event: KeyboardEvent): boolean {
        return !this._isPressAdditionalKey(event);
    }

    private _validateLines(min: number, max: number): void {
        let validated = true;
        this._minLines = min;
        this._maxLines = max;

        if (min > max) {
            validated = false;
            this._minLines = max;
            this._maxLines = min;
            Logger.error(
                'The minLines and maxLines options are not set correctly. ' +
                    'The minLines more than the maxLines.',
                this
            );
        }

        if (min < 1) {
            validated = false;
            this._minLines = 1;
            Logger.error(
                'The minLines options are not set correctly. The minLines less than one.',
                this
            );
        }

        if (max < 1) {
            validated = false;
            this._maxLines = 1;
            Logger.error(
                'The maxLines options are not set correctly. The maxLines less than one.',
                this
            );
        }

        if (min > 10 || max > 10) {
            validated = false;
            this._minLines = 10;
            this._maxLines = 10;
            Logger.error(
                'The minLines and maxLines options are not set correctly.' +
                    ' Values greater than 10 are not supported.',
                this
            );
        }
    }

    private _newLineHandler(event: SyntheticEvent<KeyboardEvent>, isNewLinePaste: boolean): void {
        /*
         * If a new line is added, then stop the bubbling of the event.
         * Because, only we should respond to the addition of a new line.
         */
        if (this._isPressEnter(event.nativeEvent)) {
            if (this._options.newLineKey === 'ctrlEnter') {
                if (this._isPressCtrl(event.nativeEvent)) {
                    if (isNewLinePaste) {
                        this.paste('\n');
                    }
                    event.stopPropagation();
                } else if (!this._isPressAdditionalKeys(event.nativeEvent)) {
                    event.preventDefault();
                }
            } else {
                if (this._isPressAdditionalKeys(event.nativeEvent)) {
                    event.preventDefault();
                } else {
                    event.stopPropagation();
                }
            }
        }
    }

    private _fixSyncFakeArea(): void {
        /*
         * 1) На MacOS иногда между выпонением обработчика и перерестроением успевает перерисоваться страница. Из-за этого происходят скачки.
         * 2) В chrome иногда, когда происходит увеличение количества строк, при вставке, не происходит отрисовки текста на новых строках.
         * Значение в textarea меняется в обработчике события input, а значение в fakeField в шаблоне на момент перестроения.
         * Так как размеры textarea зависят от fakeField, поэтому их значения на момент перерисовки страници должны быть одинаковыми. Иначе
         * возникают проблемы 1-2. Чтобы избежать проблем меняем значение fakeField в обработчике.
         */
        // под реактом патчить DOM на beforeUpdate нельзя, т.к. реакт
        // не сможет удалить дочерний DOM элемент при синхронизации
        if (this.UNSAFE_isReact) {
            return;
        }
        if (!this._options.readOnly && (detection.isMacOSDesktop || detection.chrome)) {
            this._children.fakeField.innerText =
                this._viewModel.displayValue + this._field.scope.emptySymbol;
        }
    }

    static getDefaultOptions(): object {
        const defaultOptions = BaseText.getDefaultOptions();

        defaultOptions.minLines = 1;
        defaultOptions.newLineKey = 'enter';
        // В темной теме розницы у полей ввода нестандартный фон
        defaultOptions.shadowMode = 'js';
        defaultOptions.readonlyViewMode = 'text';

        return defaultOptions;
    }

    static getOptionTypes(): object {
        return {
            ...BaseText.getOptionTypes(),
            ...getOptionBorderVisibilityAreaTypes(),
            minLines: descriptor(Number, null),
            maxLines: descriptor(Number, null),
            newLineKey: descriptor(String).oneOf(['enter', 'ctrlEnter']),
            readonlyViewMode: descriptor(String).oneOf(['text', 'field']),
        };
    }
}

/**
 * @name Controls/_input/Area#fontSize
 * @cfg {String} Размер шрифта.
 * @remark
 * Размер шрифта задается константой из стандартного набора размеров шрифта, который определен для текущей темы оформления.
 * Дополнительно о размерах:
 * * {@link http://axure.tensor.ru/StandardsV8/%D1%88%D1%80%D0%B8%D1%84%D1%82%D1%8B.html Спецификация Axure}
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @variant 2xl
 * @variant 3xl
 * @variant 4xl
 * @variant 5xl
 * @variant 6xl
 * @variant 7xl
 * @variant 8xl
 * @default m
 */

/**
 * @name Controls/_input/Area#readOnly
 * @cfg {Boolean}
 * @demo Controls-demo/Input/Area/ReadOnly/Index
 */

/**
 * @name Controls/_input/Area#validationStatus
 * @cfg {Enum}
 * @demo Controls-demo/Input/Area/ValidationStatus/Index
 */

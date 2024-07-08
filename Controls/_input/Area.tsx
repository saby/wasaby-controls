/**
 * @kaizen_zone 2a31278f-f868-4f4f-9ef4-3e21a7f9f586
 */
import { createRef, CSSProperties, SyntheticEvent } from 'react';
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
import 'Controls/baseDecorator';
import 'css!Controls/input';

import { default as Render } from 'Controls/_input/Render';
import { default as FieldTemplate } from 'Controls/_input/Area/Field';
import { default as Counter } from 'Controls/_input/Base/Counter';
import { getContent } from 'Controls/_input/resources/ReactUtils';
import { wasabyAttrsToReactDom } from 'UICore/Executor';
import { Container, IScrollState } from 'Controls/scroll';
import ReadOnlyFieldTemplate from 'Controls/_input/Area/ReadOnly';
import { IBaseInputState } from 'Controls/_input/Base';
import { ISelection } from 'Controls/_input/resources/Types';
import { TFontSize } from 'Controls/interface';

const SCROLL_CUSTOM_EVENTS = ['onScrollStateChanged'];

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
    protected scrollRef = createRef<Container>();
    protected fakeFieldRef = createRef<HTMLDivElement>();
    protected fieldWrapperRef = createRef<HTMLDivElement>();
    protected _multiline: boolean = true;
    protected _resizeObserver: ResizeObserverUtil;
    protected _minLines: number;
    protected _maxLines: number;
    protected _controlName: string = 'Area';
    protected _lineHeightForIE: Record<string, number> = LINE_HEIGHT_FOR_IE;
    protected _isIE: boolean = detection.isIE11;
    protected _scrollClientHeight: number = 0;

    constructor(props: IAreaOptions) {
        super(props);
        this._scrollStateChanged = this._scrollStateChanged.bind(this);
        this._placeholderClickHandler = this._placeholderClickHandler.bind(this);
        this._validateLines(props.minLines as number, props.maxLines as number);
    }

    componentDidMount() {
        super.componentDidMount();
        this._resizeObserver = new ResizeObserverUtil(
            this,
            this._resizeObserverCallback.bind(this)
        );
        this._resizeObserver.observe(this.containerRef.current);
    }

    shouldComponentUpdate(nextProps: IAreaOptions, nextState: IBaseInputState): boolean {
        const res = super.shouldComponentUpdate(nextProps, nextState);
        if (
            this.props.minLines !== nextProps.minLines ||
            this.props.maxLines !== nextProps.maxLines
        ) {
            this._validateLines(nextProps.minLines as number, nextProps.maxLines as number);
        }
        if (this.props.value !== nextProps.value) {
            this._fixSyncFakeArea();
        }
        return res;
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this._resizeObserver.terminate();
    }

    protected _scrollStateChanged(scrollState: IScrollState, oldScrollState: IScrollState): void {
        this._scrollClientHeight = scrollState.clientHeight as number;
        this.props.onScrollStateChanged?.('', scrollState, oldScrollState);
    }

    protected _getBorderVisibility(): TBorderVisibilityArea {
        if (
            this.props.borderVisibility === 'hidden' &&
            this.props.validationStatus &&
            this.props.validationStatus !== 'valid'
        ) {
            return 'bottom';
        }
        return this.props.borderVisibility as TBorderVisibilityArea;
    }

    protected _inputHandler(event: SyntheticEvent<HTMLElement, KeyboardEvent>): void {
        super._inputHandler.apply(this, [event]);

        this._fixSyncFakeArea();

        this._recalculateLocationVisibleArea(
            null,
            this._viewModel.displayValue,
            this._viewModel.selection
        );
    }

    private _resizeObserverCallback(): void {
        this._notify('controlResize', []);
    }

    private _isTextSelected(): boolean {
        return this._viewModel.selection.start !== this._viewModel.selection.end;
    }

    protected _keyDownHandler(event: SyntheticEvent<HTMLElement, KeyboardEvent>): void {
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
        this.props.onKeyDown?.(event);
    }

    protected _keyPressHandler(event: SyntheticEvent<HTMLElement, KeyboardEvent>): void {
        this._newLineHandler(event, false);
    }

    protected _keyUpHandler(event: SyntheticEvent<HTMLElement, KeyboardEvent>): void {
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
            const container = this.fakeFieldRef.current as HTMLDivElement;
            const textBeforeCursor: string = this._viewModel.displayValue.substring(
                0,
                this._viewModel.selection.end
            );
            const cursorPosition: number = this._calcPositionCursor(container, textBeforeCursor);
            const firstLinePosition: number = this._calcPositionCursor(container, '');
            const lastLinePosition: number = container.offsetHeight;

            if (cursorPosition === firstLinePosition) {
                this.scrollRef.current?.scrollTo(0);
            } else if (cursorPosition === lastLinePosition) {
                // @ts-ignore
                this.scrollRef.current?.scrollTo(this._getField().getFieldData('offsetHeight'));
            }
        }
        this.props.onKeyUp?.(event);
    }

    /**
     * Изменение расположения видимой области поля так, чтобы отобразился курсор.
     * Если курсор виден, расположение не изменяется. В противном случае новое местоположение будет таким, что курсор отобразится в середине области.
     */
    protected _recalculateLocationVisibleArea(
        _: HTMLInputElement | null,
        value: string,
        selection: ISelection
    ): void {
        const scroll = this.scrollRef.current as Container;
        const textBeforeCursor = value.substring(0, selection.end);

        const positionCursor = this._calcPositionCursor(
            this.fieldWrapperRef.current as HTMLDivElement,
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
                this._getField()?.scrollTo(0);
                scroll.scrollTo(positionCursor - this._scrollClientHeight / 2);
            });
        }
    }

    protected _initProperties(options: IAreaOptions): void {
        super._initProperties.apply(this, [options]);

        this._field.template = FieldTemplate;
        this._readOnlyField.template = ReadOnlyFieldTemplate;

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
                //@ts-ignore
                return event[additionalKey];
            }
            //@ts-ignore
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
        return !this._isPressAdditionalKey(event, '');
    }

    private _validateLines(min: number, max: number): void {
        this._minLines = min;
        this._maxLines = max;

        if (min > max) {
            this._minLines = max;
            this._maxLines = min;
            Logger.error(
                'The minLines and maxLines options are not set correctly. ' +
                    'The minLines more than the maxLines.',
                this
            );
        }

        if (min < 1) {
            this._minLines = 1;
            Logger.error(
                'The minLines options are not set correctly. The minLines less than one.',
                this
            );
        }

        if (max < 1) {
            this._maxLines = 1;
            Logger.error(
                'The maxLines options are not set correctly. The maxLines less than one.',
                this
            );
        }

        if (min > 10 || max > 10) {
            this._minLines = 10;
            this._maxLines = 10;
            Logger.error(
                'The minLines and maxLines options are not set correctly.' +
                    ' Values greater than 10 are not supported.',
                this
            );
        }
    }

    private _newLineHandler(
        event: SyntheticEvent<HTMLElement, KeyboardEvent>,
        isNewLinePaste: boolean
    ): void {
        /*
         * If a new line is added, then stop the bubbling of the event.
         * Because, only we should respond to the addition of a new line.
         */
        if (this._isPressEnter(event.nativeEvent)) {
            if (this.props.newLineKey === 'ctrlEnter') {
                if (this._isPressCtrl(event.nativeEvent)) {
                    if (isNewLinePaste) {
                        this.paste('\n');
                    }
                    event.stopPropagation();
                } else if (!this._isPressAdditionalKeys(event.nativeEvent)) {
                    event.preventDefault();
                } else {
                    this.props.onKeyPress?.(event);
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
        if (
            !this._getReadOnly() &&
            (detection.isMacOSDesktop || detection.chrome) &&
            this.fakeFieldRef.current
        ) {
            this.fakeFieldRef.current.innerText =
                this._viewModel.displayValue + this._field.scope.emptySymbol;
        }
    }

    protected _getContent(contentProps: Record<string, unknown> = {}) {
        const attrs = wasabyAttrsToReactDom(contentProps.attrs as Record<string, unknown>) || {};
        const style: CSSProperties = {
            minHeight: this._isIE
                ? this._lineHeightForIE[this.props.fontSize as string] * this._minLines + 4 + 'px'
                : 'var(--calculated-line-min-height_inputArea-scroll)',
        };
        if (this._maxLines) {
            style.maxHeight = this._isIE
                ? this._lineHeightForIE[this.props.fontSize as string] * this._maxLines + 4 + 'px'
                : 'var(--calculated-line-max-height_inputArea-scroll)';
        }

        return (
            <>
                <Container
                    className={
                        'controls-Area__scroll controls-InputBase__field' +
                        ` controls-Area__minHeight_countLines_${this._minLines}_size_${
                            this.props.fontSize
                        }_indented${
                            this._maxLines
                                ? ' controls-Area__maxHeight_countLines_' +
                                  this._maxLines +
                                  '_size_' +
                                  this.props.fontSize +
                                  '_indented'
                                : ''
                        }${contentProps.className ? ` ${contentProps.className}` : ''}`
                    }
                    data-qa={contentProps['data-qa']}
                    // @ts-ignore
                    style={style}
                    ref={this.scrollRef}
                    onScrollStateChanged={this._scrollStateChanged}
                    customEvents={SCROLL_CUSTOM_EVENTS}
                    shadowMode={this.props.shadowMode}
                >
                    {this._getReadOnly()
                        ? getContent(this._readOnlyField.template, {
                              ...attrs,
                              ...contentProps,
                              options: this.props,
                              ...this._readOnlyField.scope,
                              placeholderVisibility: this._placeholderVisibility,
                              value: this._viewModel.displayValue,
                              'data-qa': undefined,
                              className: '',
                              ref: this.readonlyFieldRef,
                          })
                        : getContent(this._field.template, {
                              ...attrs,
                              ...contentProps,
                              ...this._useEvent,
                              'data-qa': undefined,
                              className: '',
                              ref: this.fieldWrapperRef,
                              fieldNameRef: this.fieldNameRef,
                              forCalcRef: this.forCalcRef,
                              fakeFieldRef: this.fakeFieldRef,
                              type: this._type,
                              model: this._viewModel,
                              options: this.props,
                              ...this._field.scope,
                              fieldName: this._fieldName,
                              spellCheck: this.props.spellCheck,
                              wasActionUser: this._wasActionUser,
                              isIE: this._isIE,
                              minLines: this._minLines,
                              maxLines: this._maxLines,
                              heightLine: this.props.fontSize,
                              lineHeightForIE: this._lineHeightForIE[this.props.fontSize as string],
                              value: this._viewModel.displayValue,
                              placeholderDisplay: this._placeholderDisplay,
                              hidePlaceholderUsingCSS: this._hidePlaceholderUsingCSS,
                              isBrowserPlatform: this._isBrowserPlatform,
                              ieVersion: this._ieVersion,
                              isEdge: this._isEdge,
                              readOnly: false,
                              _placeholderClickHandler: this._placeholderClickHandler,
                              onKeyPress: this._keyPressHandler.bind(this),
                          })}
                </Container>
                {this._isCounterVisible() ? (
                    <Counter
                        maxLength={this.props.maxLength as number}
                        currentLength={this._viewModel.displayValue.length}
                    />
                ) : null}
            </>
        );
    }

    render() {
        this._updateViewModelValue();
        const footerTemplate = this.props.footerTemplate
            ? getContent(this.props.footerTemplate, {
                  className: `controls-Area__footer controls-Area__field_margin-${this.props.horizontalPadding}`,
              })
            : null;

        const attrs = wasabyAttrsToReactDom(this.props.attrs || {}) || {};
        if (this._tooltip) {
            attrs.title = this._tooltip;
        }

        const style = {
            ...((attrs.style as CSSProperties) || {}),
            '--calculated-line-min-height_inputArea':
                'calc(' +
                this._minLines +
                ' * var(--line-height_' +
                this.props.fontSize +
                '_inputArea))',
            '--calculated-line-min-height_inputArea-scroll':
                'calc(' +
                this._minLines +
                ' * var(--line-height_' +
                this.props.fontSize +
                '_inputArea) + (2 * var(--padding-vertical_inputArea)))',
            '--calculated-line-max-height_inputArea-scroll':
                'calc(' +
                this._maxLines +
                ' * var(--line-height_' +
                this.props.fontSize +
                '_inputArea) + (2 * var(--padding-vertical_inputArea)))',
        };

        return (
            <Render
                ref={(el: HTMLElement) => {
                    this._setRef(el);
                }}
                footerTemplate={footerTemplate}
                data-qa={this.props.dataQa || this.props['data-qa']}
                data-name={this.props['data-name']}
                attrs={attrs}
                className={`${
                    this._isCounterVisible() ? 'controls-margin_bottom-m' : ''
                } controls-Area controls-Area_line-height_${this.props.fontSize}${
                    this.props.className ? ` ${this.props.className}` : ''
                }`}
                style={style}
                // @ts-ignore
                borderVisibility={this._getBorderVisibility()}
                readonlyViewMode={this.props.readonlyViewMode}
                minLines={this.props.minLines}
                viewModel={this._viewModel}
                multiline={this._multiline}
                tagStyle={this.props.tagStyle}
                textAlign={this.props.textAlign}
                placeholder={this.props.placeholder}
                fontSize={this.props.fontSize as TFontSize}
                fontWeight={this.props.fontWeight}
                inlineHeight={this.props.inlineHeight}
                fontColorStyle={this.props.fontColorStyle}
                borderStyle={this.props.borderStyle}
                validationStatus={this.props.validationStatus}
                contrastBackground={this.props.contrastBackground}
                horizontalPadding={this.props.horizontalPadding}
                autoFocus={this.props.autoFocus}
                onFocus={this.props.onFocus}
                onMouseEnter={this._mouseEnterHandler}
                onMouseLeave={this.props.onMouseLeave}
                onMouseMove={this.props.onMouseMove}
                onTagClick={this.props.onTagClick}
                onTagHover={this.props.onTagHover}
                onWheel={this.props.onWheel}
                readOnly={this._getReadOnly()}
            >
                {this._getContent}
            </Render>
        );
    }

    static defaultProps = {
        ...BaseText.defaultProps,
        minLines: 1,
        newLineKey: 'enter',
        // В темной теме розницы у полей ввода нестандартный фон
        shadowMode: 'js',
        readonlyViewMode: 'text',
    };

    static getOptionTypes(): Record<string, unknown> {
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

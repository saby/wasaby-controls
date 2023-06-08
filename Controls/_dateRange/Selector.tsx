/**
 * @kaizen_zone 3000b102-db75-420e-bda6-37c50495ae25
 */
import {
    ILinkViewDefaultOptions,
    BaseSelector,
    IBaseSelectorOptions,
    IDatePopupTypeOptions,
    getDatePopupName,
} from 'Controls/date';
import DateRangeModel from './DateRangeModel';
import IDateRangeSelectable = require('./interfaces/IDateRangeSelectable');
import { IDateRangeOptions } from './interfaces/IDateRange';
import { Popup as PopupUtil } from 'Controls/dateUtils';
import IPeriodLiteDialog from 'Controls/_dateRange/interfaces/IPeriodLiteDialog';
import LinkView from './LinkView';
import { SyntheticEvent } from 'Vdom/Vdom';

interface IRangeSelector
    extends IDateRangeOptions,
        IBaseSelectorOptions,
        IDatePopupTypeOptions {}

/**
 * Контрол позволяет пользователю выбрать диапазон дат с начальным и конечным значениями в календаре.
 * Выбор происходит с помощью панели большого выбора периода.
 *
 * @remark
 *
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_dateRange.less переменные тем оформления}
 *
 * @class Controls/_dateRange/Selector
 * @extends UI/Base:Control
 * @implements Controls/interface:IResetValues
 * @implements Controls/date:ILinkViewDefaultOptions
 * @implements Controls/date:ICaption
 * @implements Controls/dateRange:IDateRange
 * @implements Controls/dateRange:IDatePickerSelectors
 * @implements Controls/dateRange:IDayTemplate
 * @implements Controls/dateRange:IDateRangeSelectable
 * @implements Controls/interface:ITooltip
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IFontWeight
 * @implements Controls/interface:IOpenPopup
 * @implements Controls/dateRange:ICaptionFormatter
 * @implements Controls/interface:IMonthCaptionTemplate
 * @implements Controls/interface:IDateConstructor
 * @implements Controls/date:IDatePopupType
 * @implements Controls/interface:IDisplayedRanges
 *
 * @public
 * @demo Controls-demo/Input/Date/RangeLink
 *
 */

export default class Selector extends BaseSelector {
    state: {};
    protected _rangeModel: DateRangeModel = null;
    protected _emptyCaption: string;
    EMPTY_CAPTIONS: object = ILinkViewDefaultOptions.EMPTY_CAPTIONS;
    protected _fittingMode: string = 'overflow';

    constructor(props) {
        super(props);
        this.state = {
            startValue: props.startValue,
            endValue: props.endValue,
        };
        this._rangeModel = new DateRangeModel({
            dateConstructor: props.dateConstructor,
        });
        this._updateRangeModel(props);
        this._setEmptyCaption(props);
    }

    shouldComponentUpdate(props): boolean {
        if (
            this.props.startValue !== props.startValue ||
            this.props.endValue !== props.endValue
        ) {
            this._updateValues(props);
        }
        return true;
    }

    private _startValueChangedCallback(startValue: Date): void {
        this.setState({
            startValue,
        });
        if (this.props.onStartvaluechanged) {
            const event = new SyntheticEvent(null, {
                type: 'startValueChanged',
            });
            this.props.onStartvaluechanged(event, startValue);
        }
    }

    private _endValueChangedCallback(endValue: Date): void {
        this.setState({
            endValue,
        });
        if (this.props.onEndvaluechanged) {
            const event = new SyntheticEvent(null, {
                type: 'endValueChanged',
            });
            this.props.onEndvaluechanged(event, endValue);
        }
    }

    private _rangeChangedCallback(startValue: Date, endValue: Date) {
        if (this.props.onRangechanged) {
            const event = new SyntheticEvent(null, {
                type: 'rangeChanged',
            });
            this.props.onRangechanged(event, startValue, endValue);
        }
    }

    private _setEmptyCaption(props: IRangeSelector): void {
        if (
            typeof props.emptyCaption === 'string' ||
            props.emptyCaption instanceof String
        ) {
            if (this._emptyCaption !== props.emptyCaption) {
                this._emptyCaption = props.emptyCaption;
            }
        } else {
            const newCaption =
                props.selectionType !==
                IDateRangeSelectable.SELECTION_TYPES.single
                    ? this.EMPTY_CAPTIONS.ALL_TIME
                    : this.EMPTY_CAPTIONS.NOT_SPECIFIED;
            if (newCaption !== this._emptyCaption) {
                this._emptyCaption = newCaption;
            }
        }
    }

    private _updateValues(props: IRangeSelector): void {
        let newStartValue;
        let newEndValue;
        if (props.startValue || props.startValue === null) {
            newStartValue = props.startValue;
        } else {
            newStartValue = this._rangeModel?.startValue;
        }
        if (props.endValue || props.endValue === null) {
            newEndValue = props.endValue;
        } else {
            newEndValue = this._rangeModel?.endValue;
        }
        if (
            props.selectionType !== IDateRangeSelectable.SELECTION_TYPES.single
        ) {
            newStartValue = newStartValue || null;
            newEndValue = newEndValue || null;
        }
        this.setState(
            {
                startValue: newStartValue,
                endValue: newEndValue,
            },
            () => {
                this._updateRangeModel(props);
            }
        );
    }

    private _updateRangeModel(props: IRangeSelector): void {
        const opts: IDateRangeOptions = {};
        opts.endValue = this.state.endValue;
        opts.startValue = this.state.startValue;
        if (
            props.selectionType === IDateRangeSelectable.SELECTION_TYPES.single
        ) {
            opts.endValue = this.state.startValue;
        }
        if (
            props.selectionType !== IDateRangeSelectable.SELECTION_TYPES.single
        ) {
            opts.startValue = opts.startValue || null;
            opts.endValue = opts.endValue || null;
        }
        opts.rangeSelectedCallback = props.rangeSelectedCallback;
        opts.selectionType = props.selectionType;
        opts.ranges = props.ranges;
        this._rangeModel.update({
            ...opts,
            startValueChangedCallback:
                this._startValueChangedCallback.bind(this),
            endValueChangedCallback: this._endValueChangedCallback.bind(this),
            rangeChangedCallback: this._rangeChangedCallback.bind(this),
        });
    }

    // TODO: Свести с базовым классом
    private _getPopupClassName(): string {
        let className = '';
        if (this.props.datePopupType === 'shortDatePicker') {
            if (
                !this.props.chooseMonths &&
                !this.props.chooseQuarters &&
                !this.props.chooseHalfyears
            ) {
                className = `controls-DateRangeSelectorLite__picker-years controls_popupTemplate_theme-${this.props.theme}`;
            } else {
                className = 'controls-DateRangeSelectorLite__picker-normal';
            }
            className += ` controls_shortDatePicker_theme-${this.props.theme} controls_theme-${this.props.theme}`;
        } else if (this.props.datePopupType === 'compactDatePicker') {
            className +=
                `controls_compactDatePicker_theme-${this.props.theme} ` +
                'controls-CompactDatePicker__selector-margin controls-CompactDatePicker__popup';
        } else {
            className += `controls_datePicker_theme-${
                this.props.theme
            } controls-DatePopup__selector-marginTop_fontSize-${this._getFontSizeClass()}`;
            className += ' controls-DatePopup__selector-marginLeft';
            className += ` controls_popupTemplate_theme-${this.props.theme}`;
        }

        if (this.props.popupClassName) {
            className += ` ${this.props.popupClassName}`;
        }

        return className;
    }

    private _getAdditionalPopupOptions(): object | void {
        const options = {};
        if (this.props.datePopupType === 'shortDatePicker') {
            options.fittingMode = {
                vertical: this._fittingMode,
                horizontal: 'overflow',
            };
            options.eventHandlers = {
                onResult: this._sendResultHandler.bind(this),
                onClose: this._onClose.bind(this),
            };
            if (
                !this.props.chooseMonths &&
                !this.props.chooseQuarters &&
                !this.props.chooseHalfyears
            ) {
                options.direction = {
                    horizontal: 'center',
                };
            }
        }
        return options;
    }

    // TODO: Свести с базовым классом
    protected _getPopupOptions() {
        const button = this._ref.current.getPopupTarget();

        let value = {};
        if (
            this.props.selectionType ===
            IDateRangeSelectable.SELECTION_TYPES.single
        ) {
            value = PopupUtil.getFormattedSingleSelectionValue(
                this._rangeModel.startValue || this.state.startValue
            );
        }
        return {
            ...PopupUtil.getCommonOptions(this, button),
            target: button,
            template: getDatePopupName(this.props.datePopupType),
            className: this._getPopupClassName(),
            ...this._getAdditionalPopupOptions(),
            allowAdaptive: false,
            templateOptions: {
                ...PopupUtil.getDateRangeTemplateOptions(this),
                ...value,
                shouldPositionBelow: this.props.shouldPositionBelow,
                size: this.props.size,
                headerType: 'link',
                _date: this.props._date,
                resetStartValue: this.props.resetStartValue,
                resetEndValue: this.props.resetEndValue,
                rightFieldTemplate: this.props.rightFieldTemplate,
                calendarSource: this.props.calendarSource,
                dayTemplate: this.props.dayTemplate,
                monthCaptionTemplate: this.props.monthCaptionTemplate,
                captionFormatter: this.props.captionFormatter,
                emptyCaption: this._emptyCaption,
                closeButtonEnabled: true,
                selectionType: this.props.selectionType,
                ranges: this.props.ranges,
                minRange: this.props.minRange,
                _displayDate: this.props._displayDate,
                rangeSelectedCallback: this.props.rangeSelectedCallback,
                state: this._state,
                stateChangedCallback: this._stateChangedCallback,
                chooseMonths: this.props.chooseMonths,
                chooseQuarters: this.props.chooseQuarters,
                chooseHalfyears: this.props.chooseHalfyears,
                chooseYears: this.props.chooseYears,
                monthTemplate: this.props.monthTemplate,
                headerContentTemplate: this.props.headerContentTemplate,
                itemTemplate: this.props.itemTemplate,
                popupClassName: this.props.popupClassName,
                displayedRanges: this.props.displayedRanges,
                stubTemplate: this.props.stubTemplate,
                isDayAvailable: this.props.isDayAvailable,
            },
        };
    }

    protected _sendResultHandler(fittingMode: string): void {
        if (typeof fittingMode === 'string') {
            this._fittingMode = fittingMode;
            this.openPopup();
        } else {
            this._onResult(...arguments);
        }
    }
    protected _onResult(startValue: Date, endValue: Date): void {
        if (this.props.onResult) {
            this.props.onResult(null, startValue, endValue);
        }
        if (startValue instanceof Date || !startValue) {
            this._rangeModel.setRange(startValue, endValue);
            this.closePopup();
        }
    }

    private _resetButtonClickHandler(): void {
        this._rangeModel.setRange(
            this.props.resetStartValue || null,
            this.props.resetEndValue || null
        );
    }

    protected _rangeChangedHandler(
        event: Event,
        startValue: Date,
        endValue: Date
    ): void {
        this._rangeModel.setRange(startValue, endValue);
    }

    render() {
        return (
            <LinkView
                {...this.props}
                ref={this._ref}
                startValue={this.state.startValue}
                endValue={this.state.endValue}
                emptyCaption={this._emptyCaption}
                fontColorStyle={this.props.fontColorStyle}
                fontWeight={this.props.fontWeight}
                onKeyDown={this._keyDownHandler.bind(this)}
                onResetButtonClick={this._resetButtonClickHandler.bind(this)}
                onRangechanged={this._rangeChangedHandler.bind(this)}
                onLinkClick={this.openPopup.bind(this)}
                onMouseEvent={this._mouseEnterHandler.bind(this)}
                onMouseLeave={this._mouseLeaveHandler.bind(this)}
                className={`controls-DateRangeSelector controls-DateRangeSelector__view ${this.props.attrs?.className}`}
            />
        );
    }
}

Selector.defaultProps = {
    minRange: 'day',
    ...IPeriodLiteDialog.getDefaultOptions(),
    ...ILinkViewDefaultOptions.getDefaultOptions(),
    ...IDateRangeSelectable.getDefaultOptions(),
    datePopupType: 'datePicker',
};

/**
 * @name Controls/_dateRange/Selector#shouldPositionBelow
 * @cfg {Boolean} Определяет, нужно ли позиционировать выбранный период снизу в 'Большом выборе периода'.
 * @default false
 */

/**
 * @name Controls/_dateRange/Selector#fontSize
 * @cfg {String} Размер шрифта.
 * @demo Controls-demo/dateRange/RangeSelector/FontSize/Index
 */

/**
 * @name Controls/_dateRange/Selector#fontWeight
 * @demo Controls-demo/dateRange/LinkView/FontWeight/Index
 * @default bold
 * @private
 */

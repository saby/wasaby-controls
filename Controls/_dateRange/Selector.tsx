/**
 * @kaizen_zone 3000b102-db75-420e-bda6-37c50495ae25
 */
import { ILinkViewDefaultOptions, BaseSelector, IBaseSelectorOptions } from 'Controls/date';
import DateRangeModel from './DateRangeModel';
import IDateRangeSelectable = require('./interfaces/IDateRangeSelectable');
import { IDateRangeOptions } from './interfaces/IDateRange';
import { Popup as PopupUtil } from 'Controls/dateUtils';
import IPeriodLiteDialog from 'Controls/_dateRange/interfaces/IPeriodLiteDialog';
import LinkView from './LinkView';
import { Logger } from 'UI/Utils';

export type TRangeChangedHandler = (start: Date, end: Date) => void;
export interface IRangeSelectorProps
    extends IDateRangeOptions,
        IBaseSelectorOptions {
    onRangeChanged?: TRangeChangedHandler;
    captionFormatter?: Function;
    ranges?: unknown;
    selectionType?: string;
}

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
 * @implements Controls/date:IBaseSelectorOptions
 * @implements Controls/interface:IResetValues
 * @implements Controls/dateRange:IDateRange
 * @implements Controls/dateRange:IDateRangeSelectable
 *
 * @public
 * @demo Controls-demo/Input/Date/RangeLink
 *
 */

export default class Selector extends BaseSelector<IRangeSelectorProps> {
    protected _rangeModel: DateRangeModel = null;
    protected _emptyCaption: string;
    EMPTY_CAPTIONS: object = ILinkViewDefaultOptions.EMPTY_CAPTIONS;
    protected _fittingMode: string = 'overflow';

    constructor(props: IRangeSelectorProps) {
        super(props);
        this._rangeModel = new DateRangeModel({
            dateConstructor: props.dateConstructor,
        });
        this._updateRangeModel(props, props.startValue, this.props.endValue);
        this._setEmptyCaption(props);
        if (props.multiselect) {
            Logger.warn(
                'Controls/dateRange:Selector: опция multiselect переименована в опцию multiSelect'
            );
        }
    }

    componentDidUpdate(props: IRangeSelectorProps) {
        if (this.props.startValue !== props.startValue || this.props.endValue !== props.endValue) {
            this._updateValues(this.props);
        }
    }

    private _startValueChangedCallback(startValue: Date): void {
        if (this.props.onStartValueChanged) {
            this.props.onStartValueChanged(startValue);
        }
    }

    private _endValueChangedCallback(endValue: Date): void {
        if (this.props.onEndValueChanged) {
            this.props.onEndValueChanged(endValue);
        }
    }

    private _rangeChangedCallback(startValue: Date, endValue: Date) {
        if (this.props.onRangeChanged) {
            this.props.onRangeChanged(startValue, endValue);
        }
    }

    private _setEmptyCaption(props: IRangeSelectorProps): void {
        if (typeof props.emptyCaption === 'string' || props.emptyCaption instanceof String) {
            if (this._emptyCaption !== props.emptyCaption) {
                this._emptyCaption = props.emptyCaption;
            }
        } else {
            const newCaption =
                props.selectionType !== IDateRangeSelectable.SELECTION_TYPES.single
                    ? this.EMPTY_CAPTIONS.ALL_TIME
                    : this.EMPTY_CAPTIONS.NOT_SPECIFIED;
            if (newCaption !== this._emptyCaption) {
                this._emptyCaption = newCaption;
            }
        }
    }

    private _updateValues(props: IRangeSelectorProps): void {
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
        if (props.selectionType !== IDateRangeSelectable.SELECTION_TYPES.single) {
            newStartValue = newStartValue || null;
            newEndValue = newEndValue || null;
        }
        this._updateRangeModel(props, newStartValue, newEndValue);
    }

    private _updateRangeModel(props: IRangeSelectorProps, startValue: Date, endValue: Date): void {
        const opts: IDateRangeOptions = {};
        opts.endValue = endValue;
        opts.startValue = startValue;
        if (props.selectionType === IDateRangeSelectable.SELECTION_TYPES.single) {
            opts.endValue = startValue;
        }
        if (props.selectionType !== IDateRangeSelectable.SELECTION_TYPES.single) {
            opts.startValue = startValue || null;
            opts.endValue = endValue || null;
        }
        opts.rangeSelectedCallback = props.rangeSelectedCallback;
        opts.selectionType = props.selectionType;
        opts.ranges = props.ranges;
        this._rangeModel.update({
            ...opts,
            startValueChangedCallback: this._startValueChangedCallback.bind(this),
            endValueChangedCallback: this._endValueChangedCallback.bind(this),
            rangeChangedCallback: this._rangeChangedCallback.bind(this),
        });
    }

    protected _getAdditionalPopupOptions(): object | void {
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
    protected _getPopupOptions() {
        let value = {};
        if (this.props.selectionType === IDateRangeSelectable.SELECTION_TYPES.single) {
            value = PopupUtil.getFormattedSingleSelectionValue(
                this._rangeModel.startValue || this.props.startValue
            );
        }
        const baseOption = this._getBasePopupOptions(value);
        baseOption.templateOptions = {
            ...baseOption.templateOptions,
            resetStartValue: this.props.resetStartValue,
            resetEndValue: this.props.resetEndValue,
            selectionType: this.props.selectionType,
            ranges: this.props.ranges,
            minRange: this.props.minRange,
            rangeSelectedCallback: this.props.rangeSelectedCallback,
            chooseMonths: this.props.chooseMonths,
            chooseQuarters: this.props.chooseQuarters,
            chooseHalfyears: this.props.chooseHalfyears,
            chooseYears: this.props.chooseYears,
            chooseAllYears: this.props.chooseAllYears,
        };
        return baseOption;
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

    protected _rangeChangedHandler(startValue: Date, endValue: Date): void {
        this._rangeModel.setRange(startValue, endValue);
    }

    render() {
        return (
            <LinkView
                {...this.props}
                ref={this._ref}
                startValue={this.props.startValue}
                endValue={this.props.endValue}
                emptyCaption={this._emptyCaption}
                fontColorStyle={this.props.fontColorStyle}
                fontWeight={this.props.fontWeight}
                onKeyDown={this._keyDownHandler.bind(this)}
                onResetButtonClick={this._resetButtonClickHandler.bind(this)}
                onRangeChanged={this._rangeChangedHandler.bind(this)}
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

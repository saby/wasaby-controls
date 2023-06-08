/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import BaseSelector from 'Controls/_date/BaseSelector';
import LinkView from './LinkView';
import ILinkView from './interface/ILinkView';
import { Popup as PopupUtil } from 'Controls/dateUtils';
import getDatePopupName from 'Controls/_date/Utils/getPopupName';
import { SyntheticEvent } from 'Vdom/Vdom';

/**
 * Контрол позволяющий пользователю выбирать дату из календаря.
 *
 * @class Controls/_date/Selector
 * @extends UI/Base:Control
 * @implements Controls/interface:IResetValues
 * @implements Controls/interface/IDateRange
 * @implements Controls/date:ILinkView
 * @implements Controls/interface:IOpenPopup
 * @implements Controls/dateRange:IDatePickerSelectors
 * @implements Controls/dateRange:IDayTemplate
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontWeight
 * @implements Controls/date:ICaption
 * @implements Controls/interface:IValidationStatus
 * @implements Controls/date:IValue
 * @implements Controls/date:IDatePopupType
 * @implements Controls/date:IResetValue
 * @mixes Controls/dateRange:IDateSelector
 * @mixes Controls/dateRange:IMonthCaptionTemplate
 * @implements Controls/interface:IDisplayedRanges
 *
 * @public
 * @demo Controls-demo/Input/Date/Link
 *
 */
export default class Selector extends BaseSelector {
    private _getPopupClassName(): string {
        let className = '';
        if (this.props.datePopupType === 'compactDatePicker') {
            className +=
                `controls_compactDatePicker_theme-${this.props.theme} ` +
                'controls-CompactDatePicker__selector-margin controls-CompactDatePicker__popup';
        } else {
            className += `controls_datePicker_theme-${
                this.props.theme
            } controls-DatePopup__selector-marginTop_fontSize-${this._getFontSizeClass()}`;
            className += ' controls-DatePopup__selector-marginLeft';
        }

        if (this.props.popupClassName) {
            className += `${this.props.popupClassName}`;
        }

        className += ` controls_theme-${this.props.theme}`;

        return className;
    }

    protected _getPopupOptions() {
        const button = this._ref.current.getPopupTarget() as Element;
        const value = PopupUtil.getFormattedSingleSelectionValue(
            this.props.value
        );
        return {
            ...PopupUtil.getCommonOptions(this, button),
            target: button,
            template: getDatePopupName(this.props.datePopupType),
            className: this._getPopupClassName(),
            allowAdaptive: false,
            templateOptions: {
                ...PopupUtil.getTemplateOptions(this),
                ...value,
                size: this.props.size,
                shouldPositionBelow: this.props.shouldPositionBelow,
                headerType: 'link',
                rightFieldTemplate: this.props.rightFieldTemplate,
                calendarSource: this.props.calendarSource,
                dayTemplate: this.props.dayTemplate,
                monthCaptionTemplate: this.props.monthCaptionTemplate,
                closeButtonEnabled: true,
                selectionType: 'single',
                ranges: null,
                state: this._state,
                _date: this.props._date,
                stateChangedCallback: this._stateChangedCallback,
            },
        };
    }

    protected _onResult(value: Date): void {
        if (this.props.onResult) {
            this.props.onResult(value);
        }
        if (value instanceof Date || !value) {
            this.closePopup();
            this._notifyValueChanged(value);
        }
    }

    protected _notifyValueChanged(value: Date): void {
        if (this.props.onValuechanged) {
            const event = new SyntheticEvent(null, {
                type: 'valueChanged',
            });
            this.props.onValuechanged(event, value);
        }
    }

    protected _rangeChangedHandler(event: Event, value: Date): void {
        this._notifyValueChanged(value);
    }

    protected _resetButtonClickHandler(): void {
        const value = this.props.resetValue || null;
        this._notifyValueChanged(value);
    }

    render() {
        return (
            <LinkView
                {...this.props}
                ref={this._ref}
                value={this.props.value}
                validationStatus={this.props.validationStatus}
                onKeyDown={this._keyDownHandler.bind(this)}
                onLinkClick={this.openPopup.bind(this)}
                onValueChanged={this._rangeChangedHandler.bind(this)}
                onMouseenter={this._mouseEnterHandler.bind(this)}
                onMouseleave={this._mouseLeaveHandler.bind(this)}
                onResetButtonClick={this._resetButtonClickHandler.bind(this)}
                className={`controls-DateLink controls-DateLink__view ${this.props.attrs.className}`}
            />
        );
    }
}

Selector.defaultProps = {
    ...ILinkView.getDefaultOptions(),
    emptyCaption: ILinkView.EMPTY_CAPTIONS.NOT_SPECIFIED,
    datePopupType: 'datePicker',
};

/**
 * @name Controls/_date/Selector#fontWeight
 * @cfg {Controls/interface:TFontWeight.typedef}
 * @demo Controls-demo/dateRange/LinkView/FontWeight/Index
 * @default bold
 */
/**
 * @name Controls/_date/Selector#underlineVisible
 * @cfg {Boolean} Определяет наличие подчеркивания у ссылки.
 * @default false
 */

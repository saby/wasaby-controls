/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import BaseSelector from 'Controls/_date/BaseSelector';
import LinkView from './LinkView';
import ILinkView from './interface/ILinkView';
import { Popup as PopupUtil } from 'Controls/dateUtils';
import { IBaseSelectorOptions } from 'Controls/_date/interface/IBaseSelector';
import IValueOptions from 'Controls/_date/interface/IValue';
import { IResetValueOptions } from 'Controls/_interface/IResetValue';

interface IDateSelector extends IBaseSelectorOptions, IValueOptions, IResetValueOptions {}

/**
 * Контрол позволяющий пользователю выбирать дату из календаря.
 *
 * @class Controls/_date/Selector
 * @implements Controls/date:IBaseSelectorOptions
 * @implements Controls/date:IValue
 * @implements Controls/date:IResetValue
 * @public
 * @demo Controls-demo/Input/Date/Link
 *
 */
export default class Selector extends BaseSelector<IDateSelector> {
    constructor(props: IDateSelector) {
        super(props);
        this._notifyValueChanged = this._notifyValueChanged.bind(this);
    }
    protected _getPopupOptions() {
        const value = PopupUtil.getFormattedSingleSelectionValue(this.props.value);
        return this._getBasePopupOptions(value);
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
        if (this.props.onValuechanged || this.props.onValueChanged) {
            if (this.props.onValuechanged) {
                this.props.onValuechanged(value);
            }
            if (this.props.onValueChanged) {
                this.props.onValueChanged(value);
            }
        }
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
                onKeyDown={this._keyDownHandler}
                onLinkClick={this.openPopup}
                onValueChanged={this._notifyValueChanged}
                onMouseEnter={this._mouseEnterHandler}
                onMouseleave={this._mouseLeaveHandler}
                onResetButtonClick={this._resetButtonClickHandler}
                className={`controls-DateLink controls-DateLink__view ${
                    this.props.attrs?.className || this.props.className
                }`}
            />
        );
    }
}

Selector.defaultProps = {
    ...ILinkView.getDefaultOptions(),
    emptyCaption: ILinkView.EMPTY_CAPTIONS.NOT_SPECIFIED,
    datePopupType: 'datePicker',
};

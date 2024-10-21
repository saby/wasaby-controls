/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import BaseSelector from 'Controls/_date/BaseSelector';
import LinkView from './LinkView';
import ILinkView from './interface/ILinkView';
import { Popup as PopupUtil } from 'Controls/dateUtils';

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
export default class Selector extends BaseSelector {
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
                onKeyDown={this._keyDownHandler.bind(this)}
                onLinkClick={this.openPopup.bind(this)}
                onValueChanged={this._notifyValueChanged.bind(this)}
                onMouseenter={this._mouseEnterHandler.bind(this)}
                onMouseleave={this._mouseLeaveHandler.bind(this)}
                onResetButtonClick={this._resetButtonClickHandler.bind(this)}
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

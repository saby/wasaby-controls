/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import * as React from 'react';
import { Base as dateUtil } from 'Controls/dateUtils';
import { IResetValueOptions } from './interface/IResetValue';
import * as getFormattedDateRange from 'Core/helpers/Date/getFormattedDateRange';
import { Date as WSDate } from 'Types/entity';
import { isLeftMouseButton } from 'Controls/popup';
import { IFontColorStyleOptions, IFontWeightOptions, IFontSizeOptions } from 'Controls/interface';
import { Button } from 'Controls/buttons';
import IDateLinkView from 'Controls/_date/interface/ILinkView';
import IValueOptions from 'Controls/_date/interface/IValue';
import ICaptionOptions from 'Controls/_date/interface/ICaption';
import 'css!Controls/CommonClasses';

export interface ILinkView
    extends IFontColorStyleOptions,
        IFontWeightOptions,
        ICaptionOptions,
        IValueOptions,
        IFontSizeOptions,
        IResetValueOptions {
    underlineVisible?: boolean;
}

export default class LinkView extends React.Component<ILinkView> {
    private _caption: string;
    private _fontColorStyle: string;
    private _resetButtonVisible: boolean;
    private _ref: {};
    constructor(props: ILinkView) {
        super(props);
        this._resetButtonVisible = this._getResetButtonVisible(props);
        this._caption = this._getCaption(props);
        this._fontColorStyle = this._getFontColorStyle(props.fontColorStyle, props.readOnly);
        this._ref = React.createRef();
    }

    shouldComponentUpdate(props: ILinkView): boolean {
        this._resetButtonVisible = this._getResetButtonVisible(props);
        this._caption = this._getCaption(props);
        this._fontColorStyle = this._getFontColorStyle(props.fontColorStyle, props.readOnly);
        return (
            props.value !== this.props.value ||
            props.fontColorStyle !== this.props.fontColorStyle ||
            this.props.validationStatus !== props.validationStatus ||
            props.fontWeight !== this.props.fontWeight ||
            props.readOnly !== this.props.readOnly
        );
    }

    protected _getCaption(props: ILinkView): string {
        if (
            !this._caption ||
            this.props.value !== props.value ||
            this.props.emptyCaption !== props.emptyCaption ||
            this.props.captionFormatter !== props.captionFormatter
        ) {
            let captionFormatter;

            if (props.captionFormatter) {
                captionFormatter = props.captionFormatter;
            } else {
                captionFormatter = this._formatDateCaption;
            }
            return captionFormatter(props.value, props.value, props.emptyCaption);
        }
        return this._caption;
    }
    private _getResetButtonVisible(props: ILinkView): boolean {
        if (props.resetValue || props.resetValue === null) {
            return !dateUtil.isDatesEqual(props.value, props.resetValue);
        }
        return false;
    }

    protected _resetButtonClickHandler(event: Event): void {
        if (this.props.onResetButtonClick) {
            this.props.onResetButtonClick(event);
        }
    }

    private _getFontColorStyle(fontColorStyle: string, readOnly: boolean): string {
        let newFontColorStyle = fontColorStyle;
        if (readOnly) {
            if (newFontColorStyle === 'filterPanelItem' || newFontColorStyle === 'filterItem') {
                newFontColorStyle = newFontColorStyle + '_readOnly';
            } else if (newFontColorStyle === 'link') {
                newFontColorStyle = 'default';
            }
        }
        return newFontColorStyle;
    }

    private _formatDateCaption(startValue: Date, endValue: Date, emptyCaption: string): string {
        return getFormattedDateRange(startValue, endValue, {
            contractToMonth: true,
            fullNameOfMonth: true,
            contractToQuarter: true,
            contractToHalfYear: true,
            emptyPeriodTitle: emptyCaption || '\xA0',
        });
    }

    getPopupTarget() {
        return this._ref.current;
    }

    private _notifyValueChanged(value: Date): void {
        if (this.props.onValueChanged) {
            this.props.onValueChanged(null, value);
        }
    }

    private _keyDownHandler(): void {
        if (this.props.onKeyDown) {
            this.props.onKeyDown(...arguments);
        }
    }

    private _mouseDownHandler(event: Event): void {
        if (!isLeftMouseButton(event)) {
            return;
        }
        if (!this.props.readOnly && this.props.onLinkClick) {
            this.props.onLinkClick(event);
        }
    }

    private _shiftPeriod(delta: number): void {
        const value: Date = this.props.value;
        const newValue = new WSDate(value.getFullYear(), value.getMonth(), value.getDate() + delta);
        this._notifyValueChanged(newValue);
    }

    shiftBack(): void {
        this._shiftPeriod(-1);
    }

    shiftForward(): void {
        this._shiftPeriod(1);
    }

    shiftPeriod(delta: number): void {
        if (delta === 1) {
            this.shiftForward();
        } else {
            this.shiftBack();
        }
    }

    render() {
        const className = this.props.className || this.props.attrs?.className || '';
        return (
            <div
                ref={this.props.forwardedRef}
                {...this.props.attrs}
                className={`controls-DateLinkView controls_shortDatePicker_theme-${this.props.theme} ${className}`}
            >
                {!this.props.readOnly ? (
                    <Button
                        onMouseDown={this._mouseDownHandler.bind(this)}
                        onKeyDown={this._keyDownHandler.bind(this)}
                        customEvents={['onMouseDown', 'onKeyDown']}
                        data-qa="DateLinkView__template"
                        className={`controls-DateLinkView__button-value controls-linkButton_fontWeight-${this.props.fontWeight}`}
                        caption={this._caption}
                        viewMode="link"
                        fontColorStyle={this._fontColorStyle}
                        fontSize={this.props.fontSize}
                        tooltip={this.props.tooltip}
                        underlineVisible={this.props.underlineVisible}
                        name="openPopupTarget"
                        ref={this._ref}
                    />
                ) : (
                    <span
                        data-qa="DateLinkView__template"
                        className={
                            `controls-DateLinkView__button-value controls-DateLinkView__value controls-DateLinkView__value_fontWeight-${this.props.fontWeight} ` +
                            `tw-cursor-text controls-fontsize-${this.props.fontSize} ` +
                            `${
                                this._fontColorStyle
                                    ? 'controls-text-' + this._fontColorStyle
                                    : null
                            }`
                        }
                    >
                        {this._caption}
                    </span>
                )}
                {this._resetButtonVisible && !this.props.readOnly ? (
                    <span
                        className="controls-DateLinkView__resetButton
                        controls-icon icon-Close"
                        data-qa="DateLinkView__closeButton"
                        onClick={this._resetButtonClickHandler.bind(this)}
                    ></span>
                ) : null}
                <div
                    className={
                        this.props.validationStatus !== 'valid'
                            ? 'controls-invalid-border controls-' +
                              this.props.validationStatus +
                              '-border'
                            : null
                    }
                ></div>
            </div>
        );
    }
}

LinkView.defaultProps = {
    ...IDateLinkView.getDefaultOptions(),
    fontColorStyle: 'link',
    fontSize: 'l',
    fontWeight: 'bold',
    validationStatus: 'valid',
    emptyCaption: IDateLinkView.EMPTY_CAPTIONS.NOT_SPECIFIED,
};

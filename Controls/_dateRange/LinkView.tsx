/**
 * @kaizen_zone 98febf5d-f644-4802-876c-9afd0e12cf6a
 */
import { LinkView as LinkViewBase, ILinkView as ILinkViewBase } from 'Controls/date';
import rk = require('i18n!Controls');
import { Range as dateRangeUtils } from 'Controls/dateUtils';
import dateControlsUtils from 'Controls/_dateRange/Utils';
import { IDateRangeOptions } from 'Controls/_dateRange/interfaces/IDateRange';
import DateRangeModel from 'Controls/_dateRange/DateRangeModel';
import 'css!Controls/dateRange';
import 'css!Controls/CommonClasses';

interface ILinkView extends IDateRangeOptions, ILinkViewBase {}

export default class LinkView extends LinkViewBase<ILinkView> {
    private _caption: string;
    private _rangeModel: DateRangeModel;
    constructor(props: ILinkView) {
        super(props);

        this._rangeModel = new DateRangeModel({
            dateConstructor: props.dateConstructor,
        });

        this._caption = this._getCaption(props);
    }

    shouldComponentUpdate(props: ILinkView): boolean {
        const shouldUpdate = super.shouldComponentUpdate(props);
        return (
            shouldUpdate ||
            this.props.startValue !== props.startValue ||
            this.props.endValue !== props.endValue
        );
    }

    componentWillUnmount() {
        this._rangeModel.destroy();
    }

    private _startValueChangedCallback(startValue: Date): void {
        this.setState({
            startValue,
        });
        if (this.props.onStartValueChanged) {
            this.props.onStartValueChanged(null, startValue);
        }
    }

    private _endValueChangedCallback(endValue: Date): void {
        this.setState({
            endValue,
        });
        if (this.props.onEndValueChanged) {
            this.props.onEndValueChanged(null, endValue);
        }
    }

    private _rangeChangedCallback(startValue: Date, endValue: Date) {
        if (this.props.onRangeChanged) {
            this.props.onRangeChanged(null, startValue, endValue);
        }
    }

    shiftBack(): void {
        this._rangeModel.shiftBack();
        this._caption = this._getNewCaption(this.props);
    }

    shiftForward(): void {
        this._rangeModel.shiftForward();
        this._caption = this._getNewCaption(this.props);
    }

    protected _getResetButtonVisible(props: ILinkView): boolean {
        return dateRangeUtils.getResetButtonVisible(
            props.startValue || null,
            props.endValue || null,
            props.resetStartValue,
            props.resetEndValue
        );
    }

    protected _getCaption(props: ILinkView): string {
        if (!this._rangeModel) {
            return;
        }

        const changed = this._rangeModel.update({
            ...props,
            startValueChangedCallback: this._startValueChangedCallback.bind(this),
            endValueChangedCallback: this._endValueChangedCallback.bind(this),
            rangeChangedCallback: this._rangeChangedCallback.bind(this),
        });
        if (
            !this._caption ||
            changed ||
            this.props.emptyCaption !== props.emptyCaption ||
            this.props.captionFormatter !== props.captionFormatter ||
            props.startValue !== this.props.startValue ||
            props.endValue !== this.props.endValue
        ) {
            return this._getNewCaption(props);
        }
        return this._caption;
    }
    private _getNewCaption(props: ILinkView): string {
        let captionFormatter;
        let startValue;
        let endValue;
        let captionPrefix = '';

        if (props.captionFormatter) {
            captionFormatter = props.captionFormatter;
            startValue = this._rangeModel.startValue;
            endValue = this._rangeModel.endValue;
        } else {
            captionFormatter = dateControlsUtils.formatDateRangeCaption;

            if (this._rangeModel.startValue === null && this._rangeModel.endValue === null) {
                startValue = null;
                endValue = null;
            } else if (this._rangeModel.startValue === null) {
                startValue = this._rangeModel.endValue;
                endValue = this._rangeModel.endValue;
                captionPrefix = `${rk('по', 'Period')} `;
            } else if (this._rangeModel.endValue === null) {
                startValue = this._rangeModel.startValue;
                endValue = this._rangeModel.startValue;
                captionPrefix = `${rk('с')} `;
            } else {
                startValue = this._rangeModel.startValue;
                endValue = this._rangeModel.endValue;
            }
        }
        return captionPrefix + captionFormatter(startValue, endValue, props.emptyCaption);
    }
}

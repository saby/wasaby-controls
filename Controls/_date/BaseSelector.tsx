/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import * as React from 'react';
import { DependencyTimer, StickyOpener } from 'Controls/popup';
import { Logger } from 'UI/Utils';
import { constants } from 'Env/Env';
import { SyntheticEvent } from 'Vdom/Vdom';
import { getWasabyContext } from 'UI/Contexts';
import { Popup as PopupUtil } from 'Controls/dateUtils';
import getDatePopupName from 'Controls/_date/Utils/getPopupName';
import { IBaseSelectorOptions } from 'Controls/_date/interface/IBaseSelector';

export default class BaseSelector<IProps = IBaseSelectorOptions> extends React.Component<IProps> {
    protected _ref: {} = React.createRef();

    protected _state: string;

    protected _dependenciesTimer: DependencyTimer = null;
    protected _loadCalendarPopupPromise: Promise<unknown> = null;
    protected _stickyOpener: StickyOpener;

    constructor(props) {
        super(props);
        this._stickyOpener = new StickyOpener({
            closeOnOutsideClick: true,
            actionOnScroll: 'close',
        });
        this._stateChangedCallback = this._stateChangedCallback.bind(this);
        this.shiftPeriod = this.shiftPeriod.bind(this);
    }

    shiftPeriod(delta: number): void {
        this._ref.current.shiftPeriod(delta);
    }

    shiftBack(): void {
        this._ref.current.shiftBack();
    }

    shiftForward(): void {
        this._ref.current.shiftForward();
    }

    openPopup(): void {
        this._stickyOpener.open(this._getPopupOptions());
    }

    protected _getPopupOptions() {
        return {};
    }

    protected _getAdditionalPopupOptions(): object | void {
        return {};
    }

    protected _onClose(): void {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    closePopup(): void {
        this._stickyOpener.close();
    }

    protected _getPopupClassName(): string {
        let className = '';
        if (this.props.datePopupType === 'shortDatePicker') {
            if (
                !this.props.chooseMonths &&
                !this.props.chooseQuarters &&
                !this.props.chooseHalfyears
            ) {
                className = `controls-DateRangeSelectorLite__picker-years controls_popupTemplate_theme-${this.context.theme}`;
            } else {
                className = 'controls-DateRangeSelectorLite__picker-normal';
            }
            className += ` controls_shortDatePicker_theme-${this.context.theme}`;
        } else if (this.props.datePopupType === 'compactDatePicker') {
            className +=
                `controls_compactDatePicker_theme-${this.context.theme} ` +
                'controls-CompactDatePicker__selector-margin controls-CompactDatePicker__popup';
        } else {
            className += `controls_datePicker_theme-${
                this.context.theme
            } controls-DatePopup__selector-marginTop_fontSize-${this._getFontSizeClass()}`;
            className += ' controls-DatePopup__selector-marginLeft';
            className += ` controls_popupTemplate_theme-${this.context.theme}`;
        }

        if (this.props.popupClassName) {
            className += ` ${this.props.popupClassName}`;
        }

        return className;
    }

    protected _getBasePopupOptions(value: { Date }) {
        const button = this._ref.current.getPopupTarget();
        return {
            ...PopupUtil.getCommonOptions(this, button),
            target: button,
            template: getDatePopupName(this.props.datePopupType),
            className: this._getPopupClassName(),
            ...this._getAdditionalPopupOptions(),
            allowAdaptive: true,
            templateOptions: {
                ...PopupUtil.getDateRangeTemplateOptions(this),
                ...value,
                size: this.props.size,
                headerType: 'link',
                rightFieldTemplate: this.props.rightFieldTemplate,
                monthCaptionTemplate: this.props.monthCaptionTemplate,
                captionFormatter: this.props.captionFormatter,
                emptyCaption: this._emptyCaption,
                selectionType: 'single',
                ranges: null,
                monthTemplate: this.props.monthTemplate,
                headerContentTemplate: this.props.headerContentTemplate,
                itemTemplate: this.props.itemTemplate,
                popupClassName: this.props.popupClassName,
                displayedRanges: this.props.displayedRanges,
                stubTemplate: this.props.stubTemplate,
                isDayAvailable: this.props.isDayAvailable,
                multiSelect: this.props.multiSelect || this.props.multiselect,
            },
        };
    }

    protected _stateChangedCallback(state: string): void {
        this._state = state;
    }

    protected _getFontSizeClass(): string {
        // c fontSize 18px (20px, 24px и тд) линк смещается на 1px вниз, с 14px (13px, 12px и тд) на 1px вверх
        // относительно стандратного положения
        switch (this.props.fontSize) {
            case '4xl':
                return 'l';
            case '3xl':
                return 'l';
            case 'm':
                return 's';
            case 's':
                return 's';
            case 'xs':
                return 's';
            default:
                return 'm';
        }
    }

    protected _startDependenciesTimer(module: string, loadCss: Function): void {
        if (!this.props.readOnly) {
            if (!this._dependenciesTimer) {
                this._dependenciesTimer = new DependencyTimer();
            }
            this._dependenciesTimer.start(this._loadDependencies.bind(this, module, loadCss));
        }
    }

    protected _loadDependencies(module: string, loadCss: Function): Promise<unknown> {
        try {
            if (!this._loadCalendarPopupPromise) {
                this._loadCalendarPopupPromise = import(module).then(loadCss);
            }
            return this._loadCalendarPopupPromise;
        } catch (e) {
            Logger.error(module, e);
        }
    }

    protected _mouseEnterHandler(): void {
        if (this.props.datePopupType !== 'datePicker') {
            let libName;
            switch (this.props.datePopupType) {
                case 'shortDatePicker':
                    libName = 'Controls/shortDatePicker';
                    break;
                case 'compactDatePicker':
                    libName = 'Controls/compactDatePicker';
                    break;
            }
            const loadCss = ({ View }) => {
                return View.loadCSS();
            };
            this._startDependenciesTimer(libName, loadCss);
        } else {
            const loadCss = (datePopup) => {
                return datePopup.default.loadCSS();
            };
            this._startDependenciesTimer('Controls/datePopup', loadCss);
        }
    }

    protected _mouseLeaveHandler(): void {
        this._dependenciesTimer?.stop();
    }

    protected _keyDownHandler(event: SyntheticEvent<KeyboardEvent>): void {
        if (event.nativeEvent.keyCode === constants.key.space) {
            this.openPopup();
        }
    }

    static contextType = getWasabyContext();
}

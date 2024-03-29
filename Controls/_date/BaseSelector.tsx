/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import * as React from 'react';
import { DependencyTimer, StickyOpener } from 'Controls/popup';
import { Logger } from 'UI/Utils';
import { constants } from 'Env/Env';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IFontSizeOptions, IDateConstructorOptions } from 'Controls/interface';
import { IDatePopupTypeOptions } from 'Controls/_date/interface/IDatePopupType';
import IValueOptions from 'Controls/_date/interface/IValue';

export interface IBaseSelectorOptions
    extends IFontSizeOptions,
        IDatePopupTypeOptions,
        IDateConstructorOptions,
        IValueOptions {}

export default class BaseSelector extends React.Component {
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

    protected _onClose(): void {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    closePopup(): void {
        this._stickyOpener.close();
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
            this._dependenciesTimer.start(
                this._loadDependencies.bind(this, module, loadCss)
            );
        }
    }

    protected _loadDependencies(
        module: string,
        loadCss: Function
    ): Promise<unknown> {
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
}

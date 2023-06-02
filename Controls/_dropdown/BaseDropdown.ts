/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
import { Control, IControlOptions } from 'UI/Base';
import { constants, detection } from 'Env/Env';
import { SyntheticEvent } from 'Vdom/Vdom';
import IDropdownController from 'Controls/_dropdown/interface/IDropdownController';
import { RegisterUtil, UnregisterUtil } from 'Controls/event';
import { DependencyTimer } from 'Controls/popup';
import { RecordSet } from 'Types/collection';
import { IStickyPopupOptions } from 'Controls/popup';

export interface IDropdownReceivedState {
    items?: RecordSet;
    history?: RecordSet;
}

export const filterBySelectionUtil = 'Controls/Utils/filterRecordSetBySelection';

export abstract class BaseDropdown extends Control<
    IControlOptions,
    IDropdownReceivedState
> {
    protected _controller: IDropdownController = null;
    protected _isOpened: boolean = false;
    protected _dependenciesTimer: DependencyTimer = null;

    reload(): void {
        this._controller.reload();
    }

    closeMenu(): void {
        this._controller.closeMenu();
    }

    abstract openMenu(popupOptions?: IStickyPopupOptions): void;

    protected _handleKeyDown(event: SyntheticEvent<KeyboardEvent>): void {
        const code = event.nativeEvent.keyCode;
        const autofocusConfig = {
            autofocus: true,
            templateOptions: {
                focusable: true,
            },
        };
        if (code === constants.key.esc && this._isOpened) {
            this._controller.closeMenu();
            this._stopEvent(event);
        } else if (code === constants.key.space && !this._isOpened) {
            this.openMenu(autofocusConfig);
            this._stopEvent(event);
        } else if (
            (code === constants.key.down || code === constants.key.up) &&
            this._isOpened
        ) {
            this.openMenu(autofocusConfig);
            this._stopEvent(event);
        }
    }

    protected _handleClick(event: SyntheticEvent): void {
        // stop bubbling event in edit mode, so the list does not handle click event.
        if (this._controller.getItems() && !this._options.readOnly) {
            event.stopPropagation();
        }
    }

    protected _handleMouseEnter(event: SyntheticEvent): void {
        if (!this._options.readOnly) {
            if (!this._dependenciesTimer) {
                this._dependenciesTimer = new DependencyTimer();
            }
            this._dependenciesTimer.start(this._loadDependencies.bind(this));
        }
    }

    protected _handleMouseLeave(event: SyntheticEvent): void {
        this._dependenciesTimer?.stop();
    }

    protected _onOpen(): void {
        if (!detection.isMobileIOS) {
            RegisterUtil(this, 'customscroll', this._handleScroll.bind(this));
            RegisterUtil(this, 'horizontalScroll', this._handleScroll.bind(this));
        }
        this._isOpened = true;
        this._notify('dropDownOpen');
    }

    protected _onClose(): void {
        this._isOpened = false;
        this._notify('dropDownClose');
    }

    protected _footerClick(data: object): void {
        this._notify('footerClick', [data]);
    }

    protected _rightTemplateClick(data: object): void {
        this._notify('rightTemplateClick', [data]);
        this._controller.closeMenu();
    }

    protected _openSelectorDialog(data: object): void {
        this._initSelectorItems = data;
        this._controller.openSelectorDialog(data);
    }

    protected _itemClick(data: object, nativeEvent: MouseEvent): void {
        // for overrides
    }

    protected _resultHandler(
        action: string,
        data: object,
        nativeEvent: object
    ): void {
        // for overrides
    }

    protected _onResult(
        action: string,
        data: object,
        nativeEvent: Event
    ): void {
        switch (action) {
            case 'searchValueChanged':
                this._notify('searchValueChanged', [data]);
                break;
            case 'pinClick':
                this._controller.pinClick(data);
                break;
            case 'itemClick':
                this._itemClick(data, nativeEvent);
                break;
            case 'footerClick':
                this._footerClick(data);
                break;
            case 'rightTemplateClick':
                this._rightTemplateClick(data);
                break;
            case 'openSelectorDialog':
                this._openSelectorDialog(data);
                break;
            case 'menuClosed':
                this._controller.handleClose(data.searchValue);
                break;
            default:
                this._resultHandler(action, data, nativeEvent);
        }
    }

    protected _handleScroll(): void {
        if (this._isOpened) {
            this._controller.closeMenu();
        }
    }

    protected _beforeUnmount(): void {
        UnregisterUtil(this, 'customscroll');
        UnregisterUtil(this, 'horizontalScroll');
        this._controller.destroy();
    }

    private _loadDependencies(): void {
        this._controller.loadDependencies().catch((error) => {
            return error;
        });
    }

    private _stopEvent(event: SyntheticEvent): void {
        event.stopPropagation();
        event.preventDefault();
    }
}

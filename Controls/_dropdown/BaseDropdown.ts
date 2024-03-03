/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
import * as React from 'react';
import { constants } from 'Env/Env';
import { SyntheticEvent } from 'Vdom/Vdom';
import { DependencyTimer } from 'Controls/popup';
import { IStickyPopupOptions } from 'Controls/popup';
import Controller from 'Controls/_dropdown/_Controller';
import { __notifyFromReact, checkWasabyEvent } from 'UI/Events';
import { Guid } from 'Types/entity';
import { Logger } from 'UI/Utils';
import { RecordSet } from 'Types/collection';
import { activate } from 'UI/Focus';

export const filterBySelectionUtil = 'Controls/Utils/filterRecordSetBySelection';

function validateProps(props): void {
    if (
        (props.buildByItems || !props.source) &&
        props.items &&
        !(props.items instanceof RecordSet)
    ) {
        Logger.error(
            'Controls/dropdown: В опцию items передано значение неправильного типа, ожидается Types/collection:RecordSet'
        );
    }
}

export class BaseDropdown<P, S> extends React.Component<P, S> {
    get _container(): HTMLElement {
        return this._ref.current;
    }
    protected _controller: Controller = null;
    protected _dependenciesTimer: DependencyTimer = null;
    protected _ref = React.createRef();
    private _instanceId: string = 'inst_' + Guid.create();

    constructor(props) {
        super(props);
        validateProps(props);
        this._setRef = this._setRef.bind(this);
        this._handleClick = this._handleClick.bind(this);
        this._handleScroll = this._handleScroll.bind(this);
        this._handleMouseEnter = this._handleMouseEnter.bind(this);
        this._handleMouseLeave = this._handleMouseLeave.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this.state = {
            isOpened: false,
        };
    }

    reload(): void {
        this._controller.reload();
    }

    closeMenu(): void {
        this._controller.closeMenu();
    }

    activate() {
        activate(this._ref.current);
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
        if (code === constants.key.esc && this.state.isOpened) {
            this._controller.closeMenu();
            this._stopEvent(event);
        } else if (code === constants.key.space && !this.state.isOpened) {
            this.openMenu(autofocusConfig);
            this._stopEvent(event);
        } else if (
            (code === constants.key.down || code === constants.key.up) &&
            this.state.isOpened
        ) {
            this.openMenu(autofocusConfig);
            this._stopEvent(event);
        }
    }

    protected _handleClick(event: SyntheticEvent): void {
        // stop bubbling event in edit mode, so the list does not handle click event.
        if (this._controller.getItems() && !this.props.readOnly) {
            event.stopPropagation();
        } else {
            this.props.onClick?.(event);
        }
    }

    protected _handleMouseEnter(event: SyntheticEvent): void {
        if (!this.props.readOnly) {
            if (!this._dependenciesTimer) {
                this._dependenciesTimer = new DependencyTimer();
            }
            this._dependenciesTimer.start(this._loadDependencies.bind(this));
        }
        if (this.props.onMouseEnter) {
            this.props.onMouseEnter(event);
        }
    }

    protected _handleMouseLeave(event: SyntheticEvent): void {
        this._dependenciesTimer?.stop();
    }

    protected _callHandler(event: Function, eventName: string, value: unknown[] = []): unknown {
        if (event && !checkWasabyEvent(event)) {
            const synthEvent = new SyntheticEvent(null, {
                type: eventName,
            });
            event(synthEvent, ...value);
            return synthEvent.result;
        } else if (event) {
            return event(...value);
        }
    }

    protected _setRef(element): void {
        this._ref.current = element;
        if (this.props.forwardedRef) {
            this.props.forwardedRef(element);
        }
    }

    protected _onOpen(): void {
        __notifyFromReact(
            this._ref.current,
            'register',
            ['customscroll', this, this._handleScroll],
            true
        );
        __notifyFromReact(
            this._ref.current,
            'register',
            ['horizontalScroll', this, this._handleScroll],
            true
        );
        this.setState({
            isOpened: true,
        });
        this._callHandler(this.props.onDropDownOpen, 'dropDownOpen');
    }

    getInstanceId(): string {
        return this._instanceId;
    }

    protected _onClose(): void {
        this.setState({
            isOpened: false,
        });
        this._callHandler(this.props.onDropDownClose, 'dropDownClose');
    }

    protected _footerClick(data: object): void {
        this.props.onFooterClick?.(data);
    }

    protected _rightTemplateClick(data: object): void {
        this.props.onRightTemplateClick?.(data);
        this._controller.closeMenu();
    }

    protected _openSelectorDialog(data: object): void {
        this._initSelectorItems = data;
        this._controller.openSelectorDialog(data);
    }

    protected _itemClick(data: object, nativeEvent: MouseEvent): void {
        // for overrides
    }

    protected _resultHandler(action: string, data: object, nativeEvent: object): void {
        // for overrides
    }

    protected _onResult(action: string, data: object, nativeEvent: Event): void {
        switch (action) {
            case 'searchValueChanged':
                this._callHandler(this.props.onSearchValueChanged, 'searchValueChanged', [data]);
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
        if (this.state.isOpened) {
            this._controller.closeMenu();
        }
    }

    componentWillUnmount(): void {
        __notifyFromReact(
            this._ref.current,
            'unregister',
            ['customscroll', this, this._handleScroll],
            true
        );
        __notifyFromReact(
            this._ref.current,
            'unregister',
            ['horizontalScroll', this, this._handleScroll],
            true
        );
        this._controller.destroy();
    }

    private _loadDependencies(): void {
        if (this.props.reloadOnOpen) {
            this._controller.loadMenuTemplates();
        } else {
            this._controller.loadDependencies().catch((error) => {
                return error;
            });
        }
    }

    private _stopEvent(event: SyntheticEvent): void {
        event.stopPropagation();
        event.preventDefault();
    }
}

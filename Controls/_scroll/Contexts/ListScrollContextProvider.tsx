import * as React from 'react';
import { THorizontalScrollMode } from '../Container/Interface/IScrollMode';
import { ListScrollContext } from './ListScrollContext';
import ScrollState from '../Utils/ScrollState';
export interface IListScrollContextOptions {
    setHorizontalScrollMode?: (state: THorizontalScrollMode) => void;
    setArrowButtonClickCallback?: (callback: Function) => boolean;
    removeArrowButtonClickCallback?: (callback: Function) => boolean;
    intersectionObserverRegister?: () => void;
    intersectionObserverUnregister?: () => void;
    updatePlaceholdersSize?: (_, placeholders: { top: number; bottom: number }) => void;
    updateShadowVisibility?: (_, shadowVisibility: { top: string; bottom: string }) => void;
    contextEvent?: {
        type: string;
        params: { scrollTop: number; scrollState: ScrollState; callback: () => void };
        handled?: boolean;
    };
    canHorizontalScroll?: boolean;
}

export interface IListScrollContextState extends IListScrollContextOptions {
    horizontalScrollMode?: string;
    getVerticalScrollPosition: Function;
    scrollTo: Function;
    getViewportRect: Function;
}

export default class Provider extends React.Component<
    IListScrollContextOptions,
    IListScrollContextState
> {
    horizontalScrollMode: THorizontalScrollMode;
    setHorizontalScrollMode: IListScrollContextOptions['setHorizontalScrollMode'];
    _setHorizontalScrollModeFromOptions: IListScrollContextOptions['setHorizontalScrollMode'];
    canHorizontalScroll: boolean;

    constructor(props: IListScrollContextOptions) {
        super(props);

        this.horizontalScrollMode = 'scrollbar';
        this.state = this.getNewOptions(this.props);
    }

    componentDidUpdate(): void {
        const newState = this.getNewOptions(this.props);
        if (
            this.state.horizontalScrollMode !== newState.horizontalScrollMode ||
            this.state.setHorizontalScrollMode !== newState.setHorizontalScrollMode ||
            this.state.canHorizontalScroll !== newState.canHorizontalScroll ||
            this.state.setArrowButtonClickCallback !== newState.setArrowButtonClickCallback ||
            this.state.removeArrowButtonClickCallback !== newState.removeArrowButtonClickCallback ||
            this.state.intersectionObserverRegister !== newState.intersectionObserverRegister ||
            this.state.intersectionObserverUnregister !== newState.intersectionObserverUnregister ||
            this.state.updatePlaceholdersSize !== newState.updatePlaceholdersSize ||
            this.state.updateShadowVisibility !== newState.updateShadowVisibility ||
            this.state.contextEvent !== newState.contextEvent
        ) {
            this.setState(newState);
        }
    }

    getNewOptions(props: Partial<IListScrollContextOptions>): IListScrollContextState {
        if (
            'canHorizontalScroll' in props &&
            props.canHorizontalScroll !== this.canHorizontalScroll
        ) {
            this.canHorizontalScroll = props.canHorizontalScroll;
        }

        if (
            'setHorizontalScrollMode' in props &&
            props.setHorizontalScrollMode !== this._setHorizontalScrollModeCallback
        ) {
            this._setHorizontalScrollModeCallback(props.setHorizontalScrollMode);
            this._setHorizontalScrollModeCallback = props.setHorizontalScrollMode;
        }

        return {
            setArrowButtonClickCallback: props.setArrowButtonClickCallback,
            removeArrowButtonClickCallback: props.removeArrowButtonClickCallback,
            intersectionObserverRegister: props.intersectionObserverRegister,
            intersectionObserverUnregister: props.intersectionObserverUnregister,
            updatePlaceholdersSize: props.updatePlaceholdersSize,
            updateShadowVisibility: props.updateShadowVisibility,
            contextEvent: props.contextEvent,
            canHorizontalScroll: props.canHorizontalScroll,
            setHorizontalScrollMode: this.setHorizontalScrollMode,
            horizontalScrollMode: this.horizontalScrollMode,
            getVerticalScrollPosition: props.getVerticalScrollPosition,
            scrollTo: props.scrollTo,
            getViewportRect: props.getViewportRect,
        };
    }

    _setHorizontalScrollModeCallback(
        cb: IListScrollContextOptions['setHorizontalScrollMode']
    ): void {
        this._setHorizontalScrollModeFromOptions = cb;
        this.setHorizontalScrollMode = (mode: THorizontalScrollMode) => {
            this.horizontalScrollMode = mode;
            this._setHorizontalScrollModeFromOptions(mode);
        };
    }

    render(): React.ReactElement {
        return (
            <ListScrollContext.Provider value={this.state}>
                <this.props.content {...this.props} />
            </ListScrollContext.Provider>
        );
    }
}

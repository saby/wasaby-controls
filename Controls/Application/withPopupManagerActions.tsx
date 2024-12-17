import { Component, ComponentType } from 'react';
import { IApplicationProps } from './Interfaces';
import { EventSubscriber, withWasabyEventObject } from 'UI/Events';
import { IPopupItem, Controller } from 'Controls/popup';
import { DimensionsMeasurer } from 'Controls/sizeUtils';
import { Bus } from 'Env/Event';
import { detection } from 'Env/Env';
import { List } from 'Types/collection';
import { mergeHandlers } from './Utils';

function isIOS13() {
    const oldIosVersion: number = 12;
    return detection.isMobileIOS && detection.IOSVersion > oldIosVersion;
}

export default function withPopupManagerActions<T extends IApplicationProps = IApplicationProps>(
    WrappedComponent: ComponentType<T>
) {
    return class extends Component<T> {
        private _globalPopup: any;

        constructor(props: T) {
            super(props);
            Controller.setTheme(props.theme);
            Controller.setDataLoaderModule(props.dataLoaderModule);
        }
        componentDidMount() {
            const channelPopupManager = Bus.channel('popupManager');
            channelPopupManager.subscribe(
                'managerPopupBeforeDestroyed',
                this._popupBeforeDestroyedHandler,
                this
            );
            window.document.addEventListener('scroll', this._scrollPage.bind(this));

            if (isIOS13()) {
                window.visualViewport.addEventListener('resize', this._resizePage.bind(this));
            }
            window.addEventListener('resize', this._resizePage.bind(this));
        }
        componentWillUnmount() {
            if (this._globalPopup) {
                this._globalPopup.registerGlobalPopupEmpty();
            }
            Controller.getController()?.destroy();

            const channelPopupManager = Bus.channel('popupManager');
            channelPopupManager.unsubscribe(
                'managerPopupBeforeDestroyed',
                this._popupBeforeDestroyedHandler,
                this
            );
        }
        private _popupBeforeDestroyedHandler(
            event: Event,
            popupCfg: IPopupItem,
            popupList: List<IPopupItem>,
            popupContainer: HTMLElement
        ): void {
            this._initPopupGlobalController().then(() => {
                this._globalPopup.popupBeforeDestroyedHandler(
                    event,
                    popupCfg,
                    popupList,
                    popupContainer
                );
            });
        }
        protected _openInfoBoxHandler(event: Event, config: unknown, withDelay?: boolean): void {
            this._initPopupGlobalController().then(() => {
                this._globalPopup.openInfoBoxHandler(event, config, withDelay);
            });
        }
        protected _openDialogHandler(
            event: Event,
            templ: unknown,
            templateOptions: unknown,
            opener: any
        ): Promise<unknown> {
            return this._globalPopup.openDialogHandler(event, templ, templateOptions, opener);
        }
        protected _closeInfoBoxHandler(event: Event, withDelay?: boolean): void {
            this._globalPopup?.closeInfoBoxHandler(event, withDelay);
        }
        protected _forceCloseInfoBoxHandler(_e: Event): void {
            this._globalPopup?.forceCloseInfoBoxHandler();
        }
        protected _openPreviewerHandler(
            event: unknown,
            config: unknown,
            type: unknown
        ): Promise<unknown> {
            return this._initPopupGlobalController().then(() => {
                return this._globalPopup?.openPreviewerHandler(event, config, type);
            });
        }
        protected _cancelPreviewerHandler(event: unknown, action: unknown): void {
            this._globalPopup?.cancelPreviewerHandler(event, action);
        }
        protected _isPreviewerOpenedHandler(event: unknown): boolean {
            if (!this._globalPopup) {
                return false;
            }
            return this._globalPopup.isPreviewerOpenedHandler(event);
        }
        protected _closePreviewerHandler(event: unknown, type: unknown): void {
            this._globalPopup?.closePreviewerHandler(event, type);
        }

        private _loadPopupGlobalController(): Promise<void> {
            return import('Controls/popupTemplateStrategy').then(({ GlobalController }) => {
                this._globalPopup = new GlobalController();
                this._globalPopup.registerGlobalPopup();
            });
        }

        private _initPopupGlobalController(): Promise<void> {
            if (this._globalPopup) {
                return Promise.resolve();
            }
            return this._loadPopupGlobalController();
        }

        protected _scrollPage(): void {
            Controller.getController()?.eventHandler('pageScrolled', []);
        }
        protected _resizePage(): void {
            Controller.getController()?.eventHandler('popupResizeOuter', []);
        }
        protected _mousedownPage(e: Event): void {
            // @ts-ignore
            Controller.getController()?.mouseDownHandler?.(e);
        }
        protected _pageScrolledHandler(_e: Event, ...args: any[]): void {
            Controller.getController()?.eventHandler.apply(Controller.getController(), [
                'pageScrolled',
                args,
            ]);
        }

        protected _workspaceResizeHandler(_e: Event, ...args: any[]): void {
            DimensionsMeasurer.resetCache(); // После изменения размеров страницы сбросим кэш, т.к. zoom мог поменяться
            Controller.getController()?.eventHandler.apply(Controller.getController(), [
                'workspaceResize',
                args,
            ]);
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    onScroll={mergeHandlers(this._scrollPage.bind(this), this.props.onScroll)}
                    onMouseDown={mergeHandlers(
                        this._mousedownPage.bind(this),
                        this.props.onMouseDown
                    )}
                    /*кастомные обработчики*/
                    openInfoBox={mergeHandlers(
                        this._openInfoBoxHandler.bind(this),
                        this.props.openInfoBox,
                        true
                    )}
                    serviceError={mergeHandlers(
                        this._openDialogHandler.bind(this),
                        this.props.serviceError,
                        true
                    )}
                    closeInfoBox={mergeHandlers(
                        this._closeInfoBoxHandler.bind(this),
                        this.props.closeInfoBox,
                        true
                    )}
                    forceCloseInfoBox={mergeHandlers(
                        this._forceCloseInfoBoxHandler.bind(this),
                        this.props.forceCloseInfoBox,
                        true
                    )}
                    openPreviewer={mergeHandlers(
                        this._openPreviewerHandler.bind(this),
                        this.props.openPreviewer,
                        true
                    )}
                    cancelPreviewer={mergeHandlers(
                        this._cancelPreviewerHandler.bind(this),
                        this.props.cancelPreviewer,
                        true
                    )}
                    isPreviewerOpened={mergeHandlers(
                        this._isPreviewerOpenedHandler.bind(this),
                        this.props.isPreviewerOpened,
                        true
                    )}
                    closePreviewer={mergeHandlers(
                        this._closePreviewerHandler.bind(this),
                        this.props.closePreviewer,
                        true
                    )}
                    pageScrolled={mergeHandlers(
                        this._pageScrolledHandler.bind(this),
                        this.props.pageScrolled,
                        true
                    )}
                    workspaceResize={mergeHandlers(
                        this._workspaceResizeHandler.bind(this),
                        this.props.workspaceResize,
                        true
                    )}
                    resize={mergeHandlers(this._resizePage.bind(this), this.props.resize, true)}
                />
            );
        }
        static displayName = 'withPopupManagerActions';
    };
}

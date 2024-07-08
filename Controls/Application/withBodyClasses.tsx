import { Component, ComponentType } from 'react';
import { IPopupItem } from 'Controls/popup';
import {
    BODY_CLASSES,
    BODY_CLASSES_STATE,
    IApplicationProps,
    IBodyClassesField,
    IBodyClassesStateField,
} from './Interfaces';
import { constants, detection } from 'Env/Env';
import { Body as PageBody, Head as PageHead } from 'Application/Page';
import { List } from 'Types/collection';
import { Bus } from 'Env/Event';
import { ControllerClass as DnDController, IDragObject } from 'Controls/dragnDrop';
import { TemplateFunction, Control } from 'UI/Base';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import { mergeHandlers } from './Utils';
import bodyClasses from './BodyClasses';

export default function withBodyClasses<T extends IApplicationProps = IApplicationProps>(
    WrappedComponent: ComponentType<T>
) {
    return class extends Component<T> {
        protected _bodyClasses: Record<string, string> & IBodyClassesField = { ...BODY_CLASSES };
        protected _bodyClassesState: Record<string, boolean> & IBodyClassesStateField = {
            ...BODY_CLASSES_STATE,
        };
        private _isPopupShow: boolean;
        private _isSuggestShow: boolean;

        private _dragnDropController: DnDController;
        private _shouldNotUpdateBodyClass: boolean;
        private _touchController: TouchDetect;

        constructor(props: T, context: { isScrollOnBody: boolean }) {
            super(props);
            this._createDragnDropController();
            this._initBodyClasses(props, context?.isScrollOnBody);
            this._createTouchDetector();
        }

        componentDidMount() {
            const channelPopupManager = Bus.channel('popupManager');
            channelPopupManager.subscribe('managerPopupCreated', this._popupCreatedHandler, this);
            channelPopupManager.subscribe(
                'managerPopupDestroyed',
                this._popupDestroyedHandler,
                this
            );
        }

        componentWillUnmount() {
            const channelPopupManager = Bus.channel('popupManager');
            channelPopupManager.unsubscribe('managerPopupCreated', this._popupCreatedHandler, this);
            channelPopupManager.unsubscribe(
                'managerPopupDestroyed',
                this._popupDestroyedHandler,
                this
            );
            this._dragnDropController.destroy();
        }

        protected _updateDraggingTemplate(
            _e: Event,
            draggingTemplateOptions: IDragObject,
            draggingTemplate: TemplateFunction
        ): void {
            this._dragnDropController.updateDraggingTemplate(
                draggingTemplateOptions,
                draggingTemplate
            );
        }

        protected _removeDraggingTemplate(_e: Event): void {
            this._dragnDropController.removeDraggingTemplate();
        }

        protected _registerHandler(
            event: Event,
            registerType: string,
            component: Control,
            callback: (...args: unknown[]) => void,
            config: object
        ): void | IDragObject {
            return this._dragnDropController.registerHandler(
                event,
                registerType,
                component,
                callback,
                config
            );
        }

        protected _unregisterHandler(
            event: Event,
            registerType: string,
            component: Control,
            config: object
        ): void {
            this._dragnDropController.unregisterHandler(event, registerType, component, config);
        }

        protected _mousemovePage(): void {
            if (!this._shouldNotUpdateBodyClass) {
                this._updateTouchClass();
            }
        }

        protected _touchStartPage(): void {
            this._updateTouchClass();
        }

        private _setDragType(
            dragObject?: IDragObject<{ shouldNotUpdateBodyClass: boolean }>
        ): void {
            if (!dragObject?.entity?.cursorType) {
                this._bodyClassesState.drag = true;
                return;
            }
            const cursorType = dragObject?.entity?.cursorType;
            if (cursorType === 'scroll') {
                this._bodyClassesState.scroll = true;
            } else if (cursorType === 'horizontalResize') {
                this._bodyClassesState.horizontalResize = true;
            } else if (cursorType === 'verticalResize') {
                this._bodyClassesState.verticalResize = true;
            }
        }

        private _dragStartHandler(
            dragObject?: IDragObject<{ shouldNotUpdateBodyClass: boolean }>
        ): void {
            this._setDragType(dragObject);
            this._shouldNotUpdateBodyClass = !!dragObject?.entity?.shouldNotUpdateBodyClass;
            if (!this._shouldNotUpdateBodyClass) {
                this._updateTouchClass();
            }
        }

        private _dragEndHandler(
            dragObject?: IDragObject<{ shouldNotUpdateBodyClass: boolean }>
        ): void {
            this._bodyClassesState.drag = false;
            this._bodyClassesState.verticalResize = false;
            this._bodyClassesState.horizontalResize = false;
            this._bodyClassesState.scroll = false;
            this._shouldNotUpdateBodyClass = false;
            if (!dragObject?.entity?.shouldNotUpdateBodyClass) {
                this._updateTouchClass();
            }
        }

        private _isHover(): boolean {
            return (
                !this._bodyClassesState.touch &&
                !this._bodyClassesState.drag &&
                !this._bodyClassesState.scroll &&
                !this._bodyClassesState.verticalResize &&
                !this._bodyClassesState.horizontalResize
            );
        }

        private _createDragnDropController(): void {
            this._dragnDropController = new DnDController();
        }

        protected _documentDragStart(
            _e: Event,
            dragObject: IDragObject<{ shouldNotUpdateBodyClass: boolean }>
        ): void {
            this._dragnDropController.documentDragStart(dragObject);
            this._dragStartHandler(dragObject);
        }

        protected _documentDragEnd(
            _e: Event,
            dragObject: IDragObject<{ shouldNotUpdateBodyClass: boolean }>
        ): void {
            this._dragnDropController.documentDragEnd(dragObject);
            this._dragEndHandler(dragObject);
        }

        private _updateFromOptionsClass(): void {
            this._updateBodyClasses({
                fromOptions: this.props.bodyClass || '',
            });
        }

        private _updateTouchClass(updated: Partial<IBodyClassesField> = {}): void {
            // Данный метод вызывается до построения вёрстки, и при первой отрисовке еще нет _children (это нормально)
            // поэтому сами детектим touch с помощью compatibility
            if (this._touchController) {
                this._bodyClassesState.touch = this._touchController.isTouch();
            } else {
                this._bodyClassesState.touch = !!detection.isMultiTouch;
            }

            this._bodyClassesState.hover = this._isHover();

            this._updateBodyClasses(updated);
        }

        private _updateThemeClass(): void {
            this._updateBodyClasses({
                themeClass: 'Application-body',
                bodyThemeClass: `controls_theme-${this.props.theme}`,
            });
        }

        private _createTouchDetector(): void {
            this._touchController = TouchDetect.getInstance();
        }

        private _popupCreatedHandler(): void {
            this._isPopupShow = true;

            this._updateScrollingClass();
        }

        private _popupDestroyedHandler(
            _event: Event,
            _element: IPopupItem,
            popupItems: List<IPopupItem>
        ): void {
            if (popupItems.getCount() === 0) {
                this._isPopupShow = false;
            }
            this._updateScrollingClass();
        }

        protected _keyPressHandler(event: KeyboardEvent): void {
            if (this._isPopupShow) {
                if (constants.browser.safari) {
                    // Need to prevent default behaviour if popup is opened
                    // because safari escapes fullscreen mode on 'ESC' pressed
                    // TODO https://online.sbis.ru/opendoc.html?guid=5d3fdab0-6a25-41a1-8018-a68a034e14d9
                    if (event?.keyCode === 27) {
                        event.preventDefault();
                    }
                }
            }
        }

        /** Задаем классы для body, которые не будут меняться */
        private _initBodyClasses(cfg: IApplicationProps, isScrollOnBody: boolean): void {
            this._initIsAdaptiveClass(cfg, isScrollOnBody);
            const BodyAPI = PageBody.getInstance();
            // Эти классы вешаются в двух местах. Разница в том, что BodyClasses всегда возвращает один и тот же класс,
            // а TouchDetector реагирует на изменение состояния.
            // Поэтому в Application оставим только класс от TouchDetector
            const classesToAdd = bodyClasses();
            for (const key in this._bodyClasses) {
                if (this._bodyClasses.hasOwnProperty(key)) {
                    if (Boolean(this._bodyClasses[key])) {
                        this._bodyClasses[key].split(' ').forEach((_class) => {
                            return classesToAdd.push(_class);
                        });
                    }
                }
            }
            this._prepareDataForBodyAPI([], classesToAdd);
            BodyAPI.replaceClasses([], classesToAdd);
        }

        private _initIsAdaptiveClass(cfg: IApplicationProps, isScrollOnBody: boolean): void {
            // TODO: toso
            if (cfg.isAdaptive) {
                let viewport = 'width=device-width, initial-scale=1.0, user-scalable=no';
                if (!!isScrollOnBody) {
                    viewport += ', viewport-fit=cover';
                }
                PageHead.getInstance().createTag('meta', {
                    name: 'viewport',
                    content: viewport,
                });
                // Подписка на 'touchmove' необходима для отключения ресайза в адаптивном режиме.
                // https://stackoverflow.com/questions/37808180/disable-viewport-zooming-ios-10-safari

                if (constants.isBrowserPlatform) {
                    document.addEventListener(
                        'touchmove',
                        (event) => {
                            // event.scale === undefined в эмуляторе.
                            // non-standard property
                            // @ts-ignore
                            if (event.scale !== undefined && event.scale !== 1) {
                                event.preventDefault();
                            }
                        },
                        { passive: false }
                    );
                }
            }
        }

        protected _suggestStateChangedHandler(_e: Event, state: boolean): void {
            this._isSuggestShow = state;
            this._updateScrollingClass();
        }

        private _updateScrollingClass(): void {
            let scrollingClass;
            if (detection.isMobileIOS) {
                if (this._isPopupShow || this._isSuggestShow) {
                    scrollingClass = 'controls-Scroll_webkitOverflowScrollingAuto';
                } else {
                    scrollingClass = 'controls-Scroll_webkitOverflowScrollingTouch';
                }
            } else {
                scrollingClass = '';
            }

            this._updateBodyClasses({
                scrollingClass,
            });
        }

        /**
         * Метод добавит к информации для Body API данные о классах типа ws-is-touch | ws-is-no-touch
         * Тоесть, о взаимоисключающих классах. Их наличие регулируется логическим флагом в объекте this._bodyClassesState
         * @param classesToDelete
         * @param classesToAdd
         * @private
         */
        private _prepareDataForBodyAPI(
            classesToDelete: string[] = [],
            classesToAdd: string[] = []
        ): void {
            let classToAdd: string;
            let classToDelete: string;

            Object.keys(this._bodyClassesState).forEach((key) => {
                classToAdd = `ws-is-${this._bodyClassesState[key] ? '' : 'no-'}${key}`;
                classToDelete = `ws-is-${!this._bodyClassesState[key] ? '' : 'no-'}${key}`;
                if (!classesToAdd.includes(classToAdd)) {
                    classesToAdd.push(classToAdd);
                }
                if (!classesToDelete.includes(classToDelete)) {
                    classesToDelete.push(classToDelete);
                }
            });
        }

        private _updateBodyClasses(
            updated?: Record<string, string> & Partial<IBodyClassesField>
        ): void {
            const BodyAPI = PageBody.getInstance();
            const bodyClassesToUpdate: Record<string, string> & Partial<IBodyClassesField> =
                updated || this._bodyClasses;
            let classesToDelete: string[] = [];
            let classesToAdd: string[] = [];

            for (const key in bodyClassesToUpdate) {
                if (bodyClassesToUpdate.hasOwnProperty(key)) {
                    if (bodyClassesToUpdate[key] === this._bodyClasses[key]) {
                        continue;
                    }
                    classesToAdd = classesToAdd.concat(
                        bodyClassesToUpdate[key].split(' ').filter(Boolean)
                    );
                    classesToDelete = classesToDelete.concat(
                        this._bodyClasses[key].split(' ').filter(Boolean)
                    );
                    this._bodyClasses[key] = bodyClassesToUpdate[key] || '';
                }
            }

            classesToDelete = classesToDelete.filter((value: string) => {
                return !classesToAdd.includes(value);
            });

            this._prepareDataForBodyAPI(classesToDelete, classesToAdd);
            if (classesToAdd.length || classesToDelete.length) {
                BodyAPI.replaceClasses(classesToDelete, classesToAdd);
            }
        }

        render() {
            this._updateTouchClass();
            this._updateThemeClass();
            this._updateFromOptionsClass();

            return (
                /*<EventSubscriber
                    onSuggestStateChanged={this._suggestStateChangedHandler.bind(this)}
                    on_updateDraggingTemplate={this._updateDraggingTemplate.bind(this)}
                    on_removeDraggingTemplate={this._removeDraggingTemplate.bind(this)}
                    on_documentDragStart={this._documentDragStart.bind(this)}
                    on_documentDragEnd={this._documentDragEnd.bind(this)}
                    onRegister={withWasabyEventObject(this._registerHandler.bind(this))}
                    onUnregister={withWasabyEventObject(this._unregisterHandler.bind(this))}
                >*/
                <WrappedComponent
                    {...this.props}
                    onMouseMove={mergeHandlers(
                        this._mousemovePage.bind(this),
                        this.props.onMouseMove
                    )}
                    onTouchStart={mergeHandlers(
                        this._touchStartPage.bind(this),
                        this.props.onTouchStart
                    )}
                    onKeyPress={mergeHandlers(
                        this._keyPressHandler.bind(this),
                        this.props.onKeyPress
                    )}
                    /*кастомные обработчики*/
                    suggestStateChanged={mergeHandlers(
                        this._suggestStateChangedHandler.bind(this),
                        this.props.suggestStateChanged,
                        true
                    )}
                    _updateDraggingTemplate={mergeHandlers(
                        this._updateDraggingTemplate.bind(this),
                        this.props._updateDraggingTemplate,
                        true
                    )}
                    _removeDraggingTemplate={mergeHandlers(
                        this._removeDraggingTemplate.bind(this),
                        this.props._removeDraggingTemplate,
                        true
                    )}
                    _documentDragStart={mergeHandlers(
                        this._documentDragStart.bind(this),
                        this.props._documentDragStart,
                        true
                    )}
                    _documentDragEnd={mergeHandlers(
                        this._documentDragEnd.bind(this),
                        this.props._documentDragEnd,
                        true
                    )}
                    register={mergeHandlers(
                        this._registerHandler.bind(this),
                        this.props.register,
                        true
                    )}
                    unregister={mergeHandlers(
                        this._unregisterHandler.bind(this),
                        this.props.unregister,
                        true
                    )}
                />
                /*</EventSubscriber>*/
            );
        }

        static displayName = 'withBodyClasses';
    };
}

/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import * as CompoundContainer from 'Core/CompoundContainer';
import * as template from 'wml!Controls/_compatiblePopup/CompoundAreaForOldTpl/CompoundArea';
import * as LikeWindowMixin from 'Lib/Mixins/LikeWindowMixin';
import * as arrayFindIndex from 'Core/helpers/Array/findIndex';
import * as trackElement from 'Core/helpers/Hcontrol/trackElement';
import * as doAutofocus from 'Core/helpers/Hcontrol/doAutofocus';
import * as EnvEvent from 'Env/Event';
import { Deferred as cDeferred } from 'Types/deferred';
import * as cInstance from 'Core/core-instance';
import * as callNext from 'Core/helpers/Function/callNext';
import { Controller } from 'Controls/popup';
import { delay as runDelayed } from 'Types/function';
import { InstantiableMixin } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Logger } from 'UI/Utils';
import { getClosestControl } from 'UI/NodeCollector';
import { Bus as EventBus } from 'Env/Event';
import { constants, detection, coreDebug } from 'Env/Env';
import * as CloseButtonTemplate from 'wml!Controls/_compatiblePopup/CloseButtonTemplate';
import 'css!Controls/compatiblePopup';

function removeOperation(operation, array) {
    const idx = arrayFindIndex(array, (op) => {
        return op === operation;
    });
    array.splice(idx, 1);
}

function finishResultOk(result) {
    return !(result instanceof Error || result === false);
}

const allProducedPendingOperations = [];
const invisibleRe = /ws-invisible/gi;
const hiddenRe = /ws-hidden/gi;
const popupHiddenClasses = ['controls-Popup__hidden', 'ws-hidden'];
let DialogRecord;

/**
 * Слой совместимости для открытия старых шаблонов в новых попапах
 */
const CompoundArea = CompoundContainer.extend([InstantiableMixin, LikeWindowMixin], {
    _template: template,
    _compoundId: undefined,

    _beforeCloseHandlerResult: true,
    _isClosing: false,
    _pending: null,
    _pendingTrace: null,
    _waiting: null,

    _childPendingOperations: null,
    _allChildrenPendingOperation: null,
    _finishPendingQueue: null,
    _isFinishingChildOperations: false,
    _producedPendingOperations: null,

    _isReadOnly: true,

    _baseAfterUpdate: null,
    _popupController: null,

    _beforeMount(_options) {
        CompoundArea.superclass._beforeMount.apply(this, arguments);

        this._hasRightPanel = Controller.hasRightPanel();
        this._childPendingOperations = [];
        this._producedPendingOperations = [];

        this._className = `controls-CompoundArea controls_popupTemplate_theme-${_options.theme}`;
        if (_options.type !== 'base') {
            // Старые шаблоны завязаны селекторами на этот класс.
            this._className += _options.type === 'stack' ? ' ws-float-area' : ' ws-window';
        }

        // Отступ крестика должен быть по старым стандартам. У всех кроме стики, переопределяем
        if (
            (_options.popupComponent !== 'floatArea' && _options.type === 'dialog') ||
            _options.type === 'stack'
        ) {
            this._className += ' controls-CompoundArea-close_button';
        }

        let type = _options.type || 'dialog';
        if (type === 'dialog') {
            type += `-${_options.maximize ? 'maximized' : 'minimized'}`;
        }
        this._className += ` controls-CompoundArea_type-${type}`;

        this.subscribeTo(
            EnvEvent.Bus.channel('navigation'),
            'onBeforeNavigate',
            this._onBeforeNavigate.bind(this)
        );

        this._childControlName = _options.template;

        /*
        Поведение если вызвали через ENGINE/MiniCard.
       */
        this._hoverTargetMouseEnterHandler = () => {
            clearTimeout(this._hoverTimer);
            if (!this._destroyed) {
                this._hoverTimer = null;
            }
        };
        this._hoverTargetMouseOutHandler = () => {
            const timerDelay: number = 1000;
            this._hoverTimer = setTimeout(() => {
                if (!this._destroyed) {
                    this.hide();
                }
            }, timerDelay);
        };
        if (_options.hoverTarget) {
            $(_options.hoverTarget).on('mouseenter', this._hoverTargetMouseEnterHandler);
            $(_options.hoverTarget).on('mouseleave', this._hoverTargetMouseOutHandler);
        }
        if (_options.popupComponent === 'recordFloatArea') {
            if (typeof _options.readOnly !== 'undefined') {
                this._isReadOnly = _options.readOnly;
            } else {
                // Старая RecordFloatArea по умолчанию имела значение
                // опции readOnly === false
                this._isReadOnly = false;
            }
            return new Promise((resolve) => {
                requirejs(
                    ['optional!Deprecated/Controls/DialogRecord/DialogRecord'],
                    (DeprecatedDialogRecord) => {
                        DialogRecord = DeprecatedDialogRecord;
                        this.subscribeOnBeforeUnload();
                        resolve();
                    },
                    () => {
                        return resolve;
                    }
                );
            });
        }
    },

    _beforeUpdate(popupOptions): void {
        if (popupOptions._compoundId !== this._compoundId) {
            this._childConfig = popupOptions.templateOptions || {};
            this._childControlName = popupOptions.template;
            this.rebuildChildControl();
            this._compoundId = popupOptions._compoundId;
        }
        if (popupOptions.canMaximize) {
            const maximized = this.getContainer().hasClass('ws-float-area-maximized-mode');
            const templateComponent = this._getTemplateComponent();
            this.getContainer().toggleClass(
                'ws-float-area-has-maximized-button',
                popupOptions.maximizeButtonVisibility || false
            );
            const maximizedButtonClass = ' ws-float-area-has-maximized-button';
            if (popupOptions.maximizeButtonVisibility) {
                if (this._className.indexOf(maximizedButtonClass) === -1) {
                    this._className += maximizedButtonClass;
                }
            } else if (this._className.indexOf(maximizedButtonClass) >= 0) {
                this._className = this._className.replace(maximizedButtonClass, '');
            }
            this.getContainer().toggleClass(
                'ws-float-area-maximized-mode',
                popupOptions.maximized || false
            );
            if (templateComponent && maximized !== popupOptions.maximized) {
                templateComponent._notifyOnSizeChanged();
                templateComponent._notify('onChangeMaximizeState', popupOptions.maximized);
                templateComponent._options.isPanelMaximized = popupOptions.maximized;
                this._notify('onChangeMaximizeState', popupOptions.maximized);
            }
        }
    },

    _shouldUpdate() {
        return false;
    },

    _onBeforeNavigate(event, activeElement, isIconClick) {
        if (!isIconClick && !activeElement?.forbidClose) {
            this.close();
        }
    },

    _changeMaximizedMode(event) {
        event.stopPropagation();
        const state = this.getContainer().hasClass('ws-float-area-maximized-mode');
        this._notifyVDOM('maximized', [!state], { bubbling: true });
    },

    rebuildChildControl() {
        this._childConfig._compoundArea = this;

        this.once('onInit', () => {
            // _initCompoundArea должен быть вызван после уничтожения старого childControl (если он есть), но перед
            // созданием нового, поэтому делаем на onInit
            if (this._options._initCompoundArea) {
                this._options._initCompoundArea(this);
            }
            EnvEvent.Bus.globalChannel().notify('onFloatAreaCreating', this);
            this.setEnabled(this._enabled);
        });
        this.once('onAfterLoad', () => {
            // StickyHeaderMediator listens for onWindowCreated
            EnvEvent.Bus.globalChannel().notify('onWindowCreated', this);
        });

        const rebuildDeferred = CompoundArea.superclass.rebuildChildControl.apply(this, arguments);
        this._logicParent.waitForPopupCreated = true;
        this._isPopupCreated = false;
        this._waitReadyDeferred = true;
        rebuildDeferred.addCallback(() => {
            this._getReadyDeferred();
            this._fixIos();
            runDelayed(() => {
                // Если до момента показа ребенок уже потерт, то закрываем окно.
                if (this._childControl) {
                    this._childControl._notifyOnSizeChanged();
                    this._notifyManagerPopupCreated();
                    runDelayed(() => {
                        this._isPopupCreated = true;
                        if (!this._waitReadyDeferred) {
                            // Если попап создан и отработал getReadyDeferred - начинаем показ
                            this._callCallbackCreated();
                        }
                    });
                } else {
                    this._notifyVDOM('close', null, { bubbling: true });
                }
            });
        });

        return rebuildDeferred;
    },

    isPopupCreated(): boolean {
        return this._isPopupCreated;
    },

    getIsStack() {
        return this._options.type === 'stack';
    },

    getShowOnControlsReady() {
        return true;
    },

    _notifyManagerPopupCreated(): void {
        // Слой совместимости нотифаит событие manager'a за него, т.к. только он знает, когда будет построен старый шаблон
        const item = this._getManagerConfig();
        const popupItems = Controller.getContainer()._popupItems;
        // Нотифай события делаю в следующий цикл синхронизации после выставления позиции окну.
        EventBus.channel('popupManager').notify('managerPopupCreated', item, popupItems);
    },

    _notifyManagerPopupDestroyed(): void {
        const item = this._getManagerConfig();
        const options = item?.popupOptions;
        const event = 'onClose';
        if (options?._events[event]) {
            options._events[event](event, []);
        }
    },

    _getDialogClasses() {
        // При fixed таргета нет => совместимость определяет это окно как type === 'dialog'
        // и использует его позиционирование
        // Но на самом диалоге такой опции нет, т.к. это опция FloatArea => в этом случае класс диалога не вешаем
        if (this._options.type === 'dialog' && !this._options.fixed) {
            return ' ws-window-content';
        }
        return '';
    },

    _fixIos() {
        // крутейшая бага, айпаду не хватает перерисовки.
        // уже с такой разбирались, подробности
        // https://online.sbis.ru/opendoc.html?guid=e9a6ea23-6ded-40da-9b9e-4c2d12647d84
        let container = this._childControl && this._childControl.getContainer();

        // не вызывается браузерная перерисовка. вызываю вручную
        if (container && constants.browser.isMobileIOS) {
            container = container.get ? container.get(0) : container;
            setTimeout(() => {
                container.style.webkitTransform = 'scale(1)';

                // Если внутри контейнера верстка написана абсолютами с большой вложенностью,
                // ios при scale(1) просто ее не показывает.
                // Пример ошибки https://online.sbis.ru/opendoc.html?guid=bb492dee-cc34-4e60-9174-5224ef47f047
                setTimeout(() => {
                    container.style.webkitTransform = '';
                }, 200);
            }, 100);
        }
    },

    // AreaAbstract.js::getReadyDeferred
    // getReadyDeferred с areaAbstract, который даёт возможность отложить показ компонента в области, пока
    // не завершится деферред
    _getReadyDeferred() {
        if (this._childControl.getReadyDeferred) {
            const def = this._childControl.getReadyDeferred();
            if (cInstance.instanceOfModule(def, 'Types/deferred:Deferred') && !def.isReady()) {
                def.addCallback(() => {
                    this._waitReadyDeferred = false;
                    if (this._isPopupCreated) {
                        // Если попап создан и отработал getReadyDeferred - начинаем показ
                        this._callCallbackCreated();
                    }
                    this._notifyVDOM('controlResize', [], {
                        bubbling: true,
                    });
                });
                def.addErrback(() => {
                    // Защита на случай если промис из getReadyDeferred упал с ошибкой.
                    // В этом случае даем окну достроиться, чтобы корректно отработали внутренние механизмы,
                    // и сразу закрываем. Визуально окно не откроется.
                    if (this._isPopupCreated) {
                        this._callCallbackCreated();
                        this._notify('close', [], { bubbling: true });
                    }
                });
            } else {
                this._waitReadyDeferred = false;
            }
        } else {
            this._waitReadyDeferred = false;
        }
    },

    _callCallbackCreated() {
        // До инициализации старого контрола окно могли закрыть (позвали close в конструкторе шаблона).
        // В этом случае логический родитель уже почищен, защищаюсь, чтобы код совместимости не падал.
        if (!this._logicParent) {
            return;
        }
        if (this._logicParent.callbackCreated) {
            this._logicParent.callbackCreated();
        }
        this._logicParent.waitForPopupCreated = false;
        if (this._waitClose) {
            this._waitClose = false;
            this.close();
        } else {
            this._setCustomContentAsync();
            this._registerLinkedView();
            runDelayed(() => {
                // Перед автофокусировкой нужно проверить, что фокус уже не находится внутри
                // панели, т. к. этот callback вызывается уже после полного цикла создания
                // старой области, и фокус могли проставить с прикладной стороны (в onInit,
                // onAfterShow, onReady, ...).
                // В таком случае, если мы позовем автофокус, мы можем сбить правильно поставленный
                // фокус.

                if (
                    this._options.catchFocus &&
                    this.getContainer().length &&
                    !this.getContainer()[0].contains(document.activeElement)
                ) {
                    doAutofocus(this.getContainer());
                }
            });
        }
    },

    _setCustomContentAsync() {
        // Каким-то чудом на медленных машинах не успевает построиться childControl.
        // Сам повторить не смог, ставлю защиту
        if (this._destroyed) {
            return;
        }
        if (!this._childControl) {
            runDelayed(() => {
                this._setCustomContentAsync();
            });
        } else {
            this._setCustomHeader();
            this._setCustomToolbar();
        }
    },

    _afterMount(cfg) {
        this._options = cfg;
        this._enabled = cfg.hasOwnProperty('enabled') ? cfg.enabled : true;

        this.getContainer().toggleClass(
            'ws-float-area-has-close-button',
            !Controller.hasRightPanel()
        );

        // wsControl нужно установить до того, как запустим автофокусировку.
        // Потому что она завязана в том числе и на этом свойстве
        const container = this.getContainer()[0];
        container.wsControl = this;

        // Заполнять нужно раньше чем позовется doAutofocus ниже.
        // doAutofocus спровоцирует уход фокуса, старый менеджер будет проверять связи и звать метод getOpener,
        // который в совместимости возвращает данные с состояния. если они не заполнены, будут проблемы с проверкой связи.
        this.__openerFromCfg = this._options.__openerFromCfg;
        this._parent = this._options.__parentFromCfg || this._options._logicParent;
        this._logicParent = this._options._logicParent;

        // Переведем фокус сразу на окно, после построения шаблона уже сфокусируем внутренности
        // Если этого не сделать, то во время построения окна, при уничтожении контролов в
        // других областях запустится восстановление фокуса,
        // которое восстановит его в последнюю активную область.
        if (this._options.catchFocus) {
            doAutofocus(this.getContainer());
        }

        // Для не-vdom контролов всегда вызывается _oldDetectNextActiveChildControl, в BaseCompatible
        // определена ветка в которой для vdom контролов используется новая система фокусов, а в случае
        // CompoundArea мы точно знаем, что внутри находится CompoundControl и фокус нужно распространять
        // по правилам AreaAbstract.compatible для контролов WS3
        this.detectNextActiveChildControl = this._oldDetectNextActiveChildControl;

        this._childConfig = this._options.templateOptions || {};
        this._compoundId = this._options._compoundId;

        this._pending = this._pending || [];
        this._pendingTrace = this._pendingTrace || [];
        this._waiting = this._waiting || [];

        // getParent() возвращает правильного предка, но у предка не зареган потомок.
        // регаем в предке CompoundArea и содержимое начинает искаться по getChildControlByName
        const parent = this.getParent();
        if (parent && this._registerToParent) {
            this._registerToParent(parent);
        }
        if (this._options.parent) {
            this._options.parent = null;
        }

        this._notifyVDOM = this._notify;
        this._notify = this._notifyCompound;

        this._subscribeOnResize();

        this._windowResize = this._windowResize.bind(this);
        if (constants.isBrowserPlatform) {
            window.addEventListener('resize', this._windowResize);
        }

        this._trackTarget(true);
        this._createBeforeCloseHandlerPending();

        this.rebuildChildControl().addCallback(() => {
            runDelayed(() => {
                runDelayed(() => {
                    this._notifyCompound('onResize');
                });
            });
        });

        // В рознице для шапки используется отдельная тема.
        // В ситуации, когда крестик позиционируется вне шапки, задаем ему класс с переменными темы шапки
        // https://online.sbis.ru/opendoc.html?guid=b1dd3531-a18a-4ff5-85c7-edd6563d82e7
        const closeButton = $(
            '.controls-DialogTemplate__close-button_without_head .controls-Button__close',
            this.getContainer()
        );

        this.listener = this._children.listener;
    },

    _beforeUnmount() {
        if (this._beforeClosePendingDeferred && !this._beforeClosePendingDeferred.isReady()) {
            this._beforeClosePendingDeferred.callback();
            this._beforeClosePendingDeferred = null;
        }

        const parent = this.getParent();
        if (parent?.unregisterChildControl) {
            parent.unregisterChildControl(this);
        }
        this.__openerFromCfg = null;
        this._logicParent = null;
        if (this._options.popupComponent === 'recordFloatArea') {
            this.unsubscribeOnBeforeUnload();
        }
        if (this._options.hoverTarget) {
            $(this._options.hoverTarget).off('mouseenter', this._hoverTargetMouseEnterHandler);
            $(this._options.hoverTarget).off('mouseleave', this._hoverTargetMouseOutHandler);
        }
    },

    isOpened(): boolean {
        if (!this._options.autoShow) {
            const popupContainer = this._container.closest('.controls-Popup');
            if (popupContainer) {
                return !(
                    popupContainer.classList.contains(popupHiddenClasses[0]) ||
                    popupContainer.classList.contains(popupHiddenClasses[1])
                );
            }
        }
        return true;
    },

    _isValidTarget(target) {
        const isValid =
            !target ||
            target instanceof jQuery ||
            (typeof Node !== 'undefined' && target instanceof Node);
        if (!isValid) {
            Logger.error(this._moduleName, 'Передано некорректное значение опции target', this);
        }
        return isValid;
    },

    _trackTarget(track) {
        const target = this._options.target;

        // Защита от неправильно переданной опции target
        if (!this._options.trackTarget || !target || !this._isValidTarget(target)) {
            return;
        }

        // на всякий случай отписываемся, чтобы не было массовых подписок
        trackElement(target, false);

        if (track) {
            trackElement(target)
                .subscribe('onMove', (event, offset, isInitial) => {
                    if (!this.isDestroyed() && !isInitial) {
                        if (this._options.closeOnTargetScroll) {
                            // 1. Если показалась клавиатура, то не реагируем на onMove таргета
                            // 2. После скрытия клавиатуры тоже не реагируем.
                            if (!this._isIosKeyboardVisible()) {
                                if (!this._isKeyboardVisible) {
                                    this.close();
                                } else {
                                    this._isKeyboardVisible = false;
                                }
                            }
                        } else {
                            // Перепозиционируемся
                            this._notifyVDOM('controlResize', [], {
                                bubbling: true,
                            });
                        }
                    }
                })
                .subscribe('onVisible', (event, visibility) => {
                    if (!this.isDestroyed() && !visibility) {
                        // После правок на шаблон совместимости перестал вешаться класс. Вешается на окно.
                        const parentVdomPopup = $(this._options.target).closest('.controls-Popup');
                        const hasClass =
                            parentVdomPopup.hasClass(popupHiddenClasses[0]) ||
                            parentVdomPopup.hasClass(popupHiddenClasses[1]);
                        // Вдомные стековые окна, если перекрыты другими окнами из стека, скрываются через ws-hidden.
                        // PopupMixin реагирует на скритие таргета и закрывается.
                        // Делаю фикс, чтобы в этом случае попап миксин не закрывался
                        if (!parentVdomPopup.length || !hasClass) {
                            this.close();
                        }
                    }
                });
        }
    },

    _isIosKeyboardVisible(): boolean {
        const isVisible = constants.browser.isMobileIOS && window.scrollY > 0;
        if (isVisible) {
            this._isKeyboardVisible = true;
        }
        return isVisible;
    },

    _updateCustomToolbarMenuIcon(content): void {
        if (content) {
            const toolbarMenuIcon = content.querySelector(
                '.controls-ToolBar__menuIcon .icon-ExpandDown'
            );
            if (toolbarMenuIcon) {
                toolbarMenuIcon.classList.remove('icon-ExpandDown');
                toolbarMenuIcon.classList.add('icon-SettingsNew');
            }
        }
    },

    _updateCustomToolbarCloseButton(content): void {
        const menuButton = content.find('.controls-ToolBar__menuIcon'); // Кнопка с меню
        if (menuButton.length) {
            const isCompound = menuButton.hasClass('compoundarea-processed'); // Чтобы не подписываться много раз
            if (!isCompound) {
                menuButton.addClass('compoundarea-processed');
                const menuButtonControl = menuButton.wsControl();
                menuButtonControl.subscribe('onPickerOpen', () => {
                    const pickerContainer = menuButtonControl._picker.getContainer();
                    // Скрыли старую кнопку
                    pickerContainer.find('.controls-PopupMixin__closeButton').addClass('ws-hidden');
                    const newCloseButton = pickerContainer.find('.compoundarea-closebutton');

                    // Создаем новую кнопку закрытия если ее еще нет
                    if (!newCloseButton.length) {
                        const closeButtonHTML = $(
                            CloseButtonTemplate({
                                theme: 'default',
                                viewMode: 'external',
                                size: 'm',
                            })
                        );
                        pickerContainer.append(closeButtonHTML);
                        closeButtonHTML.addClass('compoundarea-closebutton');
                        closeButtonHTML.css({
                            position: 'absolute',
                            zIndex: 10,
                            top: 8,
                            left: -33,
                        });

                        closeButtonHTML.on('click', () => {
                            menuButtonControl.hidePicker();
                        });
                    }
                });
            }
        }
    },

    _setCustomToolbar(): void {
        if (this._options.isToolbarOnRightPanel && Controller.hasRightPanel()) {
            const toolbarContent = $('.controls-ToolBar:first', this._childControl.getContainer());
            if (toolbarContent.length) {
                const toolbarContainer = $('.controls-CompoundArea_toolbar', this.getContainer());
                if (toolbarContainer.length) {
                    this._updateCustomToolbarMenuIcon(toolbarContent[0]);
                    this._updateCustomToolbarCloseButton(toolbarContent);
                    const wsControl = toolbarContent.wsControl();
                    const setEnabled = wsControl.setEnabled.bind(wsControl);
                    wsControl.setEnabled = (enabled) => {
                        setEnabled(enabled);
                        this._updateCustomToolbarMenuIcon(toolbarContainer[0]);
                    };
                    toolbarContainer.prepend(toolbarContent);
                }
            }
        }
    },

    _setCustomHeader() {
        const hasHeader = !!this._options.caption;
        const headerPaddingClass = ' controls-CompoundArea-headerPadding';
        let customHeaderContainer = this._getCustomHeaderContainer();
        if (
            hasHeader ||
            (this._options.popupComponent === 'dialog' &&
                !customHeaderContainer.length &&
                !this._options.hideCross)
        ) {
            if (customHeaderContainer.length) {
                if ($('.ws-float-area-title', customHeaderContainer).length === 0) {
                    customHeaderContainer.prepend(
                        '<div class="ws-float-area-title">' + this._options.caption + '</div>'
                    );
                }
                this.setRoundedClassOnDialogTemplate();
                this._prependCustomHeader(customHeaderContainer);
            } else {
                customHeaderContainer = $(
                    '<div class="ws-window-titlebar"><div class="ws-float-area-title ws-float-area-title-generated">' +
                        (this._options.caption || '') +
                        '</div></div>'
                );
                this.getContainer().prepend(customHeaderContainer);
                this.getContainer().addClass('controls-CompoundArea-headerPadding');
                this._className += headerPaddingClass;
                this.setRoundedClassOnDialogTemplate();
            }
        } else if (customHeaderContainer.length && this._options.type === 'dialog') {
            this._prependCustomHeader(customHeaderContainer);
            this.setRoundedClassOnDialogTemplate();
        } else {
            this.getContainer().removeClass('controls-CompoundArea-headerPadding');
            if (this._className.indexOf(headerPaddingClass) >= 0) {
                this._className = this._className.replace(headerPaddingClass, '');
            }
        }
        this._titleBar = customHeaderContainer;
        if (!this._options.maximize && customHeaderContainer.length && this._options.draggable) {
            // Drag поддержан на шапке DialogTemplate. Т.к. шапка в слое совместимости своя - ловим событие
            // mousedown на ней и проксируем его на dialogTemplate.
            customHeaderContainer.addClass('controls-CompoundArea__move-cursor');
            customHeaderContainer.bind('mousedown', this._headerMouseDown.bind(this));
        }
    },
    setRoundedClassOnDialogTemplate(): void {
        // Добавляем класс который каскадом уберет скругления между шапкой и боди, так как Controls.popupTemplate:Dialog
        // внутри себя ничего не знает о customHeader CompoundArea.
        const container = $('.controls-DialogTemplate', this.getContainer());
        container.addClass('controls-CompoundArea-borderRadius_customHeader');
    },
    // Совместимость может принимать на себя фокус
    canAcceptFocus(): boolean {
        return this.isVisible();
    },

    setSize(sizes) {
        if (sizes.width) {
            this.getContainer().width(sizes.width);
        }
        if (sizes.height) {
            this.getContainer().height(sizes.height);
        }
        this._notifyVDOM('controlResize', null, { bubbling: true });
    },

    setCaption(newTitle) {
        this._setCaption(newTitle);
    },

    setTitle(newTitle) {
        this._setCaption(newTitle);
    },

    _setCaption(newTitle) {
        const titleContainer = $('.ws-float-area-title', this.getContainer());
        if (titleContainer.length) {
            titleContainer.text(newTitle);
        }
    },

    _getCustomHeaderContainer() {
        const customHeader = $('.ws-window-titlebar-custom', this._childControl.getContainer());

        // Ищем кастомную шапку только на первом уровне вложенности шаблона.
        // Внутри могут лежать другие шаблоны, которые могут использоваться отдельно в панелях,
        // На таких шаблонах есть свой ws-titlebar-custom, который не нужно учитывать.
        if (customHeader.length) {
            let nesting = 0;
            let parent;
            for (let i = 0; i < customHeader.length; i++) {
                parent = customHeader[i];

                // Ищем класс с кастомным заголовком, с вложенностью не более 5. 5 вычислено эмпирическим путем
                // Старая панель так умела
                while (parent !== this._childControl.getContainer()[0] && nesting < 5) {
                    parent = parent.parentElement;
                    nesting++;
                }
                if (nesting < 5) {
                    const cH = $(customHeader[i]);
                    cH.addClass('ws-window-titlebar');
                    return cH;
                }
            }
        }

        return [];
    },

    _headerMouseDown(event) {
        const dialogTemplate = this._children.DialogTemplate;

        // Если мы кликнули в контрол в шапке - то работаем с этим контролом.
        // d'n'd работает, когда кликнули непосредственно в шапку
        const isClickedInControl = $(event.target).wsControl() !== this;
        if (dialogTemplate && !isClickedInControl) {
            dialogTemplate._startDragNDrop(new SyntheticEvent(event));
        }
    },

    _prependCustomHeader(customHead) {
        const container = $(
            '.controls-DialogTemplate, .controls-StackTemplate',
            this.getContainer()
        );
        container.prepend(customHead.addClass('controls-CompoundArea-custom-header'));
        this.getContainer().addClass('controls-CompoundArea-headerPadding');
        if (this._options.type === 'dialog') {
            const height = customHead.height();
            $('.controls-DialogTemplate', this.getContainer()).css('padding-top', height);
        }
    },

    _rebuildTitleBar() {
        this._removeCustomHeader();
        this._setCustomHeader();
        return true; // команда rebuildTitleBar не должна всплывать выше окна
    },

    _removeCustomHeader() {
        const customTitles = this.getContainer().find(
            '.ws-window-titlebar-custom.controls-CompoundArea-custom-header'
        );
        customTitles.remove();
    },

    handleCommand(commandName, args) {
        const arg = args[0];

        if (commandName === 'close' || commandName === 'hide') {
            this.close(arg);
            return true; // команда close не должна всплывать выше окна
        }
        if (commandName === 'ok') {
            this.close(true);
            return true; // команда ok не должна всплывать выше окна
        }
        if (commandName === 'cancel') {
            this.close(false);
            return true; // команда cancel не должна всплывать выше окна
        }
        if (this._options._mode === 'recordFloatArea' && commandName === 'save') {
            return this.save(arg);
        }
        if (commandName === 'rebuildTitleBar') {
            return this._rebuildTitleBar(arg);
        }
        if (this._options._mode === 'recordFloatArea' && commandName === 'delete') {
            return this.delRecord(arg);
        }
        if (commandName === 'print') {
            return this.print(arg);
        }
        if (commandName === 'printReport') {
            return this.printReport(arg);
        }
        if (commandName === 'resize' || commandName === 'resizeYourself') {
            this._notifyVDOM('controlResize', null, { bubbling: true });
        } else if (
            commandName === 'registerPendingOperation' ||
            commandName === 'unregisterPendingOperation'
        ) {
            // перехватываем обработку операций только если CompoundControl не умеет обрабатывать их сам
            if (
                !cInstance.instanceOfMixin(
                    this._childControl,
                    'Lib/Mixins/PendingOperationParentMixin'
                )
            ) {
                if (commandName === 'registerPendingOperation') {
                    return this._registerChildPendingOperation(arg);
                }
                if (commandName === 'unregisterPendingOperation') {
                    return this._unregisterChildPendingOperation(arg);
                }
            }
        } else {
            return CompoundArea.superclass.handleCommand.apply(this, arguments);
        }
    },

    _resizeHandler() {
        if (this._childControl) {
            this._childControl._notifyOnSizeChanged();
        }
    },
    closeHandler(e, arg) {
        e.stopPropagation();
        if (this._options._mode === 'recordFloatArea') {
            this._confirmationClose(arg);
        } else {
            this.close(arg);
        }
    },
    _confirmationClose(arg) {
        if (!this._options.readOnly && this.getRecord().isChanged()) {
            // Запрашиваем подтверждение если сделали close()
            this._openConfirmDialog(false, true).addCallback((result) => {
                switch (result) {
                    case 'yesButton': {
                        this.updateRecord().addCallback(() => {
                            this.close(arg);
                        });
                        break;
                    }
                    case 'noButton': {
                        this.getRecord().rollback();
                        this.close(arg);
                        break;
                    }
                }
            });
        } else {
            this.close(arg);
        }
    },
    _mouseenterHandler() {
        if (this._options.hoverTarget) {
            clearTimeout(this._hoverTimer);
            this._hoverTimer = null;
        }
    },
    _mouseleaveHandler(event) {
        // Если ховер ушел в панель связанную с текущей по опенерам - не запускаем таймер на закрытие
        if (this._options.hoverTarget && !this._isLinkedPanel(event)) {
            this._hoverTimer = setTimeout(() => {
                this.hide();
            }, 1000);
        }
    },

    // По таргету с события определяем, связан ли компонент, в котором лежит таргет, с текущей панелью по опенерам
    _isLinkedPanel(event) {
        const target = $(event.nativeEvent.relatedTarget);
        const compoundArea = target.closest('.controls-CompoundArea');
        let opener;

        // don't check overlay
        if (target.hasClass('controls-Container__overlay')) {
            return true;
        }

        if (compoundArea.length) {
            const compoundAreaInst = getClosestControl(compoundArea[0]);
            opener = compoundAreaInst.getOpener();
        }

        const vdomPopupContaner = target.closest('.controls-Popup');
        if (vdomPopupContaner.length) {
            const vdomPopup = getClosestControl(vdomPopupContaner[0]);
            if (vdomPopup) {
                opener = vdomPopup._options.opener;
            }
        }

        const popupMixin = target.closest('.controls-Menu, .controls-FloatArea');
        if (popupMixin.length) {
            opener = popupMixin.wsControl().getOpener();
        }
        return this._checkLink(opener);
    },

    // TODO https://online.sbis.ru/opendoc.html?guid=06867738-a18d-46e4-9904-f6528ba5fcf0
    _checkLink(opener) {
        while (opener && opener._moduleName !== this._moduleName) {
            opener = opener.getParent && opener.getParent();
        }
        return opener === this;
    },
    _keyDown(event: SyntheticEvent<KeyboardEvent>) {
        const nativeEvent = event.nativeEvent;
        const closingByKeys = !nativeEvent.shiftKey && nativeEvent.keyCode === constants.key.esc;
        const targetInEditInPlace = Boolean(event.target.closest('.controls-editInPlace'));

        /*
         * Если нажали на esc в старом редактировании по месту, то закрываться не нужно.
         * Событие сработает на окне раньше (связано с механизмом распостранения событияй в ядре), поэтому редактирование не может прекратить всплытие.
         * Ставим защиту на такой случай.
         */
        if (closingByKeys && !targetInEditInPlace) {
            this.close();
            if (detection.safari) {
                // Need to prevent default behaviour if popup is opened
                // because safari escapes fullscreen mode on 'ESC' pressed
                event.preventDefault();
            }
            event.stopPropagation();
        }
    },
    _keyUp(event) {
        if (!event.nativeEvent.shiftKey && event.nativeEvent.keyCode === constants.key.esc) {
            event.stopPropagation();
        }
    },

    _windowResize() {
        if (this._childControl && this._childControl._onResizeHandler) {
            this._childControl._onResizeHandler();
        }
    },

    _setCompoundAreaOptions(newOptions, popupOptions) {
        if (newOptions.record) {
            // recordFloatArea
            this._record = newOptions.record;
        }
        this._popupOptions = popupOptions;
        this._childControlName = newOptions.template;
        this._childConfig = newOptions.templateOptions || {};
    },

    reload() {
        if (this._popupOptions) {
            // set new sizes for popup
            const popupCfg = this._getManagerConfig();
            if (popupCfg && this._popupOptions.minWidth && this._popupOptions.maxWidth) {
                popupCfg.popupOptions.minWidth = this._popupOptions.minWidth;
                popupCfg.popupOptions.maxWidth = this._popupOptions.maxWidth;
                Controller.update(popupCfg.id, popupCfg.popupOptions);
            }
        }
        this._removeCustomHeader();
        this.rebuildChildControl();
    },
    setTemplate(tmpl, templateOptions) {
        if (templateOptions) {
            this._childConfig = templateOptions;
        }
        this._childControlName = tmpl;
        return this.rebuildChildControl();
    },
    getCurrentTemplateName() {
        return this._childControlName;
    },

    /* from api floatArea, window */
    getOpener() {
        return this.__openerFromCfg || null;
    },

    getTemplateName() {
        return this._template;
    },

    /* start RecordFloatArea */
    getRecord() {
        return (
            this._record ||
            this._options.record ||
            (this._options.templateOptions && this._options.templateOptions.record)
        );
    },
    isNewRecord() {
        return this._options.newRecord;
    },

    setRecord(record, noConfirm) {
        if (!noConfirm) {
            this.openConfirmDialog(true).addCallback((result) => {
                if (result) {
                    this._setRecord(record);
                }
            });
        } else {
            this._setRecord(record);
        }
    },
    _setRecord(record) {
        const oldRecord = this.getRecord();
        const context = this.getLinkedContext();
        const setRecordFunc = () => {
            if (this._options.clearContext) {
                context.setContextData(record);
            } else {
                context.replaceRecord(record);
            }
            if (this.isNewRecord()) {
                this._options.newRecord = record.getKey() === null;
            }
            this._record = record;
            // Отдаем запись, хотя здесь ее можно получить простым getRecord + старая запись
            this._notify('onChangeRecord', record, oldRecord);
        };
        const result = this._notify('onBeforeChangeRecord', record, oldRecord);
        cDeferred.callbackWrapper(result, setRecordFunc.bind(this));
    },
    openConfirmDialog(noHide) {
        const deferred = new cDeferred();
        this._displaysConfirmDialog = true;
        deferred.addCallback((result) => {
            this._notify('onConfirmDialogSelect', result);
            this._displaysConfirmDialog = false;
            return result;
        });
        if ((this.getRecord().isChanged() && !this.isSaved()) || this._recordIsChanged) {
            this._openConfirmDialog(false, true).addCallback((result) => {
                switch (result) {
                    case 'yesButton': {
                        if (this._result === undefined) {
                            this._result = true;
                        }
                        this.updateRecord()
                            .addCallback(() => {
                                this._confirmDialogToCloseActions(deferred, noHide);
                            })
                            .addErrback(() => {
                                deferred.callback(false);
                            });
                        break;
                    }
                    case 'noButton': {
                        if (this._result === undefined) {
                            this._result = false;
                        }

                        /*
                    Если откатить изменения в записи, поля связи, которые с ней связанны, начнут обратно вычитываться,
                    если были изменены, а это уже не нужно. Положили rollback обратно, поля связи уже так себя вести не
                    должны, а rollback реально нужен. Оставляем возможность проводить сохранение записи в прикладном
                    коде. По задаче Алены(см коммент вверху) ошибка не повторяется, т.к. там уже юзают formController
                   */
                        this._confirmDialogToCloseActions(deferred, noHide);
                        break;
                    }
                    default: {
                        deferred.callback(false);
                    }
                }
            });
        } else {
            this._confirmDialogToCloseActions(deferred, noHide);
        }
        return deferred;
    },
    _confirmDialogToCloseActions(deferred, noHide) {
        // EventBus.channel('navigation').unsubscribe('onBeforeNavigate', this._onBeforeNavigate, this);
        deferred.callback(true);
        if (!noHide) {
            this.close.apply(this, arguments);
        }
    },

    setReadOnly(isReadOnly) {
        if (!this.isDestroyed()) {
            this._isReadOnly = isReadOnly;
            if (this._childControl) {
                this._setEnabledForChildControls(!isReadOnly);
            } else {
                this._childCreatedDfr.addCallback(
                    function () {
                        this._setEnabledForChildControls(!isReadOnly);
                    }.bind(this)
                );
            }
        }
    },
    isReadOnly() {
        return this._isReadOnly;
    },

    setSaveDiffOnly() {
        DialogRecord.prototype.setSaveDiffOnly.apply(this, arguments);
    },
    ok() {
        if (this._options.popupComponent === 'recordFloatArea') {
            DialogRecord.prototype.ok.apply(this, arguments);
        } else {
            this.close(true);
        }
    },
    _setEnabledForChildControls() {
        DialogRecord.prototype._setEnabledForChildControls.apply(this, arguments);
    },
    _showLoadingIndicator() {
        DialogRecord.prototype._showLoadingIndicator.apply(this, arguments);
    },
    _hideLoadingIndicator() {
        DialogRecord.prototype._hideLoadingIndicator.apply(this, arguments);
    },
    isAllReady() {
        return DialogRecord.prototype.isAllReady.apply(this, arguments);
    },
    getReports() {
        return DialogRecord.prototype.getReports.apply(this, arguments);
    },
    _printMenuItemsIsChanged() {
        return DialogRecord.prototype._printMenuItemsIsChanged.apply(this, arguments);
    },
    _createPrintMenu() {
        return DialogRecord.prototype._createPrintMenu.apply(this, arguments);
    },
    showReportList() {
        return DialogRecord.prototype.showReportList.apply(this, arguments);
    },
    printReport() {
        return DialogRecord.prototype.printReport.apply(this, arguments);
    },
    _showReport() {
        return DialogRecord.prototype._showReport.apply(this, arguments);
    },
    print() {
        return DialogRecord.prototype.print.apply(this, arguments);
    },
    _hideWindow() {
        /* For override  */
    },
    _getTitle() {
        return document.title;
    },

    _openConfirmDialog() {
        return DialogRecord.prototype._openConfirmDialog.apply(this, arguments);
    },
    isSaved() {
        return DialogRecord.prototype.isSaved.apply(this, []);
    },
    _unbindBeforeUnload() {
        DialogRecord.prototype._unbindBeforeUnload.apply(this);
    },
    _beforeUnloadHandler() {
        return DialogRecord.prototype._beforeUnloadHandler.apply(this);
    },
    subscribeOnBeforeUnload() {
        DialogRecord.prototype.subscribeOnBeforeUnload.apply(this);
    },
    unsubscribeOnBeforeUnload() {
        DialogRecord.prototype.unsubscribeOnBeforeUnload.apply(this);
    },
    updateRecord() {
        return DialogRecord.prototype.updateRecord.apply(this, arguments);
    },
    save() {
        return DialogRecord.prototype.save.apply(this, arguments);
    },
    delRecord() {
        return DialogRecord.prototype.delRecord.apply(this, arguments);
    },
    _processError(error) {
        DialogRecord.prototype._processError.apply(this, [error]);
    },

    /* end RecordFloatArea */

    isVisible() {
        if (this._options.autoShow === false) {
            const popupContainer = this._container.parentElement;
            const isHidden =
                popupContainer?.classList.contains(popupHiddenClasses[0]) ||
                popupContainer?.classList.contains(popupHiddenClasses[1]);
            return !isHidden && this._isVisible;
        }
        return true;
    },

    show() {
        this._toggleVisible(true);
    },

    hide() {
        this.close();
    },
    _createBeforeCloseHandlerPending(): void {
        this._beforeClosePendingDeferred = new cDeferred();
        this._notifyVDOM(
            'registerPending',
            [
                this._beforeClosePendingDeferred,
                {
                    showLoadingIndicator: false,
                    validateCompatible: (): boolean => {
                        if (
                            cInstance.instanceOfModule(
                                this._childControl,
                                'SBIS3.CONTROLS/FormController'
                            )
                        ) {
                            // _beforeCloseHandlerResult = true выставляется, если не отменили закрытие на onBeforeClose,
                            // соответственно второй раз закрытие звать не нужно
                            if (this._beforeCloseHandlerResult !== true) {
                                this.close();
                            }
                            return !this._beforeCloseHandlerResult;
                        }
                        return false;
                    },
                },
            ],
            { bubbling: true }
        );
    },
    close(arg) {
        if (!this.isDestroyed()) {
            // Если из обработчика на onBeforeClose вызвали повторное закрытие с новыми аргументами,
            // То защита не даст повторно запустить закрытие окна, но актуальные аргументы обработать нужно.
            this._closeArgs = arg;
            if (this._logicParent.waitForPopupCreated) {
                this._waitClose = true;
                return;
            }

            if (this._options.autoCloseOnHide === false) {
                if (this._isVisible !== false) {
                    this._toggleVisible(false);
                    this._notifyCompound('onClose', arg);
                    this._notifyCompound('onAfterClose', arg);
                }
            } else if (this._childControl && !this._childControl.isDestroyed()) {
                // Закрытие панели могут вызвать несколько раз подряд
                if (this._isClosing) {
                    return false;
                }
                this._isClosing = true;
                if (this._notifyCompound('onBeforeClose', this._closeArgs) !== false) {
                    this._beforeCloseHandlerResult = true;
                    /*
                     * Если первое закрытие было прервано на onBeforeClose - может зависнуть pending на закрытие
                     * При повторном вызове close необходимо почистить removePending вручную
                     * */
                    if (this._getManagerConfig()) {
                        this._getManagerConfig().removePending = null;
                    }
                    this._notifyVDOM('close', null, { bubbling: true });
                    this._callCloseCallback(this._closeArgs);
                    this._notifyCompound('onClose', this._closeArgs);
                    this._notifyCompound('onAfterClose', this._closeArgs);
                } else {
                    this._beforeCloseHandlerResult = false;
                }
                this._isClosing = false;
            }
            return true;
        }
    },

    _toggleVisibleClass(className, visible) {
        className = className || '';
        if (visible) {
            className = className.replace(hiddenRe, '');
        } else if (className.indexOf('ws-hidden') === -1) {
            className += ' ws-hidden';
        }
        return className;
    },
    _toggleVisible(visible) {
        let prevVisible = this._isVisible;
        const popupContainer = this.getContainer().closest('.controls-Popup')[0];
        const id = this._getPopupId();
        const popupConfig = this._getManagerConfig();

        if (popupConfig) {
            // Удалим или поставим ws-hidden в зависимости от переданного аргумента
            popupConfig.popupOptions.className = this._toggleVisibleClass(
                popupConfig.popupOptions.className,
                visible
            );

            // Сразу обновим список классов на контейнере, чтобы при пересинхронизации он не "прыгал"
            popupContainer.className = this._toggleVisibleClass(popupContainer.className, visible);

            // Если попап модальный, нужно чтобы Manager показал/скрыл/переместил оверлей
            // Из popupConfig.popupOptions.modal узнаем, является ли попап модальным
            if (popupConfig.popupOptions.modal) {
                // Текущее состояние модальности задается в popupConfig
                popupConfig.modal = visible;

                // Изменили конфигурацию попапа, нужно, чтобы менеджер увидел эти изменения
                Controller.getManager()._popupItems._nextVersion();
                Controller.update(id, popupConfig.popupOptions);
            }

            const changeVisible = () => {
                this._isVisible = visible;

                if (visible !== prevVisible) {
                    // Совместимость с FloatArea. После реального изменении видимости, нужно сообщать об этом,
                    // стреляя событием onAfterVisibilityChange
                    this._notifyCompound('onAfterVisibilityChange', visible, prevVisible);
                    // обновляю в замыкании, чтобы повторные вызова не приводили к
                    // прохождению проверки visible !== prevVisible
                    prevVisible = visible;
                }
            };

            if (visible && !prevVisible) {
                // После изменения видимости, изменятся размеры CompoundArea, из-за чего будет пересчитана позиция
                // окна на экране. Чтобы не было видно "прыжка" со старой позиции (вычисленной при старых размерах)
                // на новую, поставим на время пересчета класс `ws-invisible`
                popupConfig.popupOptions.className += ' ws-invisible';
                popupContainer.className += ' ws-invisible';

                // Также проставим флаг, обозначающий что попап скрыт на время пересчета позиции
                popupConfig.isHiddenForRecalc = true;

                const popupAfterUpdated = (item, container) => {
                    changeVisible();
                    if (item.isHiddenForRecalc) {
                        // Если попап был скрыт `ws-invisible` на время пересчета позиции, нужно его отобразить
                        item.isHiddenForRecalc = false;

                        // Перед тем как снять ws-insivible - пересчитаем размеры попапа, т.к. верстка могла измениться
                        this._notifyVDOM('controlResize', [], {
                            bubbling: true,
                        });

                        runDelayed(() => {
                            item.popupOptions.className = item.popupOptions.className.replace(
                                invisibleRe,
                                ''
                            );
                            container.className = container.className.replace(invisibleRe, '');
                            if (this._options.catchFocus) {
                                // автофокусировка теперь здесь, после того как все выехало, оживилось и отобразилось
                                // если звать автофокусировку в момент когда контейнер visibility: hidden, не сфокусируется!
                                doAutofocus(this.getContainer());
                            }
                        });
                    }
                };

                // Нужно убрать класс `ws-invisible` после того как будет пересчитана позиция. Чтобы понять, когда
                // это произошло, нужно пропатчить elementAfterUpdated в контроллере попапа, чтобы он поддерживал
                // CompoundArea
                if (!popupConfig.controller._modifiedByCompoundArea) {
                    popupConfig.controller._modifiedByCompoundArea = true;
                    this._popupController = popupConfig.controller;
                    this._baseAfterUpdate = popupConfig.controller._elementAfterUpdated;
                    popupConfig.controller._elementAfterUpdated = callNext(
                        popupConfig.controller._elementAfterUpdated,
                        popupAfterUpdated
                    );
                }

                // если не попадаем в elementAfterUpdated потому что он случился раньше, то попадаем хотя бы по таймауту
                setTimeout(popupAfterUpdated.bind(this, popupConfig, popupContainer), 2000);
            } else {
                changeVisible();
            }
        }
    },
    setOffset(newOffset) {
        const popupConfig = this._getManagerConfig();
        if (popupConfig) {
            popupConfig.popupOptions.offset = popupConfig.popupOptions.offset || {};

            popupConfig.popupOptions.offset.horizontal = newOffset.x || 0;
            popupConfig.popupOptions.offset.vertical = newOffset.y || 0;

            Controller.update(this._getPopupId(), popupConfig.popupOptions);
        }
    },
    _getManagerConfig() {
        const id = this._getPopupId();
        return id ? Controller.find(id) : undefined;
    },
    _getPopupId() {
        const popupContainer = this.getContainer().closest('.controls-Popup')[0];
        let control;
        if (popupContainer) {
            control = getClosestControl(popupContainer);
        }
        return control?._options.id;
    },
    _getTemplateComponent() {
        return this._childControl;
    },
    destroy() {
        if (this.isDestroyed()) {
            return;
        }

        // Пока попап не создан, ему на событие onInit могли позвать destroy напрямую.
        // Хоть у попапов и нельзя destroy звать напрямую, ставлю защиту
        if (!this._isPopupCreated) {
            this._notifyManagerPopupDestroyed();
        }

        this._trackTarget(false);

        // Unregister CompoundArea's inner Event/Listener, before its
        // container is destroyed by compatibility layer
        this._unregisterEventListener();
        if (constants.isBrowserPlatform) {
            window.removeEventListener('resize', this._windowResize);
        }

        if (this._popupController && this._baseAfterUpdate) {
            this._popupController._elementAfterUpdated = this._baseAfterUpdate;
            this._popupController._modifiedByCompoundArea = false;
        }

        const ops = this._producedPendingOperations;
        while (ops.length > 0) {
            this._unregisterPendingOperation(ops[0]);
        }
        const operation = this._allChildrenPendingOperation;
        let message;

        if (this._isFinishingChildOperations) {
            message =
                'У контрола ' +
                this._moduleName +
                ' (name = ' +
                this.getName() +
                ', id = ' +
                this.getId() +
                ') вызывается метод destroy, ' +
                'хотя у него ещё есть незавёршённые операции (свои или от дочерних контролов';
            Logger.error('Lib/Mixins/PendingOperationParentMixin: ' + message, this);
        }

        // cleanup им вызывать не надо - всё равно там destroy будет работать, у дочернего контрола
        this._childPendingOperations = [];
        if (this._allChildrenPendingOperation) {
            this._allChildrenPendingOperation = null;
            this._unregisterPendingOperation(operation);
        }

        // В _afterMount CompoundArea регистрируется у родителя, нужно
        // эту связь разорвать
        if (this.getParent()) {
            this._clearInformationOnParentFromCfg();
        }

        CompoundArea.superclass.destroy.apply(this, arguments);
    },

    _clearInformationOnParentFromCfg() {
        const parent = this.getParent();
        const id = this._id;
        const name = this._options.name;
        const tabindex = this._options.tabindex;

        if (parent._childsMapId) {
            const mapId = parent._childsMapId[id];
            if (typeof mapId !== 'undefined') {
                if (parent._childControls) {
                    delete parent._childControls[mapId];
                }
                if (parent._childContainers) {
                    delete parent._childContainers[mapId];
                }
                delete parent._childsMapId[id];
            }
        }

        if (parent._childsMapName) {
            delete parent._childsMapName[name || id];
        }

        if (parent._childsTabindex) {
            delete parent._childsTabindex[tabindex];
        }
    },

    _unregisterEventListener() {
        const listener = this.listener;
        this.listener = null;
        // Tell event listener to unregister from its Registrar to
        // prevent leaks
        listener._notify('unregister', ['controlResize', listener], {
            bubbling: true,
        });
    },

    _removeOpFromCollections(operation) {
        removeOperation(operation, this._producedPendingOperations);
        removeOperation(operation, allProducedPendingOperations);
    },

    _registerPendingOperation(operationName, finishFunc, registerTarget) {
        const name = this._moduleName ? this._moduleName + '/' + operationName : operationName;
        const operation = {
            name,
            finishFunc,
            cleanup: null,
            control: this,
            registerTarget,
        };

        operation.cleanup = this._removeOpFromCollections.bind(this, operation);
        if (operation.registerTarget) {
            operation.registerTarget.sendCommand('registerPendingOperation', operation);

            this._producedPendingOperations.push(operation);
            allProducedPendingOperations.push(operation);
        }
        return operation;
    },

    _unregisterPendingOperation(operation) {
        operation.cleanup();

        if (operation.registerTarget) {
            operation.registerTarget.sendCommand('unregisterPendingOperation', operation);
        }
    },

    getAllPendingOperations() {
        return allProducedPendingOperations;
    },

    getPendingOperations() {
        return this._producedPendingOperations;
    },

    _registerChildPendingOperation(operation) {
        let name;
        let finishFunc;

        this._childPendingOperations.push(operation);

        if (!this._allChildrenPendingOperation) {
            name = (this._moduleName ? this._moduleName + '/' : '') + 'allChildrenPendingOperation';
            finishFunc = this.finishChildPendingOperations.bind(this);

            this._allChildrenPendingOperation = this._registerPendingOperation(
                name,
                finishFunc,
                this.getParent()
            );
        }

        return true;
    },

    _unregisterChildPendingOperation(operation) {
        const childOps = this._childPendingOperations;
        let allChildrenPendingOperation;

        if (childOps.length > 0) {
            removeOperation(operation, childOps);
            if (childOps.length === 0) {
                allChildrenPendingOperation = this._allChildrenPendingOperation;
                this._allChildrenPendingOperation = null;
                coreDebug.checkAssertion(!!allChildrenPendingOperation);

                this._unregisterPendingOperation(allChildrenPendingOperation);
            }
        }
        return true;
    },
    finishChildPendingOperations(needSavePendings) {
        const checkFn = (prevResult) => {
            const childOps = this._childPendingOperations;
            let result;
            let allChildrenPendingOperation;

            function cleanupFirst() {
                if (childOps.length > 0) {
                    childOps.shift().cleanup();
                }
            }

            if (finishResultOk(prevResult) && childOps.length > 0) {
                result = childOps[0].finishFunc(needSavePendings);
                if (result instanceof cDeferred) {
                    result
                        .addCallback((res) => {
                            if (finishResultOk(res)) {
                                cleanupFirst();
                            }
                            return checkFn(res);
                        })
                        .addErrback((res) => {
                            return checkFn(res);
                        });
                } else {
                    if (finishResultOk(result)) {
                        cleanupFirst();
                    }
                    result = checkFn(result);
                }
            } else {
                allChildrenPendingOperation = this._allChildrenPendingOperation;
                if (childOps.length === 0 && allChildrenPendingOperation) {
                    this._allChildrenPendingOperation = null;
                    this._unregisterPendingOperation(allChildrenPendingOperation);
                }
                this._isFinishingChildOperations = false;
                result = prevResult;
            }
            return result;
        };

        if (!this._isFinishingChildOperations) {
            this._finishPendingQueue = cDeferred.success(true);
            this._isFinishingChildOperations = true;

            this._finishPendingQueue.addCallback(checkFn);
        }

        return this._finishPendingQueue;
    },

    getChildPendingOperations() {
        return this._childPendingOperations;
    },

    /**
     *
     * Добавить отложенную асинхронную операцию в очередь ожидания окна.
     * @param {Types/deferred:Deferred} dOperation Отложенная операция.
     * @returns {Boolean} "true", если добавление операции в очередь успешно.
     * @see waitAllPendingOperations
     */
    addPendingOperation(dOperation) {
        const result = !!(dOperation && dOperation instanceof cDeferred);
        if (result) {
            this._pending.push(dOperation);
            this._pendingTrace.push(coreDebug.getStackTrace());
            dOperation.addBoth(this._checkPendingOperations.bind(this));
        }
        return result;
    },
    _finishAllPendingsWithSave() {
        this._pending.forEach((pending) => {
            pending.callback(true);
        });
    },

    moveToTop() {
        /* For override  */
    },

    /**
     * Получение информации о добавленных пендингах, включая информацию, откуда был добавлен пендинг
     * @returns {Array} Массив объектов, хранящих пендинг и информацию, откуда был добавлен пендинг
     */
    getAllPendingInfo() {
        const res = [];
        this._pending.forEach((pending, index) => {
            res.push({
                pending,
                trace: this._pendingTrace[index],
            });
        });
        return res;
    },

    /*
     *
     * Добавить асинхронное событие на завершение всех отложенных операций.
     * Добавить асинхронное событие, которое сработает в момент завершения всех отложенных операций,
     * добавленных с помощью {@link addPendingOperation}.
     * Если очередь пуста, то сработает сразу.
     * Если попытаться передать Deferred, находящийся в каком-либо состоянии (успех, ошибка), то метод вернет false и
     * ожидающий не будет добавлен в очередь.
     * @param {Types/deferred:Deferred} dNotify Deferred-объект, ожидающий завершения всех отложенных операций.
     * @returns {Boolean} "true", если добавление в очередь ожидающих успешно.
     * @see addPendingOperation
     */
    waitAllPendingOperations(dNotify) {
        if (dNotify && dNotify instanceof cDeferred && !dNotify.isReady()) {
            if (this._pending.length === 0) {
                dNotify.callback();
            } else {
                this._waiting.push(dNotify);
            }
            return true;
        }
        return false;
    },
    _checkPendingOperations(res) {
        const totalOps = this._pending.length;
        let result;

        // Сперва отберем Deferred, которые завершились
        result = this._pending.filter((dfr) => {
            return dfr.isReady();
        });

        // Затем получим их результаты
        result = result.map((dfr) => {
            return dfr.getResult();
        });

        // If every waiting op is completed
        if (result.length === totalOps) {
            this._pending = [];
            this._pendingTrace = [];
            while (this._waiting.length > 0) {
                this._waiting.pop().callback(result);
            }
        }

        // if res instanceof Error, return it as non-captured
        return res;
    },

    // SBIS3.CONTROLS/Mixins/SelectorMixin
    _toggleLinkedViewEvents(sub) {
        this[sub ? 'subscribeTo' : 'unsubscribeFrom'](
            this._linkedView,
            'onItemActivate',
            this._changeSelectionHandler
        );
    },
    setLinkedView(linkedView) {
        let multiSelectChanged;
        const multiselect = this._options.multiSelect || false; // Если опция не задана по умолчанию false
        /* Отпишемся у старой view от событий */
        if (this._linkedView && this._linkedView !== linkedView) {
            this._toggleLinkedViewEvents(false);
        }
        this._linkedView = linkedView;

        if (linkedView) {
            multiSelectChanged = this._linkedView.getMultiselect() !== multiselect;
            this._toggleLinkedViewEvents(true);

            if (multiSelectChanged) {
                this._linkedView.setMultiselect(multiselect);
            }

            const currentSelectedKeys = this._options.currentSelectedKeys || [];

            if (currentSelectedKeys.length) {
                if (multiselect) {
                    this._linkedView.setSelectedKeys(currentSelectedKeys);
                } else {
                    this._linkedView.setSelectedKey(currentSelectedKeys[0]);
                }
            }
        }
    },
    getLinkedView() {
        return this._linkedView;
    },
    _changeSelectionHandler(event, result) {
        const linkedView = this.getLinkedView();
        const item = result.item;
        if (linkedView.getSelectedKeys().length) {
            return;
        }
        if (
            cInstance.instanceOfMixin(linkedView, 'SBIS3.CONTROLS/Mixins/TreeMixin') &&
            item.get(linkedView.getNodeProperty())
        ) {
            return;
        }
        this.close([result.item]);
    },
    _registerLinkedView() {
        if (!this._options.closeCallback) {
            return;
        }
        this._changeSelectionHandler = this._changeSelectionHandler.bind(this);
        const childControls = this.getChildControls();

        for (let i = 0, l = childControls.length; i < l; i++) {
            const childControl = childControls[i];

            if (cInstance.instanceOfModule(childControl, 'SBIS3.CONTROLS/ListView')) {
                this.setLinkedView(childControl);
                break;
            }
        }
    },
    _callCloseCallback(value) {
        if (this._options && typeof this._options.closeCallback === 'function') {
            this._options.closeCallback(value);
        }
    },
});
export default CompoundArea;

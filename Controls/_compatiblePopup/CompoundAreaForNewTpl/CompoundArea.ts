/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import CompoundControl = require('Lib/Control/CompoundControl/CompoundControl');
import template = require('wml!Controls/_compatiblePopup/CompoundAreaForNewTpl/CompoundArea');
import ManagerWrapperController from 'Controls/Popup/Compatible/ManagerWrapper/Controller';
import WindowManager = require('Core/WindowManager');
import ComponentWrapper from './ComponentWrapper';
import { Control as control } from 'UI/Base';
import clone = require('Core/core-clone');
import makeInstanceCompatible = require('Core/helpers/Hcontrol/makeInstanceCompatible');
import { Synchronizer } from 'UI/Vdom';
import { Deferred } from 'Types/deferred';
import { constants } from 'Env/Env';
import { StackStrategy } from 'Controls/popupTemplateStrategy';
import { Controller as ManagerController, BaseOpener } from 'Controls/popup';
import { load } from 'Core/library';
import { Logger } from 'UI/Utils';
import 'css!Controls/compatiblePopup';
/*
  Слой совместимости для открытия новых шаблонов в старых попапах
 */
// Наследование от CompoundControl
const moduleClass = CompoundControl.extend({
    _dotTplFn: template,
    $protected: {
        _isVDomTemplateMounted: false,
        _options: {
            isDefaultOpener: true, // Останавливаем поиск опенера(Vdom.DefaultOpenerFinder) на compoundArea
        },
        _closeTimerId: null,
    },
    init(): void {
        moduleClass.superclass.init.apply(this, arguments);
        this._listeners = [];
        this._onCloseHandler = this._onCloseHandler.bind(this);
        this._keydownHandler = this._keydownHandler.bind(this);
        this._onResultHandler = this._onResultHandler.bind(this);
        this._onResizeHandler = this._onResizeHandler.bind(this);
        this._beforeCloseHandler = this._beforeCloseHandler.bind(this);
        this._onRegisterHandler = this._onRegisterHandler.bind(this);
        this._onMaximizedHandler = this._onMaximizedHandler.bind(this);
        this._onResizingLineHandler = this._onResizingLineHandler.bind(this);
        this._onCloseHandler.control = this._onResultHandler.control = this;

        this.getContainer().bind('keydown', this._keydownHandler);

        this._panel = this.getParent();
        this._panel.subscribe('onBeforeClose', this._beforeCloseHandler);
        this._panel.subscribe('onAfterClose', this._callCloseHandler.bind(this));
        this._maximized = !!this._options.templateOptions.maximized;

        // Если внутри нас сработал вдомный фокус (активация), нужно активироваться
        // самим с помощью setActive. Тогда и CompoundControl'ы-родители узнают
        // об активации.
        // Так как вдом зовет событие activated на каждом активированном контроле,
        // можно просто слушать это событие на себе и активироваться если оно
        // сработает.
        this._activatedHandler = this._activatedHandler.bind(this);
        this.subscribe('activated', this._activatedHandler);

        // То же самое с деактивацией, ее тоже нужно делать через setActive,
        // чтобы старый контрол-родитель мог об этом узнать.
        this._deactivatedHandler = this._deactivatedHandler.bind(this);
        this.subscribe('deactivated', this._deactivatedHandler);

        // фокус уходит, нужно попробовать закрыть ненужные панели
        this.subscribe('onFocusOut', this._onFocusOutHandler.bind(this));

        // Здесь заранее можно построить ManagerWrapper,
        // т.к. либа popupTemplate уже точно загружена и новые зависимости не прилетят
        BaseOpener.getManager();

        const panel = this._panel;
        const isStack =
            panel &&
            panel._moduleName === 'Lib/Control/FloatArea/FloatArea' &&
            panel._options.isStack === true;
        if (isStack && ManagerController.hasRightPanel()) {
            this.getContainer()
                .closest('.controls-compoundAreaNew__floatArea')
                .addClass(
                    'controls-compoundAreaNew__floatArea_with-right-panel controls_popupTemplate_theme-default'
                );
        }

        this._runInBatchUpdate('CompoundArea - init - ' + this._id, function () {
            const def = new Deferred();

            if (this._options.innerComponentOptions) {
                if (this._options.innerComponentOptions._template) {
                    this._options.template = this._options.innerComponentOptions._template;
                }
                this._saveTemplateOptions(this._options.innerComponentOptions);
                Logger.error(
                    'Шаблон CompoundArea задается через опцию template. Конфигурация шаблона через опцию templateOptions',
                    this
                );
            }

            this._modifyInnerOptionsByHandlers();

            const deps = [this._loadTemplate(this._options.template), import('Vdom/Vdom')];

            // Совместимость используется только на онлайне.
            // Могу напрямую зарекваерить контроллер Лобастова для получения конфига
            const isBilling = document.body.classList.contains('billing-page');
            // Совместимость есть на онлайне и в биллинге. В биллинге нет ViewSettings и движения границ
            if (isBilling) {
                this._options._popupOptions.propStorageId = null;
            }
            if (this._options._popupOptions.propStorageId) {
                // eslint-disable-next-line
                deps.push(import('ViewSettings/controller'));
            }

            Promise.all(deps).then((result) => {
                this._settingsController = result[2] && result[2].Settings;
                if (this._settingsController && this._settingsController.getSettings) {
                    this._getSettingsWidth().then((width) => {
                        if (width) {
                            this._updateFloatAreaWidth(width);
                        }
                        this._createTemplate(def);
                    });
                } else {
                    this._createTemplate(def);
                }
            });

            return def;
        });
    },

    _createTemplate(def): void {
        // Пока грузили шаблон, компонент могли задестроить
        if (this.isDestroyed()) {
            return;
        }
        const wrapper = $('.vDomWrapper', this.getContainer());
        if (wrapper.length) {
            const wrapperOptions = {
                template: this._options.template,
                templateOptions: this._options.templateOptions,

                // Нужно передать себя в качестве родителя, чтобы система фокусов
                // могла понять, где находятся вложенные компоненты
                parent: this,
                popupOptions: this._getNewPopupOptions(),
            };
            // todo откатил потому что упала ошибка
            //  https://online.sbis.ru/opendoc.html?guid=d8cc1098-3d3a-4fed-800c-81b4e6ed2319
            if (this._options.isWS3Compatible) {
                wrapperOptions.iWantBeWS3 = true;
            }
            this._vDomTemplate = control.createControl(ComponentWrapper, wrapperOptions, wrapper);
            if (this._options.isWS3Compatible) {
                makeInstanceCompatible(this._vDomTemplate);
            }
            this._afterMountHandler();
            this._afterUpdateHandler();
        } else {
            this._isVDomTemplateMounted = true;
            this.sendCommand('close');
        }

        def.callback();
    },

    _getSettingsWidth(): Promise<null | number> {
        return new Promise((resolve) => {
            const propStorageId = this._options._popupOptions.propStorageId;
            if (propStorageId) {
                this._settingsController.getSettings([propStorageId]).then((storage) => {
                    if (storage && storage[propStorageId]) {
                        this._options._popupOptions.width = storage[propStorageId];
                    }
                    resolve(storage[propStorageId]);
                });
            } else {
                resolve();
            }
        });
    },

    _setSettingsWidth(width: number): void {
        const propStorageId = this._options._popupOptions.propStorageId;
        if (
            propStorageId &&
            width &&
            this._settingsController &&
            this._settingsController.setSettings
        ) {
            this._settingsController.setSettings({ [propStorageId]: width });
        }
    },

    _loadTemplate(tpl: string | Function): Promise<Function> {
        if (typeof tpl === 'string') {
            return load(tpl);
        }
        return Promise.resolve(tpl);
    },

    _keydownHandler(e) {
        if (!e.shiftKey && e.which === constants.key.esc) {
            e.stopPropagation();
            this._onCloseHandler();
        }
    },

    _createEventProperty(handler) {
        return {
            fn: this._createFnForEvents(handler),
            args: [],
        };
    },

    // Создаем обработчик события, который положим в eventProperties узла
    _createFnForEvents(callback) {
        const fn = callback;

        // Нужно для событийного канала vdom'a.
        // У fn.control позовется forceUpdate. На compoundArea его нет, поэтому ставим заглушку
        fn.control = {
            _forceUpdate: this._forceUpdate,
        };
        return fn;
    },

    _beforeCloseHandler(event) {
        // Если позвали закрытие панели до того, как построился VDOM компонент - дожидаемся когда он построится
        // Только после этого закрываем панель
        if (!this._isVDomTemplateMounted) {
            this._closeAfterMount = true;
            event.setResult(false);
        } else {
            this.popupBeforeDestroyed();
            if (this._vDomTemplate.hasRegisteredPendings()) {
                event.setResult(false);
                // FloatArea после отмены закрытия на beforeClose не сбрасывает state === hide,
                // из-за чего закрытие после завершения пендингов не отрабатывает, т.к. панель считает что уже закрывается.
                // Сбрасываю состояние только в совместимости, старый контрол не трогаю.
                this.getParent()._state = '';
                this._finishPendingOperations();
            }
        }
    },

    popupBeforeDestroyed() {
        // Эмулируем событие вдомного попапа managerPopupBeforeDestroyed для floatArea
        const ManagerWrapper = ManagerWrapperController.getManagerWrapper();
        if (ManagerWrapper) {
            const container = this._container[0] ? this._container[0] : this._container;
            ManagerWrapper._beforePopupDestroyedHandler(null, {}, [], container);
        }
    },

    _finishPopupOpenedDeferred() {
        // Сообщим окну о том, что шаблон построен
        if (this.getParent()._finishPopupOpenedDeferred) {
            this.getParent()._finishPopupOpenedDeferred();
        }
    },

    // Обсудили с Д.Зуевым, другого способа узнать что vdom компонент добавился в dom нет.
    _afterMountHandler() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        self._baseAfterMount = self._vDomTemplate._afterMount;
        self._vDomTemplate._afterMount = function () {
            if (self._options.onOpenHandlerEvent) {
                self._options.onOpenHandlerEvent('onOpen');
            }
            if (self._options.onOpenHandler) {
                self._options.onOpenHandler('onOpen');
            }
            self._baseAfterMount.apply(this, arguments);
            if (self._options._initCompoundArea) {
                self._notifyOnSizeChanged(self, self);
                self._options._initCompoundArea(self);
                self._options._initCompoundArea = null;
            }
            self._finishPopupOpenedDeferred();
            self._isVDomTemplateMounted = true;
            if (self._closeAfterMount) {
                self.sendCommand('close');
                self.popupBeforeDestroyed();
            } else if (self._options.catchFocus) {
                if (self._vDomTemplate.activate) {
                    self._vDomTemplate.activate();
                }
            }
        };
    },

    // Обсудили с Д.Зуевым, другого способа узнать что vdom компонент обновился - нет.
    _afterUpdateHandler() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        self._baseAfterUpdate = self._vDomTemplate._afterUpdate;
        self._vDomTemplate._afterUpdate = function () {
            self._baseAfterUpdate.apply(this, arguments);
            if (self._isNewOptions) {
                // костыль от дубровина не позволяет перерисовать окно, если prevHeight > текущей высоты.
                // Логику в панели не меняю, решаю на стороне совместимости
                self._panel._prevHeight = 0;
                if (self._panel._recalcPosition) {
                    self._panel._recalcPosition();
                }
                self._panel.getContainer().closest('.ws-float-area').removeClass('ws-invisible');
                self._isNewOptions = false;
            }
        };
    },
    _modifyInnerOptionsByHandlers() {
        const innerOptions = this._options.templateOptions;
        innerOptions._onCloseHandler = this._onCloseHandler;
        innerOptions._onResultHandler = this._onResultHandler;
        innerOptions._onResizeHandler = this._onResizeHandler;
        innerOptions._onRegisterHandler = this._onRegisterHandler;
        innerOptions._onMaximizedHandler = this._onMaximizedHandler;
        innerOptions._onResizingLineHandler = this._onResizingLineHandler;
    },
    _onResizeHandler() {
        this._notifyOnSizeChanged();
        ManagerWrapperController.startResizeEmitter();
    },
    _onCloseHandler(): void {
        // We need to delay reaction to close event, because it shouldn't
        // synchronously destroy all child controls of CompoundArea

        // protect against multi call
        if (this._closeTimerId) {
            return;
        }
        this._closeTimerId = setTimeout(() => {
            this._closeTimerId = null;
            this._finishPendingOperations();
        }, 0);
    },
    _finishPendingOperations(): void {
        this._vDomTemplate.finishPendingOperations().addCallback(() => {
            this.sendCommand('close', this._result);
            this._result = null;
        });
    },
    _callCloseHandler() {
        if (this._options.onCloseHandler) {
            this._options.onCloseHandler(this._result);
        }
        if (this._options.onCloseHandlerEvent) {
            this._options.onCloseHandlerEvent('onClose', [this._result]);
        }
    },
    _onFocusOutHandler(event, destroyed, focusedControl) {
        // если фокус уходит со старой панели на новый контрол,
        // старых механизм не будет вызван, нужно вручную звать onaActivateWindow
        if (focusedControl) {
            if (focusedControl._template) {
                if (!focusedControl._doneCompat) {
                    makeInstanceCompatible(focusedControl);
                }
                WindowManager.onActivateWindow(focusedControl);
            } else {
                // должно само работать!
            }
        }
    },
    _onResultHandler() {
        this._result = Array.prototype.slice.call(arguments, 1); // first arg - event;
        if (this._options.onResultHandler) {
            this._options.onResultHandler.apply(this, this._result);
        }
        if (this._options.onResultHandlerEvent) {
            this._options.onResultHandlerEvent('onResult', this._result);
        }
    },
    _onRegisterHandler(event, eventName, emitter, handler) {
        // Пробрасываю событие о регистрации listener'ов до регистраторов, которые лежат в managerWrapper и физически
        // не могут отловить событие
        if (event.type === 'register') {
            this._listeners.push({
                event,
                eventName,
                emitter,
            });
            ManagerWrapperController.registerListener(event, eventName, emitter, handler);
        } else {
            if (emitter && emitter.getInstanceId()) {
                const index = this._getListenerIndex(emitter);
                if (typeof index === 'number') {
                    this._listeners.splice(index, 1);
                }
            }
            ManagerWrapperController.unregisterListener(event, eventName, emitter);
        }
    },
    _getListenerIndex(emitter) {
        const length = this._listeners.length;
        for (let index = 0; index < length; index++) {
            const listener = this._listeners[index];
            const unregisterEmitter = listener.emitter;
            if (unregisterEmitter && unregisterEmitter.getInstanceId()) {
                if (unregisterEmitter.getInstanceId() === emitter.getInstanceId()) {
                    return index;
                }
            }
        }
        return undefined;
    },

    onBringToFront() {
        if (this._vDomTemplate) {
            this._vDomTemplate.activate();
        }
    },

    _getFloatAreaStackRootCoords() {
        const stackRootContainer = document.querySelector('.ws-float-area-stack-root');
        let right = 0;
        const top = 0;
        if (stackRootContainer) {
            right = document.body.clientWidth - stackRootContainer.getBoundingClientRect().right;
        }
        return { top, right };
    },

    _onResizingLineHandler(offset: number): void {
        if (!this._panel._updateAreaWidth) {
            return;
        }
        const strategyData = this._getStrategyData(offset);
        this._setSettingsWidth(strategyData.width);
        this._options._popupOptions.width = strategyData.width;
        const newOptions = clone(this._options.templateOptions);

        this._updateFloatAreaWidth(strategyData.width, newOptions);
        this._vDomTemplate.setPopupOptions(this._getNewPopupOptions(offset));
    },

    _getNewPopupOptions(offset: number = 0): object {
        const strategyData = this._getStrategyData(offset);
        const newPopupOptions = clone(this._options._popupOptions);
        if (strategyData.maxWidth) {
            newPopupOptions.maxWidth = strategyData.maxWidth;
        }
        return newPopupOptions;
    },

    _getStrategyData(offset: number = 0): object {
        const coords = this._getFloatAreaStackRootCoords();
        const item = {
            popupOptions: {
                minWidth: this._options._popupOptions.minWidth,
                maxWidth: this._options._popupOptions.maxWidth,
                width: this._options._popupOptions.width + offset,
                containerWidth: this._container.width(),
            },
        };
        const strategyPosition = StackStrategy.getPosition(coords, item);
        const MINIMAL_PANEL_DISTANCE = 117;
        // Минимальный отступ слева у floatArea больше на 17px, чем в вдомных окнах (там 100)
        // Не стал тащить сюда FloatAreaManager для явных расчетов, захардкодил отступ.
        const floatAreaMaxWidth = document.body.clientWidth - MINIMAL_PANEL_DISTANCE;

        if (floatAreaMaxWidth < strategyPosition.maxWidth) {
            strategyPosition.maxWidth = floatAreaMaxWidth;
        }
        return strategyPosition;
    },

    _onMaximizedHandler(): void {
        if (!this._panel._updateAreaWidth) {
            return;
        }

        this._maximized = !this._maximized;
        const coords = this._getFloatAreaStackRootCoords();
        const item = {
            popupOptions: {
                maximized: this._maximized,
                minWidth: this._options._popupOptions.minWidth,
                maxWidth: this._options._popupOptions.maxWidth,
                minimizedWidth: this._options._popupOptions.minimizedWidth,
                containerWidth: this._container.width(),
            },
        };

        // todo https://online.sbis.ru/opendoc.html?guid=256679aa-fac2-4d95-8915-d25f5d59b1ca
        item.popupOptions.width = this._maximized
            ? item.popupOptions.maxWidth
            : item.popupOptions.minimizedWidth || item.popupOptions.minWidth;
        const width = StackStrategy.getPosition(coords, item).width;

        const newOptions = clone(this._options.templateOptions);
        newOptions.maximized = this._maximized;
        this._panel._options.maximized = this._maximized;

        this._updateFloatAreaWidth(width, newOptions);
    },

    _updateFloatAreaWidth(width: number, newOptions?: object): void {
        this._panel._options.width = width;
        this._panel._options.maxWidth = width;
        this._panel._updateAreaWidth(width);
        this._panel._updateSideBarVisibility();
        this._panel.getContainer()[0].style.maxWidth = '';
        this._panel.getContainer()[0].style.minWidth = '';

        if (newOptions) {
            this._updateVDOMTemplate(newOptions);
            this._onResizeHandler();
        }
    },

    _getRootContainer() {
        const container = this._vDomTemplate.getContainer();
        return container.get ? container.get(0) : container;
    },

    destroy() {
        this._container[0].eventProperties = null;
        this.unsubscribe('activated', this._activatedHandler);
        this.unsubscribe('deactivated', this._deactivatedHandler);
        this._finishPopupOpenedDeferred();
        if (this._closeTimerId) {
            clearTimeout(this._closeTimerId);
            this._closeTimerId = null;
        }

        // Очищаем список лисенеров в контроллерах.
        for (let i = 0; i < this._listeners.length; i++) {
            const listener = this._listeners[i];
            ManagerWrapperController.unregisterListener(
                listener.event,
                listener.eventName,
                listener.emitter
            );
        }
        moduleClass.superclass.destroy.apply(this, arguments);
        this._isVDomTemplateMounted = true;
        this.getContainer().unbind('keydown', this._keydownHandler);
        if (this._vDomTemplate) {
            Synchronizer.unMountControlFromDOM(this._vDomTemplate, this._vDomTemplate._container);
        }
    },

    _forceUpdate() {
        // Заглушка для ForceUpdate которого на compoundControl нет
    },
    canAcceptFocus() {
        return this.isVisible();
    },

    setTemplateOptions(newOptions) {
        // Могут позвать перерисоку до того, как компонент создался
        // Если компонент еще не создался а его уже перерисовали, то создаться должент с новыми опциями
        this._saveTemplateOptions(newOptions);
        this._modifyInnerOptionsByHandlers();

        if (this._vDomTemplate) {
            this._isNewOptions = true;

            // Скроем окно перед установкой новых данных. покажем его после того,
            // как новые данные отрисуются и окно перепозиционируется
            // Если панель стековая, то не скрываем, т.к. позиция окна не изменится.
            if (
                this._panel._moduleName !== 'Lib/Control/FloatArea/FloatArea' ||
                this._panel._options.isStack !== true
            ) {
                this._panel.getContainer().closest('.ws-float-area').addClass('ws-invisible');
            }
            this._updateVDOMTemplate(this._options.templateOptions);
        }
    },

    _saveTemplateOptions(newOptions) {
        this._options.templateOptions = newOptions;
        this._maximized = !!this._options.templateOptions.maximized;
    },

    _updateVDOMTemplate(templateOptions) {
        this._vDomTemplate.setTemplateOptions(templateOptions);
        this._vDomTemplate._forceUpdate();
    },

    _activatedHandler(event, args) {
        if (!this.isActive()) {
            const activationTarget = args[0];
            const curContainer = this._container.length ? this._container[0] : this._container;
            const toContainer = activationTarget._$to._container.length
                ? activationTarget._$to._container[0]
                : activationTarget._$to._container;

            // активируем только тот контрол CompoundArea, в который ушел фокус. Родительским панелям не зовем setActive,
            // потому что тогда FloatAreaManager решит, что фокус ушел туда и закроет текущую панель

            // активируем только если фокус уходит в wasaby-контрол. если в панели лежит старый контрол и фокус уходит на
            // него, он сам позовет setActive для предков. а если здесь звать setActive
            // система позовет setActive(false) для контрола получившего фокус
            if (curContainer.contains(toContainer) && activationTarget._$to._template) {
                this.setActive(true, activationTarget.isShiftKey, true, activationTarget._$to);
            }
        }
    },

    _deactivatedHandler(event, args) {
        if (this.isActive()) {
            const activationTarget = args[0];
            this.setActive(false, activationTarget.isShiftKey, true);
        }
    },
});

moduleClass.dimensions = {
    resizable: false,
};
export default moduleClass;

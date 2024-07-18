/**
 * @kaizen_zone f30239e7-9eed-4273-bd85-3f5d432228f8
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_validate/Container';
import * as errorMessage from 'wml!Controls/_validate/ErrorMessage';
import * as ParallelDeferred from 'Types/ParallelDeferred';
import { Deferred } from 'Types/deferred';
import * as isNewEnvironment from 'Core/helpers/isNewEnvironment';
import { RegisterUtil, UnregisterUtil } from 'Controls/event';
import { TKey, TValidationStatus } from 'Controls/interface';
import { Logger } from 'UI/Utils';
import 'css!Controls/validate';
import { SyntheticEvent } from 'UI/Vdom';
import { IndicatorOpener } from 'Controls/LoadingIndicator';
import { IValidator, TReactValidator } from 'Controls/_validate/interfaces/Validator';

export interface IValidateConfig {
    hideInfoBox?: boolean;
    hideIndicator?: boolean;
}

export interface IValidateContainerOptions extends IControlOptions {
    content?: TemplateFunction;
    validators?: TReactValidator[];
    errorTemplate?: TemplateFunction;
}

type ValidResult = boolean | null | Promise<boolean> | string[] | IValidator;

type ValidationError = String[] & { control: ValidateContainer; areaKey: TKey | undefined };

/**
 * Контрол, регулирующий валидацию своего контента. Валидация запускается вызовом метода {@link Controls/_validate/Container#validate validate}.
 * @remark
 * Подробнее о работе с валидацией читайте {@link /doc/platform/developmentapl/interface-development/forms-and-validation/validation/ здесь}.
 * @class Controls/_validate/Container
 * @extends UI/Base:Control
 * @demo Controls-demo/Input/Validate/FormController
 *
 * @public
 */
class ValidateContainer<
    T extends IValidateContainerOptions = IValidateContainerOptions
> extends Control<T> {
    _template: TemplateFunction = template;
    _isOpened: boolean = false;
    _openingInProcess: boolean = false;
    _contentActive: boolean = false;
    _validationStatus: string = 'valid';
    _currentValue: any;
    _validationResult: ValidResult = null;
    _oldValidationResult: ValidResult = null;
    _isNewEnvironment: boolean;
    _closeId: number;
    _indicatorId: string | null;
    private _disableOwnInfobox: boolean = false;
    private _disableOwnInfoboxInCB: boolean = false;
    private _areaKey: TKey;

    protected _beforeMount(): void {
        this._isNewEnvironment = isNewEnvironment();
    }

    protected _afterMount(): void {
        // Use listener without template.
        // Some people can add style to the container of validation, and some people can add style to the content.
        RegisterUtil(this, 'customscroll', this._scrollHandler.bind(this), {
            listenAll: true,
        });
        this._notify('validateCreated', [this], { bubbling: true });
    }

    protected _beforeUnmount(): void {
        UnregisterUtil(this, 'customscroll', { listenAll: true });
        this._notify('validateDestroyed', [this], { bubbling: true });
        this._forceCloseInfoBox();
        IndicatorOpener.hide(this._indicatorId);
    }

    setAreaKey(areaKey: TKey) {
        this._areaKey = areaKey;
    }

    setDisableOwnInfobox(disableOwnInfobox: boolean) {
        this._disableOwnInfoboxInCB = disableOwnInfobox;
    }

    /**
     * @typedef {Object} IValidateConfig
     * @description Конфигурация метода validate для контейнеров валидации.
     * @property {Boolean} hideInfoBox Позволяет скрыть всплывающую подсказку при проваленной валидации.
     */

    /**
     * Запускает валидацию.
     * @function Controls/_validate/Container#validate
     * @param {IValidateConfig} validateConfig
     * @remark В случае успешной валидации промис вернет null, в противном случае массив из строк, содержащих текст
     * ошибок из валидаторов.
     * @return {Promise<string[] | null>}
     * @see setValidationResult
     * @see isValid
     */
    validate(validateConfig?: IValidateConfig): Promise<ValidationError | null> {
        this._disableOwnInfobox = false;
        return new Promise((resolve) => {
            if (this._indicatorId) {
                IndicatorOpener.hide(this._indicatorId);
            }
            if (!validateConfig || (validateConfig && validateConfig.hideIndicator !== true)) {
                this._indicatorId = IndicatorOpener.show();
            }
            const validators = this._options.validators || [];
            this.setValidationResult(null, validateConfig);
            this._callValidators(validators, validateConfig)
                .then((validationResult) => {
                    const isValid = validationResult === null;
                    if (this._infoboxCanBeClosed() && isValid) {
                        this._forceCloseInfoBox();
                    }
                    this._notify('validateFinished', [validationResult]);
                    resolve(validationResult);
                })
                .finally(() => {
                    if (this._indicatorId) {
                        IndicatorOpener.hide(this._indicatorId);
                        this._indicatorId = null;
                    }
                });
        });
    }

    /**
     * Устанавливает результат валидации.
     * @function Controls/_validate/Container#setValidationResult
     * @param {null|Boolean|Array.<String>} validationResult Результат валидации.
     * @see isValid
     * @see validate
     */
    setValidationResult(validationResult: ValidResult, config: IValidateConfig = {}): void {
        if (this._validationResult !== validationResult) {
            this._oldValidationResult = this._validationResult;
            this._validationResult = validationResult;
            this._validationStatus = this._getValidStatus(this._contentActive);
            if (!(validationResult instanceof Promise)) {
                this._forceUpdate();
            }
            if (!config.hideInfoBox) {
                if (validationResult) {
                    this._openInfoBox();
                } else if (this._infoboxCanBeClosed()) {
                    this._closeInfoBox();
                }
            }
        }
    }

    /**
     * Возвращает значение, указывающее, прошла ли проверка валидации содержимого успешно.
     * @function Controls/_validate/Container#isValid
     * @returns {Boolean}
     * @see setValidationResult
     * @see validate
     * @demo Controls-demo/Validate/isValid/Index
     */
    isValid(): boolean {
        return !this._validationResult;
    }

    openInfoBox(): void {
        this._openInfoBox();
    }

    protected _hoverHandler(): void {
        this._clearCloseId();
        if (!this._isOpened) {
            this._openInfoBox();
        }
    }

    protected _focusInHandler(): void {
        this._contentActive = true;
        this._validationStatus = this._getValidStatus(this._contentActive);
        this._clearCloseId();
        if (!this._isOpened) {
            this._openInfoBox();
        }
    }

    protected _focusOutHandler(event: SyntheticEvent<FocusEvent>): void {
        this._contentActive = false;
        this._validationStatus = this._getValidStatus(this._contentActive);
        if (!this.isValid()) {
            // При уходе фокуса закрываю без задержки. Сценарий:
            // На документе нажимают кнопку сохранить, validate:Controller активирует первое поле ввода, провалившее
            // валидацию, после документ показывает диалоговое окно с сообщением об ошибке, фокус уходит на это окно.
            // Если инфобокс упел показаться, то визуально будет моргание.

            const InfoboxClassName: string = 'controls-InfoBoxTemplate';
            const { relatedTarget } = event.nativeEvent;
            let isFocusOutToInfobox: boolean;
            if (relatedTarget) {
                isFocusOutToInfobox = !!(relatedTarget as HTMLElement).closest(
                    `.${InfoboxClassName}`
                );
            }
            // Если фокус ушел в связанную подсказку, то дадим время для закрытия. Нужно чтобы внутри окна могли
            // отработать обработчики на клик, если таковые имеются.
            if (isFocusOutToInfobox) {
                this._closeInfoBox();
            } else {
                this._forceCloseInfoBox();
            }
        }
    }

    protected _mouseLeaveHandler(): void {
        if (!this.isValid()) {
            this._closeInfoBox();
        }
    }

    protected _valueChangedHandler(event: Event, value: any, displayValue?: any): void {
        // We clean validation, if the value has changed.
        // But some controls notify valueChanged if the additional data has changed.
        // For example, input fields notify 'valueChanged' , when displayValue has changed, but value hasn't changed.
        if (this._currentValue !== value) {
            this._currentValue = value;
            event.stopImmediatePropagation();
            this._notify('valueChanged', [value, displayValue]);
            this._cleanValid();
        }
    }

    private _callValidators(validators: Function[], validateConfig?: IValidateConfig) {
        let validationResult = null;
        let errors: ValidationError = [];
        let validatorResult;
        let validator;
        let index;

        const parallelDeferred = new ParallelDeferred();
        const validatorsForCheck = [].concat(validators);

        // провалидируем по собственным валидаторам
        for (index in validatorsForCheck) {
            if (validatorsForCheck.hasOwnProperty(index)) {
                validator = validatorsForCheck[index];
                if (typeof validator === 'function') {
                    // если встретили функцию
                    validatorResult = validator();
                } else if (validator instanceof Promise) {
                    // если встретили deferred - значит значение уже провалидировано и ждем результат
                    validatorResult = validator;
                } else {
                    // если что-то еще, считаем что это - ответ валидации
                    validatorResult = !!validator;
                }

                // результат - либо deferred, либо готовое значение
                if (validatorResult instanceof Promise) {
                    parallelDeferred.push(validatorResult);
                } else {
                    if (
                        typeof validatorResult === 'string' ||
                        this._isUserValidateResult(validatorResult)
                    ) {
                        validationResult = validatorResult;
                    } else {
                        validationResult = !!validatorResult;
                    }
                    if (
                        validationResult === false ||
                        typeof validatorResult === 'string' ||
                        this._isUserValidateResult(validatorResult)
                    ) {
                        errors.push(validatorResult);
                    }
                }
            }
        }

        const resultDeferred = new Deferred();

        // далее, смотрим что возвращают результаты-деферреды
        parallelDeferred
            .done()
            .getResult()
            .addCallback((results) => {
                let validationResultFromDef = null;
                if (typeof results === 'object') {
                    for (const resultIndex in results) {
                        // плохие результаты запоминаем в массиве с ошибками
                        if (results.hasOwnProperty(resultIndex)) {
                            let result = results[resultIndex];
                            if (
                                typeof result !== 'string' &&
                                typeof result !== 'object' &&
                                !Array.isArray(result)
                            ) {
                                result = !!result;
                            }
                            if (
                                result === false ||
                                typeof result === 'string' ||
                                this._isUserValidateResult(result)
                            ) {
                                errors.push(result);
                            } else if (Array.isArray(result)) {
                                errors = result;
                            }
                        }
                    }
                }
                // если ошибки были найдены, отдадим их в качестве ответа
                if (errors.length) {
                    errors.control = this;
                    errors.areaKey = this._areaKey;
                    validationResultFromDef = errors;
                }

                this.setValidationResult(validationResultFromDef, validateConfig);
                resultDeferred.callback(validationResultFromDef);
            })
            .addErrback((e) => {
                Logger.error('Validate: Validation error', this, e);
            });

        return resultDeferred;
    }

    private _isUserValidateResult(result: IValidator): boolean {
        if (result && typeof result === 'object' && !Array.isArray(result)) {
            if (!result.templateName) {
                Logger.error('Validate: Validator not specified templateName');
                return false;
            }
            return true;
        }
        return false;
    }

    private _openInfoBox(): void {
        if (!this._destroyed && !this._disableOwnInfoboxInCB && !this._disableOwnInfobox) {
            this._clearCloseId();
            if (
                this._validationResult &&
                this._validationResult.length &&
                (!this._isOpened || this._oldValidationResult !== this._validationResult)
            ) {
                this._oldValidationResult = this._validationResult;
                this._openingInProcess = true;
                const cfg = {
                    target: this._container,
                    validationStatus: 'invalid',
                    template: this._options.errorTemplate,
                    theme: this._options.theme,
                    templateOptions: { errors: this._validationResult },
                    closeOnOutsideClick: false,
                    eventHandlers: {
                        onResult: this._mouseInfoboxHandler.bind(this),
                        onClose: this._closeHandler.bind(this),
                        onOpen: this._onOpenHandler.bind(this),
                    },
                };

                this._callInfoBox(cfg);
            }
        }
    }

    private _callInfoBox(cfg): void {
        // todo https://online.sbis.ru/opendoc.html?guid=dedf534a-3498-4b93-b09c-0f36f7c91ab5
        if (this._isNewEnvironment) {
            this._notify('openInfoBox', [cfg], { bubbling: true });
        } else {
            // Если окружение старое, создаем ManagerWrapper, в котором рисуются dom окна в старом окружении
            // В том числе инфобоксы.
            requirejs(['Controls/popup'], (popup) => {
                popup.BaseOpener.getManager().then(() => {
                    const GlobalPopup = this._getGlobalPopup();
                    if (GlobalPopup) {
                        const event = {
                            target: this._container,
                        };
                        GlobalPopup.openInfoBoxHandler(event, cfg);
                    }
                });
            });
        }
    }

    private _getGlobalPopup(): unknown {
        // Получаем обработчик глобальных событий по открытию окон, который на вдом
        // Лежит в application
        const ManagerWrapperControllerModule =
            'Controls/Popup/Compatible/ManagerWrapper/Controller';
        if (requirejs.defined(ManagerWrapperControllerModule)) {
            return requirejs(ManagerWrapperControllerModule).default.getGlobalPopup();
        }
    }

    private _closeInfoBox(): void {
        this._closeId = setTimeout(() => {
            this._forceCloseInfoBox();
        }, 300);
    }

    private _clearCloseId(): void {
        if (this._closeId) {
            clearTimeout(this._closeId);
            this._closeId = null;
        }
    }

    private _forceCloseInfoBox(): void {
        const delay = 0;
        if (this._isNewEnvironment) {
            this._notify('closeInfoBox', [delay], { bubbling: true });
        } else {
            // Аналог self._notify('closeInfoBox', [delay], { bubbling: true });, только обработчик
            // Вызывается напрямую, так как события через compoundControl не летят
            const GlobalPopup = this._getGlobalPopup();
            if (GlobalPopup) {
                const event = {
                    target: this._container,
                };
                GlobalPopup.closeInfoBoxHandler(event, delay);
            }
        }
        this._openingInProcess = false;
    }

    private _scrollHandler(): void {
        if (this._infoboxCanBeClosed()) {
            this._forceCloseInfoBox();
        }
    }

    /**
     * Нужно 2 признака того что инфобокс открыт - синхронный и по факту открытия.
     * 1. От вызова открытия до появления инфобокса он нужен для того, чтобы отменить открытие если сбросили валидацию во время открытия
     * Он не сбрасывается на onClose, т.к. во время открытия onClose может стрельнуть только для предыдущего инфобокса
     * 2. По факту открытия, взводится на onOpen, сбрасывается на onClose
     * @private
     */
    private _infoboxCanBeClosed(): boolean {
        return this._isOpened || this._openingInProcess;
    }

    private _mouseInfoboxHandler(event: Event): void {
        if (event.type === 'mouseenter') {
            this._hoverInfoboxHandler();
        } else if (event.type === 'mouseleave') {
            this._mouseLeaveHandler();
        } else if (event.type === 'close') {
            this._isOpened = false;
            // Не показываем подсказку, если пользователь ее закрыл
            this._disableOwnInfobox = true;
        }
    }

    private _closeHandler(): void {
        this._isOpened = false;
    }

    protected _onOpenHandler(): void {
        this._openingInProcess = false;
        // Может произойти так, что вызвали показ окна, и примерно в этот же момент произошел сброс валидации.
        // В таком случае поле будет валидным, а infobox будет висеть.
        // Поэтому закрываем окно сами по необходимости.
        if (!(this._validationResult && this._validationResult.length)) {
            this._forceCloseInfoBox();
            return;
        }
        this._isOpened = true;
    }

    private _hoverInfoboxHandler(): void {
        this._clearCloseId();
    }

    private _cleanValid(): void {
        if (this._validationResult) {
            this.setValidationResult(null);
            this._forceCloseInfoBox();
        }
    }

    protected _getValidStatus(contentActive: boolean): TValidationStatus {
        // ie is not support focus-within
        if (this._isValidResult()) {
            return contentActive ? 'invalidAccent' : 'invalid';
        }
        return 'valid';
    }

    // todo это временный фикс, этот код должен уйти в контрол поля ввода,
    //  валидация уже отдает туда результат валидации, контролу нужно использовать эти данные
    _isValidResult(): boolean {
        return this._validationResult && !(this._validationResult instanceof Promise);
    }

    static getDefaultOptions(): IValidateContainerOptions {
        return {
            errorTemplate: errorMessage,
        };
    }
}

export default ValidateContainer;

/**
 * @event Controls/_validate/Container#validateFinished Происходит после заверешения валидации контейнера.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {null|Array.<String>} validationResult Результат валидации. В случае прохождения валидации вернет null, в противном случае вернет массив из строк.
 * @see validate
 */

/**
 * @name Controls/_validate/Container#content
 * @cfg {TemplateFunction} Контент, который будет провалидирован.
 */
/*
 * @name Controls/_validate/Container#content
 * @cfg {Content} The content to which the logic of validation is added.
 */

/*
 * @name Controls/_validate/Container#validators
 * @cfg {Array.<Function>|Function} The function of validation.
 */
/**
 * @name Controls/_validate/Container#validators
 * @cfg {Array<Controls/validate/TValidator>|Controls/validate/TValidator} Функция (или массив функций) валидации.
 */

/**
 * @name Controls/_validate/Container#errorTemplate
 * @cfg {Function} Пользовательский шаблон для отображения содержимого окна с ошибкой.
 * @remark Шаблон принимает опцию errors (string[]), содержащую массив сообщений с ошибками.
 * @demo Controls-demo/Validate/ErrorTemplate/Index
 */

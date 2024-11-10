import { Container } from 'Controls/validate';

type TValidateResult = string[] | null;
type TValidator = () => Promise<TValidateResult>;

interface IValidateContainerOptions {
    validateCallback: TValidator;
}

/**
 * Обертка, запускающая валидацию контента для PropertyGrid.
 * @remark
 * Controls/validate:ControllerClass проверяет _options.readOnly, поэтому нужна дополнительная обертка с явно проставленным значением readOnly.
 * Когда активирована опция limit, PropertyGrid выстреливает экземпляром этого класса по событию validateCreated.
 * @private
 */
export class ValidateContainer extends Container {
    private readonly _options: object = {
        readOnly: false,
    };
    private _validateCallback: TValidator;
    private _validationResult: TValidateResult;

    constructor(options: IValidateContainerOptions) {
        super(options);
        const { validateCallback } = options;
        this._validateCallback = validateCallback;
    }

    validate(): Promise<TValidateResult> {
        return this._validateCallback().then((validateResult) => {
            this.setValidationResult(validateResult);
            return validateResult;
        });
    }

    setValidationResult(result: TValidateResult): void {
        this._validationResult = result;
    }

    getValidationResult(): TValidateResult {
        return this._validationResult;
    }

    isValid(): boolean {
        return !this._validationResult;
    }

    destroy(): void {
        this._validateCallback = null;
    }

    // region controlMock
    activate(): void {
        return;
    }

    openInfoBox(): void {
        return;
    }

    _container: object = {
        closest: () => {
            return undefined;
        },
    };
    // endregion controlMock
}

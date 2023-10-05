/**
 * @kaizen_zone f30239e7-9eed-4273-bd85-3f5d432228f8
 */
import { Logger } from 'UI/Utils';
import { default as ValidateContainer, IValidateConfig } from 'Controls/_validate/Container';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { Guid as createGUID } from 'Types/entity';
import { IndicatorOpener } from 'Controls/LoadingIndicator';
import { ControllerClass } from 'Controls/validate';
import { IStepModel } from './interface/IStepModel';
import { default as Controller } from './Controller';

export interface IHintControllerConfig {
    activateInput?: boolean;
}

interface IValidateResult {
    [key: string]: null | string[] | IStepModel[];

    hasErrors?: boolean;
}

// Если при валидации вернули строку, а не объект IStepModel, то выставляем значение для order сами.
// Для этого зарезервированы значения от 0 до 100. Ставим 99, так как значения при валидации, идут в обратном порядке.
const DEFAULT_STRING_ORDER_VALUE = 99;

/**
 * Класс, регулирующий валидацию формы.
 * @extends UI/Base:Control
 * @public
 */

class ValidateControllerClass extends ControllerClass {
    private _failedValidate: IStepModel[] = [];
    private _currentOrder: number;

    private _controller: Controller;

    protected _getController(config: IStepModel[]) {
        if (this._controller) {
            this._controller.updateScheme(config);
        } else {
            const route = new Model({
                keyProperty: 'id',
                format: [
                    {name: 'id', type: 'string'},
                    {name: 'scheme', type: 'recordset'},
                    {name: 'display', type: 'object'},
                ],
            });
            route.set('id', createGUID.create());
            route.set(
                'scheme',
                new RecordSet({
                    keyProperty: 'id',
                    rawData: config,
                })
            );
            route.set('display', {});

            this._controller = new Controller(route);
        }
        return this._controller;
    }

    private isStringValue(res: null | string[] | IStepModel[]): boolean {
        if (res) {
            return typeof res[0] === 'string';
        }
        return true;
    }

    submit(): Promise<IValidateResult | Error> {
        this._failedValidate = [];
        const validatePromises = [];

        // The infobox should be displayed on the first not valid field.
        this._validates.reverse();
        const containerConfig: IValidateConfig = {
            hideInfoBox: true,
            hideIndicator: true,
        };
        this._validates.forEach((validate: ValidateContainer) => {
            if (!(validate._options && validate._options.readOnly)) {
                validatePromises.push(validate.validate(containerConfig));
            }
        });

        const resultPromise = Promise.all(validatePromises);
        this._indicatorId = IndicatorOpener.show();
        let stringOrderValue = DEFAULT_STRING_ORDER_VALUE;

        return resultPromise
            .then((results: IValidateResult) => {
                let key: string;
                let needValid: IStepModel;
                let resultCounter: number = 0;

                this._currentOrder =
                    this.isStringValue(results[resultCounter])
                        ? stringOrderValue : (results[resultCounter] as IStepModel[])[0].order;

                // Walking through object with errors and focusing first not valid field.
                for (key in this._validates) {
                    if (this._validates[key]) {
                        const isString = this.isStringValue(results[resultCounter]);
                        const currentOrder = isString
                            ? stringOrderValue : (results[resultCounter] as IStepModel[])[0].order;

                        if (
                            this._validates.hasOwnProperty(key) &&
                            !this._validates[key]._options.readOnly
                        ) {
                            // Отключаем отображение подсказок в validateContainer
                            this._validates[key].setDisableOwnInfobox?.(true);

                            if (results[resultCounter]) {
                                let correctResult: IStepModel;
                                if (isString) {
                                    correctResult = {
                                        id: createGUID.create(),
                                        order: stringOrderValue,
                                        widgets: [],
                                        message: results[resultCounter][0] as string,
                                        display: {
                                            style: 'invalid',
                                            targetId:
                                                '[data-name="' + this._validates[key]._container?.dataset?.name + '"]'
                                        },
                                    };
                                    stringOrderValue--;
                                } else {
                                    correctResult = results[resultCounter][0] as IStepModel;
                                }
                                if (this._currentOrder >= currentOrder) {
                                    needValid = correctResult;
                                    this._currentOrder = currentOrder;
                                }
                                this._failedValidate.push(correctResult);
                            }
                            resultCounter++;
                        }
                    }
                }
                if (!!needValid) {
                    results.hasErrors = true;
                    const controller = this._getController(this._failedValidate);
                    controller.activate(needValid.id);
                }
                this._validates.reverse();
                return results;
            })
            .catch((e: Error) => {
                Logger.error('Form: Submit error', this, e);
                return e;
            })
            .finally(() => {
                if (this._indicatorId) {
                    IndicatorOpener.hide(this._indicatorId);
                    this._indicatorId = null;
                }
            });
    }

    setValidationResult(): void {
        super.setValidationResult();
        this._failedValidate = [];
        this._controller.destroy();
    }

    destroy(): void {
        super.destroy();
        if (this._controller) {
            this._controller.destroy();
            this._controller = null;
        }
    }

    next(): void {
        this._controller?.next?.();
    }

    prev(): void {
        this._controller?.prev?.();
    }

    openStep(id: string): void {
        this._controller?.openStep?.(id);
    }

    updateStep(id: string, step: Model<IStepModel>): void {
        this._controller?.updateStep?.(id, step);
    }

    removeStep(id: string): void {
        this._controller?.removeStep?.(id);
    }
}

export default ValidateControllerClass;

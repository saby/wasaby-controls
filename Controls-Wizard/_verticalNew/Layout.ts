import * as template from 'wml!Controls-Wizard/_verticalNew/Layout/Layout';
import { Control, TemplateFunction } from 'UI/Base';
import IStep from 'Controls-Wizard/IStep';
import { IWizardOptions, IWizardItem } from 'Controls-Wizard/_verticalNew/ILayout';
import { EventUtils } from 'UI/Events';
import { SyntheticEvent } from 'UICommon/Events';
import { Record } from 'Types/entity';
import { TKey } from 'Controls/interface';
import {
    Container as ValidateContainer,
    ControllerClass,
    IValidateResult,
} from 'Controls/validate';
import 'css!Controls-Wizard/verticalNew';

/**
 * Контрол для отображения процесса, состоящего из нескольких шагов
 *
 * @extends UI/Base:Control
 * @demo Controls-Wizard-demo/verticalNew/Index
 * @implements Controls-Wizard/verticalNew:IWizard
 * @public
 * @remark
 * Подробнее о Мастере (Wizard)
 * {@link http://axure.tensor.ru/StandardsV8/%D0%BC%D0%B0%D1%81%D1%82%D0%B5%D1%80.html Стандарт Мастер (Wizard)}
 */
export default class Layout extends Control<IWizardOptions> implements IStep {
    readonly '[Controls-Wizard/IStep]': boolean = true;
    protected _template: TemplateFunction = template;
    protected _selectedTemplate: TemplateFunction | string;
    protected _selectedRecord: Record;
    protected _selectedTemplateOptions: Object;
    protected _saveRecords: Map<number, Object> = new Map();
    protected _tmplNotify: Function = EventUtils.tmplNotify;
    private _validateController: ControllerClass = new ControllerClass();
    protected _dataOptions: object;

    protected _beforeMount(options?: IWizardOptions): void {
        const { items, selectedStepIndex } = options;
        this._getProperties(items, selectedStepIndex);
        if (options._dataOptionsValue) {
            this._dataOptions = this._getDataOptions(options);
        }
    }

    protected _beforeUpdate(options?: IWizardOptions): void {
        const { items, selectedStepIndex } = options;
        this._getProperties(items, selectedStepIndex);

        if (options.selectedStepIndex !== this._options.selectedStepIndex) {
            if (options._dataOptionsValue) {
                if (!!options._dataOptionsValue.results[options.selectedStepIndex]) {
                    this._dataOptions = this._getDataOptions(options);
                } else {
                    const loadResult = options._dataOptionsValue.load(
                        options._dataOptionsValue,
                        options.selectedStepIndex.toString()
                    );
                    if (loadResult instanceof Promise) {
                        loadResult.then((config) => {
                            this._dataOptions = config.results[options.selectedStepIndex] as {
                                [P in TKey]: unknown;
                            };
                        });
                    } else {
                        this._dataOptions = options._dataOptionsValue.results[
                            options.selectedStepIndex
                        ] as { [P in TKey]: unknown };
                    }
                }
            }
        }
    }

    protected _afterUpdate(): void {
        this._validateController.resolveSubmit();
    }

    protected _beforeUnmount(): void {
        this._validateController.destroy();
    }

    protected _onValidateCreated(e: Event, control: ValidateContainer): void {
        this._validateController.addValidator(control);
    }

    protected _onValidateDestroyed(e: Event, control: ValidateContainer): void {
        this._validateController.removeValidator(control);
    }

    protected _switchChangesRecord(
        event: SyntheticEvent<Event>,
        step: number,
        newValue: Object
    ): void {
        this._notify('selectedStepIndexChanged', [step]);
        if (newValue) {
            const savedRecord = this._saveRecords.get(step);
            this._options.items[step].record.set(savedRecord);
        } else {
            this._selectedRecord = this._options.items[step].record;
            this._saveRecord(step);
            this._options.items[step].record.rejectChanges();
        }
    }

    protected _indexChanged(
        event: SyntheticEvent<MouseEvent>,
        nextStep: number,
        isNextButton: boolean
    ): void {
        this._forceUpdate();
        this._validateController.deferSubmit().then((result: IValidateResult) => {
            if (!result.hasErrors) {
                this._notify('selectedStepIndexChanged', [nextStep]);
                if (isNextButton) {
                    this._notify('currentStepIndexChanged', [nextStep]);
                }
            } else if (nextStep < this._options.currentStepIndex) {
                this._notify('validationFailedOnChangeStep', [
                    this._options.currentStepIndex,
                    nextStep,
                ]);
            }
        });
    }

    private _getProperties(items: IWizardItem[], selectedStepIndex: number): void {
        this._selectedRecord = items[selectedStepIndex].record;
        this._selectedTemplate = items[selectedStepIndex].contentTemplate;
        this._selectedTemplateOptions = items[selectedStepIndex].contentTemplateOptions;
    }

    private getRecordChangedFields = (record: Record) => {
        const data = {};
        record?.getChanged()?.forEach((key) => {
            data[key] = record.get(key);
        });

        return data;
    };

    protected _saveRecord(step: number): void {
        this._saveRecords.set(step, this.getRecordChangedFields(this._selectedRecord));
    }

    protected _shouldLoadInAsync(contentTemplate: string | TemplateFunction): boolean {
        return typeof contentTemplate === 'string';
    }

    private _getDataOptions(options: IWizardOptions): object {
        return options._dataOptionsValue?.results?.[options.selectedStepIndex] as {
            [P in TKey]: unknown;
        };
    }

    static getDefaultOptions(): IWizardOptions {
        return {
            mode: 'edit',
        };
    }
}

/**
 * @event validationFailedOnChangeStep  Событие которое происходит в случае если не прошла валидация при попытке перейти на
 * другой шаг мастера.
 * @demo Controls-Wizard-demo/verticalNew/ValidationFailedOnChangeStep/Index
 * @param {Event} eventObject.
 * @param {Number} stepWithFailedValidation Номер шага, в котором провалилась валидация.
 * @param {Number} nextStep Номер шага, по которому произошёл клик.
 */

import * as template from 'wml!Controls-Wizard/_horizontal/StepBar/StepBar';
import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import IStepBar, { IStepBarOptions } from './IStepBar';
import 'css!Controls-Wizard/horizontal';

/**
 * Контрол, отображающий ленту блоков, описывающих процесс, состоящий из нескольких шагов.
 * @remark
 * {@link /doc/platform/developmentapl/interface-development/controls/navigation/master/#horizontal-master-stepbar Руководство разработчика}
 * @extends UI/Base:Control
 * @demo Controls-Wizard-demo/horizontal/horizontalBase/HorizontalBase
 * @public
 */
export default class StepBar extends Control<IStepBarOptions> implements IStepBar {
    readonly '[Controls-Wizard/_horizontal/IStepBar]': boolean = true;
    readonly '[Controls-Wizard/IStep]': boolean = true;

    protected _template: TemplateFunction = template;

    protected clickHandler(event: SyntheticEvent<MouseEvent>, index: number): void {
        this._notify('selectedStepIndexChanged', [index]);
    }

    protected getItemModifier(stepIndex: number): string {
        return StepBar.getStepModifier(
            stepIndex,
            this._options.currentStepIndex,
            this._options.selectedStepIndex
        );
    }

    static getDefaultOptions(): object {
        return {
            displayMode: 'default',
        };
    }

    /**
     * Функция возвращает текущий модификатор шага в зависимости от отображаемого и текущего шага
     * @param {number} stepIndex
     * @param {number} currentStepIndex
     * @param {number} selectedStepIndex
     * @returns {string}
     */
    static getStepModifier(
        stepIndex: number,
        currentStepIndex: number,
        selectedStepIndex: number
    ): string {
        let modifier: string;

        if (stepIndex === selectedStepIndex) {
            modifier = 'active';
        } else if (stepIndex > currentStepIndex) {
            modifier = 'future';
        } else if (stepIndex <= currentStepIndex) {
            modifier = 'traversed';
        }
        return modifier;
    }
}

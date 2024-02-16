import { IControlOptions } from 'UI/Base';

/**
 * Интерфейс для контролов, имеющих логику работы с шагами
 * @public
 */
export default interface IStep {
    readonly '[Controls-Wizard/IStep]': boolean;

    /**
     * @event Controls-Wizard/IStep#selectedStepIndexChanged Срабатывает при клике по элементу
     * @param {Number} stepIndex Номер выбранного шага.
     * @remark Разработчик сам определяет, есть ли возможность перейти на выбранный шаг
     * @example
     * В данном примере показано, что шаг будет переключаться только при условии пройденной валидации
     * TS:
     * <pre>
     *     selectedStepIndexChanged(event: SyntheticEvent<Event>, stepIndex: number) {
     *          if (this.validateStep(stepIndex) {
     *              this.selectedStepIndex = stepIndex;
     *          }
     *     }
     * </pre>
     */
}

export interface IStepOptions extends IControlOptions {
    /**
     * @name Controls-Wizard/IStep#selectedStepIndex
     * @cfg {number} Номер выбранного шага
     * @example
     * В данном примере показано, как указывать выбранный шаг
     * WML:
     * <pre>
     *     <Controls-Wizard.horizontal:StepBar
     *          bind:selectedStepIndex="selectedStepIndex"
     *          .../>
     * </pre>
     */
    selectedStepIndex?: number;
}

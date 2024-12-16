/**
 * @kaizen_zone 3f785aa8-d36c-4b57-946a-a916e51ded4d
 */
import { IControlOptions } from 'UI/Base';

/**
 * Шаблон, который используется для отображения иконки для {@link Controls/RadioGroup:Control radioGroup}.
 * @class Controls/toggle:switchCircleTemplate
 * @public
 * @see Controls/RadioGroup:Control
 */

export default interface ISwitchCircleTemplate extends IControlOptions {
    /**
     * Определяет состояние иконки
     */
    selected?: boolean;
}

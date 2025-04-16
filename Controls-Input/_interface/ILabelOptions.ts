import { TInnerLabel, TOuterIconLabel, TOuterTextLabel } from './IBaseInterface';

/**
 * Интерфейс, определяющий вид подсказки.
 * @public
 */
export interface ILabelOptions {
    /**
     * Конфигурация подсказки.
     * @demo Controls-Input-demo/InputConnected/Text/Label
     * @demo Controls-Input-demo/InputConnected/Text/Jumping
     */
    label?: TInnerLabel | TOuterIconLabel | TOuterTextLabel;
}

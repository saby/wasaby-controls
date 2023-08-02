/**
 * @kaizen_zone 47124c7e-27dc-43e5-a39f-fcc418c550f0
 */
import { DataSet } from 'Types/source';
/**
 * Базовый интерфейс действия над записью
 * @interface Controls/_listCommands/interface/IAction
 * @public
 */
export default interface IAction {
    /**
     * Запускает действие над записью
     * @param meta Конфигурация для передачи в провайдер действия.
     * @return {Promise<Void|String|Types/source:DataSet>} Результат выполнения действия
     */
    execute(meta?: any): Promise<void | string | DataSet>;
}

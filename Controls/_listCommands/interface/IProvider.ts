/**
 * @kaizen_zone 47124c7e-27dc-43e5-a39f-fcc418c550f0
 */
import { DataSet } from 'Types/source';
import IActionOptions from './IActionOptions';

/**
 * Базовый интерфейс провайдера действия
 * @interface Controls/_listCommands/interface/IProvider/IProviderOptions
 * @extends Controls/_listCommands/interface/IActionOptions
 * @public
 */
export interface IOptions extends IActionOptions {
    /**
     * @cfg {String} имя провайдера для выполнения команды. Провайдер должен реализовывать интерфейс {@link Controls/_listCommands/interface/IProvider} и принимать конфиг с опциями {@link Controls/_listCommands/interface/IProvider/IProviderOptions}
     */
    providerName?: string;
    /**
     * @cfg {Object} Опции для передачи в провайдер
     */
    providerOptions?: any;
}

/**
 * Базовый интерфейс провайдера действия
 * @public
 */
export default interface IProvider<T extends IOptions = IOptions> {
    /**
     * Запускает провайдер действия
     * @param meta Конфигурация провайдера действия.
     * @return {Promise<Void|String|Types/source:DataSet>} Результат выполнения действия
     */
    execute(meta?: T): Promise<void | string | DataSet>;
}

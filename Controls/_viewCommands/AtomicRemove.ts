import Remove from './Remove';
import { IOptions } from './IViewAction';

/**
 * Экшен синхронного удаления записей из списка.
 * @public
 */
export default class AtomicRemove extends Remove {
    execute(meta: Partial<IOptions>): Promise<string | void> {
        const config = { ...this._options, ...meta };

        this._strategy.remove(this._options.items || config.sourceController.getItems(), config);
        return config.command ? config.command.execute(config) : Promise.resolve();
    }
}

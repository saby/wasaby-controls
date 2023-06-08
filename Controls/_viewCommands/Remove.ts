import { IOptions } from './IViewAction';
import HierarchyRemoveStrategy from './Remove/HierarchyRemoveStrategy';
import FlatRemoveStrategy from './Remove/FlatRemoveStrategy';

export interface IRemoveOptions extends IOptions {
    strategy?: HierarchyRemoveStrategy;
}

/**
 * Экшен удаления записей из списка.
 * @public
 */
export default class {
    protected _options: IRemoveOptions;
    protected _strategy: HierarchyRemoveStrategy | FlatRemoveStrategy;

    constructor(options: IRemoveOptions) {
        this._options = options;
        this._strategy = options.parentProperty
            ? new HierarchyRemoveStrategy()
            : new FlatRemoveStrategy();
    }

    execute(meta: Partial<IRemoveOptions>): Promise<string | void> {
        const config = { ...this._options, ...meta };
        const executePromise = config.command
            ? config.command.execute(config)
            : Promise.resolve();
        return executePromise.then((result) => {
            if (result) {
                this._strategy.remove(
                    config.sourceController.getItems(),
                    config
                );
            }
        });
    }
}

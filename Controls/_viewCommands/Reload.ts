import { IOptions } from './IViewAction';

/**
 * Экшен для перезагрузки списка.
 * @public
 */
export default class Reload {
    protected _options: IOptions;

    constructor(options: IOptions) {
        this._options = options;
    }

    execute(meta: Partial<IOptions>): Promise<void> {
        const config = { ...this._options, ...meta };

        const executePromise = config.command
            ? config.command.execute(config)
            : Promise.resolve();
        return executePromise.then(() => {
            config.sourceController.reload();
        });
    }
}

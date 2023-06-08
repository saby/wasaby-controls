/**
 * @kaizen_zone 293416f9-4e9e-486d-b60d-f7572b4ae0c9
 */
import IAction from './interface/IAction';
import IProvider, { IOptions } from './interface/IProvider';
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';

/**
 * Действие "удаление записи"
 * @class Controls/_listCommands/Remove
 * @implements Controls/listCommands:IAction
 * @public
 */
export default class Remove implements IAction {
    protected readonly _options: IOptions;

    constructor(options: IOptions = {} as IOptions) {
        this._options = options;
    }

    execute(meta?: Partial<IOptions>): Promise<string | void> {
        let providerName;
        if (this._options.providerName) {
            providerName = this._options.providerName;
        }
        return this._getProvider(providerName).then((provider) => {
            return provider.execute({
                ...this._options,
                ...meta,
                ...this._options.providerOptions,
            });
        }) as Promise<string | void>;
    }

    protected _getProvider(
        providerName: string = 'Controls/listCommands:RemoveProvider'
    ): Promise<IProvider> {
        return ModulesLoader.loadAsync(providerName).then((provider: IProvider) => {
            return new provider();
        });
    }
}

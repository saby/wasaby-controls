/**
 * @kaizen_zone 1ae44c37-18d9-4109-b22c-bd35470364aa
 */
import { DataSet, CrudEntityKey, LOCAL_MOVE_POSITION } from 'Types/source';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { ISiblingStrategy } from 'Controls/baseList';

import { IOptions as IMoveProviderOptions } from './Providers/Move';
import IAction from './interface/IAction';
import IProvider, { IOptions as IProviderOptions } from './interface/IProvider';

/**
 * @interface Controls/_listCommands/Move/IMoveProviderWithDialog
 * @extends Controls/_listCommands/Providers/Move/IMoveProvider
 * @public
 */
export interface IOptions extends IProviderOptions, IMoveProviderOptions {
    /**
     * @cfg {ISiblingStrategy} стратегия, позволяющая определить соседний элемент в RecordSet
     */
    siblingStrategy?: ISiblingStrategy;
    /**
     * @cfg {String} имя провайдера для выполнения команды. Провайдер должен реализовывать интерфейс {@link Controls/_listCommands/interface/IProvider} и принимать конфиг с опциями {@link Controls/listCommands:IMoveActionOptions}
     */
    providerName?: string;

    // Позволяет не использовать MoveToFolder  пока не все его добавили
    useDefaultMoveMethod?: boolean;
}

/**
 * Действие "перемещение записей"
 * @class Controls/_listCommands/Move
 * @implements Controls/_listCommands/Move/IMoveProviderWithDialog
 * @public
 */
export default class Move implements IAction {
    protected _options: IOptions;

    constructor(options: IOptions = {} as IOptions) {
        this._options = options;
    }

    execute(meta?: Partial<IOptions>): Promise<void | DataSet> {
        const config: IOptions = {
            ...this._options,
            ...meta,
            ...meta?.providerOptions,
        };
        return Move._getProvider(config.providerName).then((provider) => {
            return this._getTargetKey(config).then((targetKey) => {
                return provider.execute({
                    ...config,
                    targetKey,
                }) as Promise<void | DataSet>;
            });
        });
    }

    /**
     * Получает ключ записи назначения в зависимости от указанной позиции
     * @param config
     * @private
     */
    protected _getTargetKey(config: Partial<IOptions>): Promise<CrudEntityKey> {
        if (config.targetKey !== undefined || config.target !== undefined) {
            const targetKey =
                config.targetKey !== undefined
                    ? config.targetKey
                    : config.target?.getKey();
            return Promise.resolve(targetKey);
        }

        if (config.position && config.position !== LOCAL_MOVE_POSITION.On) {
            const target =
                config.position === LOCAL_MOVE_POSITION.Before
                    ? config.siblingStrategy.getPrevByKey(
                          config.selection.selected[0]
                      )
                    : config.siblingStrategy.getNextByKey(
                          config.selection.selected[0]
                      );
            return target ? Promise.resolve(target.getKey()) : Promise.reject();
        }
    }

    private static _getProvider(
        providerName: string = 'Controls/listCommands:MoveProvider'
    ): Promise<IProvider<IMoveProviderOptions>> {
        return loadAsync(providerName).then(
            (provider: IProvider<IMoveProviderOptions>) => {
                return new provider();
            }
        );
    }
}

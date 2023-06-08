/**
 * @kaizen_zone 293416f9-4e9e-486d-b60d-f7572b4ae0c9
 */
import { Confirmation, IConfirmationOptions } from 'Controls/popup';
import { IOptions as IProviderOptions } from './interface/IProvider';
import Remove from './Remove';
import * as rk from 'i18n!Controls';

/**
 * @interface Controls/_listCommands/RemoveWithConfirmation/IRemoveWithConfirmation
 * @extends Controls/_listCommands/interface/IProvider/IProviderOptions
 * @public
 */
export interface IOptions extends IProviderOptions {
    /**
     * @cfg {String} Сообщение в окне подтверждения при удалении одной записи.
     */
    removeSingleMessage?: string;
    /**
     * @cfg {String} Сообщение в окне подтверждения при удалении нескольких записей.
     */
    removeManyMessage?: string;
    /**
     * @cfg {Number} количество выбранных записей.
     */
    selectedKeysCount?: number;
}

const REMOVE_SINGLE = rk('Удалить текущую запись?', 'ОперацииНадЗаписями');
const REMOVE_MANY = rk('Удалить выбранные записи?', 'ОперацииНадЗаписями');
const NO_RECORDS = rk('Нет записей для обработки команды', 'ОперацииНадЗаписями');

/**
 * Действие "удаление записи с подтверждением"
 * @class Controls/_listCommands/RemoveWithConfirmation
 * @implements Controls/_listCommands/RemoveWithConfirmation/IRemoveWithConfirmation
 * @public
 */
export default class RemoveWithConfirmation extends Remove {
    execute(meta?: Partial<IOptions>): Promise<string | void> {
        const config: IOptions = {
            ...this._options,
            ...meta,
            ...this._options.providerOptions,
        };
        const confirmationConfig = RemoveWithConfirmation._getConfirmationConfig(config);
        return Confirmation.openPopup(confirmationConfig)
            .then((result) => {
                if (confirmationConfig.message === NO_RECORDS || !result) {
                    return Promise.reject();
                }
                return this._getProvider(config.providerName).then((provider) => {
                    return provider.execute(config);
                }) as Promise<string | void>;
            })
            .then(() => {
                return 'fullReload';
            });
    }

    private static _getConfirmationConfig(meta: IOptions): IConfirmationOptions {
        const selected = meta.selection?.selected;
        if (!meta.selectedKeysCount && selected?.[0] !== null) {
            meta.selectedKeysCount = selected?.length;
        }
        let config: IConfirmationOptions;
        if (meta.selectedKeysCount !== undefined && meta.selectedKeysCount < 1) {
            config = {
                type: 'ok',
                style: 'danger',
                message: NO_RECORDS,
            };
        } else {
            const removeSingle = meta.removeSingleMessage ?? REMOVE_SINGLE;
            const removeMany = meta.removeManyMessage ?? REMOVE_MANY;
            config = {
                type: 'yesno',
                style: 'default',
                message: meta.selectedKeysCount === 1 ? removeSingle : removeMany,
            };
        }
        return config;
    }
}

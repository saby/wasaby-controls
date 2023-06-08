/**
 * @kaizen_zone 47124c7e-27dc-43e5-a39f-fcc418c550f0
 */
import { ICommand } from '../interface/ICommand';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { CrudEntityKey } from 'Types/source';
import { IReloadItemOptions } from './IReloadItemOptions';

export type IReloadItemResult = Promise<RecordSet | Model>;

/**
 * Интерфейс параметров команды "Перезагрузить список"
 * @public
 */
export interface IReloadItemCommandOptions extends IReloadItemOptions {
    sourceController?: SourceController;
    /**
     * Ключ элемента для перезагрузки.
     */
    itemKey: CrudEntityKey;
}

/**
 * Команда "Перезагрузить элемент"
 * @class Controls/_listCommands/ReloadItem
 * @public
 */
export default class ReloadItem implements ICommand<IReloadItemCommandOptions, IReloadItemResult> {
    /**
     * @function Controls/_listCommands/ReloadItemCommand#execute
     * @param {IReloadItemCommandOptions} options парметры перезагрузки записи
     */
    execute(options: IReloadItemCommandOptions): IReloadItemResult {
        if (options.itemKey !== undefined) {
            return options.sourceController.reloadItem(options.itemKey, options);
        } else {
            throw new Error('ReloadItemCommand::В опции не передан ключ элемента для перезагрузки');
        }
    }
}

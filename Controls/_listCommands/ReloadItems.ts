/**
 * @kaizen_zone 47124c7e-27dc-43e5-a39f-fcc418c550f0
 */
import { ICommand } from './interface/ICommand';
import { RecordSet } from 'Types/collection';
import { NewSourceController as SourceController } from 'dataSource';
import { CrudEntityKey } from 'Types/source';
import { IReloadItemOptions } from './ReloadItem/IReloadItemOptions';
import { getReloadItemsHierarchy } from './ReloadItem/CommonFunctions';

export type IReloadItemsResult = Promise<RecordSet>;

/**
 * Интерфейс параметров команды "Перезагрузить элементы"
 * @public
 */
export interface IReloadItemsCommandOptions extends IReloadItemOptions {
    sourceController?: SourceController;
    /**
     * Ключи элементов для перезагрузки.
     */
    keys: CrudEntityKey[];
}

/**
 * Команда "Перезагрузить элементы"
 * @class Controls/_listCommands/ReloadItems
 * @public
 */
export default class ReloadItem
    implements ICommand<IReloadItemsCommandOptions, IReloadItemsResult>
{
    /**
     * @function Controls/_listCommands/ReloadItemCommand#execute
     * @param {IReloadItemCommandOptions} options парметры перезагрузки записи
     */
    execute(options: IReloadItemsCommandOptions): IReloadItemsResult {
        const filter = { ...options.filter };

        filter[options.parentProperty] = getReloadItemsHierarchy(options.keys, options);

        return options.sourceController.load(
            undefined,
            undefined,
            filter,
            true,
            null,
            options.keepNavigation
        ) as IReloadItemsResult;
    }
}

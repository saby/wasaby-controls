/**
 * @kaizen_zone 47124c7e-27dc-43e5-a39f-fcc418c550f0
 */
import { ICommand } from './interface/ICommand';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { NewSourceController as SourceController } from 'dataSource';
import { CrudEntityKey } from 'Types/source';
import { IReloadItemOptions } from './ReloadItem/IReloadItemOptions';
import { IFilterOptions } from 'Controls/interface';
import { applyReloadedNodes, getRootsForHierarchyReload } from './ReloadItem/CommonFunctions';

export type IReloadItemResult = Promise<RecordSet | Model>;

/**
 * Интерфейс параметров команды "Перезагрузить элемент"
 * @public
 */
export interface IReloadItemCommandOptions extends IReloadItemOptions, IFilterOptions {
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
     * @function Controls/_listCommands/ReloadItem#execute
     * @param {IReloadItemCommandOptions} options параметры перезагрузки записи
     */
    execute(options: IReloadItemCommandOptions): IReloadItemResult {
        if (options.itemKey !== undefined) {
            if (options.hierarchyReload) {
                const reloadFilter = { ...options.filter };
                reloadFilter[options.parentProperty] = getRootsForHierarchyReload(
                    options.itemKey,
                    options
                );
                return options.sourceController
                    .load(
                        undefined,
                        options.itemKey,
                        reloadFilter,
                        true,
                        null,
                        options.keepNavigation
                    )
                    .then((items: RecordSet) => {
                        applyReloadedNodes(options.itemKey, items, options);
                        return items;
                    });
            } else {
                return options.sourceController.reloadItem(options.itemKey, options);
            }
        } else {
            throw new Error('ReloadItemCommand::В опции не передан ключ элемента для перезагрузки');
        }
    }
}

/**
 * @kaizen_zone 293416f9-4e9e-486d-b60d-f7572b4ae0c9
 */
import type { ICrud, SbisService } from 'Types/source';
import { Logger } from 'UI/Utils';
import { ISelectionObject } from 'Controls/interface';
import { RootHistoryUtils } from 'Controls/Utils/RootHistoryUtils';
import IActionOptions from '../interface/IActionOptions';
import IProvider from '../interface/IProvider';
import { getItemsBySelection } from '../helpers/getItemsBySelection';

/**
 * Стандартный провайдер "удаления записей". Удаляет элементы из источника данных без подтверждения
 * @class Controls/_listCommands/Remove/Provider
 * @private
 */
export default class RemoveProvider implements IProvider<IActionOptions> {
    /**
     * Запускает провайдер действия
     * @param {Controls/_listCommands/interface/IActionOptions} meta Конфигурация провайдера действия.
     * @return {Promise<Void|String|Types/source:DataSet>} Результат выполнения действия
     */
    execute(meta: Partial<IActionOptions>): Promise<string> {
        const filter = meta.filter || {};
        const error: string = RemoveProvider._validateBeforeRemove(meta.source, meta.selection);
        if (error) {
            Logger.error(error);
            return Promise.reject(new Error(error));
        }

        return getItemsBySelection(meta.selection, meta.source, null, filter)
            .then((selectionItems) => {
                RootHistoryUtils.clearStoreAfterRemove(selectionItems, meta.rootHistoryId);
                return meta.source.destroy(selectionItems, meta.destroyMetaData);
            })
            .then((result: void) => {
                return result ?? 'fullReload';
            });
    }

    private static _validateBeforeRemove(
        source: ICrud | SbisService,
        selection: ISelectionObject
    ): string {
        let error;
        if (!source) {
            error = 'RemoveProvider: Source is not set';
        }
        if (!selection || (!selection.selected && !selection.excluded)) {
            error = 'RemoveProvider: Selection type must be Controls/interface:ISelectionObject';
        }
        return error;
    }
}

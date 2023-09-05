/**
 * @kaizen_zone 293416f9-4e9e-486d-b60d-f7572b4ae0c9
 */
import type { ICrud, SbisService } from 'Types/source';
import { Logger } from 'UI/Utils';
import { getItemsBySelection } from 'Controls/baseList';
import { ISelectionObject } from 'Controls/interface';
import IActionOptions from '../interface/IActionOptions';
import IProvider from '../interface/IProvider';

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

        //  не можем избавиться от getItemsBySelection по крайней мере до тех пор, пока не будет везде внедрён
        //  DeleteSelected https://online.sbis.ru/opendoc.html?guid=9ddef508-29e2-4acf-ac76-7afe03509c4c
        return getItemsBySelection(meta.selection, meta.source, null, filter)
            .then((selectionItems) => {
                return meta.source.destroy(selectionItems);
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

/**
 * @kaizen_zone 1ae44c37-18d9-4109-b22c-bd35470364aa
 */
import { Record } from 'Types/entity';
import {
    DataSet,
    SbisService,
    Query,
    QueryOrderSelector,
    ICrudPlus,
    CrudEntityKey,
    LOCAL_MOVE_POSITION,
} from 'Types/source';
import { Logger } from 'UI/Utils';
import { ISelectionObject } from 'Controls/interface';
import type { TFilterObject } from 'Controls/baseList';

import IActionOptions from '../interface/IActionOptions';
import IProvider from '../interface/IProvider';

/**
 * @interface Controls/_listCommands/Providers/Move/IMoveProvider
 * @public
 */
export interface IOptions extends IActionOptions {
    /**
     * @cfg {ICrudPlus|SbisService} Ресурс, в котором производится перемещение
     */
    source: ICrudPlus | SbisService;
    /**
     * @cfg {String} Имя поля, содержащего идентификатор родительского элемента.
     */
    parentProperty?: string;
    /**
     * @cfg {String} Имя поля, содержащего идентификатор элемента.
     */
    keyProperty?: string;
    /**
     * @cfg Array<{[columnName: string] Массив сортировок. Необходим при перемещении записей вверх/вниз
     */
    sorting?: QueryOrderSelector;
    /**
     * @cfg {Types/source:CrudEntityKey} Ключ записи, к которой происходит перемещение
     */
    targetKey?: CrudEntityKey;
    /**
     * @cfg {Types/source:LOCAL_MOVE_POSITION} Позиция, в которую происходит перемещение
     */
    position?: LOCAL_MOVE_POSITION;

    // Позволяет не использовать MoveToFolder, пока не все его добавили
    useDefaultMoveMethod?: boolean;
}

export interface IValidationResult {
    message: string;
    isError: boolean;
}

export const TARGET_UNDEFINED = 'Target key is undefined';

/**
 * Стандартный провайдер "перемещения записей".
 * Испоьзуется для выполнения команды перемещения в указанную папку или к указанному элементу
 * @public
 */
export default class MoveProvider implements IProvider<IOptions> {
    /**
     * Запускает провайдер действия
     * @param {Controls/_listCommands/Providers/Move/IMoveProvider} meta Конфигурация провайдера действия.
     * @return {Promise<Void|String|Types/source:DataSet>} Результат выполнения действия
     */
    execute(meta: Partial<IOptions>): Promise<void | DataSet> {
        const filter = meta.filter ?? {};
        const validationResult: IValidationResult = MoveProvider._validateBeforeMove(
            meta.source,
            meta.selection,
            filter,
            meta.targetKey,
            meta.position
        );
        if (validationResult.message !== undefined) {
            if (validationResult.isError) {
                Logger.error(validationResult.message);
                return Promise.reject(new Error(validationResult.message));
            }
            return Promise.reject();
        }
        /*
         * https://online.sbis.ru/opendoc.html?guid=2f35304f-4a67-45f4-a4f0-0c928890a6fc
         * При использовании ICrudPlus.move() мы не можем передать filter и folder_id, т.к. такой контракт
         * не соответствует стандартному контракту SbisService.move(). Поэтому здесь вызывается call
         */
        if (
            !meta.useDefaultMoveMethod &&
            (meta.source as SbisService).call &&
            meta.position === LOCAL_MOVE_POSITION.On
        ) {
            const source: SbisService = meta.source as SbisService;
            return new Promise((resolve, reject) => {
                import('Controls/Utils/selectionToRecord').then((module) => {
                    const sourceAdapter = source.getAdapter();
                    // В фильтр должен отправляться recursive=false, иначе по логике БЛ нужно выбирать папки рекурсивно
                    // вместе с вложенными файлами и всем им присваивать одного и того же родителя.
                    // Сейчас на БЛ прикладник и так принудительно ставит костыль recursive=false.
                    const callFilter = {
                        ...filter,
                        selection: module.default(meta.selection, sourceAdapter, 'all', false),
                    };
                    source
                        .call(source.getBinding().move, {
                            method: source.getBinding().list,
                            filter: Record.fromObject(callFilter, sourceAdapter),
                            folder_id: meta.targetKey,
                        })
                        .then((result: DataSet) => {
                            resolve(result);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                });
            });
        } else if (meta.useDefaultMoveMethod) {
            Logger.warn(
                'Для перемещения будет вызван метод по умолчанию. MoveToFolder не будет вызван.' +
                    'Подробнее https://wi.sbis.ru/doc/platform/developmentapl/service-development/' +
                    'service-contract/logic/list/hierarch/move-to-folder/',
                this
            );
        }
        const query = new Query().orderBy(meta.sorting);
        return meta.source.move([...meta.selection.selected], meta.targetKey, {
            position: meta.position,
            query,
            parentProperty: meta.parentProperty,
        });
    }

    /**
     * Перемещает элементы в ICrudPlus
     * @param {ICrudPlus|SbisService} source Ресурс данных
     * @param {Controls/interface:ISelectionObject} selection Элементы для перемещения.
     * @param {TFilterObject} filter дополнительный фильтр для перемещения в папку в SbisService.
     * @param {Types/source:ICrud#CrudEntityKey} targetKey Идентификатор целевой записи, относительно которой позиционируются перемещаемые.
     * @param position
     * @private
     */
    private static _validateBeforeMove(
        source: ICrudPlus | SbisService,
        selection: ISelectionObject,
        filter: TFilterObject,
        targetKey: CrudEntityKey,
        position: LOCAL_MOVE_POSITION
    ): IValidationResult {
        const result: IValidationResult = {
            message: undefined,
            isError: true,
        };
        if (!source) {
            result.message = 'MoveProvider: Source is not set';
        }
        if (!selection || (!selection.selected && !selection.excluded)) {
            result.message =
                'MoveProvider: Selection type must be Controls/interface:ISelectionObject';
        }
        if (typeof filter !== 'object') {
            result.message = 'MoveProvider: Filter must be plain object';
        }
        if (targetKey === undefined) {
            result.message = TARGET_UNDEFINED;
        }
        if (targetKey === null && position !== LOCAL_MOVE_POSITION.On) {
            result.message = null;
            result.isError = false;
        }
        if (
            position &&
            [LOCAL_MOVE_POSITION.On, LOCAL_MOVE_POSITION.After, LOCAL_MOVE_POSITION.Before].indexOf(
                position
            ) === -1
        ) {
            result.message =
                'MoveProvider: position must correspond with Types/source:LOCAL_MOVE_POSITION type';
        }
        return result;
    }
}

/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { Control } from 'UI/Base';
import { TKeysSelection } from 'Controls/interface';
import { IListActionAdditionalConfig } from 'Controls/baseList';

/**
 * Эти интерфейсы необходимы для совместимости до момента перехода на {@link Controls/list:IMovableList IMovableList} и {@link Controls/list:IMovableList IRemovableList}
 */

/**
 * @deprecated {@link Controls/listDeprecate:Mover Mover} will be removed soon. Use {@link Controls/list:IMovableList IMovableList} interface instead
 * @private
 */
export interface IMoveItemsParams {
    selectedKeys: TKeysSelection;
    excludedKeys: TKeysSelection;
    filter?: object;
}

/**
 * @deprecated {@link Controls/listDeprecate:Mover Mover} will be removed soon. Use {@link Controls/list:IMovableList IMovableList} interface instead
 */
export const BEFORE_ITEMS_MOVE_RESULT = {
    CUSTOM: 'Custom',
    MOVE_IN_ITEMS: 'MoveInItems',
};

/**
 * @deprecated {@link Controls/listDeprecate:Mover Mover} will be removed soon. Use {@link Controls/list:IMovableList IMovableList} interface instead
 * @private
 */
export interface IMover extends Control {
    moveItems(items: [] | IMoveItemsParams, target, position): Promise<any>;

    moveItemsWithDialog(
        items: [] | IMoveItemsParams,
        config: IListActionAdditionalConfig
    ): Promise<any>;

    moveItemDown(item: any): Promise<any>;

    moveItemUp(item: any): Promise<any>;
}

/**
 * @deprecated {@link Controls/listDeprecate:Remover Remover} will be removed soon. Use {@link Controls/list:IRemovableList IRemovableList} interface instead
 * @private
 */
export interface IRemover extends Control {
    removeItems(items: TKeysSelection): Promise<void>;
}

/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import * as rk from 'i18n!Controls';
import BaseAction from '../BaseAction';
import { IActionExecuteParams } from 'Controls/_actions/interface/IAction';
import { resetSelection } from 'Controls/_actions/callActionUtils';

/**
 * Действие "Перемещение записей"
 * @public
 * @extends Controls/_actions/BaseAction
 */
export default class Move extends BaseAction {
    execute(options: IActionExecuteParams): Promise<unknown> | void {
        const superResult = super.execute(options) as Promise<unknown>;
        return resetSelection(superResult, this._options.context, this._options.storeId);
    }
}

Object.assign(Move.prototype, {
    id: 'move',
    title: rk('В другой раздел'),
    icon: 'icon-Move',
    iconStyle: 'secondary',
    commandName: 'Controls/listCommands:MoveWithDialog',
    viewCommandName: 'Controls/viewCommands:PartialReload',
});

/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import * as rk from 'i18n!Controls';
import BaseAction from '../BaseAction';

/**
 * Действие "Перемещение записей"
 * @public
 * @extends Controls/_actions/BaseAction
 */
export default class Move extends BaseAction {}

Object.assign(Move.prototype, {
    id: 'move',
    title: rk('В другой раздел'),
    icon: 'icon-Move',
    iconStyle: 'secondary',
    commandName: 'Controls/listCommands:MoveWithDialog',
    viewCommandName: 'Controls/viewCommands:PartialReload',
});

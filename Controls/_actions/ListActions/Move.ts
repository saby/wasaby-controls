/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import * as rk from 'i18n!Controls';
import ListAction from './ListAction';

export default class Move extends ListAction {}

Object.assign(Move.prototype, {
    id: 'move',
    title: rk('Переместить'),
    icon: 'icon-Move',
    iconStyle: 'secondary',
    commandName: 'Controls/listCommands:MoveWithDialog',
    viewCommandName: 'Controls/viewCommands:PartialReload',
});

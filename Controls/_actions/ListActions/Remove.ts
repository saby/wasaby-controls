/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import * as rk from 'i18n!Controls';
import ListAction from './ListAction';

export default class Remove extends ListAction {}

Object.assign(Remove.prototype, {
    id: 'remove',
    title: rk('Удалить'),
    icon: 'icon-Erase',
    iconStyle: 'danger',
    commandName: 'Controls/listCommands:RemoveWithConfirmation',
    viewCommandName: 'Controls/viewCommands:PartialReload',
});

/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { IToolBarItem } from 'Controls/toolbars';
import { ICommandOptions } from 'Controls/listCommands';

export interface IAction extends IToolBarItem {
    order?: number;
    onExecuteHandler?: Function;
    actionName?: string;
    commandName?: string;
    commandOptions?: ICommandOptions;
    viewCommandName?: string;
    viewCommandOptions?: unknown;
    permissions?: string[];
    permissionsLevel?: number;
    requiredLevel?: string;
    visible?: boolean;
    prefetchResultId?: string;
}

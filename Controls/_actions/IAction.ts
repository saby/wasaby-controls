/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { IToolBarItem } from 'Controls/toolbars';
import { ICommandOptions } from 'Controls/listCommands';
import { IActionExecuteParams } from 'Controls/_actions/interface/IAction';

/**
 * Интерфейс действия
 * @interface Controls/_actions/IAction
 * @public
 */
export interface IAction extends IToolBarItem {
    order?: number;
    onExecuteHandler?: (params: IActionExecuteParams) => unknown;
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
    menuIcon?: string;
    menuIconStyle?: string;
}

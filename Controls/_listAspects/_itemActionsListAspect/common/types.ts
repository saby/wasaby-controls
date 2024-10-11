import { TKey } from 'Controls/interface';
import { Model } from 'Types/entity';

export interface IAction {
    id: string;
    parent: TKey;
    'parent@': boolean;
    actionName: string;
    commandName: string;
    commandOptions: string;
    viewCommandName: string;
    viewCommandOptions: string;
}

export type TItemActionVisibilityCallback = (
    action: IAction,
    item: Model,
    isEditing: boolean // not implemented yet
) => boolean;

export type TItemActionsMap = Map<TKey, IAction[]>;

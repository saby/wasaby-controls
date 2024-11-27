import { Memory, DataSet } from 'Types/source';
import { Permission } from 'Permission/access';
import type { IActionConfig } from 'Controls-Actions/actions';
import { loadAsync, isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

const ACTIONS_MODULE = 'Controls-Actions/actions';

export default class ActionsSource extends Memory {
    protected _actions: IActionConfig[];

    async query(): Promise<DataSet> {
        const actions: IActionConfig[] = await this._getActions();
        const permissionItems =
            this.data.filter((item) => {
                if (item.node) {
                    return this.data.some(({ parent }) => parent === item[this.getKeyProperty()]);
                }
                const actionConfig = actions.find(({ type }) => type === item.action?.id);
                return (
                    !actionConfig?.rights ||
                    Permission.get(actionConfig.rights).every((permissionItem) =>
                        permissionItem.isModify()
                    )
                );
            }) || [];
        return Promise.resolve(
            new DataSet({
                keyProperty: this.getKeyProperty(),
                rawData: permissionItems,
            })
        );
    }

    private async _getActions(): Promise<IActionConfig[]> {
        if (isLoaded(ACTIONS_MODULE)) {
            return loadSync(ACTIONS_MODULE);
        }
        return loadAsync('Controls-Actions/actions');
    }
}

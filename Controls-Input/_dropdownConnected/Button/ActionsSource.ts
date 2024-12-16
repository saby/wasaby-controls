import { Memory, DataSet } from 'Types/source';
import { Permission } from 'Permission/access';
import type { IActionConfig } from 'Controls-Actions/actions';
import { loadAsync, isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { TKey } from 'Controls/interface';
import { OptionsToPropertyMixin } from 'Types/entity';

const ACTIONS_MODULE = 'Controls-Actions/actions';

interface IActionSource {
    data?: IActionConfig[];
    dataFactory?: string;
    keyProperty: TKey;
    parentId?: string;
    actionKeyProperty?: string;
}

export default class ActionsSource extends Memory {
    protected _$dataFactory: string = null;
    protected _$parentId: string = null;
    protected _$actionKeyProperty: string = null;

    constructor(options: IActionSource) {
        super(options);
        OptionsToPropertyMixin.initMixin(this, options);
    }
    async query(): Promise<DataSet> {
        const actions: IActionConfig[] = await this._getActions();
        let items;
        if (this.data) {
            const permissionItems =
                this.data.filter((item) => {
                    if (item.node && !item.action) {
                        return this.data.some(
                            ({ parent }) => parent === item[this.getKeyProperty()]
                        );
                    }
                    const actionConfig = actions.find(({ type }) => type === item.action?.id);
                    return (
                        !actionConfig?.rights ||
                        Permission.get(actionConfig.rights).every((permissionItem) =>
                            permissionItem.isModify()
                        )
                    );
                }) || [];
            items = permissionItems.map((item) => {
                if (item.actionSubMenu) {
                    item.node = true;
                }
                return item;
            });
        } else if (this._$dataFactory) {
            items = await this._getItemsFromFactory(actions);
        }
        return Promise.resolve(
            new DataSet({
                keyProperty: this.getKeyProperty(),
                rawData: items,
            })
        );
    }

    private async _getItemsFromFactory(actions: IActionConfig[]): Promise<IActionConfig[]> {
        const factoryConfig = await loadAsync(this._$dataFactory);
        const factoryLoadResults =
            !!factoryConfig && (await Loader.load({ dataFactoryConfig: factoryConfig }));
        const actionConfig = actions.find(({ type }) => type === this._$parentId);
        return factoryLoadResults?.dataFactoryConfig.items?.map((item) => {
            return this._getItemData(item, actionConfig);
        });
    }

    private _getItemData(item: IActionConfig, actionConfig: IActionConfig): IActionConfig {
        return {
            ...item,
            title: item.name,
            action: {
                actionProps: {
                    ...actionConfig.commandOptions,
                    [this._$actionKeyProperty]: item[this.getKeyProperty()],
                },
                id: this._$parentId,
            },
        };
    }

    private async _getActions(): Promise<IActionConfig[]> {
        if (isLoaded(ACTIONS_MODULE)) {
            return loadSync(ACTIONS_MODULE);
        }
        return loadAsync('Controls-Actions/actions');
    }
}

import { Memory, DataSet } from 'Types/source';
import { Permission } from 'Permission/access';
import type { IActionConfig } from 'Controls-Actions/actions';
import { loadAsync, isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { clone } from 'Types/object';

const ACTIONS_MODULE = 'Controls-Actions/actions';

export default class ActionsSource extends Memory {
    async query(): Promise<DataSet> {
        const actions: IActionConfig[] = await this._getActions();
        const permissionItems =
            this.data.filter((item) => {
                if (item.node && !item.action) {
                    return this.data.some(({ parent }) => parent === item[this.getKeyProperty()]);
                }
                const actionConfig = actions.find(({ type }) => type === item.action?.id);
                const rights = actionConfig?.rights?.map((right) => right.zone || right);
                return (
                    !actionConfig?.rights ||
                    Permission.get(rights).every((permissionItem) => permissionItem.isModify())
                );
            }) || [];
        permissionItems.map((item) => {
            if (item.actionSubMenu) {
                item.node = true;
            }
            return item;
        });
        return Promise.resolve(
            new DataSet({
                keyProperty: this.getKeyProperty(),
                rawData: await this._getItemsFromFactory(clone(permissionItems), actions),
            })
        );
    }

    private async _getItemsFromFactory(
        items: IActionConfig[],
        actions: IActionConfig
    ): Promise<IActionConfig[]> {
        const actionItemsLen = items.filter((item) => !!item.action).length;
        for (let i = 0; i < items.length; i++) {
            const itemActionProps = items[i].action?.actionProps;
            if (itemActionProps?.dataFactory) {
                const factoryConfig = await loadAsync(itemActionProps?.dataFactory);
                const factoryLoadResults =
                    !!factoryConfig && (await Loader.load({ dataFactoryConfig: factoryConfig }));
                const loadedItems = factoryLoadResults?.dataFactoryConfig?.items;
                if (factoryLoadResults && loadedItems.length) {
                    const parentItem = items[i];
                    let showParent = true;
                    parentItem.node = true;
                    itemActionProps.dataFactory = null;
                    const actionValueProperties = this._getActionValueProperties(
                        parentItem,
                        actions
                    );
                    if (actionItemsLen === 1 && items[i]) {
                        items.splice(i, 1);
                        showParent = false;
                    }
                    loadedItems?.forEach((item) => {
                        items.push(
                            this._getItemData(item, parentItem, showParent, actionValueProperties)
                        );
                    });
                }
            }
        }
        return items;
    }

    private _getItemData(
        item: IActionConfig,
        parentItem: IActionConfig,
        showParent: boolean,
        actionValueProperties: string[]
    ): IActionConfig {
        const parentAction = parentItem?.action;
        const itemData = {
            ...item,
            title: item.name || item.title,
            parent: showParent ? item.parent || parentItem[this.getKeyProperty()] : null,
            node: item.node || item['@parent'],
            action: {
                ...parentAction,
                actionProps: {
                    ...parentAction.actionProps,
                },
                id: parentAction.id,
            },
        };
        actionValueProperties?.forEach((valueProp) => {
            itemData.action.actionProps[valueProp] = item[valueProp];
        });
        return itemData;
    }

    private _getActionValueProperties(item: IActionConfig, actions: IActionConfig[]) {
        const actionConfigPropTypes = actions.find(({ type }) => type === item.action?.id)
            ?.propTypes;
        if (actionConfigPropTypes) {
            return actionConfigPropTypes.map((action) => action.name);
        }
        return [];
    }

    private async _getActions(): Promise<IActionConfig[]> {
        if (isLoaded(ACTIONS_MODULE)) {
            return loadSync(ACTIONS_MODULE);
        }
        return loadAsync('Controls-Actions/actions');
    }
}

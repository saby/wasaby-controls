import { Memory, DataSet } from 'Types/source';
import { Permission } from 'Permission/access';
import type { IActionConfig } from 'Controls-Actions/actions';
import { loadAsync, isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { clone, isEqual } from 'Types/object';

const ACTIONS_MODULE = 'Controls-Actions/actions';

function minActionProps<T = Record<string, unknown>>(actionProps: T): T & { icon: ''; title: '' } {
    return {
        ...actionProps,
        icon: '',
        title: '',
    };
}

export default class ActionsSource extends Memory {
    async query(): Promise<DataSet> {
        const actions: IActionConfig[] = await this._getActions();
        const dataActions = new Map();

        function setToMap({
            id,
            actionProps,
        }: {
            id: string;
            actionProps: Record<string, unknown>;
        }) {
            dataActions.set(id, minActionProps(actionProps));
        }

        const permissionItems =
            this.data.filter((item) => {
                let allowByParent = true;
                let allowByRights = true;
                let isNotDouble = true;
                if (item.node && !item.action) {
                    allowByParent = this.data.some(
                        ({ parent }) => parent === item[this.getKeyProperty()]
                    );
                }

                const actionConfig = actions.find(({ type }) => type === item.action?.id);
                if (allowByParent && actionConfig?.rights) {
                    const rights = actionConfig?.rights?.map((right) => right.zone || right);
                    allowByRights = Permission.get(rights).every((permissionItem) =>
                        permissionItem.isModify()
                    );
                }

                const sameAction = dataActions.get(item.action?.id);

                if (sameAction && allowByRights && allowByParent) {
                    isNotDouble = !isEqual(
                        minActionProps(item.action.actionProps),
                        dataActions.get(item.action?.id)
                    );
                }

                if (item.action?.id !== undefined) {
                    setToMap(item.action);
                }

                return allowByParent && allowByRights && isNotDouble;
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

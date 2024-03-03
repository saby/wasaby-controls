import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { View as ListView } from 'Controls/list';
import { View as Panel } from 'Controls-ListEnv/operationsPanelConnected';
import { IItemAction } from 'Controls/interface';
import { Model } from 'Types/entity';
import { IListDataFactoryArguments, IDataConfig } from 'Controls/dataFactory';
import { HotKeysContainer } from 'Controls/list';

interface IProps extends TInternalProps {}

function Demo(props: IProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const listRef = React.useRef<ListView>(null);
    const onActionClick = React.useCallback(
        (action: IItemAction, item: Model, container: HTMLDivElement, nativeEvent: MouseEvent) => {
            if (action.id === 'delete' && listRef?.current) {
                listRef.current.removeItemsWithConfirmation(
                    { selected: [item.getKey()], excluded: [] },
                    {
                        target: nativeEvent.target,
                    }
                );
            }
        },
        [listRef]
    );

    return (
        <div ref={ref}>
            <Panel storeId="RemoveWithListActions" />
            <HotKeysContainer>
                <ListView
                    storeId="RemoveWithListActions"
                    itemActionsProperty="itemActions"
                    onActionClick={onActionClick}
                    ref={listRef}
                />
            </HotKeysContainer>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            RemoveWithListActions: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: [
                            {
                                key: '0',
                                title: 'Удаляется при помощи действия в listActions',
                                itemActions: [],
                            },
                            {
                                key: '1',
                                title: 'Удаляется при помощи действия в itemActions',
                                itemActions: [
                                    {
                                        id: 'delete',
                                        icon: 'icon-Erase',
                                        iconStyle: 'danger',
                                        title: 'Удалить',
                                    },
                                ],
                            },
                        ],
                    }),
                    multiSelectVisibility: 'visible',
                    selectedKeys: [],
                    keyProperty: 'key',
                    listActions: 'Controls-ListEnv-demo/ListActions/listActions',
                },
            },
        };
    },
});

import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

import 'Controls/gridReact';
import { Text as TextInput } from 'Controls/input';
import { IColumnConfig, MoneyTypeRender, NumberTypeRender, useItemData } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { IEditingConfig } from 'Controls/display';

import { getItemsWithNumbers } from 'Controls-demo/gridReact/resources/Data';
import { getMoreActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { TInternalProps } from 'UICore/Executor';
import { TKey } from 'Controls/interface';

function CustomRender(props: { property: string }): React.ReactElement {
    const { item } = useItemData<Model>();

    let decorator;
    switch (props.property) {
        case 'population':
            decorator = (
                <NumberTypeRender
                    value={item.get(props.property) || 0}
                    tooltip={item.get(props.property)}
                    textOverflow={'none'}
                    className={''}
                />
            );
            break;
        case 'averageIncome':
            decorator = (
                <MoneyTypeRender
                    value={item.get(props.property) || 0}
                    tooltip={item.get(props.property)}
                    textOverflow={'none'}
                    className={''}
                />
            );
            break;
        default:
            decorator = <>{item.get(props.property)}</>;
    }

    return decorator;
}

function EditCell(props: { property: string }) {
    const property = props.property;

    const { item, renderValues } = useItemData<Model>([property]);
    const onValueChanged = React.useCallback(
        (_, value) => {
            return item.set(property, value);
        },
        [item]
    );

    return (
        <TextInput
            value={String(renderValues[property])}
            className={'tw-w-full'}
            contrastBackground
            onValueChanged={onValueChanged}
        />
    );
}

function getColumns(): IColumnConfig[] {
    return [
        {
            key: 0,
            displayProperty: 'number',
            width: '50px',
        },
        {
            key: 1,
            displayProperty: 'country',
            render: <CustomRender property={'country'} />,
            editorRender: <EditCell property={'country'} />,
            getCellProps: (item) => {
                return {
                    editable: true,
                };
            },
        },
        {
            key: 2,
            displayProperty: 'population',
            render: <CustomRender property={'population'} />,
            editorRender: <EditCell property={'population'} />,
            getCellProps: (item) => {
                return {
                    editable: true,
                };
            },
        },
        {
            key: 3,
            displayProperty: 'averageIncome',
            render: <CustomRender property={'averageIncome'} />,
            editorRender: <EditCell property={'averageIncome'} />,
            getCellProps: (item) => {
                return {
                    editable: true,
                };
            },
        },
        {
            key: 4,
            displayProperty: 'population',
            render: <CustomRender property={'population'} />,
            getCellProps: (item) => {
                return {
                    editable: false,
                };
            },
        },
        {
            key: 5,
            displayProperty: 'averageIncome',
            render: <CustomRender property={'averageIncome'} />,
            getCellProps: (item) => {
                return {
                    editable: false,
                };
            },
        },
    ];
}

const ACTIONS = getMoreActions();

export default React.forwardRef(
    (_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) => {
        const items = React.useMemo<RecordSet>(() => {
            return getItemsWithNumbers();
        }, []);

        const columns = React.useMemo<IColumnConfig[]>(() => {
            return getColumns();
        }, []);

        const editingConfig = React.useMemo<IEditingConfig>(() => {
            return {
                editOnClick: true,
                mode: 'row',
                inputBackgroundVisibility: 'hidden',
                inputBorderVisibility: true,
                toolbarVisibility: true,
            };
        }, []);

        return (
            <div ref={ref}>
                <GridItemsView
                    items={items}
                    columns={columns}
                    editingConfig={editingConfig}
                    itemActions={ACTIONS}
                    itemActionsVisibility={'onhover'}
                    itemActionsPosition={'custom'}
                />
            </div>
        );
    }
);

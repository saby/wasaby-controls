import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

import 'Controls/gridReact';
import { Text as TextInput } from 'Controls/input';
import { IColumnConfig, useItemData } from 'Controls/gridReact';
import { EditArrowComponent } from 'Controls/grid';
import { ItemsView as TreeGridItemsView } from 'Controls/treeGrid';
import { IEditingConfig } from 'Controls/display';
import { TItemActionShowType, TOverflow, IAction } from 'Controls/interface';
import { ActionsConnectedComponent } from 'Controls/baseList';

import { getBaseRecordSet } from './Data';

const ACTIONS: IAction[] = [
    {
        id: 10,
        icon: 'icon-Erase icon-error',
        title: 'delete pls',
        showType: TItemActionShowType.TOOLBAR,
    },
    {
        id: 13,
        icon: 'icon-Motion',
        title: 'motion',
        showType: TItemActionShowType.TOOLBAR,
    },
];

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

function CustomEditArrowPositionCell(props: {
    displayProperty?: string | number;
    textOverflow?: TOverflow;
    hoverBackgroundStyle?: string;
}) {
    const { renderValues } = useItemData([props.displayProperty, 'group', 'type']);
    const value = renderValues[props.displayProperty];
    const editArrowComponent = renderValues.type && (
        <EditArrowComponent backgroundStyle={props.hoverBackgroundStyle} />
    );
    const actionsComponent = renderValues.type && (
        <ActionsConnectedComponent hoverBackgroundStyle={props.hoverBackgroundStyle} />
    );
    return (
        <div style={{ display: 'inline-flex', width: '100%' }}>
            <div
                style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: props.textOverflow,
                }}
            >
                <div>{value}</div>
                <div style={{ fontSize: '11px', color: 'grey' }}>{renderValues.group}</div>
            </div>
            {editArrowComponent}
            {actionsComponent}
        </div>
    );
}

function getColumns(props: {
    editingMode?: string;
    customPosition?: boolean;
    textOverflow?: TOverflow;
    hoverBackgroundStyle?: string;
}): IColumnConfig[] {
    const hoverBackgroundStyle =
        props.editingMode === 'cell' && props.hoverBackgroundStyle === 'default'
            ? 'list_singleCellNotEditable'
            : props.hoverBackgroundStyle;
    const columns: IColumnConfig[] = [
        {
            key: 1,
            displayProperty: 'title',
            getCellProps: (item) => {
                return {
                    textOverflow: props.textOverflow,
                    editable: false,
                    hoverBackgroundStyle,
                };
            },
        },
        {
            key: 2,
            displayProperty: 'country',
            editorRender: <EditCell property={'country'} />,
            getCellProps: (item) => {
                return {
                    hoverBackgroundStyle,
                };
            },
        },
    ];
    if (props.customPosition) {
        columns[0].render = (
            <CustomEditArrowPositionCell
                displayProperty={'title'}
                textOverflow={props.textOverflow}
                hoverBackgroundStyle={hoverBackgroundStyle}
            />
        );
    }
    return [...columns];
}

interface IProps {
    editingMode?: 'row' | 'cell';
    customPosition?: string;
    textOverflow?: TOverflow;
    hoverBackgroundStyle?: string;
}

function Demo(props: IProps, ref: React.ForwardedRef<HTMLDivElement>) {
    // region INIT

    const items = React.useMemo<RecordSet>(() => {
        return getBaseRecordSet();
    }, []);

    const [editingMode, setEditingMode] = React.useState(props.editingMode);
    const [customPosition, setCustomPosition] = React.useState(props.customPosition !== 'default');
    const [textOverflow, setTextOverflow] = React.useState(props.textOverflow);
    const [hoverBackgroundStyle, setHoverBackgroundStyle] = React.useState(
        props.hoverBackgroundStyle
    );

    const columns = React.useMemo<IColumnConfig[]>(() => {
        return getColumns({
            editingMode,
            customPosition,
            textOverflow,
            hoverBackgroundStyle,
        });
    }, [editingMode, customPosition, textOverflow, hoverBackgroundStyle]);

    const editingConfig = React.useMemo<IEditingConfig>(() => {
        return {
            editOnClick: true,
            mode: editingMode,
            inputBackgroundVisibility: 'hidden',
            inputBorderVisibility: 'hidden',
        };
    }, [editingMode]);

    const [eventResult, setEventResult] = React.useState<string>(null);

    const editArrowVisibilityCallback = React.useCallback((item: Model) => {
        return !item.get('isNumberEditable');
    }, []);

    // endregion INIT

    // region HANDLERS

    const onEditArrowClick = React.useCallback((item: Model) => {
        setEventResult(item.getKey());
    }, []);

    // endregion HANDLERS

    return (
        <div ref={ref}>
            <label>
                Editing mode:&nbsp;
                <select
                    data-qa={'mode-selector'}
                    value={editingMode}
                    onChange={(event) => {
                        setEditingMode(event.target.value);
                        if (event.target.value === 'cell') {
                            setCustomPosition(true);
                            setHoverBackgroundStyle('default');
                        }
                    }}
                >
                    <option value={'row'} label={'row'} />
                    <option value={'cell'} label={'cell'} />
                </select>
            </label>
            <label>
                editArrow position:&nbsp;
                <select
                    data-qa={'position-selector'}
                    value={customPosition ? 'true' : 'false'}
                    onChange={(event) => {
                        setCustomPosition(event.target.value === 'true');
                        if (event.target.value === 'false') {
                            setEditingMode('row');
                        }
                    }}
                >
                    <option value={'false'} label={'default'} />
                    <option value={'true'} label={'custom'} />
                </select>
            </label>
            <label>
                overflow:&nbsp;
                <select
                    data-qa={'overflow-selector'}
                    value={textOverflow}
                    onChange={(event) => {
                        return setTextOverflow(event.target.value as TOverflow);
                    }}
                >
                    <option value={'none'} label={'none'} />
                    <option value={'ellipsis'} label={'ellipsis'} />
                </select>
            </label>
            <label>
                row hover:&nbsp;
                <select
                    data-qa={'hover-background-selector'}
                    value={hoverBackgroundStyle}
                    onChange={(event) => {
                        setHoverBackgroundStyle(event.target.value);
                        if (event.target.value !== 'default') {
                            setEditingMode('row');
                        }
                    }}
                >
                    <option value={'default'} label={'default'} />
                    <option value={'success'} label={'success'} />
                    <option value={'danger'} label={'danger'} />
                    <option value={'transparent'} label={'transparent'} />
                </select>
            </label>

            <TreeGridItemsView
                items={items}
                columns={columns}
                editingConfig={editingConfig}
                root={null}
                keyProperty={'key'}
                nodeProperty={'type'}
                parentProperty={'parent'}
                itemActions={ACTIONS}
                itemActionsVisibility={'onhover'}
                itemActionsPosition={customPosition ? 'custom' : 'inside'}
                showEditArrow={true}
                onEditArrowClick={onEditArrowClick}
                editArrowVisibilityCallback={editArrowVisibilityCallback}
                customEvents={['onEditArrowClick']}
            />
            <div className={'controlsDemo-logger'}>
                {eventResult !== null && (
                    <div data-qa={'indicator-clicked-on'}>
                        Кликнули по стрелке на записи с ключом {eventResult}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    defaultProps: {
        editingMode: 'row',
        customPosition: 'default',
        textOverflow: 'none',
        hoverBackgroundStyle: 'default',
    },
});

import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

import 'Controls/gridReact';
import { Text as TextInput } from 'Controls/input';
import { IColumnConfig, useItemData } from 'Controls/gridReact';
import { EditArrowComponent } from 'Controls/grid';
import { ItemsView as TreeGridItemsView } from 'Controls/treeGrid';
import { IEditingConfig } from 'Controls/display';

import { getBaseRecordSet } from './Data';
import { TOverflow } from 'Controls/interface';

function EditCell(props: { property: string }) {
    const property = props.property;

    const { item, renderValues } = useItemData<Model>([property]);
    const onValueChanged = React.useCallback(
        (value) => {
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
            customEvents={['onValueChanged']}
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
        </div>
    );
}

function getColumns(
    customPosition?: string,
    textOverflow?: TOverflow,
    hoverBackgroundStyle?: string
): IColumnConfig[] {
    const columns: IColumnConfig[] = [
        {
            key: 1,
            displayProperty: 'title',
            getCellProps: (item) => {
                return {
                    textOverflow,
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
    if (customPosition === 'custom') {
        columns[0].render = (
            <CustomEditArrowPositionCell
                displayProperty={'title'}
                textOverflow={textOverflow}
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

export default React.forwardRef((props: IProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    // region INIT

    const items = React.useMemo<RecordSet>(() => {
        return getBaseRecordSet();
    }, []);

    const [editingMode, setEditingMode] = React.useState(props.editingMode);
    const [customPosition, setCustomPosition] = React.useState(props.customPosition);
    const [textOverflow, setTextOverflow] = React.useState(props.textOverflow);
    const [hoverBackgroundStyle, setHoverBackgroundStyle] = React.useState(
        props.hoverBackgroundStyle
    );

    const columns = React.useMemo<IColumnConfig[]>(() => {
        return getColumns(customPosition, textOverflow, hoverBackgroundStyle);
    }, [customPosition, textOverflow, hoverBackgroundStyle]);

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
            <select
                data-qa={'mode-selector'}
                value={editingMode}
                onChange={(event) => {
                    return setEditingMode(event.target.value);
                }}
            >
                <option hidden selected label={'select mode'} />
                <option value={'row'} label={'row'} />
                <option value={'cell'} label={'cell'} />
            </select>
            <select
                data-qa={'position-selector'}
                value={customPosition}
                onChange={(event) => {
                    return setCustomPosition(event.target.value);
                }}
            >
                <option hidden selected label={'Select editArrow position'} />
                <option value={'default'} label={'default'} />
                <option value={'custom'} label={'custom'} />
            </select>
            <select
                data-qa={'overflow-selector'}
                value={textOverflow}
                onChange={(event) => {
                    return setTextOverflow(event.target.value as TOverflow);
                }}
            >
                <option hidden selected label={'Select overflow'} />
                <option value={'none'} label={'none'} />
                <option value={'ellipsis'} label={'ellipsis'} />
            </select>
            <select
                data-qa={'hover-background-selector'}
                value={hoverBackgroundStyle}
                onChange={(event) => {
                    return setHoverBackgroundStyle(event.target.value);
                }}
            >
                <option hidden selected label={'Select hover'} />
                <option value={'default'} label={'default'} />
                <option value={'success'} label={'success'} />
                <option value={'danger'} label={'danger'} />
                <option value={'transparent'} label={'transparent'} />
            </select>

            <TreeGridItemsView
                items={items}
                columns={columns}
                editingConfig={editingConfig}
                root={null}
                keyProperty={'key'}
                nodeProperty={'type'}
                parentProperty={'parent'}
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
});

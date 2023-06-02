import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

import 'Controls/gridReact';
import { Text as TextInput } from 'Controls/input';
import { IColumnConfig, useRenderData } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { IEditingConfig } from 'Controls/display';

import { getItems } from 'Controls-demo/gridReact/resources/Data';


function EditCell(props: { property: string }) {
    const property = props.property;

    const { item, renderValues } = useRenderData<Model>([property]);
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

function getColumns(): IColumnConfig[] {
    return [
        {
            key: 0,
            displayProperty: 'number',
            width: '50px',
            editorRender: <EditCell property={'number'} />,
            getCellProps: (item) => {
                return {
                    editable: item.get('isNumberEditable'),
                };
            },
        },
        {
            key: 1,
            displayProperty: 'country',
            editorRender: <EditCell property={'country'} />,
        },
        {
            key: 2,
            displayProperty: 'capital',
            editorRender: <EditCell property={'capital'} />,
        },
    ];
}

interface IProps {
    editingMode?: 'row' | 'cell';
    inputBackgroundVisibility?: 'visible' | 'onhover' | 'hidden';
    inputBorderVisibility?: 'partial' | 'hidden';
}

export default React.forwardRef(
    (props: IProps, ref: React.ForwardedRef<HTMLDivElement>) => {
        const items = React.useMemo<RecordSet>(() => {
            return getItems();
        }, []);
        const columns = React.useMemo<IColumnConfig[]>(() => {
            return getColumns();
        }, []);

        const [editingMode, setEditingMode] = React.useState(props.editingMode);
        const [inputBackgroundVisibility, setInputBackgroundVisibility] =
            React.useState(props.inputBackgroundVisibility);
        const [inputBorderVisibility, setInputBorderVisibility] =
            React.useState(props.inputBorderVisibility);

        const editingConfig = React.useMemo<IEditingConfig>(() => {
            return {
                editOnClick: true,
                mode: editingMode,
                inputBackgroundVisibility,
                inputBorderVisibility,
            };
        }, [editingMode, inputBackgroundVisibility, inputBorderVisibility]);

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
                    data-qa={'input-background-visibility-selector'}
                    value={inputBackgroundVisibility}
                    onChange={(event) => {
                        return setInputBackgroundVisibility(event.target.value);
                    }}
                >
                    <option
                        hidden
                        selected
                        label={'select inputBackgroundVisibility'}
                    />
                    <option value={'visible'} label={'visible'} />
                    <option value={'onhover'} label={'onhover'} />
                    <option value={'hidden'} label={'hidden'} />
                </select>
                <select
                    data-qa={'input-border-visibility-selector'}
                    value={inputBorderVisibility}
                    onChange={(event) => {
                        return setInputBorderVisibility(event.target.value);
                    }}
                >
                    <option
                        hidden
                        selected
                        label={'select inputBorderVisibility'}
                    />
                    <option value={'partial'} label={'partial'} />
                    <option value={'hidden'} label={'hidden'} />
                </select>

                <GridItemsView
                    items={items}
                    columns={columns}
                    editingConfig={editingConfig}
                />
            </div>
        );
    }
);

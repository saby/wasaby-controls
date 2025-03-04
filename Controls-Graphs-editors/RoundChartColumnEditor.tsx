import { useMemo, Fragment, memo, useContext } from 'react';
import { DataSetBindingFacade } from 'Frame/base';
import { useBindingFacadeFromEditor } from 'Controls-editors/hooks';
import { Selector } from 'Controls/dropdown';
import { useDataSetColumns } from './_LinearChartColumnEditor/useDataSetColumns';
import { ICustomDataSetField } from './RoundChartSeriesEditor';
import { ObjectTypeEditorValueContext } from 'Controls-editors/object-type';
import 'css!Controls-Graphs-editors/LinearChartColumnEditor';
import * as translate from 'i18n!Controls-Graphs-editors';

interface IRoundChartEditorProps {
    connectedPropName: string;
    LayoutComponent: unknown;
    onChange: Function;
    value: unknown[];
}

interface IField {
    name: string;
}

export const RoundChartColumnEditor = memo((props: IRoundChartEditorProps) => {
    const { connectedPropName, LayoutComponent = Fragment } = props;

    const [bindingFacade, setBindingFacade] =
        useBindingFacadeFromEditor<DataSetBindingFacade>(connectedPropName);

    const editorContext = useContext(ObjectTypeEditorValueContext);

    const [columnsRS] = useDataSetColumns(bindingFacade);

    const onValueChanged = (newSelectedKeys: string[]) => {
        const newDisplayProperty = newSelectedKeys?.[0]?.split?.('.')?.[1]
            ? newSelectedKeys[0].split('.')[1]
            : newSelectedKeys[0];
        const fields = newSelectedKeys.map((name) => {
            return {
                name,
                type: 'displayProperty',
                value: newDisplayProperty,
            };
        });
        const oldFields = bindingFacade.getFields() || [];
        const valuePropertyFields = oldFields.filter(
            (item: ICustomDataSetField) => item.type === 'valueProperty'
        );
        const newFields = [...fields, ...valuePropertyFields];
        const bindingFacadeClone = bindingFacade?.clone();
        bindingFacadeClone?.setFields(newFields);
        if (!!editorContext.series.length) {
            props.onChange(
                {
                    ...editorContext,
                    fields: newFields,
                    series: [
                        {
                            ...editorContext.series[0],
                            displayProperty: newDisplayProperty,
                        },
                    ],
                },
                {
                    multiple: true,
                }
            );
        } else {
            props.onChange(fields);
        }
        setBindingFacade(bindingFacadeClone);
    };

    const selectedKeys = useMemo(() => {
        if (props.value && Array.isArray(props.value)) {
            return (props.value as IField[]).map((field) => field.name);
        }
        if (!bindingFacade || !(bindingFacade instanceof DataSetBindingFacade)) {
            return [];
        }
        const frameFields = bindingFacade.getFields() || [];
        return frameFields.map((field) => {
            return field.name;
        });
    }, [bindingFacade, setBindingFacade, props.value]);

    if (!columnsRS) {
        return null;
    }

    return (
        // @ts-expect-error JSX
        <LayoutComponent>
            <Selector
                onSelectedKeysChanged={onValueChanged}
                selectedKeys={selectedKeys}
                items={columnsRS}
                buildByItems={true}
                emptyText={translate('Выберите измерение')}
                keyProperty="Id"
                displayProperty="Title"
                className="controlsGraphsEditors__columnEditor"
            />
        </LayoutComponent>
    );
});

RoundChartColumnEditor.displayName =
    'Controls-Graphs-editors/RoundChartColumnEditor:RoundChartColumnEditor';

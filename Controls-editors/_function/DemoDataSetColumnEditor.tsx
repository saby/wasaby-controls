import * as React from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/_propertyGrid/IPropertyGrid';
import { useBindingFacadeFromEditor } from 'Controls-editors/properties';
import { useDataSetColumns } from './_demoSetColumnEditor/useDataSetColumns';
import { DataSetBindingFacade } from 'Frame/base';
import { Control as CheckboxGroupControl } from 'Controls/CheckboxGroup';

/**
 * @public
 */
interface IDataSetColumnEditorProps extends IPropertyGridPropertyEditorProps<unknown> {
    /**
     * Имя поля в мета-типе, на которое назначен редактор привязок
     */
    connectedPropName: string;
}

/**
 * Редактор колонок выборки
 * @param props
 * @constructor
 */
function DemoDataSetColumnEditor(props: IDataSetColumnEditorProps) {
    const { LayoutComponent = React.Fragment } = props;

    const [bindingFacade, setBindingFacade] = useBindingFacadeFromEditor<DataSetBindingFacade>(
        props?.connectedPropName
    );

    const [columnsRS] = useDataSetColumns(bindingFacade);

    const onValueChanged = React.useCallback(
        (selectedKeys: string[]) => {
            const fields = selectedKeys.map((name) => {
                return {
                    name,
                };
            });

            bindingFacade?.setFields(fields);

            setBindingFacade(bindingFacade);
        },
        [bindingFacade, setBindingFacade]
    );

    const selectedKeys = React.useMemo(() => {
        if (!bindingFacade || !(bindingFacade instanceof DataSetBindingFacade)) {
            return [];
        }
        const frameFields = bindingFacade.getFields() || [];
        return frameFields.map((field) => {
            return field.name;
        });
    }, [bindingFacade]);

    if (!columnsRS) {
        return null;
    }

    return (
        <LayoutComponent>
            <CheckboxGroupControl
                selectedKeys={selectedKeys}
                onSelectedKeysChanged={onValueChanged}
                items={columnsRS}
                keyProperty={'Id'}
                displayProperty={'Title'}
            />
        </LayoutComponent>
    );
}

export { DemoDataSetColumnEditor };

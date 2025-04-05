import { useMemo, Fragment, memo, useEffect } from 'react';
import { DataSetBindingFacade } from 'Frame/base';
import { useBindingFacadeFromEditor } from 'Controls-editors/hooks';
import { Selector } from 'Controls/dropdown';
import { useDataSetColumns } from './_LinearChartColumnEditor/useDataSetColumns';
import 'css!Controls-Graphs-editors/LinearChartColumnEditor';
import { TKey } from 'Controls/interface';
import { isEqual } from 'Types/object';

interface IRoundChartEditorProps {
    connectedPropName: string;
    LayoutComponent: unknown;
}

/**
 * Редактор выбора колонок
 */
export const ColumnEditor = memo((props: IRoundChartEditorProps) => {
    const { connectedPropName, LayoutComponent = Fragment } = props;

    const [bindingFacade, setBindingFacade] =
        useBindingFacadeFromEditor<DataSetBindingFacade>(connectedPropName);

    const [columnsRS] = useDataSetColumns(bindingFacade);

    useEffect(() => {
        // в рамках этого эффекта только инициализируем пустые колонки в фасаде
        if (!columnsRS?.getCount()) {
            return;
        }

        if (!bindingFacade) {
            return;
        }

        const [bindingField] = bindingFacade.getFields() || [];

        if (bindingField?.name && columnsRS?.getRecordById(bindingField?.name)) {
            // если уже выбрана колонка и эта колонка относится к текущему датасету
            return;
        }

        const bindingFacadeClone = bindingFacade?.clone();
        bindingFacadeClone?.setFields([
            {
                name: columnsRS?.at(0)?.getKey(),
            },
        ]);
        setBindingFacade(bindingFacadeClone);
    }, [bindingFacade, columnsRS, setBindingFacade]);

    const onValueChanged = (selectedKeys: string[]) => {
        if (!bindingFacade) {
            return;
        }

        const fields = selectedKeys.map((name) => {
            return {
                name,
            };
        });

        if (!isEqual(fields, bindingFacade.getFields())) {
            const bindingFacadeClone = bindingFacade.clone();
            bindingFacadeClone.setFields(fields);
            setBindingFacade(bindingFacadeClone);
        }
    };

    const selectedKeys = useMemo<TKey[]>(() => {
        const fields = bindingFacade?.getFields();
        if (Array.isArray(fields)) {
            return fields.map((field) => field.name);
        }
        return [];
    }, [bindingFacade]);

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
                keyProperty="Id"
                displayProperty="Title"
            />
        </LayoutComponent>
    );
});

ColumnEditor.displayName = 'Controls-Graphs-editors/ColumnEditor:ColumnEditor';

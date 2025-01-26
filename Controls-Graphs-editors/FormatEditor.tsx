import { Fragment, memo, useMemo } from 'react';
import { Selector } from 'Controls/dropdown';
import { RecordSet } from 'Types/collection';
import { TKey } from 'Controls/interface';
import { DataSetBindingFacade } from 'Frame/base';
import { useBindingFacadeFromEditor } from 'Controls-editors/hooks';
import * as translate from 'i18n!Controls-Graphs-editors';

interface IFormatEditorProps {
    LayoutComponent: unknown;
    onChange: Function;
    value: TKey[] | undefined;
    connectedPropName?: string;
}

/**
 * Редактор формата оси X для линейного графика и столбчатой диаграммы.
 * Временно отображает мокнутые данные.
 * @param props
 * @constructor
 */
const FormatEditor = memo((props: IFormatEditorProps) => {
    const { LayoutComponent = Fragment, value = [], connectedPropName = 'name' } = props;

    const columnsRS = useMemo(
        () =>
            new RecordSet({
                keyProperty: 'Id',
                rawData: [
                    {
                        Id: 'Month',
                        Title: 'Месяц',
                        Type: 'integer',
                    },
                    {
                        Id: 'Year',
                        Title: 'Год',
                        Type: 'string',
                    },
                    {
                        Id: 'Day',
                        Title: 'День',
                        Type: 'string',
                    },
                    {
                        Id: 'Quarter',
                        Title: 'Квартал',
                        Type: 'number',
                    },
                ],
            }),
        []
    );

    const [bindingFacade] = useBindingFacadeFromEditor<DataSetBindingFacade>(connectedPropName);

    if (!bindingFacade) {
        return null;
    }

    const onValueChanged = (newSelectedKeys: string[]) => {
        props.onChange(newSelectedKeys);
    };

    return (
        // @ts-expect-error JSX
        <LayoutComponent>
            <Selector
                onSelectedKeysChanged={onValueChanged}
                selectedKeys={value}
                items={columnsRS}
                buildByItems={true}
                emptyText={translate('Выберите формат')}
                keyProperty="Id"
                displayProperty="Title"
            />
        </LayoutComponent>
    );
});

FormatEditor.displayName = 'Controls-Graphs-editors/FormatEditor:FormatEditor';

export { FormatEditor };

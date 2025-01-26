import { Stack } from 'Controls/popupTemplate';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import * as React from 'react';
import { Button } from 'Controls/buttons';
import { Context as PopupContext } from 'Controls/popup';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { Provider } from 'Controls-DataEnv/context';
import { IObjectTypeFactoryArguments } from 'Controls-editors/object-type';
import { IEditorValidation } from 'Controls-editors/object-type';
import { Record } from 'Types/entity';
interface IStackTemplateProps<T> {
    value: Record;
    onChange: (value: Record) => void;
    metaType: T;
    pgFactoryArguments?: Partial<IObjectTypeFactoryArguments>;
    validation?: IEditorValidation;
}
export function StackTemplate<RuntimeInterface>(props: IStackTemplateProps<RuntimeInterface>) {
    const { value, onChange, metaType, pgFactoryArguments, validation } = props;
    const [propertyGridValue, setPropertyGridValue] = React.useState<Record>(value);
    const onPropertyGridValueChanged = React.useCallback((newValue: Record) => {
        setPropertyGridValue(newValue);
        onChange(newValue);
    }, []);
    const [loadResults, setLoadResults] = React.useState(null);
    const configs = React.useMemo(() => {
        return {
            RecordMetaTypeEditors: {
                dataFactoryName: 'Controls-editors/object-type:ObjectTypeFactory',
                dataFactoryArguments: {
                    ...(pgFactoryArguments ?? {}),
                    metaType,
                },
            },
        };
    }, [metaType, pgFactoryArguments]);
    React.useEffect(() => {
        Loader.load(configs).then(setLoadResults);
    }, [configs]);
    return (
        <Stack
            rightBorderVisible={false}
            bodyContentTemplate={
                !!loadResults && (
                    <Provider loadResults={loadResults} configs={configs}>
                        <PropertyGrid
                            value={propertyGridValue}
                            onChange={onPropertyGridValueChanged}
                            metaType={metaType}
                            storeId={'RecordMetaTypeEditors'}
                            showTooltip={true}
                            validation={validation}
                            className={'controls-recordsetEditor_stack'}
                        />
                    </Provider>
                )
            }
            headerContentTemplate={<div />}
        />
    );
}

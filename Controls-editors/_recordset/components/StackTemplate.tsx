import { Stack } from 'Controls/popupTemplate';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import * as React from 'react';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { Provider } from 'Controls-DataEnv/context';
import { Record } from 'Types/entity';
import { Context } from 'Controls/popup';
import { ITemplateOptions } from 'Controls-editors/_recordset/interface';

export function StackTemplate<RuntimeInterface>(props: ITemplateOptions<RuntimeInterface>) {
    const { value, onChange, metaType, pgFactoryArguments, validation, version, readOnly } = props;
    const popup = React.useContext(Context);
    const stackRef = React.useRef();
    const onPropertyGridValueChanged = React.useCallback(
        (newValue: Record) => {
            onChange(newValue);
            setEditorValue(newValue);
        },
        [onChange]
    );
    const [editorValue, setEditorValue] = React.useState(value);
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
            ref={stackRef}
            key={`${popup.popupId}_${version ?? ''}`}
            rightBorderVisible={false}
            bodyContentTemplate={
                !!loadResults && (
                    <Provider loadResults={loadResults} configs={configs}>
                        <PropertyGrid
                            value={editorValue}
                            onChange={onPropertyGridValueChanged}
                            metaType={metaType}
                            storeId={'RecordMetaTypeEditors'}
                            showTooltip={true}
                            validation={validation}
                            className={'controls-recordsetEditor_stack'}
                            readOnly={readOnly}
                        />
                    </Provider>
                )
            }
            headerContentTemplate={<div />}
        />
    );
}

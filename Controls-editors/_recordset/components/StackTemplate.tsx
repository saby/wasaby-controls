import { PropertyGrid } from 'Controls-editors/propertyGrid';
import * as React from 'react';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { Provider } from 'Controls-DataEnv/context';
import { Record } from 'Types/entity';
import { ITemplateOptions } from 'Controls-editors/_recordset/interface';
import { getPopupComponent } from 'Controls/popup';
import { Container } from 'Controls/scroll';
import { Context } from 'Controls-editors/_recordset/context/PropertyGridContextProvider';
import { useMetaType } from 'Controls-editors/_recordset/hooks/useMetaType';
import { getWasabyContext } from 'UICore/Contexts';

export function StackTemplate<RuntimeInterface>(props: ITemplateOptions<RuntimeInterface>) {
    const stackRef = React.useRef();

    const { validation, value, onChange, pgFactoryArguments } = React.useContext(Context);
    const metaType = useMetaType();
    const { readOnly } = React.useContext(getWasabyContext());

    const Component = getPopupComponent(props.popupComponentName);

    const onPropertyGridValueChanged = React.useCallback(
        (newValue: Record) => {
            onChange(newValue);
        },
        [onChange]
    );
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
        <Component
            ref={stackRef}
            rightBorderVisible={false}
            bodyContentTemplate={
                !!loadResults && (
                    <Provider loadResults={loadResults} configs={configs}>
                        <Container>
                            <PropertyGrid
                                value={value}
                                onChange={onPropertyGridValueChanged}
                                metaType={metaType}
                                storeId={'RecordMetaTypeEditors'}
                                showTooltip={true}
                                validation={validation}
                                className={'controls-recordsetEditor_stack'}
                                readOnly={readOnly}
                            />
                        </Container>
                    </Provider>
                )
            }
            headerContentTemplate={<div />}
        />
    );
}

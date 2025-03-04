import { useState, useCallback, useEffect, useMemo, forwardRef } from 'react';
import { ObjectMeta } from 'Meta/types';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { createElement } from 'UICore/Jsx';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-editors-demo/PropertyGrid/PropsDemoEditor';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { Provider } from 'Controls-DataEnv/context';
import { Checkbox } from 'Controls/checkbox';

export const PropsDemoEditorGrid = forwardRef(function PropsDemoEditorGrid(
    {
        metaType,
        control,
    }: {
        metaType: ObjectMeta<any>;
        control?: any;
    },
    ref
) {
    const [props, setProps] = useState({});

    const [withGrouping, setWithGrouping] = useState(false);

    const [loadResults, setLoadResults] = useState(null);
    const providerConfigs = useMemo<Record<string, any>>(() => {
        return {
            MetaTypeEditors: {
                dataFactoryName: 'Controls-editors/object-type:ObjectTypeFactory',
                dataFactoryArguments: {
                    metaType,
                },
            },
        };
    }, [metaType]);

    const onClose = useCallback(() => {
        alert('Closed');
    }, []);

    useEffect(() => {
        Loader.load(providerConfigs).then(setLoadResults);
    }, [providerConfigs]);

    const gropingWithGrouping = useCallback(() => {
        setWithGrouping((prevState) => !prevState);
    }, []);

    return (
        <div ref={ref}>
            <Checkbox
                value={withGrouping}
                caption={'Группировка с облачками'}
                onValueChanged={gropingWithGrouping}
            />
            <div className="PropsDemoEditor__Content">
                <div>
                    {!!loadResults && (
                        <Provider configs={providerConfigs} loadResults={loadResults}>
                            <PropertyGrid
                                metaType={metaType}
                                value={props}
                                onChange={setProps}
                                storeId={'MetaTypeEditors'}
                                onClose={onClose}
                                groupType={withGrouping ? 'cloud' : undefined}
                            />
                        </Provider>
                    )}
                </div>
                <div style={{ minWidth: 300, marginLeft: 20 }}>
                    <div style={{ marginBottom: 20 }}>
                        {control
                            ? createElement(control, {
                                  ...props /* Копируем props, потому-что createElement мутирует его */,
                              })
                            : null}
                    </div>
                    <pre data-qa="Controls-demo_PropertyGridNew__editingObject">
                        {JSON.stringify(props, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
});

import { PersonType } from './meta';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { useState, useMemo, useEffect, forwardRef } from 'react';
import { Provider } from 'Controls-DataEnv/context';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { Record } from 'Types/entity';

export default forwardRef(function ObjectEditorDemo(props: any, ref) {
    const [value, setValue] = useState({});

    const [loadResults, setLoadResults] = useState(null);
    const providerConfigs = useMemo<Record<string, any>>(() => {
        return {
            MetaTypeEditors: {
                dataFactoryName: 'Controls-editors/object-type:ObjectTypeFactory',
                dataFactoryArguments: {
                    metaType: PersonType,
                },
            },
        };
    }, [PersonType]);

    useEffect(() => {
        Loader.load(providerConfigs).then(setLoadResults);
    }, [PersonType]);

    return (
        <div className="controlsDemo__wrapper controlsDemo_fixedWidth300" ref={ref}>
            {!!loadResults && (
                <Provider configs={providerConfigs} loadResults={loadResults}>
                    <PropertyGrid
                        value={value}
                        onChange={setValue}
                        storeId={'MetaTypeEditors'}
                        captionColumnWidth={'minmax(140px, max-content)'}
                    />
                </Provider>
            )}
            <div>
                <textarea
                    style={{ width: '500px' }}
                    value={JSON.stringify(value, null, 2)}
                    readOnly={true}
                    rows={20}
                ></textarea>
            </div>
        </div>
    );
});

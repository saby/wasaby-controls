import { PersonType } from './meta';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { useState, useMemo, useEffect } from 'react';
import { Provider } from 'Controls-DataEnv/context';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { Record } from 'Types/entity';

export default function ObjectEditorDemo() {
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
        <div className="controlsDemo__wrapper controlsDemo_fixedWidth300">
            {!!loadResults && (
                <Provider configs={providerConfigs} loadResults={loadResults}>
                    <PropertyGrid
                        metaType={PersonType}
                        value={value}
                        onChange={setValue}
                        storeId={'MetaTypeEditors'}
                        captionColumnWidth={'minmax(140px, max-content)'}
                    />
                </Provider>
            )}
        </div>
    );
}

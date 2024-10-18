import { PersonType } from './meta';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { useState, useMemo, useEffect } from 'react';
import { Provider } from 'Controls-DataEnv/context';
import { Loader } from 'Controls-DataEnv/dataLoader';

export default function VariantEditor() {
    const [value, setValue] = useState({
        name: 'Сергей',
        surname: 'Михайлов',
        job: {
            element_id: 'engineer',
            data: {
                speciality: {
                    element_id: 'programmer',
                    data: {
                        programmingLanguage: 'JavaScript',
                        experience: '10',
                    },
                },
                salary: '100000',
            },
        },
    });
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
    }, [providerConfigs]);

    return (
        <div className="controlsDemo__wrapper controlsDemo_fixedWidth500">
            {!!loadResults && (
                <Provider configs={providerConfigs} loadResults={loadResults}>
                    <PropertyGrid
                        metaType={PersonType}
                        value={value}
                        onChange={setValue}
                        storeId={'MetaTypeEditors'}
                        captionColumnWidth={'minmax(220px, max-content)'}
                    />
                </Provider>
            )}
            <div>
                <textarea
                    style={{ width: '500px' }}
                    value={JSON.stringify(value, null, 2)}
                    rows={20}
                ></textarea>
            </div>
        </div>
    );
}

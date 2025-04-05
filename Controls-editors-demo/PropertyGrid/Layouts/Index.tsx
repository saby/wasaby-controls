import { PersonType } from './meta';
import { MasterDetailPropertyGridLayout } from 'Controls-editors/propertyGridLayouts';
import { useState, useMemo, useEffect, forwardRef } from 'react';
import { Provider } from 'Controls-DataEnv/context';
import { Loader } from 'Controls-DataEnv/dataLoader';

export default forwardRef<HTMLDivElement, any>(function ObjectEditorDemo(props: any, ref) {
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
    }, []);

    useEffect(() => {
        Loader.load(providerConfigs).then(setLoadResults);
    }, []);

    return (
        <div className="controlsDemo__wrapper" ref={ref}>
            {!!loadResults && (
                <Provider configs={providerConfigs} loadResults={loadResults}>
                    <MasterDetailPropertyGridLayout
                        value={value}
                        onChange={setValue}
                        storeId={'MetaTypeEditors'}
                        groupType={'cloud'}
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

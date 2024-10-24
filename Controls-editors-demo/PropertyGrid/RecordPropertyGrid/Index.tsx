import { IPersonType } from './meta';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { Record, adapter } from 'Types/entity';
import { Provider } from 'Controls-DataEnv/context';
import { Loader } from 'Controls-DataEnv/dataLoader';

const PGDemo = forwardRef((_, ref) => {
    const initValue = useMemo(() => {
        const record = new Record({
            adapter: new adapter.Sbis(),
        });

        record.addField({ name: 'name', type: 'string' });
        record.addField({ name: 'age', type: 'integer' });
        record.addField({ name: 'gender', type: 'string' });
        record.addField({ name: 'job', type: 'record' });

        return record;
    }, []);

    const [value, setValue] = useState(initValue);

    const [loadResults, setLoadResults] = useState(null);
    const providerConfigs = useMemo<Record<string, any>>(() => {
        return {
            MetaTypeEditors: {
                dataFactoryName: 'Controls-editors/object-type:ObjectTypeFactory',
                dataFactoryArguments: {
                    metaType: IPersonType,
                },
            },
        };
    }, [IPersonType]);

    useEffect(() => {
        Loader.load(providerConfigs).then(setLoadResults);
    }, [providerConfigs]);

    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth300">
            {!!loadResults && (
                <Provider configs={providerConfigs} loadResults={loadResults}>
                    <>
                        <PropertyGrid
                            value={value}
                            onChange={setValue}
                            metaType={IPersonType}
                            storeId={'MetaTypeEditors'}
                        />
                        <div>Age: {value.get('age')}</div>
                        <div>Gender: {value.get('gender')}</div>
                        <div>Name: {value.get('name')}</div>
                        <div>Работа - Название: {value.get('job')?.get('title')}</div>
                        <div>Работа - Описание: {value.get('job')?.get('description')}</div>
                    </>
                </Provider>
            )}
        </div>
    );
});

export default PGDemo;

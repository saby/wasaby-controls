import { ObjectType } from 'Meta/types';
import { data, displayProperties } from 'Controls-editors-demo/RecordsetEditor/data';
import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { Provider } from 'Controls-DataEnv/context';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { useEffect, useMemo, useState } from 'react';
import { adapter, Record } from 'Types/entity';
import { metaTypeWithVariants } from 'Controls-editors-demo/RecordsetEditor/metaType';

const PersonType = ObjectType.properties({
    Prop1: metaTypeWithVariants,
});

export default React.forwardRef(function Index(
    _: unknown,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const recordSet = React.useMemo(() => {
        const result = new RecordSet({
            keyProperty: 'key',
            adapter: new adapter.Sbis(),
        });
        data.forEach((elem) => {
            const record = new Record({ adapter: result.getAdapter() });
            record.addField({ name: 'key', type: 'string' }, 0, elem.key);
            record.addField({ name: 'name', type: 'string' }, 1, elem.name);
            record.addField({ name: 'type', type: 'string' }, 2, elem.type);
            record.addField({ name: 'comment', type: 'string' }, 3, elem.comment);
            record.addField({ name: 'unique', type: 'boolean' }, 4, elem.unique);
            if (elem.fieldType === 'Field') {
                const innerRecord = new Record({ adapter: result.getAdapter() });
                const dataRecord = new Record({ adapter: result.getAdapter() });
                dataRecord.addField({ name: 'fieldName', type: 'string' }, 0, '12345');
                innerRecord.addField({ name: 'data', type: 'record' }, 0, dataRecord);
                innerRecord.addField({ name: 'element_id', type: 'string' }, 1, 'name');
                record.addField({ name: 'fieldType', type: 'record' }, 5, innerRecord);
            } else if (elem.fieldType === 'Expression') {
                const innerRecord = new Record({ adapter: result.getAdapter() });
                const dataRecord = new Record({ adapter: result.getAdapter() });
                dataRecord.addField({ name: 'expression', type: 'string' }, 0, 'let x = 0');
                innerRecord.addField({ name: 'data', type: 'record' }, 0, dataRecord);
                innerRecord.addField({ name: 'element_id', type: 'string' }, 1, 'expression');
                record.addField({ name: 'fieldType', type: 'record' }, 5, innerRecord);
            }
            result.add(record);
        });
        return result;
    }, []);
    const [value, setValue] = React.useState({
        Prop1: recordSet,
    });

    const [loadResults, setLoadResults] = useState(null);
    const providerConfigs = useMemo<Record<string, any>>(() => {
        return {
            MetaTypeEditors: {
                dataFactoryName: 'Controls-editors/object-type:ObjectTypeFactory',
                dataFactoryArguments: {
                    metaType: PersonType,
                    overridenEditors: {
                        TestType: {
                            editorProps: {
                                displayProperties,
                                keyProperty: 'key',
                            },
                        },
                    },
                },
            },
        };
    }, [PersonType]);

    useEffect(() => {
        Loader.load(providerConfigs).then(setLoadResults);
    }, [providerConfigs]);

    return (
        <div
            ref={ref}
            className={
                'controlsDemo__wrapper controlsDemo_fixedWidth1400 tw-flex tw-justify-between'
            }
        >
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
        </div>
    );
});

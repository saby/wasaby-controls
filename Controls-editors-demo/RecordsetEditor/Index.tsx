import { ArrayType, ObjectType, StringType, BooleanType } from 'Meta/types';
import { data, columns } from './data';
import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { Provider } from 'Controls-DataEnv/context';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { useEffect, useMemo, useState } from 'react';
import { adapter, Record } from 'Types/entity';

interface IMetaType {
    name: string;
    type: string;
    comment: string;
    unique: boolean;
}

const itemType = ObjectType.properties<IMetaType>({
    key: StringType.title('Ключ').required(),
    name: StringType.title('Название'),
    type: StringType.oneOf(['Auto', 'Double', 'Decimal', 'Flags', 'Time'])
        .editor('Controls-editors/dropdown:EnumStringEditor', {
            options: ['Auto', 'Double', 'Decimal', 'Flags', 'Time'],
        })
        .defaultValue('Auto')
        .title('Тип'),
    comment: StringType.title('Комментарий').optional(),
    unique: BooleanType.defaultValue(true).title('Уникальный').optional(),
});
const metaType = ArrayType.id('TestType').of(itemType).title('Колонки');

const PersonType = ObjectType.properties({
    Prop1: metaType,
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
                                columns,
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

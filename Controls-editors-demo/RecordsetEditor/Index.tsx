import { ObjectType } from 'Meta/types';
import { data, columns, fieldsData } from './data';
import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { Provider } from 'Controls-DataEnv/context';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { useEffect, useMemo, useState } from 'react';
import { adapter, Record } from 'Types/entity';
import { metaType, metaTypeDisable } from 'Controls-editors-demo/RecordsetEditor/metaType';
import { Checkbox } from 'Controls/checkbox';
import { Button } from 'Controls/buttons';
import { Context } from 'Controls-editors/recordset';

function EmptyView() {
    const context = React.useContext(Context);
    return <Button caption={'Добавить запись'} onClick={context.beginAdd} />;
}

export default React.forwardRef(function Index(
    _: unknown,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const fieldRecordSet = React.useMemo(() => {
        const result = new RecordSet({
            keyProperty: 'key',
            adapter: new adapter.Sbis(),
        });
        fieldsData.forEach((elem) => {
            const record = new Record({ adapter: result.getAdapter() });
            record.addField({ name: 'key', type: 'string' }, 0, elem.key);
            record.addField({ name: 'type', type: 'string' }, 1, elem.type);
            result.add(record);
        });
        return result;
    }, []);
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
            record.addField({ name: 'list', type: 'recordset' }, 5, fieldRecordSet);
            result.add(record);
        });
        return result;
    }, []);

    const validation = Record.fromObject(
        {
            Prop1: {
                nested: [
                    {},
                    {
                        error: 'Ошибка в записи 2',
                    },
                    {},
                    {
                        warning: 'Предупреждение в записи 4',
                    },
                    {},
                ],
            },
        },
        'adapter.sbis'
    );

    const [isDisabled, setIsDisabled] = React.useState(false);
    const PersonType = React.useMemo(() => {
        if (isDisabled) {
            return ObjectType.properties({
                Prop1: metaTypeDisable,
            });
        } else {
            return ObjectType.properties({
                Prop1: metaType,
            });
        }
    }, [isDisabled]);
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
                                emptyView: [
                                    {
                                        startColumn: 1,
                                        endColumn: 5,
                                        render: React.createElement(EmptyView),
                                    },
                                ],
                            },
                        },
                        TestType2: {
                            editorProps: {
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
            className={'controlsDemo__wrapper tw-flex tw-flex-col '}
            style={{
                width: '650px',
            }}
        >
            <Checkbox caption={'Режим чтения'} value={isDisabled} onValueChanged={setIsDisabled} />
            {!!loadResults && (
                <Provider configs={providerConfigs} loadResults={loadResults}>
                    <PropertyGrid
                        metaType={PersonType}
                        value={value}
                        onChange={setValue}
                        storeId={'MetaTypeEditors'}
                        validation={validation}
                        captionColumnWidth={'minmax(220px, max-content)'}
                    />
                </Provider>
            )}
        </div>
    );
});

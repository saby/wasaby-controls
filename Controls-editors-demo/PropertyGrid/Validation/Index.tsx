import { useState, useMemo, useEffect, useCallback, forwardRef, ForwardedRef } from 'react';
import { PersonType } from './meta';
import { PropertyGrid, RecordAdapter } from 'Controls-editors/propertyGrid';
import { PropsValidation } from 'Controls-editors/object-type';
import { Provider } from 'Controls-DataEnv/context';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { Base as CodeEditor, MODES } from 'CodeEditor/editor';
import { Logger } from 'UICommon/Utils';
import { Record as EntityRecord } from 'Types/entity';
import { RecordSet } from 'Types/collection';

const VALIDATION: EntityRecord<PropsValidation> = EntityRecord.fromObject(
    {
        name: {
            warning: 'Имя предупреждение',
        },
        surname: {
            error: 'Фамилия ошибка',
        },
        job: {
            warning: 'Должность предупреждение',
            nested: {
                salary: {
                    warning: 'Зарплата предупреждение',
                },
                speciality: {
                    nested: {
                        programmingLanguage: {
                            warning: 'Язык программирования предупреждение',
                        },
                    },
                },
            },
        },
        skills: {
            warning: 'Навыки предупреждение',
            nested: {
                stress: {
                    error: 'Стрессоустойчивость ошибка',
                },
            },
        },
        interest: {
            warning: 'Интересы предупреждение',
        },
        table: {
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

function ValidationEditor(_: unknown, ref: ForwardedRef<HTMLDivElement>) {
    const [value, setValue] = useState({
        table: new RecordSet({
            rawData: [
                {
                    key: '1',
                    name: '@Работа',
                    type: 'Auto',
                    comment: '',
                    unique: false,
                },
                {
                    key: '2',
                    name: 'КолВо',
                    type: 'Double',
                    comment: '',
                    unique: true,
                },
                {
                    key: '3',
                    name: 'Цена',
                    type: 'Decimal',
                    comment: '',
                    unique: false,
                },
                {
                    key: '4',
                    name: 'Флаги',
                    type: 'Flags',
                    comment: 'Признаки события',
                    unique: true,
                },
                {
                    key: '5',
                    name: 'Время',
                    type: 'Time',
                    comment: 'Длительность выполнения работы',
                    unique: true,
                },
            ],
            keyProperty: 'key',
        }),
    });

    const [validation, setValidation] = useState(VALIDATION);
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
    }, [providerConfigs]);

    const validationJSON = useMemo(() => {
        const adapter = new RecordAdapter(validation);
        return JSON.stringify(adapter.get(), null, '   ');
    }, [validation]);

    const onValidationChange = useCallback((newValidationString: string) => {
        try {
            const newValidation = EntityRecord.fromObject(
                JSON.parse(newValidationString),
                'adapter.sbis'
            );
            setValidation(newValidation);
        } catch (e) {
            Logger.info('Invalid JSON!');
        }
    }, []);

    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth1400 tw-flex tw-justify-between"
        >
            {!!loadResults && (
                <Provider configs={providerConfigs} loadResults={loadResults}>
                    <div>
                        <PropertyGrid
                            metaType={PersonType}
                            value={value}
                            validation={validation}
                            showTooltip={true}
                            onChange={setValue}
                            storeId={'MetaTypeEditors'}
                            captionColumnWidth={'minmax(220px, max-content)'}
                        />
                    </div>
                </Provider>
            )}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <CodeEditor
                value={validationJSON}
                onValuechange={onValidationChange}
                mode={MODES.JSON}
            />
        </div>
    );
}

export default forwardRef(ValidationEditor);

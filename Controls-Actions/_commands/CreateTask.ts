import { Control } from 'UI/Base';
import { IContextValue } from 'Controls/context';

interface ICreateTaskOptions {
    docType: string;
    regulations?: string;
}

/**
 * Действие создания задачи
 *
 * @public
 */
export default class CreateTask {
    execute(
        { regulations, docType }: ICreateTaskOptions,
        initiator: Control,
        _,
        contextData: IContextValue
    ): void {
        if (regulations) {
            Promise.all([
                import('Types/source'),
                import('Types/entity'),
                import('EDO3/opener'),
                import('Controls/popup'),
            ]).then(([{SbisService, Query}, {Record}, {Dialog}, {Confirmation}]) => {
                const rsFilter = new Record({
                    format: {
                        'CurrentApplication': 'boolean',
                        'DocType': {
                            'type': 'array',
                            'kind': 'string'
                        },
                        'ShowDocTypeForNotFoundRegls': 'boolean',
                        'for_doc_creation': 'boolean',
                        'limit_by_author': 'boolean',
                        'Действующий': 'boolean',
                        'ИсключитьВизуальныеПредставления': {
                            'type': 'array',
                            'kind': 'string'
                        },
                        'НеЗагружатьТипы': 'boolean',
                        'ОтсортироватьПоТипам': 'boolean',
                        'ПоказатьДефолтные': 'boolean',
                        'ПоказыватьПустыеПапки': 'boolean',
                        'ПоказыватьТипы': 'boolean',
                        'ПроверитьДоступ': 'boolean',
                        'СпособыСоздания': {
                            'type': 'array',
                            'kind': 'integer'
                        },
                        'УпрощеннаяИерархия': 'boolean',
                        'ИсключитьВсеПапки': 'boolean'
                    },
                    adapter: 'adapter.sbis'
                });
                rsFilter.set({
                    'CurrentApplication': true,
                    'DocType': [
                        docType
                    ],
                    'ShowDocTypeForNotFoundRegls': true,
                    'for_doc_creation': true,
                    'limit_by_author': true,
                    'Действующий': true,
                    'ИсключитьВизуальныеПредставления': [],
                    'НеЗагружатьТипы': false,
                    'ОтсортироватьПоТипам': true,
                    'ПоказатьДефолтные': true,
                    'ПоказыватьПустыеПапки': true,
                    'ПоказыватьТипы': false,
                    'ПроверитьДоступ': true,
                    'СпособыСоздания': [0, 2],
                    'УпрощеннаяИерархия': true,
                    'ИсключитьВсеПапки': true
                });
                new SbisService({
                    endpoint: {
                        contract: 'Regulation'
                    },
                    binding: {
                        query: 'StdList'
                    }
                }).query(
                    new Query().where(rsFilter)
                ).then((result) => {
                    const resultRS = result.getAll();
                    let rule = resultRS.at(0);
                    if (!!regulations) {
                        resultRS.setKeyProperty('Идентификатор');
                        rule = resultRS.getRecordById(regulations);
                    }
                    if (!rule) {
                        Confirmation.openPopup({
                            message: 'В настройках указан некорректный регламент',
                            type: 'ok',
                            style: 'danger',
                            opener: initiator,
                        });
                        return;
                    }
                    new Dialog().open(
                        {
                            filter: {},
                            rule,
                        },
                        {
                            opener: initiator,
                            openMode: 4,
                        }
                    );
                });
            });
        }
    }
}

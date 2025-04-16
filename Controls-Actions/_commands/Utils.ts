import { SbisService } from 'Types/source';
import { factory } from 'Types/chain';
import { logger } from 'Application/Env';

export function createFilter(meta, id) {
    const _meta = meta || {};

    /* переделали формирование фильтра на момент формирования списка
     для панели "что делать с файлом" Буданкова А. */
    return {
        ВключитьСписокИсполнителей: true,
        ВнешняяИерархия: true,
        ВызовИзБраузера: true,
        ИдРегламента: id,
        ПоказИерархии: false,
        ПростыеВД: true,
        РассчитатьФото: true,
        ТипДокумента: _meta.documentType,
        'ТипДокумента.ИмяДиалога': _meta.nameDialog,
        'ТипДокумента.ИмяОбъекта': _meta.objectName,
        'ТипДокумента.ТипДокумента': _meta.groupType,
    };
}

function queryRegulationList(docType) {
    return new Promise(function (resolve, reject) {
        require(['EDO3/ruleSelector'], function (ruleSelectorLibrary) {
            ruleSelectorLibrary
                .getRulesList({
                    DocType: [docType],
                })
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    logger.error(error);
                    reject(error);
                });
        });
    });
}

function checkMethodAvailability(methodName, paramsCount) {
    return new SbisService({
        endpoint: {
            contract: 'ПроверкаПрав',
        },
    })
        .call('ДоступностьМетода', {
            ИмяМетода: methodName,
            ЧислоАргументов: paramsCount,
        })
        .addCallback(function (data) {
            return data.getScalar();
        });
}

export function getRegulationItems(options) {
    return checkMethodAvailability(options.objectName + '.Создать', 2)
        .addCallback(function (data) {
            if (!data) {
                return new Error();
            }

            return queryRegulationList(options.objectName);
        })
        .addCallback(function (rules) {
            return {
                needWrap: true,
                wrapName: options.wrapName,
                opener: options.opener,
                icon: options.icon,
                group: options.group,
                subGroup: options.subGroup,
                items: factory(rules)
                    .map(function (record) {
                        const docType = record.get('ТипДокумента');
                        const meta = {
                            nameDialog: docType.get('ИмяДиалога'),
                            objectName: docType.get('ИмяОбъекта'),
                            groupType: docType.get('Тип'),
                            documentType: docType.get('@ТипДокумента'),
                        };
                        meta.filter = createFilter(meta, record.get('Идентификатор'));
                        return {
                            group: options.group,
                            name: record.get('Название'),
                            parent: record.get('Раздел'),
                            objectId: record.get('Идентификатор'),
                            historyId: options.objectName,
                            '@parent': record.get('Раздел@'),
                            id: record.get('Идентификатор'),
                            elementId: record.get('Идентификатор'),
                            opener: options.opener,
                            itemRecord: record,
                            regulations: record.get('Идентификатор'),
                            meta,
                        };
                    })
                    .value(),
            };
        })
        .addErrback(function () {
            // если проверка доступности ответила false - прокидываем пустой массив. Этот элемент отсечется далее
            return {
                items: [],
            };
        });
}

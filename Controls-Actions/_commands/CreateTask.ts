import { Control } from 'UI/Base';
import { IContextValue } from 'Controls/context';

interface ICreateTaskOptions {
    docType: string;
    regulations?: string;
}
/* eslint-disable ui-modules-dependencies */
/**
 * Действие создания задачи
 *
 * @public
 */
export default class CreateTask {
    execute({ regulations, docType }: ICreateTaskOptions, initiator: Control, _, contextData: IContextValue): void {
        if (regulations) {
            Promise.all([
                new Promise((resolve) => {
                    import('EDO2/Rule/Helpers')
                        .then(({ getRulesList }) => {
                            return getRulesList({
                                docTypes: [{ docType }],
                                showFavorites: false,
                            });
                        })
                        .then((rules) => {
                            const rule = rules.at(
                                rules.getIndicesByValue('Идентификатор', regulations)[0]
                            );
                            const docTypeInfo = rule.get('ТипДокумента');
                            /* eslint-disable */
                            const meta = {
                                nameDialog: docTypeInfo.get('ИмяДиалога'),
                                objectName: docTypeInfo.get('ИмяОбъекта'),
                                groupType: docTypeInfo.get('Тип'),
                                documentType: docTypeInfo.get('@ТипДокумента'),
                                filter: {
                                    ВключитьСписокИсполнителей: true,
                                    ВнешняяИерархия: true,
                                    ВызовИзБраузера: true,
                                    ИдРегламента: regulations,
                                    ПоказИерархии: false,
                                    ПростыеВД: true,
                                    РассчитатьФото: true,
                                    ТипДокумента: docTypeInfo.get('@ТипДокумента'),
                                    'ТипДокумента.ИмяДиалога': docTypeInfo.get('ИмяДиалога'),
                                    'ТипДокумента.ИмяОбъекта': docTypeInfo.get('ИмяОбъекта'),
                                    'ТипДокумента.ТипДокумента': docTypeInfo.get('Тип'),
                                },
                            };
                            /* eslint-enable */

                            resolve([rule, meta]);
                        });
                }),
                import('Lib/Control/LayerCompatible/LayerCompatible')
                    .then((Layer) => {
                        return new Promise((resolve) => {
                            Layer.load().addCallback(resolve);
                        });
                    })
            ]).then(([[rule, meta]]) => {
                const documentContext = contextData.document;
                if (documentContext) {
                    import('EDO3/actions').then(({ Controller }) => {
                        const record = documentContext.get('record');
                        const actionsController = new Controller({
                            record,
                        });
                        actionsController.processAction('createLinkedDocument', {
                            rule,
                            record,
                        });
                    });
                } else {
                    import('EDO3/opener').then(({ Dialog }) => {
                        new Dialog().open(
                            {
                                filter: meta.filter,
                                rule: rule.get('itemRecord'),
                            },
                            {
                                opener: initiator,
                                openMode: 4,
                            }
                        );
                    });
                }
            });
        }
    }
}
/* eslint-enable ui-modules-dependencies */

/**
 * Действие создания документа КЭДО
 *
 * @class Controls-Actions/_commands/CreateCEDWDoc
 * @public
 */
import { Query, SbisService } from 'Types/source';
import { Control } from 'UI/Base';

export default class CreateCEDWDoc {
    async execute(config: object, opener: Control): void {
        const docType = config.docType;
        if (!docType) {
            return;
        }

        if (docType === 'BusinessTrip') {
            const edoOpener = await import('EDO3/opener');
            const { createBusinessTrip } = await import('StaffDocs/Helpers');
            return createBusinessTrip(config.regulation, edoOpener, this);
        } else if (docType === 'Отгул' || docType === 'Переработка') {
            const { Info } = await import('EngineUser/Info');
            const edoOpener = await import('EDO3/opener');
            const dialog = new edoOpener.Dialog();
            dialog.open(
                {
                    filter: {
                        'ТипДокумента.ИмяОбъекта': docType,
                        'ТипДокумента.ТипДокумента': docType,
                        Лицо1: Info.get('ЧастноеЛицо'),
                        ИдРегламента: config.regulation,
                    },
                },
                {
                    openMode: 4,
                    opener,
                }
            );
        } else if (docType === 'Отпуск') {
            const vacation = await import('Salary/Vacation/simple');
            vacation.createByMenuKey(config.regulation, this);
        } else if (docType === 'Больничный') {
            Promise.all([import('Salary/Allowance/creator'), import('EngineUser/Info')]).then(
                ([{ create }, { Info }]): void => {
                    const person = Info.get('ЧастноеЛицо');
                    create({
                        opener: this,
                        filter: {
                            Лицо1: person,
                            'Сотрудник.@Лицо': person,
                        },
                    });
                }
            );
        } else {
            const { Info } = await import('EngineUser/Info');
            const source = new SbisService({
                endpoint: 'StaffDocsConfig',
            });

            source
                .call('RegulationList', {
                    Config: {
                        DocTypes: { StaffStatements: null },
                        ReturnSubTypes: 'hierarchy',
                    },
                })
                .then(async (result) => {
                    const rec = result.getRow();
                    const regulations = rec?.get('Regulations');
                    const index = regulations.getIndexByValue('ComplexKey', config.regulation);
                    const item = regulations.at(index);
                    if (item) {
                        const edoOpener = await import('EDO3/opener');
                        const dialog = new edoOpener.Dialog();
                        dialog.open(
                            {
                                filter: {
                                    Регламент: item.get('RawId'),
                                    'ТипДокумента.ИмяОбъекта': docType,
                                    'ТипДокумента.ТипДокумента': docType,
                                    SubType: item.get('SubType'),
                                    Лицо1: Info.get('ЧастноеЛицо'),
                                },
                            },
                            {
                                openMode: 4,
                                opener: this,
                            }
                        );
                    }
                });
        }
    }
}

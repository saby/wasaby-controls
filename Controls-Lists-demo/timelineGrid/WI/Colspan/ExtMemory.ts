import { CrudEntityKey, Query } from 'Types/source';
import { format as EntityFormat } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { default as Memory, generateItem, LOAD_TIMEOUT_DYNAMIC_COLUMNS } from '../Data/ExtMemory';

export default class ExtMemory extends Memory {
    _moduleName: string = 'Controls-Lists-demo/timelineGrid/WI/Colspan/ExtMemory';
    protected _folderMap: CrudEntityKey[] = ['folder-0', 'folder-1', null, null];

    query(query: Query): Promise<RecordSet> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const adapter = this.getAdapter();
                const resultRecordSet = new RecordSet({
                    adapter,
                    keyProperty: 'key',
                });
                resultRecordSet.addField(new EntityFormat.StringField({ name: 'key' }));
                resultRecordSet.addField(new EntityFormat.StringField({ name: 'type' }));
                resultRecordSet.addField(new EntityFormat.StringField({ name: 'parent' }));
                resultRecordSet.addField(new EntityFormat.StringField({ name: 'fullName' }));
                resultRecordSet.addField(new EntityFormat.StringField({ name: 'job' }));
                resultRecordSet.addField(new EntityFormat.StringField({ name: 'image' }));
                resultRecordSet.addField(new EntityFormat.DateTimeField({ name: 'startWorkDate' }));
                resultRecordSet.addField(
                    new EntityFormat.RecordSetField({ name: 'dynamicColumnsData' })
                );
                this._generateItems(resultRecordSet, query);
                resolve(resultRecordSet);
            }, LOAD_TIMEOUT_DYNAMIC_COLUMNS);
        });
    }

    _beforeGenerateItems(resultRecordSet: RecordSet, query: Query) {
        [
            {
                fullName: 'Служба поддержки клиентов и внедрение систем',
                job: 'Круглосуточная поддержка клиентов, решение вопросов клиентов по работе в СБИС',
            },
            {
                fullName: 'Обращения и инциденты',
                job: 'Функционал обработки возникших проблем у клиентов',
            },
        ].forEach((folderData, index) => {
            const record = generateItem(resultRecordSet.getAdapter(), {
                key: `folder-${index}`,
                type: true,
                hasChild: true,
                parent: null,
                image: null,
                fullName: folderData.fullName,
                job: folderData.job,
                startWorkDate: null,
                dynamicColumnsData: null,
            });
            resultRecordSet.add(record);
        });
    }
}

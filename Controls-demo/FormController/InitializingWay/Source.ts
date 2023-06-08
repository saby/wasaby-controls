import { Model } from 'Types/entity';
import { Memory } from 'Types/source';

const ASYNC_TIMEOUT = 1000;

export default class Source extends Memory {
    read(key: string, readMetaData: object): Promise<Model> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                super.read(key, readMetaData).then((record) => {
                    record.addField({
                        name: 'readField',
                        type: 'string',
                        defaultValue:
                            'Это поле которое появляется после чтения',
                    });
                    resolve(record);
                }, reject);
            }, ASYNC_TIMEOUT);
        });
    }
}

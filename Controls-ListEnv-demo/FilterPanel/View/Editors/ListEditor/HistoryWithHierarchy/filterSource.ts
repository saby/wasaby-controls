import { DataSet, Memory, Query } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Store } from 'Controls/HistoryStore';
export class FilterMemory extends Memory {
    constructor(options: any) {
        super(options);
    }

    async query(queryInst: Query): Promise<DataSet> {
        return new Promise(async (resolve) => {
            const superQuery = super.query(queryInst);
            const historyId = 'myHistoryId';
            superQuery.then((dataSet) => {
                const getAll = dataSet.getAll.bind(dataSet);
                dataSet.getAll = () => {
                    const resultAll = new RecordSet({
                        keyProperty: 'department',
                        rawData: [
                            {
                                id: 1,
                                department: 'Разработка',
                                title: 'Разработка',
                                parent: null,
                                '@parent': true,
                            },
                            {
                                id: 11,
                                department: 'Платформа',
                                title: 'Платформа',
                                parent: 'Разработка',
                                '@parent': null,
                            },
                            {
                                id: 12,
                                department: 'Каталоги',
                                title: 'Каталоги',
                                parent: 'Разработка',
                                '@parent': null,
                            },
                            {
                                id: 3,
                                department: 'Федеральная клиентская служба',
                                title: 'Федеральная клиентская служба',
                                parent: null,
                                '@parent': null,
                            },
                            {
                                id: 2,
                                department: 'Продвижение СБИС',
                                title: 'Продвижение СБИС',
                                parent: null,
                                '@parent': null,
                            },
                        ],
                    });
                    const history = Store.getLocal(historyId);
                    const inputHistoryResult = new RecordSet({
                        rawData: [],
                        keyProperty: resultAll.getKeyProperty(),
                    });
                    const inputHistoryMeta = {};

                    resultAll.setKeyProperty('department');

                    ['pinned', 'recent', 'frequent'].forEach((key: string) => {
                        history[key].each((el) => {
                            const historyItem = resultAll.getRecordById(el.getKey());
                            if (historyItem) {
                                if (!inputHistoryResult.getRecordById(historyItem.getKey())) {
                                    inputHistoryResult.add(historyItem);
                                    inputHistoryMeta[el.getKey()] = key;
                                }
                            }
                        });
                    });
                    if (!inputHistoryMeta.hasOwnProperty('Продвижение СБИС')) {
                        inputHistoryMeta['Продвижение СБИС'] = 'recent';
                    }
                    resultAll.setMetaData({
                        input_history_result: inputHistoryResult,
                        input_history_meta: inputHistoryMeta,
                    });
                    return resultAll;
                };
                resolve(dataSet);
                return dataSet;
            });
        });
    }

    protected _applyPaging(data: any, offset?: number, limit?: number) {
        const newDataAdapter = this.getAdapter().forTable();

        const items = new RecordSet({ keyProperty: 'department', rawData: this.data });

        items.each((item) => {
            newDataAdapter.add(item.getRawData());
        });
        return data ? data : newDataAdapter.getData();
    }
}

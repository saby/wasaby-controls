import { Memory } from 'Types/source';
import { Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { CrudWrapper } from 'Controls/dataSource';
import { ErrorViewConfig } from 'Controls/error';

const data = [
    {
        id: 1,
        title: 'Первый',
        type: 1,
    },
    {
        id: 2,
        title: 'Второй',
        type: 2,
    },
    {
        id: 3,
        title: 'Третий',
        type: 2,
    },
];

const dataExt = [
    {
        id: 10,
        title: 'Десятый',
        type: 1,
    },
    {
        id: 11,
        title: 'Одиннадцатый',
        type: 2,
    },
    {
        id: 12,
        title: 'Двенадцатый',
        type: 2,
    },
];

describe('Controls/_dataSource/CrudWrapper', () => {
    let source: Memory;
    let crudWrapper: CrudWrapper;

    describe('create', () => {
        it('should return Promise<Record>', () => {
            source = new Memory({
                data: [...data],
                keyProperty: 'id',
            });
            crudWrapper = new CrudWrapper({ source });
            return crudWrapper
                .create({
                    id: 666,
                    title: 'Запись 666',
                })
                .then((record: Record) => {
                    expect(record.get('title')).toEqual('Запись 666');
                })
                .catch((errorData: ErrorViewConfig) => {
                    expect(true).not.toBe(true);
                });
        });
    });

    describe('read', () => {
        it('should return Promise<Record>', () => {
            source = new Memory({
                data: [...data],
                keyProperty: 'id',
            });
            crudWrapper = new CrudWrapper({ source });
            return crudWrapper
                .read(1)
                .then((record: Record) => {
                    expect(record.get('title')).toEqual('Первый');
                })
                .catch((errorData: ErrorViewConfig) => {
                    expect(true).not.toBe(true);
                });
        });
    });
    describe('update', () => {
        let record: Record;

        beforeEach(() => {
            record = new Record();
            record.setRawData({
                id: 1,
                title: 'Первый_',
                type: 1,
            });
        });

        it('should return Promise<null>', () => {
            source = new Memory({
                data: [...data],
                keyProperty: 'id',
            });
            crudWrapper = new CrudWrapper({ source });
            return crudWrapper
                .update(record)
                .then(() => {
                    expect(true).toBe(true);
                })
                .catch((errorData: ErrorViewConfig) => {
                    expect(true).not.toBe(true);
                });
        });
    });
    describe('query', () => {
        it('should return Promise<DataSet>', () => {
            source = new Memory({
                data: [...data],
                keyProperty: 'id',
            });
            crudWrapper = new CrudWrapper({ source });
            return crudWrapper
                .query({
                    filter: {},
                    sorting: [],
                })
                .then((recordSet: RecordSet) => {
                    expect(recordSet.at(0).get('id')).toEqual(1);
                })
                .catch((errorData: ErrorViewConfig) => {
                    expect(true).not.toBe(true);
                });
        });
    });
    describe('destroy', () => {
        it('should return Promise<null>', () => {
            source = new Memory({
                data: [...data],
                keyProperty: 'id',
            });
            crudWrapper = new CrudWrapper({ source });
            return crudWrapper
                .destroy(1)
                .then(() => {
                    expect(true).toBe(true);
                })
                .catch((errorData: ErrorViewConfig) => {
                    expect(true).not.toBe(true);
                });
        });
    });

    describe('updateOptions', () => {
        it('new source', () => {
            source = new Memory({
                data: [...data],
                keyProperty: 'id',
            });
            crudWrapper = new CrudWrapper({ source });

            return crudWrapper.query({ filter: {}, sorting: [] }).then((rs) => {
                expect('Первый').toEqual(rs.at(0).get('title'));

                crudWrapper.updateOptions({
                    source: new Memory({
                        data: [...dataExt],
                        keyProperty: 'id',
                    }),
                });
                return crudWrapper.query({ filter: {}, sorting: [] }).then((rsExt) => {
                    expect('Десятый').toEqual(rsExt.at(0).get('title'));
                });
            });
        });
    });
});

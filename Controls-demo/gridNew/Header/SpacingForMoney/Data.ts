import { CrudEntityKey } from 'Types/source';
import { Model, adapter as EntityAdapter } from 'Types/entity';
import { IColumn, IHeaderCell } from 'Controls/grid';

import * as headerCellTemplate from 'wml!Controls-demo/gridNew/Header/SpacingForMoney/HeaderColumn';
import * as resultCellTemplate from 'wml!Controls-demo/gridNew/Header/SpacingForMoney/ResultColumn';
import * as cellTemplate from 'wml!Controls-demo/gridNew/Header/SpacingForMoney/Column';

interface IData {
    key: CrudEntityKey;
    title: string;
    documentSign: number;
    taxBase: number;
    document: string;
}

export const Data = {
    getData: (): IData[] => {
        return [
            {
                key: 1,
                title: 'Новороссийский морской торговый порт',
                documentSign: 145465097,
                taxBase: 17215.0,
                document: 'б/н',
            },
            {
                key: 2,
                title: 'Морской порт Санкт-Петербург',
                documentSign: 1015108104,
                taxBase: 21015.0,
                document: '48000560-ABCC',
            },
            {
                key: 3,
                title: 'Морской торговый порт Усть-Луга',
                documentSign: 2418052,
                taxBase: 890145.04,
                document: '456990005',
            },
        ];
    },
    getHeader: (): IHeaderCell[] => {
        return [
            { caption: 'Порт прибытия' },
            { caption: 'База налогообложения', template: headerCellTemplate },
            { caption: 'Номер накладной' },
            { caption: 'Код накладной' },
        ];
    },
    getColumns: (): IColumn[] => {
        return [
            {
                displayProperty: 'title',
                width: '300px',
            },
            {
                displayProperty: 'taxBase',
                width: '200px',
                template: cellTemplate,
                resultTemplate: resultCellTemplate,
                align: 'right',
            },
            {
                displayProperty: 'documentSign',
                width: '150px',
                align: 'right',
            },
            {
                displayProperty: 'document',
                width: '150px',
            },
        ];
    },
    getMeta(adapter: EntityAdapter.IAdapter): Model {
        return new Model({
            adapter,
            format: [
                { name: 'documentSign', type: 'real' },
                { name: 'taxBase', type: 'real' },
            ],
            rawData: {
                documentSign: '1162991253',
                taxBase: '928375.04',
            },
        });
    },
};

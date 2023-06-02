import { IHeaderCell } from 'Controls/grid';
import { IColumn } from 'Controls/grid';
import * as baseEditor from 'wml!Controls-demo/gridNew/EditInPlace/Decorators/baseEditor';
import * as moneyEditor from 'wml!Controls-demo/gridNew/EditInPlace/Decorators/moneyEditor';
import * as numberEditor from 'wml!Controls-demo/gridNew/EditInPlace/Decorators/numberEditor';
import * as defaultEditor from 'wml!Controls-demo/gridNew/EditInPlace/Decorators/defaultEditor';
import { IEditingData } from './Editing';

export const DecoratedEditing = {
    getDecoratedEditingData: (): IEditingData[] => {
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
    getDecoratedEditingHeader: (): IHeaderCell[] => {
        return [
            { title: 'Порт прибытия' },
            { title: 'Цена по накладной' },
            { title: 'Номер накладной' },
            { title: 'Код накладной' },
        ];
    },
    getDecoratedEditingColumns: (): IColumn[] => {
        return [
            {
                displayProperty: 'title',
                width: '300px',
                template: baseEditor,
            },
            {
                displayProperty: 'taxBase',
                width: '200px',
                template: moneyEditor,
            },
            {
                displayProperty: 'documentSign',
                width: '150px',
                template: numberEditor,
            },
            {
                displayProperty: 'document',
                width: '150px',
                template: defaultEditor,
            },
        ];
    },
};

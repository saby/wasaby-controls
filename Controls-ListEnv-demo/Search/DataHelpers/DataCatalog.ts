import * as explorerImages from 'Controls-ListEnv-demo/Search/DataHelpers/ExplorerImagesLayout';
import * as editingColumnTemplate from 'wml!Controls-ListEnv-demo/Search/DataHelpers/editingCellTemplate';
import * as notEditableTemplate from 'wml!Controls-ListEnv-demo/Search/DataHelpers/notEditableCell';
import * as CntTpl from 'wml!Controls-demo/explorerNew/SearchWithPhoto/content';
import * as CntTplLadder from 'wml!Controls-demo/explorerNew/SearchWithLadderPhoto/content';
import { IHeaderCell } from 'Controls/grid';
import { IColumn } from 'Controls/grid';
import { groupConstants } from 'Controls/list';

/* eslint-disable max-len */
const LOREM =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc posuere nulla ex, consectetur lacinia odio blandit sit amet.';

interface IGenerateDataOptions<TEntityData = {}> {
    count: number;
    keyProperty?: string;
    entityTemplate?: Record<string, 'number' | 'string' | 'lorem'>;
    beforeCreateItemCallback?: (item: TEntityData) => void | false;
}

export interface IData {
    id: number;
    parent: null | number;
    'parent@': null | Boolean;
    title: string;
    discr?: string;
    price?: number | string;
    isDocument?: Boolean;
    code?: string;
    image?: string;
    group?: string;
    // Специальное свойство для того, чтобы вывести в поиске хлебные крошки в несколько строк
    SearchResult?: boolean;
}

export const DataWithLongFolderName = {
    getManyData: (): IData[] => {
        return [
            {
                id: 1,
                parent: null,
                'parent@': true,
                title: 'Документы отделов',
            },
            {
                id: 11,
                parent: 1,
                'parent@': true,
                title: '1. Электронный документооборот',
            },
            {
                id: 12,
                parent: 1,
                'parent@': true,
                title: '2. Отчетность через интернет',
            },
            {
                id: 121,
                parent: 12,
                'parent@': true,
                title: 'Papo4ka',
            },
            {
                id: 1211,
                parent: 121,
                'parent@': true,
                title: 'Doc1',
                isDocument: true,
            },
            {
                id: 1212,
                parent: 121,
                'parent@': true,
                title: 'Doc12',
                isDocument: true,
            },
            {
                id: 122,
                parent: 12,
                'parent@': true,
                title: 'Papo4ka2',
            },
            {
                id: 13,
                parent: 1,
                'parent@': null,
                title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                isDocument: true,
            },
            {
                id: 14,
                parent: 1,
                'parent@': null,
                title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                isDocument: true,
            },
            {
                id: 15,
                parent: 1,
                'parent@': null,
                title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                isDocument: true,
            },
            {
                id: 16,
                parent: 1,
                'parent@': null,
                title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                isDocument: true,
            },
            {
                id: 17,
                parent: 1,
                'parent@': null,
                title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                isDocument: true,
            },
            {
                id: 18,
                parent: 1,
                'parent@': null,
                title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                isDocument: true,
            },
            {
                id: 19,
                parent: 1,
                'parent@': null,
                title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                isDocument: true,
            },
            {
                id: 111,
                parent: 11,
                'parent@': true,
                title: 'Задачи',
            },
            {
                id: 91,
                parent: 111,
                'parent@': true,
                title: 'Очень длинный текст внтури папки "Задачи"',
            },
            {
                id: 92,
                parent: 91,
                'parent@': true,
                title: 'Очень длинный текст внтури папки "Очень длинный текст внтури папки Задачи"',
            },
            {
                id: 94,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 95,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 96,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 97,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 98,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 99,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 911,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 912,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 913,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 914,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 915,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 916,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 917,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 918,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 919,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 920,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 921,
                parent: 92,
                'parent@': null,
                title: 'Задача',
            },
            {
                id: 112,
                parent: 11,
                'parent@': null,
                title: 'Сравнение систем по учету рабочего времени.xlsx',
                isDocument: true,
            },
            {
                id: 2,
                parent: null,
                'parent@': true,
                title: 'Техническое задание',
            },
            {
                id: 21,
                parent: 2,
                'parent@': null,
                title: 'PandaDoc.docx',
                isDocument: true,
            },
            {
                id: 22,
                parent: 2,
                'parent@': null,
                title: 'SignEasy.docx',
                isDocument: true,
            },
            {
                id: 3,
                parent: null,
                'parent@': true,
                title: 'Анализ конкурентов',
            },
            {
                id: 4,
                parent: null,
                'parent@': null,
                title: 'Договор на поставку печатной продукции',
                isDocument: true,
            },
            {
                id: 5,
                parent: null,
                'parent@': null,
                title: 'Договор аренды помещения',
                isDocument: true,
            },
            {
                id: 6,
                parent: null,
                'parent@': null,
                title: 'Конфеты',
            },
            {
                id: 7,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
            {
                id: 71,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
            {
                id: 72,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
            {
                id: 73,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
            {
                id: 74,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
            {
                id: 75,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
            {
                id: 76,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
            {
                id: 77,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
            {
                id: 78,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
            {
                id: 79,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
            {
                id: 80,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
            {
                id: 81,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
            {
                id: 82,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
            {
                id: 83,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
            {
                id: 84,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
            {
                id: 85,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
            {
                id: 86,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                isDocument: true,
            },
        ];
    },
    getData: (): IData[] => {
        return [
            {
                id: 1,
                parent: null,
                'parent@': true,
                title: 'Папка 1. ДлинноеназваниеДлинноеназваниеДлинноеназвание',
            },
            {
                id: 11,
                parent: 1,
                'parent@': null,
                title: 'Файл 11',
            },
            {
                id: 12,
                parent: 1,
                'parent@': null,
                title: 'Файл 12',
            },
        ];
    },

    getColumns: (): IColumn[] => {
        return [
            {
                displayProperty: 'title',
                width: '1fr',
                textOverflow: 'ellipsis',
            },
        ];
    },
};
export const Gadgets = {
    getData: (): IData[] => {
        return [
            {
                id: 1,
                parent: null,
                'parent@': true,
                title: 'Документы отделов',
                group: groupConstants.hiddenGroup,
                discr: '5',
                price: 123,
            },
            {
                id: 11,
                parent: 1,
                'parent@': true,
                title: '1. Электронный документооборот',
                group: groupConstants.hiddenGroup,
                discr: '5',
                price: 123,
            },
            {
                id: 12,
                parent: 1,
                'parent@': true,
                title: '2. Отчетность через интернет',
                group: groupConstants.hiddenGroup,
                discr: '5',
                price: 123,
            },
            {
                id: 121,
                parent: 12,
                'parent@': true,
                title: 'Papo4ka',
                group: groupConstants.hiddenGroup,
                discr: '5',
                price: 123,
            },
            {
                id: 1211,
                parent: 121,
                'parent@': true,
                title: 'Doc1',
                group: groupConstants.hiddenGroup,
                isDocument: true,
                discr: '5',
                price: 123,
            },
            {
                id: 1212,
                parent: 121,
                'parent@': true,
                title: 'Doc12',
                group: groupConstants.hiddenGroup,
                isDocument: true,
                discr: '5',
                price: 123,
            },
            {
                id: 122,
                parent: 12,
                'parent@': true,
                title: 'Papo4ka2',
                group: groupConstants.hiddenGroup,
                discr: '5',
                price: 123,
            },
            {
                id: 13,
                parent: 1,
                'parent@': null,
                title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
            },
            {
                id: 14,
                parent: 1,
                'parent@': null,
                title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
            },
            {
                id: 15,
                parent: 1,
                'parent@': null,
                title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
            },
            {
                id: 16,
                parent: 1,
                'parent@': null,
                title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
            },
            {
                id: 17,
                parent: 1,
                'parent@': null,
                title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
            },
            {
                id: 18,
                parent: 1,
                'parent@': null,
                title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
            },
            {
                id: 19,
                parent: 1,
                'parent@': null,
                title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
            },
            {
                id: 111,
                parent: 11,
                'parent@': true,
                title: 'Задачи',
                group: groupConstants.hiddenGroup,
                discr: '5',
                price: 123,
            },
            {
                id: 112,
                parent: 11,
                'parent@': null,
                title: 'Сравнение систем по учету рабочего времени.xlsx',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
            },
            {
                id: 2,
                parent: null,
                'parent@': true,
                title: 'Техническое задание',
                group: groupConstants.hiddenGroup,
                discr: '5',
                price: 123,
            },
            {
                id: 21,
                parent: 2,
                'parent@': null,
                title: 'PandaDoc.docx',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
            },
            {
                id: 22,
                parent: 2,
                'parent@': null,
                title: 'SignEasy.docx',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
            },
            {
                id: 3,
                parent: null,
                'parent@': true,
                title: 'Анализ конкурентов',
                group: groupConstants.hiddenGroup,
                discr: '5',
                price: 123,
            },
            {
                id: 4,
                parent: null,
                'parent@': null,
                title: 'Договор на поставку печатной продукции',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
            },
            {
                id: 5,
                parent: null,
                'parent@': null,
                title: 'Договор аренды помещения',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
            },
            {
                id: 6,
                parent: null,
                'parent@': null,
                title: 'Конфеты',
                group: 'Файлы',
                discr: '5',
                price: 123,
            },
            {
                id: 82,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
                image: explorerImages[1],
            },
            {
                id: 83,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
                // eslint-disable-next-line
                image: explorerImages[2],
            },
            {
                id: 84,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
                // eslint-disable-next-line
                image: explorerImages[3],
            },
            {
                id: 85,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
                // eslint-disable-next-line
                image: explorerImages[4],
            },
            {
                id: 86,
                parent: null,
                'parent@': null,
                title: 'Скриншот от 25.12.16, 11-37-16',
                group: 'Файлы',
                isDocument: true,
                discr: '5',
                price: 123,
                // eslint-disable-next-line
                image: explorerImages[5],
            },
        ];
    },

    getColumns: () => {
        return [
            {
                displayProperty: 'title',
                width: '1fr',
            },
        ];
    },

    getGridColumns: () => {
        return [
            {
                displayProperty: 'title',
                width: '200px',
            },
            {
                displayProperty: 'discr',
                width: '1fr',
            },
            {
                displayProperty: 'price',
                width: '1fr',
            },
        ];
    },

    getGridEditingCol: () => {
        return [
            {
                displayProperty: 'title',
                width: '200px',
                template: editingColumnTemplate,
            },
            {
                displayProperty: 'discr',
                width: '1fr',
                template: notEditableTemplate,
            },
        ];
    },

    getGridColumnsForScroll: () => {
        return [
            {
                displayProperty: 'title',
                width: '150px',
            },
            {
                displayProperty: 'id',
                width: 'max-content',
                align: 'right',
            },
            {
                displayProperty: 'discr',
                width: '200px',
                align: 'right',
            },
            {
                displayProperty: 'price',
                width: '200px',
                align: 'right',
            },
        ];
    },

    getHeader(): IHeaderCell[] {
        return [
            {
                title: '',
            },
            {
                title: 'Рейтинг покупателей',
            },
            {
                title: 'Страна производитель',
            },
        ];
    },

    getSearchData(includeHiddenNode: boolean = false): IData[] {
        const data = [
            {
                id: 1,
                parent: null,
                'parent@': true,
                code: null,
                price: null,
                title: 'Комплектующие',
                image: null,
                SearchResult: false,
            },
            {
                id: 11,
                parent: 1,
                'parent@': true,
                code: null,
                price: null,
                title: 'Жесткие диски',
                image: null,
                SearchResult: false,
            },
            {
                id: 111,
                parent: 11,
                'parent@': true,
                code: null,
                price: null,
                title: 'SATA',
                image: null,
                SearchResult: false,
            },
            {
                id: 1111,
                parent: 111,
                'parent@': null,
                code: 'ST1000NC001',
                price: 2800,
                title: 'Жесткий диск Seagate Original SATA-III 1Tb ST1000NC001 Constellation СS (7200rpm) 64Mb 3.5',
                image: explorerImages[0],
                SearchResult: false,
            },
            {
                id: 1112,
                parent: 111,
                'parent@': null,
                code: 'ST1100DX001',
                price: 3750,
                title: 'Жесткий диск Seagate Original SATA-III 2Tb ST2000DX001 Desktop SSHD (7200rpm) 64Mb 3.5',
                image: explorerImages[0],
                SearchResult: false,
            },
            {
                id: 1113,
                parent: 111,
                'parent@': null,
                code: 'ST2300CD001',
                price: 6500,
                title: 'Жесткий диск Seagate Original SATA-III 2Tb ST2000NC001 Constellation СS (7200rpm) 64Mb 3.5',
                image: explorerImages[0],
                SearchResult: false,
            },
            {
                id: 112,
                parent: 11,
                'parent@': true,
                code: null,
                price: null,
                title: 'SAS',
                image: null,
                SearchResult: false,
            },
            {
                id: 1121,
                parent: 112,
                'parent@': null,
                code: 'ST1000NC001',
                price: 3600,
                title: 'Жесткий диск Seagate Original SAS SATA-III 1Tb ST1000NC001 Constellation СS (7200rpm) 64Mb 3.5',
                image: explorerImages[0],
                SearchResult: false,
            },
            {
                id: 1122,
                parent: 112,
                'parent@': null,
                code: 'ST1100DX001',
                price: 4870,
                title: 'Жесткий диск Seagate Original SAS SATA-III 2Tb ST2000DX001 Desktop SSHD (7200rpm) 64Mb 3.5',
                image: explorerImages[0],
                SearchResult: false,
            },
            {
                id: 1123,
                parent: 112,
                'parent@': null,
                code: 'ST2300CD001',
                price: 5250,
                title: 'Жесткий диск Seagate Original SAS SATA-III 2Tb ST2000NC001 Constellation СS (7200rpm) 64Mb 3.5',
                image: explorerImages[0],
                SearchResult: false,
            },
            {
                id: 2,
                parent: null,
                'parent@': true,
                code: null,
                price: null,
                title: 'Компьютеры',
                image: null,
                SearchResult: false,
            },
            {
                id: 21,
                parent: 2,
                'parent@': true,
                code: null,
                price: null,
                title: 'Аксессуары',
                image: null,
                SearchResult: false,
            },
            {
                id: 211,
                parent: 21,
                'parent@': true,
                code: null,
                price: null,
                title: 'Аксессуары для SATA',
                image: null,
                SearchResult: false,
            },
            {
                id: 3,
                parent: null,
                'parent@': true,
                code: null,
                price: null,
                title: 'Комплектующие для настольных персональных компьютеров фирмы "Формоза компьютерс"',
                image: null,
                SearchResult: false,
            },
            {
                id: 31,
                parent: 3,
                'parent@': true,
                code: null,
                price: null,
                title: 'Бывшие в употреблении',
                image: null,
                SearchResult: false,
            },
            {
                id: 311,
                parent: 31,
                'parent@': true,
                code: null,
                price: null,
                title: 'Восстановленные детали',
                image: null,
                SearchResult: false,
            },
            {
                id: 3111,
                parent: 311,
                'parent@': true,
                code: null,
                price: null,
                title: 'Жесткие диски SATA',
                image: null,
                SearchResult: false,
            },
            {
                id: 31111,
                parent: 3111,
                'parent@': null,
                code: 'ST1000NC001',
                price: 2800,
                title: 'Жесткий диск SATA-II 1Tb ST1000NC001 Constellation СS (7200rpm) 64Mb 3.5',
                image: explorerImages[0],
                SearchResult: false,
            },
            {
                id: 31112,
                parent: 3111,
                'parent@': null,
                code: 'ST1100DX001',
                price: 3750,
                title: 'Жесткий диск SATA-II 2Tb ST2000DX001 Desktop SSHD (7200rpm) 64Mb 3.5',
                image: explorerImages[0],
                SearchResult: false,
            },
            {
                id: 31113,
                parent: 3111,
                'parent@': null,
                code: 'ST2300CD001',
                price: 6500,
                title: 'Жесткий диск SATA-II 2Tb ST2000NC001 Constellation СS (7200rpm) 64Mb 3.5',
                image: explorerImages[0],
                SearchResult: false,
            },
            {
                id: 4,
                parent: null,
                'parent@': true,
                code: null,
                price: null,
                title: 'Цифровое фото и видео',
                SearchResult: true,
                image: null,
            },
            {
                id: 41,
                parent: 4,
                'parent@': true,
                code: null,
                price: null,
                title: 'Фотоаппараты',
                SearchResult: true,
                image: null,
            },
            {
                id: 411,
                parent: 41,
                'parent@': true,
                code: null,
                price: null,
                title: 'Canon',
                image: null,
                SearchResult: false,
            },
            {
                id: 4111,
                parent: 411,
                'parent@': null,
                code: 'FR-11434',
                price: 49500,
                title: 'Canon EOS 7D Body SATA support',
                image: explorerImages[0],
                SearchResult: false,
            },
            {
                id: 4112,
                parent: 411,
                'parent@': null,
                code: 'FT-13453',
                price: 144180,
                title: 'Canon EOS 5D Mark III Body SATA support',
                image: explorerImages[0],
                SearchResult: false,
            },
            {
                id: 5,
                parent: null,
                'parent@': null,
                code: 'FT-13352',
                price: 112360,
                title: 'Canon EOS 5D Mark II Body SATA support',
                image: explorerImages[0],
                SearchResult: false,
            },
        ];

        if (includeHiddenNode) {
            data.push(
                {
                    id: 6,
                    parent: null,
                    'parent@': false,
                    code: null,
                    price: null,
                    title: 'Цифровое фото и видео',
                    SearchResult: true,
                    image: null,
                },
                {
                    id: 61,
                    parent: 6,
                    'parent@': null,
                    code: 'FT-13352',
                    price: 112360,
                    title: 'Canon EOS 5D Mark II Body SATA support',
                    image: explorerImages[0],
                    SearchResult: false,
                }
            );
        }

        return data;
    },
    getSmallSearchData(): IData[] {
        return [
            {
                id: 1,
                parent: null,
                'parent@': true,
                code: null,
                price: null,
                title: 'Комплектующие',
                image: null,
                SearchResult: false,
            },
            {
                id: 11,
                parent: 1,
                'parent@': true,
                code: null,
                price: null,
                title: 'Жесткие диски',
                image: null,
                SearchResult: false,
            },
            {
                id: 111,
                parent: 11,
                'parent@': true,
                code: null,
                price: null,
                title: 'SATA',
                image: null,
                SearchResult: false,
            },
            {
                id: 1111,
                parent: 111,
                'parent@': null,
                code: 'ST1000NC001',
                price: 2800,
                title: 'Жесткий диск Seagate Original SATA-III 1Tb ST1000NC001 Constellation СS (7200rpm) 64Mb 3.5',
                image: explorerImages[0],
                SearchResult: false,
            },
            {
                id: 112,
                parent: 11,
                'parent@': true,
                code: null,
                price: null,
                title: 'SAS',
                image: null,
                SearchResult: false,
            },
            {
                id: 1121,
                parent: 112,
                'parent@': null,
                code: 'ST1000NC001',
                price: 3600,
                title: 'Жесткий диск Seagate Original SAS SATA-III 1Tb ST1000NC001 Constellation СS (7200rpm) 64Mb 3.5',
                image: explorerImages[0],
                SearchResult: false,
            },
            {
                id: 3,
                parent: null,
                'parent@': null,
                code: 'FT-13352',
                price: 112360,
                title: 'Canon EOS 5D Mark II Body SATA support',
                image: explorerImages[0],
                SearchResult: false,
            },
            {
                id: 4,
                parent: null,
                'parent@': null,
                code: 'ART-13352',
                price: 10160,
                title: 'AMD hDISK I Body SATA support',
                image: explorerImages[0],
                SearchResult: false,
            },
        ];
    },
    getSearchDataLongFolderName(): IData[] {
        return [
            {
                id: 1,
                parent: null,
                'parent@': true,
                code: null,
                price: null,
                title: 'Комплектующие',
            },
            {
                id: 11,
                parent: 1,
                'parent@': true,
                code: null,
                price: null,
                title: 'Жесткие диски ДлинноеназваниеДлинноеназваниеДлинноеназваниеДлинноеназваниеДлинноеназваниеДлинноеназвание',
            },
            {
                id: 111,
                parent: 11,
                'parent@': true,
                code: null,
                price: null,
                title: 'SATA',
            },
            {
                id: 1111,
                parent: 111,
                'parent@': null,
                code: 'ST1000NC001',
                price: 2800,
                title: 'Жесткий диск Seagate Original SATA-III 1Tb ST1000NC001 Constellation СS (7200rpm) 64Mb 3.5',
            },
            {
                id: 1112,
                parent: 111,
                'parent@': null,
                code: 'ST1100DX001',
                price: 3750,
                title: 'Жесткий диск Seagate Original SATA-III 2Tb ST2000DX001 Desktop SSHD (7200rpm) 64Mb 3.5',
            },
            {
                id: 1113,
                parent: 111,
                'parent@': null,
                code: 'ST2300CD001',
                price: 6500,
                title: 'Жесткий диск Seagate Original SATA-III 2Tb ST2000NC001 Constellation СS (7200rpm) 64Mb 3.5',
            },
            {
                id: 112,
                parent: 11,
                'parent@': true,
                code: null,
                price: null,
                title: 'SAS',
            },
            {
                id: 1121,
                parent: 112,
                'parent@': null,
                code: 'ST1000NC001',
                price: 3600,
                title: 'Жесткий диск Seagate Original SAS SATA-III 1Tb ST1000NC001 Constellation СS (7200rpm) 64Mb 3.5',
            },
            {
                id: 1122,
                parent: 112,
                'parent@': null,
                code: 'ST1100DX001',
                price: 4870,
                title: 'Жесткий диск Seagate Original SAS SATA-III 2Tb ST2000DX001 Desktop SSHD (7200rpm) 64Mb 3.5',
            },
            {
                id: 1123,
                parent: 112,
                'parent@': null,
                code: 'ST2300CD001',
                price: 5250,
                title: 'Жесткий диск Seagate Original SAS SATA-III 2Tb ST2000NC001 Constellation СS (7200rpm) 64Mb 3.5',
            },
            {
                id: 2,
                parent: null,
                'parent@': true,
                code: null,
                price: null,
                title: 'Компьютеры',
            },
            {
                id: 21,
                parent: 2,
                'parent@': true,
                code: null,
                price: null,
                title: 'Аксессуары',
            },
            {
                id: 211,
                parent: 21,
                'parent@': true,
                code: null,
                price: null,
                title: 'Аксессуары для SATA',
            },
            {
                id: 3,
                parent: null,
                'parent@': true,
                code: null,
                price: null,
                title: 'Комплектующие для настольных персональных компьютеров фирмы "Формоза компьютерс"',
            },
            {
                id: 31,
                parent: 3,
                'parent@': true,
                code: null,
                price: null,
                title: 'Бывшие в употреблении',
            },
            {
                id: 311,
                parent: 31,
                'parent@': true,
                code: null,
                price: null,
                title: 'Восстановленные детали',
            },
            {
                id: 3111,
                parent: 311,
                'parent@': true,
                code: null,
                price: null,
                title: 'Жесткие диски SATA',
            },
            {
                id: 4,
                parent: null,
                'parent@': true,
                code: null,
                price: null,
                title: 'Цифровое фото и видео',
            },
            {
                id: 41,
                parent: 4,
                'parent@': true,
                code: null,
                price: null,
                title: 'Фотоаппараты',
            },
            {
                id: 411,
                parent: 41,
                'parent@': true,
                code: null,
                price: null,
                title: 'Canon',
            },
            {
                id: 4111,
                parent: 411,
                'parent@': null,
                code: 'FR-11434',
                price: 49500,
                title: 'Canon EOS 7D Body SATA support',
            },
            {
                id: 4112,
                parent: 411,
                'parent@': null,
                code: 'FT-13453',
                price: 144180,
                title: 'Canon EOS 5D Mark III Body SATA support',
            },
            {
                id: 5,
                parent: null,
                'parent@': null,
                code: 'FT-13352',
                price: 112360,
                title: 'Canon EOS 5D Mark II Body SATA support',
            },
        ];
    },
    getSearchColumns(): IColumn[] {
        return [
            {
                displayProperty: 'title',
                width: '1fr',
            },
            {
                displayProperty: 'code',
                width: '150px',
            },
            {
                displayProperty: 'price',
                width: '150px',
            },
        ];
    },
    getSearchHeader(): IColumn[] {
        return [{ title: 'Наименование' }, { title: 'Код' }, { title: 'Цена' }];
    },
    getSearchColumnsWithColumnScroll(): IColumn[] {
        return [
            {
                displayProperty: 'title',
                width: '400px',
            },
            {
                displayProperty: 'code',
                width: 'auto',
            },
            {
                displayProperty: 'price',
                width: 'auto',
            },
        ];
    },
    getSearchColumnsWithPhoto(): IColumn[] {
        return [
            {
                displayProperty: 'title',
                template: CntTpl,
                width: '',
            },
            {
                displayProperty: 'code',
                width: '',
            },
            {
                displayProperty: 'price',
                width: '',
            },
        ];
    },
    getSearchColumnsWithLadderPhoto(): IColumn[] {
        return [
            {
                displayProperty: 'title',
                template: CntTplLadder,
                width: '',
            },
            {
                displayProperty: 'code',
                width: '',
            },
            {
                displayProperty: 'price',
                width: '',
            },
        ];
    },
    getSearchDataForColumnScroll(): IData[] {
        return [
            {
                id: 1,
                parent: null,
                'parent@': true,
                code: '2131521542341',
                price: 'Цены поставщика оборудования',
                title: 'Комплектующие',
                image: null,
                SearchResult: false,
            },
            {
                id: 11,
                parent: 1,
                'parent@': true,
                code: '2134215dsa41',
                price: 'Розничные цены на оборудование',
                title: 'Жесткие диски',
                image: null,
                SearchResult: false,
            },
            {
                id: 111,
                parent: 11,
                'parent@': true,
                code: 'kjn523452',
                price: 'Цены на оборудование без НДС ',
                title: 'SATA',
                image: null,
                SearchResult: false,
            },
            {
                id: 1111,
                parent: 111,
                'parent@': null,
                code: '1',
                price: 0,
                title: 'Жесткий диск Seagate Original SATA-III 1Tb ST1000NC001 Constellation СS (7200rpm) 64Mb 3.5',
                image: null,
                SearchResult: false,
            },
            {
                id: 1112,
                parent: 111,
                'parent@': null,
                code: '2',
                price: 0,
                title: 'Жесткий диск Seagate Original SATA-III 2Tb ST2000DX001 Desktop SSHD (7200rpm) 64Mb 3.5',
                image: null,
                SearchResult: false,
            },
            {
                id: 1113,
                parent: 111,
                'parent@': null,
                code: '3',
                price: 0,
                title: 'Жесткий диск Seagate Original SATA-III 2Tb ST2000NC001 Constellation СS (7200rpm) 64Mb 3.5',
                image: null,
                SearchResult: false,
            },
            {
                id: 112,
                parent: 11,
                'parent@': true,
                code: null,
                price: 'Цены поставщика оборудования',
                title: 'SAS',
                image: null,
                SearchResult: false,
            },
            {
                id: 1121,
                parent: 112,
                'parent@': null,
                code: '4',
                price: 0,
                title: 'Жесткий диск Seagate Original SAS SATA-III 1Tb ST1000NC001 Constellation СS (7200rpm) 64Mb 3.5',
                image: null,
                SearchResult: false,
            },
            {
                id: 1122,
                parent: 112,
                'parent@': null,
                code: '4',
                price: 0,
                title: 'Жесткий диск Seagate Original SAS SATA-III 2Tb ST2000DX001 Desktop SSHD (7200rpm) 64Mb 3.5',
                image: null,
                SearchResult: false,
            },
            {
                id: 1123,
                parent: 112,
                'parent@': null,
                code: '4',
                price: 0,
                title: 'Жесткий диск Seagate Original SAS SATA-III 2Tb ST2000NC001 Constellation СS (7200rpm) 64Mb 3.5',
                image: null,
                SearchResult: false,
            },
            {
                id: 2,
                parent: null,
                'parent@': true,
                code: '23542ycc5r24',
                price: 'Цены поставщика оборудования',
                title: 'Компьютеры',
                image: null,
                SearchResult: false,
            },
            {
                id: 21,
                parent: 2,
                'parent@': true,
                code: 'sadGV54asd34',
                price: 'Цены поставщика оборудования',
                title: 'Аксессуары',
                image: null,
                SearchResult: false,
            },
        ];
    },
};

function getFewCategories(): {
    key: number;
    title: string;
    description: string;
    byDemand?: 'Popular' | 'Unpopular' | 'Hit!';
    tplPath?: string;
    cursor?: 'default' | 'pointer';
    checkbox?: boolean;
    hovered?: boolean;
    value?: string;
}[] {
    return [
        {
            key: 1,
            title: 'Notebooks',
            description:
                'Trusted Reviews ranks all your top laptop and notebook options, whether you want a ...',
            byDemand: 'Popular',
            tplPath:
                'wml!Controls-demo/list_new/ItemTemplate/ItemTemplateProperty/itemTemplateNoHighlight',
            cursor: 'default',
            checkbox: false,
            hovered: false,
            value: 'cursor - default, hovered - false',
        },
        {
            key: 2,
            title: 'Tablets',
            byDemand: 'Unpopular',
            description:
                'Tablets are great for playing games, reading, homework, keeping kids entertained in the back seat of the car',
            hovered: true,
            checkbox: false,
            value: 'cursor - pointer, hovered - true',
        },
        {
            key: 3,
            title: 'Laptop computers',
            description:
                'Explore PCs and laptops to discover the right device that powers all that you do',
            byDemand: 'Unpopular',
            tplPath:
                'wml!Controls-demo/list_new/ItemTemplate/ItemTemplateProperty/itemTemplateWithDescription',
            cursor: 'default',
            hovered: true,
            checkbox: false,
            value: 'cursor - default, hovered - true',
        },
        {
            key: 4,
            title: 'Apple gadgets',
            description: 'Explore new Apple accessories for a range of Apple products',
            byDemand: 'Hit!',
            tplPath:
                'wml!Controls-demo/list_new/ItemTemplate/ItemTemplateProperty/itemTemplateNoHighlight',
            hovered: false,
            checkbox: false,
            value: 'cursor - pointer, hovered - false',
        },
        {
            key: 5,
            title: 'Android gadgets',
            description: 'These 25 clever phone accessories and Android-compatible gadgets',
            byDemand: 'Popular',
            tplPath:
                'wml!Controls-demo/list_new/ItemTemplate/ItemTemplateProperty/itemTemplateWithDescription',
            cursor: 'default',
            hovered: false,
            checkbox: false,
            value: 'cursor - default, hovered - false',
        },
    ];
}

const slowDownSource = (source: Memory, timeMs: number): void => {
    const originalQuery = source.query;

    source.query = (...args) => {
        return new Promise((success) => {
            setTimeout(() => {
                success(originalQuery.apply(source, args));
            }, timeMs);
        });
    };
};

/**
 * Генерирует массив объектов по заданному шаблону {названиеПоля: типПоля}
 * Note! Поддерживается только один уровень вложенности у шаблона объекта.
 *
 * @param {IGenerateDataOptions} cfg
 * @returns {Array<TEntityData extends Record<string, any>>}
 */
function generateData<
    // eslint-disable-next-line
    TEntityData extends Record<string, any> = {}
>({
    count,
    entityTemplate = {
        key: 'number',
        title: 'string',
    },
    keyProperty = 'key',
    // eslint-disable-next-line
    beforeCreateItemCallback = () => {},
}: IGenerateDataOptions<TEntityData>): TEntityData[] {
    const items: TEntityData[] = [];

    const createItem = (
        // eslint-disable-next-line
        entityTemplate: IGenerateDataOptions['entityTemplate'],
        forLoremPseudoRandom: number = 0
    ): TEntityData => {
        const item = {};

        Object.keys(entityTemplate).forEach((key) => {
            if (entityTemplate[key] === 'string') {
                item[key] = '';
            } else if (entityTemplate[key] === 'number') {
                item[key] = 0;
            } else if (entityTemplate[key] === 'lorem') {
                // eslint-disable-next-line
                item[key] =
                    forLoremPseudoRandom % 3 === 0
                        ? `${LOREM.slice(0, 110)}.`
                        : forLoremPseudoRandom % 2 === 0
                        ? `${LOREM} ${LOREM}`
                        : `${LOREM.slice(0, 50)}.`;
            } else {
                item[key] = entityTemplate[key];
            }
            item[key] = `${items.length + 1}) ${item[key]}`;
        });

        return item as TEntityData;
    };

    for (let i = 0; i < count; i++) {
        const item = createItem(entityTemplate, items.length);
        // eslint-disable-next-line
        item[keyProperty] = items.length;
        if (beforeCreateItemCallback(item) !== false) {
            items.push(item);
        }
    }

    return items;
}

export { getFewCategories, slowDownSource, generateData, getSearchData };

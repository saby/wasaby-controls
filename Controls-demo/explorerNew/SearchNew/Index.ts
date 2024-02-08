import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/explorerNew/SearchNew/Search';
import { Gadgets } from '../DataHelpers/DataCatalog';
import { HierarchicalMemory, Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { TRoot } from 'Controls-demo/types';
import { Model } from 'Types/entity';

import * as explorerImages from 'Controls-demo/explorerNew/ExplorerImagesLayout';
import { memoryFilter } from 'Controls-demo/treeGridNew/DemoHelpers/Filter/memoryFilter';

// Данные узлов имеют структуру, отличную от данных листов.
// Это должно приводить к тому, что в корне при проваливании в папку меняется RecordSet и разрушается модель.
const data = [
    {
        id: 1,
        parent: null,
        'parent@': true,
        code: null,
        price: null,
        title: 'Комплектующие',
        SearchResult: false,
    },
    {
        id: 11,
        parent: 1,
        'parent@': true,
        code: null,
        price: null,
        title: 'Жесткие диски',
        SearchResult: false,
    },
    {
        id: 111,
        parent: 11,
        'parent@': true,
        code: null,
        price: null,
        title: 'SATA',
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
        SearchResult: false,
    },
    {
        id: 21,
        parent: 2,
        'parent@': true,
        code: null,
        price: null,
        title: 'Аксессуары',
        SearchResult: false,
    },
    {
        id: 211,
        parent: 21,
        'parent@': true,
        code: null,
        price: null,
        title: 'Аксессуары для SATA',
        SearchResult: false,
    },
    {
        id: 3,
        parent: null,
        'parent@': true,
        code: null,
        price: null,
        title: 'Комплектующие для настольных персональных компьютеров фирмы "Формоза компьютерс"',
        SearchResult: false,
    },
    {
        id: 31,
        parent: 3,
        'parent@': true,
        code: null,
        price: null,
        title: 'Бывшие в употреблении',
        SearchResult: false,
    },
    {
        id: 311,
        parent: 31,
        'parent@': true,
        code: null,
        price: null,
        title: 'Восстановленные детали',
        SearchResult: false,
    },
    {
        id: 3111,
        parent: 311,
        'parent@': true,
        code: null,
        price: null,
        title: 'Жесткие диски SATA',
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
    },
    {
        id: 41,
        parent: 4,
        'parent@': true,
        code: null,
        price: null,
        title: 'Фотоаппараты',
        SearchResult: true,
    },
    {
        id: 411,
        parent: 41,
        'parent@': true,
        code: null,
        price: null,
        title: 'Canon',
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
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = Gadgets.getSearchColumns();
    protected _root: TRoot = 1;
    protected _startingWithBtnCaption: 'root' | 'current' = 'current';
    protected _startingWithSource: Memory = null;
    private _multiselect: 'visible' | 'hidden' = 'hidden';
    // eslint-disable-next-line
    protected _filter: object = { demo: 123 };
    protected _dedicatedItemProperty: string;

    protected _selectedKeys: [] = [];
    protected _excludedKeys: [] = [];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data,
            filter(item: Model, filter: object): boolean {
                return memoryFilter.call(this, item, filter, 'id');
            },
        });
        this._startingWithSource = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: 'root',
                    title: 'root',
                },
                {
                    id: 'current',
                    title: 'current',
                },
            ],
        });
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
    }

    protected _itemsReadyCallback(): void {
        if (this._children.search) {
            // Активируем стоку поиска. Список должен потерять фокус
            this._children.search.activate();
        }
    }

    protected _onToggle(): void {
        this._multiselect = this._multiselect === 'visible' ? 'hidden' : 'visible';
    }

    protected _onToggleDedicatedItemProperty(): void {
        this._dedicatedItemProperty = !this._dedicatedItemProperty ? 'SearchResult' : undefined;
    }

    protected _updateStartingWith(): void {
        this._startingWithBtnCaption = this._startingWith;
        this._startingWith = this._startingWith === 'root' ? 'current' : 'root';
    }
}

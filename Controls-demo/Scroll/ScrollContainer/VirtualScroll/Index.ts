import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/ScrollContainer/VirtualScroll/Template');
import { Memory, Query } from 'Types/source';
import { generateData } from '../../../list_new/DemoHelpers/DataCatalog';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

class DemoSource extends Memory {
    pending: Promise<unknown>;
    queryNumber: number = -1;
    query(query: Query): unknown {
        this.queryNumber++;
        if (this.queryNumber < 2) {
            return super.query(query);
        } else {
            return this.pending.then(() => {
                return super.query(query);
            });
        }
    }
}

export default class SlowVirtualScrollDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _viewSource: Memory;
    protected _columns: object[] = [
        {
            displayProperty: 'number',
            width: '40px',
        },
        {
            displayProperty: 'country',
            width: '200px',
        },
        {
            displayProperty: 'capital',
            width: '200px',
        },
    ];
    private _navigation: object = {};
    private count: number = 0;
    private _resolve: Function = null;

    private dataArray: object[] = generateData({
        keyProperty: 'id',
        count: 30,
        beforeCreateItemCallback: (item: any) => {
            item.capital = 'South';
            item.number = this.count + 1;
            item.country = Countries.COUNTRIES[this.count];
            this.count++;
        },
    });

    protected _beforeMount(): void {
        this._navigation = {
            source: 'page',
            view: 'infinity',
            sourceConfig: {
                pageSize: 5,
                page: 0,
                hasMore: false,
            },
        };

        this._viewSource = new DemoSource({
            keyProperty: 'id',
            data: this.dataArray,
        });
    }

    protected _afterMount(): void {
        this._viewSource.pending = new Promise((res) => {
            this._resolve = res;
        });
    }

    protected _onLoad(): void {
        this._resolve();
    }

    protected _onScroll(): void {
        this._children.scrollContainer.scrollTo(165);
    }

    static _styles: string[] = ['Controls-demo/Scroll/ScrollContainer/VirtualScroll/Style'];
}

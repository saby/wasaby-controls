import { Deferred } from 'Types/deferred';
import * as SearchMemory from 'Controls-demo/Search/SearchMemory';
import ICrud from './ICrud';
import { DataSet } from 'Types/source';

const SEARCH_DELAY = 3000;
const LONG_DELAY = 1000000;

export default class DelaySuggestSource {
    private source: ICrud;
    private _searchDelay = SEARCH_DELAY;
    protected _mixins: number[] = [];
    constructor(opts: object) {
        this.source = new SearchMemory(opts);
        this['[Types/_source/ICrud]'] = true;
    }

    getModel(): string {
        return this.source.getModel();
    }

    getKeyProperty(): string {
        return this.source.getKeyProperty();
    }

    query(): Promise<DataSet> {
        const origQuery = this.source.query.apply(this.source, arguments);
        const loadDef = new Deferred();

        setTimeout(() => {
            if (!loadDef.isReady()) {
                loadDef.callback();
            }
        }, this._searchDelay);
        loadDef.addCallback(() => {
            return origQuery;
        });
        return loadDef;
    }

    enableDelay(): void {
        this._searchDelay = LONG_DELAY;
    }

}

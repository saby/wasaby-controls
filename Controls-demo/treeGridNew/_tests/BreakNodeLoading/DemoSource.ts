import { DataSet, HierarchicalMemory, Query } from 'Types/source';

export default class HierarchicalMemoryWithBreakNodeLoading extends HierarchicalMemory {
    _moduleName = 'Controls-demo/treeGridNew/_tests/BreakNodeLoading/DemoSource';
    protected _restoreLoadingFn: Function;

    restoreLoading(): void {
        if (this._restoreLoadingFn) {
            this._restoreLoadingFn();
            this._restoreLoadingFn = null;
        }
    }

    breakLoading(restoreLoadingFn: Function): void {
        this._restoreLoadingFn = restoreLoadingFn;
    }

    isLoadingBreak(): boolean {
        return !!this._restoreLoadingFn;
    }

    query(query?: Query): Promise<DataSet> {
        const superResult = super.query(query);
        if (query.getWhere().parent !== null) {
            return new Promise((resolve, reject) => {
                this.breakLoading(() => {
                    resolve(superResult);
                });
            });
        } else {
            return superResult;
        }
    }
}

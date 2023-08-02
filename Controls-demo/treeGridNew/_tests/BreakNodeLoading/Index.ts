import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory, DataSet, Query } from 'Types/source';
import * as Template from 'wml!Controls-demo/treeGridNew/_tests/BreakNodeLoading/BreakNodeLoading';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

class HierarchicalMemoryWithBreakNodeLoading extends HierarchicalMemory {
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

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemoryWithBreakNodeLoading;
    protected _columns: unknown[] = Flat.getColumns();

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemoryWithBreakNodeLoading({
            keyProperty: 'key',
            data: Flat.getData(),
            parentProperty: 'parent',
        });
    }

    protected _buttonClick(): void {
        if (this._viewSource.isLoadingBreak()) {
            this._viewSource.restoreLoading();
        }
    }
}

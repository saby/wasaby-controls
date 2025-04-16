import { Memory } from 'Types/source';
import { DataSet, Query } from 'Types/source';

export default class ManualMemory extends Memory {
    private _queryResolver: () => void;
    private _isManual: boolean = false;
    query(query?: Query): Promise<DataSet> {
        return new Promise<DataSet>((resolve) => {
            const result = super.query(query);
            if (this._isManual) {
                this._queryResolver = () => {
                    resolve(result);
                };
            } else {
                resolve(result);
            }
        });
    }
    setManual(isManual: boolean) {
        this._isManual = isManual;
    }
    resolveQuery() {
        this._queryResolver();
    }
}

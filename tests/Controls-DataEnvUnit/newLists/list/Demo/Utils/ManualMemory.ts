import { Memory } from 'Types/source';
import { DataSet, Query } from 'Types/source';

export default class ManualMemory extends Memory {
    private _queryResolver?: () => void;
    private _queryRejector?: (error?: Error) => void;
    private _isManual: boolean = false;
    query(query?: Query): Promise<DataSet> {
        return new Promise<DataSet>((resolve, reject) => {
            const result = super.query(query);
            if (this._isManual) {
                this._queryResolver = () => {
                    resolve(result);
                };
                this._queryRejector = (error?: Error) => {
                    reject(error);
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
        if (this._queryResolver) {
            this._queryResolver();
            this._queryResolver = undefined;
        }
    }
    rejectQuery(error?: Error) {
        if (this._queryRejector) {
            this._queryRejector(error);
            this._queryRejector = undefined;
        }
    }
}

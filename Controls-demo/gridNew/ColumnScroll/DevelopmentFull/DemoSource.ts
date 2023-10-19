import { Memory } from 'Types/source';

export default class DemoSource extends Memory {
    private _qPromise: Promise<void>;
    private _qPromiseResolver: () => void;
    protected _moduleName: string = 'Controls-demo/gridNew/ColumnScroll/DevelopmentFull/DemoSource';

    setDelay(delay: number): void {
        this._delay = delay;
    }

    freezeQuerry() {
        if (!this._qPromise) {
            this._qPromise = new Promise((res) => {
                this._qPromiseResolver = res;
            });
        }
    }

    unfreezeQuerry() {
        if (this._qPromise) {
            this._qPromiseResolver();
            this._qPromiseResolver = null;
            this._qPromise = null;
        }
    }

    query(): Promise<any> {
        const args = arguments;
        return Promise.resolve()
            .then(() => {
                return this._qPromise;
            })
            .then(() => {
                return super.query.apply(this, args);
            });
    }
}

import { DataSet, IMemoryOptions, Memory, Query } from 'Types/source';

export interface IOptions extends IMemoryOptions {
    // Отложенный ответ (разрешение промиса управляется вручную). Используется только в режиме поиска
    deferResponse?: boolean;
}

// Если отложенный ответ придёт на SSR, то страница тупо зависнет.
function isClientRendering(): boolean {
    return typeof window !== 'undefined';
}

export class ManualResponseMemory extends Memory {
    private readonly _deferResponse: boolean;

    private _deferredResponse: Function;

    constructor(options: IOptions) {
        super(options);
        this._deferResponse = options.deferResponse;
    }

    callDeferredResponse(): void {
        if (this._deferredResponse) {
            this._deferredResponse();
            this._deferredResponse = null;
        }
    }

    query(query?: Query<unknown>): Promise<DataSet> {
        return super.query(query).then((result) => {
            return new Promise((resolve) => {
                const resolver = () => {
                    resolve(result);
                };
                if (this._deferResponse && isClientRendering()) {
                    this._deferredResponse = resolver;
                } else {
                    resolver();
                }
            });
        });
    }
}

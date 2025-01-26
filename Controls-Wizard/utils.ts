import { ILayoutOptions as IVerticalLayoutOptions } from 'Controls-Wizard/vertical';
import { ILayoutOptions as IHorizontalLayoutOptions } from 'Controls-Wizard/vertical';

type TOptions = IVerticalLayoutOptions | IHorizontalLayoutOptions;
type TRecordKey = Record<string | number | symbol, unknown>;
export type TContext = { _dataOptions: TRecordKey };

export function setDataOptions(this: TContext, options: TOptions, oldOptions: TOptions): void {
    if (oldOptions.selectedStepIndex !== options.selectedStepIndex) {
        if (options._dataOptionsValue) {
            if (!!options._dataOptionsValue.results[options.selectedStepIndex as number]) {
                this._dataOptions = getDataOptions(options);
            } else {
                const loadResult = options._dataOptionsValue.load(
                    options._dataOptionsValue,
                    options.selectedStepIndex?.toString?.() || ''
                );
                if (loadResult instanceof Promise) {
                    loadResult.then((config) => {
                        this._dataOptions = config.results[
                            options.selectedStepIndex as number
                        ] as TRecordKey;
                    });
                } else {
                    this._dataOptions = options._dataOptionsValue.results[
                        options.selectedStepIndex as number
                    ] as TRecordKey;
                }
            }
        }
    }
}

export function getDataOptions(options: TOptions): TRecordKey {
    return options._dataOptionsValue?.results?.[options.selectedStepIndex as number] as TRecordKey;
}

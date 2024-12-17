import * as template from 'wml!Controls-Wizard/_horizontal/Layout/Layout';
import { Control, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import ILayout, { ILayoutOptions } from './ILayout';
import { EventUtils } from 'UI/Events';
import { TKey } from 'Controls/interface';

/**
 * Компонент для раскладки ленты шагов и визуального отображения шага.
 * @remark
 * {@link /doc/platform/developmentapl/interface-development/controls/navigation/master/#horizontal-master-layout Руководство разработчика}
 * @extends UI/Base:Control
 * @demo Controls-Wizard-demo/horizontal/horizontalBase/Index
 * @public
 */
export default class Layout extends Control<ILayoutOptions> implements ILayout {
    readonly '[Controls-Wizard/_horizontal/ILayout]': boolean = true;
    readonly '[Controls-Wizard/_horizontal/IStep]': boolean = true;
    readonly '[Controls-Wizard/IStep]': boolean = true;

    protected _template: TemplateFunction = template;
    protected items: RecordSet;
    protected tmplNotify: Function = EventUtils.tmplNotify;
    protected _dataOptions: Record<TKey, unknown>;

    protected _beforeMount(options: ILayoutOptions): void {
        this.items = new RecordSet({ rawData: options.items });
        if (options._dataOptionsValue) {
            this._dataOptions = this._getDataOptions(options);
        }

        if (options.selectedStepIndex !== this._options.selectedStepIndex) {
            if (options._dataOptionsValue) {
                if (!!options._dataOptionsValue.results[options.selectedStepIndex]) {
                    this._dataOptions = this._getDataOptions(options);
                } else {
                    const loadResult = options._dataOptionsValue.load(
                        options._dataOptionsValue,
                        options.selectedStepIndex.toString()
                    );
                    if (loadResult instanceof Promise) {
                        loadResult.then((config) => {
                            this._dataOptions = config.results[options.selectedStepIndex] as Record<
                                TKey,
                                unknown
                            >;
                        });
                    } else {
                        this._dataOptions = options._dataOptionsValue.results[
                            options.selectedStepIndex
                        ] as Record<TKey, unknown>;
                    }
                }
            }
        }
    }

    protected _beforeUpdate(options: ILayoutOptions): void {
        if (options.items !== this._options.items) {
            this.items = new RecordSet({ rawData: options.items });
        }
    }

    protected _shouldLoadInAsync(template: string | TemplateFunction): boolean {
        return typeof template === 'string';
    }

    private _getDataOptions(options: ILayoutOptions): Record<TKey, unknown> {
        return options._dataOptionsValue?.results?.[options.selectedStepIndex] as Record<
            TKey,
            unknown
        >;
    }
}

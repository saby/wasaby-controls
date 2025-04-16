import * as template from 'wml!Controls-Wizard/_horizontal/Layout/Layout';
import { Control, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import ILayout, { ILayoutOptions } from './ILayout';
import { EventUtils } from 'UI/Events';
import { TKey } from 'Controls/interface';
import { setDataOptions, TContext, getDataOptions } from 'Controls-Wizard/utils';

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
            this._dataOptions = getDataOptions(options as ILayoutOptions);
        }
        setDataOptions.apply(this as unknown as TContext, [options, this._options]);
    }

    protected _beforeUpdate(options: ILayoutOptions): void {
        if (options.items !== this._options.items) {
            this.items = new RecordSet({ rawData: options.items });
        }
    }

    protected _shouldLoadInAsync(template: string | TemplateFunction): boolean {
        return typeof template === 'string';
    }
}

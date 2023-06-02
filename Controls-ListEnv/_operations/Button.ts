import { descriptor, DescriptorValidator } from 'Types/entity';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_operations/Button';
import { IBrowserSlice } from 'Controls/context';
import { Logger } from 'UI/Utils';
import { SyntheticEvent } from 'UI/Events';

export interface IOperationsButtonWidget extends IControlOptions {
    _dataOptionsValue: Record<string, IBrowserSlice>;
    storeId: string;
}

export default class OperationsButtonWidget extends Control<IOperationsButtonWidget> {
    protected _template: TemplateFunction = template;

    protected _beforeMount(options: IOperationsButtonWidget): void {
        const slice = options._dataOptionsValue[options.storeId];
        if (options.storeId && slice['[ICompatibleSlice]']) {
            Logger.warn(
                'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                    " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
            );
        }
    }

    protected _expandedChanged(e: SyntheticEvent, expanded: boolean): void {
        const slice = this._options._dataOptionsValue[this._options.storeId];
        if (expanded) {
            slice.openOperationsPanel();
        } else {
            slice.closeOperationsPanel();
        }
    }

    static getOptionTypes(): Partial<
        Record<keyof IOperationsButtonWidget, DescriptorValidator>
    > {
        return {
            storeId: descriptor(String).required(),
            _dataOptionsValue: descriptor(Object).required(),
        };
    }
}

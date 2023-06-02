import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Filtering/Filtering';
import { connectToDataContext, IContextValue } from 'Controls/context';
import 'css!DemoStand/Controls-demo';

const defaultButtonText = 'Выключить фильтр';

interface IOptions extends IControlOptions {
    _dataOptionsValue: IContextValue;
}

class Filtering extends Control {
    protected _template: TemplateFunction = Template;
    protected _buttonText: string = defaultButtonText;
    protected _slice: unknown = null;

    protected _beforeMount(options: IOptions): void {
        this._slice = options._dataOptionsValue.gadgets;
    }

    protected _handleButtonClick(): void {
        if (!this._slice.state.filter) {
            this._buttonText = defaultButtonText;
            this._slice.setFilter({
                title: ['Notebooks', 'Tablets', 'Laptop computers'],
            });
        } else {
            this._slice.setFilter(null);
            this._buttonText = 'Включить фильтр';
        }
    }
}

export default connectToDataContext(Filtering);

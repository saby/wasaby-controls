import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import TumblerTemplate = require('wml!Controls/_filter/FilterTumblerContainer/FilterTumblerContainer');
import {default as Store} from 'Controls/Store';
import {RecordSet} from 'Types/collection';
import {ITumblerOptions} from 'Controls/toggle';
import { IContextOptionsValue } from 'Controls/_context/ContextOptions';
import 'css!Controls/filter';

interface IFilterTumblerOptions extends ITumblerOptions {
    useStore?: boolean;
    _dataOptionsValue?: IContextOptionsValue;
}

/**
 * Контрол используют в качестве контейнера для кнопочного переключателя {@link Controls/toggle:Tumbler}.
 * @class Controls/_filter/FilterTumblerContainer
 * @extends UI/Base:Control
 * @mixes Controls/toggle:Tumbler
 * @author Мельникова Е.А.
 * @public
 */

export default class FilterTumblerContainer extends Control<ITumblerOptions> {
    protected _template: TemplateFunction = TumblerTemplate;
    protected _items: RecordSet = null;
    protected _selectedKey: Number | String = null;

    protected _beforeMount(options: IFilterTumblerOptions, context, another): void {
        this._initTumblerStates(options);
    }

    protected _beforeUpdate(newOptions: IFilterTumblerOptions): void {
        this._initTumblerStates(newOptions);
    }

    protected _handleSelectedKeyChanged(event: Event, key: Number | String): void {
        if (this._options.useStore) {
            Store.dispatch('selectedKey', key);
        }
    }

    private _initTumblerStates(options: IFilterTumblerOptions): void {
        if (options.useStore) {
            this._setStoreState();
        } else {
            this._items = options._dataOptionsValue?.items || options.items;
            this._selectedKey = options.selectedKey;
        }
    }

    private _setStoreState(): void {
        const storeState = Store.getState();
        this._items = storeState.items;
        this._selectedKey = storeState.selectedKey;
    }
}

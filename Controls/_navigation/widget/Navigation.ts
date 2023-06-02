import { Control } from 'UICore/Base';
import { IControlOptions, TemplateFunction } from 'UICommon/base';
import * as template from 'wml!Controls/_navigation/widget/Navigation';
import { IListConfigResult } from 'Controls/dataSource';
import { IContextOptionsValue } from 'Controls/context';
import { CrudEntityKey } from 'Types/source';
import { INavigationControlOptions } from 'Controls/_navigation/control/Navigation';
import { SyntheticEvent } from 'UI/Vdom';

export interface INavigationWidgetOptions
    extends INavigationControlOptions,
        IControlOptions {
    storeId: string | number;
    _dataOptionsValue: IContextOptionsValue;
}

export default class Navigation extends Control<INavigationWidgetOptions> {
    protected _template: TemplateFunction = template;

    protected _root: CrudEntityKey;

    // region ActiveElement

    protected _getActiveElement(): CrudEntityKey {
        const config = this._options._dataOptionsValue;
        return config.activeElement !== undefined
            ? config.activeElement
            : this._options.activeElement;
    }

    protected _onActiveElementChanged(
        event: SyntheticEvent,
        activeElement: CrudEntityKey
    ): void {
        this._getListConfig().setState({ activeElement });

        // TODO только для навигации в newBrowser, список не обернут в widget/list, поэтому с контекстами не работает
        this._notify('activeElementChanged', [activeElement]);
    }

    // endregion ActiveElement

    // region helpers

    private _getListConfig(
        options: INavigationWidgetOptions = this._options
    ): IListConfigResult {
        const id =
            options.storeId ||
            Object.keys(options._dataOptionsValue.listsConfigs)[0];
        return options._dataOptionsValue.listsConfigs[id];
    }

    // endregion
}

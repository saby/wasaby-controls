import { TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UI/Vdom';
import { Logger } from 'UI/Utils';
import * as template from 'wml!Controls-ListEnv/_frequentFilter/Chips/Chips';
import {
    AbstractFilter,
    IInnerWidgetOptions,
} from 'Controls-ListEnv/filterBase';
import { EditorViewController } from 'Controls-ListEnv/filter';
import { IChipsOptions } from 'Controls/Chips';

export default class FilterToggleBase extends AbstractFilter<IInnerWidgetOptions> {
    protected _template: TemplateFunction = template;
    protected _editorOptions: IChipsOptions;
    protected _viewController: EditorViewController<IChipsOptions> = null;

    protected _beforeMount(options: IInnerWidgetOptions): void {
        if (options.storeId === undefined) {
            Logger.warn(
                'Для работы контролов' +
                    ' Controls-ListEnv/frequentFilter:Chips и Controls-ListEnv/frequentFilter:Tumbler' +
                    ' необходимо указать опцию storeId'
            );
        }
        super._beforeMount(options);
        this._initViewController(options);
        this._filterSourceChanged();
    }

    protected _beforeUpdate(options: IInnerWidgetOptions): void {
        this._viewController.updateOptions(options);
        return super._beforeUpdate(options);
    }

    protected _handleSelectionChanged(
        event: SyntheticEvent,
        value: number[] | string[]
    ): void {
        const filterSource = this._widgetController.getFilterSource();
        this._updateFilterSource(
            this._viewController.getFilterSourceByValue(value, filterSource)
        );
    }

    protected _filterSourceChanged(): void {
        const filterSource = this._widgetController.getFilterSource();
        const chipsItem = this._viewController.getEditorItem(filterSource);
        this._editorOptions = this._viewController.setEditorsOptions(
            chipsItem?.editorOptions || {}
        );
        this._updateValue(chipsItem.value);
    }

    protected _updateValue(value: unknown): void {
        // for overrides
    }

    private _initViewController(options: IInnerWidgetOptions): void {
        this._viewController = new EditorViewController(options);
    }
}

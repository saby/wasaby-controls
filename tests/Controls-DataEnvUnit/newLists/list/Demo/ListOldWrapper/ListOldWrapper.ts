import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-DataEnvUnit/newLists/list/Demo/ListOldWrapper/ListOldWrapper';
import { Slice as CurrentListSlice } from 'Controls-DataEnv/currentList';

export class ListSliceOld extends CurrentListSlice {
    private _isBaseControlUpdating: boolean = false;

    isIdle(): boolean {
        return super.isIdle() && !this._isBaseControlUpdating;
    }

    setUpdating(state: boolean) {
        this._isBaseControlUpdating = state;
    }
}

interface ListOldWrapperOptions extends IControlOptions {
    slice: ListSliceOld;
}

export class ListOldWrapper extends Control<ListOldWrapperOptions> {
    protected _template: TemplateFunction = template;
    protected _slice: ListSliceOld;
    private _updateTimeout: ReturnType<typeof setTimeout> | undefined;

    protected _beforeMount(options: ListOldWrapperOptions): Promise<void> | void {
        this._slice = options.slice;
        this._slice.setUpdating(true);
    }

    protected _beforeUpdate(newOptions: ListOldWrapperOptions) {
        const sliceChanged = this._slice !== newOptions.slice;

        if (sliceChanged) {
            this._slice = newOptions.slice;
        }

        this._slice.setUpdating(true);
    }

    protected _afterRender() {
        if (this._updateTimeout) {
            clearTimeout(this._updateTimeout);
        }

        this._updateTimeout = setTimeout(() => {
            this._slice.setUpdating(false);
        }, 0);
    }
}

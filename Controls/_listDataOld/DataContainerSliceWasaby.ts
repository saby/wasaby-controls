/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_listDataOld/DataContainerSliceWasaby';
import { IDataOptions } from 'Controls/baseList';

export interface IListContainerOptions extends IDataOptions, IControlOptions {
    isSourceControllerFromContext?: boolean;
}

export default class DataContainerSlice extends Control<IListContainerOptions> {
    protected _template: TemplateFunction = template;

    reload() {
        return this._children.data.reload();
    }
}

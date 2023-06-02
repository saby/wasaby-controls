/**
 * @kaizen_zone 23b84c4b-cdab-4f76-954a-5f81cd39df3f
 */
import { ItemsView } from 'Controls/grid';
import { Model } from 'Types/entity';
import {
    PropertyGridCollection,
    PropertyGridCollectionItem,
} from 'Controls/propertyGrid';

type TPropertyGridEditorCollection = PropertyGridCollection<
    PropertyGridCollectionItem<Model>
>;

/**
 * Оверрайд контрола древовидной таблицы, работающий с моделью PropertyGridCollection.
 * @private
 */
export default class ListRender extends ItemsView {
    protected _viewModelConstructor: string =
        'Controls/propertyGridEditor:PropertyGridEditorCollection';

    protected getViewModel(): TPropertyGridEditorCollection {
        return this._listControl.getViewModel() as unknown as TPropertyGridEditorCollection;
    }
}

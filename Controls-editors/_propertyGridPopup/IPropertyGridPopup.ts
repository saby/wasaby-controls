import { IEditors } from 'Controls-editors/object-type';
import { IPropertyGrid } from 'Controls-editors/propertyGrid';

export interface IPropertyGridPopup<RuntimeInterface extends object>
    extends IPropertyGrid<RuntimeInterface> {
    className?: string;
    onClose: () => void;
    editorContext?: IEditors;
}

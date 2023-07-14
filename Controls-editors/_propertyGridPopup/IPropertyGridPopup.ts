import { IEditors } from 'Controls-editors/object-type';
import { IPropertyGrid } from 'Controls-editors/propertyGrid';
import { IFieldsContextValue } from 'Controls-editors/properties';
import { Slice } from 'Controls-DataEnv/slice';

export interface IPropertyGridPopup<RuntimeInterface extends object>
    extends IPropertyGrid<RuntimeInterface> {
    className?: string;
    onClose: () => void;
    editorContext?: IEditors;
    /**
     * Контекст {@link Controls-DataEnv/context}
     * @remark <b>Не добавляйте</b> свои типы контекстов в опции PropertyGridPopup. Передайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/config/ конфигурацию фабрики} слайсов в опцию dataContext
     */
    dataContext?: Record<string, Slice<unknown>>;
    /**
     * fixme: перевести на контекст Controls-DataEnv и удалить fieldsContext
     */
    fieldsContext?: IFieldsContextValue;
}

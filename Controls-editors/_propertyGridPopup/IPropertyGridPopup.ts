import { IEditors } from 'Controls-editors/object-type';
import { IPropertyGrid } from 'Controls-editors/propertyGrid';
import { Slice } from 'Controls-DataEnv/slice';

/**
 * Интерфейс пропсов компонента PropertyGridPopup
 * @public
 * @implements Controls-editors/propertyGrid:IPropertyGrid
 * @implements Controls-editors/object-type/IObjectTypeEditorProps
 * @implements Types/meta/IPropertyEditorProps
 */
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

    rootContext?: unknown;

    /**
     * Если true, то убирает кнопку сохранения и не показывает подтверждение закрытия
     */
    autoSave?: boolean;

    /**
     * Предзагруженные собственные данные редакторов
     */
    editorData?: Record<string, unknown>;
}

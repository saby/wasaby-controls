/**
 * Описание редактора
 * @public
 */
export interface IEditorDescription {
    /**
     * Редактор (путь до редактора).
     * Если не задано, берется редактор с типа или редактор по умолчанию
     */
    editor?: string;

    /**
     * Переопределение свойств редактора
     */
    editorProps?: Record<string, unknown>;
}

/**
 * Коллекция редакторов для типов видеа <идентификатор типа, редактор>
 * @public
 */
export type IMetaTypeEditors = Record<string, string | IEditorDescription>;

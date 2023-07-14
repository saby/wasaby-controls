import { StickyOpener, IStickyPopupOptions } from 'Controls/popup';
import { IEditors } from 'Controls-editors/object-type';
import { ObjectMeta } from 'Types/meta';
import { IFieldsContextValue } from 'Controls-editors/properties';
import type { Slice } from 'Controls-DataEnv/slice';

interface IObjectEditorOpenerProps {
    metaType: ObjectMeta<object>;
    value: object;
    onChange: (value: object) => void;
    editorContext?: IEditors;
    popupOptions: IStickyPopupOptions;
    fieldsContext?: IFieldsContextValue;
    dataContext?: Record<string, Slice<unknown>>;
}

/**
 * Опенер редактора типа "Объект"
 * @class Controls-editors/objectEditorOpener
 * @public
 */
export default class ObjectEditorOpener {
    protected _opener: StickyOpener;

    /**
     * Открывает панель с PropertyGrid для редактирования объекта
     * @param {IObjectEditorOpenerProps} options Конфигурация окна
     */
    async open({
        metaType,
        value,
        onChange,
        editorContext = null,
        fieldsContext = null,
        dataContext = null,
        popupOptions = {},
    }: IObjectEditorOpenerProps): Promise<void> {
        if (!this._opener) {
            this._opener = new StickyOpener();
        }

        if (this._opener?.isOpened()) {
            this._opener.close();
        }

        const attrs = metaType.getAttributes() as Object;
        const editorsLoaders = [];

        for (const attrName in attrs) {
            if (!attrs.hasOwnProperty(attrName)) {
                continue;
            }

            const attr = attrs[attrName];

            if (!attr) {
                continue;
            }

            const editor = attr.getEditor();

            if (!editor) {
                continue;
            }

            editorsLoaders.push(editor.load());
        }

        await Promise.all(editorsLoaders);

        this._opener.open({
            template: 'Controls-editors/propertyGridPopup:PropertyGridPopup',
            templateOptions: {
                metaType,
                value,
                onChange,
                editorContext,
                fieldsContext,
                dataContext,
            },
            opener: popupOptions.opener || null,
            ...popupOptions,
        });
    }

    /**
     * Закрывает панель редактирования
     */
    close(): void {
        if (this._opener) {
            this._opener.close();
        }
    }

    /**
     * Возвращает информацию о том, открыто ли панель редактирования
     */
    isOpened(): boolean {
        return this._opener && this._opener.isOpened();
    }

    /**
     * Разрушает экземпляр класса
     */
    destroy(): void {
        if (this._opener) {
            this._opener.destroy();
        }
    }
}

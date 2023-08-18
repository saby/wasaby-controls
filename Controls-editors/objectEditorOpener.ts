import { IStickyPopupOptions, StickyOpener } from 'Controls/popup';
import { IEditors } from 'Controls-editors/object-type';
import { ObjectMeta } from 'Types/meta';
import type { Slice } from 'Controls-DataEnv/slice';

interface IObjectEditorOpenerProps {
    metaType: ObjectMeta<object>;
    value: object;
    onChange: (value: object) => void;
    editorContext?: IEditors;
    popupOptions: IStickyPopupOptions;
    dataContext?: Record<string, Slice<unknown>>;
    refresh: boolean;
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
        refresh,
        editorContext = null,
        dataContext = null,
        popupOptions = {},
    }: IObjectEditorOpenerProps): Promise<void> {
        if (!this._opener) {
            this._opener = new StickyOpener();
        }

        if (!refresh) {
            if (this._opener?.isOpened()) {
                this._opener.close();
            }
        }

        const attrs = metaType.getAttributes() as Object;
        const editorsLoaders = [];

        const attributeTypesEditors = {};
        for (const attrName in attrs) {
            if (!attrs.hasOwnProperty(attrName)) {
                continue;
            }

            const attrType = attrs[attrName];

            if (!attrType) {
                continue;
            }

            const editor = attrType.getEditor();

            if (!editor) {
                continue;
            }

            editorsLoaders.push(
                editor.load().then((control) => {
                    attributeTypesEditors[attrType.getId()] = control;
                })
            );
        }

        await Promise.all(editorsLoaders);

        if (refresh && !this._opener.isOpened()) {
            return;
        }

        this._opener.open({
            template: 'Controls-editors/propertyGridPopup:PropertyGridPopup',
            templateOptions: {
                metaType,
                value,
                onChange,
                editorContext: {
                    //Подмешиваем редакторы, которые заданы на тип атрибута
                    ...editorContext,
                    ...attributeTypesEditors,
                },
                dataContext,
            },
            opener: popupOptions.opener || null,
            ...popupOptions,
            width: 350,
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

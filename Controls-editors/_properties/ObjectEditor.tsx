import { memo, useMemo } from 'react';
import { IComponent, IEditorProps, Meta, ObjectMeta } from 'Meta/types';
import { IEditorLayoutProps, ObjectTypeEditor } from 'Controls-editors/object-type';

export interface IObjectEditorProps<TValue extends object = Record<string, unknown> | object>
    extends IEditorProps<TValue> {
    /**
     * Мета-описание объекта.
     */
    metaType?: ObjectMeta<TValue>;

    LayoutComponent?: IComponent<IEditorLayoutProps>;
}

/**
 * Редактор объекта.
 * @class Controls-editors/_properties/ObjectEditor
 * @public
 */
export const ObjectEditor = memo((props: IObjectEditorProps): JSX.Element => {
    const { metaType, value, onChange, LayoutComponent } = props;

    if (!metaType) {
        throw new Error('ObjectEditor: Не указан метатип');
    }

    // Подготавливаем для ObjectTypeEditor:
    // Убираем редактор у метатипа и origin у атрибутов, чтобы отрисовались редакторы атрибутов.
    const metaTypeWithoutEditor = useMemo(() => {
        const metaNew = metaType.editor(undefined);
        const newAttrs: Record<string, Meta<any>> = {};
        Object.entries(metaNew.properties()).forEach(([key, attr]: [string, Meta<any>]) => {
            if (attr) {
                newAttrs[key] = attr.clone({ origin: undefined });
            }
        });
        return metaNew.properties(newAttrs);
    }, [metaType]);

    return (
        <ObjectTypeEditor
            metaType={metaTypeWithoutEditor}
            value={value}
            onChange={onChange}
            EditorLayoutComponent={LayoutComponent}
        />
    );
});

ObjectEditor.displayName = 'ObjectEditor';

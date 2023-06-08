import {
    Fragment,
    ReactNode,
    useContext,
    useMemo,
    useState,
    useEffect,
    memo,
    useCallback,
    useRef,
} from 'react';
import { IComponent, IPropertyEditorProps, Meta, ObjectMeta } from 'Types/meta';
import {
    EditorsContext,
    ObjectTypeEditorRootContext,
    ObjectTypeEditorValueContext,
} from './Contexts';
import { AttributeEditor } from './AttributeEditor';
import { getGroups } from './utils/getGroups';
import { defaultSort } from './utils/defaultSort';
import 'css!Controls-editors/_object-type/ObjectTypeEditor';

/**
 * Интерфейс заголовка группы редакторов атрибутов.
 * @public
 */
export interface IGroupHeaderProps {
    /**
     * Название группы.
     */
    title?: string;
}

/**
 * Интерфейс компонента, оборачивающего редакторы
 * @public
 */
export interface IEditorLayoutProps {
    /**
     * Ссылка на иконку для редактора.
     */
    icon?: string;

    /**
     * Название редактора.
     */
    title?: string;

    /**
     * Детальное описание редактора.
     */
    description?: string;

    /**
     * Обязательно ли значение.
     */
    required: boolean;

    /**
     * Признак недоступности свойства для редактирования.
     */
    disabled?: boolean;

    /**
     * Редактор.
     */
    children: ReactNode;
}

export interface IObjectTypeEditorProps<
    RuntimeInterface extends object,
    GroupHeaderProps extends IGroupHeaderProps,
    EditorLayoutProps extends IEditorLayoutProps
> extends IPropertyEditorProps<RuntimeInterface> {
    /**
     * Мета-описание объекта.
     */
    metaType?: ObjectMeta<RuntimeInterface>;

    /**
     * Название категории, свойства которой отобразятся в редакторе.
     */
    category?: string;

    /**
     * Компонент для отрисовки заголовка группы свойств.
     */
    GroupHeaderComponent?: IComponent<GroupHeaderProps>;

    /**
     * Дополнительные свойства заголовка группы.
     */
    GroupHeaderProps?: GroupHeaderProps;

    /**
     * Компонент, оборачивающий редакторы, рисующий icon, title, description.
     */
    EditorLayoutComponent?: IComponent<EditorLayoutProps>;

    /**
     * Дополнительные свойства компонента, оборачивающиего редакторы.
     */
    EditorLayoutProps?: EditorLayoutProps;

    /**
     * Ссылка на корень мета-описания объекта внутри свойства `value`.
     * @remark
     * Указание корня влияет только на отображение.
     * Редактор всегда возвращает значение для всего объекта, соответствующего мета-описанию свойства `type`.
     * @example
     * const value = {
     *     a: {
     *         b: {
     *             c: ''
     *         }
     *     }
     * };
     * const type = ObjectType.attributes({
     *     a: ObjectType.attributes({
     *         b: ObjectType.attributes({
     *             c: StringType
     *         })
     *     })
     * });
     * const root = 'a.b';
     * <ObjectTypeEditor metaType={type} root={root} value={value} onChange={onChange} />
     * // На странице будет редактор для объекта `obj({ c: string })`,
     * // а в `onChange` будет приходить всё значение `{ a: { b: { c: '1' } } }`.
     */
    root?: string;

    /**
     * Вызывается в случае изменения корня в редакторе свойств.
     * @param root
     */
    onRootChange?: (root: string) => void;

    /**
     * Функция для сортировки свойств.
     * @param a
     * @param b
     */
    sort?(a: Meta<any>, b: Meta<any>): number;
}

/**
 * Редактор свойств виджета.
 * @param {IObjectTypeEditorProps} props
 * @public
 * @see ObjectTypeEditorValueContext
 */
export const ObjectTypeEditor = memo(
    <
        RuntimeInterface extends object,
        GroupHeaderProps extends IEditorLayoutProps,
        EditorLayoutProps extends IEditorLayoutProps
    >(
        props: IObjectTypeEditorProps<RuntimeInterface, GroupHeaderProps, EditorLayoutProps>
    ): JSX.Element => {
        const {
            metaType,
            value,
            onChange,
            sort = defaultSort,
            GroupHeaderComponent = (() => {
                return null;
            }) as any,
            GroupHeaderProps,
            EditorLayoutComponent,
            EditorLayoutProps,
            category,
            root = '',
            onRootChange,
        } = props;
        const propsRef = useRef(props);
        propsRef.current = props;
        const editors = useContext(EditorsContext);
        const path = useMemo(() => {
            return root.split('.').filter(Boolean);
        }, [root]);
        const open = useCallback(
            (attributeName: string) => {
                onRootChange([...path, attributeName].join('.'));
            },
            [path, onRootChange]
        );
        const rootContext = useMemo(() => {
            return { open };
        }, [open]);

        const val = useMemo(() => {
            let result = value;
            for (const name of path) {
                result = result?.[name];
            }
            return result;
        }, [path, value]);

        const handleChange = useCallback(
            (newObjectValue) => {
                if (!path.length) {
                    onChange(newObjectValue);
                    return;
                }
                const result = { ...propsRef.current.value };
                let parent = result;
                path.forEach((name, index) => {
                    if (index === path.length - 1) {
                        parent[name] = newObjectValue;
                    } else {
                        parent[name] = { ...parent?.[name] };
                    }
                    parent = parent[name];
                });
                onChange(result);
            },
            [path, propsRef, onChange]
        );

        const editor = metaType.getEditor();
        const [ready, setReady] = useState(editor.ready);
        useEffect(() => {
            if (!editor.ready) {
                editor.load(val).then(() => {
                    return setReady(editor.ready);
                });
            }
        }, [editor]);

        const groups = useMemo(() => {
            if (!ready) {
                return null;
            }
            let attributes = metaType.attributes();
            for (const name of path) {
                attributes = attributes?.[name]?.attributes();
            }
            return getGroups({
                category,
                attributes,
                editors,
                sort,
            });
        }, [ready, category, path, metaType, editors, sort]);

        if (!ready) {
            return null;
        }

        return (
            <EditorsContext.Provider value={editors}>
                <ObjectTypeEditorRootContext.Provider value={rootContext}>
                    <ObjectTypeEditorValueContext.Provider value={value}>
                        {groups.map(({ title, attributes }) => {
                            // TODO: у Fragment должен быть ключ. при ключе key={title} проблемы (ошибка: https://online.sbis.ru/opendoc.html?guid=ec63c11a-ede7-4419-83da-b894c0851e11&client=3)
                            // TODO: Проблема с ключем решается по задаче: https://online.sbis.ru/opendoc.html?guid=76d3772e-5918-4474-993e-c0a6b043f9d0&client=3
                            return (
                                <>
                                    <GroupHeaderComponent title={title} {...GroupHeaderProps} />
                                    {attributes.map((attribute) => {
                                        return (
                                            <AttributeEditor
                                                {...attribute}
                                                key={attribute.name}
                                                value={val}
                                                onChange={handleChange}
                                                EditorLayoutComponent={EditorLayoutComponent}
                                                EditorLayoutProps={EditorLayoutProps}
                                            />
                                        );
                                    })}
                                </>
                            );
                        })}
                    </ObjectTypeEditorValueContext.Provider>
                </ObjectTypeEditorRootContext.Provider>
            </EditorsContext.Provider>
        );
    }
);

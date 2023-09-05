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
import ExtendedFields, { IExtendedFieldOption } from './ExtendedFields';

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

    /**
     * Определяет расположение заголовка редактора (по умолчанию 'left')
     */
    titlePosition: 'left' | 'top' | 'none';
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

function getExtendedItems<RuntimeInterface extends object>(
    metaType: ObjectMeta<RuntimeInterface>,
    value: RuntimeInterface
): IExtendedFieldOption[] {
    const attrs = metaType?.attributes();

    const groupedExtendedFields: {
        [key in string]: {
            items: IExtendedFieldOption[];
            groupName: string;
            groupFullSizeCounter: number;
        };
    } = {};

    Object.keys(attrs).forEach((key) => {
        const group: undefined | { uid: string; name: string } = attrs[key].getGroup();

        if (!groupedExtendedFields[group?.uid || 'default']) {
            groupedExtendedFields[group?.uid || 'default'] = {
                items: [],
                groupName: group?.name || 'default',
                groupFullSizeCounter: 0,
            };
        }

        // Если поле расширенное и его значение не отличается от дефолтного
        if (attrs[key].getExtended() !== undefined && !value.hasOwnProperty(key)) {
            groupedExtendedFields[group?.uid || 'default'].items.push({
                id: key,
                title: attrs[key].getTitle(),
            });
        }

        // считаем, сколько всего в группе полей
        groupedExtendedFields[group?.uid || 'default'].groupFullSizeCounter++;
    });

    const extendedItems: IExtendedFieldOption[] = [];

    Object.keys(groupedExtendedFields).forEach((key) => {
        const extendedFieldsGroup = groupedExtendedFields[key];
        // Если все поля группы являются расширенными, то выносим в расширение группу, иначе -- ее поля
        if (extendedFieldsGroup.items.length === extendedFieldsGroup.groupFullSizeCounter) {
            extendedItems.push({ id: key, title: extendedFieldsGroup.groupName });
        } else {
            extendedItems.push(...extendedFieldsGroup.items);
        }
    });

    return extendedItems;
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

        const [extendedItems, setExtendedItems] = useState<IExtendedFieldOption[]>(
            getExtendedItems(metaType, value)
        );

        const handleSelectExtendedField = useCallback((fieldId: string) => {
            setExtendedItems((p) => p.filter((field) => field.id !== fieldId));
        }, []);

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
        // TODO: Временный костыль из-за сложной архитектурной ошибки в Types, решающейся по задаче:
        //  https://online.sbis.ru/opendoc.html?guid=f63e90db-61f0-4adb-a622-7313b647cb2d&client=3
        useEffect(() => {
            setReady(editor.ready);

            if (editor.ready) {
                return;
            }
            editor.load(val).then(() => {
                const interval = setInterval(() => {
                    if (editor.ready) {
                        clearInterval(interval);
                        setReady(editor.ready);
                    }
                }, 150);
            });
        }, [editor]);

        const groups = useMemo(() => {
            if (!ready) {
                return null;
            }
            let attributes = metaType.getAttributes();
            for (const name of path) {
                attributes = attributes?.[name]?.getAttributes();
            }
            return getGroups({
                metaType,
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
                        <>
                            {groups.map(({ id, title, attributes }) => {
                                return !extendedItems.find((extItem) => id === extItem.id) ? (
                                    <Fragment key={id}>
                                        <GroupHeaderComponent title={title} {...GroupHeaderProps} />
                                        {attributes.map((attribute) => {
                                            return !extendedItems.find(
                                                (extItem) => extItem.id === attribute.name
                                            ) ? (
                                                <AttributeEditor
                                                    {...attribute}
                                                    key={attribute.name}
                                                    value={val}
                                                    onChange={handleChange}
                                                    EditorLayoutComponent={EditorLayoutComponent}
                                                    EditorLayoutProps={EditorLayoutProps}
                                                />
                                            ) : null;
                                        })}
                                    </Fragment>
                                ) : null;
                            })}
                            {extendedItems.length ? (
                                <>
                                    <GroupHeaderComponent />
                                    <ExtendedFields
                                        fields={extendedItems}
                                        onClickField={handleSelectExtendedField}
                                    />
                                </>
                            ) : null}
                        </>
                    </ObjectTypeEditorValueContext.Provider>
                </ObjectTypeEditorRootContext.Provider>
            </EditorsContext.Provider>
        );
    }
);
// @ts-ignore имя для ReactDevTool
ObjectTypeEditor.displayName = 'ObjectTypeEditor';

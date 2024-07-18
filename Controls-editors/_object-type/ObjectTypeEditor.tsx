import {
    Fragment,
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    IComponent,
    IPropertyEditorLayoutProps,
    IPropertyEditorProps,
    Meta,
    ObjectMeta,
    loadEditors,
} from 'Meta/types';
import {
    EditorsContext,
    ObjectTypeEditorRootContext,
    ObjectTypeEditorValueContext,
} from './Contexts';
import { AttributeEditor } from './AttributeEditor';
import { getGroups } from './utils/getGroups';
import { defaultSort } from './utils/defaultSort';
import ExtendedFields, { IExtendedFieldOption } from './ExtendedFields';
import { error } from 'Controls/dataSource';
import 'css!Controls-editors/_object-type/ObjectTypeEditor';

const { ErrorBoundary } = error;

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

// TODO: Интерфейс перенесен в Type/meta (IPropertyEditorLayoutProps).
//  Этот алиас и пользовательские импорты
//  удалятся по задаче: https://online.sbis.ru/opendoc.html?guid=11ee04b2-7373-410d-8d16-8f665abc9434&client=3
export { IPropertyEditorLayoutProps as IEditorLayoutProps };

/**
 * Интерфейс пропсов базового редактора объектов
 * @public
 * @implements Types/meta/IPropertyEditorProps
 */
export interface IObjectTypeEditorProps<
    RuntimeInterface extends object,
    GroupHeaderProps extends IGroupHeaderProps,
    EditorLayoutProps extends IPropertyEditorLayoutProps
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
            items: (IExtendedFieldOption & { isDefault: boolean })[];
            groupName: string;
            groupFullSizeCounter: number;
            hasChangedField: boolean;
        };
    } = {};

    Object.keys(attrs).forEach((key) => {
        if (!attrs[key]) {
            return;
        }

        const group: undefined | { uid: string; name: string } = attrs[key]?.getGroup();

        if (!groupedExtendedFields[group?.uid || 'default']) {
            groupedExtendedFields[group?.uid || 'default'] = {
                items: [],
                groupName: group?.name || 'default',
                groupFullSizeCounter: 0,
                hasChangedField: false,
            };
        }

        // Если поле расширенное и его значение не отличается от дефолтного
        if (attrs[key].getExtended() !== undefined) {
            const extGroup = groupedExtendedFields[group?.uid || 'default'];
            const fieldIsDefault = !value.hasOwnProperty(key);

            if (!fieldIsDefault) {
                extGroup.hasChangedField = true;
            }

            groupedExtendedFields[group?.uid || 'default'].items.push({
                id: key,
                title: attrs[key].getTitle() || key,
                isDefault: fieldIsDefault,
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
            if (!extendedFieldsGroup.hasChangedField) {
                extendedItems.push({ id: key, title: extendedFieldsGroup.groupName });
            }
        } else {
            extendedItems.push(...extendedFieldsGroup.items.filter((f) => f.isDefault));
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

        const [extendedItems, setExtendedItems] = useState<IExtendedFieldOption[]>([]);

        useMemo(() => {
            setExtendedItems(getExtendedItems(metaType, value));
        }, [metaType]);

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
        // eslint-disable-next-line react/hook-use-state
        const [ready, setReady] = useState(editor.ready);
        // TODO: Временный костыль из-за сложной архитектурной ошибки в Types, решающейся по задаче:
        //  https://online.sbis.ru/opendoc.html?guid=f63e90db-61f0-4adb-a622-7313b647cb2d&client=3
        useEffect(() => {
            if (editor.ready) {
                return setReady(true);
            }
            loadEditors(metaType).then(() => {
                setReady(true);
            });
        }, [metaType]);

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
                                                <ErrorBoundary key={attribute.name}>
                                                    <AttributeEditor
                                                        {...attribute}
                                                        value={val}
                                                        onChange={handleChange}
                                                        EditorLayoutComponent={
                                                            EditorLayoutComponent
                                                        }
                                                        EditorLayoutProps={EditorLayoutProps}
                                                    />
                                                </ErrorBoundary>
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

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
import { IComponent, IPropertyEditorProps, Meta, ObjectMeta, loadEditors } from 'Meta/types';
import {
    EditorsContext,
    ObjectTypeEditorRootContext,
    ObjectTypeEditorValueContext,
    IObjectTypeEditorRootContext,
} from './Contexts';
import { AttributeEditor, IEditorLayoutProps } from './AttributeEditor';
import { getGroups, IAttribute } from './utils/getGroups';
import { defaultSort } from './utils/defaultSort';
import {
    ExtendedFields,
    ExtendedFieldsContext,
    IExtendedFieldOption,
    IExtendedFieldsContext,
} from './ExtendedFields';
import { error } from 'Controls/dataSource';
import 'css!Controls-editors/object-type';
import { useSlice } from 'Controls-DataEnv/context';
import { PropsValidation } from './validation';
import { ObjectTypeSlice } from './factory/ObjectTypeSlice';

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

/**
 * Интерфейс пропсов базового редактора объектов
 * @public
 * @implements Types/meta/IPropertyEditorProps
 */
export interface IObjectTypeEditorProps<
    RuntimeInterface extends object,
    GroupHeaderProps extends IGroupHeaderProps,
    EditorLayoutProps extends IEditorLayoutProps,
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
     * Компонент для отрисовки группы
     */
    GroupComponent?: IComponent<GroupHeaderProps>;

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
     * Показывать подсказки рядом с редактором
     * @default false
     */
    showTooltip?: boolean;

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
     * const type = ObjectType.properties({
     *     a: ObjectType.properties({
     *         b: ObjectType.properties({
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

    /**
     * Идентификатор слайса, в котором находятся редакторы
     */
    storeId?: string;

    validation?: PropsValidation;
}

function getExtendedItems<RuntimeInterface extends object>(
    metaType: ObjectMeta<RuntimeInterface>,
    value: RuntimeInterface
): IExtendedFieldOption[] {
    const attrs = metaType?.properties() ?? {};

    const groupedExtendedFields: {
        [key in string]: {
            items: (IExtendedFieldOption & { isDefault: boolean })[];
            groupName: string;
            groupFullSizeCounter: number;
            hasChangedField: boolean;
        };
    } = {};

    Object.keys(attrs).forEach((key) => {
        const attr = attrs[key];
        if (!attr) {
            return;
        }

        const group: undefined | { uid: string; name: string } = attr.getGroup();

        if (!groupedExtendedFields[group?.uid || 'default']) {
            groupedExtendedFields[group?.uid || 'default'] = {
                items: [],
                groupName: group?.name || 'default',
                groupFullSizeCounter: 0,
                hasChangedField: false,
            };
        }

        // Если поле расширенное и его значение не отличается от дефолтного
        // и это не обязательное поле
        if (attr.getExtended() !== undefined) {
            const extGroup = groupedExtendedFields[group?.uid || 'default'];
            const fieldIsDefault = !value.hasOwnProperty(key);

            if (!fieldIsDefault) {
                extGroup.hasChangedField = true;
            }

            groupedExtendedFields[group?.uid || 'default'].items.push({
                id: key,
                title: attr.getTitle() || key,
                isDefault: fieldIsDefault,
                disabled: attr.isDisabled(),
                groupId: group?.uid,
            });
        }

        // считаем, сколько всего в группе полей
        groupedExtendedFields[group?.uid || 'default'].groupFullSizeCounter++;
    });

    const extendedItems: IExtendedFieldOption[] = [];

    Object.keys(groupedExtendedFields).forEach((key) => {
        const extendedFieldsGroup = groupedExtendedFields[key];
        // Если все поля группы являются расширенными, то выносим в расширение группу, иначе -- ее поля
        if (
            extendedFieldsGroup.items.length === extendedFieldsGroup.groupFullSizeCounter &&
            extendedFieldsGroup.groupName !== 'default'
        ) {
            if (!extendedFieldsGroup.hasChangedField) {
                extendedItems.push({
                    id: key,
                    title: extendedFieldsGroup.groupName,
                    disabled: !hasEnabledExtendedItems(extendedFieldsGroup.items),
                });
            }
        } else {
            extendedItems.push(...extendedFieldsGroup.items.filter((f) => f.isDefault));
        }
    });

    return extendedItems;
}

function hasEnabledExtendedItems(extendedItems: IExtendedFieldOption[]): boolean {
    return extendedItems.some(({ disabled }) => !disabled);
}

/**
 * Базовый редактор объекта.
 * @class Controls-editors/object-type:ObjectTypeEditor
 * @mixes Controls-editors/object-type:IObjectTypeEditorProps
 * @public
 * @see ObjectTypeEditorValueContext
 */
export const ObjectTypeEditor = memo(
    <RuntimeInterface extends object, GroupHeaderProps extends IEditorLayoutProps>(
        props: IObjectTypeEditorProps<RuntimeInterface, GroupHeaderProps>
    ) => {
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
            category,
            root = '',
            onRootChange,
            GroupComponent,
            validation,
        } = props;
        const valueRef = useRef(value);
        valueRef.current = value;

        const rootContext = useContext(ObjectTypeEditorRootContext);

        const storeId = props.storeId ?? rootContext?.storeId;
        const showTooltip = props.showTooltip ?? rootContext?.showTooltip;

        const initExtendedItems = useMemo<IExtendedFieldOption[]>(() => {
            return getExtendedItems(metaType, valueRef.current);
        }, [metaType]);

        const metaTypeRef = useRef(metaType);
        const extendedItemsRef = useRef<IExtendedFieldOption[]>(initExtendedItems);
        const metaTypeChanged = metaTypeRef.current !== metaType;
        metaTypeRef.current = metaType;
        if (metaTypeChanged) {
            extendedItemsRef.current = initExtendedItems;
        }

        // Маркер для обновления компонента после показа/скрытия свойств
        const [extendedFieldsChangedMarker, setExtendedFieldsChangedMarker] = useState<object>({});

        const showPropertyHandler = useCallback((fieldId: string) => {
            extendedItemsRef.current = extendedItemsRef.current.filter((x) => x.id !== fieldId);
            setExtendedFieldsChangedMarker(new Date());
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

        const handleChange = useCallback(
            (newObjectValue) => {
                if (!path.length) {
                    onChange?.(newObjectValue);
                    return;
                }
                const result = { ...valueRef.current };
                let parent = result;
                path.forEach((name, index) => {
                    if (index === path.length - 1) {
                        parent[name] = newObjectValue;
                    } else {
                        parent[name] = { ...parent?.[name] };
                    }
                    parent = parent[name];
                });
                onChange?.(result);
            },
            [path, onChange]
        );

        // Обработчик переноса свойства в чипсы
        const hidePropertyHandler = useCallback(
            (attributeName: string) => {
                const newValue: Record<string, unknown> = { ...valueRef.current };
                delete newValue[attributeName];
                handleChange(newValue);

                const attributeMetaType = metaType.getProperties()[attributeName];

                extendedItemsRef.current = [
                    ...extendedItemsRef.current,
                    {
                        id: attributeName,
                        title: attributeMetaType.getTitle(),
                        disabled: attributeMetaType.isDisabled(),
                    },
                ];
                setExtendedFieldsChangedMarker(new Date());
            },
            [handleChange]
        );

        const preparedEditorLayoutComponent =
            EditorLayoutComponent ?? rootContext?.EditorLayoutComponent;

        const rootContextValue = useMemo<IObjectTypeEditorRootContext>(() => {
            return {
                open,
                hideProperty: hidePropertyHandler,
                showProperty: showPropertyHandler,
                storeId,
                showTooltip,
                EditorLayoutComponent: preparedEditorLayoutComponent,
            };
        }, [
            open,
            hidePropertyHandler,
            showPropertyHandler,
            storeId,
            showTooltip,
            preparedEditorLayoutComponent,
        ]);

        const val = useMemo(() => {
            let result = value;
            for (const name of path) {
                result = result?.[name];
            }
            return result;
        }, [path, value]);

        const editor = metaType.getEditor();

        const [readyMetaTypeId, setReadyMetaTypeId] = useState(
            storeId !== undefined || editor === undefined || editor.ready
                ? metaType.getId()
                : undefined
        );
        // TODO: Временный костыль из-за сложной архитектурной ошибки в Types, решающейся по задаче:
        //  https://online.sbis.ru/opendoc.html?guid=f63e90db-61f0-4adb-a622-7313b647cb2d&client=3
        useEffect(() => {
            if (!!storeId) {
                return;
            }
            let mounted = true;
            if (editor === undefined || editor.ready) {
                return setReadyMetaTypeId(metaType.getId());
            }
            loadEditors(metaType).then(() => {
                if (mounted) {
                    setReadyMetaTypeId(metaType.getId());
                }
            });
            return () => (mounted = false);
        }, [metaType, storeId]);

        const slice = useSlice<ObjectTypeSlice>(storeId ?? '');

        const ready = !!storeId || readyMetaTypeId === metaType.getId();
        const groups = useMemo(() => {
            if (!ready) {
                return null;
            }

            if (!!slice) {
                return null;
            }

            let attributes = metaType.getProperties();
            for (const name of path) {
                attributes = attributes?.[name]?.getProperties();
            }

            return getGroups({
                metaType,
                category,
                attributes,
                editors,
                sort,
                getEditor: slice?.getEditor,
            });
        }, [ready, category, path, metaType, editors, sort, slice]);

        const extendedFieldsContextValue = useMemo<IExtendedFieldsContext>(() => {
            return {
                fields: extendedItemsRef.current,
            };
        }, [extendedItemsRef.current]);

        if (!ready) {
            return null;
        }

        return (
            <ExtendedFieldsContext.Provider value={extendedFieldsContextValue}>
                <EditorsContext.Provider value={editors}>
                    <ObjectTypeEditorRootContext.Provider value={rootContextValue}>
                        <ObjectTypeEditorValueContext.Provider value={value}>
                            <>
                                {!storeId && (
                                    <>
                                        {groups.map(({ id, title, headerVisible, attributes }) => {
                                            return !extendedItemsRef.current.find(
                                                (extItem) => id === extItem.id
                                            ) ? (
                                                <Fragment key={id}>
                                                    {!GroupComponent && (
                                                        <>
                                                            {headerVisible ? (
                                                                <GroupHeaderComponent
                                                                    title={title}
                                                                    {...GroupHeaderProps}
                                                                />
                                                            ) : null}
                                                            <AttributesRender
                                                                value={val}
                                                                attributes={attributes}
                                                                extendedItems={
                                                                    extendedItemsRef.current
                                                                }
                                                                validation={validation}
                                                                onChange={handleChange}
                                                                EditorLayoutComponent={
                                                                    preparedEditorLayoutComponent
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                    {!!GroupComponent && (
                                                        <GroupComponent title={title} id={id}>
                                                            <AttributesRender
                                                                value={val}
                                                                attributes={attributes}
                                                                extendedItems={
                                                                    extendedItemsRef.current
                                                                }
                                                                onChange={handleChange}
                                                                validation={validation}
                                                                EditorLayoutComponent={
                                                                    preparedEditorLayoutComponent
                                                                }
                                                            />
                                                        </GroupComponent>
                                                    )}
                                                </Fragment>
                                            ) : null;
                                        })}
                                    </>
                                )}
                                {hasEnabledExtendedItems(extendedItemsRef.current) &&
                                !GroupComponent ? (
                                    <ExtendedFields />
                                ) : null}
                            </>
                        </ObjectTypeEditorValueContext.Provider>
                    </ObjectTypeEditorRootContext.Provider>
                </EditorsContext.Provider>
            </ExtendedFieldsContext.Provider>
        );
    }
);
// @ts-ignore имя для ReactDevTool
ObjectTypeEditor.displayName = 'Controls-editors/object-type:ObjectTypeEditor';

interface IAttributesRenderProps {
    attributes: IAttribute<any>[];
    onChange(value: any): void;
    extendedItems: IExtendedFieldOption[];
    EditorLayoutComponent?: IComponent<IEditorLayoutProps>;
    EditorLayoutProps?: IEditorLayoutProps;
    value: any;
    validation?: PropsValidation;
}

function AttributesRender(props: IAttributesRenderProps) {
    const {
        attributes,
        onChange,
        extendedItems,
        EditorLayoutComponent,
        EditorLayoutProps,
        value,
        validation,
    } = props;

    return (
        <>
            {attributes.map((attribute) => {
                const { name } = attribute;

                return !extendedItems.find((extItem) => extItem.id === name) ? (
                    <ErrorBoundary key={name}>
                        <AttributeEditor
                            {...attribute}
                            value={value}
                            validation={validation?.[name]}
                            onChange={onChange}
                            EditorLayoutComponent={EditorLayoutComponent}
                            EditorLayoutProps={EditorLayoutProps}
                        />
                    </ErrorBoundary>
                ) : null;
            })}
        </>
    );
}

import { FC, memo, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { ObjectMeta } from 'Meta/types';
import {
    EditorsContext,
    ObjectTypeEditorRootContext,
    ObjectTypeEditorValueContext,
    IObjectTypeEditorRootContext,
} from './Contexts';
import { IEditorLayoutProps } from './AttributeEditor';
import {
    ExtendedFieldsNew,
    ExtendedFieldsContext,
    IExtendedFieldsContext,
} from './ExtendedFieldsNew';
import 'css!Controls-editors/object-type';
import { PropsValidation } from './validation';
import {
    getExtendedAttributesHierarchy,
    IExtendedGroup,
    setAttributeVisibility,
} from './utils/getExtendedItems';
import { IGroupComponentProps } from './renders/GroupComponent';
import { useStrictSlice } from 'Controls-DataEnv/context';
import { ObjectTypeSlice } from 'Controls-editors/_object-type/factory/ObjectTypeSlice';
import { getGroupsFromMeta } from 'Controls-editors/_object-type/utils/getGroupsFromMeta';
import { GroupRender } from 'Controls-editors/_object-type/renders/GroupRender';

/**
 * Интерфейс пропсов базового редактора объектов
 * @public
 */
export interface IObjectTypeEditorPropsNew {
    /**
     * Мета-описание объекта.
     */
    metaType: ObjectMeta;

    /**
     * Компонент для отрисовки группы
     */
    GroupComponent: FC<IGroupComponentProps>;

    /**
     * Компонент, оборачивающий редакторы, рисующий icon, title, description.
     */
    EditorLayoutComponent?: FC<IEditorLayoutProps>;

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
     * Идентификатор слайса, в котором находятся редакторы
     */
    storeId: string;

    validation?: PropsValidation;

    value: Record<string, any>;

    onChange: (value: Record<string, any>) => void;
}

/**
 * Базовый редактор объекта.
 * @class Controls-editors/object-type:ObjectTypeEditor
 * @mixes Controls-editors/object-type:IObjectTypeEditorProps
 * @public
 * @see ObjectTypeEditorValueContext
 */
export const ObjectTypeEditorNew = memo(function ObjectTypeEditorNew(
    props: IObjectTypeEditorPropsNew
) {
    const {
        metaType,
        value,
        onChange,
        EditorLayoutComponent,
        root = '',
        onRootChange,
        GroupComponent,
        validation,
    } = props;
    const valueRef = useRef(value);
    valueRef.current = value;

    const rootContext = useContext(ObjectTypeEditorRootContext);

    const storeId = props.storeId ?? rootContext?.storeId;
    const showTooltip = props.showTooltip ?? rootContext?.showTooltip ?? false;

    const slice = useStrictSlice<ObjectTypeSlice>(storeId);
    const navigation = slice.state.navigation;
    const nestedEditor = !!rootContext;
    const groups = useMemo(() => {
        return getGroupsFromMeta(
            metaType,
            slice.getEditor,
            nestedEditor ? undefined : navigation,
            slice.state.useCategories
        );
    }, [metaType, slice, navigation, nestedEditor]);

    const initExtendedItems = useMemo<IExtendedGroup[]>(() => {
        return getExtendedAttributesHierarchy(groups, metaType, valueRef.current);
    }, [groups, metaType]);

    const metaTypeRef = useRef(metaType);
    const extendedItemsRef = useRef(initExtendedItems);
    const metaTypeChanged = metaTypeRef.current !== metaType;
    metaTypeRef.current = metaType;
    if (metaTypeChanged) {
        extendedItemsRef.current = initExtendedItems;
    }

    // Маркер для обновления компонента после показа/скрытия свойств
    // @ts-ignore
    const [extendedFieldsChangedMarker, setExtendedFieldsChangedMarker] = useState<object>({});

    const showPropertyHandler = useCallback((attributeName: string) => {
        extendedItemsRef.current = setAttributeVisibility(
            extendedItemsRef.current,
            attributeName,
            true
        );
        setExtendedFieldsChangedMarker(new Date());
    }, []);

    const editors = useContext(EditorsContext);
    const path = useMemo(() => {
        return root.split('.').filter(Boolean);
    }, [root]);
    const open = useCallback(
        (attributeName: string) => {
            onRootChange?.([...path, attributeName].join('.'));
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

            extendedItemsRef.current = setAttributeVisibility(
                extendedItemsRef.current,
                attributeName,
                false
            );

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

    const extendedFieldsContextValue = useMemo<IExtendedFieldsContext>(() => {
        return {
            fields: extendedItemsRef.current,
        };
    }, [extendedItemsRef.current]);

    return (
        <ExtendedFieldsContext.Provider value={extendedFieldsContextValue}>
            <EditorsContext.Provider value={editors}>
                <ObjectTypeEditorRootContext.Provider value={rootContextValue}>
                    <ObjectTypeEditorValueContext.Provider value={value}>
                        {groups.map((x) => {
                            return (
                                <GroupRender
                                    key={`key_${x.id}`}
                                    {...x}
                                    value={value}
                                    metaType={metaType}
                                    GroupHeaderProps={undefined}
                                    EditorLayoutComponent={EditorLayoutComponent}
                                    onChange={onChange}
                                    GroupComponent={GroupComponent}
                                    validation={validation}
                                    storeId={storeId}
                                    nestedGroup={nestedEditor}
                                />
                            );
                        })}
                        <ExtendedFieldsNew showGroups={true} />
                    </ObjectTypeEditorValueContext.Provider>
                </ObjectTypeEditorRootContext.Provider>
            </EditorsContext.Provider>
        </ExtendedFieldsContext.Provider>
    );
});

ObjectTypeEditorNew.displayName = 'Controls-editors/object-type:ObjectTypeEditorNew';

import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, FC } from 'react';
import { isEqual } from 'Types/object';
import { IComponent, IEditorProps, Meta } from 'Meta/types';
import { IAttribute } from './utils/getGroups';
import { useEditorData } from './utils/useEditorData';
import { IValidation, useEditorValidation } from './validation';

/**
 * Интерфейс компонента, оборачивающего редакторы.
 * @public
 */
export interface IEditorLayoutProps {
    /**
     * Редактор.
     */
    children?: ReactNode;

    /**
     * Метатип свойства, для которого создается редактор
     */
    metaType?: Meta<unknown>;

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
    required?: boolean;

    /**
     * Признак недоступности свойства для редактирования.
     */
    disabled?: boolean;

    /**
     * Не учитывать выравнивание по сетке
     * @defaultValue false
     */
    skipGridLayout?: boolean;
}

interface IAttributeEditorProps<T = any> extends IEditorProps<T>, IAttribute<T> {
    /**
     * Компонент, оборачивающий редакторы, рисующий icon, title, description.
     */
    EditorLayoutComponent?: IComponent<IEditorLayoutProps>;

    /**
     * Дополнительные свойства компонента, оборачивающиего редакторы.
     */
    EditorLayoutProps?: IEditorLayoutProps;

    validation?: IValidation;
}

const EMPTY_OBJECT = {};

interface IOnChangeOptions {
    multiple: boolean;
}

export const EditorLayoutComponentContext = createContext<
    { Component: FC<any>; defaultProps: any } | undefined
>(undefined);

/**
 * Компонент, управляющий отрисовкой редактора свойства.
 * @param {IAttributeEditorProps} props - Свойства редактора свойства.
 * @param props.type - Мета-описание свойства.
 * @param props.value - Все свойства виджета.
 * @param props.name - Название свойства виджета (атрибута объекта).
 * @private
 */
export function AttributeEditor(props: IAttributeEditorProps) {
    const {
        value = EMPTY_OBJECT,
        attributes = EMPTY_OBJECT,
        metaType,
        name,
        converter,
        Component: Editor,
        EditorLayoutComponent,
        EditorLayoutProps,
        validation,
    } = props;

    const propsRef = useRef<IAttributeEditorProps>(props);
    propsRef.current = props;

    const editorData = useEditorData(metaType.getId());
    const editorValidation = useEditorValidation(validation);

    const propertyValue = useMemo(() => {
        return converter.input(value);
    }, [converter.input, value]);

    const multipleAttributes = Object.keys(attributes).length > 0;

    const handleChange = useCallback((editorValue: any, options?: IOnChangeOptions) => {
        const multipleProps = multipleAttributes || options?.multiple;
        if (multipleProps) {
            const newValue = {
                ...propsRef.current.value,
            };

            //TODO: удалить после исправления https://online.sbis.ru/opendoc.html?guid=0fc09b94-6ab2-4a39-b607-dc906e1076f0&client=3
            const WRONG_METATYPES = ['DateRangeFilterItemType'];
            if (WRONG_METATYPES.includes(metaType.getId())) {
                Object.keys(attributes).forEach((attributeName) => {
                    delete newValue[attributeName];
                });
                propsRef.current.onChange?.({ ...newValue, ...editorValue });
                return;
            }

            if (multipleAttributes) {
                Object.keys(attributes).forEach((attributeName) => {
                    delete newValue[attributeName];

                    if (
                        !isEqual(
                            editorValue[attributeName],
                            metaType.getProperties()[attributeName]?.getDefaultValue()
                        )
                    ) {
                        newValue[attributeName] = editorValue[attributeName];
                    }
                });
            } else {
                Object.keys(editorValue).forEach((attributeName) => {
                    delete newValue[attributeName];

                    if (metaType.getProperties !== undefined) {
                        if (
                            !isEqual(
                                editorValue[attributeName],
                                metaType.getProperties()[attributeName]?.getDefaultValue()
                            )
                        ) {
                            newValue[attributeName] = editorValue[attributeName];
                        }
                    } else {
                        newValue[attributeName] = editorValue[attributeName];
                    }
                });
            }

            propsRef.current.onChange?.({ ...newValue });
            return;
        }

        const isDefault =
            typeof editorValue === 'object'
                ? isEqual(editorValue, metaType.getDefaultValue())
                : editorValue === metaType.getDefaultValue();

        const filteredValue = isDefault
            ? Object.keys(propsRef.current.value).reduce((ac, key) => {
                  return {
                      ...ac,
                      ...(key === name ? {} : { [key]: propsRef.current.value[key] }),
                  };
              }, {})
            : propsRef.current.value;

        // Использование propsRef обусловлено тем, что рендер Wasaby контрола кэширует все функции,
        // мы не можем рассчитывать на замыкание значений value и onChange.
        propsRef.current.onChange?.({
            ...filteredValue,
            // Если используется дефолтное значение, то его не нужно записывать в результат редактирования
            ...(isDefault ? {} : propsRef.current.converter.output(editorValue)),
        });
    }, []); // Пустые зависимости, т.к. используем propsRef

    const icon = metaType.getIcon();
    const title = metaType.getTitle();
    const description = metaType.getDescription();
    const disabled = metaType.isDisabled();

    const skipGridLayout = metaType.getEditor().props?.skipGridLayout;

    const defaultLayoutProps = useMemo(() => {
        return {
            ...EditorLayoutProps,
            icon,
            title,
            description,
            disabled,
            attributeName: name,
            metaType,
            skipGridLayout,
            validation: editorValidation,
        };
    }, [
        EditorLayoutProps,
        icon,
        title,
        description,
        disabled,
        name,
        metaType,
        skipGridLayout,
        editorValidation,
    ]);

    const layoutComponentContextValue = useMemo(() => {
        return {
            Component: EditorLayoutComponent,
            defaultProps: defaultLayoutProps,
        };
    }, [EditorLayoutComponent, defaultLayoutProps]);

    // Дополняем комлексный редактор значениями свойств по умолчанию
    const resultPropertyValue = useMemo(() => {
        if (multipleAttributes) {
            const defaultValue: Record<string, unknown> = {};
            Object.keys(attributes).forEach((attributeName) => {
                const attributeDefaultValue =
                    metaType.getDefaultValue()[attributeName] ??
                    metaType.getProperties()[attributeName]?.getDefaultValue();
                if (attributeDefaultValue !== undefined) {
                    defaultValue[attributeName] = attributeDefaultValue;
                }
            });
            return {
                ...defaultValue,
                ...propertyValue,
            };
        }
        return Object.keys(attributes).length > 0 && !!propertyValue
            ? { ...metaType.getDefaultValue(), ...propertyValue }
            : propertyValue;
    }, [metaType, attributes, propertyValue, multipleAttributes]);

    if (metaType.isHidden()) {
        return null;
    }

    return (
        // TODO: Убрать псевдо-обертку после выполнения задачи
        // https://online.sbis.ru/opendoc.html?guid=cd99a087-db77-483a-a192-e527eeb4c9f5&client=3
        <div
            className={'controls-PropertyGrid__editor_pseudo_wrapper'}
            data-qa={`controls-PropertyGrid__editor_${name}`}
        >
            <EditorLayoutComponentContext.Provider value={layoutComponentContextValue}>
                <Editor
                    {...metaType.getEditor().props}
                    {...editorData}
                    name={name}
                    type={metaType}
                    metaType={metaType}
                    attributes={attributes}
                    validation={editorValidation}
                    value={
                        resultPropertyValue === undefined
                            ? metaType.getDefaultValue()
                            : resultPropertyValue
                    }
                    onChange={handleChange}
                    LayoutComponent={LayoutComponent}
                />
            </EditorLayoutComponentContext.Provider>
        </div>
    );
}

export function LayoutComponent(props: IEditorLayoutProps) {
    const { Component, defaultProps } = useContext(EditorLayoutComponentContext) ?? {};

    return Component ? <Component {...defaultProps} {...props} /> : props.children;
}

LayoutComponent.displayName = 'Controls-editors/object-type:LayoutComponent';

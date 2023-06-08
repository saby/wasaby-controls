import { useCallback, useMemo, useRef } from 'react';
import { IComponent, IEditorProps } from 'Types/meta';
import { IEditorLayoutProps } from './ObjectTypeEditor';
import { IAttribute } from './utils/getGroups';
import { isEqual } from 'Types/object';

interface IAttributeEditorProps<T = any>
    extends IEditorProps<T>,
        IAttribute<T> {
    /**
     * Компонент, оборачивающий редакторы, рисующий icon, title, description.
     */
    EditorLayoutComponent?: IComponent<IEditorLayoutProps>;

    /**
     * Дополнительные свойства компонента, оборачивающиего редакторы.
     */
    EditorLayoutProps?: IEditorLayoutProps;
}

const EMPTY_OBJECT = {};

/**
 * Компонент, управляющий отрисовкой редактора свойства.
 * @param {IAttributeEditorProps} props - Свойства редактора свойства.
 * @param props.type - Мета-описание свойства.
 * @param props.value - Все свойства виджета.
 * @param props.name - Название свойства виджета (атрибута объекта).
 */
export function AttributeEditor(props: IAttributeEditorProps): JSX.Element {
    const {
        value = EMPTY_OBJECT,
        attributes = EMPTY_OBJECT,
        metaType,
        name,
        converter,
        Component: Editor,
        EditorLayoutComponent,
        EditorLayoutProps,
    } = props;

    const propsRef = useRef<IAttributeEditorProps>();
    propsRef.current = props;

    const propertyValue = useMemo(() => {
        return converter.input(value);
    }, [converter.input, value]);

    const handleChange = useCallback((editorValue: any) => {
        const isDefault =
            typeof editorValue === 'object'
                ? isEqual(editorValue, metaType.getDefaultValue())
                : editorValue === metaType.getDefaultValue();

        const filteredValue = isDefault
            ? Object.keys(propsRef.current.value).reduce((ac, key) => {
                  return {
                      ...ac,
                      ...(key === name
                          ? {}
                          : { [key]: propsRef.current.value[key] }),
                  };
              }, {})
            : propsRef.current.value;

        // Использование propsRef обусловлено тем, что рендер Wasaby контрола кэширует все функции,
        // мы не можем рассчитывать на замыкание значений value и onChange.
        propsRef.current?.onChange({
            ...filteredValue,
            // Если используется дефолтное значение, то его не нужно записывать в результат редактирования
            ...(isDefault
                ? {}
                : propsRef.current.converter.output(editorValue)),
        });
    }, []); // Пустые зависимости, т.к. используем propsRef

    const icon = metaType.getIcon();
    const title = metaType.getTitle();
    const description = metaType.getDescription();
    const required = metaType.isRequired();
    const disabled = metaType.isDisabled();

    const defaultLayoutProps = useMemo(() => {
        return {
            ...EditorLayoutProps,
            icon,
            title,
            description,
            required,
            disabled,
        };
    }, [EditorLayoutProps, icon, title, description, required, disabled]);

    const LayoutComponent = useCallback(
        (layoutProps: IEditorLayoutProps) => {
            return EditorLayoutComponent ? (
                <EditorLayoutComponent
                    {...defaultLayoutProps}
                    {...layoutProps}
                />
            ) : (
                layoutProps.children
            );
        },
        [EditorLayoutComponent, defaultLayoutProps]
    );

    if (metaType.isHidden()) {
        return null;
    }

    return (
        <Editor
            {...metaType.getEditor().props}
            name={name}
            type={metaType}
            attributes={attributes}
            value={
                propertyValue === undefined
                    ? metaType.getDefaultValue()
                    : propertyValue
            }
            onChange={handleChange}
            LayoutComponent={LayoutComponent}
        />
    );
}

import { useCallback, useMemo, useRef, useContext } from 'react';
import { IComponent, IEditorProps } from 'Meta/types';
import { IEditorLayoutProps } from './ObjectTypeEditor';
import { IAttribute } from './utils/getGroups';
import { isEqual } from 'Types/object';
import { RootContext, IRootContext, DataContext } from 'Controls-DataEnv/context';

interface IAttributeEditorProps<T = any> extends IEditorProps<T>, IAttribute<T> {
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

    // контекст с глобальными данными
    const dataContext = useContext(DataContext);
    // контекст с собствеными данными редактора
    const rootContext = useContext<IRootContext>(RootContext);
    const contextNode = rootContext?.getNode?.(metaType.getId());

    const mergedContext = useMemo(() => {
        return {
            ...dataContext,
            ...contextNode,
        };
    }, [dataContext, rootContext]);

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
                      ...(key === name ? {} : { [key]: propsRef.current.value[key] }),
                  };
              }, {})
            : propsRef.current.value;

        // Использование propsRef обусловлено тем, что рендер Wasaby контрола кэширует все функции,
        // мы не можем рассчитывать на замыкание значений value и onChange.
        propsRef.current?.onChange({
            ...filteredValue,
            // Если используется дефолтное значение, то его не нужно записывать в результат редактирования
            ...(isDefault ? {} : propsRef.current.converter.output(editorValue)),
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
                <EditorLayoutComponent {...defaultLayoutProps} {...layoutProps} />
            ) : (
                layoutProps.children
            );
        },
        [EditorLayoutComponent, defaultLayoutProps]
    );

    if (metaType.isHidden()) {
        return null;
    }

    const EditorTemplate = (
        // TODO: Убрать псевдо-обертку после выполнения задачи
        // https://online.sbis.ru/opendoc.html?guid=cd99a087-db77-483a-a192-e527eeb4c9f5&client=3
        <div
            className={'controls-PropertyGrid__editor_pseudo_wrapper'}
            data-qa={`controls-PropertyGrid__editor_${name}`}
        >
            <Editor
                {...metaType.getEditor().props}
                name={name}
                type={metaType}
                attributes={attributes}
                value={propertyValue === undefined ? metaType.getDefaultValue() : propertyValue}
                onChange={handleChange}
                LayoutComponent={LayoutComponent}
            />
        </div>
    );

    if (contextNode) {
        return <DataContext.Provider value={mergedContext}>{EditorTemplate}</DataContext.Provider>;
    }

    return EditorTemplate;
}

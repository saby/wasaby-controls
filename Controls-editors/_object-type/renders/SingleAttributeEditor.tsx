import { useCallback, useMemo, useRef } from 'react';
import { isEqual } from 'Types/object';
import { Meta } from 'Meta/types';
import { LayoutComponent, EditorLayoutComponentContext } from '../AttributeEditor';
import { IAttributeRenderProps } from './IAttributeRenderProps';
import { IValidation, useEditorValidation } from '../validation';

export interface ISingleAttributeEditorProps extends IAttributeRenderProps {
    /**
     * Метип свойства name
     */
    metaType: Meta<unknown>;

    /**
     * Название свойства, для которого отображается редактор
     */
    name: string;

    validation?: IValidation;
}

/**
 * Компонент, управляющий отрисовкой редактора свойства.
 * @private
 */
export const SingleAttributeEditor = function SingleAttributeEditor(
    props: ISingleAttributeEditorProps
) {
    const {
        Component,
        fullValue,
        EditorLayoutComponent,
        metaType,
        name,
        onChange,
        defaultValue,
        editorProps,
        validation,
        storeId,
    } = props;

    const propertyValue = useMemo(() => {
        return fullValue?.[name] ?? defaultValue;
    }, [fullValue, name, defaultValue]);

    const skipGridLayout = editorProps?.skipGridLayout;
    const editorValidation = useEditorValidation(validation);

    const defaultLayoutProps = useMemo(() => {
        return {
            icon: metaType.getIcon(),
            title: metaType.getTitle(),
            description: metaType.getDescription(),
            disabled: metaType.isDisabled(),
            metaType,
            attributeName: name,
            skipGridLayout,
            validation: editorValidation,
        };
    }, [metaType, name, skipGridLayout, editorValidation]);

    const layoutComponentContextValue = useMemo(() => {
        return {
            Component: EditorLayoutComponent,
            defaultProps: defaultLayoutProps,
        };
    }, [EditorLayoutComponent, defaultLayoutProps]);

    const changeHandler = useCallback(
        (newValue: unknown) => {
            const newFullValue = {
                ...(fullValue ?? {}),
            };
            if (isEqual(newValue, defaultValue)) {
                delete newFullValue[name];
                onChange(newFullValue);
            } else {
                newFullValue[name] = newValue;
                onChange(newFullValue);
            }
        },
        [onChange, defaultValue, fullValue, name]
    );

    const changeHandlerRef = useRef(changeHandler);
    changeHandlerRef.current = changeHandler;

    const constChangeHandler = useCallback((newValue: unknown) => {
        changeHandlerRef.current(newValue);
    }, []);

    return (
        // TODO: Убрать псевдо-обертку после выполнения задачи
        // https://online.sbis.ru/opendoc.html?guid=cd99a087-db77-483a-a192-e527eeb4c9f5&client=3
        <div
            className={'controls-PropertyGrid__editor_pseudo_wrapper'}
            data-qa={`controls-PropertyGrid__editor_${name}`}
        >
            <EditorLayoutComponentContext.Provider value={layoutComponentContextValue}>
                <Component
                    {...(editorProps ?? {})}
                    value={propertyValue}
                    validation={editorValidation}
                    onChange={constChangeHandler}
                    type={metaType}
                    metaType={metaType}
                    LayoutComponent={LayoutComponent}
                    propertyGridStoreId={storeId}
                />
            </EditorLayoutComponentContext.Provider>
        </div>
    );
};

SingleAttributeEditor.displayName = 'Controls-editors/object-type:SingleAttributeEditor';

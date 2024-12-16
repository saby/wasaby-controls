import { useCallback, useMemo, useRef } from 'react';
import { isEqual } from 'Types/object';
import { Meta } from 'Meta/types';
import { LayoutComponent, EditorLayoutComponentContext } from '../AttributeEditor';
import { IAttributeRenderProps } from './IAttributeRenderProps';

export interface ISingleAttributeEditorProps extends IAttributeRenderProps {
    /**
     * Список атрибутов, которые объединяет комплексный редактор
     */
    attributes: Record<string, Meta<any>>;

    /**
     * Полный метатип объекта
     */
    fullMetaType: Meta<unknown>;
}

/**
 * Компонент, управляющий отрисовкой редактора свойства.
 * @private
 */
export const ComplexAttributeRender = function ComplexAttributeRender(
    props: ISingleAttributeEditorProps
) {
    const {
        Component: Editor,
        fullValue,
        EditorLayoutComponent,
        attributes,
        onChange,
        defaultValue,
        editorProps,
        fullMetaType,
    } = props;

    const propertyValue = useMemo(() => {
        const renderValue: Record<string, unknown> = {
            ...(defaultValue ?? {}),
        };

        for (const attributeName of Object.keys(attributes)) {
            renderValue[attributeName] = fullValue?.[attributeName];
        }

        return renderValue;
    }, [fullValue, attributes, defaultValue]);

    const skipGridLayout = editorProps?.skipGridLayout;

    const layoutComponentContextValue = useMemo(() => {
        return {
            Component: EditorLayoutComponent,
            defaultProps: {
                skipGridLayout,
            },
        };
    }, [EditorLayoutComponent, skipGridLayout]);

    const changeHandler = useCallback(
        (newValue: Record<string, unknown>) => {
            const newFullValue = {
                ...(fullValue ?? {}),
            };

            for (const attributeName of Object.keys(attributes)) {
                delete newFullValue[attributeName];

                if (!isEqual(newValue[attributeName], defaultValue?.[attributeName])) {
                    newFullValue[attributeName] = newValue[attributeName];
                }
            }

            onChange(newFullValue);
        },
        [onChange, defaultValue, fullValue, attributes]
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
            data-qa={'controls-PropertyGrid__editor'}
        >
            <EditorLayoutComponentContext.Provider value={layoutComponentContextValue}>
                <Editor
                    {...(editorProps ?? {})}
                    value={propertyValue}
                    onChange={constChangeHandler}
                    attributes={attributes}
                    LayoutComponent={LayoutComponent}
                    metaType={fullMetaType}
                />
            </EditorLayoutComponentContext.Provider>
        </div>
    );
};

ComplexAttributeRender.displayName = 'Controls-editors/object-type:ComplexAttributeRender';

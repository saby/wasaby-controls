import { Fragment, useCallback, forwardRef, FC, LegacyRef, useMemo } from 'react';
import { lazy, importer } from 'UI/Async';
import { TReactValidator } from 'Controls/validate';

interface IBaseEditorProps {
    editorTemplate: string;
    titlePosition?: string;
    onChange?: (value: string) => void;
    validators?: TReactValidator[];
    value: unknown;
    LayoutComponent: FC<{ titlePosition?: string }>;
}

interface IEditorProps {
    editorTemplate: string;

    [name: string]: unknown;
}

const Editor = forwardRef(({ editorTemplate, ...rest }: IEditorProps, ref) => {
    const EditorContainer = useCallback(
        lazy(() => importer(editorTemplate)),
        [editorTemplate]
    );
    return (
        <div ref={ref}>
            <EditorContainer {...rest} titlePosition="none" forwardedRef={undefined} />
        </div>
    );
});

/**
 * Базовый редактор для нового PG.
 * Он преобразует свойства из старого PG к корректному виду для нового.
 */
export default forwardRef(function BaseEditor(props: IBaseEditorProps, ref: LegacyRef<unknown>) {
    const { onChange, LayoutComponent = Fragment } = props;
    const validation = useMemo(() => {
        if (props.validators && props.validators.length) {
            return {
                validators: props.validators,
            };
        }
        return undefined;
    }, [props.validators]);

    return (
        <LayoutComponent titlePosition={props.titlePosition} validation={validation} ref={ref}>
            <Editor
                {...props}
                onChange={onChange}
                propertyValue={props.value}
                onPropertyValueChanged={onChange}
                LayoutComponent={Fragment}
            />
        </LayoutComponent>
    );
});

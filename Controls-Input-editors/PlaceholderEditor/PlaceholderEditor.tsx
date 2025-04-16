import { Fragment, memo, useCallback, useContext } from 'react';
import { Text as TextInputControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { ObjectTypeEditorValueContext } from 'Controls-editors/object-type';

type TValue = string | undefined;

interface IPlaceholderEditorProps extends IPropertyGridPropertyEditorProps<TValue> {
    titlePosition?: string;
    placeholder?: string;
    shortPlaceholder?: string;
}

export const PlaceholderEditor = memo((props: IPlaceholderEditorProps) => {
    const { value, onChange, LayoutComponent = Fragment, titlePosition = 'none' } = props;
    const contextValue = useContext(ObjectTypeEditorValueContext);

    const onValueChanged = useCallback(
        (result: string) => {
            onChange?.(result);
        },
        [onChange]
    );
    // Если выбрали прыгающую метку, то редактор подсказки нужно скрыть
    if (contextValue?.label?.jumping) {
        return null;
    }

    return (
        <LayoutComponent titlePosition={titlePosition}>
            <TextInputControl
                className="tw-w-full"
                value={value}
                placeholder={props.placeholder}
                onValueChanged={onValueChanged}
                shortPlaceholder={props.shortPlaceholder}
                placeholderVisibility="empty"
                readOnly={contextValue?.label?.jumping}
            />
        </LayoutComponent>
    );
});

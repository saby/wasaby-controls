import { forwardRef, memo, useCallback, useMemo, useRef } from 'react';
import { Button } from 'Controls/buttons';
import { StickyOpener } from 'Controls/popup';
import { usePropertyValue } from 'Controls/propertyGridEditors';
import 'css!Controls-Input-editors/ActionsListEditor/ActionsListEditor';

interface IIconEditorValue {
    icon: string;
}

export const IconEditor = memo(
    forwardRef((props: IIconEditorValue, ref) => {
        const { value, onPropertyValueChanged } = usePropertyValue(props);
        const buttonRef = useRef();

        const stickyOpener = useMemo(() => {
            return new StickyOpener();
        }, []);

        const handleClick = useCallback(() => {
            if (!props.readOnly) {
                stickyOpener.open({
                    topPopup: true,
                    opener: buttonRef.current,
                    target: buttonRef.current,
                    template: 'Controls-editors/properties:IconEditorPopup',
                    templateOptions: {
                        ...props,
                    },
                    eventHandlers: {
                        onResult: (icon) => {
                            onPropertyValueChanged(icon.name);
                            stickyOpener.close();
                        },
                    },
                });
            }
        }, [props.readOnly]);

        return (
            <div ref={ref}>
                <Button
                    ref={buttonRef}
                    className={`controls-ActionsListEditor__icon controls-background-unaccented ${props.className}`}
                    viewMode="squared"
                    icon={value || 'icon-Addition'}
                    iconSize="s"
                    iconStyle="secondary"
                    onClick={handleClick}
                />
            </div>
        );
    })
);

import { ForwardedRef, forwardRef, memo, useCallback, useMemo } from 'react';
import { Button, IIcon } from 'Emotions/picker';
import { usePropertyValue } from 'Controls/propertyGridEditors';
import 'css!Controls-Input-editors/ActionsListEditor/ActionsListEditor';
import * as rk from 'i18n!Controls-editors';

interface IIconEditorValue {
    icon: string;
    onChange?: (value: string) => void;
    className?: string;
}

interface IChosenIcon {
    category: 'icon';
    item: IIcon;
}

const TARGET_POINT = {
    vertical: 'bottom',
    horizontal: 'left',
} as const;

const DIRECTION = {
    vertical: 'bottom',
    horizontal: 'right',
} as const;

const OFFSET = {
    vertical: 0,
    horizontal: -16,
} as const;

const PANEL_WIDTH = 370;

export const IconEditor = memo(
    forwardRef((props: IIconEditorValue, ref: ForwardedRef<HTMLDivElement>) => {
        const { value, onPropertyValueChanged } = usePropertyValue<string>(props);
        const icon = value || 'icon-Addition';

        const onChange = props.onChange || onPropertyValueChanged;
        const handleChoose = useCallback(
            (chosenValue: IChosenIcon) => {
                const chosenIcon = chosenValue.item.name;
                if (chosenIcon !== 'empty') {
                    onChange(chosenIcon);
                    return;
                }
                onChange('');
            },
            [onChange]
        );

        const categories = useMemo(
            () => [
                {
                    id: 'icons',
                    icon,
                    title: rk('Выбор иконки'),
                    template: 'Emotions/dialog:Icon',
                },
            ],
            [icon]
        );

        return (
            <div ref={ref}>
                <Button
                    className={`controls-ActionsListEditor__icon controls-background-unaccented ${
                        props.className || ''
                    }`}
                    viewMode="squared"
                    icon={icon}
                    targetPoint={TARGET_POINT}
                    direction={DIRECTION}
                    offset={OFFSET}
                    panelWidth={PANEL_WIDTH}
                    iconSize="s"
                    iconStyle="secondary"
                    categories={categories}
                    onChoose={handleChoose}
                />
            </div>
        );
    })
);

IconEditor.displayName = 'Controls-Input-editors/ActionsListEditor:IconEditor';

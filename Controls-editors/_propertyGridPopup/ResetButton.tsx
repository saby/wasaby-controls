import { useMemo, useCallback } from 'react';
import { Button } from 'Controls/buttons';
import { Meta, OBJECT_TYPE_DEFAULT_VALUE, ObjectMeta } from 'Meta/types';
import * as rk from 'i18n!Controls';
import { isEqual } from 'Types/object';

interface IResetButtonProps {
    onReset: (newValue: object) => void;
    widgetProps: object;
    widgetMetaType: ObjectMeta<object>;
    className?: string;
    dataQa?: string;
}

/**
 * Получить пропсы, сброшенные к значению по умолчанию
 */
function hasPropsDifferentFromDefault(
    value: object | undefined,
    metaType: ObjectMeta<object>
): boolean {
    if (!value) {
        return false;
    }

    const properties = metaType.getProperties() as Record<string, Meta<unknown>>;

    for (const [key, propValue] of Object.entries(value)) {
        const defaultValue = properties[key]?.getDefaultValue();

        if (
            // Служебное свойство название виджета всегда можно сбрасывать
            key === 'widgetTitle' ||
            (defaultValue !== undefined &&
                defaultValue !== OBJECT_TYPE_DEFAULT_VALUE &&
                !isEqual(propValue, defaultValue))
        ) {
            return true;
        }
    }

    return false;
}

function getPropsWithoutDefault(
    value: Record<string, string> | undefined,
    metaType: ObjectMeta<object>
): object {
    if (!value) {
        return {};
    }

    const properties = metaType.getProperties() as Record<string, Meta<unknown>>;
    const result: Record<string, unknown> = {};

    for (const [key, propValue] of Object.entries(value)) {
        const defaultValue = properties[key]?.getDefaultValue();

        if (defaultValue === undefined) {
            result[key] = propValue;
            continue;
        }
    }

    return result;
}

export function ResetButton({
    onReset,
    widgetProps,
    widgetMetaType,
    className,
    dataQa,
}: IResetButtonProps) {
    const readOnly = useMemo(
        () => !hasPropsDifferentFromDefault(widgetProps, widgetMetaType),
        [widgetProps, widgetMetaType]
    );

    const propsWithoutDefault = useMemo(() => {
        return getPropsWithoutDefault(widgetProps, widgetMetaType);
    }, [widgetProps, widgetMetaType]);

    const onClick = useCallback(() => {
        onReset(propsWithoutDefault);
    }, [propsWithoutDefault, onReset]);

    return (
        <Button
            icon="icon-Restore"
            viewMode="link"
            inlineHeight="l"
            iconStyle="label"
            iconSize="s"
            tooltip={rk('Сбросить')}
            className={className}
            data-qa={dataQa}
            readOnly={readOnly}
            onClick={onClick}
        />
    );
}

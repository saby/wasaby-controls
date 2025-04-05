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
function getResetProps(value: object | undefined, metaType: ObjectMeta<object>): object {
    if (!value) {
        return {};
    }

    const properties = metaType.getProperties() as Record<string, Meta<unknown>>;
    const resetValue: Record<string, unknown> = { ...value };

    for (const [key, propValue] of Object.entries(value)) {
        const defaultValue = properties[key]?.getDefaultValue();

        if (
            // Служебное свойство название виджета всегда можно сбрасывать
            key === 'widgetTitle' ||
            (defaultValue !== undefined &&
                defaultValue !== OBJECT_TYPE_DEFAULT_VALUE &&
                !isEqual(propValue, defaultValue))
        ) {
            delete resetValue[key];
        }
    }

    return resetValue;
}

export function ResetButton({
    onReset,
    widgetProps,
    widgetMetaType,
    className,
    dataQa,
}: IResetButtonProps) {
    const resetProps = useMemo(() => {
        return getResetProps(widgetProps, widgetMetaType);
    }, [widgetProps, widgetMetaType]);

    const readOnly = useMemo(
        () => Object.keys(resetProps).length === Object.keys(widgetProps).length,
        [resetProps, widgetProps]
    );

    const onClick = useCallback(() => {
        onReset(resetProps);
    }, [resetProps, onReset]);

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

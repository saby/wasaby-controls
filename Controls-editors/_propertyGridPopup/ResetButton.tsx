import { useMemo, useCallback } from 'react';
import { Button } from 'Controls/buttons';
import { extractAttrsWithoutDefaults } from 'Controls-editors/object-type';
import { ObjectMeta } from 'Meta/types';
import * as rk from 'i18n!Controls';

interface IResetButtonProps {
    onReset: (newValue: object) => void;
    widgetProps: object;
    widgetMetaType: ObjectMeta<object>;
    className?: string;
    dataQa?: string;
}

export function ResetButton({
    onReset,
    widgetProps,
    widgetMetaType,
    className,
    dataQa,
}: IResetButtonProps) {
    const attrsWithoutDefaults = useMemo(() => {
        return extractAttrsWithoutDefaults(widgetProps, widgetMetaType);
    }, [widgetProps, widgetMetaType]);

    const readOnly = useMemo(() => {
        return Object.keys(widgetProps).every((k) => k in attrsWithoutDefaults);
    }, [attrsWithoutDefaults]);

    const onClick = useCallback(() => {
        onReset(attrsWithoutDefaults);
    }, [attrsWithoutDefaults, onReset]);

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

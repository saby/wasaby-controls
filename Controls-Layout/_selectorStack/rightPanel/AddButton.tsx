import { Ref, forwardRef, ReactElement, useMemo, useCallback } from 'react';
import { ISelectorTabConfig } from 'Controls/selector';
import { AddButton } from 'ExtControls/dropdown';
import { IButtonOptions } from 'Controls/dropdown';
import { loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { Model } from 'Types/entity';

const Button = forwardRef(
    (
        props: Required<ISelectorTabConfig>['addButtonConfig'],
        ref: Ref<AddButton>
    ): ReactElement | null => {
        const buttonConfig = useMemo(() => {
            return loadSync<{
                getConfig: (args?: unknown) => IButtonOptions & IButtonOptions['menuPopupOptions'];
            }>(props.menuConfigGetter).getConfig(props.menuConfigGetterArguments);
        }, [props.menuConfigGetter, props.menuConfigGetterArguments]);
        const onMenuItemActivate = useCallback(
            (item: Model) => {
                loadAsync<Function>(props.activateHandler).then((func) => {
                    func(item);
                });
            },
            [props.activateHandler]
        );

        return buttonConfig ? (
            <AddButton
                {...buttonConfig}
                onMenuItemActivate={onMenuItemActivate}
                ref={ref}
                inlineHeight="xl"
                className={'controls-margin_bottom-xs'}
            />
        ) : null;
    }
);

export default Button;

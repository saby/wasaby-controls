import { Ref, forwardRef, ReactElement, useMemo, useCallback } from 'react';
import { ISelectorTabConfig, useSelectSlice } from 'Controls/selector';
import { AddButton } from 'ExtControls/dropdown';
import { IButtonOptions } from 'Controls/dropdown';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { SyntheticEvent } from 'UI/Events';
import { Model } from 'Types/entity';
import { useStrictSlice } from 'Controls-DataEnv/context';
import { ListSlice } from 'Controls-DataEnv/list';

interface IAddButton {
    isAdaptive?: boolean;
    className?: string;
    listName: string;
}

const Button = forwardRef(
    (
        props: IAddButton & Required<ISelectorTabConfig>['addButtonConfig'],
        ref: Ref<AddButton>
    ): ReactElement | null => {
        const selectSlice = useSelectSlice();
        const currentTabConfig = selectSlice.state.configs[props.listName];
        const storeId = currentTabConfig.storeId;
        const currentListSlice = useStrictSlice<ListSlice>(storeId);
        const buttonConfig = useMemo(() => {
            return {
                ...currentListSlice.state?.metaData,
                ...loadSync<{
                    getConfig: (
                        args?: unknown
                    ) => IButtonOptions & IButtonOptions['menuPopupOptions'];
                }>(props.menuConfigGetter).getConfig(props.menuConfigGetterArguments),
            };
        }, [props.menuConfigGetter, props.menuConfigGetterArguments]);
        const onMenuItemActivate = useCallback(
            (item: Model, event: SyntheticEvent) => {
                const activateHandler = loadSync<Function>(props.activateHandler);
                return activateHandler(item, event, this, currentListSlice);
            },
            [props.activateHandler]
        );

        return buttonConfig ? (
            <AddButton
                {...buttonConfig}
                onMenuItemActivate={onMenuItemActivate}
                ref={ref}
                icon={props.isAdaptive ? 'icon-Plus2' : 'icon-RoundPlus'}
                iconSize={props.isAdaptive ? 'l' : 'm'}
                inlineHeight={props.isAdaptive ? '7xl' : 'xl'}
                className={`${props.className} controls-margin_bottom-xs`}
            />
        ) : null;
    }
);

export default Button;

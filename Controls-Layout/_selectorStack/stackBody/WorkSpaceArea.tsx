import { forwardRef, useCallback, LegacyRef, ReactElement } from 'react';
import { IUserAreaConfig, useSelectSlice } from 'Controls/selector';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { createElement } from 'UICore/Jsx';
import type { IControlOptions } from 'UICommon/Base';
import type { IItemPadding } from 'Controls/display';
import Async from 'Controls/Container/Async';
import { Model } from 'Types/entity';
import { IColumnTemplateProps } from 'Controls/grid';

interface IWorkspaceAreaProps extends IUserAreaConfig {
    storeId: string;
    isAdaptive?: boolean;
    onItemActivate?: Function;
}

interface IWorkspaceAreaTemplateOptions extends IControlOptions {
    itemPadding: IItemPadding;
    multiSelectPosition?: 'default' | 'custom';
    multiSelectTemplate?: string;
    storeId: string;
    onItemActivate?: Function;
}

interface IMultiselectColumnProps extends IColumnTemplateProps {
    isAdaptive?: boolean;
}

function MultiSelect(props: IMultiselectColumnProps): JSX.Element {
    const multiSelectTemplate = loadSync('Controls/selectorSticky:MultiSelectPlusTemplate');
    return createElement(multiSelectTemplate, {
        ...props,
        className: props.isAdaptive ? 'controls-Layout-SelectorStack__checkbox' : '',
    });
}

const WorkspaceArea = forwardRef(
    (props: IWorkspaceAreaProps, ref: LegacyRef<Async>): ReactElement | null => {
        const { configs, multiSelect } = useSelectSlice().state;
        const onItemActivate = useCallback(
            (item: Model, event: Event, columnIndex: number) => {
                if (props.onItemActivate) {
                    props.onItemActivate(item, event, columnIndex);
                }
            },
            [props.onItemActivate]
        );
        if (!props.templateName) {
            return null;
        }
        const tabsVisible = Object.keys(configs).length > 1;
        const template = loadSync(props.templateName);
        const templateOptions: IWorkspaceAreaTemplateOptions = {
            itemPadding: {
                left: 'xl',
                right: props.isAdaptive ? 'null' : undefined,
            },
            ...props.templateOptions,
            storeId: props.storeId,
            onItemActivate,
            className: 'controls-Layout-SelectorStack__contentArea',
        };
        if (tabsVisible && multiSelect) {
            templateOptions.multiSelectPosition = 'custom';
            templateOptions.multiSelectTemplate = <MultiSelect isAdaptive={props.isAdaptive} />;
        }
        const ContentTemplate = createElement(template, templateOptions);
        return (
            <div
                className={`${
                    props.isAdaptive
                        ? 'controls-Layout-SelectorStack__contentArea__wrapper_adaptive'
                        : ''
                } 
             controls-Layout-SelectorStack__contentArea__wrapper`}
            >
                {ContentTemplate}
            </div>
        );
    }
);

export default WorkspaceArea;

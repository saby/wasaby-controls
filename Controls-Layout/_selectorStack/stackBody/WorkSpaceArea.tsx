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
    onItemActivate?: Function;
}

interface IWorkspaceAreaTemplateOptions extends IControlOptions {
    itemPadding: IItemPadding;
    multiSelectPosition?: 'default' | 'custom';
    multiSelectTemplate?: string;
    storeId: string;
    onItemActivate?: Function;
}

function MultiSelect(props: IColumnTemplateProps): JSX.Element {
    const multiSelectTemplate = loadSync('Controls/selectorSticky:MultiSelectPlusTemplate');
    return createElement(multiSelectTemplate, {
        ...props,
        className: '',
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
            },
            ...props.templateOptions,
            storeId: props.storeId,
            onItemActivate,
        };
        if (tabsVisible && multiSelect) {
            templateOptions.multiSelectPosition = 'custom';
            templateOptions.multiSelectTemplate = MultiSelect;
        }
        const ContentTemplate = createElement(template, templateOptions);
        return <div>{ContentTemplate}</div>;
    }
);

export default WorkspaceArea;

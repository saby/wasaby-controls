import { ReactElement } from 'react';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { IHistoryConfig } from 'Controls/selector';
import { useStrictSlice } from 'Controls-DataEnv/context';
import { IItemTemplateProps } from 'Controls/baseList';
import { ListSlice } from 'Controls-DataEnv/list';

interface IHistoryItemTemplate extends IItemTemplateProps {
    storeId: string;
    multiSelectTemplate: Function;
    itemPinned: boolean;
    viewMode: IHistoryConfig['viewMode'];
}

export function ItemTemplate(props: IHistoryItemTemplate): ReactElement | null {
    const Template = loadSync(
        props.viewMode === 'tile' ? 'Controls/columns:ItemTemplate' : 'Controls/list:ItemTemplate'
    );
    const currentListSlice = useStrictSlice<ListSlice>(props.storeId);
    const displayProperty = currentListSlice.state.displayProperty as string;
    const itemCaption = props.item.getContents().get(displayProperty);
    const contentPadding = {
        left: 's',
        right: 's',
        top: '2xs',
        bottom: '2xs',
    };
    return (
        <Template
            {...props}
            shadowVisibility={false}
            contentPadding={contentPadding}
            marker={false}
            className={`${props.viewMode === 'tile' ? 'controls_border-radius-xs' : ''}`}
        >
            <div className="ws-flexbox ws-justify-content-between ws-align-items-center controls-inlineheight-m">
                <div
                    className={`ws-ellipsis ${props.itemPinned ? 'controls-fontweight-bold' : ''}`}
                >
                    {itemCaption}
                </div>
                <div
                    className={`${
                        props.multiSelectTemplate
                            ? 'controls-Layout-SelectorStack__history-action'
                            : ''
                    }`}
                >
                    <props.itemActionsTemplate {...props} />
                </div>
                {props.multiSelectTemplate ? (
                    <props.multiSelectTemplate
                        {...props}
                        className={'controls-margin_bottom-3xs'}
                    />
                ) : null}
            </div>
        </Template>
    );
}

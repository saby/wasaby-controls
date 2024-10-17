import { View as List, ItemTemplate, GroupTemplate } from 'Controls/list';
import { Icon } from 'Controls/icon';
import type { Model } from 'Types/entity';
import { IActionOptions } from 'Controls-Buttons/interface';

type Props = {
    name: string;
    onActionSelect: (value: IActionOptions) => void;
};

export function ActionList(props: Props) {
    const { name, onActionSelect } = props;
    const itemMouseDownHandler = (event: Model) => {
        onActionSelect({
            actionProps: {},
            id: event.getKey(),
        });
    };
    return (
        <List
            storeId={name}
            onItemClick={itemMouseDownHandler}
            customEvents={['onItemClick']}
            backgroundStyle="default"
            className="controls-margin_top-xs"
            groupProperty="category"
            itemTemplate={(itemTemplateProps) => {
                return (
                    <ItemTemplate
                        marker={false}
                        {...itemTemplateProps}
                        contentTemplate={(contentTemplateProps) => {
                            return (
                                <div className="ws-flexbox ws-align-items-center">
                                    <Icon
                                        className="controls-margin_right-xs"
                                        icon={contentTemplateProps.item.contents.get('icon')}
                                        iconSize="s"
                                        iconStyle="default"
                                    />
                                    <div className="ws-ellipsis">
                                        {contentTemplateProps.item.contents.get('title')}
                                    </div>
                                </div>
                            );
                        }}
                        groupTemplate={(groupTemplateProps) => {
                            return (
                                <GroupTemplate
                                    textAlign="left"
                                    iconSize="xs"
                                    {...groupTemplateProps}
                                />
                            );
                        }}
                    />
                );
            }}
        />
    );
}

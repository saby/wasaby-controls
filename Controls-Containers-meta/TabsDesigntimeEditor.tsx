import { IItemsOptions, ITabsProps } from 'Controls-Containers/interface';
import { IEditingElementFacade } from 'FrameEditor/base';
import * as translate from 'i18n!Controls-Containers';

interface IControlDesignerProps {
    value: IEditingElementFacade<ITabsProps>;
    onChange: (val: IEditingElementFacade<ITabsProps>) => void;
    className?: string;
}

const DEFAULT_ITEMS = [{ id: 1, title: translate('Первая вкладка'), align: 'left' }];
const TABS_STYLE = {
    height: 'var(--item_height_tabs)',
};

const FAKE_TABS_STYLE = {
    padding: '0 var(--item_container_margin-horizontal_tabs_local, var(--offset_m))',
    width: 'var(--item_container_width_tabs_local, unset)',
};

export default function TabsDesigntimeEditor(props: IControlDesignerProps) {
    const { value, onChange } = props;
    const staticProperties = value.getStaticProperties<IItemsOptions>();
    const items = (staticProperties.variants as IItemsOptions['variants'])?.items || [];

    const selectedKeyChangeHandler = (selectedKey: number) => {
        const newValue = value.modify({
            staticProperties: {
                ...staticProperties,
                variants: {
                    items: staticProperties.variants?.items || DEFAULT_ITEMS,
                    selectedKeys: [selectedKey],
                },
            },
        });
        onChange(newValue);
    };
    let className = 'tw-absolute';
    if (props.className) {
        className += ` ${props.className}`;
    }
    /*
     * Если у виджета вкладок указали стили, то нужно их взять и применить на фэйковый элемент, чтобы их ширины совпадали
     */
    if (staticProperties?.['.style']?.reference) {
        className += ` ${staticProperties?.['.style']?.reference}`;
    }

    /**
     * Рисуем псевдовкладки, чтобы понять, по какой именно вкладке нажал пользователь в режиме designtime
     */
    return (
        <div className={className}>
            <div className="tw-flex tw-w-full" style={TABS_STYLE}>
                {items.map((item) => {
                    return (
                        <div
                            title={item.title}
                            key={item.id}
                            className="tw-min-w-0 tw-cursor-pointer"
                            style={FAKE_TABS_STYLE}
                            onClick={() => {
                                selectedKeyChangeHandler(item.id);
                            }}
                        >
                            <div className="tw-invisible ws-ellipsis">
                                <span className="controls-fontsize-l controls-fontweight-bold">
                                    {item.title}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

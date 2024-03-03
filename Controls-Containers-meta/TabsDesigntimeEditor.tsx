import { IItemsOptions, ITabsProps } from 'Controls-Containers/interface';
import { IEditingElementFacade } from 'FrameEditor/base';
import * as translate from 'i18n!Controls-Containers';

interface IControlDesignerProps {
    value: IEditingElementFacade<ITabsProps>;
    onChange: (val: IEditingElementFacade<ITabsProps>) => void;
    className?: string;
}

const DEFAULT_VALUE = 1;
const DEFAULT_ITEMS = [{ id: 1, title: translate('Первая вкладка'), align: 'left' }];
const TABS_STYLE = {
    height: 'var(--item_height_tabs)',
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

    if (!staticProperties.variants?.selectedKeys) {
        selectedKeyChangeHandler(DEFAULT_VALUE);
    }

    /**
     * Рисуем псевдовкладки, чтобы понять, по какой именно вкладке нажал пользователь в режиме designtime
     */
    return (
        <div className={props.className + ' tw-absolute'}>
            <div className="tw-flex" style={TABS_STYLE}>
                {items.map((item) => {
                    return (
                        <div
                            className="controls-margin_left-m controls-margin_right-m"
                            onClick={() => {
                                selectedKeyChangeHandler(item.id);
                            }}
                        >
                            <span className="tw-invisible controls-fontsize-l controls-fontweight-bold">
                                {item.title}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

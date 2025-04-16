import { forwardRef, LegacyRef, useState } from 'react';
import { RecordSet } from 'Types/collection';
import { AdaptiveButtons, ITabAdaptiveButtonItem } from 'Controls/tabs';
import { TSelectedKey } from 'Controls/interface';
import { Title } from 'Controls/heading';
import { Model } from 'Types/entity';

const ITEMS = new RecordSet<ITabAdaptiveButtonItem>({
    keyProperty: 'id',
    rawData: [
        {
            id: '1',
            caption: 'Смирнов И.А.',
            title: 'Смирнов Иван Александрович',
            customTemplate: titleTabTemplate,
            isMainTab: true,
        },
        {
            id: '2',
            caption: 'Другая вкладка',
            title: 'Другая вкладка',
        },
        {
            id: '3',
            caption: 'Настройка',
            title: 'Настройка',
        },
    ],
});

interface IItemTemplateProps {
    item: Model<ITabAdaptiveButtonItem>;
    selected: boolean;
    displayProperty: string;
}

function titleTabTemplate(props: IItemTemplateProps) {
    const { item, displayProperty } = props;

    const caption = item.get('caption') || item.get(displayProperty);
    return <Title caption={caption} fontSize="4xl" />;
}

export default forwardRef(function ItemTemplate(_, ref: LegacyRef<HTMLDivElement>) {
    const [selectedKey, setSelectedKey] = useState<TSelectedKey>('1');

    return (
        <div
            className="controls-margin_left-2xl tw-flex tw-items-center tw-justify-center"
            ref={ref}
        >
            <div data-qa="controlsDemo_capture">
                <AdaptiveButtons
                    className="controlsDemo_fixedWidth250"
                    selectedKey={selectedKey}
                    keyProperty="id"
                    items={ITEMS}
                    onSelectedKeyChanged={setSelectedKey}
                    itemTemplateProperty="customTemplate"
                    moreButtonAlign="end"
                />
            </div>
        </div>
    );
});

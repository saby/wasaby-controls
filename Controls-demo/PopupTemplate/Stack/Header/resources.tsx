import { RecordSet } from 'Types/collection';
import { showType } from 'Controls/toolbars';
import { useAdaptiveMode } from 'UI/Adaptive';
import { View } from 'Controls/toolbars';

const TOOLBAR_ITEMS = new RecordSet({
    rawData: [
        {
            id: '1',
            showType: showType.MENU,
            icon: 'icon-Time',
            '@parent': false,
            parent: null,
        },
        {
            id: '3',
            icon: 'icon-Print',
            showType: showType.MENU,
            title: 'Распечатать',
            caption: 'Распечатать',
            viewMode: 'link',
            '@parent': false,
            parent: null,
        },
        {
            id: '4',
            icon: 'icon-Linked',
            showType: showType.MENU,
            fontColorStyle: 'secondary',
            viewMode: 'ghost',
            iconStyle: 'secondary',
            contrastBackground: true,
            title: 'Связанные документы',
            '@parent': true,
            parent: null,
        },
        {
            id: '5',
            viewMode: 'icon',
            showType: showType.MENU,
            icon: 'icon-Link',
            title: 'Скопировать в буфер',
            '@parent': false,
            parent: null,
        },
        {
            id: '6',
            showType: showType.MENU,
            title: 'Прикрепить к',
            '@parent': false,
            parent: null,
            readOnly: true,
        },
    ],
    keyProperty: 'id',
});

export function ToolbarContentTemplate() {
    const isAdaptive = useAdaptiveMode().device.isPhone();
    return (
        <View
            items={TOOLBAR_ITEMS}
            className={!isAdaptive ? 'controls-margin_top-m' : ''}
            keyProperty="id"
            menuIconSize="m"
            inlineHeight="l"
        />
    );
}

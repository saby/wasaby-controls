import { forwardRef, LegacyRef, useState, useCallback } from 'react';
import { HorizontalCompactView, HeadCounter } from 'Controls-TabsLayout/colored';

const tabsConfig = [
    {
        key: '1',
        backgroundStyle: 'primary',
        itemTemplate: () => (
            <div>
                <div>Контент вкладки "Просрочено"</div>
                <div>Контент вкладки "Просрочено"</div>
                <div>Контент вкладки "Просрочено"</div>
                <div>Контент вкладки "Просрочено"</div>
                <div>Контент вкладки "Просрочено"</div>
                <div>Контент вкладки "Просрочено"</div>
                <div>Контент вкладки "Просрочено"</div>
                <div>Контент вкладки "Просрочено"</div>
                <div>Контент вкладки "Просрочено"</div>
                <div>Контент вкладки "Просрочено"</div>
                <div>Контент вкладки "Просрочено"</div>
                <div>Контент вкладки "Просрочено"</div>
                <div>Контент вкладки "Просрочено"</div>
                <div>Контент вкладки "Просрочено"</div>
            </div>
        ),
        counter: 3,
        icon: 'icon-Time',
        title: 'text',
    },
    {
        key: '2',
        backgroundStyle: 'link',
        itemTemplate: () => (
            <div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
                <div>Контент вкладки "Сделать"</div>
            </div>
        ),
        counter: 43,
        icon: 'icon-Yes',
        title: 'text',
    },
    {
        key: '3',
        backgroundStyle: 'success',
        itemTemplate: () => (
            <div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
                <div>Контент вкладки "Выполнено"</div>
            </div>
        ),
        counter: 98,
        icon: 'icon-Send',
        title: 'text',
    },
    {
        key: '4',
        backgroundStyle: 'warning',
        itemTemplate: () => (
            <div>
                <div>Контент вкладки "Сегодня"</div>
                <div>Контент вкладки "Сегодня"</div>
                <div>Контент вкладки "Сегодня"</div>
                <div>Контент вкладки "Сегодня"</div>
                <div>Контент вкладки "Сегодня"</div>
                <div>Контент вкладки "Сегодня"</div>
                <div>Контент вкладки "Сегодня"</div>
                <div>Контент вкладки "Сегодня"</div>
                <div>Контент вкладки "Сегодня"</div>
                <div>Контент вкладки "Сегодня"</div>
                <div>Контент вкладки "Сегодня"</div>
                <div>Контент вкладки "Сегодня"</div>
                <div>Контент вкладки "Сегодня"</div>
                <div>Контент вкладки "Сегодня"</div>
            </div>
        ),
        counter: 2,
        icon: 'icon-Gift',
        title: 'text',
    },
];

export default forwardRef(function CompactModeDemo(_: unknown, ref: LegacyRef<HTMLDivElement>) {
    const [selectedKey, setSelectedKey] = useState('1');
    const handleChangeSelectedKey = useCallback((key: string) => {
        setSelectedKey(key);
    }, []);

    return (
        <div ref={ref}>
            <HorizontalCompactView
                compactMode={true}
                items={tabsConfig}
                headTemplate={HeadCounter}
                selectedKey={selectedKey}
                className="controlsDemo__height400 controlsDemo__maxWidth500"
                onSelectedKeyChanged={handleChangeSelectedKey}
            />
        </div>
    );
});

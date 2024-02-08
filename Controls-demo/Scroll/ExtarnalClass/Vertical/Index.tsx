import { CSSProperties, forwardRef, LegacyRef } from 'react';
import { Container } from 'Controls/scroll';

const ITEM_STYLE: CSSProperties = {
    width: '100%',
    height: 50,
    boxSizing: 'border-box',
};

const TASKS = [
    {
        id: 1,
        text: 'Задача #1',
    },
    {
        id: 2,
        text: 'Задача #2',
    },
    {
        id: 3,
        text: 'Задача #3',
    },
    {
        id: 4,
        text: 'Задача #4',
    },
    {
        id: 5,
        text: 'Задача #5',
    },
    {
        id: 6,
        text: 'Задача #6',
    },
    {
        id: 7,
        text: 'Задача #7',
    },
    {
        id: 8,
        text: 'Задача #8',
    },
    {
        id: 9,
        text: 'Задача #9',
    },
    {
        id: 10,
        text: 'Задача #10',
    },
    {
        id: 11,
        text: 'Задача #11',
    },
    {
        id: 12,
        text: 'Задача #12',
    },
    {
        id: 13,
        text: 'Задача #13',
    },
    {
        id: 14,
        text: 'Задача #14',
    },
    {
        id: 15,
        text: 'Задача #15',
    },
    {
        id: 16,
        text: 'Задача #16',
    },
    {
        id: 17,
        text: 'Задача #17',
    },
    {
        id: 18,
        text: 'Задача #18',
    },
    {
        id: 19,
        text: 'Задача #19',
    },
    {
        id: 20,
        text: 'Задача #20',
    },
];

export default forwardRef(function Vertical(_, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div
            className="tw-flex controlsDemo__height500 controlsDemo__width800px controls-margin-m"
            data-qa="controlsDemo_capture"
            ref={ref}
        >
            <div className="tw-flex ws-flex-column controls-margin_left-s">
                <span className="controls-padding-s controls-background-unaccented-same">
                    Задача в разработку
                </span>
                <span className="controls-padding-s">Ошибка</span>
                <span className="controls-padding-s">Поручение</span>
            </div>
            <Container
                className="controls-Scroll-ContainerExternal-vertical tw-w-full"
                data-qa="Controls-demo_Scroll_ExtarnalClass_Vertical__scroll-container-vertical"
                content={
                    <div className="controls-margin_left-m controls-margin_right-m">
                        <div className="controls__block-wrapper">
                            {TASKS.map((task) => {
                                return (
                                    <div
                                        key={task.id}
                                        style={ITEM_STYLE}
                                        className="controls__block controls-padding-m controls-margin_bottom-m"
                                    >
                                        {task.text}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                }
            />
        </div>
    );
});

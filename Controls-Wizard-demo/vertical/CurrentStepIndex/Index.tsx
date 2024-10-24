import { forwardRef, LegacyRef, useMemo, useState, useCallback } from 'react';
import { Layout, ItemTemplate } from 'Controls-Wizard/vertical';
import { Number } from 'Controls/baseDecorator';

function VerticalWizardCurrentStepIndexDemo(_: unknown, ref: LegacyRef<HTMLDivElement>) {
    const items = useMemo(
        () => [
            {
                itemTemplate: ItemTemplate,
                title: 'Доходы',
                titleContentTemplate: <Number className="controls-margin_left-2xl" value="0" />,
                itemContentTemplate: 'Содержимого шага 1',
            },
            {
                itemTemplate: ItemTemplate,
                title: 'Уменьшение',
                titleContentTemplate: <Number className="controls-margin_left-2xl" value="31010" />,
                itemContentTemplate: 'Содержимого шага 2',
            },
            {
                itemTemplate: ItemTemplate,
                title: 'Расчет',
                titleContentTemplate: <Number className="controls-margin_left-2xl" value="0" />,
                itemContentTemplate: 'Содержимого шага 3',
            },
            {
                itemTemplate: ItemTemplate,
                title: 'Отправка',
                titleContentTemplate: <Number className="controls-margin_left-2xl" value="57000" />,
                itemContentTemplate: 'Содержимого шага 4',
            },
            {
                itemTemplate: ItemTemplate,
                title: 'Уплата',
                titleContentTemplate: <Number className="controls-margin_left-2xl" value="10000" />,
                itemContentTemplate: 'Содержимого шага 5',
            },
        ],
        []
    );

    const [currentStepIndex, setCurrentStepIndex] = useState(3);
    const [selectedStepIndex, setSelectedStepIndex] = useState(1);
    const selectedStepIndexChangedHandler = useCallback((newIndex: number) => {
        setSelectedStepIndex(newIndex);
        setCurrentStepIndex((prev) => (prev <= newIndex ? newIndex : prev));
    }, []);

    return (
        <div ref={ref}>
            <Layout
                items={items}
                selectedStepIndex={selectedStepIndex}
                onSelectedStepIndexChanged={selectedStepIndexChangedHandler}
                currentStepIndex={currentStepIndex}
            />
        </div>
    );
}

export default forwardRef(VerticalWizardCurrentStepIndexDemo);

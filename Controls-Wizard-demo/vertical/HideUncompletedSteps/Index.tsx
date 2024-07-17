import { forwardRef, LegacyRef, useState, useCallback, useMemo } from 'react';
import { Layout } from 'Controls-Wizard/vertical';
import * as itemTemplate from 'wml!Controls-Wizard-demo/vertical/ItemTemplate/itemTemplate';

export default forwardRef(function ShowActionButtonsDemo(
    props: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    const [selectedStepIndex, setSelectedStepIndex] = useState(0);
    const selectedStepIndexChangedHandler = useCallback((newIndex: number, completed: boolean) => {
        setSelectedStepIndex(newIndex);
        if (completed) {
            alert('Wizard complete');
        }
    }, []);

    const wizardItems = useMemo(
        () => [
            {
                title: 'Заголовок 1',
                itemTemplate,
            },
            {
                title: 'Заголовок 2',
                itemTemplate,
                nextButtonCaption: 'Всё верно',
            },
            {
                title: 'Заголовок 3',
                itemTemplate,
            },
        ],
        []
    );

    return (
        <div ref={ref} className="tw-flex tw-h-full">
            <Layout
                items={wizardItems}
                selectedStepIndex={selectedStepIndex}
                onSelectedStepIndexChanged={selectedStepIndexChangedHandler}
                nextButtonCaption="Далее"
                completeButtonCaption="Завершить"
                hideUncompletedSteps={true}
            />
        </div>
    );
});

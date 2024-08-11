import { forwardRef, LegacyRef, useState, useCallback, useMemo } from 'react';
import { IAdditionalButtonsConfig, Layout } from 'Controls-Wizard/vertical';
import * as itemTemplate from 'wml!Controls-Wizard-demo/vertical/ItemTemplate/itemTemplate';
import { RecordSet } from 'Types/collection';
import 'css!Controls-Wizard-demo/vertical/ActionButtons/style';

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
            },
            {
                title: 'Заголовок 3',
                itemTemplate,
            },
        ],
        []
    );

    const buttonsConfig = useMemo(
        () =>
            new RecordSet<IAdditionalButtonsConfig>({
                keyProperty: 'step',
                rawData: [
                    {
                        step: 1,
                        buttonsConfig: [
                            {
                                caption: 'Я подтвердил',
                                clickCallback: () =>
                                    alert('Вы нажали на кнопку доп. действия на первом шаге'),
                                isAdaptive: true,
                            },
                        ],
                    },
                    {
                        step: 2,
                        buttonsConfig: [
                            {
                                caption: 'Я подтвердил',
                                clickCallback: () =>
                                    alert(
                                        'Вы нажали на первую кнопку доп. действия на втором шаге'
                                    ),
                                isAdaptive: true,
                            },
                            {
                                caption: 'Я не подтвердил',
                                clickCallback: () =>
                                    alert(
                                        'Вы нажали на первую кнопку доп. действия на втором шаге'
                                    ),
                            },
                        ],
                    },
                ],
            }),
        []
    );

    return (
        <div ref={ref} className="tw-flex controlsWizardDemo__wrapper">
            <Layout
                items={wizardItems}
                selectedStepIndex={selectedStepIndex}
                onSelectedStepIndexChanged={selectedStepIndexChangedHandler}
                nextButtonCaption="Далее"
                completeButtonCaption="Завершить"
                additionalButtonsConfig={buttonsConfig}
            />
        </div>
    );
});

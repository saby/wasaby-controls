import { forwardRef, LegacyRef, useState, useCallback, useMemo } from 'react';
import { IAdditionalButtonsConfig, Layout } from 'Controls-Wizard/vertical';
import * as itemTemplate from 'wml!Controls-Wizard-demo/vertical/ItemTemplate/itemTemplate';
import { RecordSet } from 'Types/collection';
import { Confirmation } from 'Controls/popup';
import 'css!Controls-Wizard-demo/vertical/ActionButtons/style';

export default forwardRef(function ShowActionButtonsDemo(
    props: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    const [selectedStepIndex, setSelectedStepIndex] = useState(0);
    const selectedStepIndexChangedHandler = useCallback((newIndex: number, completed: boolean) => {
        setSelectedStepIndex(newIndex);
        if (completed) {
            Confirmation.openPopup({
                message: 'Wizard complete',
                type: 'ok',
            });
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
                                    Confirmation.openPopup({
                                        message: 'Вы нажали кнопку доп. действия на первом шаге',
                                        type: 'ok',
                                    }),
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
                                    Confirmation.openPopup({
                                        message:
                                            'Вы нажали на первую кнопку доп. действия на втором шаге',
                                        type: 'ok',
                                    }),
                                isAdaptive: true,
                            },
                            {
                                caption: 'Я не подтвердил',
                                clickCallback: () =>
                                    Confirmation.openPopup({
                                        message:
                                            'Вы нажали на вторую кнопку доп. действия на втором шаге',
                                        type: 'ok',
                                    }),
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

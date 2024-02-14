import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { IVerticalItem } from 'Wizard/vertical';
import { ReactiveObject } from 'Types/entity';
import * as template from 'wml!Controls-Wizard-demo/vertical/WrappedLayout/Vertical';
import { Memory } from 'Types/source';
import 'css!Controls-Wizard-demo/common/Vertical';

export default class VerticalBaseDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected selectedStepIndex: number;
    // @ts-ignore
    protected _items: ReactiveObject<IVerticalItem>;
    protected _step4: IVerticalItem;
    protected _itemBackgroundStyle: object = {
        future: 'notContrast',
        active: 'default',
        completed: 'default',
    };

    protected _beforeMount(): void {
        this.selectedStepIndex = 0;
        this._items = [
            new ReactiveObject({
                title: 'Если входящий документ',
                contentTemplate: 'Controls-Wizard-demo/vertical/WrappedLayout/VerticalStep1',
                contrastBackgroundCompleted: true,
                contentTemplateOptions: {
                    finishStepHandler: this.finishStepHandler,
                    finishWizardHandler: this.finishWizardHandler,
                    textInputValue: 'Лопырев договор',
                    finished: false,
                },
            }),
            new ReactiveObject({
                title: 'Регистрируем как',
                contentTemplate: 'Controls-Wizard-demo/vertical/WrappedLayout/VerticalStep2',
                contentTemplateOptions: {
                    finishStepHandler: this.finishStepHandler,
                    finishWizardHandler: this.finishWizardHandler,
                    stepBackHandler: this.stepBackHandler,
                    finished: false,
                },
            }),
            new ReactiveObject({
                title: 'В качестве ответственного назначить',
                contentTemplate: 'Controls-Wizard-demo/vertical/WrappedLayout/VerticalStep3',
                contentTemplateOptions: {
                    finishStepHandler: this.finishStepHandler,
                    finishWizardHandler: this.finishWizardHandler,
                    stepBackHandler: this.stepBackHandler,
                    finished: false,
                },
            }),
        ];
        this._step4 = new ReactiveObject({
            title: 'Если ответственный не определится, то можно будет назначить',
            contentTemplate: 'Controls-Wizard-demo/vertical/WrappedLayout/VerticalStep4',
            contentTemplateOptions: {
                finishStepHandler: this.finishStepHandler,
                finishWizardHandler: this.finishWizardHandler,
                stepBackHandler: this.stepBackHandler,
                finished: true,
            },
        });
    }

    protected finishStepHandler = (event: SyntheticEvent<Event>, stepIndex: number): void => {
        this.selectedStepIndex = stepIndex + 1;
        this._items[stepIndex].contentTemplateOptions = {
            finishStepHandler: this.finishStepHandler,
            finishWizardHandler: this.finishWizardHandler,
            stepBackHandler: this.stepBackHandler,
            finished: true,
        };

        if (stepIndex === 2) {
            if (this._items.length === 3) {
                this._items.push(this._step4);
            }
            this.selectedStepIndex = 3;
        }

        if (stepIndex === 3 && this._items.length === 4) {
            this._items.pop();
        }
        this._forceUpdate();
    };

    protected finishWizardHandler = (event: SyntheticEvent<Event>, stepIndex: number) => {
        if (this._items.length === 4) {
            this._items.pop();
        }
        this._items[2].contentTemplateOptions = {
            finishStepHandler: this.finishStepHandler,
            finishWizardHandler: this.finishWizardHandler,
            stepBackHandler: this.stepBackHandler,
            finished: true,
        };
        this.selectedStepIndex = 5;
    };

    protected stepBackHandler = (event: SyntheticEvent<Event>, stepIndex: number): void => {
        this._items[1].contentTemplateOptions = this._items[2].contentTemplateOptions = {
            finishStepHandler: this.finishStepHandler,
            finishWizardHandler: this.finishWizardHandler,
            stepBackHandler: this.stepBackHandler,
            finished: false,
        };

        if (this._items.length === 4) {
            this._items.pop();
        }
        this.selectedStepIndex = 1;
    };

    /**
     * Метод, имитирующий конфигурацию для предзагрузки данных.
     */
    static getLoadConfig(): any {
        return {
            areaData: {
                dataFactoryName: 'Controls/dataFactory:Area',
                dataFactoryArguments: {
                    initialKeys: ['0'],
                    configs: {
                        0: {
                            data: {
                                dataFactoryName: 'Controls/dataFactory:List',
                                dataFactoryArguments: {
                                    source: new Memory({
                                        keyProperty: 'id',
                                        data: [
                                            {
                                                id: 1,
                                                title: 'содержит вложения',
                                                description: '• содержит вложения',
                                            },
                                            {
                                                id: 2,
                                                title: 'Notebooks 2',
                                                description: '• пришел от контрагента',
                                            },
                                            {
                                                id: 3,
                                                title: 'Smartphones 3 ',
                                                description: '• для нашей организации',
                                            },
                                            {
                                                id: 4,
                                                title: 'Notebooks 2',
                                                description: '• c ключевыми словами',
                                            },
                                        ],
                                    }),
                                },
                            },
                        },
                        1: {
                            data: {
                                dataFactoryName: 'Controls/dataFactory:List',
                                dataFactoryArguments: {
                                    source: new Memory({
                                        keyProperty: 'id',
                                        data: [
                                            {
                                                id: 1,
                                                description: '• Поступление товаров и услуг',
                                            },
                                            {
                                                id: 2,
                                                description: '• Счет',
                                            },
                                            {
                                                id: 3,
                                                description: '• Письмо',
                                            },
                                            {
                                                id: 4,
                                                description: '• Входящий договор',
                                            },
                                        ],
                                    }),
                                    source2: new Memory({
                                        keyProperty: 'id',
                                        data: [
                                            {
                                                id: 1,
                                                description: '• отклонить',
                                            },
                                        ],
                                    }),
                                },
                            },
                        },
                        2: {
                            data: {
                                dataFactoryName: 'Controls/dataFactory:List',
                                dataFactoryArguments: {
                                    source: new Memory({
                                        keyProperty: 'id',
                                        data: [
                                            {
                                                id: 1,
                                                description: '• конкретного сотрудника',
                                            },
                                            {
                                                id: 2,
                                                description:
                                                    '• конкретный сотрудник или подразделение, указанное отправителем в документе',
                                            },
                                            {
                                                id: 3,
                                                description:
                                                    '• сотрудник, закрепленный за контрагентом',
                                            },
                                            {
                                                id: 4,
                                                description:
                                                    '• обособленное подразделение, соответствующее адресу в документе',
                                            },
                                            {
                                                id: 5,
                                                description:
                                                    '• ответственный за документ-основание, например, за счет или договор',
                                            },
                                            {
                                                id: 6,
                                                description:
                                                    '• подразделение, соответствующее нашей организации',
                                            },
                                            {
                                                id: 7,
                                                description:
                                                    '• ответственного с предыдущего документа от контрагента',
                                            },
                                        ],
                                    }),
                                },
                            },
                        },
                        3: {
                            data: {
                                dataFactoryName: 'Controls/dataFactory:List',
                                dataFactoryArguments: {
                                    source: new Memory({
                                        keyProperty: 'id',
                                        data: [
                                            {
                                                id: 1,
                                                description:
                                                    '• конкретный сотрудник или подразделение, указанное отправителем в документе',
                                            },
                                            {
                                                id: 2,
                                                description:
                                                    '• обособленное подразделение, соответствующее адресу в документе',
                                            },
                                            {
                                                id: 3,
                                                description:
                                                    '• ответственный за документ-основание, например, за счет или договор',
                                            },
                                            {
                                                id: 4,
                                                description:
                                                    '• подразделение, соответствующее нашей организации',
                                            },
                                            {
                                                id: 5,
                                                description:
                                                    '• ответственного с предыдущего документа от контрагента',
                                            },
                                        ],
                                    }),
                                },
                            },
                        },
                    },
                },
            },
        };
    }
}

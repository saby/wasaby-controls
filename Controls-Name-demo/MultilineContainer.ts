import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Name-demo/MultilineContainer';
import 'css!Controls-Name-demo/Demo';
import { Memory } from 'Types/source';
import { Record as entityRecord } from 'Types/entity';
import { SyntheticEvent } from 'UICommon/Events';

class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _lastName: string = '';
    protected _middleName: string = '';
    protected _firstName: string = '';
    protected _nameFields: string[] = [];
    protected _nameFields2: string[] = [];
    private _suggestSource: Memory = null;
    protected _copyItems: object[] = [];

    _beforeMount(): void {
        this._nameFields = ['lastName'];
        this._nameFields2 = ['firstName', 'middleName'];
        this._suggestSource = new Memory({
            keyProperty: 'id',
            data: [
                { id: 1, suggestValue: 'Алексей', type: 'firstName' },
                { id: 2, suggestValue: 'Александр', type: 'firstName' },
                { id: 3, suggestValue: 'Андрей', type: 'firstName' },
                { id: 4, suggestValue: 'Владимир', type: 'firstName' },
                { id: 5, suggestValue: 'Иван', type: 'firstName' },
                { id: 6, suggestValue: 'Илья', type: 'firstName' },
                { id: 7, suggestValue: 'Алексеев', type: 'lastName' },
                { id: 8, suggestValue: 'Александров', type: 'lastName' },
                { id: 9, suggestValue: 'Иванов', type: 'lastName' },
                { id: 10, suggestValue: 'Алексеевич', type: 'middleName' },
                { id: 11, suggestValue: 'Александрович', type: 'middleName' },
                { id: 12, suggestValue: 'Андреевич', type: 'middleName' },
                { id: 13, suggestValue: 'Иванович', type: 'middleName' },
                { id: 14, suggestValue: 'Ильич', type: 'middleName' },
                { id: 15, suggestValue: 'Владимирович', type: 'middleName' },
            ],
            filter: (item, queryFilter: Record<string, string | unknown>) => {
                let addToData = true;
                // значение контрола
                const filterValue = queryFilter.value;
                // какое из полей ФИО редактируется
                const hintFieldType = queryFilter.hintFieldType as string;
                // Значение в редактируемом поле
                const hintFieldValue = filterValue[hintFieldType || 'firstName'];

                if (
                    hintFieldValue &&
                    item.get('suggestValue').toLowerCase().indexOf(hintFieldValue.toLowerCase()) !==
                        0
                ) {
                    addToData = false;
                }
                if (hintFieldType && item.get('type') !== hintFieldType) {
                    addToData = false;
                }
                return addToData;
            },
        });
        this._suggestSource.create = (params: {
            value?: string;
            order: string[];
            firstName?: string;
            middleName?: string;
            lastName?: string;
        }) => {
            const rawData: {
                firstName?: string;
                middleName?: string;
                lastName?: string;
                order?: string[];
            } = {};
            if (typeof params.value === 'string') {
                // обработка вставки в поле ввода
                let valueArr: string[] = params.value.split(' ');
                valueArr = valueArr.filter((s: string) => {
                    return !!s.length;
                });
                // если частей больше 3, то все оставшиеся объединяем в одну.
                if (valueArr.length > params.order.length) {
                    const rest = valueArr.splice(params.order.length - 1).join(' ');
                    valueArr.push(rest);
                }
                params.order.forEach((fieldName, index) => {
                    rawData[fieldName] = valueArr[index] || '';
                });
            } else {
                params.order.forEach((fieldName) => {
                    rawData[fieldName] = params[fieldName] || '';
                });
            }
            let temp;
            // определение правильных позиций поля в ФИО
            const resultOrder = params.order.slice(); // copy array
            const swapOrderFields = (field1, field2) => {
                if (field1 !== field2) {
                    const idx1 = resultOrder.indexOf(field1);
                    const idx2 = resultOrder.indexOf(field2);
                    temp = resultOrder[idx1];
                    resultOrder[idx1] = resultOrder[idx2];
                    resultOrder[idx2] = temp;
                }
            };
            for (let i = 0; i < 2; i++) {
                params.order.forEach((fieldName) => {
                    switch (rawData[fieldName]) {
                        case 'Иван':
                            temp = rawData.firstName;
                            rawData.firstName = rawData[fieldName];
                            rawData[fieldName] = temp;
                            swapOrderFields('firstName', fieldName);
                            break;
                        case 'Иванов':
                            temp = rawData.lastName;
                            rawData.lastName = rawData[fieldName];
                            rawData[fieldName] = temp;
                            swapOrderFields('lastName', fieldName);
                            break;
                        case 'Иванович':
                            temp = rawData.middleName;
                            rawData.middleName = rawData[fieldName];
                            rawData[fieldName] = temp;
                            swapOrderFields('middleName', fieldName);
                            break;
                    }
                });
            }
            rawData.order = resultOrder;
            const record = new entityRecord({
                rawData,
            });
            return new Promise((resolve) => {
                // эмуляция задержки БЛ.
                setTimeout(() => {
                    resolve(record);
                }, 100);
            });
        };

        this._copyItems = [
            {
                id: 'copy1',
                caption: 'Строка 1',
                text: 'Иванов\tИван\tИванович оглы',
            },
            {
                id: 'copy2',
                caption: 'Строка 2',
                text: 'Иванович\tИванов\tИван',
            },
            {
                id: 'copy3',
                caption: 'Строка 3',
                text: 'Иван Иванов Иванович',
            },
            {
                id: 'copy4',
                caption: 'Строка 4',
                text: 'Иванов Иван Иванович ',
            },
            {
                id: 'copy5',
                caption: 'Строка 5',
                text: 'Иван Иванов',
            },
        ];
    }

    protected _copyClickHandler(event: SyntheticEvent<Event>, childrenName: string): void {
        Demo.copy(this._children[childrenName] as Element);
    }

    static copy(container: Element): void {
        const selection = getSelection();
        selection.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(container);
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
    }
}

export default Demo;

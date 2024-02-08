import { IActionConfig } from 'Controls-Input/interface';
import { ObjectType, StringType, NumberType } from 'Meta/types';

const actions: IActionConfig<object>[] = [
    {
        id: 'showTextAlert',
        category: 'Всплывающие уведомления',
        title: 'Показать Alert с текстом',
        icon: 'icon-Alert',
        commandName: 'Controls-Input-demo/ButtonConnected/ActionButton/commands/AlertMessage',
        propsMeta: ObjectType.id('alert-text').attributes({
            message: StringType.title('Сообщение').optional(),
        }),
    },
    {
        id: 'showObjectAlert',
        category: 'Всплывающие уведомления',
        title: 'Показать Alert со значениями',
        icon: 'icon-Alert',
        commandName: 'Controls-Input-demo/ButtonConnected/ActionButton/commands/Alert',
        propsMeta: ObjectType.id('alert-text').attributes({
            firstName: StringType.title('Имя').optional(),
            lastName: StringType.title('Фамилия').optional(),
            age: NumberType.title('Возраст').optional(),
        }),
    },
];

export { actions };

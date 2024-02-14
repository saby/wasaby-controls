import { IActionConfig } from 'Controls-Buttons/interface';
import { ObjectType, StringType, NumberType } from 'Types/meta';

const actions: IActionConfig[] = [
    {
        id: 'showTextAlert',
        category: 'Всплывающие уведомления',
        title: 'Показать Alert с текстом',
        icon: 'icon-Alert',
        commandName: 'Controls-Buttons-demo/ActionButton/commands/AlertMessage',
        propsMeta: ObjectType.id('alert-text').attributes({
            message: StringType.title('Сообщение').optional(),
        }),
    },
    {
        id: 'showObjectAlert',
        category: 'Всплывающие уведомления',
        title: 'Показать Alert со значениями',
        icon: 'icon-Alert',
        commandName: 'Controls-Buttons-demo/ActionButton/commands/Alert',
        propsMeta: ObjectType.id('alert-text').attributes({
            firstName: StringType.title('Имя').optional(),
            lastName: StringType.title('Фамилия').optional(),
            age: NumberType.title('Возраст').optional(),
        }),
    },
];

export { actions };

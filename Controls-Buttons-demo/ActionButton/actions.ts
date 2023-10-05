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
            message: StringType.title('Сообщение'),
        }),
    },
    {
        id: 'showObjectAlert',
        category: 'Всплывающие уведомления',
        title: 'Показать Alert со значениями',
        icon: 'icon-Alert',
        commandName: 'Controls-Buttons-demo/ActionButton/commands/Alert',
        propsMeta: ObjectType.id('alert-text').attributes({
            firstName: StringType.title('Имя'),
            lastName: StringType.title('Фамилия'),
            age: NumberType.title('Возраст'),
        }),
    },
];

export { actions };

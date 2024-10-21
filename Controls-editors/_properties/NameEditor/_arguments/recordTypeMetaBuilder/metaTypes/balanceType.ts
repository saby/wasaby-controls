import { ObjectType, DateType } from 'Meta/types';
import { BookkeepingAccountType, TBookkeepingAccount } from './bookkeepingAccountType';
import { FaceType, TFace } from './faceType';
import { IDataObjectArgumentType } from '../../dataTypes';

/*
 * Тип аргумента Сальдо
 */
interface IBalanceArgsType {
    /**
     * Счет учета по которому получаем сальдо
     */
    Account: TBookkeepingAccount;
    /**
     * Дата, на которую получаем сальдо, если на задана, то на текущую
     */
    Date?: Date;
    /**
     * Аналитика 1
     */
    Face1: TFace;
    /**
     * Аналитика 2
     */
    Face2: TFace;
    /**
     * Аналитика 3
     */
    Face3: TFace;
    /**
     * Аналитика 4
     */
    Face4: TFace;
}

/*
 * Мета-тип аргумента Сальдо
 */
const BalanceArgsType = ObjectType.id('ArgumentsEditor/fakeTypes:BalanceArgsType')
    .properties<IBalanceArgsType>({
        Account: BookkeepingAccountType.required(),
        Date: DateType.optional().hidden().editor('Controls-editors/date:DateEditor'),
        Face1: FaceType.optional(),
        Face2: FaceType.optional(),
        Face3: FaceType.optional(),
        Face4: FaceType.optional(),
    })
    .editor('Controls-editors/function:FaceEditor');

function isBalanceArgsType(fields: IDataObjectArgumentType[]): boolean {
    const expectedTypes: Record<keyof IBalanceArgsType, string> = {
        Account: 'BookkeepingAccount',
        Date: 'Date',
        Face1: 'Face',
        Face2: 'Face',
        Face3: 'Face',
        Face4: 'Face',
    };

    for (const [name, type] of Object.entries(expectedTypes)) {
        const field = fields.find((x) => x.name === name);

        if (!field) {
            return false;
        }

        if (field.type !== type) {
            return false;
        }
    }

    return true;
}

export { IBalanceArgsType, BalanceArgsType, isBalanceArgsType };

import { ObjectMeta } from 'Meta/types';

const PARAMETERS_FIELD = 'parameters';
const RETURN_VALUE_FIELD = 'return_value';

interface IFunctionCallMeta {
    arguments: ObjectMeta | null;
    returnValue: ObjectMeta | null;
}

export { IFunctionCallMeta, PARAMETERS_FIELD, RETURN_VALUE_FIELD };

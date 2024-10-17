import { INoJumpingLabelOptions } from './INoJumpingLabelOptions';
import { IRequiredOptions } from './IRequiredOptions';
import { INameOptions } from './INameOptions';
import { Model } from 'Types/entity';

/**
 * Интерфейс значение имени.
 * @public
 */
export interface INameValue {
    /**
     * Значение поля имени.
     */
    FirstName?: string;
    /**
     * Значение поля отчества.
     */
    MiddleName?: string;
    /**
     * Значение поля фамилии.
     */
    LastName?: string;
}

/**
 * Интерфейс для редактора типа "ФИО", работающий со слайсом формы
 * @extends Controls/interface:IBorderStyle
 * @extends Controls/interface:IFontWeight
 * @extends Controls/interface:IFilter
 * @extends Controls/interface:IFontColorStyle
 * @extends Controls/input:IBorderVisibility
 * @extends Controls/interface:IFontSize
 * @extends Controls/interface:IHeight
 * @extends Controls/interface:IValidationStatus
 * @extends Controls/interface:ISuggest
 * @extends Controls/interface:ISource
 * @extends Controls/_input/interface/ITag
 * @extends Controls-Name/Input:ISuggestInput
 * @public
 */
export interface INameProps extends INameOptions, INoJumpingLabelOptions, IRequiredOptions {
    /**
     * Значение поля имени.
     */
    value?: Model<INameValue>;
}

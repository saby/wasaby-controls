/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export interface IDateConstructorOptions {
    dateConstructor?: Function;
}

/**
 * Интерфейс для контролов, которые возвращают даты. Позволяет задать конструктор для создания дат.
 * @public
 */

export default interface IDateConstructor {
    readonly '[Controls/_interface/IDateConstructor]': boolean;
}
/**
 * @name Controls/_interface/IDateConstructor#dateConstructor
 * @cfg {Function} Конструктор, который будет использоваться при создании объектов дат и времени.
 * @remark В качестве значения нужно передавать класс, наследуемый от нативного объекта Date
 * @default Types/entity:Date
 */

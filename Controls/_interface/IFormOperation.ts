/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * Интерфейс для контролов, которые реагируют на события формы редактирования записи.
 * @public
 */

export default interface IFormOperation {
    save: Function;
    cancel: Function;
    isDestroyed: Function;
}

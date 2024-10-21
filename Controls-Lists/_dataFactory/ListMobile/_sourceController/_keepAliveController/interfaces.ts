/**
 * Параметры конструктора источника данных
 * @private
 */
export interface TGinniSourceConstructorOptions {
    provider: string;
    endpoint: {
        address: string;
        contract: string;
    };
}

/**
 * Действие вывода Alert с сообщением
 */
export default class Alert {
    execute(options: any, props: object): void {
        alert(`Вызывано действие вывода тектового Alert с сообщемнием: ${props.message}`);
    }
}

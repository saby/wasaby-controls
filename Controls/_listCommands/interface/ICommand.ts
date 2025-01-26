export interface ICommand<T = unknown, K = unknown> {
    execute(options: T): K;
}

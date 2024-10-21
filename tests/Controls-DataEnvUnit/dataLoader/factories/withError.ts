export default {
    async loadData(args: { loaderName: string }): Promise<Error> {
        return Promise.reject(new Error(`Какая-то ошибка из загрузчика ${args.loaderName}`));
    },
};

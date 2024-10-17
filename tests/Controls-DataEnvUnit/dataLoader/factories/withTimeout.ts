export default {
    async loadData(args: { timeout: number }): Promise<unknown> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, args.timeout);
        });
    },
};

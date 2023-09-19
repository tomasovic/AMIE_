"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolvers = {
    User: {
        users: ({ id }, _, { client }) => {
            const suers = client.user.findMany({
                where: {
                    id: id,
                },
            });
            return {
                ok: true,
                users: suers,
            };
        },
    }
};
exports.default = resolvers;

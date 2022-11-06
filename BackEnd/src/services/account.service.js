const knex = require('../database/knex');

class AccountService {

    constructor() {
        this.accounts = knex('users');
    }

    #register(payload) {
        const account = {...payload};
        const accountProperties = [
            "email", "password"
        ];

        Object.keys(account).forEach(function(key) {
            if (accountProperties.indexOf(key) == -1) {
                delete account[key];
            }
        });
        return account;
    }

    async findByEmail(email) {
        return await this.accounts
            .where('email', 'like', `%${email}%`)
            .select('*');
    }

    async findByPassword(password) {
        return await this.accounts
            .where('password', password)
            .select('*');
    }

    async login(email, password) {
        return await this.accounts
        .where('email', 'like', `%${email}%`)
        .where('password', 'like', `%${password}%`)
        .select('*');
    }

    async all () {
        return await this.accounts.select('*');
    }

    async create(payload) {
        const account = this.#register(payload);
        await this.accounts.insert(account);
        return {...account};
    }
}

module.exports = AccountService;
const knex = require('../database/knex');

class ContactService {
    constructor() {
        this.contacts = knex('contacts');
    }

    #getContact(payload) {
        const contact = {...payload};
        const contactProperties = [
            "name", "email", "address", "phone", "favorite"
        ];

        Object.keys(contact).forEach(function(key) {
            if (contactProperties.indexOf(key) == -1) {
                delete contact[key];
            }
        });
        return contact;
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

    async create(payload) {
        const contact = this.#getContact(payload);
        const [id] = await this.contacts.insert(contact);
        return { id, ...contact};
    }

    async all() {
        return await this.contacts.select('*');
    }

    async findByName(name) {
        return await this.contacts
            .where('name', 'like', `%${name}%`)
            .select('*');
    }

    async findById(id ) {
        return await this.contacts.where('id', id).select('*').first();
    }

    async update(id, payload) {
        const update = this.#getContact(payload);
        return await this.contacts.where('id', id).update(update);
    }

    async delete(id) {
        return await this.contacts.where('id', id).del();
    }

    async allFavorite() {
        return await this.contacts.where('favorite', 1).select('*');
    }

    async deleteAll() {
        return await this.contacts.del();
    }

    async findByEmail(email) {
        return await this.accounts
            .where('email', 'like', `%${email}%`)
            .select('*');
    }

    async findByPassword(password) {
        return await this.accounts.where('password', password).select('*').first();
    }

}

module.exports = ContactService;
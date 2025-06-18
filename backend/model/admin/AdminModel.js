class AdminModel{
    constructor() {
        this._id_admin = null;
        this._email_admin = null;
        this._senha_admin = null;
    }

    //setters

    set id_admin(value) {
        this._id_admin = value;
    }

    set email_admin(value) {
        this._email_admin = value;
    }

    set senha_admin(value) {
        this._senha_admin = value;
    }

    //getters

    get id_admin() {
        return this._id_admin;
    }

    get email_admin() {
        return this._email_admin;
    }

    get senha_admin() {
        return this._senha_admin;
    }


}

module.exports = AdminModel;
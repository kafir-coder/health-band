export class PhoneNotFoundAtLogin extends Error {
    constructor() {
        super()
        this.name = "PhoneNotFoundAtLogin"
        this.message = "invalid login parameters"
    }

}

export class InvalidPassword extends Error {
    constructor() {
        super()
        this.name = "InvalidPassword"
        this.message = "invalid password"
    }
}

class ArgumentMissing extends Error {
    constructor() {
        super()
        this.type = 'ARGUMENT_MISSING'
        this.message = 'An argument is missing'
        
    }

}

module.exports = ArgumentMissing
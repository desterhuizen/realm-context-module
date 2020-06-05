class Values {
    constructor() {
        this.values = {};
    }

    get ( valueName ) {
        if (!valueName) {
            throw new Error("Please provide a name for the value you ar loading");
        }

    }
}

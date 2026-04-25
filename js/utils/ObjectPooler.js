export class ObjectPooler {
    constructor(factoryFn, poolSize) {
        this.factoryFn = factoryFn;
        this.pool = [];
        this.active = [];

        // Pre-populate pool
        for (let i = 0; i < poolSize; i++) {
            this.pool.push(this.factoryFn());
        }
    }

    get() {
        let obj;
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.factoryFn();
            console.log("[DEV] Pool expanded, created new object");
        }
        this.active.push(obj);
        return obj;
    }

    updateAll(dt, ...args) {
        // Update in reverse
        for (let i = this.active.length - 1; i >= 0; i--) {
            const obj = this.active[i];
            obj.update(dt, ...args);

            if (!obj.active) {
                this.release(obj);
            }
        }
    }

    release(obj) {
        const index = this.active.indexOf(obj);
        if (index > -1){
            this.active.splice(index, 1);
            obj.reset();
            this.pool.push(obj);
        }
    }

    releaseAll() { 
        for (let i = 0; i < this.active.length; i++) {
            const obj = this.active[i];
            obj.reset();
            this.pool.push(obj);
        }
        this.active = [];
    }
}

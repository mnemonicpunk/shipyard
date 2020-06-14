class MapData {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.machines = [];
    }
    clear() {
        this.machines = [];
    }
    addMachine(machine) {
        this.machines.push(machine);
    }
    removeMachine(machine) { 
        let idx = -1;
        for (let i=0; i<this.machines.length; i++) {
            if (this.machines[i] == machine) { 
                idx = i;
            }
        }
        if (idx != -1) {
            this.machines.splice(idx, 1);
        }
    }
    sort() {
        let sorting = true;
        while(sorting) {
            sorting = false; {
                for (let i=0; i<this.machines.length-1; i++) {
                    if (this.machines[i].y > this.machines[i+1].y) {
                        let tmp = this.machines[i];
                        this.machines[i] = this.machines[i+1];
                        this.machines[i+1] = tmp;
                        sorting = true;
                    }
                }
            }
        }
    }
    findMachineAt(x, y) {
        for (let i=0; i<this.machines.length; i++) {
            if (this.machines[i].isAt(x, y)) { 
                return this.machines[i];
            }
        }
        return null;
    }
    getData() {
        let data = [];
        for (let i=0; i<(this.width*this.height); i++) {
            let x = i%this.width;
            let y = Math.floor(i/this.width);
            let m = this.findMachineAt(x, y);

            let idx = 0;
            if (m != null) {
                for (let j=0; j < MACHINE_TYPES.length; j++) {
                    if (m.type == MACHINE_TYPES[j].type) {
                        idx = j;
                    }
                }
                data.push({
                    type_num: idx,
                    direction: m.direction
                });
            } else {
                data.push(null);
            }
        }
        return {
            width: this.width,
            height: this.height,
            data: data
        }
    }
    fromData(data) {
        this.clear();
        for (let i=0; i<(this.width*this.height); i++) {
            let x = i%this.width;
            let y = Math.floor(i/this.width);

            if (data[i] != null) {
                let m = new Machine(MACHINE_TYPES[data[i].type_num].type);
                m.x = x;
                m.y = y;
                m.direction = data[i].direction;
                this.machines.push(m);
            }
        }        
        console.dir(this);
    }
}
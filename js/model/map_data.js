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
    getEncodedData() {
        let d = this.getData();
        let raw = d.data;
        let enc = [];
        let rle_counter = 0;

        for (let i=0; i<raw.length; i++) {
            if (raw[i] == null) {
                rle_counter++;
                if (rle_counter == 3) {
                    enc.push(-1);
                    enc.push(rle_counter);

                    rle_counter = 0;
                }
            } else {
                if (rle_counter > 0) {
                    enc.push(-1);
                    enc.push(rle_counter);

                    rle_counter = 0;
                }
                enc.push(raw[i].type_num);
                enc.push(Math.floor(raw[i].direction/90));
            }
        }
        if (rle_counter > 0) {
            enc.push(-1);
            enc.push(rle_counter);
        }

        // encode tightly
        let buffer = new ArrayBuffer(Math.floor(enc.length/2)+2);
        let view = new Uint8Array(buffer);

        view[0] = d.width;
        view[1] = d.height;

        for (let i=2; i<buffer.byteLength; i++) {
            view[i] = enc[(i-2)*2]+1;
            view[i] |= enc[((i-2)*2)+1] << 6;
        }
        let base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));

        return base64String;
    }
    fromEncodedData(enc) {
        let data = [];
        
        let binary_string = atob(enc);
        let bytes = new Uint8Array(binary_string.length);
        for (let i=0; i<binary_string.length; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }

        let width = bytes[0];
        let height = bytes[1];

        for (let i=2; i<bytes.length; i++) {
            let dev = (bytes[i] & 63) -1;
            let param = bytes[i] >> 6;

            if (dev == -1) {
                for (let i=0; i<param; i++) {
                    data.push(null);
                }
            } else {
                data.push({
                    type_num: dev,
                    direction: param * 90
                });
            }
        }

        console.dir({
            width: width,
            height: height,
            data: data
        });

        return {
            width: width,
            height: height,
            data: data
        }
    }    
}
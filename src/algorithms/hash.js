export class Hash {
    constructor(mode = 'Open Addressing', probing = 'Linear', M = 10, bucketSize = 3) {
        this.mode = mode; // 'Open Addressing', 'Linked-list resolution', 'Bucket hashing'
        this.probing = probing; // 'Linear', 'Quadratic', 'Double'
        this.M = M;
        this.bucketSize = bucketSize;
    }

    h1(k) { return k % this.M; }
    h2(k) { return 7 - (k % 7); } 

    insert(table, value) {
        const steps = [];
        steps.push({ op: 'start_insert', val: value });
        
        const h = this.h1(value);
        steps.push({ op: 'calc_hash', val: value, hash: h });

        if (this.mode === 'Open Addressing') {
            let i = 0;
            while (i < this.M) {
                let idx;
                if (this.probing === 'Linear') idx = (h + i) % this.M;
                else if (this.probing === 'Quadratic') idx = (h + Math.pow(i, 2)) % this.M;
                else if (this.probing === 'Double') idx = (h + i * this.h2(value)) % this.M;

                steps.push({ op: 'probe', idx: idx, i });
                
                if (table[idx] === null || table[idx] === 'DELETED') {
                    table[idx] = value;
                    steps.push({ op: 'insert', idx: idx, val: value });
                    return steps;
                } else if (table[idx] === value) {
                    steps.push({ op: 'found', idx: idx, val: value });
                    return steps; // Avoid duplicates
                }
                i++;
            }
            steps.push({ op: 'error', msg: 'Hash Table is full.' });
        } else if (this.mode === 'Linked-list resolution') {
            steps.push({ op: 'probe', idx: h });
            if (!table[h].includes(value)) {
                table[h].push(value);
                steps.push({ op: 'insert', idx: h, val: value });
            } else {
                steps.push({ op: 'found', idx: h, val: value });
            }
        } else if (this.mode === 'Bucket hashing') {
            steps.push({ op: 'probe', idx: h });
            if (!table[h].includes(value)) {
                if (table[h].length < this.bucketSize) {
                    table[h].push(value);
                    steps.push({ op: 'insert', idx: h, val: value });
                } else {
                    steps.push({ op: 'error', msg: `Bucket ${h} is full.` });
                }
            } else {
                steps.push({ op: 'found', idx: h, val: value });
            }
        }
        return steps;
    }

    delete(table, value) {
        const steps = [];
        const h = this.h1(value);
        steps.push({ op: 'calc_hash', val: value, hash: h });

        if (this.mode === 'Open Addressing') {
            let i = 0;
            while (i < this.M) {
                let idx;
                if (this.probing === 'Linear') idx = (h + i) % this.M;
                else if (this.probing === 'Quadratic') idx = (h + Math.pow(i, 2)) % this.M;
                else if (this.probing === 'Double') idx = (h + i * this.h2(value)) % this.M;

                steps.push({ op: 'probe', idx: idx, i });
                
                if (table[idx] === null) {
                    steps.push({ op: 'error', msg: `${value} not found in Hash Table.` });
                    return steps;
                } else if (table[idx] === value) {
                    table[idx] = 'DELETED'; 
                    steps.push({ op: 'delete', idx: idx, val: value });
                    return steps;
                }
                i++;
            }
            steps.push({ op: 'error', msg: `${value} not found in Hash Table.` });
        } else if (this.mode === 'Linked-list resolution' || this.mode === 'Bucket hashing') {
            steps.push({ op: 'probe', idx: h });
            const loc = table[h].indexOf(value);
            if (loc !== -1) {
                table[h].splice(loc, 1);
                steps.push({ op: 'delete', idx: h, val: value });
            } else {
                steps.push({ op: 'error', msg: `${value} not found in Hash Table.` });
            }
        }
        return steps;
    }
}
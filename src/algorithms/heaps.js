export class Heap {
    constructor(type = 'Min') {
        this.type = type;
    }

    compare(a, b) {
        return this.type === 'Min' ? a < b : a > b;
    }

    reHeapUp(arr, index, steps) {
        let parent = Math.floor((index - 1) / 2);
        while (index > 0) {
            steps.push({ op: 'compare', i: index, j: parent });
            if (this.compare(arr[index], arr[parent])) {
                steps.push({ op: 'swap', i: index, j: parent });
                [arr[index], arr[parent]] = [arr[parent], arr[index]];
                index = parent;
                parent = Math.floor((index - 1) / 2);
            } else {
                break;
            }
        }
    }

    reHeapDown(arr, index, length, steps) {
        let left = 2 * index + 1;
        while (left < length) {
            let right = left + 1;
            let target = left;

            if (right < length) {
                steps.push({ op: 'compare', i: left, j: right });
                if (this.compare(arr[right], arr[left])) {
                    target = right;
                }
            }

            steps.push({ op: 'compare', i: index, j: target });
            if (this.compare(arr[target], arr[index])) {
                steps.push({ op: 'swap', i: index, j: target });
                [arr[index], arr[target]] = [arr[target], arr[index]];
                index = target;
                left = 2 * index + 1;
            } else {
                break;
            }
        }
    }

    insert(arr, value) {
        const steps = [];
        arr.push(value);
        steps.push({ op: 'insert', i: arr.length - 1, val: value });
        this.reHeapUp(arr, arr.length - 1, steps);
        return steps;
    }

    pop(arr) {
        const steps = [];
        if (arr.length === 0) return steps;
        if (arr.length === 1) {
            steps.push({ op: 'pop', val: arr.pop(), i: 0 });
            return steps;
        }
        steps.push({ op: 'swap', i: 0, j: arr.length - 1 });
        const popped = arr[arr.length - 1];
        [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]];
        steps.push({ op: 'pop', val: arr.pop(), i: arr.length - 1 });
        
        this.reHeapDown(arr, 0, arr.length, steps);
        return steps;
    }

    buildHeap(arr) {
        const steps = [];
        const n = arr.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.reHeapDown(arr, i, n, steps);
        }
        return steps;
    }
}
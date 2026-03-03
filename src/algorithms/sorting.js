export class SortingAlgorithms {
    static insertionSort(arr) {
        const steps = [];
        let a = [...arr];
        for (let i = 1; i < a.length; i++) {
            let j = i;
            steps.push({ op: 'set_pointers', i: i, j: j });
            while (j > 0 && a[j - 1] > a[j]) {
                steps.push({ op: 'compare', i: j - 1, j: j });
                steps.push({ op: 'swap', i: j - 1, j: j });
                let temp = a[j];
                a[j] = a[j - 1];
                a[j - 1] = temp;
                j--;
                steps.push({ op: 'set_pointers', i: i, j: j });
            }
            steps.push({ op: 'mark_sorted', idx: i });
        }
        return steps;
    }

    static shellSort(arr) {
        const steps = [];
        let a = [...arr];
        let n = a.length;
        for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
            for (let i = gap; i < n; i++) {
                let j = i;
                steps.push({ op: 'set_pointers', i: i, j: j, k: gap });
                while (j >= gap && a[j - gap] > a[j]) {
                    steps.push({ op: 'compare', i: j - gap, j: j });
                    steps.push({ op: 'swap', i: j - gap, j: j });
                    let temp = a[j];
                    a[j] = a[j - gap];
                    a[j - gap] = temp;
                    j -= gap;
                    steps.push({ op: 'set_pointers', i: i, j: j, k: gap });
                }
            }
        }
        for(let i=0; i<n; i++) steps.push({ op: 'mark_sorted', idx: i });
        return steps;
    }

    static selectionSort(arr) {
        const steps = [];
        let a = [...arr];
        for (let i = 0; i < a.length; i++) {
            let minIdx = i;
            steps.push({ op: 'set_pointers', i: i, j: i, min: minIdx });
            for (let j = i + 1; j < a.length; j++) {
                steps.push({ op: 'set_pointers', i: i, j: j, min: minIdx });
                steps.push({ op: 'compare', i: j, j: minIdx });
                if (a[j] < a[minIdx]) {
                    minIdx = j;
                    steps.push({ op: 'set_pointers', i: i, j: j, min: minIdx });
                }
            }
            if (minIdx !== i) {
                steps.push({ op: 'swap', i: i, j: minIdx });
                let temp = a[i];
                a[i] = a[minIdx];
                a[minIdx] = temp;
            }
            steps.push({ op: 'mark_sorted', idx: i });
        }
        return steps;
    }

    static bubbleSort(arr) {
        const steps = [];
        let a = [...arr];
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < a.length - i - 1; j++) {
                steps.push({ op: 'set_pointers', i: j, j: j + 1 });
                steps.push({ op: 'compare', i: j, j: j + 1 });
                if (a[j] > a[j + 1]) {
                    steps.push({ op: 'swap', i: j, j: j + 1 });
                    let temp = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = temp;
                }
            }
            steps.push({ op: 'mark_sorted', idx: a.length - i - 1 });
        }
        return steps;
    }

    static quickSort(arr) {
        const steps = [];
        let a = [...arr];

        const partition = (low, high) => {
            let pivot = a[high];
            let i = low - 1;
            steps.push({ op: 'set_pointers', i: i >= 0 ? i : null, j: low, pivot: high });
            for (let j = low; j < high; j++) {
                steps.push({ op: 'set_pointers', i: i >= 0 ? i : null, j: j, pivot: high });
                steps.push({ op: 'compare', i: j, j: high });
                if (a[j] < pivot) {
                    i++;
                    steps.push({ op: 'swap', i: i, j: j });
                    let temp = a[i];
                    a[i] = a[j];
                    a[j] = temp;
                    steps.push({ op: 'set_pointers', i: i >= 0 ? i : null, j: j, pivot: high });
                }
            }
            steps.push({ op: 'swap', i: i + 1, j: high });
            let temp = a[i + 1];
            a[i + 1] = a[high];
            a[high] = temp;
            return i + 1;
        };

        const qs = (low, high) => {
            if (low < high) {
                let pi = partition(low, high);
                steps.push({ op: 'mark_sorted', idx: pi });
                qs(low, pi - 1);
                qs(pi + 1, high);
            } else if (low === high) {
                steps.push({ op: 'mark_sorted', idx: low });
            }
        };
        qs(0, a.length - 1);
        for(let i=0; i<a.length; i++) steps.push({ op: 'mark_sorted', idx: i });
        return steps;
    }

    static mergeSort(arr) {
        const steps = [];
        let a = [...arr];
        let n = a.length;

        // Tracks the split groups of indices
        let chunks = [Array.from({length: n}, (_, i) => i)];
        steps.push({ op: 'set_chunks', chunks: JSON.parse(JSON.stringify(chunks)) });

        const splitChunk = (l, m, r) => {
            const idx = chunks.findIndex(c => c.length > 0 && c[0] === l && c[c.length-1] === r);
            if (idx !== -1) {
                const leftChunk = [];
                for(let i=l; i<=m; i++) leftChunk.push(i);
                const rightChunk = [];
                for(let i=m+1; i<=r; i++) rightChunk.push(i);
                chunks.splice(idx, 1, leftChunk, rightChunk);
            }
        };

        const mergeChunks = (l, m, r) => {
            const idx1 = chunks.findIndex(c => c.length > 0 && c[0] === l && c[c.length-1] === m);
            const idx2 = chunks.findIndex(c => c.length > 0 && c[0] === m+1 && c[c.length-1] === r);
            if (idx1 !== -1 && idx2 !== -1) {
                const mergedChunk = [];
                for(let i=l; i<=r; i++) mergedChunk.push(i);
                const minIdx = Math.min(idx1, idx2);
                chunks.splice(minIdx, 2, mergedChunk);
            }
        };

        const merge = (l, m, r) => {
            let n1 = m - l + 1;
            let n2 = r - m;
            let L = new Array(n1);
            let R = new Array(n2);
            for (let i = 0; i < n1; i++) L[i] = a[l + i];
            for (let j = 0; j < n2; j++) R[j] = a[m + 1 + j];

            let i = 0, j = 0, k = l;
            while (i < n1 && j < n2) {
                steps.push({ op: 'set_pointers', i: l + i, j: m + 1 + j, k: k });
                steps.push({ op: 'compare', i: l + i, j: m + 1 + j });
                if (L[i] <= R[j]) {
                    steps.push({ op: 'overwrite', idx: k, val: L[i] });
                    a[k] = L[i];
                    i++;
                } else {
                    steps.push({ op: 'overwrite', idx: k, val: R[j] });
                    a[k] = R[j];
                    j++;
                }
                k++;
            }
            while (i < n1) {
                steps.push({ op: 'set_pointers', i: l + i, k: k });
                steps.push({ op: 'overwrite', idx: k, val: L[i] });
                a[k] = L[i];
                i++; k++;
            }
            while (j < n2) {
                steps.push({ op: 'set_pointers', j: m + 1 + j, k: k });
                steps.push({ op: 'overwrite', idx: k, val: R[j] });
                a[k] = R[j];
                j++; k++;
            }
            mergeChunks(l, m, r);
            steps.push({ op: 'set_chunks', chunks: JSON.parse(JSON.stringify(chunks)) });
        };

        const ms = (l, r) => {
            if (l >= r) return;
            let m = l + Math.floor((r - l) / 2);
            
            splitChunk(l, m, r);
            steps.push({ op: 'set_chunks', chunks: JSON.parse(JSON.stringify(chunks)) });

            ms(l, m);
            ms(m + 1, r);
            merge(l, m, r);
        };

        ms(0, a.length - 1);
        for(let i=0; i<a.length; i++) steps.push({ op: 'mark_sorted', idx: i });
        return steps;
    }
}
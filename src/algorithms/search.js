export class SearchAlgorithms {
    static binarySearch(arr, target) {
        const steps = [];
        let left = 0;
        let right = arr.length - 1;
        steps.push({ op: 'init', left, right });

        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            steps.push({ op: 'mid', left, right, mid });
            steps.push({ op: 'check', left, right, mid, val: arr[mid] });

            if (arr[mid] === target) {
                steps.push({ op: 'found', left, right, mid, index: mid });
                return steps;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
            
            if (left <= right) {
                steps.push({ op: 'update_bounds', left, right });
            }
        }
        steps.push({ op: 'not_found', left, right });
        return steps;
    }

    static lowerBound(arr, target) {
        const steps = [];
        let left = 0;
        let right = arr.length;
        steps.push({ op: 'init', left, right });

        while (left < right) {
            let mid = Math.floor((left + right) / 2);
            steps.push({ op: 'mid', left, right, mid });
            steps.push({ op: 'check', left, right, mid, val: arr[mid] });

            if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
            if (left < right) {
                steps.push({ op: 'update_bounds', left, right });
            }
        }
        steps.push({ op: 'found', left, right, index: left });
        return steps;
    }

    static upperBound(arr, target) {
        const steps = [];
        let left = 0;
        let right = arr.length;
        steps.push({ op: 'init', left, right });

        while (left < right) {
            let mid = Math.floor((left + right) / 2);
            steps.push({ op: 'mid', left, right, mid });
            steps.push({ op: 'check', left, right, mid, val: arr[mid] });

            if (arr[mid] <= target) {
                left = mid + 1;
            } else {
                right = mid;
            }
            if (left < right) {
                steps.push({ op: 'update_bounds', left, right });
            }
        }
        steps.push({ op: 'found', left, right, index: left });
        return steps;
    }
}
export const arrayList = [
    { id: 1, tags: ['Definition', 'Memory', 'Easy'], text: "What is the primary advantage of an ArrayList over a standard static Array?", options: ["Uses less memory", "Can dynamically resize itself", "Non-contiguous memory allocation", "O(1) insertion at index 0"], correct: 1, explanation: "ArrayLists automatically allocate a larger backing array and copy elements over when they reach their capacity limit." },
    { id: 2, tags: ['Access', 'Time Complexity', 'Easy'], text: "What is the time complexity of accessing an element by index in an ArrayList?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], correct: 0, explanation: "Because the underlying memory is contiguous, the exact memory address can be calculated instantly using pointer arithmetic." },
    { id: 3, tags: ['Sorting', 'Bubble Sort', 'Easy'], text: "In the best-case scenario (already sorted array), what is the time complexity of an optimized Bubble Sort?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], correct: 2, explanation: "An optimized Bubble Sort will make one full pass, swap nothing, and terminate early in O(n) time." },
    { id: 4, tags: ['Searching', 'Binary Search', 'Easy'], text: "What is a strict requirement before you can use Binary Search on an ArrayList?", options: ["It must contain only positive integers", "It must be sorted", "It must have an even length", "It must have no duplicates"], correct: 1, explanation: "Binary search relies on the array being sorted to eliminate half of the remaining elements at each step." },
    { id: 5, tags: ['Insertion', 'Time Complexity', 'Medium'], text: "What is the worst-case time complexity of inserting an element at the BEGINNING (index 0) of an ArrayList?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], correct: 2, explanation: "Inserting at the beginning requires shifting every subsequent element one position to the right, taking O(n) time." },
    {
id: 6,
tags: ['Sorting', 'Merge Sort', 'Medium'],
text: "What is the key idea behind how Merge Sort sorts an array?",
options: [
"It repeatedly swaps adjacent elements until the array is sorted",
"It divides the array into smaller halves, sorts them, and merges the sorted halves",
"It repeatedly selects the smallest element and moves it to the front",
"It partitions the array around a pivot element"
],
correct: 1,
explanation: "Merge Sort uses a divide-and-conquer approach: split the array recursively into halves, then merge the sorted halves."
},
    { id: 7, tags: ['Searching', 'Lower Bound', 'Medium'], text: "If an array is [2, 4, 4, 4, 6], what INDEX does the Lower Bound algorithm return for the target value 4?", options: ["0", "1", "2", "3"], correct: 1, explanation: "Lower Bound returns the index of the FIRST element that is greater than or equal to the target. The first '4' is at index 1." },
    { id: 8, tags: ['Sorting', 'Quick Sort', 'Hard'], text: "Under what condition does Quick Sort degrade to its worst-case time complexity of O(n^2)?", options: ["When the array is already sorted and the pivot is the first/last element", "When the array contains entirely random numbers", "When the pivot is chosen as the median element", "Quick sort is always O(n log n)"], correct: 0, explanation: "If the array is sorted and the pivot is an extreme, the partition splits into sizes of 0 and n-1, leading to O(n^2) recursion depth." },
    {
id: 9,
tags: ['Binary Search', 'Iterations', 'Hard'],
text: "Given the sorted array [3, 7, 12, 18, 25, 31, 42], how many iterations of Binary Search are required to find the element 31?",
options: ["1", "2", "3", "4"],
correct: 1,
explanation: "Iteration 1: middle = 18 → 31 > 18, search right half. Iteration 2: middle = 31 → element found. Therefore, it takes 2 iterations."
}
];
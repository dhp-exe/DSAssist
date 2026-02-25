// ==========================================
// Binary Search Tree (BST)
// ==========================================
export class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

export class BST {
    constructor() {
        this.root = null;
    }

    searchPath(value) {
        let path = [];
        let current = this.root;
        while (current && current.value !== null) {
            path.push(current.value);
            if (value === current.value) break;
            if (value < current.value) current = current.left;
            else current = current.right;
        }
        return path;
    }

    insert(value) {
        const newNode = new BSTNode(value);
        if (!this.root) {
            this.root = newNode;
            return;
        }
        let current = this.root;
        while (true) {
            if (value < current.value) {
                if (!current.left) { current.left = newNode; break; }
                current = current.left;
            } 
            else if (value > current.value) {
                if (!current.right) { current.right = newNode; break; }
                current = current.right;
            } else return; // No duplicates
        }
    }

    delete(value) {
        this.root = this._deleteNode(this.root, value);
    }

    _deleteNode(node, value) {
        if (!node) return null;
        if (value < node.value) {
            node.left = this._deleteNode(node.left, value);
        } else if (value > node.value) {
            node.right = this._deleteNode(node.right, value);
        } else {
            if (!node.left) return node.right;
            if (!node.right) return node.left;
            let minNode = this._getMin(node.right);
            node.value = minNode.value;
            node.right = this._deleteNode(node.right, minNode.value);
        }
        return node;
    }

    _getMin(node) {
        while (node.left) node = node.left;
        return node;
    }
}

// ==========================================
// 2. AVL Tree
// ==========================================
export class AVLNode extends BSTNode {
    constructor(value) {
        super(value);
        this.height = 1;
    }
}

export class AVLTree extends BST {
    _height(node) { return node ? node.height : 0; }
    _getBalance(node) { return node ? this._height(node.left) - this._height(node.right) : 0; }

    _rightRotate(y) {
        let x = y.left;
        let T2 = x.right;
        x.right = y;
        y.left = T2;
        y.height = Math.max(this._height(y.left), this._height(y.right)) + 1;
        x.height = Math.max(this._height(x.left), this._height(x.right)) + 1;
        return x;
    }

    _leftRotate(x) {
        let y = x.right;
        let T2 = y.left;
        y.left = x;
        x.right = T2;
        x.height = Math.max(this._height(x.left), this._height(x.right)) + 1;
        y.height = Math.max(this._height(y.left), this._height(y.right)) + 1;
        return y;
    }

    insert(value) {
        this.root = this._insertNode(this.root, value);
    }

    _insertNode(node, value) {
        if (!node) return new AVLNode(value);
        if (value < node.value) node.left = this._insertNode(node.left, value);
        else if (value > node.value) node.right = this._insertNode(node.right, value);
        else return node; 

        node.height = 1 + Math.max(this._height(node.left), this._height(node.right));
        let balance = this._getBalance(node);

        if (balance > 1 && value < node.left.value) return this._rightRotate(node);
        if (balance < -1 && value > node.right.value) return this._leftRotate(node);
        if (balance > 1 && value > node.left.value) {
            node.left = this._leftRotate(node.left);
            return this._rightRotate(node);
        }
        if (balance < -1 && value < node.right.value) {
            node.right = this._rightRotate(node.right);
            return this._leftRotate(node);
        }
        return node;
    }

    delete(value) {
        this.root = this._deleteNode(this.root, value);
    }

    _deleteNode(node, value) {
        if (!node) return node;
        if (value < node.value) node.left = this._deleteNode(node.left, value);
        else if (value > node.value) node.right = this._deleteNode(node.right, value);
        else {
            if (!node.left || !node.right) {
                node = node.left ? node.left : node.right;
            } else {
                let temp = this._getMin(node.right);
                node.value = temp.value;
                node.right = this._deleteNode(node.right, temp.value);
            }
        }
        if (!node) return node;

        node.height = 1 + Math.max(this._height(node.left), this._height(node.right));
        let balance = this._getBalance(node);

        if (balance > 1 && this._getBalance(node.left) >= 0) return this._rightRotate(node);
        if (balance > 1 && this._getBalance(node.left) < 0) {
            node.left = this._leftRotate(node.left);
            return this._rightRotate(node);
        }
        if (balance < -1 && this._getBalance(node.right) <= 0) return this._leftRotate(node);
        if (balance < -1 && this._getBalance(node.right) > 0) {
            node.right = this._rightRotate(node.right);
            return this._leftRotate(node);
        }
        return node;
    }
}

// ==========================================
// 3. Splay Tree
// ==========================================
export class SplayNode extends BSTNode {
    constructor(value) {
        super(value);
        this.parent = null;
    }
}

export class SplayTree extends BST {
    _leftRotate(x) {
        let y = x.right;
        if (y) {
            x.right = y.left;
            if (y.left) y.left.parent = x;
            y.parent = x.parent;
        }
        if (!x.parent) this.root = y;
        else if (x === x.parent.left) x.parent.left = y;
        else x.parent.right = y;
        if (y) y.left = x;
        x.parent = y;
    }

    _rightRotate(x) {
        let y = x.left;
        if (y) {
            x.left = y.right;
            if (y.right) y.right.parent = x;
            y.parent = x.parent;
        }
        if (!x.parent) this.root = y;
        else if (x === x.parent.right) x.parent.right = y;
        else x.parent.left = y;
        if (y) y.right = x;
        x.parent = y;
    }

    _splay(node) {
        while (node && node.parent) {
            if (!node.parent.parent) {
                if (node === node.parent.left) this._rightRotate(node.parent);
                else this._leftRotate(node.parent);
            } 
            else if (node === node.parent.left && node.parent === node.parent.parent.left) {
                this._rightRotate(node.parent.parent);
                this._rightRotate(node.parent);
            } 
            else if (node === node.parent.right && node.parent === node.parent.parent.right) {
                this._leftRotate(node.parent.parent);
                this._leftRotate(node.parent);
            } 
            else if (node === node.parent.right && node.parent === node.parent.parent.left) {
                this._leftRotate(node.parent);
                this._rightRotate(node.parent);
            } 
            else {
                this._rightRotate(node.parent);
                this._leftRotate(node.parent);
            }
        }
    }

    searchPath(value) {
        let path = [];
        let current = this.root;
        let last = null;
        while (current) {
            path.push(current.value);
            last = current;
            if (value === current.value) break;
            if (value < current.value) current = current.left;
            else current = current.right;
        }
        if (last) this._splay(last);
        return path;
    }

    insert(value) {
        let node = new SplayNode(value);
        let y = null;
        let x = this.root;

        while (x) {
            y = x;
            if (node.value === x.value) {
                this._splay(x); // Splay existing on duplicate
                return;
            }
            if (node.value < x.value) x = x.left;
            else x = x.right;
        }

        node.parent = y;
        if (!y) this.root = node;
        else if (node.value < y.value) y.left = node;
        else y.right = node;

        // SPLAY LOGIC: Splay new node to root
        this._splay(node);
    }

    delete(value) {
        if (!this.root) return;
        
        // Phase 1: Splay node to root (handled in searchPath)
        this.searchPath(value);
        if (this.root.value !== value) return; // not found

        // Phase 2: Delete root & Merge
        if (!this.root.left) {
            this.root = this.root.right;
            if (this.root) this.root.parent = null;
        } else {
            let rightSub = this.root.right;
            this.root = this.root.left;
            this.root.parent = null;
            
            // Find max in left subtree and splay it to root
            let maxLeft = this.root;
            while (maxLeft.right) maxLeft = maxLeft.right;
            this._splay(maxLeft);
            
            // Attach right subtree to new root
            this.root.right = rightSub;
            if (rightSub) rightSub.parent = this.root;
        }
    }
}

// ==========================================
// 4. Red-Black Tree (RBT)
// ==========================================
const RED = 0;
const BLACK = 1;

export class RBTNode {
    constructor(value) {
        this.value = value;
        this.color = RED;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

export class RedBlackTree extends BST {
    constructor() {
        super();
        this.TNULL = new RBTNode(null);
        this.TNULL.color = BLACK;
        this.root = this.TNULL;
    }

    searchPath(value) {
        let path = [];
        let current = this.root;
        while (current !== this.TNULL) {
            path.push(current.value);
            if (value === current.value) break;
            if (value < current.value) current = current.left;
            else current = current.right;
        }
        return path;
    }

    _leftRotate(x) {
        let y = x.right;
        x.right = y.left;
        if (y.left !== this.TNULL) y.left.parent = x;
        y.parent = x.parent;
        if (x.parent === null) this.root = y;
        else if (x === x.parent.left) x.parent.left = y;
        else x.parent.right = y;
        y.left = x;
        x.parent = y;
    }

    _rightRotate(x) {
        let y = x.left;
        x.left = y.right;
        if (y.right !== this.TNULL) y.right.parent = x;
        y.parent = x.parent;
        if (x.parent === null) this.root = y;
        else if (x === x.parent.right) x.parent.right = y;
        else x.parent.left = y;
        y.right = x;
        x.parent = y;
    }

    insert(value) {
        let node = new RBTNode(value);
        node.parent = null;
        node.left = this.TNULL;
        node.right = this.TNULL;

        let y = null;
        let x = this.root;

        while (x !== this.TNULL) {
            y = x;
            if (node.value === x.value) return; // No duplicate
            if (node.value < x.value) x = x.left;
            else x = x.right;
        }

        node.parent = y;
        if (y === null) this.root = node;
        else if (node.value < y.value) y.left = node;
        else y.right = node;

        if (node.parent === null) {
            node.color = BLACK;
            return;
        }
        if (node.parent.parent === null) return;
        this._fixInsert(node);
    }

    _fixInsert(k) {
        let u;
        while (k.parent.color === RED) {
            if (k.parent === k.parent.parent.right) {
                u = k.parent.parent.left;
                if (u.color === RED) {
                    u.color = BLACK; k.parent.color = BLACK; k.parent.parent.color = RED; k = k.parent.parent;
                } else {
                    if (k === k.parent.left) { k = k.parent; this._rightRotate(k); }
                    k.parent.color = BLACK; k.parent.parent.color = RED; this._leftRotate(k.parent.parent);
                }
            } else {
                u = k.parent.parent.right;
                if (u.color === RED) {
                    u.color = BLACK; k.parent.color = BLACK; k.parent.parent.color = RED; k = k.parent.parent;
                } else {
                    if (k === k.parent.right) { k = k.parent; this._leftRotate(k); }
                    k.parent.color = BLACK; k.parent.parent.color = RED; this._rightRotate(k.parent.parent);
                }
            }
            if (k === this.root) break;
        }
        this.root.color = BLACK;
    }

    _minimum(node) {
        while (node.left !== this.TNULL) {
            node = node.left;
        }
        return node;
    }

    _rbTransplant(u, v) {
        if (u.parent === null) {
            this.root = v;
        } else if (u === u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }
        v.parent = u.parent;
    }

    delete(value) {
        let z = this.TNULL;
        let node = this.root;
        
        // Find the node
        while (node !== this.TNULL) {
            if (node.value === value) {
                z = node;
                break;
            }
            if (node.value < value) {
                node = node.right;
            } else {
                node = node.left;
            }
        }

        if (z === this.TNULL) return; // Value not found

        let y = z;
        let yOriginalColor = y.color;
        let x;

        if (z.left === this.TNULL) {
            x = z.right;
            this._rbTransplant(z, z.right);
        } else if (z.right === this.TNULL) {
            x = z.left;
            this._rbTransplant(z, z.left);
        } else {
            y = this._minimum(z.right);
            yOriginalColor = y.color;
            x = y.right;
            if (y.parent === z) {
                x.parent = y;
            } else {
                this._rbTransplant(y, y.right);
                y.right = z.right;
                y.right.parent = y;
            }
            this._rbTransplant(z, y);
            y.left = z.left;
            y.left.parent = y;
            y.color = z.color;
        }

        // Only need to fix properties if the originally removed/moved node was black
        if (yOriginalColor === BLACK) {
            this._fixDelete(x);
        }
    }

    _fixDelete(x) {
        let s;
        while (x !== this.root && x.color === BLACK) {
            if (x === x.parent.left) {
                s = x.parent.right;
                if (s.color === RED) {
                    s.color = BLACK;
                    x.parent.color = RED;
                    this._leftRotate(x.parent);
                    s = x.parent.right;
                }

                if (s.left.color === BLACK && s.right.color === BLACK) {
                    s.color = RED;
                    x = x.parent;
                } else {
                    if (s.right.color === BLACK) {
                        s.left.color = BLACK;
                        s.color = RED;
                        this._rightRotate(s);
                        s = x.parent.right;
                    }

                    s.color = x.parent.color;
                    x.parent.color = BLACK;
                    s.right.color = BLACK;
                    this._leftRotate(x.parent);
                    x = this.root;
                }
            } else {
                s = x.parent.left;
                if (s.color === RED) {
                    s.color = BLACK;
                    x.parent.color = RED;
                    this._rightRotate(x.parent);
                    s = x.parent.left;
                }

                if (s.right.color === BLACK && s.left.color === BLACK) {
                    s.color = RED;
                    x = x.parent;
                } else {
                    if (s.left.color === BLACK) {
                        s.right.color = BLACK;
                        s.color = RED;
                        this._leftRotate(s);
                        s = x.parent.left;
                    }

                    s.color = x.parent.color;
                    x.parent.color = BLACK;
                    s.left.color = BLACK;
                    this._rightRotate(x.parent);
                    x = this.root;
                }
            }
        }
        x.color = BLACK;
    }
}

// ==========================================
// 5. B-Tree
// ==========================================
export class BTreeNode {
    constructor(t, isLeaf) {
        this.t = t; 
        this.keys = [];
        this.children = [];
        this.isLeaf = isLeaf;
    }
}

export class BTree {
    constructor(t) {
        this.t = t; 
        this.root = null;
    }

    searchPath(k) {
        let path = [];
        const searchNode = (node) => {
            if (!node) return;
            path.push(node.keys.join(',')); // Represents node ID string in UI
            let i = 0;
            while (i < node.keys.length && k > node.keys[i]) i++;
            if (i < node.keys.length && k === node.keys[i]) return;
            if (node.isLeaf) return;
            searchNode(node.children[i]);
        }
        searchNode(this.root);
        return path;
    }

    insert(k) {
        if (!this.root) {
            this.root = new BTreeNode(this.t, true);
            this.root.keys[0] = k;
            return;
        }
        if (this.root.keys.includes(k)) return; // No duplicates

        if (this.root.keys.length === 2 * this.t - 1) {
            let s = new BTreeNode(this.t, false);
            s.children[0] = this.root;
            this._splitChild(s, 0, this.root);
            let i = 0;
            if (s.keys[0] < k) i++;
            this._insertNonFull(s.children[i], k);
            this.root = s;
        } else {
            this._insertNonFull(this.root, k);
        }
    }

    _insertNonFull(node, k) {
        let i = node.keys.length - 1;
        if (node.isLeaf) {
            while (i >= 0 && node.keys[i] > k) {
                node.keys[i + 1] = node.keys[i];
                i--;
            }
            node.keys[i + 1] = k;
        } else {
            while (i >= 0 && node.keys[i] > k) i--;
            if (node.children[i + 1].keys.length === 2 * this.t - 1) {
                this._splitChild(node, i + 1, node.children[i + 1]);
                if (node.keys[i + 1] < k) i++;
            }
            this._insertNonFull(node.children[i + 1], k);
        }
    }

    _splitChild(node, i, y) {
        const t = this.t;
        const midKey = y.keys[t - 1];
        let z = new BTreeNode(t, y.isLeaf);

        for (let j = 0; j < t - 1; j++) {
            z.keys[j] = y.keys[j + t];
        }
        if (!y.isLeaf) {
            for (let j = 0; j < t; j++) {
                z.children[j] = y.children[j + t];
            }
        }
        y.keys.length = t - 1;
        if (!y.isLeaf) {
            y.children.length = t;
        }
        
        for (let j = node.children.length; j > i + 1; j--) {
            node.children[j] = node.children[j - 1];
        }

        node.children[i + 1] = z;

        for (let j = node.keys.length; j > i; j--) {
            node.keys[j] = node.keys[j - 1];
        }

        node.keys[i] = midKey;
    }
}
class ListNode {
    constructor(value) {
        this.value = value;
    }
}

export default class LinkedList {
    constructor() {
        let n = new ListNode(0);
        n.prev = n;
        n.next = n;
        this.head = n;
    }

    insert(value, n1) {
        let n = new ListNode(value);
        let n2 = n1.next;
        n.prev = n1;
        n.next = n2;
        n1.next = n;
        n2.prev = n;
        this.head = n;
    }

    remove(n) {
        let n1 = n.prev;
        let n2 = n.next;
        n1.next = n2;
        n2.prev = n1;
        this.head = n2;
    }

    find(value) {
        if (value === this.head.value) return this.head;
        var curr = this.head.next;
        while (curr !== this.head) {
            if (value === curr.value) return curr;
            curr = curr.next;
        }
    }
}
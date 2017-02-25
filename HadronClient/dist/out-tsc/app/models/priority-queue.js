var PriorityQueue = (function () {
    function PriorityQueue() {
        this.queue = [];
    }
    PriorityQueue.prototype.push = function (object) {
        this.queue.push(object);
        this.sortArray(this.queue);
    };
    PriorityQueue.prototype.pop = function () {
        return this.queue.pop();
    };
    PriorityQueue.prototype.peek = function () {
        return this.queue[this.queue.length - 1];
    };
    PriorityQueue.prototype.isEmpty = function () {
        return this.queue.length === 0;
    };
    PriorityQueue.prototype.mergeWithQueueAsArray = function (priorityQueue) {
        return this.mergeWithArrayAsArray(priorityQueue.asArray());
    };
    PriorityQueue.prototype.mergeWithArrayAsArray = function (array) {
        var mergedArray = this.queue.concat(array);
        this.sortArray(mergedArray);
        return mergedArray;
    };
    PriorityQueue.prototype.asArray = function () {
        return this.queue;
    };
    PriorityQueue.prototype.sortArray = function (array) {
        array.sort(function (firstObject, secondObject) {
            return firstObject.compareTo(secondObject);
        });
    };
    return PriorityQueue;
}());
export { PriorityQueue };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/models/priority-queue.js.map
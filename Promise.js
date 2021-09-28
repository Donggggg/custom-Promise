const status = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
  SETTLED: "settled",
};

export default class Promise {
  state = status.PENDING;
  result = undefined;
  fulfilledCallStacks = [];
  rejectedCallStacks = [];

  constructor(executor) {
    console.log("Promise 객체 생성");
    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(value) {
    if (this.state !== status.PENDING) return;

    this.result = value;
    this.state = status.FULFILLED;
    console.log("resolve");

    this.fulfilledCallStacks.forEach((callback) => callback(this.result));
  }

  reject(error) {
    if (this.state !== status.PENDING) return;

    this.result = error;
    this.state = status.REJECTED;
    console.log("reject");

    this.rejectedCallStacks.forEach((error) => error(this.result));
  }

  then(callback, error) {
    switch (this.state) {
      case status.PENDING:
        this.fulfilledCallStacks.push(callback);
        this.rejectedCallStacks.push(error);
        break;
      case status.FULFILLED:
        callback(this.result);
        break;
      case status.REJECTED:
        error(this.result);
        break;
      default:
        break;
    }
  }
}

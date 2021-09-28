const status = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
  SETTLED: "settled",
};

export default class Promise {
  state = status.PENDING;
  result = undefined;

  constructor(executor) {
    console.log("Promise 객체 생성");
    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(value) {
    if (this.state !== status.PENDING) return;

    this.result = value;
    this.state = status.FULFILLED;
    console.log("resolve");
  }

  reject(error) {
    if (this.state !== status.PENDING) return;

    this.result = error;
    this.state = status.REJECTED;
    console.log("reject");
  }
}

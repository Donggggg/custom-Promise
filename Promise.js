const status = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
};

export default class Promise {
  state = status.PENDING;
  result = undefined;
  fulfilledCallStacks = [];
  rejectedCallStacks = [];

  constructor(executor) {
    this.executor = executor;
    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(value) {
    if (this.state !== status.PENDING) return;
    this.result = value;
    this.state = status.FULFILLED;
    this.fulfilledCallStacks.forEach((callback) => callback(this.result));
    return this;
  }

  reject(error) {
    if (this.state !== status.PENDING) return;
    this.result = error;
    this.state = status.REJECTED;
    this.rejectedCallStacks.forEach((error) => error(this.result));
    return this;
  }

  then(callback, error) {
    try {
      if (callback === undefined) throw "error";

      return new Promise((resolve, reject) => {
        switch (this.state) {
          case status.PENDING:
            this.fulfilledCallStacks.push(() => {
              this.handleCallback(callback, resolve, reject);
            });
            if (error !== undefined)
              this.rejectedCallStacks.push(() => {
                this.handleCallback(error, resolve, reject);
              });
            break;
          case status.FULFILLED:
            this.handleCallback(callback, resolve, reject);
            break;
          case status.REJECTED:
            if (error === undefined) throw "error";
            this.handleCallback(error, resolve, reject);
            break;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  catch(error) {
    try {
      if (error === undefined) throw "error";

      return new Promise((resolve, reject) => {
        switch (this.state) {
          case status.PENDING:
            this.rejectedCallStacks.push(() => {
              this.handleCallback(error, resolve, reject);
            });
            break;
          case status.REJECTED:
            this.handleCallback(error, resolve, reject);
            break;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  finally(callback) {
    switch (this.state) {
      case status.PENDING:
        this.fulfilledCallStacks.push(callback);
        break;
      case status.FULFILLED:
        callback(this.result);
        break;
      case status.REJECTED:
        callback(this.result);
        break;
    }
  }

  handleCallback(callback, resolve, reject) {
    const result = callback(this.result);
    if (result instanceof Promise) {
      if (result.state === status.FULFILLED) {
        resolve(result);
      } else if (result.state === status.REJECTED) {
        reject(result);
      } else if (result.state === status.PENDING) {
        result.fulfilledCallStacks.push(() => result.then(resolve));
        result.rejectedCallStacks.push(() => result.catch(reject));
      }
    } else resolve(result);
  }
}

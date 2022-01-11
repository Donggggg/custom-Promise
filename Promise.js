const status = {
  PENDING: 0,
  FULFILLED: 1,
  REJECTED: 2,
};

export default class Promise {
  state = status.PENDING;
  value = null;
  fulfilledCallStacks = [];
  rejectedCallStacks = [];

  constructor(executor) {
    this.executor = executor;
    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(value) {
    if (this.state !== status.PENDING) return;

    this.value = value;
    this.state = status.FULFILLED;
    this.fulfilledCallStacks.forEach((callback) => callback(this.value));

    return this;
  }

  reject(error) {
    if (this.state !== status.PENDING) return;

    this.value = error;
    this.state = status.REJECTED;
    this.rejectedCallStacks.forEach((error) => error(this.value));

    return this;
  }

  then(callback, error) {
    try {
      if (!callback) throw "error";

      return new Promise((resolve, reject) => {
        switch (this.state) {
          case status.PENDING:
            this.fulfilledCallStacks.push(() => {
              this.handleCallback(callback, resolve, reject);
            });

            if (error)
              this.rejectedCallStacks.push(() => {
                this.handleCallback(error, resolve, reject);
              });

            break;
          case status.FULFILLED:
            this.handleCallback(callback, resolve, reject);
            break;
          case status.REJECTED:
            if (!(error instanceof Function)) throw "error";
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
      if (!error) throw "error";

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
        callback(this.value);
        break;
      case status.REJECTED:
        callback(this.value);
        break;
    }
  }

  handleCallback(callback, resolve, reject) {
    const value = callback(this.value);

    if (value instanceof Promise) {
      if (value.state === status.FULFILLED) {
        resolve(value);
      } else if (value.state === status.REJECTED) {
        reject(value);
      } else if (value.state === status.PENDING) {
        value.fulfilledCallStacks.push(() => value.then(resolve));
        value.rejectedCallStacks.push(() => value.catch(reject));
      }
    } else resolve(value);
  }
}

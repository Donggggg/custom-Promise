import Promise from "./Promise.js";

// console.log(Promise.resolve(123));
const promise = new Promise(function (resolve, reject) {
  setTimeout(() => resolve("first"), 1000);
  //   setTimeout(() => reject(404), 1000);
});

promise
  .then((res) => {
    console.log(res);
    return new Promise(function (resolve, reject) {
      setTimeout(() => resolve("new thing"), 1000);
    });
  })
  .then((res) => {
    console.log(res);
    return new Promise(function (resolve, reject) {
      setTimeout(() => resolve("look"), 1000);
    });
  })
  .then((res) => {
    console.log(res);
  });

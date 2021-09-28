import Promise from "./Promise.js";

const promise = new Promise(function (resolve, reject) {
  //   resolve(123);
  setTimeout(() => resolve("done"), 1000);
  setTimeout(() => reject(new Error("에러 발생!")), 1000);
});

import Promise from "./Promise.js";

const promise = new Promise(function (resolve, reject) {
  resolve(123);
  //   setTimeout(() => resolve("done"), 1000);
  //   setTimeout(() => reject(new Error("에러 발생!")), 1000);
});

// promise.then(
//   (result) => console.log(result), // 1초 후 "done!"을 출력
//   (error) => console.log(error) // 실행되지 않음
// );

promise.catch((error) => console.log(error)); // 1초 뒤 "Error: 에러 발생!" 출력

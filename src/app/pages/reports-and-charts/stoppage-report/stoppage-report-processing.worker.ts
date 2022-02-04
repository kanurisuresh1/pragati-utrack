/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  console.log("Worker Thread")
  console.log(data)

  data.forEach(function (val) {
    val.date = new Date(val.nt * 1000)
    val.s = val.s * 2
  })

  postMessage(data);
});

// code away!
let server = require("./api/server");

let PORT = 1123;

server.listen(PORT, () => {
    console.log(`\n === server running on port ${PORT} === \n`)
})
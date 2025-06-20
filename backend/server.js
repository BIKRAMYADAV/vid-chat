const express = require('express')

const app = express()

app.listen(PORT, () => {
    console.log('The app is listening on port ', PORT);
})
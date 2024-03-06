const express = require('express');

const app = express();

app.get('/hi', (req, res) => {
    const data = {
        message: 'Success!!'
    }
    res.json(data);
})

app.listen(8080, () => {
    console.log(`Spring Server is running on port` );
  });
const express = require('express');
const app = express();

app.listen(5000, err => {
  if (!err) {
    console.log(err);
  }

  console.info(`Express server is listenting PORT (${5000})`);
});

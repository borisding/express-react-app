const express = require('express');
const app = express();

app.listen(3000, err => {
  if (!err) {
    console.log(err);
  }

  console.info('Server is listenting PORT:', 3000);
});

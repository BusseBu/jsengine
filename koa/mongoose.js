const mongoose = require('jsengine/mongoose');

exports.boot = async function() {

  if (process.env.NODE_ENV == 'production') {
    await mongoose.waitConnect();
  }

};


exports.close = async function() {
  await mongoose.disconnect();
};

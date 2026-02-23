// src/server.js
require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./lib/db");

// const port = process.env.PORT || 4000;

// connectDB(process.env.MONGO_URI).then(() => {
//   app.listen(port, () => console.log(`Server running on :${port}`));
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
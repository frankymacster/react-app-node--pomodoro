const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const yaml = require("js-yaml");

module.exports = {
  get: async (req, res) => {
    try {
      const dataPath = path.join(__dirname, "../data/layout.yml");
      const dataStr = await promisify(fs.readFile)(dataPath, "utf8");
      const data = yaml.load(dataStr);
      res.json(data);
    }
    catch (error) {
      res.status(404);  // Not Found
      res.json({ error: "Not Found: invalid data" });
    }
  }
};

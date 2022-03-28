const { check } = require("express-validator");

const ProjectValidation = [
  check("title", "your project must have a name").exists({ checkFalsy: true }),
  check(
    "tech",
    "tech must be an array and atleast one tech-stack specification is required"
  ).isArray({ min: 1 }),
  check("open_to", "open_to must be array ").isArray(),
];

exports.ProjectValidation = ProjectValidation;

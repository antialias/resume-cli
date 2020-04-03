import schema from "resume-schema/schema.json";
import { promisify } from "util";
import ZSchema from "z-schema";
import ZSchemaErrors from "z-schema-errors";

const reporter = ZSchemaErrors.init();
const validator = new ZSchema();
const validate = promisify((obj, ...args) =>
  validator.validate(obj, schema, ...args)
);
export default async (resume) => {
  try {
    return await validate(resume);
  } catch (errors) {
    throw new Error(reporter.extractMessage({ report: { errors } }));
  }
};

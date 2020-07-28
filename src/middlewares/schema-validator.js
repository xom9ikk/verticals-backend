const ajv = require('ajv');
const { BackendError } = require('../components');

const { AuthSchema } = require('../modules/auth/schemas');
const { BoardSchema } = require('../modules/board/schemas');
const { ColumnSchema } = require('../modules/column/schemas');
const { TodoSchema } = require('../modules/todo/schemas');
const { CommentSchema } = require('../modules/comment/schemas');
const { CommentAttachmentSchema } = require('../modules/comment-attachment/schemas');

class SchemaValidator {
  constructor() {
    this.ajv = ajv({
      allErrors: true,
      removeAdditional: 'all',
    });
    Object.keys(AuthSchema).map((key) => this.ajv.addSchema(AuthSchema[key], key));
    Object.keys(BoardSchema).map((key) => this.ajv.addSchema(BoardSchema[key], key));
    Object.keys(ColumnSchema).map((key) => this.ajv.addSchema(ColumnSchema[key], key));
    Object.keys(TodoSchema).map((key) => this.ajv.addSchema(TodoSchema[key], key));
    Object.keys(CommentSchema).map((key) => this.ajv.addSchema(CommentSchema[key], key));
    Object.keys(CommentAttachmentSchema).map((key) => this.ajv.addSchema(CommentAttachmentSchema[key], key));
  }

  errorResponse(schemaErrors) {
    if (!schemaErrors) {
      throw new BackendError.BadRequest('Request field(s) do not match expected');
    }
    const [firstError] = schemaErrors;
    const fieldWithError = firstError.dataPath.slice(1);
    const {
      keyword,
      params: {
        missingProperty, limit, allowedValues,
      },
      message,
    } = firstError;
    if (keyword === 'required') {
      throw new BackendError.BadRequest(`The required parameter '${missingProperty}' is missing`);
    }
    if (keyword === 'maxLength') {
      throw new BackendError.BadRequest(`Field '${fieldWithError}' should not be longer than ${limit} characters`);
    }
    if (keyword === 'minLength') {
      throw new BackendError.BadRequest(`Field '${fieldWithError}' should be longer than ${limit} characters`);
    }
    if (keyword === 'type') {
      throw new BackendError.BadRequest(`Field '${fieldWithError}' ${message}`);
    }
    if (keyword === 'enum') {
      throw new BackendError.BadRequest(`Field '${fieldWithError}' ${message}: [${allowedValues}]`);
    }
    if (fieldWithError) {
      throw new BackendError.BadRequest(`Field '${fieldWithError}' do not match expected`);
    }
    throw new BackendError.BadRequest('Request field(s) do not match expected');
  }

  validate(type, schemaName) {
    return async (req) => {
      const valid = this.ajv.validate(schemaName, req[type] || {});
      if (!valid) {
        return this.errorResponse(this.ajv.errors);
      }
    };
  }
}

module.exports = {
  SchemaValidator: new SchemaValidator(),
};

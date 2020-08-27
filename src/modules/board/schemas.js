const { CardType, Color } = require("../../enums");

class BoardSchema {
  createBoard = {
    type: 'object',
    properties: {
      icon: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      cardType: {
        type: 'integer',
        enum: Object.values(CardType),
      },
      description: {
        type: 'string',
        minLength: 1,
        maxLength: 4096,
      },
      color: {
        type: 'number',
        enum: Object.values(Color),
      },
    },
    required: ['icon', 'title', 'cardType'],
  }
  getBoard = {
    type: 'object',
    properties: {
      boardId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['boardId'],
  }
  patchBoardBody = {
    type: 'object',
    properties: {
      icon: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      position: {
        type: 'integer',
        minimum: 0,
      },
      cardType: {
        type: 'integer',
        enum: Object.values(CardType),
      },
      description: {
        type: 'string',
        minLength: 1,
        maxLength: 4096,
      },
      color: {
        type: 'number',
        enum: Object.values(Color),
      },
    },
    anyOf: [
      { required: ["icon"] },
      { required: ["title"] },
      { required: ["position"] },
      { required: ["cardType"] },
      { required: ["description"] },
      { required: ["color"] },
    ]
  }
  patchBoardParams = {
    type: 'object',
    properties: {
      boardId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['boardId'],
  }
  deleteBoardParams = {
    type: 'object',
    properties: {
      boardId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['boardId'],
  }
}

module.exports = {
  BoardSchema: new BoardSchema(),
};

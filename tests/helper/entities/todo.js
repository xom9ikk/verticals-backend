const faker = require('faker');

class Todo {
  constructor(id, columnId, comments) {
    this.id = id;
    this.columnId = columnId;
    this.comments = comments;
  }

  getRandomComment() {
    const randomIndex = faker.random.number({ max: this.comments.length - 1 });
    return this.comments[randomIndex];
  }
}

module.exports = {
  Todo,
};

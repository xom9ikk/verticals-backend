/* eslint-disable no-underscore-dangle */
const { Transport } = require('../enums');
const { BackendError, SocketError, TokenComponent } = require('../components');
const { ValidatorComponent } = require('../components');

class CheckMiddleware {
  static isBearer(token) {
    if (!token) return false;
    return token.includes('Bearer');
  }

  static normalizeBearerToken(token) {
    return token.split('Bearer ')[1];
  }

  static extractToken(req, type) {
    const { authorization } = type === Transport.rest
      ? req.headers
      : req.query;
    if (this.isBearer(authorization)) {
      return this.normalizeBearerToken(authorization);
    }
  }

  static isValidTokenSignature(token) {
    try {
      TokenComponent.verifyToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  isAuthenticated(req) {
    return CheckMiddleware._isAuthenticated(req, Transport.rest, BackendError.Unauthorized);
  }

  isAuthenticatedSocket(req) {
    return CheckMiddleware._isAuthenticated(req, Transport.socket, SocketError.Unauthorized);
  }

  static async _isAuthenticated(req, type, ErrorInitiator) {
    const token = CheckMiddleware.extractToken(req, type);
    if (!token) {
      throw new ErrorInitiator('Token does not contain Bearer');
    }

    const isValidTokenSignature = CheckMiddleware.isValidTokenSignature(token);
    if (!isValidTokenSignature) {
      throw new ErrorInitiator('Invalid token signature');
    }

    const isActiveToken = await ValidatorComponent.isActiveToken(token);
    if (!isActiveToken) {
      throw new ErrorInitiator('Invalid token');
    }

    req.parsedBearerToken = token;
  }

  async isUserExist(req) {
    const { email, username } = req.body;
    const [isExistEmail, isExistUsername] = await Promise.all([
      ValidatorComponent.isExistEmail(email),
      ValidatorComponent.isExistUsername(username),
    ]);
    if (isExistEmail) {
      throw new BackendError.Conflict(`User with email ${email} already registered`);
    }
    if (isExistUsername) {
      throw new BackendError.Conflict(`User with username ${username} already registered`);
    }
  }
}

module.exports = {
  CheckMiddleware: new CheckMiddleware(),
};

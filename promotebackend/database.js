const prisma = require("@prisma/client");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const prismaClient = new prisma.PrismaClient();

/**
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<prisma.User | boolean>}
 */
async function register(email, password) {
  try {
    const hash = bcrypt.hashSync(password, saltRounds);
    const user = await prismaClient.user.create({
      data: { email: email, password: hash },
    });
    return user;
  } catch (e) {
    console.log(e);
    return false;
  }
}

/**
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<prisma.User | boolean>}
 */
async function login(email, password) {
  try {
    const user = await prismaClient.user.findFirst({ where: { email: email } });
    if (!user) {
      return false;
    }

    const result = bcrypt.compareSync(password, user.password);
    if (result) {
      return user;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 *
 * @param {number} userId
 * @returns {Promise<prisma.History[] | boolean>}
 */
async function getHistory(userId) {
  try {
    const history = await prismaClient.history.findMany({
      where: { userId: userId },
    });
    return history;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 *
 * @param {number} historyId
 * @returns {Promise<prisma.History[] | boolean>}
 */
async function getHistoryById(historyId) {
  try {
    const history = await prismaClient.history.findFirst({
      where: { id: historyId },
    });
    return history ?? false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 *
 * @param {prisma.History} input
 * @returns {Promise<boolean>}
 */
async function pushHistory(input) {
  try {
    const response = await prismaClient.history.create({ data: input });
    return response !== undefined;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  register,
  login,
  getHistory,
  getHistoryById,
  pushHistory,
};

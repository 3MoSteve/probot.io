const EventEmitter = require("events");
/* eslint-disable eol-last */
const axios = (require("axios").default).create({ baseURL: "https://api.probot.io" });
class ProBot extends EventEmitter {
  /**
   * @param {string} token Your Discord Account Token or Your Token in ProBot Dashboard
   * @param {"discord"|"probot"} type The Type of the given Token (discord or probot)
   */
  constructor(token, type = "discord") {
    super();
    if (!["discord", "probot"].includes(type)) throw new TypeError(`The 'type' parameter must be "discord" or "probot". received ${type}`);
    this.token = token;
    this.type = type;
    axios.defaults.headers.Authorization = token;
    // eslint-disable-next-line yoda
    if ("discord" === type) {
      axios.post("https://discord.com/api/v9/oauth2/authorize?client_id=282859044593598464&response_type=code&scope=identify%20guilds%20email", {
        authorize: true,
        permissions: "0"
      }).then(async res => {
        const { data } = (await axios.get(res.data.location));
        // eslint-disable-next-line no-multi-assign
        axios.defaults.headers.Authorization = (this.token = data.match(/\/([a-zA-Z0-9]+)\/\'/g)[0].slice(1, -2));
        await this.refresh();
        await this.refreshTransactions();
        this.emit("ready");
      }).catch(() => {
        throw new Error("Invalid Discord Token.");
      });
    } else {
      this.refresh().then(() => {
        this.refreshTransactions().then(() => {
          this.emit("ready");
        });
      });
    }
  }

  /**
   * @param {String} googleRaptcha Your Captcha Response
   */
  claimDaily(captcha, { host = "", port = "0000", protocol = "https", username = null, password = null } = {}) {
    const proxy = {};
    if (host && port) {
      proxy.host = host;
      proxy.port = port;
    }
    if (username && password) {
      proxy.auth = { username, password };
    }
    if (Object.keys(proxy) > 0) proxy.protocol = protocol;

    return new Promise((resolve, reject) => {
      const obj = Object.keys(proxy) > 0 ? { proxy } : {};
      axios.post("/claim_daily", { captcha }, obj).then(res => {
        resolve(res.data);
      }).catch(e => {
        reject(e?.response?.data);
      });
    });
  }

  /**
   * @description Request the new User Details and guilds.
   * @returns {Promise<UserData>}
   */
  async refresh() {
    /**
     * @type {UserData}
     */
    this.user = (await axios.get("/user")).data;
    this.user.tag = `${this.user.name}#${this.user.discriminator}`;
    /**
     * @type {Array<GuildData>}
     */
    this.guilds = (await axios.get("/guilds")).data.map(guild => {
      if (guild.icon) guild.icon = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}${(guild.icon.startsWith("a_") ? ".gif" : ".png")}`;
      return guild;
    });
    return Promise.resolve(this.user);
  }

  /**
   * @description Refresh Transaction logs All received and sent transactions
   * @returns {Promise<Array<Transactions>>}
   */
  async refreshTransactions() {
    const data = (await axios.get("/transactions")).data;
    const array = [data];
    if (data.pages > 1) {
      for (let i = 2; i < data.pages; i++) {
        const data = (await axios.get(`/transactions?page=${i}`)).data;
        array.push(data);
      }
    }
    /**
     * @type {Array<Transactions>}
     */
    this.transactions = array;
    return Promise.resolve(array);
  }

  /**
   * @param {Boolean} all Logout From All Devices or no.
   * @description Logout From The ProBot Dashboard and the token will not work anymore.
   */
  destroy(all = false) {
    if (typeof all != "boolean") {
      all = Boolean(all);
    }
    axios.get(`/logout${(all ? "?all=1" : "")}`).then(() => {
      // eslint-disable-next-line no-multi-assign
      this.token = this.type = undefined;
    }).catch(e => {
      throw e?.response?.data;
    });
    this.emit("logout", all);
  }
}

module.exports = ProBot;

/**
 * @typedef Transactions
 * @property {Number} page Returns the page number where this transaction is
 * @property {Number} page Returns the size of pages
 * @property {Array<TransactionData>} transactions Returns the all Transactions in this page
 * @property {Array<User>} users Returns all the users in this page
 */
/**
 * @typedef User
 * @property {String} avatar Returns the avatar URL of the user
 * @property {String} name Returns the username of the user
 * @property {String} discriminator Returns the discriminator of the user
 * @property {String} _id Returns the user id
 */
/**
 * @typedef TransactionData
 * @property {String} _id If you are a Developer you will understand this
 * @property {String} from The ID of the user who sent the credits
 * @property {String} to The ID of the user who received the credits
 * @property {Number} balance The Amount of the credits after sending or receiving
 * @property {Number} credits The amount of the received or sent credits
 * @property {String} reason the Reason
 * @property {Number} toBalance The Amount of the received or sent credits with the tax
 */

/**
 * @typedef GuildData
 * @property {String} icon Returns the guild icon url
 * @property {String} id Returns the guild id
 * @property {Boolean} owner Returns true if you are the Ownership of this guild, false if not
 * @property {Number} permissions Returns your Permissions in the guild
 * @property {String} permissions_new Returns your new permissions in the guild
 * @property {Array} features Returns the guild features
 */


/**
 * @typedef UserData
 * @property {String} name Returns Your Discord Account Username
 * @property {String} avatar Returns Discord Account Avatar URL
 * @property {String} tag Returns Your Discord Username With your Discriminator
 * @property {String} email Returns Your Discord Email Address.
 * @property {Number} discriminator Returns your Discord Account discriminator
 * @property {Number} blacklist returns 1 If you are blacklisted from ProBot and 0 if not
 * @property {Number} balance I don't know Why Dramex added this one
 * @property {String} current_bg Returns the Your Profile Background
 * @property {String} current_id_bg Returns the id of Your Profile Background
 * @property {String} ownedbgs Returns all your purchased backgrounds
 * @property {String} ownedbadges Returns all your purchased badges
 * @property {Number} xp Returns your XP Count
 * @property {Number} rep Returns Your Rep Count
 * @property {Number} credits Returns your Credits
 * @property {Number} warning Returns how much warnings you have received from Dramex :)
 * @property {Number} level Returns your level in ProBot
 * @property {Number} ping lol I dont Know maybe Your PING 😂
 * @property {String} next_ping Returns the Next Date When you can ping again 😂
 * @property {String} lastModified Returns the last Date where you have pinged 😂
 * @property {String} access Not Sure, but maybe your Access Token in the Dashboard
 * @property {Number} rank Returns Your Rank
 * @property {String} country Returns the Country of the last Logged in IP Address.
 */
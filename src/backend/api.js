const path = require('path');
const fs = require('fs');
const MTProto = require('@mtproto/core');
const { sleep } = require('@mtproto/core/src/utils/common');

let api_id;
let api_hash;
let mob_num;


class API {
  constructor() {
    this.mtproto = new MTProto({
      api_id,
      api_hash,

      storageOptions: {
        path: path.resolve(__dirname, `./authData/salt/authSalt${mob_num}.json`),
      },
    });
  }

  async call(method, params, options = {}) {
    try {
      const result = await this.mtproto.call(method, params, options);

      return result;
    } catch (error) {
      console.log(`${method} error:`, error);

      const { error_code, error_message } = error;

      if (error_code === 420) {
        const seconds = Number(error_message.split('FLOOD_WAIT_')[1]);
        const ms = seconds * 1000;

        await sleep(ms);

        return this.call(method, params, options);
      }

      if (error_code === 303) {
        const [type, dcIdAsString] = error_message.split('_MIGRATE_');

        const dcId = Number(dcIdAsString);

        // If auth.sendCode call on incorrect DC need change default DC, because
        // call auth.signIn on incorrect DC return PHONE_CODE_EXPIRED error
        if (type === 'PHONE') {
          await this.mtproto.setDefaultDc(dcId);
        } else {
          Object.assign(options, { dcId });
        }

        return this.call(method, params, options);
      }

      return Promise.reject(error);
    }
  }
}

const setApiConfigData = async (mobNum) => {
  mob_num = mobNum;

  const filePath = path.resolve(__dirname, 'authData/configs', `config${mobNum}.json`);

  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    api_id = jsonData.apiTel.apiId;
    api_hash = jsonData.apiTel.apiHash;
  } catch (e) {
    return e;
  }
}

module.exports = { API, setApiConfigData };
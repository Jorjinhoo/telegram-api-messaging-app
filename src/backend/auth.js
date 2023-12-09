const { API } = require('./api')

async function getUser(api) {
  try {
    const user = await api.call('users.getFullUser', {
      id: {
        _: 'inputUserSelf',
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}


function sendCode(phone, api) {
  return api.call('auth.sendCode', {
    phone_number: phone,
    settings: {
      _: 'codeSettings',
    },
  });
}

function signIn({ code, phone, phone_code_hash }, api) {
  return api.call('auth.signIn', {
    phone_code: code,
    phone_number: phone,
    phone_code_hash: phone_code_hash,
  });
}

function getPassword(api) {
  return api.call('account.getPassword');
}

function checkPassword({ srp_id, A, M1 }, api) {
  return api.call('auth.checkPassword', {
    password: {
      _: 'inputCheckPasswordSRP',
      srp_id,
      A,
      M1,
    },
  });
}


const auth = async (phone, code) => {
  const api = new API();
  const user = await getUser(api);

  if (!user) {
    const { phone_code_hash } = await sendCode(phone, api);

      const signInResult = await signIn({
        code,
        phone,
        phone_code_hash,
      }, api);

      if (signInResult._ === 'auth.authorizationSignUpRequired') {
       console.log(`account with this phone: ${phone} doesnt exist, registration required`);
      }

      // 2FA
      const { srp_id, current_algo, srp_B } = await getPassword(api);
      const { g, p, salt1, salt2 } = current_algo;

      const { A, M1 } = await api.mtproto.crypto.getSRPParams({
        g,
        p,
        salt1,
        salt2,
        gB: srp_B,
        password,
      }, api);

      const checkPasswordResult = await checkPassword({ srp_id, A, M1 }, api);
  }
};


module.exports = auth;
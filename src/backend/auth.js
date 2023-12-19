const { API } = require('./api')
const { getUser, sendCode, signIn } = require('./authUtils')


const auth = async (phone, code) => {
  const api = new API();

  try{
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
        return signInResult._;
      }
      return true;
    }
  }catch(e){
    return e
  }
};


module.exports = auth;
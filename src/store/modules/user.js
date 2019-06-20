import { logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import AWS from 'aws-sdk'
import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js'

const cognito_user_pool = new CognitoUserPool({
  UserPoolId: process.env.VUE_APP_COGNITO_USERPOOL_ID,
  ClientId: process.env.VUE_APP_COGNITO_CLIENT_ID
})

const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}
const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo

    return new Promise((resolve, reject) => {
      const cognito_user = new CognitoUser({
        Username: username,
        Pool: cognito_user_pool
      })
      cognito_user.authenticateUser(
        new AuthenticationDetails({
          Username: username,
          Password: password
        }),
        {
          onSuccess(cognito_user_session) {
            const provider_key = `cognito-idp.${process.env.VUE_APP_COGNITO_REGION}.amazonaws.com/${process.env.VUE_APP_COGNITO_USERPOOL_ID}`
            AWS.config.region = process.env.VUE_APP_COGNITO_REGION
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              IdentityPoolId: process.env.VUE_APP_COGNITO_IDENTITY_POOL_ID,
              Logins: {
                [provider_key]: cognito_user_session.getIdToken().getJwtToken()
              }
            })
            AWS.config.credentials.refresh(error => {
              if (error) {
                console.log(error)
              }
            })
            // commit('storeTokens', cognito_user_session)
            commit('SET_TOKEN', cognito_user_session.getIdToken().getJwtToken())
            setToken(cognito_user_session.getIdToken().getJwtToken())
            resolve()
          },
          onFailure(error) {
            reject(error)
          }
        }
      )
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const cognitoUser = cognito_user_pool.getCurrentUser()
      const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
        {
          region: process.env.VUE_APP_COGNITO_REGION
        }
      )
      if (cognitoUser) {
        cognitoUser.getSession((error, session) => {
          if (error) {
            reject(error)
          }
          const accessToken = session.getAccessToken().getJwtToken()
          const params = {
            AccessToken: accessToken
          }
          cognitoidentityserviceprovider.getUser(params, function(err, data) {
            if (err) {
              reject('Verification failed, please Login again.')
            } // an error occurred
            // console.log(data.UserAttributes)
            const { Name, Value } = data.UserAttributes[4]
            console.log(Name)
            commit('SET_NAME', Value)
            commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
            resolve(data) // successful response
          })
        })
      }
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


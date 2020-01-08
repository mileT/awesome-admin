const url = 'http://localhost:3006';
const authUrl = 'http://localhost:5000';

module.exports = {
  loginUrl: `${authUrl}/auth/oauth/authorize?response_type=code&client_id=app&redirect_uri=${url}/auth`,
  logoutUrl: `${authUrl}/auth/logout`,
};

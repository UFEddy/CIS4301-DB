import axios from 'axios';

const API_URL = 'http://localhost:8080/auth/';

class AuthService {
  async login(credentials) {
    const response = await axios.post(API_URL + 'login', credentials);
    if (response.headers.authorization) {
      localStorage.setItem('user', JSON.stringify({ token: response.headers.authorization }));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();

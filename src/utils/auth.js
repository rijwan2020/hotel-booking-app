export const saveToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");

export const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const login = (user) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const existingUser = users.find(
    (u) => u.email === user.email && u.password === user.password
  );
  if (!existingUser) {
    throw new Error("Invalid email or password");
  }
  localStorage.setItem("user", JSON.stringify(existingUser));
  return existingUser;
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  return null;
};

export const register = (user) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const existingUser = users.find((u) => u.email === user.email);
  if (existingUser) {
    throw new Error("User already exists");
  }
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

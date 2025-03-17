// Query for user from Clerk database by username
async function getUserByName(app, clerkClient) {
  app.get('/userByName/:username', async (req, res) => {
    const { username } = req.params;
    try {
      // Query by username (will return array since some Clerk databases allow duplicate usernames)
      const { data } = await clerkClient.users.getUserList({ username: username });
      // Send successful status and return user information
      res.status(200).json({ user: data[0] });  // Return [0] since data is naturally an array, but only one user exists
    } catch (error) {
      res.status(500).send("Server error while getting user by username.");
    }
  });
};

// Query for user from Clerk database by id
async function getUserById(app, clerkClient) {
  app.get('/userById/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Query by id (returns a single user since ids are always unique in Clerk)
      const user = await clerkClient.users.getUser(id);
      // Send successful status and return user information
      res.status(200).json({ user: user });
    } catch (error) {
      res.status(500).send("Server error while getting user by ID");
    }
  });
};

// Export functions so that server can call them
export { getUserByName, getUserById };
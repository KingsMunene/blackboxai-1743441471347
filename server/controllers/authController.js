// Mock user database (in production, use a real database)
const users = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123', // In production, store hashed passwords
        role: 'admin',
        name: 'System Administrator'
    },
    {
        id: 2,
        username: 'user1',
        password: 'user123',
        role: 'user',
        name: 'John Doe'
    }
];

module.exports = {
    showLoginForm: (req, res) => {
        res.render('auth/login');
    },

    handleLogin: (req, res) => {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            req.session.user = {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            };
            return res.redirect(user.role === 'admin' ? '/admin/dashboard' : '/user/status');
        }

        res.render('auth/login', { 
            error: 'Invalid username or password',
            username 
        });
    },

    showRegisterForm: (req, res) => {
        res.render('auth/register');
    },

    handleRegistration: (req, res) => {
        const { username, password, name } = req.body;
        
        // Check if username exists
        if (users.some(u => u.username === username)) {
            return res.render('auth/register', { 
                error: 'Username already exists',
                username,
                name
            });
        }

        // Create new user (in production, hash the password)
        const newUser = {
            id: users.length + 1,
            username,
            password,
            name,
            role: 'user' // All new registrations are regular users
        };
        users.push(newUser);

        // Auto-login after registration
        req.session.user = {
            id: newUser.id,
            username: newUser.username,
            name: newUser.name,
            role: newUser.role
        };
        res.redirect('/user/status');
    },

    handleLogout: (req, res) => {
        req.session.destroy(err => {
            if (err) {
                console.error('Logout error:', err);
            }
            res.redirect('/auth/login');
        });
    }
};
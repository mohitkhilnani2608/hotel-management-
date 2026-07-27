const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// Serve static frontend files from the 'dist' directory
app.use(express.static(path.join(__dirname, '../dist')));

// --- Customers Auth ---
app.post('/api/customers/register', (req, res) => {
    const { name, email, password } = req.body;
    db.run('INSERT INTO Customers (name, email, password) VALUES (?, ?, ?)', [name, email, password], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, name, email });
    });
});

app.post('/api/customers/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT id, name, email FROM Customers WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(401).json({ error: 'Invalid credentials' });
        res.json(row);
    });
});

// --- Orders ---
app.get('/api/orders', (req, res) => {
    db.all('SELECT * FROM Orders ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const orders = rows;
        let count = 0;
        
        if (orders.length === 0) return res.json([]);
        
        orders.forEach((order, index) => {
            db.all('SELECT * FROM OrderItems WHERE orderId = ?', [order.id], (err, items) => {
                orders[index].items = items || [];
                count++;
                if (count === orders.length) {
                    res.json(orders);
                }
            });
        });
    });
});

app.post('/api/orders', (req, res) => {
    const { total, items, customerId } = req.body;
    
    db.run('INSERT INTO Orders (total, customerId) VALUES (?, ?)', [total, customerId || null], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        const orderId = this.lastID;
        
        const stmt = db.prepare('INSERT INTO OrderItems (orderId, menuItemId, name, price, quantity) VALUES (?, ?, ?, ?, ?)');
        items.forEach(item => {
            stmt.run(orderId, item.id, item.name, item.price, item.quantity);
        });
        stmt.finalize();
        
        res.json({ id: orderId, status: 'Pending', total, items });
    });
});

app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    db.run('UPDATE Orders SET status = ? WHERE id = ?', [status, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id, status });
    });
});

// --- Reservations ---
app.get('/api/reservations', (req, res) => {
    db.all('SELECT * FROM Reservations ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/reservations', (req, res) => {
    const { guestName, partySize, date, time, customerId } = req.body;
    const id = 'R' + Math.floor(1000 + Math.random() * 9000);
    
    db.run(
        'INSERT INTO Reservations (id, guestName, partySize, date, time, customerId) VALUES (?, ?, ?, ?, ?, ?)',
        [id, guestName, partySize, date, time, customerId || null],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id, guestName, partySize, date, time, customerId, status: 'Confirmed' });
        }
    );
});

// --- Lounge Bookings ---
app.get('/api/lounge-bookings', (req, res) => {
    db.all('SELECT * FROM LoungeBookings ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/lounge-bookings', (req, res) => {
    const { guestName, eventDetails, guests, date, time } = req.body;
    const id = 'L' + Math.floor(1000 + Math.random() * 9000);
    
    db.run(
        'INSERT INTO LoungeBookings (id, guestName, eventDetails, guests, date, time) VALUES (?, ?, ?, ?, ?, ?)',
        [id, guestName, eventDetails, guests, date, time],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id, guestName, eventDetails, guests, date, time, status: 'Confirmed' });
        }
    );
});

// --- Analytics ---
app.get('/api/analytics', (req, res) => {
    // Dynamic Analytics logic
    const queries = {
        totalRevenue: 'SELECT SUM(total) as value FROM Orders',
        orderCount: 'SELECT COUNT(*) as count FROM Orders',
        reservationCount: 'SELECT COUNT(*) as count FROM Reservations',
        loungeCount: 'SELECT COUNT(*) as count FROM LoungeBookings',
        totalCustomers: 'SELECT COUNT(*) as count FROM Customers'
    };
    
    const results = {
        totalRevenue: 0,
        netProfit: 0,
        orderCount: 0,
        reservationCount: 0,
        loungeCount: 0,
        totalCustomers: 0
    };
    
    let completed = 0;
    const totalQueries = Object.keys(queries).length;
    
    if (totalQueries === 0) return res.json(results);
    
    Object.entries(queries).forEach(([key, query]) => {
        db.get(query, [], (err, row) => {
            if (!err && row) {
                if (key === 'totalRevenue') {
                    results.totalRevenue = row.value || 0;
                    // Simple profit calculation (assume 30% margin for demo)
                    results.netProfit = results.totalRevenue * 0.3;
                } else {
                    results[key] = row.count || 0;
                }
            }
            completed++;
            if (completed === totalQueries) {
                res.json(results);
            }
        });
    });
});

// ---------------------------------------------------------
// STAFF ENDPOINTS
// ---------------------------------------------------------

app.post('/api/staff/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT id, name, email, role FROM Staff WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(401).json({ error: 'Invalid credentials' });
        res.json(row);
    });
});

app.post('/api/staff/register', (req, res) => {
    const { name, email, password, role } = req.body;
    const insertRole = role === 'Admin' ? 'Admin' : 'Staff'; // strict validation
    
    db.run('INSERT INTO Staff (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, insertRole], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, name, email, role: insertRole });
    });
});

// ---------------------------------------------------------
// FRONTEND FALLBACK (React Router)
// ---------------------------------------------------------
// This must be the last route. It catches all non-API requests and serves index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

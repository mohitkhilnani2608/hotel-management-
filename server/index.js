const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// Serve static frontend files only in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
}

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
    const { total, items, customerId, tableId } = req.body;

    db.run('INSERT INTO Orders (total, customerId, tableId) VALUES (?, ?, ?)', [total, customerId || null, tableId || null], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        const orderId = this.lastID;

        const stmt = db.prepare('INSERT INTO OrderItems (orderId, menuItemId, name, price, quantity) VALUES (?, ?, ?, ?, ?)');
        items.forEach(item => {
            stmt.run(orderId, item.id || item.menuItemId, item.name, item.price, item.quantity);
        });
        stmt.finalize();

        res.json({ id: orderId, status: 'Pending', total, items, tableId });
    });
});

app.get('/api/orders/active-table/:tableId', (req, res) => {
    const { tableId } = req.params;
    db.get('SELECT * FROM Orders WHERE tableId = ? AND status != ? ORDER BY createdAt DESC LIMIT 1', [tableId, 'Completed'], (err, order) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!order) return res.json(null);

        db.all('SELECT * FROM OrderItems WHERE orderId = ?', [order.id], (err, items) => {
            if (err) return res.status(500).json({ error: err.message });
            order.items = items || [];
            res.json(order);
        });
    });
});

app.put('/api/orders/:id/items', (req, res) => {
    const { id } = req.params;
    const { total, items } = req.body;

    db.serialize(() => {
        db.run('UPDATE Orders SET total = ? WHERE id = ?', [total, id], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            db.run('DELETE FROM OrderItems WHERE orderId = ?', [id], (err) => {
                if (err) return res.status(500).json({ error: err.message });

                const stmt = db.prepare('INSERT INTO OrderItems (orderId, menuItemId, name, price, quantity) VALUES (?, ?, ?, ?, ?)');
                items.forEach(item => {
                    stmt.run(id, item.menuItemId || item.id, item.name, item.price, item.quantity);
                });
                stmt.finalize();

                res.json({ success: true, id, total, items });
            });
        });
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

app.put('/api/reservations/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, tableId } = req.body;

    let query = 'UPDATE Reservations SET status = ?';
    const params = [status];

    if (tableId !== undefined) {
        query += ', tableId = ?';
        params.push(tableId);
    }

    query += ' WHERE id = ?';
    params.push(id);

    db.run(query, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id, status, tableId });
    });
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

app.put('/api/lounge-bookings/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    db.run('UPDATE LoungeBookings SET status = ? WHERE id = ?', [status, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id, status });
    });
});

// --- Analytics ---
app.get('/api/analytics', (req, res) => {
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

    Object.entries(queries).forEach(([key, query]) => {
        db.get(query, [], (err, row) => {
            if (!err && row) {
                if (key === 'totalRevenue') {
                    results.totalRevenue = row.value || 0;
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

    db.get(
        'SELECT id, name, email, role FROM Staff WHERE email = ? AND password = ?',
        [email, password],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(401).json({ error: 'Invalid credentials' });
            res.json(row);
        }
    );
});

app.post('/api/staff/register', (req, res) => {
    const { name, email, password, role } = req.body;

    const insertRole = role === 'Admin' ? 'Admin' : 'Staff';

    db.run(
        'INSERT INTO Staff (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, password, insertRole],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ error: err.message });
            }

            res.json({
                id: this.lastID,
                name,
                email,
                role: insertRole
            });
        }
    );
});

// ---------------------------------------------------------
// FRONTEND (ONLY IN PRODUCTION)
// ---------------------------------------------------------

if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
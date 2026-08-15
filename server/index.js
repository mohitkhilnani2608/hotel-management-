const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware for CORS & Body Parsing
app.use(cors());
app.use(express.json());

// Set Content Security Policy (CSP) headers to permit Google Fonts & Assets
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; font-src 'self' https://fonts.gstatic.com data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:; connect-src 'self' *;"
    );
    next();
});

// Static frontend dist path resolution
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// =========================================================
// CUSTOMERS AUTH
// =========================================================

app.post('/api/customers/register', (req, res) => {
    const { name, email, password } = req.body;

    db.run(
        'INSERT INTO Customers (name, email, password) VALUES (?, ?, ?)',
        [name, email, password],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({
                        error: 'Email already exists'
                    });
                }

                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                id: this.lastID,
                name,
                email
            });
        }
    );
});

app.post('/api/customers/login', (req, res) => {
    const { email, password } = req.body;

    db.get(
        'SELECT id, name, email FROM Customers WHERE email = ? AND password = ?',
        [email, password],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            res.json(row);
        }
    );
});

// =========================================================
// ORDERS
// =========================================================

app.get('/api/orders', (req, res) => {
    db.all(
        'SELECT * FROM Orders ORDER BY createdAt DESC',
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            const orders = rows;
            let count = 0;

            if (orders.length === 0) {
                return res.json([]);
            }

            orders.forEach((order, index) => {
                db.all(
                    'SELECT * FROM OrderItems WHERE orderId = ?',
                    [order.id],
                    (err, items) => {
                        orders[index].items = items || [];
                        count++;

                        if (count === orders.length) {
                            res.json(orders);
                        }
                    }
                );
            });
        }
    );
});

app.post('/api/orders', (req, res) => {
    const {
        total,
        items,
        customerId,
        tableId
    } = req.body;

    db.run(
        'INSERT INTO Orders (total, customerId, tableId) VALUES (?, ?, ?)',
        [
            total,
            customerId || null,
            tableId || null
        ],
        function(err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            const orderId = this.lastID;

            const stmt = db.prepare(
                'INSERT INTO OrderItems (orderId, menuItemId, name, price, quantity) VALUES (?, ?, ?, ?, ?)'
            );

            items.forEach(item => {
                stmt.run(
                    orderId,
                    item.id || item.menuItemId,
                    item.name,
                    item.price,
                    item.quantity
                );
            });

            stmt.finalize();

            res.json({
                id: orderId,
                status: 'Pending',
                total,
                items,
                tableId
            });
        }
    );
});

app.get('/api/orders/active-table/:tableId', (req, res) => {
    const { tableId } = req.params;

    db.get(
        'SELECT * FROM Orders WHERE tableId = ? AND status != ? ORDER BY createdAt DESC LIMIT 1',
        [tableId, 'Completed'],
        (err, order) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!order) {
                return res.json(null);
            }

            db.all(
                'SELECT * FROM OrderItems WHERE orderId = ?',
                [order.id],
                (err, items) => {
                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    order.items = items || [];
                    res.json(order);
                }
            );
        }
    );
});

app.put('/api/orders/:id/items', (req, res) => {
    const { id } = req.params;
    const { total, items } = req.body;

    db.serialize(() => {
        db.run(
            'UPDATE Orders SET total = ? WHERE id = ?',
            [total, id],
            (err) => {
                if (err) {
                    return res.status(500).json({
                        error: err.message
                    });
                }

                db.run(
                    'DELETE FROM OrderItems WHERE orderId = ?',
                    [id],
                    (err) => {
                        if (err) {
                            return res.status(500).json({
                                error: err.message
                            });
                        }

                        const stmt = db.prepare(
                            'INSERT INTO OrderItems (orderId, menuItemId, name, price, quantity) VALUES (?, ?, ?, ?, ?)'
                        );

                        items.forEach(item => {
                            stmt.run(
                                id,
                                item.menuItemId || item.id,
                                item.name,
                                item.price,
                                item.quantity
                            );
                        });

                        stmt.finalize();

                        res.json({
                            success: true,
                            id,
                            total,
                            items
                        });
                    }
                );
            }
        );
    });
});

app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    db.run(
        'UPDATE Orders SET status = ? WHERE id = ?',
        [status, id],
        function(err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                success: true,
                id,
                status
            });
        }
    );
});

// =========================================================
// RESERVATIONS
// =========================================================

app.get('/api/reservations', (req, res) => {
    db.all(
        'SELECT * FROM Reservations ORDER BY createdAt DESC',
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
});

app.post('/api/reservations', (req, res) => {
    const {
        guestName,
        partySize,
        date,
        time,
        customerId
    } = req.body;

    const id = 'R' + Math.floor(1000 + Math.random() * 9000);

    db.run(
        'INSERT INTO Reservations (id, guestName, partySize, date, time, customerId) VALUES (?, ?, ?, ?, ?, ?)',
        [
            id,
            guestName,
            partySize,
            date,
            time,
            customerId || null
        ],
        function(err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                id,
                guestName,
                partySize,
                date,
                time,
                customerId,
                status: 'Confirmed'
            });
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

    db.run(
        query,
        params,
        function(err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                success: true,
                id,
                status,
                tableId
            });
        }
    );
});

// =========================================================
// LOUNGE BOOKINGS
// =========================================================

app.get('/api/lounge-bookings', (req, res) => {
    db.all(
        'SELECT * FROM LoungeBookings ORDER BY createdAt DESC',
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
});

app.post('/api/lounge-bookings', (req, res) => {
    const {
        guestName,
        eventDetails,
        guests,
        date,
        time
    } = req.body;

    const id = 'L' + Math.floor(1000 + Math.random() * 9000);

    db.run(
        'INSERT INTO LoungeBookings (id, guestName, eventDetails, guests, date, time) VALUES (?, ?, ?, ?, ?, ?)',
        [
            id,
            guestName,
            eventDetails,
            guests,
            date,
            time
        ],
        function(err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                id,
                guestName,
                eventDetails,
                guests,
                date,
                time,
                status: 'Confirmed'
            });
        }
    );
});

app.put('/api/lounge-bookings/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    db.run(
        'UPDATE LoungeBookings SET status = ? WHERE id = ?',
        [status, id],
        function(err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                success: true,
                id,
                status
            });
        }
    );
});

// =========================================================
// ANALYTICS
// =========================================================

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

// =========================================================
// STAFF ENDPOINTS
// =========================================================

app.post('/api/staff/login', (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    db.get(
        'SELECT id, name, email, role FROM Staff WHERE LOWER(email) = ? AND password = ?',
        [normalizedEmail, password],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            res.json(row);
        }
    );
});

app.post('/api/staff/register', (req, res) => {
    const { name, email, password, role } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const insertRole = role === 'Admin' ? 'Admin' : 'Staff';

    db.run(
        'INSERT INTO Staff (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, normalizedEmail, password, insertRole],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({
                        error: 'Email already exists'
                    });
                }

                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                id: this.lastID,
                name,
                email: normalizedEmail,
                role: insertRole
            });
        }
    );
});

app.put('/api/staff/change-password', (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    db.get(
        'SELECT id, password FROM Staff WHERE LOWER(email) = ?',
        [normalizedEmail],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    error: 'Staff member not found'
                });
            }

            if (row.password !== currentPassword) {
                return res.status(401).json({
                    error: 'Incorrect current password'
                });
            }

            db.run(
                'UPDATE Staff SET password = ? WHERE id = ?',
                [newPassword, row.id],
                function(err) {
                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.json({
                        success: true,
                        message: 'Password updated successfully'
                    });
                }
            );
        }
    );
});

// =========================================================
// FORGOT PASSWORD
// =========================================================

const passwordResetOtps = new Map();

app.post('/api/staff/forgot-password', (req, res) => {
    const { email } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail) {
        return res.status(400).json({
            error: 'Email address is required'
        });
    }

    db.get(
        'SELECT id, name, email FROM Staff WHERE LOWER(email) = ?',
        [normalizedEmail],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    error: 'No staff account found with this email'
                });
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = Date.now() + 10 * 60 * 1000;

            passwordResetOtps.set(normalizedEmail, {
                otp,
                expiresAt,
                verified: false
            });

            res.json({
                success: true,
                message: 'Password reset code generated successfully',
                otp,
                expiresIn: 600
            });
        }
    );
});

app.post('/api/staff/verify-reset-otp', (req, res) => {
    const { email, otp } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const enteredOtp = String(otp || '').trim();

    const resetData = passwordResetOtps.get(normalizedEmail);

    if (!resetData) {
        return res.status(400).json({
            error: 'No password reset request found. Please request a new code.'
        });
    }

    if (Date.now() > resetData.expiresAt) {
        passwordResetOtps.delete(normalizedEmail);
        return res.status(400).json({
            error: 'Reset code has expired. Please request a new code.'
        });
    }

    if (resetData.otp !== enteredOtp) {
        return res.status(400).json({
            error: 'Invalid reset code'
        });
    }

    resetData.verified = true;
    passwordResetOtps.set(normalizedEmail, resetData);

    res.json({
        success: true,
        message: 'Reset code verified successfully'
    });
});

app.put('/api/staff/reset-password', (req, res) => {
    const { email, newPassword } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!newPassword) {
        return res.status(400).json({
            error: 'New password is required'
        });
    }

    if (newPassword.length < 4) {
        return res.status(400).json({
            error: 'Password must be at least 4 characters'
        });
    }

    const resetData = passwordResetOtps.get(normalizedEmail);

    if (!resetData) {
        return res.status(400).json({
            error: 'Password reset request not found'
        });
    }

    if (Date.now() > resetData.expiresAt) {
        passwordResetOtps.delete(normalizedEmail);
        return res.status(400).json({
            error: 'Reset code has expired. Please request a new code.'
        });
    }

    if (!resetData.verified) {
        return res.status(401).json({
            error: 'Please verify the reset code first'
        });
    }

    db.run(
        'UPDATE Staff SET password = ? WHERE LOWER(email) = ?',
        [newPassword, normalizedEmail],
        function(err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: 'Staff member not found'
                });
            }

            passwordResetOtps.delete(normalizedEmail);

            res.json({
                success: true,
                message: 'Password reset successfully'
            });
        }
    );
});

// =========================================================
// FRONTEND SERVING / SPA FALLBACK
// =========================================================

const indexPath = path.join(distPath, 'index.html');

app.get('*', (req, res) => {
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Frontend build not found. Please run "npm run build" to create the dist directory.');
    }
});

// =========================================================
// START SERVER
// =========================================================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const schemaPath = path.resolve(__dirname, 'schema.sql');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database.');
        
        // Read and execute schema
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema, (err) => {
            if (err) {
                console.error('Error executing schema', err);
            } else {
                console.log('Database schema applied successfully.');
                
                // Seed initial data if reservations are empty
                db.get('SELECT COUNT(*) as count FROM Reservations', [], (err, row) => {
                    if (row && row.count === 0) {
                        const seedReservations = `
                            INSERT INTO Reservations (id, guestName, partySize, tableId, date, time, status) VALUES 
                            ('R1001', 'Eleanor Vance', 2, 'T2', datetime('now'), '19:00', 'Seated'),
                            ('R1002', 'Hugh Crain', 4, 'T10', datetime('now'), '19:30', 'Seated'),
                            ('R1003', 'Theodora', 6, NULL, datetime('now'), '20:00', 'Confirmed');
                        `;
                        db.exec(seedReservations);
                    }
                });

                // Seed initial staff if empty
                db.get('SELECT COUNT(*) as count FROM Staff', [], (err, row) => {
                    if (row && row.count === 0) {
                        const seedStaff = `
                            INSERT INTO Staff (name, email, password, role) VALUES 
                            ('Admin Owner', 'admin@auradine.com', 'admin123', 'Admin'),
                            ('Staff Member', 'staff@auradine.com', 'staff123', 'Staff');
                        `;
                        db.exec(seedStaff);
                    }
                });
            }
        });
    }
});

module.exports = db;

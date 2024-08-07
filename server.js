const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/customers', async (req, res) => {
  try {
    const [customers] = await db.query('SELECT * FROM Customers');
    res.render('customers', { customers });
  } catch (err) {
    res.status(500).send('Error retrieving customers');
  }
});

app.get('/addresses', async (req, res) => {
  try {
    const [addresses] = await db.query('SELECT * FROM Address');
    res.render('addresses', { addresses });
  } catch (err) {
    res.status(500).send('Error retrieving addresses');
  }
});

// Render HTML pages with EJS (Embedded JavaScript Templating)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CRUD operations for Customers

// Create a new customer
app.post('/customers', async (req, res) => {
  const { CustomerName, PhoneNumber, EmailAddress, CustomerType } = req.body;
  try {
    await db.query(
      'INSERT INTO Customers (CustomerName, PhoneNumber, EmailAddress, CustomerType) VALUES (?, ?, ?, ?)',
      [CustomerName, PhoneNumber, EmailAddress, CustomerType]
    );
    res.redirect('/customers');
  } catch (err) {
    res.status(500).send('Error creating customer');
  }
});

// Update a customer
app.post('/customers/update', async (req, res) => {
  const { CustomerID, CustomerName, PhoneNumber, EmailAddress, CustomerType } = req.body;
  try {
    await db.query(
      'UPDATE Customers SET CustomerName = ?, PhoneNumber = ?, EmailAddress = ?, CustomerType = ? WHERE CustomerID = ?',
      [CustomerName, PhoneNumber, EmailAddress, CustomerType, CustomerID]
    );
    res.redirect('/customers');
  } catch (err) {
    res.status(500).send('Error updating customer');
  }
});

// Delete a customer
app.post('/customers/delete', async (req, res) => {
  const { CustomerID } = req.body;
  try {
    await db.query('DELETE FROM Customers WHERE CustomerID = ?', [CustomerID]);
    res.redirect('/customers');
  } catch (err) {
    res.status(500).send('Error deleting customer');
  }
});

// Search customers
app.get('/customers/search', async (req, res) => {
  const { name } = req.query;
  try {
    const [customers] = await db.query('SELECT * FROM Customers WHERE CustomerName LIKE ?', [`%${name}%`]);
    res.render('customers', { customers });
  } catch (err) {
    res.status(500).send('Error searching customers');
  }
});

// CRUD operations for Address

// Create a new address
app.post('/addresses', async (req, res) => {
  const { Address, PostalCode, CustomerID } = req.body;
  try {
    await db.query(
      'INSERT INTO Address (Address, PostalCode, CustomerID) VALUES (?, ?, ?)',
      [Address, PostalCode, CustomerID]
    );
    res.redirect('/addresses');
  } catch (err) {
    res.status(500).send('Error creating address');
  }
});

// Update an address
app.post('/addresses/update', async (req, res) => {
  const { AddressID, Address, PostalCode, CustomerID } = req.body;
  try {
    await db.query(
      'UPDATE Address SET Address = ?, PostalCode = ?, CustomerID = ? WHERE AddressID = ?',
      [Address, PostalCode, CustomerID, AddressID]
    );
    res.redirect('/addresses');
  } catch (err) {
    res.status(500).send('Error updating address');
  }
});

// Delete an address
app.post('/addresses/delete', async (req, res) => {
  const { AddressID } = req.body;
  try {
    await db.query('DELETE FROM Address WHERE AddressID = ?', [AddressID]);
    res.redirect('/addresses');
  } catch (err) {
    res.status(500).send('Error deleting address');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

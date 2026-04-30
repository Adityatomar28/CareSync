const express = require('express');
const axios = require('axios');
const fs = require('fs');
const jwt = require('jsonwebtoken');

async function main() {
  try {
    // Read JWT secret from .env
    const env = fs.readFileSync('.env', 'utf8');
    const secretLine = env.split('\n').find(l => l.startsWith('JWT_SECRET='));
    const secret = secretLine ? secretLine.split('=')[1] : 'supersecretkey';

    // Get a valid user ID from DB
    const prisma = require('./src/prisma').default;
    let user = await prisma.user.findFirst();
    if (!user) {
      console.log("No user found");
      return;
    }
    
    // Generate token
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
    
    // Upload file using axios
    const FormData = require('form-data');
    const form = new FormData();
    form.append('notes', 'Real backend test note from CLI!');
    fs.writeFileSync('dummy.pdf', 'dummy content');
    form.append('file', fs.createReadStream('dummy.pdf'));

    const upRes = await axios.post('http://localhost:5001/api/reports', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Upload response:', upRes.data);
    
    // Fetch reports
    const getRes = await axios.get('http://localhost:5001/api/reports', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Fetched reports:', getRes.data.map(r => ({ name: r.fileName, notes: r.notes })));
    
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  } finally {
    process.exit(0);
  }
}
main();

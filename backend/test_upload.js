const fs = require('fs');

async function main() {
  try {
    const email = `test${Date.now()}@test.com`;
    const regRes = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        email: email,
        password: 'password123'
      })
    });
    const regData = await regRes.json();
    const token = regData.token;
    
    const formData = new FormData();
    formData.append('notes', 'This is a very important note');
    fs.writeFileSync('dummy.pdf', 'dummy content');
    const blob = new Blob([fs.readFileSync('dummy.pdf')], { type: 'application/pdf' });
    formData.append('file', blob, 'dummy.pdf');

    const upRes = await fetch('http://localhost:5001/api/reports', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    const upData = await upRes.json();
    console.log('Upload response:', upData);
    
    const getRes = await fetch('http://localhost:5001/api/reports', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const getData = await getRes.json();
    console.log('Fetched reports:', getData);

  } catch (err) {
    console.error('Error:', err);
  }
}
main();

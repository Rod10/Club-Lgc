const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs/promises');
const readline = require('node:readline');

async function start() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question("Piste ID: ", async pisteId => {
        rl.close();
// Read image from disk as a Buffer
        const image = await fs.readFile('./data/session/Trainning.XML');

// Create a form and append image with additional fields
        const form = new FormData();
        form.append('piste', pisteId);
        form.append('session', image, 'Trainning.XML');
// Send form data with axios
        await axios.post('http://localhost:3000/session/new', form, {
            headers: {
                ...form.getHeaders(),
            },
        });
    })
}

start();
const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('C:\\Users\\Manjiri\\Desktop\\frontend\\doc\\crm club.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('C:\\Users\\Manjiri\\Desktop\\frontend\\backend\\parsed-crm-data.txt', data.text);
    console.log('PDF text successfully extracted to parsed-crm-data.txt');
}).catch(function(err) {
    console.error('Error parsing PDF:', err);
});

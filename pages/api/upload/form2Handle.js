import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error uploading file.' });
      return;
    }

    const { file } = files;
    const { type, product,specs,oPrice,sPrice,isNego,category,contact,email } = fields;
    const fileName = file.originalFilename;
    const current = new Date();
    const date = `${current.getDate()}_${current.getMonth()+1}_${current.getFullYear()}_${current.getTime()}`;
    const filePath = `public/uploads/${date}_${fileName}`;
    const NewfileName=`${date}_${fileName}`;

    try{
      fs.renameSync(file.filepath, filePath);
      console.log(filePath)
      console.log(`Type: ${type}`);
      console.log(`Product: ${product}`);
      console.log(`Specs: ${specs}`);
      console.log(`OPrice: ${oPrice}`);
      console.log(`SPrice: ${sPrice}`);
      console.log(`IsNego: ${isNego}`);   
      console.log(`Category: ${category}`);
      console.log(`Contact: ${contact}`);
      console.log(`Email: ${email}`);

      const myData = { type: type, product: product, isNego:isNego,oPrice:oPrice,sPrice:sPrice,specs:specs,category:category,contact:contact,email:email,images:[NewfileName],customers: [""],acceptedTo: "",};

      postData('http://localhost:4000/getAll', myData)
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error(error);
      });
    }
    catch(Error)
    {
        console.log("file was not uploaded")
    }

    async function postData(url = '', data = {}) {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        return response.json();
      }

    res.status(200).json({ message: 'File uploaded successfully.' });
  });
}

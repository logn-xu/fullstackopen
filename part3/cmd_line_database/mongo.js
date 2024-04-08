const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb://fullstack:${password}@10.182.32.36:27017/phoneBook?retryWrites=true`;

mongoose.set("strict", false);

mongoose.connect(url);

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const PhoneBook = mongoose.model("PhoneBook", phoneBookSchema);

if (process.argv.length === 3) {
  console.log("show all phone");
  PhoneBook.find({}).then((result) => {
    result.forEach((phone) => {
      console.log(phone);
    });
    mongoose.connection.close();
  });
} else if (process.argv < 5) {
  console.log("Usage: node mongo.js [password] [name] [number]");
  process.exit(1);
} else {
  const phone = new PhoneBook({
    name: process.argv[3],
    number: process.argv[4],
  });

  phone.save().then((result) => {
    console.log(`added ${phone.name} number ${phone.number} to phonebook`);
    console.log(result);
    mongoose.connection.close();
  });
}

console.log(process.env.MONGODB_URI)
console.log(process.env.SECRET)
module.exports = {
  address: "https://niilorganize-76544a0e5363.herokuapp.com/",
  database: `${process.env.MONGODB_URI}/niilorganize`,
  secret: process.env.SECRET
};

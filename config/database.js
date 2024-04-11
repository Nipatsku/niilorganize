// module.exports = {
//   address: "192.168.1.169:3000",
//   database: "mongodb://127.0.0.1:27017/niilorganize",
//   secret: 'ascd3qda3a3fc213123da3d3aw3daw3a321312367869568f'
// };
module.exports = {
  address: "https://niilorganize-76544a0e5363.herokuapp.com",
  database: `${process.env.MONGODB_URI}/niilorganize`,
  secret: process.env.SECRET
};

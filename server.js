const Sequelize = require('sequelize');
const sequelize = new Sequelize (process.env.DATABSE_URL || 'postgres://localhost/sequelize_practice_feb_18')

const express = require('express')
const app = express();
const port = process.env.PORT || 3000;

const UUID = Sequelize.DataTypes.UUID;
const UUIDV4 = Sequelize.DataTypes.UUIDV4;
const STRING = Sequelize.DataTypes.STRING

const Books = sequelize.define('book', {
    name: {
        type: STRING,
        allowNull: false ,
        unqiue: true ,
        validate: {
            notEmpty: true ,
        }},
    id: {
            type: UUID,
            primaryKey: true,
            defaultValue: UUIDV4,
          },
     category: {

        type: Sequelize.ENUM('children','fiction', 'adult fiction'),
        defaultValue:'fiction'
     }   
    

        })

Books.belongsTo( Books, { as: "parent" } );
Books.hasMany(Books, {as: "children", foreignKey: 'parentId'})

Books.findFictionBook = function() {
    return this.findAll( {
        where: {
            category: "fiction"

        }
    })


}

const start = async () => {
try     {    
    console.log('data is seeded') 
    await sequelize.sync({force:true});
    const Harry1 = await Books.create({name: "Harry Potter 1st Book", category:"children"});
    const Harry2 = await Books.create({name: "Harry Potter 2nd Book", parentId: Harry1.id, category: "fiction"});
    const Harry3 = await Books.create({name: "Harry Potter 3rd Book", parentId: Harry2.id, category: "adult fiction"});
    
    
    }
catch(ex) {
    console.log(ex)
    }   
}

start();



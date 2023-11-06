const mongoose = require("mongoose");
const dogs = require('./dogs');
const owners = require('./owners');

const URL = "mongodb://127.0.0.1:27017/test-db";

// Preparación para no usar schemas con mongo (no recomendado)
mongoose.set('strict', false);
mongoose.set('strictQuery', false);
mongoose.set('strictPopulate', false);
// --------------

mongoose
  .connect(URL)
  .then(() => {
    console.log("Conectado a la base de datos test-db!");
  })
  .catch((err) => {
    console.log(`Error en la base de datos -> ${err}`);
  });


// Crear modelo (nombre en mayúsculas y singular)

const emptySchema = new mongoose.Schema({});
const Dog = mongoose.model('Dog', emptySchema);
const Owner = mongoose.model('Owner', emptySchema);

// Business Logic
const main = async () => {
    try {
        
        // CREATE (y guarda) un solo elemento en la base de datos:
        /* 
        
        const newDog = new Dog({
                name: 'Tambor',
                type: 'Pug',
            });
            
            await newDog.save();
            console.log('El elemento se ha guardado correctamente');
        */
    
        // CREATE (y guarda) varios elementos al mismo tiempo:
        /* 
        const savedDogs = await Dog.insertMany(dogs);
        
        console.log(savedDogs);
        console.log('Los elementos se han guardado correctamente');
        */
        
        // GET todos los elementos en un array de documentos de mongo ( .lean() para convertir a array de JSONs -> más ligero)
        /* 
        const arrDogs = await Dog.find().lean(); // Array de todos los JSONs 
        const arrDogsFiltered = await Dog.find({
            name: { $regex: /e/i } // Filtrando por contenido en el name
            // type: 'Pug', // Cuidado con las mayúsculas!!!
        }); // Array de JSONs filtrados por sus propiedades
        console.log(arrDogsFiltered);
        */

        // GET un solo elemento en documento de mongo ( + .lean()) filtrado
        /* 
        const dogWithLengthNameLessThanFive01 = await Dog.findOne().where('name', /^\w{1,5}$/ig).lean()
        const dogWithLengthNameLessThanFive02 = await Dog.findOne({ name: { $regex: /^\w{1,5}$/ig } }).lean().sort({type: -1})
        const dogById = await Dog.findById('6545f6430db064d73569e8c1').lean()
        console.log(dogById)
        */

        // DELETE uno o varios elementos
        /* 
        await Dog.deleteOne({ name: { $regex: /[^ea]/gi } }) // Uno, sin gettearlo, devolvería la cuenta de elementos borrados
        await Dog.deleteMany({ name: { $regex: /[^ea]/gi } }) // Varios, sin gettearlos, devolvería la cuenta de elementos borrados
        const getAndDeleteOne = await Dog.findOneAndDelete({ name: { $regex: /[^ea]/gi } }).lean() // Uno, tras gettearlo = más info sobre lo borrado
        const getByIdAndDeleteOne = await Dog.findByIdAndDelete('6545f6430db064d73569e8c1').lean().sort({name: -1}) // Uno, tras gettearlo = más info sobre lo borrado
        
        console.log(getAndDeleteOne)
        */

        // UPDATE un elemento
        /* 
        // await Dog.updateMany();
        await Dog.updateOne({ _id: '6545f6430db064d73569e8c1' }, { age: 4 });
        // const getOneAndUpdate = await Dog.findOneAndUpdate({ _id: '6545f6430db064d73569e8c1' }, {age: 6, likes: ['playing']}, {new: true}).lean();
        // const getOneByIdAndUpdate = await Dog.findByIdAndUpdate('6545f6430db064d73569e8c1', {age: 9, likes: ['food']}, {new: true}).lean();
        //// "{new: true}" indica que el elemento Getteado será el actualizado
        await Dog.updateOne({ _id: '6545f6430db064d73569e8c1' }, { $push: { likes: 'playing' } }); //$push empuja un elemento al final del array
        await Dog.updateOne({ _id: '6545f6430db064d73569e8c1' }, { $push: { likes: { %each: ['swimming', 'running'] }  } }); //$each empuja cada uno de los valores que pasemos en un array
        await Dog.updateOne({ _id: '6545f6430db064d73569e8c1' }, { $addToSet: { likes: { %each: ['swimming', 'running'] }  } }); // $addToSet añade comprobando que no se repitan
        await Dog.updateOne({ _id: '6545f6430db064d73569e8c1' }, { $pull: { likes: 'playing' } }); //$pull elimina un elemento al final del array
        await Dog.updateOne({ _id: '6545f6430db064d73569e8c1' }, { $pullAll: { likes:  ['swimming', 'running'] } }); //$pullAll elimina los elementos que le indiquemos, si no existe alguno, se eliminan los que existan
        await Dog.updateOne({ _id: '6545f6430db064d73569e8c1' }, { $set: { owner: { surname: 'Castillo' } } }); //$set settea un objeto entero
        await Dog.updateOne({ _id: '6545f6430db064d73569e8c1' }, { $set: { owner: { name: 'Christian' } } }); //$set aquí daria un error al eliminar el surname y solo dejar el name
        await Dog.updateOne({ _id: '6545f6430db064d73569e8c1' }, { $set: { 'owner.surname': 'Castillo' } }); // si le indicamos un campo específico, no hay problema

        // Si se repitiese un valor, por ejemplo, el mismo owner en muchos elementos, podríamos crear una tabla y relacionar las dos tablas por ejemplo por la ID del perro y la del owner
        */
        
        // Relations (relaciones entre tablas/modelos) -> .populate
        /* 
        
        // 1:N
        const dogs = await Owner.findOne({name: 'Juanma'}) // primero busca un elemento, y dentro de él,
        .populate({
            path: 'pets', 
            model: 'Dog', 
            select: {
                _id: true,
                name: true, 
                type: true,
            } // populate relaciona un modelo con otro 
            // -> apuntando al path (camino que lleva a la parte del objeto donde está la Key única), 
            // -> allí generará por cada entrada un modelo tipo model
            // -> en el que obtendrá las diferentes partes seleccionadas con select del modelo al que llama y relaciona por medio de esas Keys únicas, 
        }).lean();
        
        console.log(dogs);
        
        // 1:1
        const owners = await Dog.find()
        .populate({
            path: 'owner', 
            model: Owner, 
            select: {
                _id: true, 
                name: true, 
                surname: true,
            }
        }).lean();
        
        console.log(owners);
        */

        
    } catch (err) {
        console.error('Error creating the element in DB ->', err)
    }
};

main();
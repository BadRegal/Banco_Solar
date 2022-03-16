const express = require('express')
const {  agregar, consultar, modificar, eliminar, transferencia, get_transferencias} = require('./db.js')

const app = express()


app.use(express.static('static'))
/* app.use(express.urlencoded({ extended: false })) */
 

app.get('/', (req, res) => {
    console.log('/usuarios')
    res.send('Hola')

})
app.get('/transferencia', async (req, res) => {
    res.json([])
})

app.post('/usuario', (req, res) => {
    let body=''
    req.on('data', (data) => body +=data)
    req.on('end', async ()  =>{
        body= JSON.parse(body)
        try{
            await agregar (body.nombre, body.balance)
        } catch (error){
            if(error.code == '23505'){
                res.status(400).send('Este nombre ya existe en base de datos, ingrese otro')
            }
        }
        res.status(201).json({todo:'ok'})
        })
    })

app.get('/usuarios', async (req, res) => {
    try{
        const usuarios = await consultar()
        res.json(usuarios)
    } catch(error) {
        if(error.code == '23502'){
            return res.status(400).send({mensaje: 'solo debe ingresar valores numericos en Balance'})
        }
    }
})

app.put('/usuario', async (req, res)  => {
    try{
        let body=''
        req.on('data', (data) => body +=data)
        req.on('end', async ()  =>{
            body= JSON.parse(body)
            console.log(body);
            await modificar (req.query.id, body.name, body.balance)
            res.status(200).json({todo:'ok'})      
        })
        } catch (error){
            if (error.code == '23503'){
                return res.sendStatus(400).send({mensaje: 'No se puede modificar al usuario que realizo una transferencia'})
            }
            }
        })

app.delete('/usuario', async (req, res) => {
    try{
        let id = req.query.id
        await eliminar(id)
    } catch (error){ 
        if(error.code == '23503'){
            return res.status(400).send({mensaje:'No puede eliminar un usuario que hizo una transferencia'})
        }
    }
    res.json({todo:'ok'})
})

app.post('/transferencia', async (req,res)=>{
    let body =''
    req.on('data', data => body += data)
    req.on('end', async () => {
        try{
            body = JSON.parse(body)
            console.log(body)
            await transferencia(body.emisor,body.receptor,body.monto)     
            res.json({todo: 'ok'})
        } catch (error) {
            console.log('El error de la trsnferencia es: ' + error)
            return res.status(400).send({mensaje: 'Debe colocar un valor numero en el monto de tranferencia'})
        }
    })
})

app.get('/transferencias', async (req, res) => {
    try{
        const transferencia = await get_transferencias()
        res.send(JSON.stringify(transferencia))
    } catch (error) { 
        if(error.code == '23502'){
            return res.status(400).send({mensaje: ' Debe seleccionar un distinto emisor y receptor'})
        }
        res.send({todo:'ok'})
    }
})


app.listen(3000, () => console.log('Servidor en puesto 3000')) 
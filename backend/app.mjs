import express from 'express'
import cors from 'cors'
import fs from 'fs'

const app = express()
app.use(cors())
app.use(express.json())

const obtenerCanciones = () => {
	const data = fs.readFileSync('repertorio.json', 'utf-8')
	const canciones = JSON.parse(data)
	return canciones
}

const guardarCanciones = (canciones) => {
	fs.writeFileSync('repertorio.json', JSON.stringify(canciones, null, 2))
}

app.get('/canciones', (req, res) => {
	try {
		const canciones = obtenerCanciones()
		res.json(canciones)
	} catch {
		res.status(500).json({ error: 'Error al obtener las canciones' })
	}
})

app.post('/canciones', (req, res) => {
	try {
		const { id, titulo, artista, tono } = req.body
		const canciones = obtenerCanciones()

		if (!titulo || !artista || !tono) {
			return res.status(400).json({error: 'Faltan campos obligatorios'})
		 }

		const cancion = req.body
		canciones.push(cancion)

		guardarCanciones(canciones)
		res.send('Canción agregada con éxito')
	} catch {
		res.status(500).json({ error: 'Error al agregar cancion' })
	}
})

app.put('/canciones/:id', (req, res) => {
	try {
		const { id } = req.params
		const cancion = req.body
	
		const canciones = obtenerCanciones()
		const index = canciones.findIndex(c => c.id === parseInt(id))

		if (index === -1) {
			return res.status(404).json({error: 'Cancion no encontrada'})
		}

		canciones[index] = { ...cancion, id: parseInt(id) }
	
		guardarCanciones(canciones)
		res.send('Canción modificada')
	} catch {
		res.status(500).json({error: 'Error al modificar cancion'})
	}
})

app.delete('/canciones/:id', (req, res) => {
	try {
		const { id } = req.params
		const canciones = obtenerCanciones()
		const index = canciones.findIndex(c => c.id === parseInt(id))

		if (index === -1) {
			return res.status(404).json({error: 'Cancion no encontrada'})
		}

		canciones.splice(index, 1)

		guardarCanciones(canciones)
		res.send('Cancion eliminada exitosamente')
	} catch {
		res.status(500).json({error: 'Error al eliminar cancion'})
	}
})

app.listen(3000, () => {
	console.log('Servidor corriendo en puerto 3000');
})
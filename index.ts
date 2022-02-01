import cors from 'cors'
import express, { Request, Response } from 'express'
import axios from 'axios'
import { StackAPIResponse, SvgDetails, StackTags } from './types'
import { formatSvg } from './lib/formatSvg'
import { join } from 'path'
import { Themes } from './lib/themes'

const app = express()

app.use(cors())
app.use(express.static(join(__dirname, 'public')))

app.get('/user/:id', async (req: Request, res: Response) => {
	const { id } = req.params

	const user = `https://api.stackexchange.com/2.3/users/${id}?site=stackoverflow&key=U4DMV*8nvpm3EOpvf69Rxw((`
	const result = await axios.get(user, { method: 'GET' })

	const tags = `https://api.stackexchange.com/2.3/users/${id}/tags?order=desc&sort=popular&site=stackoverflow`
	const tagsResult = await axios.get(tags, { method: 'GET' })

	const userData: StackAPIResponse = result.data

	const tagsData: Array<StackTags> = tagsResult.data.items

	const svg = await formatSvg(
		userData.items[0] as SvgDetails,
		tagsData,
		Themes.SUNSET
	)

	res.header('Content-Type', 'image/svg+xml')

	res.status(200).send(svg)
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(`Server listening: ${PORT}`)
})

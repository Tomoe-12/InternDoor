import { createRouteHandler } from "uploadthing/next"

import { ourFileRouter } from "./core"

// Provide token via config to avoid missing env issues
export const { GET, POST } = createRouteHandler({
	router: ourFileRouter,
	config: {
		token: process.env.UPLOADTHING_TOKEN,
	},
})

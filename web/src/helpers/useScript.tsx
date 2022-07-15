import { useState, useEffect } from 'react'

interface Library {
	[key: string]: unknown
}

export interface CustomWindow extends Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}
const useScript = (url: string, name: string): Library => {
	const [lib, setLib] = useState({})

	useEffect(() => {
		const script = document.createElement('script')

		script.src = url
		script.async = true
		script.onload = () => setLib({ [name]: (window as CustomWindow)[name] })

		document.body.appendChild(script)

		return () => {
			document.body.removeChild(script)
		}
	}, [url])

	return lib
}

export default useScript

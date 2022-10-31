import { useEffect, useState } from 'react'

const useImage = (fileName: string) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<null | string>(null)
    // @todo implement a fallback image
    const [image, setImage] = useState('')

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await import(`../assets/images/${fileName}`)
                setImage(response.default)
            } catch (e) {
                if (typeof e === "string") return setError(e)
                if (e instanceof Error) return setError(e.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchImage()
    }, [fileName])

    return {
        isLoading,
        error,
        image,
    }
}

export default useImage
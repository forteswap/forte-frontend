import useImage from "../../hooks/useImage";

export default function TokenImage({
    src,
    height,
    width,
}: {
    src: string
    height?: number,
    width?: number
}) {
    const TOKEN_IMAGE_PATH_SLUG = 'tokens'
    const HEIGHT = height || 35
    const WIDTH = width || 35

    const {image} = useImage(`${TOKEN_IMAGE_PATH_SLUG}/${src}`)

    return (
        <img src={image} alt={'Token image'} height={HEIGHT} width={WIDTH} />
    )
}

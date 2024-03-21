import Image from 'next/image'

export default function ImageBackgorund() {
    return (
        <Image
            alt="Mountains"
            src="./monumen-tanjung-puri.jpeg"
            // placeholder="blur"
            quality={100}
            fill
            sizes="100vw"
            style={{
                objectFit: 'cover',
            }}
        />
    )
}

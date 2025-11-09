import 'react-lazy-load-image-component/src/effects/blur.css'

import React from 'react'
import {
  LazyLoadImage,
  LazyLoadImageProps,
} from 'react-lazy-load-image-component'

type Props = {
  alt: string
  src: string
  className?: string
  width?: number | string
  height?: number | string
} & LazyLoadImageProps

const LazyImage: React.FC<Props> = ({ alt, src, className, width, height, ...props }) => {
  const LazyImageComponent = LazyLoadImage as any
  return (
    <LazyImageComponent
      alt={alt}
      effect="blur"
      src={src}
      className={className}
      width={width || '100%'}
      height={height || ''}
      {...props}
    />
  )
}

export default LazyImage

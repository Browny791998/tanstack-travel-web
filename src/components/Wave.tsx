interface WaveProps {
  className?: string
  fillColor?: string
  height?: number
}

export default function Wave({ 
  className = '', 
  fillColor = '#1e3a5f',
  height = 100 
}: WaveProps) {
  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ display: 'block' }}
        role="img"
        aria-labelledby="wave-title"
      >
        <title id="wave-title">Decorative wave transition</title>
        <path
          fill={fillColor}
          fillOpacity="1"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </div>
  )
}

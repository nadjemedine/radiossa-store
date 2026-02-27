import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Radiossa Clothing';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '0 0 20px 0',
          }}
        >
          Radiossa Clothing
        </h1>
        <p
          style={{
            fontSize: '24px',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          أفضل الملابس العصرية في الجزائر
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
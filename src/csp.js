export const getCSP = (envVariables) => {
  const {
    VITE_HOST,
    VITE_LEARNER_AI_BASE_URL,
    VITE_AWS_S3_BUCKET_CONTENT_URL,
    VITE_AWS_S3_BUCKET_URL,
    VITE_CSP_APP_HOST,
  } = envVariables;

  return `
      default-src 'none';
      manifest-src 'self';
      script-src 'self' blob: https://cdn.jsdelivr.net ;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.cdnfonts.com/;
      font-src 'self' https://fonts.gstatic.com https://fonts.cdnfonts.com;
      img-src 'self' data: https://raw.githubusercontent.com https://cdn.jsdelivr.net https://images.squarespace-cdn.com ${VITE_AWS_S3_BUCKET_CONTENT_URL} ${VITE_AWS_S3_BUCKET_URL};
      media-src 'self' blob: ${VITE_AWS_S3_BUCKET_URL} ${VITE_AWS_S3_BUCKET_CONTENT_URL} https://raw.githubusercontent.com ;
      connect-src 'self' https://unpkg.com ${VITE_HOST} ${VITE_LEARNER_AI_BASE_URL} blob:;
      form-action 'self';
      frame-src 'self' https://www.google.com https://www.gstatic.com;
      object-src 'none';
      base-uri 'none';
    `;
};

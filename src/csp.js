const GetCsp = (envVariables) => {
  const { REACT_APP_AWS_S3_BUCKET_CONTENT_URL, REACT_APP_AWS_S3_BUCKET_URL } =
    envVariables;

  return `
      default-src 'self';
      script-src 'self' 'unsafe-eval'
        https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js;
      script-src-elem 'self' 'unsafe-eval';
      style-src 'self' 'unsafe-inline'
        https://fonts.googleapis.com
        https://fonts.cdnfonts.com;
      style-src-elem 'self' 'unsafe-inline' 
        https://fonts.googleapis.com
        https://fonts.cdnfonts.com
        https://www.gstatic.com;
      font-src 'self'
        https://fonts.googleapis.com 
        https://fonts.cdnfonts.com 
        https://fonts.gstatic.com;
      img-src 'self' data: blob:
        https://images.squarespace-cdn.com 
        https://raw.githubusercontent.com 
        https://cdn.jsdelivr.net
        https://github.com
        https://placehold.co
        ${REACT_APP_AWS_S3_BUCKET_CONTENT_URL}
        ${REACT_APP_AWS_S3_BUCKET_URL};
      media-src 'self' blob:
        https://raw.githubusercontent.com
        https://github.com
        ${REACT_APP_AWS_S3_BUCKET_CONTENT_URL}
        ${REACT_APP_AWS_S3_BUCKET_URL};
      connect-src 'self' blob:
        http://localhost:3000
        ws://localhost:* 
        ws://127.0.0.1:*
        https://www.google.com
        *.theall.ai 
        https://huggingface.co 
        https://cas-bridge.xethub.hf.co 
        https://cdn.jsdelivr.net
        ${REACT_APP_AWS_S3_BUCKET_URL}
        ${REACT_APP_AWS_S3_BUCKET_CONTENT_URL};
      form-action 'self';
      object-src 'none';
      base-uri 'self';
      manifest-src 'self';
      frame-src 'self' 
        https://www.google.com
        https://www.gstatic.com
        https://www.youtube.com
        https://www.youtube-nocookie.com;
      worker-src 'self' blob: 
        https://d114esnbvw5tst.cloudfront.net;
    `;
};

export default GetCsp;

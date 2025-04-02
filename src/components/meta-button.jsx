import { Helmet } from 'react-helmet';

// Composant MetaButton



const MetaButton = ({description, title, image, url}) => {

  return (
    <div>
      <Helmet>
        {/* Balises meta génériques */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* SEO Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} /> 
        
        {/* Open Graph Meta Tags (pour Facebook et autres réseaux sociaux) */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:url" content={url} />
      </Helmet>

      <h1>{title}</h1>
      <p>{description}</p>
      <img src={image} alt="Image de la page" />
    </div>
  );
};

export default MetaButton;

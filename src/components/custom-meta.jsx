import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const CustomMeta = ({ component: Component, description, image, title, url, ...props }) => {
    return (
        <>
            <Helmet>
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={image} />
                <meta property="og:url" content={url} />
                <meta property="og:type" content="website" />
            </Helmet>
            <Component {...props} />
        </>
    );
};

CustomMeta.propTypes = {
    component: PropTypes.elementType.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
};

export default CustomMeta;
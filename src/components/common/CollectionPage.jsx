import React from "react";
import CollectionsList from "./CollectionsList";
import { appStyles } from "../../styles/layoutStyles.style";

const CollectionPage = ({ collectionId, title, description }) => {
  return (
    <>
      <div style={appStyles.pageHeader}>
        <h2 style={appStyles.pageTitle}>{title}</h2>
        <p style={appStyles.pageDescription}>{description}</p>
      </div>
      <CollectionsList collectionId={collectionId} />
    </>
  );
};

export default CollectionPage;

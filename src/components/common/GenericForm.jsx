import React from "react";
import PerkForm from "../../pages/PerkForm";

const GenericForm = ({ collectionId, collectionName }) => {
  return (
    <PerkForm collectionId={collectionId} collectionName={collectionName} />
  );
};

export default GenericForm;

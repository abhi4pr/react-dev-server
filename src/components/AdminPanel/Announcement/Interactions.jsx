import React from "react";

const Interactions = ({ announcement, reactionTypes, reactionObj, interactedReaction }) => {
  const updateReactionCounts = (reactionTypes, interactedReaction) => {
    let updatedReactionsCount = { ...announcement.reactionsCount };
    // Copy the initial reactions count object


    // Iterate over each reaction type
    reactionTypes.forEach((reactionType) => {
      // If the reaction type matches the interacted reaction and it's not removed, increment the count
      if (interactedReaction.type !== "" && interactedReaction.prevtype === "") {
        if (interactedReaction.isIntracted && interactedReaction.isRemoved) {

          if (reactionType === interactedReaction.type) {
            updatedReactionsCount[reactionType]++;
          }



        } else if (interactedReaction.isIntracted && !interactedReaction.isRemoved) {
          if (reactionType === interactedReaction.type) {
            updatedReactionsCount[reactionType]++;
          }
          if (interactedReaction.prevtype === reactionType) {
            updatedReactionsCount[reactionType]--;
          }
        }
        else if (interactedReaction.isRemoved && !interactedReaction.isIntracted) {
          if (reactionType === interactedReaction.type) {
            updatedReactionsCount[reactionType];
          }


        }
      }
      else {
        if (interactedReaction.isIntracted && interactedReaction.isRemoved) {

          if (reactionType === interactedReaction.type) {
            updatedReactionsCount[reactionType]++;
          }

          if (interactedReaction.prevtype === reactionType && updatedReactionsCount[reactionType] > 0) {
            updatedReactionsCount[reactionType]--;
          }

        } else if (interactedReaction.isIntracted && !interactedReaction.isRemoved) {
          if (reactionType === interactedReaction.type) {
            updatedReactionsCount[reactionType];
          }
        }
        else if (interactedReaction.isRemoved && !interactedReaction.isIntracted) {
          if (reactionType === interactedReaction.type) {
            updatedReactionsCount[reactionType]--;
          }


        }
      }


    });
    return updatedReactionsCount;
  };
  let updatedReactionsCount = updateReactionCounts(reactionTypes, interactedReaction);
  return (
    <>
      <p className="bold">Interactions</p>
      <br />

      <div className="d-flex flex-row " style={{ gap: "50px" }}>
        {reactionTypes.map((reactionType, index) => (
          <div
            key={index}
            className="d-flex flex-column"
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <h5>{reactionObj[reactionType]}</h5>
            <p className="rec-com">
              {
                updatedReactionsCount[reactionType]
              }</p>
          </div>
        ))}

      </div>
    </>
  );
};

export default Interactions;

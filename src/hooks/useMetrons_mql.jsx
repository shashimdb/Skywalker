import React from "react";
import { useWatch } from "./useWatch";
import { useCollection } from "./useCollection";
import { useApp } from "../RealmApp";
import atlasConfig from "../atlasConfig.json";
import {
  addValueAtIndex,
  replaceValueAtIndex,
  updateValueAtIndex,
  removeValueAtIndex,
  getTodoIndex,
} from "../utils";

const { dataSourceName } = atlasConfig;

export function useMetrons() {
  // Set up a list of todos in state
  const app = useApp();
  const [todos, setTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Get a client object for the todo item collection
  const todoItemCollection = useCollection({
    cluster: dataSourceName,
    db: "SizingAtlas",
    collection: "Users",
  });

  // Get a client object for the todo item collection
  const SizingAtlasDevCollection = useCollection({
    cluster: dataSourceName,
    db: "metron",
    collection: "sizings",
  });

  // Get a client object for the todo item collection
  const SizingAtlasOppCollection = useCollection({
    cluster: dataSourceName,
    db: "prism",
    collection: "opp",
  });

  const SizingAtlasAcctCollection = useCollection({
    cluster: dataSourceName,
    db: "prism",
    collection: "acct",
  });



  const search = async (query) => {

    if (query) {
      try {
        const pipeline = [
          {
            "$search": {
              "index": "acct_nm_autocomplete",
              "autocomplete": {
                "query": query,
                "path": "accountName",
                "fuzzy": {
                  "maxEdits": 2,
                  "prefixLength": 3
                }
              }
            }
          },
          {
            "$project": {
              "accountName": 1,
              "opportunityNo": 1
            }
          },
          {
            "$limit": 10
          }
        ];


        const response = await SizingAtlasDevCollection.aggregate(pipeline);

        return response;
      } catch (err) {
        if (err.error.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that this app tried to insert a todo multiple times (i.e. an existing todo has the same _id). In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }

    }
  }

  const findOppo = async (acctName) => {

    if (acctName) {
      try {
        const pipeline = [
          {
            $search: {
              index: "acct_nm_autocomplete",
              autocomplete: {
                query: acctName,
                path: "nm",
                fuzzy: {
                  maxEdits: 2,
                  prefixLength: 4,
                },
              },
            },
          },
          {
            $match: {
              deleted: false,
            },
          },
          {
            $lookup: {
              from: "opp",
              localField: "_id",
              foreignField: "acctId",
              as: "opportunity",
            },
          },
          {
            $match: {
              opportunity: { $ne: [] } 
            }
          },
          {
            $project: {
              nm: 1,
              opportunity: 1,
            },
          },
        ];


        const response = await SizingAtlasAcctCollection.aggregate(pipeline);

        return response;
      } catch (err) {
        if (err.error.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that this app tried to insert a todo multiple times (i.e. an existing todo has the same _id). In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }

    }
  }


  const fetchworkloads = async (filterData) => {

    if (filterData) {
      try {
        const pipeline = [
          {
            $match:
            {
              accountName: filterData.accountName,
              opportunityNo: filterData.opportunityNo,
            },
          },
          {
            $group: {
              _id: {
                workLoadType: "$workLoadType",
                workLoadName: "$workLoadName",
                cloudProvider: "$cloudProvider",
                accountName: "$accountName",
                opportunityNo: "$opportunityNo",
              },
            },
          },
          {
            $project: {
              _id: 0,
              workLoadType: "$_id.workLoadType",
              workLoadName: "$_id.workLoadName",
              cloudProvider: "$_id.cloudProvider",
              accountName: "$_id.accountName",
              opportunityNo: "$_id.opportunityNo",
            },
          },
        ];


        const response = await SizingAtlasDevCollection.aggregate(pipeline);

        return response;
      } catch (err) {
        if (err.error.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that this app tried to insert a todo multiple times (i.e. an existing todo has the same _id). In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }

    }
  }

  // Given a draft todo, format it and then insert it
  const saveTodo = async (draftTodo) => {
    if (draftTodo) {
      try {
        // await todoItemCollection.insertOne(draftTodo);
      } catch (err) {
        if (err.error.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that this app tried to insert a todo multiple times (i.e. an existing todo has the same _id). In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }
    }
  };

  // Given a draft todo, format it and then insert it
  const insertDoc = async (insertData) => {
    if (insertData) {
      try {
        await SizingAtlasDevCollection.insertOne(insertData);
      } catch (err) {
        if (err.error.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that this app tried to insert a todo multiple times (i.e. an existing todo has the same _id). In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }
    }
  };

  // Given a draft todo, format it and then insert it
  const updateDoc = async (filterData, setData) => {
    if (filterData && setData) {
      try {

        // Define the filter to find the document to update
        const filter = filterData;// Example filter to find a document with a specific _id

        // Define the update operation to set new values for the document
        const update = {
          $set: setData
        };

        // Optional: Additional options such as upsert, write concern, etc.
        const options = {
          // Example options
          upsert: false,
          // Add more options as needed
        };

        // Update the document matching the filter with the new values
        await SizingAtlasDevCollection.updateOne(filter, update, options)
          .then(updateResult => {
            console.log("Document updated successfully:", updateResult);
          })
          .catch(error => {
            console.error("Error updating document:", error);
          });

      } catch (err) {
        if (err.error.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that this app tried to insert a todo multiple times (i.e. an existing todo has the same _id). In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }
    }
  };

  // Given a draft todo, format it and then insert it
  const deleteDoc = async (filterData) => {
    if (filterData) {
      try {

        // Define the filter to find the document to delete
        const filter = filterData; // Example filter to find a document with a specific _id

        // Optional: Additional options such as write concern, etc.
        const options = {
          // Example options
          writeConcern: { w: "majority" }
          // Add more options as needed
        };

        // Delete the document matching the filter
        SizingAtlasDevCollection.deleteOne(filter, options)
          .then(deleteResult => {
            console.log("Document deleted successfully:", deleteResult);
          })
          .catch(error => {
            console.error("Error deleting document:", error);
          });

      } catch (err) {
        if (err.error.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that this app tried to insert a todo multiple times (i.e. an existing todo has the same _id). In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }
    }
  };


  // Given a draft todo, format it and then insert it
  const readDoc = async (filterData) => {
    return new Promise((resolve, reject) => {
      if (filterData) {
        try {
          // Define the filter to narrow down the documents to retrieve
          const filter = filterData;


          // Optional: Define sort order for the result
          const sort = {
            dateField: 1 // Sort by field1 in ascending order
            // Add more sort criteria as needed
          };

          // Optional: Define options such as limit, skip, etc.
          const options = {
            limit: 10, // Maximum number of documents to retrieve
            skip: 0, // Number of documents to skip
            sort // Include sort order defined earlier
            // Add more options as needed
          };

          // Find documents matching the filter with optional projection, sort, and options
          SizingAtlasDevCollection.find(filter, options)
            .then(docs => {
              console.log("Documents found:", docs);
              resolve(docs);
            })
            .catch(error => {
              console.error("Error finding documents:", error);
              reject(error);
            });
        } catch (err) {
          if (err.error.match(/^Duplicate key error/)) {
            console.warn(
              `The following error means that this app tried to insert a todo multiple times (i.e. an existing todo has the same _id). In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
            );

          }
          console.error(err);
          reject(err);
        }
      } else {
        resolve([]);
      }
    });
  };



  // Given a draft todo, format it and then insert it
  const fetchLatestSizing = async (filterData) => {

    if (filterData) {
      try {
        const pipeline = [
          {
            $match: filterData,
          },
          {
            $sort: {
              dateField: -1,
            },
          },
          {
            $project: {
              accountName: 1,
              opportunityNo: 1,
              dateField: 1,
              cloudProvider: 1,
              workLoadName: 1,
              workLoadType: 1,
              user: 1,
            },
          },
          {
            $limit: 25,
          },
        ];


        const response = await SizingAtlasDevCollection.aggregate(pipeline);

        return response;
      } catch (err) {
        if (err.error.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that this app tried to insert a todo multiple times (i.e. an existing todo has the same _id). In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }

    }
  };

  // Delete a given todo
  const deleteTodo = async (todo) => {
    await todoItemCollection.deleteOne({ _id: todo._id });
  };

  return {
    loading,
    todos,
    saveTodo,
    deleteTodo,
    fetchLatestSizing,
    findOppo,
    search,
    insertDoc,
    updateDoc,
    deleteDoc,
    readDoc,
    fetchworkloads,
  };
}
